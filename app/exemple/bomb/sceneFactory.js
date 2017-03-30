MATERIAL.set("map", {
    texture: {
        floor: 'exemple/bomb/images/map.jpg',
    },
    material: {
        floor: {
            type: "MeshPhongMaterial",
            option: {map: "floor", color: 0xffffff}
        }
    }
});
function sceneFactory(scene) {
    this.scene = scene;

}
sceneFactory.prototype.map = function () {
    var tmpMap = new map(
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 4, 8, 8, 4, 1, 0, 0, 0, 1, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 4, 4, 5, 5, 5, 5, 4, 4, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 3, 3, 6, 7, 8, 5, 5, 5, 5, 8, 7, 6, 3, 3, 3, 0, 0],
                [0, 0, 0, 3, 3, 6, 7, 8, 5, 5, 5, 5, 8, 7, 6, 3, 3, 3, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 4, 5, 5, 5, 5, 4, 4, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 4, 8, 8, 4, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 4, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
            , 100
            );

   var c = new cubes(tmpMap, MATERIAL.get("map"));
   for(var i in c){
       this.scene.add(c[i]);
   }
}

sceneFactory.prototype.lights = function () {
      /*LIGHT*/
             
                var light = new THREE.SpotLight(0xffffff, 3);
                light.position.set(0, 0, 1510);
      
                this.scene.add(light);

                var light = new THREE.SpotLight(0xffffff, 0.5);
                light.position.set(0, 0, 1800);
                 this.scene.add(light);

                this.scene.add(light);
                
}