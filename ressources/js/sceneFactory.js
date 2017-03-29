function sceneFactory(scene) {
    this.scene = scene;
    this.floor = new THREE.Object3D();
    this.floor.receiveShadow = true;
   
    this.decor = new THREE.Object3D();
    this.horses = new THREE.Object3D();
    this.errors = new THREE.Object3D();
    this.scene.add(this.floor);
    this.scene.add(this.decor);
    this.scene.add(this.horses);
    this.scene.add(this.errors);
}

sceneFactory.prototype.buildSun = function (position) {
    var light = new THREE.SpotLight(0xffffff, 0.5);
    light.position.set(position.x, position.y, position.z);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    light.shadowCameraFov = 500;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    light.penumbra= 1;

    light.target.position.set(position.x, position.y, 0);
    this.scene.add(light);
    return new sun(light);
}

sceneFactory.prototype.remove = function (object) {
    this.scene.remove(object);
}


sceneFactory.prototype.buildFloor = function () {
    var m = new matrix();
    var sol =m.buildFloor() ;

    this.floor.add(m.buildFloor(sol));
    var result = m.buildMap();
    result.decor.map(function (a) {
        this.decor.add(a);
    }.bind(this));
    result.scene.map(function (a) {
        this.scene.add(a);
    }.bind(this));
    return  m;
};



sceneFactory.prototype.buildSphere = function () {
    var maxsize;
    if (this.xGrille > this.yGrille) {
        maxsize *= this.xGrille * this.sizeGrille;
    } else
        maxsize = this.yGrille * this.sizeGrille;
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(maxsize * 2, 32, 32), new THREE.MeshPhongMaterial({shininess: 50}));
    sphere.position.y = 0;
    sphere.position.x = 0;
    sphere.position.z = +maxsize;
    sphere.scale.x = -1;
    this.scene.add(sphere);
}

sceneFactory.prototype.addFrog = function () {
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.0005);
    //scene.fog.color.setHSL(1.61, 0.2, 0.15);
}



