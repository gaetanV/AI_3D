MATERIAL = function () {
    var boot = false;

    var tasks = {
        modelJson: {},
        texture: {},
        material: {},
        sound: {},
    }

    var complete = {}
    function result() {
        this.texture = {};
        this.modelJson = {};
        this.material = {};
        this.sound = {};
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
                        tasks.material[entity] = option[i];
                        break;
                    case "sound":
                        tasks.sound[entity] = option[i];
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
            firstPass(resolve);
            function  firstPass(resolve) {
                var size = Object.keys(tasks.texture).length + Object.keys(tasks.modelJson).length + Object.keys(tasks.sound).length;
                size === 0 && secondPass(resolve);
                function* thread() {
                    var index = 0;
                    while (index < size - 1) {
                        yield index++;
                    }
                }
                var iterator = thread();
                for (var a in tasks.sound) {
                        //OPTION PRELOAD ?
                        !complete[a] && (complete[a] = new result());
                        complete[a].sound = tasks.sound[a];
                }
              
                for (var a in tasks.texture) {

                    TOOLS.loader.texture(tasks.texture[a]).then(function (textureCallBack) {
                        !complete[this.a] && (complete[this.a] = new result());
                        complete[this.a].texture = textureCallBack;
                        if (iterator.next().done === true) {
                            secondPass(resolve);
                        }
                    }.bind({a: a}));
                }
                for (var a in tasks.modelJson) {
                    TOOLS.loader.json(tasks.modelJson[a]).then(function (geometryCallBack) {
                        !complete[this.a] && (complete[this.a] = new result());
                        complete[this.a].modelJson = geometryCallBack;
                        if (iterator.next().done === true) {
                            secondPass(resolve);
                        }
                    }.bind({a: a}));
                }
            }
            function  secondPass(resolve) {
                var size = Object.keys(tasks.material).length;
                size === 0 && resolve();
                function* thread() {
                    var index = 0;
                    while (index < size - 1) {
                        yield index++;
                    }
                }
                var iterator = thread();
                for (var a in tasks.material) {
                    !complete[a] && (complete[a] = new result());
                    var b = tasks.material[a];
                    complete[a].material = {};
                    for (var i in b) {
                        var c = b[i];
                        if (c.option.map) {
                            var texture = complete[a].texture[c.option.map];
                            if(! texture){
 
                                 throw "wrong mapping material '"+c.option.map+"' not found";
                            }
                            c.option.map = texture;
                        }
                        // TO DO MAP REPERTORY
                        complete[a].material[i] = new THREE[c.type](c.option);
                    }
                    if (iterator.next().done === true) {
                        boot = true;
                        resolve();
                    }
                }
            }
           
        }
    };

}();

