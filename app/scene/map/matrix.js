MATERIAL.set(matrix, {
    texture:{
        snow: 'scene/map/images/snow.jpg',
        ebene: 'scene/map/images/ebene.jpg'
    }
});

function  matrix() {

    //SET YOUR PROPERTIES
    this.texture = MATERIAL.get(matrix).texture;
    this.pourcentage = 20;
    this.sizeGrille = 100;
    this.xGrille = 10;
    this.yGrille = 10;
    this.map = new Array();
}



// BUILD CURVE MATRIX
matrix.prototype.buildFloor = function () {

    var mat = new THREE.MeshPhongMaterial({map: this.texture.snow, shininess: 50});
    var nbSub = 3;
    var sub = Math.pow(2, nbSub) - 1;
    var nbRandom = 6;
    this.matrix = 1 + nbRandom * (1 + sub);
    longeur = this.sizeGrille * this.xGrille;
    this.matrixSize = (longeur / (this.matrix)) + 50;
    var geometry = new THREE.Geometry();
    var sGrille = new Array();
    for (var i = 0; i < (nbRandom + 1); i++) {
        sGrille[i] = new Array();
        for (var j = 0; j < (nbRandom + 1); j++) {
            hauteur = Math.floor(Math.random() * 200);
            sGrille[i][j] = hauteur;
        }
    }
    this.tGrille = new Array();
    for (var i = 0; i < this.matrix; i++) {
        this.tGrille[i] = new Array();
        for (var j = 0; j < this.matrix; j++) {
            var hauteur = 0;
            var position = new THREE.Vector3(0, 0, 0);
            if (j % (1 + sub) === 0 && i % (1 + sub) === 0) {
                var hauteur = sGrille[i / (1 + sub)][j / (1 + sub)];
            }
            position.z = hauteur;
            position.x = this.matrixSize * (j - this.matrix / 2);
            position.y = -this.matrixSize * (i - this.matrix / 2);
            this.tGrille[i][j] = position;
            geometry.vertices.push(this.tGrille[i][j]);
        }
    }
    var nbSubTemp = nbSub;
    var courbe = 0.75;
    var diffraction = 0.25 / nbSub;
    for (var s = 0; s < nbSub; s++) {
        courbe = courbe - diffraction;
        sub = Math.pow(2, nbSubTemp) - 1;
        var step = (sub + 1);
        nbSubTemp--;
        for (var i = 0; i < this.matrix; i += step / 2) {
            for (var j = 0; j < this.matrix; j += step / 2) {
                y = i % (1 + sub);
                x = j % (1 + sub);
                pY = Math.floor(i / (1 + sub));
                pX = Math.floor(j / (1 + sub));
                if (x === 0 && y === step / 2) {
                    var A = this.tGrille[pY * step][pX * step];
                    var B = this.tGrille[(pY + 1) * step][pX * step];
                    this.tGrille[i][j].z = (B.z + ((A.z - B.z) * courbe));
                }
                if (x === step / 2 && y === 0) {
                    var A = this.tGrille[pY * step][pX * step];
                    var B = this.tGrille[pY * step][(pX + 1) * step];
                    this.tGrille[i][j].z = (B.z + ((A.z - B.z) * courbe));
                }
                if (x === step / 2 && y === step / 2) {
                    var A = this.tGrille[(pY + 1) * step][pX * step];
                    var B = this.tGrille[pY * step][(pX + 1) * step];
                    var C = this.tGrille[pY * step][(pX) * step];
                    var D = this.tGrille[(pY + 1) * step][(pX + 1) * step];
                    courbeT = courbe - 2 * diffraction;
                    this.tGrille[i][j].z = ((B.z + ((A.z - B.z) * courbeT)) + (C.z + ((D.z - C.z) * courbeT))) / 2;
                }
            }
        }
    }
    for (var i = 0; i < (this.matrix - 1); i++) {
        for (var j = 0; j < (this.matrix - 1); j++) {
            var point1 = j + (this.matrix) * i;
            var point2 = j + 1 + (this.matrix) * i;
            var point3 = j + 1 + ((this.matrix) * (i + 1));
            var point4 = j + ((this.matrix) * (i + 1));
            geometry.faces.push(new THREE.Face3(point1, point2, point4));
            geometry.faces.push(new THREE.Face3(point2, point3, point4));
            var uvs = [];
            uvs.push(new THREE.Vector2(0.0, 0.0));
            uvs.push(new THREE.Vector2(1.0, 0.0));
            uvs.push(new THREE.Vector2(1.0, 1.0));
            uvs.push(new THREE.Vector2(0.0, 1.0));
            geometry.faceVertexUvs[ 0 ].push([uvs[0], uvs[1], uvs[2]]);
            geometry.faceVertexUvs[ 0 ].push([uvs[0], uvs[2], uvs[3]]);
        }
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var cube = new THREE.Mesh(geometry, mat);
    cube.material.side = THREE.DoubleSide;
    cube.doubleSided = true;
    cube.receiveShadow = true;
    cube.position.set(0, 0, 0);
    return cube;
}


// MATCH THE POSITION Z
matrix.prototype.returnZ = function (position) {
    var x = Math.floor(position.x / this.matrixSize + this.matrix / 2);
    var y = Math.floor(-position.y / this.matrixSize + this.matrix / 2);
    if (x <= this.matrix && y <= this.matrix && x >= 0 && y >= 0) {
        var xDiff = (this.matrix / 2 * this.matrixSize + position.x) % this.matrixSize;
        var yDiff = (this.matrix / 2 * this.matrixSize - position.y) % this.matrixSize;
        if (xDiff + yDiff < this.matrixSize) {
            var A = this.tGrille[y][x];
            var B = this.tGrille[y][x + 1];
            var C = this.tGrille[y + 1][x];
        } else {
            var A = this.tGrille[y][x + 1];
            var B = this.tGrille[y + 1][x];
            var C = this.tGrille[y + 1][x + 1];
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


// RANDOM POINT
matrix.prototype.createMap = function (largeur, hauteur) {
    this.map = new Array();
    for (var i = 0; i < largeur; i++) {
        var ligne = new Array();
        for (var j = 0; j < hauteur; j++) {
            var random = Math.floor(Math.random() * (100 / this.pourcentage));
            if (random === 0) {
                if ((i > (largeur / 2) + 1 || i < (largeur / 2) - 1) || (j > (hauteur / 2) + 1 || j < (hauteur / 2) - 1)) {
                    ligne.push(1);
                } else
                    ligne.push(0);
            } else
                ligne.push(0);
        }
        this.map.push(ligne);
    }
}


matrix.prototype.buildMap = function () {
    var result = {
        decor: [],
        scene: [],
    }

    /**
     * Build Barriers
     */
    var buildBarriers = function (position) {
        var texture = this.texture.ebene;
        this.returnZ(position);
        var material = new THREE.MeshBasicMaterial({color: "red", transparent: true, opacity: 0});
        var gemCube = new THREE.BoxGeometry(this.sizeGrille / 10, this.sizeGrille, 800);
        var object = new THREE.Mesh(gemCube, material);
        object.position.z = 0;
        object.position.y = position.y;
        object.position.x = position.x + this.sizeGrille / 2;
        object.rotation.z = Math.PI / 2;
        result.decor.push(object);
        var gemCubeO = new THREE.BoxGeometry(this.sizeGrille / 20, this.sizeGrille, this.sizeGrille / 40);
        var material = new THREE.MeshPhongMaterial({map: texture, color: 0xffffff, shininess: 0});
        for (var i = 0; i < 10; i++) {
            var object = new THREE.Mesh(gemCubeO, material);
            var positionTemp = position.clone();
            positionTemp.x += i * (this.sizeGrille / 10)
            this.returnZ(positionTemp);
            object.position.z = positionTemp.z;
            object.position.y = positionTemp.y;
            object.position.x = positionTemp.x;
            object.rotation.x = Math.PI / 2;
            object.castShadow = true;
            result.scene.push(object);

        }
        return result;
    }.bind(this);

    this.createMap(this.xGrille, this.yGrille);
    for (var i = 0; i < this.xGrille; i++) {
        for (var j = 0; j < this.yGrille; j++) {
            if (this.map[i][j] === 1) {
                var position = new THREE.Vector3();
                position.x = (j * this.sizeGrille) - (this.xGrille * this.sizeGrille) / 2;
                position.y = (i * this.sizeGrille) - (this.yGrille * this.sizeGrille) / 2;
                buildBarriers(position);
            }
        }
    }
    return result;
}
