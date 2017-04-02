BUILD.grid = function () {
    var grid = function (grid, size) {

        this.grid = grid;
        this.x = grid[0].length;
        this.y = grid.length;
        this.sizeGrid = size;
        this.size = {
            x: this.sizeGrid * this.x,
            y: this.sizeGrid * this.y,
        }

    }

    grid.prototype.build = function (material, options) {
         
        return new BUILD.grid.build(material,this,options);
    }

    return grid;
}()



