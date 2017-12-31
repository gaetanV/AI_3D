function core(domID) {

    // CAMERA
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.rotation.x = 0.65;
    camera.position.z = 600;
    camera.position.y = -600;
    camera.position.x = 0;
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
    var matrix = this.sceneFactory.map();
    var layer = this.sceneFactory.buildLayer(matrix.grid);


    this.parrots = this.sceneFactory.buildParrots(matrix,layer);
    this.sceneFactory.buildTente(matrix,layer);
    this.sceneFactory.buildTree(matrix,layer);
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
    this.parrots.animate();
    this.stats && (this.stats.update());
    this.renderer.render(this.scene, this.camera);
}

