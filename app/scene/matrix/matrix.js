function  matrix(division, size, options) {

    //SET YOUR PROPERTIES

    this.sizeGrid = size / division;
    this.x = division;
    this.y = this.x;
    this.length = this.sizeGrid * this.x;
    
    //SMOOTH
    this.nbSub = 3;
    this.curve = 0.75;

    //RANDOM 
    this.maxHeight = options.maxHeight?options.maxHeight:0;

    var sub = Math.pow(2, this.nbSub) - 1;
    this.matrix = 1 + this.x * (1 + sub);
    this.matrixSize = (this.length / (this.matrix)) + this.sizeGrid / 2;

    // BUILD GRID 
    var grid = new Array();
    for (var i = 0; i < this.matrix; i++) {
        grid[i] = new Array();
        for (var j = 0; j < this.matrix; j++) {
            var hauteur = 0;
            var position = new THREE.Vector3(0, 0, 0);
            // ADD RANDOM HEIGHT 
            if (j % (1 + sub) === 0 && i % (1 + sub) === 0) {
                hauteur = Math.random() * this.maxHeight;
            }
            position.z = hauteur;
            position.x = this.matrixSize * (j - this.matrix / 2);
            position.y = -this.matrixSize * (i - this.matrix / 2);
            grid[i][j] = position;

        }
    }

    var nbSubTemp = this.nbSub;
    var diffraction = 0.25 / this.nbSub;

    // SMOOTH SUB
    for (var s = 0; s < this.nbSub; s++) {
        var courbe = this.curve - diffraction;
        sub = Math.pow(2, nbSubTemp) - 1;
        var step = (sub + 1);
        nbSubTemp--;
        for (var i = 0; i < this.matrix; i += step / 2) {
            for (var j = 0; j < this.matrix; j += step / 2) {
                var y = i % (1 + sub);
                var x = j % (1 + sub);
                var pY = Math.floor(i / (1 + sub));
                var pX = Math.floor(j / (1 + sub));
                if (x === 0 && y === step / 2) {
                    var A = grid[pY * step][pX * step];
                    var B = grid[(pY + 1) * step][pX * step];
                    grid[i][j].z = (B.z + ((A.z - B.z) * courbe));
                }
                if (x === step / 2 && y === 0) {
                    var A = grid[pY * step][pX * step];
                    var B = grid[pY * step][(pX + 1) * step];
                    grid[i][j].z = (B.z + ((A.z - B.z) * courbe));
                }
                if (x === step / 2 && y === step / 2) {
                    var A = grid[(pY + 1) * step][pX * step];
                    var B = grid[pY * step][(pX + 1) * step];
                    var C = grid[pY * step][(pX) * step];
                    var D = grid[(pY + 1) * step][(pX + 1) * step];
                    var courbeT = courbe - 2 * diffraction;
                    grid[i][j].z = ((B.z + ((A.z - B.z) * courbeT)) + (C.z + ((D.z - C.z) * courbeT))) / 2;
                }
            }
        }
    }

    this.grid = grid;
}

// MATCH THE POSITION Z
matrix.prototype.returnZ = function (position) {
    var x = Math.floor(position.x / this.matrixSize + this.matrix / 2);
    var y = Math.floor(-position.y / this.matrixSize + this.matrix / 2);
    if (x <= this.matrix && y <= this.matrix && x >= 0 && y >= 0) {
        var xDiff = (this.matrix / 2 * this.matrixSize + position.x) % this.matrixSize;
        var yDiff = (this.matrix / 2 * this.matrixSize - position.y) % this.matrixSize;
        if (xDiff + yDiff < this.matrixSize) {
            var A = this.grid[y][x];
            var B = this.grid[y][x + 1];
            var C = this.grid[y + 1][x];
        } else {
            var A = this.grid[y][x + 1];
            var B = this.grid[y + 1][x];
            var C = this.grid[y + 1][x + 1];
        }
        var AB = new THREE.Vector3(B.x - A.x, B.y - A.y, B.z - A.z);
        var AC = new THREE.Vector3(C.x - A.x, C.y - A.y, C.z - A.z);
        var P = position;
        var N = new THREE.Vector3(
                (AB.y * AC.z - AC.y * AB.z),
                (AB.z * AC.x - AC.z * AB.x),
                (AB.x * AC.y - AC.x * AB.y)
                );
        var z = -(N.x * (P.x - A.x) + N.y * (P.y - A.y)) / N.z + A.z;
        position.z = z;
    }
    return position;
}