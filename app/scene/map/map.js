function  map(grid, size) {

    this.grid = grid;
    this.x = grid[0].length;
    this.y = grid.length;
    this.sizeGrid = size;
    
    
    this.size = {
        x : this.sizeGrid * this.x,
        y:  this.sizeGrid * this.y,
    }
    
}