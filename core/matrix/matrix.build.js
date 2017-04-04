BUILD.matrix.build = function (MATERIAL) {

    MATERIAL.set("matrix_default", {
        material: {
            floor: {
                type: "MeshPhongMaterial",
                option: {color: "0xffffff", shininess: 0}
            }
        }
    });

    return function (materialProperty, matrix, options) {

        var x = matrix.x;
        var y = matrix.y;

        var material = materialProperty.material ? materialProperty.material : MATERIAL.get("matrix_default").material;

        // SEPARATE GEOMETRY AND GRID IS LONGER BUT MORE READABLE
        var geometry = new THREE.Geometry();

        // ADD VERTICES
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                geometry.vertices.push(matrix.matrix[i][j]);
            }
        }
        // FILLING FACES
        for (var i = 0; i < (x - 1); i++) {
            for (var j = 0; j < (y - 1); j++) {
                var point1 = i + j * x;
                var point2 = point1 + 1;
                var point4 = point1 + x;
                var point3 = point4 + 1;
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
        var cube = new THREE.Mesh(geometry, material.floor);
        cube.material.side = THREE.DoubleSide;
        cube.doubleSided = true;
        cube.receiveShadow = true;
        cube.position.set(0, 0, 0);
        return cube;
    }

    return matrix;
}(MATERIAL);