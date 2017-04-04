BUILD.matrix = function () {

    function  matrix(grid, nbSub) {


        this.grid = grid;

        this.matrix = [];

        this.size = {
            bloc: {
                x: 0,
                y: 0,
            }
        }

        if (nbSub) {
   
            var curve = 0.75;
            var diff = 0.25;
            var result = new Array();
            var sub = Math.pow(2, nbSub) - 1;
            this.x = 1 + (this.grid.x - 1) * (1 + sub);
            this.y = 1 + (this.grid.y - 1) * (1 + sub);
            this.size.bloc.x = (this.grid.size.x / (this.x)) + this.grid.size.bloc.x / 2;
            this.size.bloc.y = (this.grid.size.y / (this.y)) + this.grid.size.bloc.y / 2;
            
            for (var i = 0; i < this.x; i++) {
                result[i] = new Array();
                for (var j = 0; j < this.y; j++) {
                    var hauteur = 0;
                    var position = new THREE.Vector3(0, 0, 0);
                    // ADD HEIGHT 
                    if (j % (1 + sub) === 0 && i % (1 + sub) === 0) {
                        hauteur = this.grid.grid[i / (1 + sub)][j / (1 + sub)];
                    }
                    position.z = hauteur;
                    position.x = this.size.bloc.x * (i - this.x / 2);
                    position.y = -this.size.bloc.y * (j - this.y / 2);
                    result[i][j] = position;
                }
            }
            var nbSubTemp = nbSub;
            var diffraction = diff / nbSub;

            // SMOOTH SUB

            for (var s = 0; s < nbSub; s++) {
                var courbe = curve - diffraction;
                sub = Math.pow(2, nbSubTemp) - 1;
                var step = (sub + 1);
                nbSubTemp--;
                for (var i = 0; i < this.x; i += step / 2) {
                    for (var j = 0; j < this.y; j += step / 2) {
                        var x = j % (1 + sub);
                        var y = i % (1 + sub);
                   
                        var pY = Math.floor(i / (1 + sub));
                        var pX = Math.floor(j / (1 + sub));
                        if (x === 0 && y === step / 2) {
                            var A = result[pY * step][pX * step];
                            var B = result[(pY + 1) * step][pX * step];
                            result[i][j].z = (B.z + ((A.z - B.z) * courbe));
                        }
                        if (x === step / 2 && y === 0) {
                            var A = result[pY * step][pX * step];
                            var B = result[pY * step][(pX + 1) * step];
                            result[i][j].z = (B.z + ((A.z - B.z) * courbe));
                        }
                        if (x === step / 2 && y === step / 2) {
                            var A = result[(pY + 1) * step][pX * step];
                            var B = result[pY * step][(pX + 1) * step];
                            var C = result[pY * step][(pX) * step];
                            var D = result[(pY + 1) * step][(pX + 1) * step];
                            var courbeT = courbe - 2 * diffraction;
                            result[i][j].z = ((B.z + ((A.z - B.z) * courbeT)) + (C.z + ((D.z - C.z) * courbeT))) / 2;
                        }
                    }
                }
            }
           
            this.matrix = result;
        } else {

            /**
             *  TODO 
             */
        }

    }
    // MATCH THE POSITION Z
    matrix.prototype.returnZ = function (position) {
        var x = Math.floor(position.x / this.size.bloc.x + this.x / 2);
        var y = Math.floor(-position.y / this.size.bloc.y + this.y / 2);
        if (x <= this.x && y <= this.y && x >= 0 && y >= 0) {
            var xDiff = (this.x / 2 * this.size.bloc.x + position.x) % this.size.bloc.x;
            var yDiff = (this.y / 2 * this.size.bloc.y - position.y) % this.size.bloc.y;
            if (xDiff + yDiff < (this.size.bloc.x + this.size.bloc.y)/2) { 
                var A = this.matrix[x][y];
                var B = this.matrix[x][y + 1];
                var C = this.matrix[x + 1][y];
            } else {
                var A = this.matrix[x][y + 1];
                var B = this.matrix[x + 1][y];
                var C = this.matrix[x + 1][y + 1];
            }
            var AB = new THREE.Vector3(B.x - A.x, B.y - A.y, B.z - A.z);
            var AC = new THREE.Vector3(C.x - A.x, C.y - A.y, C.z - A.z);
            var N = new THREE.Vector3(
                    (AB.y * AC.z - AC.y * AB.z),
                    (AB.z * AC.x - AC.z * AB.x),
                    (AB.x * AC.y - AC.x * AB.y)
            );
            position.z = -(N.x * (position.x - A.x) + N.y * (position.y - A.y)) / N.z + A.z;
        }
        return  position;
    }

    matrix.prototype.build = function (materialProperty) {
        return new BUILD.matrix.build(materialProperty, this);
    };

    return matrix;
}();