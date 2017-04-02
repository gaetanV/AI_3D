MATERIAL.set(horse, {
    modelJson: {
        horse: "scene/object/horse/model/horse.js",
    },
    material: {
        horse: {
            type: "MeshBasicMaterial",
            option: {color: 0x000000, morphTargets: true}
        },
    },
});

function horse(position, matrix, resolver, errorsFactory) {

    this.jsonModel = MATERIAL.get(horse).modelJson;
    this.material = MATERIAL.get(horse).material;

    this.matrix = matrix;
    this.resolver = resolver;
    this.errors = errorsFactory;

    this.selfCollision = true;
    this.ZMove = true;

    this.etat = 1;

    //SPEED
    this.speed = {
        physical: true,
        Delta: 3,
        Moy: 3,
        Min: 2,
        Friction: 100,
    };
    this.move = {
        x: 0,
        y: 0,
    };

    // LOAD THE MODEL
    var animatedMesh;
    animatedMesh = new THREE.Mesh(this.jsonModel.horse, this.material.horse);
    animatedMesh.scale.set(0.2, 0.2, 0.2);
    animatedMesh.castShadow = true;
    animatedMesh.rotation.z = Math.PI / 2;
    animatedMesh.rotation.y = Math.PI / 2;
    var group = new THREE.Object3D();
    group.add(animatedMesh);
    group.model = animatedMesh;
    group.obj = this;
    group.position.set(position.x, position.y, position.z);

    this.model = group;

    this.object = new OBJECTMATRIX(this.matrix, this.model, this.speed,this.move);
    this.animated = new ANIMATE(animatedMesh, 0, 1000, 14);
    this.goal = new GOAL(new THREE.Vector3(0, 0, 0));
     this.object.setPath(this.collisionFixe(this.goal.current));
}

horse.prototype.setGoal = function (position) {
    //FOLLOW THE DIRECTION
    if (!position) {
        position = new THREE.Vector3((this.model.position.x + this.move.x * this.matrix.sizeGrid * this.matrix.x / 2 / this.speed.Delta), (this.model.position.y + this.move.y * this.matrix.sizeGrid * this.matrix.y / this.speed.Delta), 0);
    }
    this.goal.set(position);
    this.etat = 2;
    this.object.setPath(this.collisionFixe(this.goal.current));
}

horse.prototype.animate = function () {
    switch ((this.etat)) {
        // 0 NO MOVE
        case 1:
        case 2:
            // OBJECTIF || PAS D'OBJECTIF 
            this.ZMove && (this.object.moveZ());
            this.model.position.x += this.move.x * this.speed.Delta;
            this.model.position.y += this.move.y * this.speed.Delta;
            //  OFF ROAD
            if (this.model.position.y > (this.matrix.sizeGrid * this.matrix.y / 2) || this.model.position.y < -(this.matrix.sizeGrid * this.matrix.y) / 2 || this.model.position.x > (this.matrix.sizeGrid * this.matrix.x / 2) || this.model.position.x < -(this.matrix.sizeGrid * this.matrix.x) / 2) {
                this.setGoal(new THREE.Vector3(0, 0, 0));
            }
            // YOU HAVE REACHED YOUR OBJECTIVE
            if (Math.abs(Math.floor(this.model.position.x) - this.goal.current.x + Math.floor(this.model.position.y) - this.goal.current.y) <= this.speed.Delta) {
                // IF NOT MORE GOAL 
                if (!this.goal.pop()) {
                    this.setGoal();
                }
            }
            this.animated.next();
            break;
    }
}

horse.prototype.collisionFixe = function (position) {
    var angle = 0;
    var distance = Math.ceil(Math.sqrt(Math.pow((this.model.position.x - position.x), 2) + Math.pow((this.model.position.y - position.y), 2)));
    var intersect = this.resolver.collision(this.getCollisonPoints(position), distance);
    // POSITION COLLISION
    if (intersect) {
      
        var distance = intersect.distance;
        var step = (Math.PI * 2) / ((intersect.distance / 20) + 4);
        distance = Math.ceil(distance) + 25;
        // ROTATE
        var flag = true;
        do {
            angle += step;
            var position = this.object.anglePosition(angle, intersect.point);
            flag = this.resolver.collision(this.getCollisonPoints(position), distance) && angle < Math.PI * 2;
        } while (flag);
        this.goal.push(position);
        if (angle >= Math.PI * 2) {
              // TODO: OBJECT IS IN ERROR
              this.errors.display(this.model.position,"green");
        }
    }
    
    if (this.selfCollision) {
        var intersect = this.resolver.collisionPredict(this);
        if (intersect) {
            // TODO
        }
    }
    
    return position;
}

horse.prototype.getCollisonPoints = function (position) {

    var collisionPoints = [];
    var orientation = position.clone().sub(this.model.position).normalize();

    var angle = Math.atan2(orientation.y, orientation.x) + Math.PI / 2 + Math.PI;

    var varriationXD = 6 * Math.cos(angle);
    var varriationYD = 6 * Math.sin(angle);

    // FRONT LEFT
    collisionPoints[0] = new THREE.Vector3(0, 0, 1);
    collisionPoints[0].x = this.model.position.x - varriationXD;
    collisionPoints[0].y = this.model.position.y - varriationYD;

    // FRONT
    collisionPoints[2] = new THREE.Vector3(0, 0, 1);
    collisionPoints[2].x = this.model.position.x;
    collisionPoints[2].y = this.model.position.y;

    // FRONT RIGHT
    collisionPoints[1] = new THREE.Vector3(0, 0, 1);
    collisionPoints[1].x = this.model.position.x + varriationXD;
    collisionPoints[1].y = this.model.position.y + varriationYD;

    return {
        orientation: orientation,
        collisionPoints: collisionPoints
    };
}

