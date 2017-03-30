TOOLS = function () {
    var nybHexString = "0123456789ABCDEF";
    var texloader = new THREE.TextureLoader();
    return {
        loader: {
            texture: (load) => {
                var size = Object.keys(load).length - 1;        
                function* thread() {
                    var index = 0;
                    while (index < size ) {
                        yield index++;
                    }
                }
                return new Promise((resolve) => {
                    var textureResolve = {}
                    var i = 0;
                    var iterator = thread();
                    for  (i in load) {
                        texloader.load(load[i], function (texture) {
                            textureResolve[this.i] = texture;
                            iterator.next().done === true && (resolve(textureResolve));
                        }.bind({i:i}));
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