function ANIMATE(mesh, animOffset, duration, keyframe) {

    this.animOffset = animOffset;
    // milliseconds to complete animation
    this.duration = duration;
    // total number of animation frames
    this.keyframe = keyframe;
    // previous keyframe
    this.lastKeyframe = 0;
    this.currentKeyframe = 0;

    this.interpolation = this.duration / this.keyframe;
    this.mesh = mesh;
}

ANIMATE.prototype.next = function () {

    // ANIMATE THE MODEL
    var time = new Date().getTime() % this.duration;
    this.keyframe = Math.floor(time / this.interpolation) + this.animOffset;
    if (this.keyframe !== this.currentKeyframe)
    {
        this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 0;
        this.mesh.morphTargetInfluences[ this.currentKeyframe ] = 1;
        this.mesh.morphTargetInfluences[ this.keyframe ] = 0;
        this.lastKeyframe = this.currentKeyframe;
        this.currentKeyframe = this.keyframe;
    }
    this.mesh.morphTargetInfluences[ this.keyframe ] = (time % this.interpolation) / this.interpolation;
    this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 1 - this.mesh.morphTargetInfluences[ this.keyframe ];

}