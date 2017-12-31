
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

BUILD.grid.build = function (MATERIAL) {

    var build =  function (materialProperty, grid, options) {
        this.grid =grid;
        this.material = materialProperty.material ? materialProperty.material : MATERIAL.get("grid_default").material;
        this.gap = options.gap ? options.gap : 0;
        this.height = options.height ? options.height : 0;
        this.empty = options.empty ? options.empty : false;
        this.result = [];
        
        var dx = -grid.size.x / 2;
        var dy = -grid.size.y / 2;
        var y ;
        for (var i in grid.grid) {
            for (var j in grid.grid[i]) {
                if (grid.grid[i][j] !== 0) {
                    var cubeSidesMaterial = new THREE.MultiMaterial([this.material.border, this.material.border, this.material.border, this.material.border, this.material.top, this.material.border]);
                    var geom = new THREE.CubeGeometry(grid.size.bloc.x, grid.size.bloc.x, this.height * grid.grid[i][j] );
                    var cube = new THREE.Mesh(geom, cubeSidesMaterial);
                    y = (grid.grid.length - i)
                    cube.position.set(
                        dx + (j * grid.size.bloc.x)  + (this.gap * j-1 ),
                        dy + ( y* grid.size.bloc.y ) + (this.gap * y-1),
                        0);
                    this.result.push(cube);
                }

            }

        }
        
    };

    build.prototype.getCube = function (x,y) {
        return this.result[(y*this.grid.y)+x];
    }

    build.prototype.transclude = function (result,x,y) {
        var cube = this.getCube(x,y);
        
   
        result.position.set(
            result.position.x + cube.position.x - cube.geometry.parameters.width/2 ,
            result.position.y + cube.position.y + cube.geometry.parameters.height/2 ,
            result.position.z + cube.position.z + cube.geometry.parameters.depth/2
        );
        
        return result;
    }

    build.prototype.makeBloc = function(x,y){
        return [
            this.grid.size.bloc.x * x + (x-1) *  this.gap,
            this.grid.size.bloc.y * y + (y-1) *  this.gap,
        ]
    }

    return build;

}(MATERIAL)



