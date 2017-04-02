MATERIAL.set("floor", {
    texture: {
        floor: 'exemple/horse/images/snow.jpg',
    },
    material: {
        floor: {
            type: "MeshPhongMaterial",
            option: {map: "floor", shininess: 50}
        },
    }
});
MATERIAL.set("fence", {
    texture: {
        fence: 'exemple/horse/images/ebene.jpg',
    },
    material: {
        fake: {
            type: "MeshBasicMaterial",
            option: {color: "red", transparent: true, opacity: 0}
          //  option: {color: "red"}
        },
        fence:{
            type: "MeshPhongMaterial",
            option: {map: "fence", color: 0xffffff, shininess: 0}
        }
    }
});

function sceneFactory(scene) {
    this.scene = scene;
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.0005);
    this.floor = new THREE.Object3D();
    this.decor = new THREE.Object3D();
    this.horses = new THREE.Object3D();
    this.errors = new THREE.Object3D();
    this.scene.add(this.floor);
    this.scene.add(this.decor);
    this.scene.add(this.horses);
    this.scene.add(this.errors);
    this.errorsFactory = new BUILD.error(0xffffff,this.errors);
 
}

sceneFactory.prototype.buildSun = function (position) {
    var pSun = new sun(position);
 
    this.scene.add(pSun.model);
    return pSun.interface;
}

sceneFactory.prototype.buildFloor = function (matrix) {
     this.floor.add(
            matrix.build(MATERIAL.get("floor"))
      );
    
    
    var result = new fence(matrix,MATERIAL.get("fence"));
    result.decor.map(function (a) {
        this.decor.add(a);
    }.bind(this));
    result.scene.map(function (a) {
        this.scene.add(a);
    }.bind(this));
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

sceneFactory.prototype.buildHorses = function (matrix) {
    var horses = new BUILD.object.collection(this.horses,horse, new BUILD.matrix.resolve(this.horses,this.decor,this.errorsFactory), matrix,this.errorsFactory );
    horses.add(new THREE.Vector3(5, 500.4, 0));
    horses.add(new THREE.Vector3(200, -100, 0));
    horses.add(new THREE.Vector3(500, -100, 0));
    return  horses;
    
}

