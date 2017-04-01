function  cubes(map, material, options) {

    this.texture = material.texture;
    this.material = material.material;

    //var ratio = 1 / map.x;
    var result = [];

    this.gap = options.gap ? options.gap : 0;
    this.height = options.height ? options.height : 0;
    this.empty = options.empty ? options.empty : false;

    var dx = -map.size.x / 2;
    var dy = -map.size.y / 2;

    for (var x in map.grid) {
        for (var y in map.grid[x]) {
            /*
             // TOO SLOW
             var t = this.texture.floor.clone();
             t.repeat.x = ratio;
             t.offset.x = x * ratio;
             t.repeat.y = ratio;
             t.offset.y = y * ratio;
             t.needsUpdate = true;
             */
            if (map.grid[x][y] != 0) {
                var cubeSidesMaterial = new THREE.MultiMaterial([this.material.border, this.material.border, this.material.border, this.material.border, this.material.top, this.material.border]);
                var geom = new THREE.CubeGeometry(map.sizeGrid, map.sizeGrid, 20 + this.height * map.grid[x][y]-1);
                var cube = new THREE.Mesh(geom, cubeSidesMaterial);
                cube.position.set(dx + (x * (map.sizeGrid + this.gap)), dy + (y * (map.sizeGrid + this.gap)), this.height * map.grid[x][y]-1);
                result.push(cube);
            }

        }

    }

    return result;


}