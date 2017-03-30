function audio(sources) {
    var audio = document.createElement('audio');
    var source = document.createElement('source');
    source.src = sources
    source.preload = "auto|metadata|none";
    audio.appendChild(source);
    this.play = function () {
        audio.pause();
        this.currentTime = 0;
        audio.play();
    }
}
