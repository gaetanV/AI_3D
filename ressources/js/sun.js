function sun(lightspot) {
    this.sun = lightspot;
    this.sun.color.R = 255;
    this.sun.color.V = 255;
    this.sun.color.B = 255;
    this.sun.position.angle = 0;
    this.sun.frame = 0;
    this.sun.animate = "day";
}

sun.prototype.animate = function () {
    function byte2Hex(n)
    {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }
    function RGB2Color(r, g, b)
    {
        return  byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }
    switch (this.sun.animate) {
        case "day":
            this.sun.frame++;
            if (this.sun.frame > 200) {
                this.sun.animate = "set";
                this.sun.frame = 0;
            }
            break;
        case "set":
            if (this.sun.position.angle >= (Math.PI / 2)) {
                if (this.sun.shadowDarkness > 0 && this.sun.intensity > 0) {
                    this.sun.shadowDarkness -= 0.01;
                    this.sun.intensity -= 0.01;
                }
            }
            if (this.sun.position.angle >= (Math.PI)) {
                this.sun.animate = "night";
                this.sun.frame = 0;
            } else {
                this.sun.frame++;
                if (this.sun.color.V > 150) {
                    this.sun.color.V -= 1;
                }
                if (this.sun.color.B > 0) {
                    this.sun.color.B -= 1;
                }
                var hexa = "0x" + RGB2Color(this.sun.color.R, this.sun.color.V, this.sun.color.B);
                this.sun.color.setHex(hexa);
                var angle = Math.PI / 2 / 200;
                this.sun.position.angle += angle;
                var euler = new THREE.Euler(0, angle, 0, 'XYZ');
                this.sun.position.applyEuler(euler);
            }
            break;
        case "rise":
            if (this.sun.position.angle >= (Math.PI / 2 * 3)) {
                if (this.sun.shadowDarkness < 1 && this.sun.intensity < 1) {
                    this.sun.shadowDarkness += 0.01;
                    this.sun.intensity += 0.01;
                }
            }
            this.sun.frame++;
            if (this.sun.color.V < 250) {
                this.sun.color.V += 1;
            }
            if (this.sun.color.B < 255) {
                this.sun.color.B += 1;
            }
            var hexa = "0x" + RGB2Color(this.sun.color.R, this.sun.color.V, this.sun.color.B);
            this.sun.color.setHex(hexa);
            angle = Math.PI / 2 / 200;
            var euler = new THREE.Euler(0, angle, 0, 'XYZ');
            this.sun.position.applyEuler(euler);
            this.sun.position.angle += angle;
            if (this.sun.position.angle >= (Math.PI * 2)) {
                this.sun.animate = "day";
                this.sun.position.angle = 0;
                this.sun.frame = 0;
            }
            break;
        case "night":
            this.sun.frame++;
            if (this.sun.frame > 100) {
                this.sun.animate = "rise";
                this.sun.frame = 0;
            }
            break;

    }
}
sun.prototype.remove = function () {
    this.scene.remove(this.sun);
}
