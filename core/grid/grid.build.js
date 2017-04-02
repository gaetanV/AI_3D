BUILD.grid.build = function (MATERIAL) {

    MATERIAL.set("grid_default", {
        material: {
            border: {
                type: "MeshPhongMaterial",
                option: {color: 0xff00ff}
            },
            top: {
                type: "MeshPhongMaterial",
                option: {color: 0xffffff, shininess: 0}
            }
        }
    });


    return function (materialProperty, grid, options) {

        this.material = materialProperty.material ? materialProperty.material : MATERIAL.get("grid_default").material;
        this.gap = options.gap ? options.gap : 0;
        this.height = options.height ? options.height : 0;
        this.empty = options.empty ? options.empty : false;
        this.result = [];
        
        var dx = -grid.size.x / 2;
        var dy = -grid.size.y / 2;

        for (var x in grid.grid) {
            for (var y in grid.grid[x]) {
                if (grid.grid[x][y] != 0) {
                    var cubeSidesMaterial = new THREE.MultiMaterial([this.material.border, this.material.border, this.material.border, this.material.border, this.material.top, this.material.border]);
                    var geom = new THREE.CubeGeometry(grid.sizeGrid, grid.sizeGrid, 20 + this.height * grid.grid[x][y] - 1);
                    var cube = new THREE.Mesh(geom, cubeSidesMaterial);
                    cube.position.set(dx + (x * (grid.sizeGrid + this.gap)), dy + (y * (grid.sizeGrid + this.gap)), this.height * grid.grid[x][y] - 1);
                    this.result.push(cube);
                }

            }

        }
        return this.result;
    };
}(MATERIAL)



