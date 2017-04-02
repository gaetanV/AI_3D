BUILD.error = function () {

    function error(color, space) {
        this.color = color;
        this.space = space;
    }

    error.prototype.display = function (position, color) {
        var color = color ? color : this.color;
        var gemCube = new THREE.BoxGeometry(5, 5, 1000);
        var object = new THREE.Mesh(gemCube, new THREE.MeshBasicMaterial({color: color}));
        object.position.z = position.z;
        object.position.y = position.y;
        object.position.x = position.x;
        this.space.add(object);
        return object;
    };
    return error;
 }();