function  cubes(map, material) {
    
    this.texture = material.texture;
    this.material = material.material;

    var ratio = 1 /  map.x  ;
    var result = [];
   
    for(var x in map.grid){
        for(var y in map.grid[x]){
          var tex = this.texture.floor.clone();
            tex.repeat.x = ratio;
            tex.offset.x = x * ratio;
            tex.repeat.y = ratio;
            tex.offset.y = y * ratio;

            tex.needsUpdate = true;
            var m = new THREE.MeshPhongMaterial( {map: tex, color: 0xffffff} );

            var cubeSidesMaterial = new THREE.MultiMaterial( [m,m,m,m,m,m] );
            var geom = new THREE.CubeGeometry(map.sizeGrid,map.sizeGrid, 20);
            var cube =  new THREE.Mesh(geom,cubeSidesMaterial);
            cube.position.set(x*map.sizeGrid,y*map.sizeGrid,0);
            result.push(cube);
        }
       
    }
    
    return result;


}