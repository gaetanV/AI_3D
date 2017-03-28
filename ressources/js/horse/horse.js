function horse(position, grille, resolver, errors, callback) {
    this.grille = grille;
    this.resolver = resolver;
    this.selfCollision = true;
    this.errors = errors;
    this.ressource = {
        model: {
            horse: "ressources/model/horse.js",
        }
    }

    this.etat = 0;
    this.goal = new Array();
    this.currentGoal = new THREE.Vector3(0, 0, 0);
    this.newAngleMove;
    this.moveX;
    this.moveY;
    this.ZMove = true;

    //SPEED

    this.speed = new Array();
    this.speed.physical = true;
    this.speed.Delta = 3;
    this.speed.Moy = 3;
    this.speed.Max = 5;
    this.speed.Min = 2;
    this.speed.Friction = 100;

    this.animOffset = 0; // starting frame of animation
    this.duration = 1000; // milliseconds to complete animation
    this.keyframes = 14; // total number of animation frames
    this.interpolation = this.duration / this.keyframes; // milliseconds per frame
    this.lastKeyframe = 0; // previous keyframe
    this.currentKeyframe = 0;

    var loader = new THREE.JSONLoader();
    loader.load(this.ressource.model.horse, function (geometry, materials) {
        var animatedMesh;
        var material2 = new THREE.MeshBasicMaterial({color: 0x000000, morphTargets: true, shininess: 0});
        animatedMesh = new THREE.Mesh(geometry, material2);
        animatedMesh.scale.set(0.2, 0.2, 0.2);
        animatedMesh.castShadow = true;
        animatedMesh.rotation.z = Math.PI / 2;
        animatedMesh.rotation.y = Math.PI / 2;
        //ADD
        var group = new THREE.Object3D();
        group.add(animatedMesh);
        group.model = animatedMesh;
        group.obj = this;

        group.position.set(position.x, position.y, position.z);
        callback(group, this);
        //DEFINED 
        this.mesh = animatedMesh;
        this.model = group;
        this.setGoal(new THREE.Vector3(0, 0, 0));
    }.bind(this));

}


horse.prototype.setGoal = function (position) {
    this.goal = new Array();
    this.goal[0] = position;
    this.currentGoal = position;
    this.etat = 1;
    this.collisionFixe();
}

horse.prototype.popGoal = function () {
    // +1 GOAL
    if (this.goal.length > 1) {
        this.goal.pop();
        this.currentGoal = this.goal[this.goal.length - 1];

        this.collisionFixe();
        // 0 GOAL
    } else {
        var position = new THREE.Vector3((this.model.position.x + this.moveX * 1000 / this.speed.Delta), (this.model.position.y + this.moveY * 1000 / this.speed.Delta), 0);
        this.setGoal(position);
        this.etat = 2;
    }
}
horse.prototype.pushGoal = function (position) {
    this.goal.push(position);
    this.currentGoal = position;
}


horse.prototype.moveZ = function () {
    var oldPosition = this.model.position.clone();
    var newPosition = this.grille.returnZ(this.model.position);
    var ZDiff = oldPosition.z - newPosition.z;
    var angleRad = Math.atan(ZDiff / 3);
    this.model.model.rotation.y = Math.PI / 2 + angleRad;
    if (this.speed.physical) {
        if (angleRad > 0) {
            if (this.speed.Delta < this.speed.Max) {
                this.speed.Delta += Math.exp(angleRad) / this.speed.Friction;
            }
        }
        if (angleRad === 0) {
            if (this.speed.Delta < this.speed.Moy) {
                this.speed.Delta += 0.5;
            }
            if (this.speed.Delta < this.speed.Moy) {
                this.speed.Delta -= 0.5;
            }
        }
        if (angleRad < 0) {
            if (this.speed.Delta > this.speed.Min) {
                this.speed.Delta -= Math.exp(-angleRad) / this.speed.Friction;
            }
        }
    }
}



horse.prototype.anglePosition = function (angle, positionObj) {
    //AXE 0,0;
    var xGoalTemp = positionObj.x - this.model.position.x;
    var yGoalTemp = positionObj.y - this.model.position.y;

    //CALCULE DE LA POSITION
    var x = xGoalTemp * Math.cos(angle) - yGoalTemp * Math.sin(angle);
    var y = xGoalTemp * Math.sin(angle) + yGoalTemp * Math.cos(angle);

    //AXE MODEL;
    var position = new THREE.Vector3(x + this.model.position.x, y + this.model.position.y, 0);

    return position;
}



