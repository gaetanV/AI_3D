BUILD.object.collection = function () {

    function collection(collectionFactory, model, resolve, matrix, errors) {
        this.model = model;
        this.matrix = matrix;
        this.collectionFactory = collectionFactory;
        this.errors = errors;
        this.collection = [];
        this.resolve = resolve;
    }

    collection.prototype.add = function (position) {
     
        var pModel =  this.model.clone(this.matrix, this.resolve, this.errors);
 
        if(position){
            pModel.model.position.set(position.x,position.y,position.z);
        }

        this.collectionFactory.add(pModel.model);
        this.collection.push(pModel);
        return pModel;
    }

    collection.prototype.animate = function () {
        for (var i = 0; i < this.collection.length; i++) {
             this.collection[i].animate();
        }
    }
    return collection;
}();