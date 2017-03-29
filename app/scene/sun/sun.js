function sun(position) {
    this.model = new THREE.SpotLight(0xffffff, 0.5);
    this.model.position.set(position.x, position.y, position.z);
    this.model.castShadow = true;
    this.model.shadow.camera.fov = 500;
    this.model.shadow.mapSize.width = 1024;
    this.model.shadow.mapSize.height = 1024;
    this.model.penumbra = 1;
    this.model.target.position.set(position.x, position.y, 0);
    this.model.color.R = 255;
    this.model.color.V = 255;
    this.model.color.B = 255;
    this.model.position.angle = 0;
    this.states = {day: 0, set: 1, rise: 2, night: 3}
    this.animation = {
        state: this.states.day,
        frame: 0
    }
    return {
        model: this.model,
        interface: {
            animate : this.animate.bind(this)
        }
    };
}

sun.prototype.animate = function () {
    switch (this.animation.state) {
        case this.states.day:
            this.animation.frame++;
            if (this.animation.frame > 200) {
                this.animation.state = this.states.set;
                this.animation.frame = 0;
            }
            break;
        case this.states.set:
            if (this.model.position.angle >= (Math.PI / 2)) {
                if (this.model.shadowDarkness > 0 && this.model.intensity > 0) {
                    this.model.shadowDarkness -= 0.01;
                    this.model.intensity -= 0.01;
                }
            }
            if (this.model.position.angle >= (Math.PI)) {
                this.animation.state = this.states.night;
                this.animation.frame = 0;
            } else {
                this.animation.frame++;
                if (this.model.color.V > 150) {
                    this.model.color.V -= 1;
                }
                if (this.model.color.B > 0) {
                    this.model.color.B -= 1;
                }
                var hexa = TOOLS.color.RGB2Color(this.model.color.R, this.model.color.V, this.model.color.B);
                this.model.color.setHex(hexa);
                var angle = Math.PI / 2 / 200;
                this.model.position.angle += angle;
                var euler = new THREE.Euler(0, angle, 0, 'XYZ');
                this.model.position.applyEuler(euler);
            }
            break;
        case this.states.rise:
            if (this.model.position.angle >= (Math.PI / 2 * 3)) {
                if (this.model.shadowDarkness < 1 && this.model.intensity < 1) {
                    this.model.shadowDarkness += 0.01;
                    this.model.intensity += 0.01;
                }
            }
            this.animation.frame++;
            if (this.model.color.V < 250) {
                this.model.color.V += 1;
            }
            if (this.model.color.B < 255) {
                this.model.color.B += 1;
            }
            var hexa =  TOOLS.color.RGB2Color(this.model.color.R, this.model.color.V, this.model.color.B);
            this.model.color.setHex(hexa);
            angle = Math.PI / 2 / 200;
            var euler = new THREE.Euler(0, angle, 0, 'XYZ');
            this.model.position.applyEuler(euler);
            this.model.position.angle += angle;
            if (this.model.position.angle >= (Math.PI * 2)) {
                this.animation.state = this.states.day;
                this.model.position.angle = 0;
                this.animation.frame = 0;
            }
            break;
        case this.states.night:
            this.animation.frame++;
            if (this.animation.frame > 100) {
                this.animation.state = this.states.rise;
                this.animation.frame = 0;
            }
            break;
    }
}

