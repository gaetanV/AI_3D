function horseCollection(horses,decor,matrix,errors) {
    this.matrix = matrix;
    this.horses = horses;
    this.errors = errors;
    this.decor = decor;
    this.collection = [];
    this.resolve = new horseResolver(this.horses,this.decor);

}

horseCollection.prototype.removeHorse = function () {

}

horseCollection.prototype.addHorse = function (position) {
    new horse(position, this.matrix,this.resolve,this.errors, function (model,horse) {
     
        this.horses.add(model);
        this.collection.push(horse);
    }.bind(this));
}

horseCollection.prototype.animate = function () {
    for (var i = 0; i < this.collection.length; i++) {
        var horse = this.collection[i];
        horse.animate();
    }
}
