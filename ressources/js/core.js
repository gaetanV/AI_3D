var projector;

$(document).ready(function () {
    projector = new THREE.Projector();
    new core();
});

function core() {
    this.selection;
    this.mouseVector = new THREE.Vector3();

    /*SCENE*/
    var container = document.getElementById("container");
    this.containerWidth = window.innerWidth,
            this.containerHeight = window.innerHeight;
    this.dom = $("#container");

    /*CAMERA*/
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 1400;
    camera.position.y = 0;
    camera.position.y = -1000;
    camera.rotation.x = (Math.PI / 2) * 0.8;
    camera.position.z = 400;
    this.camera = camera;

    /*RENDER*/
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.sortObjects = false;
    this.renderer = renderer;
    container.appendChild(this.renderer.domElement);
    this.addStats();


    var core = this;
    this.dom.mousemove(function (e) {
        core.mousemove(e);
    });
    this.dom.click(function (e) {
        core.click(e);
    });
    window.onresize = function () {
        core.onWindowResize();
    };

    this.grille = new grille();
    this.grille.addFrog();
    var ambiance = this.grille.addLightAmbiance();
    var position = new THREE.Vector3(0, 0, 1400);
    this.grille.buildSun(position, ambiance);


    this.grille.buildFloor();
    this.grille.buildSphere();
    this.grille.buildMap();

    var position = new THREE.Vector3(0, 500, 0);
    this.grille.buildMonster(position);

    var position = new THREE.Vector3(200, -100, 0);
    this.grille.buildMonster(position);


    var position = new THREE.Vector3(500, -100, 0);
    this.grille.buildMonster(position);
    this.render();
}


core.prototype.addStats = function () {
    /*STATS*/
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    this.stats = stats;
}

core.prototype.click = function (e) {
    //Test if collision with  Horses (this.grille.monsters) Then focus Selection ( this.selection)
    this.mouseVector.x = 2 * (e.clientX / this.containerWidth) - 1;
    this.mouseVector.y = 1 - 2 * (e.clientY / this.containerHeight);
    raycaster = projector.pickingRay(this.mouseVector.clone(), this.camera);
    intersects = raycaster.intersectObjects(this.grille.monsters.children, true);
    if (intersects[0]) {
        this.selection = intersects[0].object.parent.obj;
    }

    //If Horse Selection Test if collision with floor (this.grille.floor)
    if (this.selection) {
        raycaster = projector.pickingRay(this.mouseVector.clone(), this.camera);
        intersects = raycaster.intersectObjects(this.grille.floor.children);
        if (intersects[0]) {
            var position = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            this.selection.setGoal(position);
        }
    }

}


core.prototype.onWindowResize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
}

core.prototype.mousemove = function (e) { }



core.prototype.render = function () {
    this.grille.animateSun();

    this.grille.animateMonsters();
    core = this;
    window.requestAnimationFrame(function () {
        core.render();
    });


    // SI STATS
    if (core.stats) {
        core.stats.update();
    }

    this.renderer.render(this.grille.scene, this.camera);
}


