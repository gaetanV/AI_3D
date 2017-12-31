BUILD.grid.layer = function () {


    var layer = function (grid,nb) {
        this.grid = grid;

        this.layer = [];
        for(var i=0; i< nb ; i++){
            this.layer.push([]);
        }
    
    }

    layer.prototype.add = function (level,object){
        object.forEach(e => {
            var a = this.layer[level][e[0]];
            if(!a){
                this.layer[level][e[0]] = [];
            }
     
            this.layer[level][e[0]][e[1]] = 1;
          
        });
     
    }

    layer.prototype.mask = function(level,h,l,solution) {
     
        return solution.filter((pos)=>{
            var i =  pos[0];
            var j =  pos[1];
            var v;
            boucle1:
            for(var ki = 0 ; ki<l ; ki++){
               for(var kj = 0 ; kj<h ; kj++){
                   v = this.layer[level] [i+ki];
                   if(v){
                       v = this.layer[level] [i+ki][j+kj];
                       if(v){
                         break boucle1;
                       }
                   }
               }
            }
            if(kj>=l && ki>=h){
               return true;
            }else{
               return false;
            }

        });
  

    }


    return layer;
}();