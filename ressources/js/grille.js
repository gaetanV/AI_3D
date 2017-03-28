
function grille() {
    this.ressource = {
        texture : {
            ebene: 'ressources/images/ebene.jpg',
            snow : 'ressources/images/snow.jpg',
        }
    }

    this.scene = new THREE.Scene();
 
    this.sizeGrille = 100;
    this.tree = new Array();
    this.treePC = 20; // Pourcentage d'arbe
    this.treeSize = 2;
    this.xGrille = 10;
    this.yGrille = 10;
    this.map = new Array();
    this.createMap(this.xGrille, this.yGrille);
    this.floor = new THREE.Object3D();
    this.scene.add(this.floor);
    this.ocean = new THREE.Object3D();
    this.scene.add(this.ocean);
    this.grass = new THREE.Object3D();
    this.scene.add(this.grass);
    this.decor = new THREE.Object3D();
    this.scene.add(this.decor);
    this.monsters = new THREE.Object3D();
    this.scene.add(this.monsters);
}

grille.prototype.animateMonsters = function () {
    for (var i = 0; i < this.monsters.children.length; i++) {
        var horse = this.monsters.children[i].obj;
        horse.animate();
    }
}

grille.prototype.addFrog = function () {
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.0005);
    //scene.fog.color.setHSL(1.61, 0.2, 0.15);
}

grille.prototype.addLightAmbiance = function (color) {
    var light = new THREE.AmbientLight(0x000c1c);
    this.scene.add(light);
    return light;
}

grille.prototype.addLightSpot = function (position) {
    var light = new THREE.SpotLight(0xffffff, 1);
    light.position.set(position.x, position.y, position.z);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    light.shadowCameraFov = 500;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    // light.shadowCameraVisible = true;
    light.target.position.set(position.x, position.y, 0);
    this.scene.add(light);
    return light;
}


