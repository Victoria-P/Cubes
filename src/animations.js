class AnimationsHandler {
    static animations = [];

    static animate(time) {
        this.animations.forEach(animation => animation.update(time));
    }

    static add(animation) {
        this.animations.push(animation);
    }

}

export default AnimationsHandler;