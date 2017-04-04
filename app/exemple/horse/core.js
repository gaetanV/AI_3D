function core(domID) {

    this.selection;
    this.mouseVector = new THREE.Vector3();
  
    
    // CAMERA
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.y = 0;
    camera.position.y = -1000;
    camera.rotation.x = (Math.PI / 2) * 0.8;
    camera.position.z = 400;
    this.camera = camera;

    // CONTAINER
    this.container = {
        dom: document.getElementById(domID),
        width: window.innerWidth,
        height: window.innerHeight,
    };

    // DOM EVENTS
    this.container.dom.addEventListener("click", this.click.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));

    
    
    // RENDER
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.sortObjects = false;
    this.renderer = renderer;


    // ADD DOM
    this.container.dom.innerHTML ="";
    this.container.dom.appendChild(this.renderer.domElement);

    // STATS
    this.addStats();

    // SCENE
    this.scene = new THREE.Scene();
    this.sceneFactory = new sceneFactory(this.scene);
    this.sceneFactory.buildSphere();
    this.sun = this.sceneFactory.buildSun(new THREE.Vector3(0, 0, 700));
    var grid = new BUILD.grid.generator(1000,200,10,10);
  
     this.matrix = new BUILD.matrix(grid,3);
    
    
    this.sceneFactory.buildFloor(this.matrix);
    this.horses = this.sceneFactory.buildHorses(this.matrix);
    this.render();
}

core.prototype.addStats = function () {
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    this.container.dom.appendChild(stats.domElement);
    this.stats = stats;
}

core.prototype.click = function (e) {
    var raycaster, intersects;
    this.mouseVector.x = 2 * (e.clientX / this.container.width) - 1;
    this.mouseVector.y = 1 - 2 * (e.clientY / this.container.height);
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouseVector.clone(), this.camera);
    intersects = raycaster.intersectObjects(this.sceneFactory.horses.children, true);

    // IF MOUSE INTERSECT A HOURSE
    if (intersects[0]) {
        this.selection = intersects[0].object.parent.obj;
    }

    // IF HORSE IS SELECTED 
    if (this.selection) {
        intersects = raycaster.intersectObjects(this.sceneFactory.floor.children);
        // IF MOUSE INTERSECT THE FLOOR 
        if (intersects[0]) {
            var position = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            this.selection.setGoal(position);
        }
    }
}

// ON REZISE
core.prototype.onWindowResize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.container.width = window.innerWidth;
    this.container.height = window.innerHeight;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
}


// ON KEYFRAME
core.prototype.render = function () {
   
    window.requestAnimationFrame(function () {
        this.render();
    }.bind(this));
    this.sun.animate();
    this.horses.animate();
    this.stats && (this.stats.update());
    this.renderer.render(this.scene, this.camera);
}


