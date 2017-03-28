function horse(position, positionGoal, grille) {
    this.grille = grille;
    
    this.ressource = {
        model : {
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
    
    //COLLISION
    this.selfCollision = true;
    this.collisionPoints = new Array();


    this.animOffset = 0; // starting frame of animation
    this.duration = 1000, // milliseconds to complete animation
            this.keyframes = 14, // total number of animation frames
            this.interpolation = this.duration / this.keyframes, // milliseconds per frame
            this.lastKeyframe = 0, // previous keyframe
            this.currentKeyframe = 0;

    this.setGoal(positionGoal);
    this.buildHorse(position);
}

horse.prototype.buildHorse = function (position) {
    var monsterObj = this;
    var loader = new THREE.JSONLoader();
    loader.load(this.ressource.model.horse, function (geometry, materials) {
        material2 = new THREE.MeshBasicMaterial({color: 0x000000, morphTargets: true, shininess: 0});
        animatedMesh = new THREE.Mesh(geometry, material2);
        animatedMesh.scale.set(0.2, 0.2, 0.2);
        animatedMesh.castShadow = true;
        //   animatedMesh.position.x = -25;
        animatedMesh.rotation.z = Math.PI / 2;
        animatedMesh.rotation.y = Math.PI / 2;
        //ADD
        group = new THREE.Object3D();
        group.add(animatedMesh);
        group.model = animatedMesh;
        group.obj = monsterObj;
        group.position.set(position.x, position.y, position.z);
        monsterObj.grille.monsters.add(group);
        //DEFINED 
        monsterObj.mesh = animatedMesh;
        monsterObj.model = group;
        monsterObj.setGoal(monsterObj.currentGoal);
    });

}

horse.prototype.removeHorse = function (group) {
    this.grille.monsters.remove(this.model);
}


horse.prototype.setGoal = function (position) {
    this.goal = new Array();
    this.goal[0] = position;
    this.currentGoal = position;
    this.etat = 1;
    //this.positionCut(100);
    this.collisionFixe(this.grille.decor);
}

horse.prototype.popGoal = function () {
    // +1 GOAL
    if (this.goal.length > 1) {
        this.goal.pop();
        this.currentGoal = this.goal[this.goal.length - 1];

        this.collisionFixe(this.grille.decor);
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
        if (angleRad == 0) {
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

horse.prototype.moveTo = function () {
    if (this.ZMove) {
        this.moveZ();
    }

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
        // this.model.position.x=this.currentGoal.x;
        // this.model.position.y=this.currentGoal.y;
        this.popGoal();
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
        case 0: // INIT NOT MOVE

            break;
        case 1: // OBJECTIF
        case 2: // PAS D'OBJECTIF 
            this.moveTo();

            // Alternate morph targets
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



horse.prototype.collisionFixe = function (group) {
    var angle = 0;
    if (this.model) {
        var position = this.currentGoal;
        // SI GOAL COLLISION ROTATION ET TEST
        var distance = Math.sqrt(Math.pow((this.model.position.x - position.x), 2) + Math.pow((this.model.position.y - position.y), 2));
        distance = Math.ceil(distance);


        if (intersect = this.Collision(group, distance, position)) {

            var distance = intersect.distance;

            var step = (Math.PI * 2) / ((intersect.distance / 20) + 4);

            distance = Math.ceil(distance) + 25;
            do {
                angle += step;
                var position = this.anglePosition(angle, intersect.point);

            } while (this.Collision(group, distance, position) && angle < Math.PI * 2);

            this.pushGoal(position);

            if (angle >= Math.PI * 2) {
                alert("bug");
            }
        }
        this.initSens(position);


    }
}

horse.prototype.Collision = function (group, distance, position) {
    var orientation = position.clone().sub(this.model.position).normalize();
    this.setCollisionPoints(orientation);

    for (var i = 0; i < this.collisionPoints.length; i++) {

        var raycaster = new THREE.Raycaster(this.collisionPoints[i], orientation);
        raycaster.far = distance;
        var intersects = raycaster.intersectObjects(group.children);
        if (intersects.length > 0) {
            return intersects[0];
        }
    }
    return false;
}

horse.prototype.setCollisionPoints = function (orientation) {

    var angle = Math.atan2(orientation.y, orientation.x) + Math.PI / 2;

    // POSITION FRONT + FRONT LEFT + FRONT RIGHT
    var varriationXD = 6 * Math.cos(angle + Math.PI);
    var varriationYD = 6 * Math.sin(angle + Math.PI);
    var varriationXF = 0;
    var varriationYF = 0;

    // POSITION FRONT TO DO ???
    // var varriationXF=25*Math.cos(angle);     var varriationYF=25*Math.sin(angle);

    // FRONT LEFT
    this.collisionPoints[0] = new THREE.Vector3(0, 0, 1);
    this.collisionPoints[0].x = this.model.position.x - varriationXD + varriationXF;
    this.collisionPoints[0].y = this.model.position.y - varriationYD + varriationYF;
    // FRONT RIGHT
    this.collisionPoints[1] = new THREE.Vector3(0, 0, 1);
    this.collisionPoints[1].x = this.model.position.x + varriationXD + varriationXF;
    this.collisionPoints[1].y = this.model.position.y + varriationYD + varriationYF;

    // FRONT
    this.collisionPoints[2] = new THREE.Vector3(0, 0, 1);
    this.collisionPoints[2].x = this.model.position.x + varriationXF + varriationXF;
    this.collisionPoints[2].y = this.model.position.y + varriationYF + varriationYF;

}

horse.prototype.initSens = function (position) {
    var orientation = position.clone().sub(this.model.position).normalize();
    var theta = Math.atan2(orientation.y, orientation.x);
    //  console.log(orientation);

    this.model.rotation.z = theta;
    this.moveX = orientation.x;
    this.moveY = orientation.y;


    if (this.selfCollision) {
        var horse = this;
        for (var j = 0; j < this.grille.monsters.children.length; j++) {
            var horseBis = this.grille.monsters.children[j].obj;
            if (horseBis != horse) {
                var p = (horse.moveY / horse.moveX * this.speed.Delta);
                var pbis = (horseBis.moveY / horseBis.moveX * this.speed.Delta);
                var dy = horse.model.position.y - horseBis.model.position.y;
                var dx = horse.model.position.x - horseBis.model.position.x;
                var x = ((pbis * dx - dy) / (p - pbis));
                var y = ((x / horse.moveX * this.speed.Delta)) * horse.moveY;

                var sign = horse.moveX * this.speed.Delta > 0 ? 1 : horse.moveX * this.speed.Delta < 0 ? -1 : 0;
                var sign2 = x > 0 ? 1 : x < 0 ? -1 : 0;
                var newX = x + horse.model.position.x;
                var newY = y + horse.model.position.y;

                var sign4 = horseBis.moveX * this.speed.Delta > 0 ? 1 : horseBis.moveX * this.speed.Delta < 0 ? -1 : 0;
                var sign3 = newX - horseBis.model.position.x > 0 ? 1 : newX - horseBis.model.position.x < 0 ? -1 : 0;


                if (sign == sign2 && sign3 == sign4) {
                    var objectif = horse.goal[this.goal.length - 1];
                    var objectifBis = horseBis.goal[this.goal.length - 1];
                    var positionCross = new THREE.Vector3(newX, newY, 0);

                    //   if(sign==sign2){
                    var crossDiff = (positionCross.x - horse.model.position.x);
                    var crossBissDiff = (positionCross.x - horseBis.model.position.x);

                    var objectifDiff = (objectif.x - horse.model.position.x);
                    var objectifBissDiff = (objectif.x - horseBis.model.position.x);

                    //ON TEST SI CROSS EST AVANT L'OBJECTIF
                    if (crossDiff < objectifDiff && crossBissDiff < objectifBissDiff) {
                        //ON TEST SI IL PEUVENT SE CROISER
                        var nbMoveBiss = Math.abs(crossBissDiff / horseBis.moveX * this.speed.Min);
                        var nbMove = Math.abs(crossDiff / horse.moveX * this.speed.Min);
                        //   console.log("nbMove"+nbMove+" NB" +(x/horse.moveX) );
                        //LONGEUR DU CHEVAL
                        if (Math.abs(nbMoveBiss - nbMove) < 30 * horse.moveX * this.speed.Min) {
                            this.grille.bulidFakeCube(positionCross, "white");
                        }
                    }
                }
            }
        }
    }

}


