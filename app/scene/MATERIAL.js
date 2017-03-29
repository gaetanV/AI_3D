MATERIAL = function () {
    var boot = false;
    
    var tasks = {
        modelJson:{},
        texture:{},
    }
    
    var complete = {}
    function result(){
        this.texture = {};
        this.modelJson = {};
        this.material = {};
    }
    
    return {
        set: (entity, option) => {
            for (var i in option) {
                switch (i) {
                    case "texture":
                        tasks.texture[entity] = option[i];
                        break;
                    case "modelJson":
                        tasks.modelJson[entity] = option[i];
                        break;
                    case "material":
                        !complete[entity] && (complete[entity] = new result());
                        complete[entity].material = option[i];
                        break;
                    default:
                        throw "option not yet supported";
                }
            }
        },
        get: (entity) => {
            if (!boot) {
                throw "you must boot";
            }
            return complete[entity];

        },
        boot: (resolve) => {
            var size = Object.keys(tasks.texture).length + Object.keys(tasks.modelJson).length;
            size === 0 && resolve();
            function* thread() {
                var index = 0;
                while (index < size - 1) {
                    yield index++;
                }
            }
            var iterator = thread();
            for (var a in tasks.texture) {
                TOOLS.loader.texture(tasks.texture[a]).then(function (textureCallBack) {
                    !complete[this.a] && (complete[this.a] = new result());
                    complete[this.a].texture = textureCallBack;
                    if (iterator.next().done === true) {
                        boot = true;
                        resolve();
                    }
                }.bind({a: a}));
            }
            for (var a in tasks.modelJson) {
                TOOLS.loader.json(tasks.modelJson[a]).then(function (geometryCallBack) {
                    !complete[this.a] && (complete[this.a] = new result());
                    complete[this.a].modelJson = geometryCallBack;
                    if (iterator.next().done === true) {
                        boot = true;
                        resolve();
                    }
                }.bind({a: a}));
            }
        }
    };

}();

