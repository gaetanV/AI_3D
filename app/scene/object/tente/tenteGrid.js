MATERIAL.set("tent_grid", {
    material: {
        border: {
            type: "MeshPhongMaterial",
            option: {color: 0x00ffff, shininess: 1}
        },
        top: {
            type: "MeshPhongMaterial",
            option: {color: 0xffffff, shininess: 1}
        }
    },
    modelObjmtl: {
        tente: [
            "scene/object/tente/model/tente.mtl",
            "scene/object/tente/model/tente.obj"
        ],
    }
});


function tenteGrid(length, gridBuild) {

    var group = new THREE.Object3D();

    this.length = length;
    var cubeHeight = 5;

    this.material =  MATERIAL.get("tent_grid").material;
    var model = MATERIAL.get("tent_grid").modelObjmtl.tente.clone();

    this.gridBuild = gridBuild;
    this.result = [];

    [x,y] = this.gridBuild.makeBloc(length,length);

    var dx = x/2;
    var dy = -y/2;


    var scale = 5.5 * length;

    model.position.set(
         dx, 
        (- 2.5  * scale ) + dy , 
        cubeHeight
    );

    model.scale.set(scale,scale,scale);
  
    group.add(model);
    if(cubeHeight>0){

        var cubeSidesMaterial = new THREE.MultiMaterial([this.material.border, this.material.border, this.material.border, this.material.border, this.material.top, this.material.border]);
        var geom = new THREE.CubeGeometry(
            x, 
            y, 
            cubeHeight
        );
    
        var cube = new THREE.Mesh(geom, cubeSidesMaterial);
    
        cube.position.set(
            dx,
            dy,
            0
        );
    
        group.add(cube);

    }
    this.model = group;
}

tenteGrid.prototype.magnet = function(x,y) {
    this.surface = this.gridBuild.grid.surface(x,y,this.length,this.length);
    return this.gridBuild.transclude(this.model,x,y);
}
