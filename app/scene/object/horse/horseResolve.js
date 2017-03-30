function horseResolver(horses, decor) {
    this.horses = horses;
    this.decor = decor;
}

horseResolver.prototype.decorCollision = function (collisionObject, distance) {
    /**
    * IF CROSS
    */
    for (var i = 0; i < collisionObject.collisionPoints.length; i++) {
        var raycaster = new THREE.Raycaster(collisionObject.collisionPoints[i], collisionObject.orientation);
        raycaster.far = distance;
        var intersects = raycaster.intersectObjects(this.decor.children);
        if (intersects.length > 0) {
            return intersects[0];
        }
    }
    return false;
}


horseResolver.prototype.horseCollisionPredict = function (horse) {

    for (var j = 0; j < this.horses.children.length; j++) {
        var horseBis = this.horses.children[j].obj;
        if (horseBis !== horse) {
            var p = (horse.moveY / horse.moveX * horse.speed.Delta);
            var pbis = (horseBis.moveY / horseBis.moveX * horse.speed.Delta);
            var dy = horse.model.position.y - horseBis.model.position.y;
            var dx = horse.model.position.x - horseBis.model.position.x;
            var x = ((pbis * dx - dy) / (p - pbis));
            var y = ((x / horse.moveX * horse.speed.Delta)) * horse.moveY;

            var sign = horse.moveX * horse.speed.Delta > 0 ? 1 : horse.moveX * horse.speed.Delta < 0 ? -1 : 0;
            var sign2 = x > 0 ? 1 : x < 0 ? -1 : 0;
            var newX = x + horse.model.position.x;
            var newY = y + horse.model.position.y;

            var sign4 = horseBis.moveX * horse.speed.Delta > 0 ? 1 : horseBis.moveX * horse.speed.Delta < 0 ? -1 : 0;
            var sign3 = newX - horseBis.model.position.x > 0 ? 1 : newX - horseBis.model.position.x < 0 ? -1 : 0;
            
            // IF SAME DIRECTION 
            if (sign == sign2 && sign3 == sign4) {
                var objectif = horse.goal[horse.goal.length - 1];
               // var objectifBis = horseBis.goal[horse.goal.length - 1];
                var positionCross = new THREE.Vector3(newX, newY, 0);
                var crossDiff = (positionCross.x - horse.model.position.x);
                var crossBissDiff = (positionCross.x - horseBis.model.position.x);

                var objectifDiff = (objectif.x - horse.model.position.x);
                var objectifBissDiff = (objectif.x - horseBis.model.position.x);

                 // IF CROSSING IS BEFORE THE GOAL
                if (crossDiff < objectifDiff && crossBissDiff < objectifBissDiff) {

                    // IF REAL CROSS WITH SPEED
                    var nbMoveBiss = Math.abs(crossBissDiff / horseBis.moveX * horse.speed.Min);
                    var nbMove = Math.abs(crossDiff / horse.moveX * horse.speed.Min);
                    
                    // IF REAL CROSS WITH HORSE LENGTH 
                    if (Math.abs(nbMoveBiss - nbMove) < 30 * horse.moveX * horse.speed.Min) {
                        return positionCross;
                    }
                }
            }
        }
    }
    return false;
}




