BUILD.grid = function () {
    var grid = function (grid, blocX, blocY) {
        this.grid = grid;
        this.x = grid.length;
        this.y = grid[0].length;
        this.size = {
            x: blocX * this.x,
            y: blocY* this.y,
            bloc: {
                x:blocX,
                y:blocY,
            }
        }
    }
    grid.prototype.build = function (material, options) {
        return new BUILD.grid.build(material, this, options);
    }
    return grid;
}()



