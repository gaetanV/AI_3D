BUILD.grid.generator = function () {
    var generator = function (size, maxHeight, x, y) {
        var result = new Array();
        for (var i = 0; i < x; i++) {
            result[i] = new Array();
            for (var j = 0; j < y; j++) {
                result[i][j] = Math.random() * maxHeight;
            }
        }
        return new BUILD.grid(result, size / x , size / y);
    }
    return generator;
}()