grille.prototype.buildMonster = function (position) {
    var objectif = new THREE.Vector3(0, 0, 0);
    new horse(position, objectif, this);
}
grille.prototype.createMap = function (largeur, hauteur) {
    for (var i = 0; i < largeur; i++) {
        var ligne = new Array();
        for (var j = 0; j < hauteur; j++) {
            var random = Math.floor(Math.random() * (100 / this.treePC));
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
grille.prototype.animateSun = function () {
    function byte2Hex(n)
    {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }
    function RGB2Color(r, g, b)
    {
        return  byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }
    switch (this.sun.animate) {
        case "day":

            this.sun.frame++;
            if (this.sun.frame > 200) {
                this.sun.animate = "set";
                this.sun.frame = 0;
            }
            break;
        case "set":
            if (this.sun.position.angle >= (Math.PI / 2)) {
                if (this.sun.shadowDarkness > 0 && this.sun.intensity > 0) {
                    this.sun.shadowDarkness -= 0.01;
                    this.sun.intensity -= 0.01;
                }
            }

            if (this.sun.position.angle >= (Math.PI)) {
                this.sun.animate = "night";
                this.sun.frame = 0;

            } else {
                this.sun.frame++;
                if (this.sun.color.V > 150) {
                    this.sun.color.V -= 1;
                }
                if (this.sun.color.B > 0) {
                    this.sun.color.B -= 1;
                }
                var hexa = "0x" + RGB2Color(this.sun.color.R, this.sun.color.V, this.sun.color.B);
                this.sun.color.setHex(hexa);
                angle = Math.PI / 2 / 200;
                this.sun.position.angle += angle;

                var euler = new THREE.Euler(0, angle, 0, 'XYZ');
                this.sun.position.applyEuler(euler);
            }


            break;

        case "rise":
            if (this.sun.position.angle >= (Math.PI / 2 * 3)) {
                if (this.sun.shadowDarkness < 1 && this.sun.intensity < 1) {
                    this.sun.shadowDarkness += 0.01;
                    this.sun.intensity += 0.01;
                }
            }
            this.sun.frame++;
            if (this.sun.color.V < 250) {
                this.sun.color.V += 1;
            }
            if (this.sun.color.B < 255) {
                this.sun.color.B += 1;
            }
            var hexa = "0x" + RGB2Color(this.sun.color.R, this.sun.color.V, this.sun.color.B);
            this.sun.color.setHex(hexa);

            var position = new THREE.Vector3(0, 1, 0);
            angle = Math.PI / 2 / 200;

            var euler = new THREE.Euler(0, angle, 0, 'XYZ');
            this.sun.position.applyEuler(euler);
            this.sun.position.angle += angle;

            if (this.sun.position.angle >= (Math.PI * 2)) {
                this.sun.animate = "day";
                this.sun.position.angle = 0;
                this.sun.frame = 0;
            }
            break;
        case "night":
            this.sun.frame++;
            if (this.sun.frame > 100) {


                this.sun.animate = "rise";
                this.sun.frame = 0;
            }
            break;

    }
}

grille.prototype.buildSun = function (position, ambiance) {
    this.sun = this.addLightSpot(position);
    this.sun.color.R = 255;
    this.sun.color.V = 255;
    this.sun.color.B = 255;
    this.sun.position.angle = 0;
    this.sun.frame = 0;
    this.sun.animate = "day";
    this.sun.ambiance = ambiance;

}
grille.prototype.removeSun = function () {
    this.scene.remove(this.sun);
}


grille.prototype.buildFloor = function () {
    var textureUrl = this.ressource.texture.snow;
    var texture = THREE.ImageUtils.loadTexture(textureUrl);
    var mat = new THREE.MeshPhongMaterial({map: texture, shininess: 50}); /// TO DO
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
                    // this.tGrille[i][j].z=(A.z+B.z)/2;
                }
                if (x === step / 2 && y === 0) {
                    var A = this.tGrille[pY * step][pX * step];
                    var B = this.tGrille[pY * step][(pX + 1) * step];
                    //      this.tGrille[i][j].z=(A.z+B.z)/2;
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
    this.floor.add(cube);
}

grille.prototype.returnZ = function (position) {
    x = Math.floor(position.x / this.matrixSize + this.matrix / 2);
    y = Math.floor(-position.y / this.matrixSize + this.matrix / 2);
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
        var AB = new THREE.Vector3(B.x - A.x, B.y - A.y, B.z - A.z);  // vecteur AB
        var AC = new THREE.Vector3(C.x - A.x, C.y - A.y, C.z - A.z);  // vecteur AC
        var P = position;
        var N = new THREE.Vector3(
                (AB.y * AC.z - AC.y * AB.z),
                (AB.z * AC.x - AC.z * AB.x),
                (AB.x * AC.y - AC.x * AB.y)
                );  // produitVectoriel AB - AC
        var z = -(N.x * (P.x - A.x) + N.y * (P.y - A.y)) / N.z + A.z;
        position.z = z;
    }
    return position;
}


grille.prototype.buildMap = function () {
    for (var i = 0; i < this.xGrille; i++) {
        for (var j = 0; j < this.yGrille; j++) {
            if (this.map[i][j] === 1) {
                var position = new THREE.Vector3();
                position.x = (j * this.sizeGrille) - (this.xGrille * this.sizeGrille) / 2;
                position.y = (i * this.sizeGrille) - (this.yGrille * this.sizeGrille) / 2;
                this.bulidCube(position, "red");
            }

        }

    }
}
grille.prototype.bulidFakeCube = function (position, color) {
    gemCube = new THREE.BoxGeometry(5, 5, 1000);
    var material = new THREE.MeshBasicMaterial({color: color});
    var object = new THREE.Mesh(gemCube, material);
    object.position.z = position.z;
    object.position.y = position.y;
    object.position.x = position.x;
    this.scene.add(object);
    return object;
}


grille.prototype.bulidCube = function (position, color) {
    var texture = THREE.ImageUtils.loadTexture( this.ressource.texture.ebene);
    this.returnZ(position);
    var material = new THREE.MeshBasicMaterial({color: "red", transparent: true, opacity: 0});
    var gemCube = new THREE.BoxGeometry(this.sizeGrille / 10, this.sizeGrille, 800);
    var object = new THREE.Mesh(gemCube, material);
    object.position.z = 0;
    object.position.y = position.y;
    object.position.x = position.x + this.sizeGrille / 2;
    object.rotation.z = Math.PI / 2;
    this.decor.add(object);
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
        this.scene.add(object);
    }

}

grille.prototype.buildSphere = function () {
    if (this.xGrille > this.yGrille) {
        maxsize *= this.xGrille * this.sizeGrille;
    } else
        maxsize = this.yGrille * this.sizeGrille;
    mat = new THREE.MeshPhongMaterial({shininess: 50});
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(maxsize * 2, 32, 32), mat);
    sphere.position.y = 0;
    sphere.position.x = 0;
    sphere.position.z = +maxsize;
    sphere.scale.x = -1;
    this.scene.add(sphere);
}