horse.prototype.animate = function () {

    switch ((this.etat)) {

        case 0:
            /**
             *   NO MOVE
             */
            break;
        case 1:
        /**
         *   OBJECTIF
         */
        case 2:
            /**
             *   PAS D'OBJECTIF 
             */
            this.ZMove && (this.moveZ());

            this.model.position.x += this.moveX * this.speed.Delta;
            this.model.position.y += this.moveY * this.speed.Delta;

            //HORS PISTE
            if (this.model.position.y > (this.grille.sizeGrille * this.grille.yGrille / 2) || this.model.position.y < -(this.grille.sizeGrille * this.grille.yGrille) / 2 || this.model.position.x > (this.grille.sizeGrille * this.grille.xGrille / 2) || this.model.position.x < -(this.grille.sizeGrille * this.grille.xGrille) / 2) {
                var position = new THREE.Vector3(0, 0, 0);
                this.setGoal(position);
                this.etat = 2;
            }

            // GOAL = MODEL POSITION
            if (Math.abs(Math.floor(this.model.position.x) - this.currentGoal.x + Math.floor(this.model.position.y) - this.currentGoal.y) <= this.speed.Delta) {
                this.popGoal();
            }

            /**
             * Animate the Model
             */
            var time = new Date().getTime() % this.duration;
            this.keyframe = Math.floor(time / this.interpolation) + this.animOffset;
            if (this.keyframe != this.currentKeyframe)
            {
                this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 0;
                this.mesh.morphTargetInfluences[ this.currentKeyframe ] = 1;
                this.mesh.morphTargetInfluences[ this.keyframe ] = 0;
                this.lastKeyframe = this.currentKeyframe;
                this.currentKeyframe = this.keyframe;
            }
            this.mesh.morphTargetInfluences[ this.keyframe ] = (time % this.interpolation) / this.interpolation;
            this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 1 - this.mesh.morphTargetInfluences[ this.keyframe ];

            break;
    }
}



horse.prototype.collisionFixe = function () {
    var angle = 0;
    if (this.model) {
        var position = this.currentGoal;
        // SI GOAL COLLISION ROTATION ET TEST
        var distance = Math.sqrt(Math.pow((this.model.position.x - position.x), 2) + Math.pow((this.model.position.y - position.y), 2));
        distance = Math.ceil(distance);

        var intersect = this.resolver.decorCollision(this.getCollisonPoints(position), distance);

        if (intersect) {

            var distance = intersect.distance;
            var step = (Math.PI * 2) / ((intersect.distance / 20) + 4);
            distance = Math.ceil(distance) + 25;
            do {
                angle += step;
                var position = this.anglePosition(angle, intersect.point);

            } while (this.resolver.decorCollision(this.getCollisonPoints(position), distance) && angle < Math.PI * 2);

            this.pushGoal(position);

            if (angle >= Math.PI * 2) {
                alert("bug");
            }
        }


        this.initSens(position);
    }
}

horse.prototype.getCollisonPoints = function (position) {

    var collisionPoints = [];
    var orientation = position.clone().sub(this.model.position).normalize();

    var angle = Math.atan2(orientation.y, orientation.x) + Math.PI / 2;

    var varriationXD = 6 * Math.cos(angle + Math.PI);
    var varriationYD = 6 * Math.sin(angle + Math.PI);
    var varriationXF = 0;
    var varriationYF = 0;

    // FRONT LEFT
    collisionPoints[0] = new THREE.Vector3(0, 0, 1);
    collisionPoints[0].x = this.model.position.x - varriationXD + varriationXF;
    collisionPoints[0].y = this.model.position.y - varriationYD + varriationYF;
    // FRONT RIGHT
    collisionPoints[1] = new THREE.Vector3(0, 0, 1);
    collisionPoints[1].x = this.model.position.x + varriationXD + varriationXF;
    collisionPoints[1].y = this.model.position.y + varriationYD + varriationYF;

    // FRONT
    collisionPoints[2] = new THREE.Vector3(0, 0, 1);
    collisionPoints[2].x = this.model.position.x + varriationXF + varriationXF;
    collisionPoints[2].y = this.model.position.y + varriationYF + varriationYF;

    return {
        orientation: orientation,
        collisionPoints: collisionPoints
    };
}


horse.prototype.initSens = function (position) {
    var orientation = position.clone().sub(this.model.position).normalize();
    var theta = Math.atan2(orientation.y, orientation.x);

    this.model.rotation.z = theta;
    this.moveX = orientation.x;
    this.moveY = orientation.y;

    if (this.selfCollision) {
        var intersect = this.resolver.horseCollision(this);
        if (intersect) {

            this.error(intersect);
        }
    }

}

horse.prototype.error = function (position) {
    gemCube = new THREE.BoxGeometry(5, 5, 1000);
    var material = new THREE.MeshBasicMaterial({color: "white"});
    var object = new THREE.Mesh(gemCube, material);
    object.position.z = position.z;
    object.position.y = position.y;
    object.position.x = position.x;
    this.errors.add(object);
    return object;
};
