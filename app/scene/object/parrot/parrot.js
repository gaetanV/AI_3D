MATERIAL.set(parrot, {
    modelJson: {
        parrot: "scene/object/parrot/model/parrot.js",
    },
});

function parrot(position) {
    this.jsonModel = MATERIAL.get(horse).modelJson;
    
    
    // LOAD THE MODEL
    var animatedMesh;
    animatedMesh = new THREE.Mesh(this.jsonModel.parrot);
    animatedMesh.scale.set(0.2, 0.2, 0.2);
    animatedMesh.castShadow = true;
    var group = new THREE.Object3D();
    group.add(animatedMesh);
    group.model = animatedMesh;
    group.obj = this;
    group.position.set(position.x, position.y, position.z);
    this.mesh = animatedMesh;
    this.model = group;
}
