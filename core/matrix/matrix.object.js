BUILD.matrix.object = function () {

    function object(matrix,model,move,speed) {
        
        this.matrix = matrix;
        this.model = model;
        this.speed = speed;
        
        this.move = move;
    }

    object.prototype.anglePosition = function (angle, position) {
        var xGoalTemp = position.x - this.model.position.x;
        var yGoalTemp = position.y - this.model.position.y;
        // POSITION
        var x = xGoalTemp * Math.cos(angle) - yGoalTemp * Math.sin(angle);
        var y = xGoalTemp * Math.sin(angle) + yGoalTemp * Math.cos(angle);
        // AXE MODEL
        var position = new THREE.Vector3(x + this.model.position.x, y + this.model.position.y, 0);
        return position;
    }

    object.prototype.moveZ = function () {
        var oldPosition = this.model.position.clone();
        var newPosition = this.matrix.returnZ(this.model.position);
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

    object.prototype.setPath = function (position) {

        var orientation = position.clone().sub(this.model.position).normalize();
        var theta = Math.atan2(orientation.y, orientation.x);
        this.model.rotation.z = theta;
        this.move.x = orientation.x;
        this.move.y = orientation.y;
    }
    
    return object;
}();