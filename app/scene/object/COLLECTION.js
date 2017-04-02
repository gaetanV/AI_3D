function COLLECTION(collectionFactory,model,resolve,matrix,errors) {
    this.model = model;
    this.matrix = matrix;
    this.collectionFactory = collectionFactory;
    this.errors = errors;
    this.collection = [];
    this.resolve = resolve ;
}

COLLECTION.prototype.add = function (position) {
    var pModel = new this.model(position,this.matrix,this.resolve,this.errors);
    this.collectionFactory.add(pModel.model);
    this.collection.push(pModel);
            
}

COLLECTION.prototype.animate = function () {
    for (var i = 0; i < this.collection.length; i++) {
        var horse = this.collection[i];
        horse.animate();
    }
}
