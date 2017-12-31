MATERIAL.set("floor", {
    texture: {
        top: 'exemple/bomb/images/grass.jpg',
    },
    material: {
        border:{
            type: "MeshPhongMaterial",
            option: {color: 0xffffff }
        },
        top:{
            type: "MeshPhongMaterial",
            option: {map: "top", color: 0xffffff, shininess: 0}
        }
    }
});

function sceneFactory(scene) {
    this.scene = scene;
    this.parrot = new THREE.Object3D();
    this.errors = new THREE.Object3D();
    this.decor = new THREE.Object3D();
    this.tree = new THREE.Object3D();

   
    this.scene.add(this.parrot);
    this.scene.add(this.tree);
    this.scene.add(this.decor);
    this.scene.add(this.errors);

    this.errorsFactory = new BUILD.error(0xffffff,this.errors);

}

sceneFactory.prototype.map = function () {
    
    var tmpMap = new BUILD.grid (
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 4, 5, 5, 4, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 4, 5, 6, 6, 6, 6, 5, 4, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 2, 3, 5, 5, 6, 6, 6, 6, 5, 5, 4, 3, 2, 1, 1, 1],
                [1, 1, 1, 1, 2, 3, 5, 5, 6, 6, 6, 6, 5, 5, 4, 3, 2, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 4, 5, 6, 6, 6, 6, 5, 4, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 4, 5, 5, 4, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]
            , 50 , 50
            );

    var c = tmpMap.build(MATERIAL.get("floor"),{
        gap:2,
        height:40,
    });

    for (var i in c.result) {
       this.scene.add(c.result[i]);
    }
    
    return c;

}

sceneFactory.prototype.buildLayer = function (grid){

    var gridLayer = new BUILD.grid.layer(grid,2);

    return gridLayer;
}

sceneFactory.prototype.buildTente = function (matrix,gridLayer) {
    
    var ptente = new tenteGrid(4,matrix);
    this.decor.add(ptente.model);

    ptente.magnet(8,8);

    gridLayer.add(
        0,
        ptente.surface
    );
 
}

sceneFactory.prototype.buildTree = function (matrix,gridLayer) {

    var l = 2;

    var ptree = new BUILD.object.collection(
        this.tree, 
        new treeGridFactory(l,matrix), 
        new BUILD.grid.resolve(), 
        matrix,
        this.errorsFactory 
    );

    solution = matrix.grid.mask(
        l,
        l,
        [1]
    );

    for(var i=0; i<15 ; i++) {

        solution = gridLayer.mask(
            0,
            l,
            l,
            solution
        )

        var k = Math.floor(Math.random() * (solution.length));

        var c = ptree.add();

        c.magnet( 
            solution[k][0],
            solution[k][1],
        )

        gridLayer.add(
            0,
            c.surface
        );
       
    }

}

sceneFactory.prototype.buildParrots = function (matrix) {
    
    var parrots = new BUILD.object.collection(
        this.parrot, 
        new parrotFactory(), 
        new BUILD.grid.resolve(), 
        matrix,
        this.errorsFactory 
    );
   
    parrots.add(new THREE.Vector3(0,0, 200));
    parrots.add(new THREE.Vector3(150,150, 250));
    parrots.add(new THREE.Vector3(300,300, 250));

    return parrots;

}

sceneFactory.prototype.lights = function () {
    /*LIGHT*/

    var light = new THREE.SpotLight(0xffffff, 3);
    light.position.set(0, 0, 1510);

    this.scene.add(light);

    var light = new THREE.SpotLight(0xffffff, 0.5);
    light.position.set(0, 0, 1800);
    this.scene.add(light);

}