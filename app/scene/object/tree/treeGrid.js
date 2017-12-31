MATERIAL.set("tree_grid", {
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
        tree: [
            "scene/object/tree/model/palm.mtl",
            "scene/object/tree/model/palm.obj"
        ],
    }
});

function treeGridFactory(length, gridBuild){
    var group = new THREE.Object3D();
  
    var cubeHeight = 5;
    this.length = length;

    this.material =  MATERIAL.get("tree_grid").material;
    var model = MATERIAL.get("tree_grid").modelObjmtl.tree;

    this.gridBuild = gridBuild;
    this.result = [];

    [x,y] = this.gridBuild.makeBloc(length,length);

    var dx = x/2;
    var dy = -y/2;

    var scale = 1.8;
    model.rotation.x = Math.PI / 2;

    model.position.set(
        dx, 
        dy , 
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

treeGridFactory.prototype.clone = function(matrix, resolve, errors){
    
    return new treeGrid( 
        this.model.clone(),
        this.gridBuild,
        this.length
    );

}

function treeGrid(model,gridBuild,length) {
    this.length = length;
    this.model = model;
    this.gridBuild = gridBuild;
    this.surface = [];
}

treeGrid.prototype.magnet = function(x,y) {
    this.surface = this.gridBuild.grid.surface(x,y,this.length,this.length);
    return this.gridBuild.transclude(this.model,x,y);
}

treeGrid.prototype.animate = function() {};