function GOAL(currentGoal) {
    this.pointer = 0;
    this.collection = [currentGoal];
    Object.defineProperty(this, "current", { get: function () { return  this.collection[this.pointer]} });
}

GOAL.prototype.set = function (position) {
    this.pointer = 0;
    this.collection[this.pointer]=position;
}

GOAL.prototype.pop = function () {
    if (this.pointer > 1) {
        this.collection.pop();
        this.pointer--;
        return true;
    }
    return false;  // NO GOAL 
}
GOAL.prototype.push = function (position) {
    this.collection[++this.pointer] = position;
}
