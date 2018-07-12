class Animate {

  /**Main object to control the time execution
  **/
  private $mainTimeline: any = new TimelineMax({delay:1});

  private $objects = {
    cube: document.getElementById("cube"),
    balls: document.getElementsByClassName("particle")
  };


  constructor() {
    //do nothing
  }

  start() {
    this.animateCube();
    this.animateParticle();
  }

  animateCube() {
    var tween = TweenMax.to(
      this.$objects.cube,
      10,
      {rotationY: 360, repeat: -1, ease: Linear.easeIn}
    );
  }

  animateParticle() {
    var tween = TweenMax.to(
      this.$objects.balls[1],
      10,
      {transform: "translateY(50px) translateX(100px)", repeat: -1, ease: Linear.easeIn}
    );
  }
}
