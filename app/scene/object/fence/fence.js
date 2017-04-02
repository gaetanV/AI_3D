MATERIAL.set("fence_default", {
    material: {
        fake: {
            type: "MeshBasicMaterial",
            option: {color: "red", transparent: true, opacity: 0}
           
        },
        fence: {
            type: "MeshPhongMaterial",
            option: {color: "0xffffff", shininess: 0}
        }
    }
});
function  fence(matrix, material ) {

  
    this.grid = matrix;
    this.material = material.material ? material.material : MATERIAL.get("fence_default").material;
  
    this.pourcentage = 20;

    var x = matrix.x;
    var y = x;

    var size = matrix.sizeGrid;

    var result = {
        decor: [],
        scene: [],
    }

    /**
     * Build Barriers
     */
    var buildBarriers = function (position) {
        var gemCube = new THREE.BoxGeometry(size / 10, size, 800);
        var object = new THREE.Mesh(gemCube, this.material.fake);
        object.position.z = 0;
        object.position.y = position.y;
        object.position.x = position.x + size / 2;
        object.rotation.z = Math.PI / 2;
        result.decor.push(object);
        var gemCubeO = new THREE.BoxGeometry(size / 20, size, size / 40);
        for (var i = 0; i < 10; i++) {
            var object = new THREE.Mesh(gemCubeO, this.material.fence);
            var positionTemp = position.clone();
            positionTemp.x += i * (size / 10);
            this.grid.returnZ(positionTemp);
            object.position.z = positionTemp.z;
            object.position.y = positionTemp.y;
            object.position.x = positionTemp.x;
            object.rotation.x = Math.PI / 2;
            object.castShadow = true;
            result.scene.push(object);
        }
        return result;
    }.bind(this);

    this.map = new Array();
    for (var i = 0; i < x; i++) {
        var ligne = new Array();
        for (var j = 0; j < y; j++) {
            var random = Math.floor(Math.random() * (100 / this.pourcentage));
            if (random === 0) {
                if ((i > (y / 2) + 1 || i < (y / 2) - 1) || (j > (y / 2) + 1 || j < (y / 2) - 1)) {
                    ligne.push(1);
                } else
                    ligne.push(0);
            } else
                ligne.push(0);
        }
        this.map.push(ligne);
    }

    for (var i = 0; i < this.map.length; i++) {
        for (var j = 0; j < this.map[i].length; j++) {
            if (this.map[i][j] === 1) {
                var position = new THREE.Vector3();
                position.x = (j * size) - (x * size) / 2;
                position.y = (i * size) - (y * size) / 2;
                buildBarriers(position);
            }
        }
    }

    return result;


}


