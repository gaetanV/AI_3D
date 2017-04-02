BUILD.object.goal = function () {
    function goal(currentGoal) {
        this.pointer = 0;
        this.collection = [currentGoal];
        Object.defineProperty(this, "current", {get: function () {
                return  this.collection[this.pointer]
            }});
    }

    goal.prototype.set = function (position) {
        this.pointer = 0;
        this.collection[this.pointer] = position;
    }

    goal.prototype.pop = function () {
        if (this.pointer > 0) {
            this.pointer--;
            return this.collection.pop();
        }
        return false;  // NO GOAL 
    }
    goal.prototype.push = function (position) {
        this.collection[++this.pointer] = position;
    }
    return goal;
}();