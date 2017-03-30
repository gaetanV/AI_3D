MATERIAL.set(floor, {
    texture:{
        foor: 'scene/map/images/snow.jpg',
        ebene: 'scene/map/images/ebene.jpg'
    },
    material: {
        floor: {
            type: "MeshPhongMaterial",
            option :{map: "floor", shininess: 50}
        }
    }
});

function  floor(matrix) {
    
    this.matrix = matrix;
    
   
}