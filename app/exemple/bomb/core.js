function core(domID) {

    // CAMERA
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.rotation.x = 0.65;
    camera.position.z = 800;
    camera.position.y = -300;
    camera.position.x = 800;
    this.camera = camera;

    // CONTAINER
    this.container = {
        dom: document.getElementById(domID),
        width: window.innerWidth,
        height: window.innerHeight,
    };

    // STATS
    this.addStats();

    // RENDER
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.sortObjects = false;
    this.renderer = renderer;

    // ADD DOM
    this.container.dom.innerHTML = "";
    this.container.dom.appendChild(this.renderer.domElement);

    // SCENE
    this.scene = new THREE.Scene();
    this.sceneFactory = new sceneFactory(this.scene);
    this.sceneFactory.map();
    this.sceneFactory.lights();
    this.render();


}
core.prototype.addStats = function () {
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    this.container.dom.appendChild(stats.domElement);
    this.stats = stats;
}

// ON KEYFRAME
core.prototype.render = function () {
    window.requestAnimationFrame(function () {
        this.render();
    }.bind(this));
    this.stats && (this.stats.update());
    this.renderer.render(this.scene, this.camera);
}

