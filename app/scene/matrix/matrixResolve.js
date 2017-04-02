function matrixResolver(horses, decor ,errorsFactory) {
    this.horses = horses;
    this.decor = decor;
    this.errors = errorsFactory;
}

matrixResolver.prototype.collision = function (collisionObject, distance) {
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


matrixResolver.prototype.collisionPredict = function (horse) {
    //POINT1
    var px1 = horse.model.position.x;
    var py1 = horse.model.position.y;
  
    for (var j = 0; j < this.horses.children.length; j++) {
        var horseBis = this.horses.children[j].obj;
        if (horseBis !== horse) {
            
            //POINT2
            var px2 = horseBis.model.position.x;
            var py2 = horseBis.model.position.y;
            
            //DELTA
            var dy = py1 -py2;
            var dx = px1- px2;
                  
            var p = (horse.move.y / horse.move.x * horse.speed.Delta);
            var pbis = (horseBis.move.y / horseBis.move.x * horse.speed.Delta);
            
            var x = ((pbis * dx - dy) / (p - pbis));
            var y = ((x / horse.move.x * horse.speed.Delta)) * horse.move.y;
       
            //POSITION WHERE THE LINES INTERSECT
            var newX = x + px1;
            var newY = y + py1;
           
            
  
            //IF SAME DIRECTION 
            var sign1 = horse.move.x * horse.speed.Delta > 0 ? 1 : horse.move.x * horse.speed.Delta < 0 ? -1 : 0;
            var sign2 = x > 0 ? 1 : x < 0 ? -1 : 0;
            
            var sign3 = horseBis.move.x * horse.speed.Delta > 0 ? 1 : horseBis.move.x * horse.speed.Delta < 0 ? -1 : 0;
            var sign4 = newX - horseBis.model.position.x > 0 ? 1 : newX - horseBis.model.position.x < 0 ? -1 : 0;
         

            if (sign1 === sign2 && sign3 === sign4) {
                var positionCross = new THREE.Vector3(newX, newY, 0);
                
                //GET THE GOAL
                var objectif = horse.goal.collection[horse.goal.collection.length - 1];
                
                var crossDiff = (positionCross.x - horse.model.position.x);
                var crossBissDiff = (positionCross.x - horseBis.model.position.x);

                var objectifDiff = (objectif.x - horse.model.position.x);
                var objectifBissDiff = (objectif.x - horseBis.model.position.x);
       
               
                 // IF CROSSING IS BEFORE THE GOAL
                if (crossDiff < objectifDiff && crossBissDiff < objectifBissDiff) {
                    
                    this.errors.display(positionCross,"red");
                    // IF REAL CROSS WITH SPEED
                    var nbMoveBiss = Math.abs(crossBissDiff / horseBis.move.x * horse.speed.Min);
                    var nbMove = Math.abs(crossDiff / horse.move.x * horse.speed.Min);
                  
   
                    // TODO:ERROR physical
                  
                    // IF REAL CROSS WITH HORSE LENGTH 
                    if (Math.abs(nbMoveBiss - nbMove) < 30 * horse.move.x * horse.speed.Min) {
                        this.errors.display(positionCross,"green");
                        return positionCross;
                    }
                }
            }
        }
    }
    return false;
}




