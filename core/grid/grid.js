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

    grid.prototype.up = function (height) {
        this.grid = this.grid.map(a=> a = a.map(b => b + height));
    }

    grid.prototype.build = function (material, options) {
        return new BUILD.grid.build(material, this, options);
    }

    grid.prototype.surface = function(x,y,h,l) {
        var surface = [];
        for(var i =0; i< h; i++ ){
            for(var j =0; j< l; j++ ){
                surface.push([x+i,y+j]);
            }
        }
        return surface;
    }
    

    grid.prototype.mask = function (h,l,c) {
        solution = [];
        this.grid.forEach((a,i)=>{
            a.forEach((b,j)=>{
                if(c.includes(b) == 1 && j + h < this.y && i + l < this.x ) {
                    boucle1:
                    for(var ki = 0 ; ki<l ; ki++){
                       for(var kj = 0 ; kj<h ; kj++){
                           var v = this.grid [i+ki][j+kj];
                           if(v!=b){
                               break boucle1;
                           }
                       }
                    }
                    if(kj>=l && ki>=h){
                        solution.push([i,j]);
                    }
                 
                }
            })
        })
        return solution;
    }

    return grid;
}()



