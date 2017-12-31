MATERIAL.set(parrot, {
    modelJson: {
        parrot: "scene/object/parrot/model/parrot.js",
    },
    material: {
        parrot: {
            type: "MeshBasicMaterial",
            option: {color: 0xffaa55, morphTargets: true, vertexColors: THREE.FaceColors}
        },
    },
});


function parrotFactory(position) {
    this.material = MATERIAL.get(parrot).material;
    this.jsonModel = MATERIAL.get(parrot).modelJson;
    
    // LOAD THE MODEL
    var animatedMesh;

    animatedMesh = new THREE.Mesh(this.jsonModel.parrot, this.material.parrot);
    animatedMesh.scale.set(0.8, 0.8, 0.8);
    animatedMesh.castShadow = true;
    animatedMesh.rotation.z = Math.PI / 2;
    animatedMesh.rotation.y = Math.PI / 2;
    var group = new THREE.Object3D();
    group.add(animatedMesh);
    group.model = animatedMesh;
    group.obj = this;
    group.position.set(0,0,0);
    this.model = group;

}

parrotFactory.prototype.clone = function () {
    return new parrot(
        this.model.clone()
    );
}

function parrot(model) {
    this.model = model;
    this.animated = new BUILD.object.animate(model.children[0], 0, 1000, 12);
}

parrot.prototype.animate = function () {
    
    this.animated.next();
}

