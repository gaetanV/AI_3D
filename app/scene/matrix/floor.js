MATERIAL.set("floor_default", {
    material: {
        floor: {
            type: "MeshPhongMaterial",
            option: {color: "0xffffff", shininess: 0}
        }
    }
});

function  floor(matrix, material) {

    this.material = material.material ? material : MATERIAL.get("floor_default").material;

    // SEPARATE GEOMETRY AND GRID IS LONGER BUT MORE READABLE
    var geometry = new THREE.Geometry();

    var x = matrix.matrix;
    var y = x;

    // ADD VERTICES
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            geometry.vertices.push(matrix.grid[i][j]);
        }
    }
    // FILLING FACES
    for (var i = 0; i < (x - 1); i++) {
        for (var j = 0; j < (y - 1); j++) {
            var point1 = j + (x) * i;
            var point2 = j + 1 + (x) * i;
            var point3 = j + 1 + ((x) * (i + 1));
            var point4 = j + ((x) * (i + 1));
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
    var cube = new THREE.Mesh(geometry, this.material.floor);
    cube.material.side = THREE.DoubleSide;
    cube.doubleSided = true;
    cube.receiveShadow = true;
    cube.position.set(0, 0, 0);
    return cube;

}