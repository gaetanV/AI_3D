TOOLS = function () {
    var nybHexString = "0123456789ABCDEF";
    var texloader = new THREE.TextureLoader();
    var jsonLoader = new THREE.JSONLoader();
    var objmtlLoader = new THREE.MTLLoader();

    return {
        loader: {
            texture: (load) => {
                var size = Object.keys(load).length - 1;
                function* thread() {
                    var index = 0;
                    while (index < size) {
                        yield index++;
                    }
                }
                return new Promise((resolve) => {
                    var textureResolve = {};
                    var i;
                    var iterator = thread();
                    for (i in load) {
                        texloader.load(load[i], function (texture) {
                            textureResolve[this.i] = texture;
                            iterator.next().done === true && (resolve(textureResolve));
                        }.bind({i: i}));
                    }
                });
            },
            json: (load) => {

                var size = Object.keys(load).length - 1;
                function* thread() {
                    var index = 0;
                    while (index < size) {
                        yield index++;
                    }
                }
                return new Promise((resolve) => {
                    var jsonResolve = {};
                    var i;
                    var iterator = thread();
                    for (i in load) {
                        jsonLoader.load(load[i], function (texture) {
                            jsonResolve[this.i] = texture;
                            iterator.next().done === true && (resolve(jsonResolve));
                        }.bind({i: i}));
                    }
                });
            },
            objmtl: (load) => {
                var size = Object.keys(load).length - 1;
                function* thread() {
                    var index = 0;
                    while (index < size) {
                        yield index++;
                    }
                }
                return new Promise((resolve) => {
                    var objmtlResolve = {};
                    var i;
                    var iterator = thread();
                   
                    for (i in load) {
                  
                        objmtlLoader.load(load[i][0], function (texture) {
                            
                            texture.baseUrl=load[i][0].substring(0, load[i][0].lastIndexOf("/") + 1);
                            texture.preload();
                            var objLoader = new THREE.OBJLoader();
                            objLoader.setMaterials( texture );
                            objLoader.load( load[i][1], function ( object ) {
                                objmtlResolve[i] = object;
                                iterator.next().done === true && (resolve(objmtlResolve));
                            });
                        
                        }.bind({i: i}));
                    }
                });

            }
        },
        color: {
            byte2Hex: (n) => {
                return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
            },
            RGB2Color: (r, g, b) => {
                return  "0x" + TOOLS.color.byte2Hex(r) + TOOLS.color.byte2Hex(g) + TOOLS.color.byte2Hex(b);
            }
        }
    }
}()