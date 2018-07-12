class TimeController {
  /**
   * Main object to control the time execution
   **/
  private $mainTimeline: any = new TimelineMax({delay:1});

  /**
   * Inform program has been initialized
   **/
  private $initialized: boolean = false;

  /**
   * Define all HTML objects that animates.
  **/
  private $objects = {
    bubbles: document.getElementsByClassName("bubbles"),
    videoClip: document.getElementById("video-clip"),
    layer_1_PopUp: document.getElementById("video-clip-layer"),
    layer_1_PopUpText: document.getElementById("txt-hello"),
    layer_1_PopUpTextUser: document.getElementById("txt-hello-user"),
    layer_1_PopUpTextLocation: document.getElementById("txt-hello-location"),
    layer_1_PopUpTextUserLocation: document.getElementById("txt-hello-user-location"),
    layer_1_PopUpTextGreetings: document.getElementById("txt-hello-greetings"),
    layer_1_PopUpTextThanks: document.getElementById("txt-hello-thanks"),
    layer_1_Map: document.getElementById("map"),
    layer_1_Animation: document.getElementById("putt-putt-car"),
    layer_1_Animation_Inner: document.getElementById("putt-putt-car-tyre"),
    layer_1_Animation_Inner2: document.getElementById("putt-putt-car-smog"),
    coloring: [
        {bgColor:"#FFFFFF", txtColor:"#000000"},
        {bgColor:"#0E56C7", txtColor:"#1C1F24"},
        {bgColor:"#A7FA00", txtColor:"#434130"}
      ],
    floatingText: document.getElementById('floatingText'),
    text: ['A Scripting Presentation', 'Created by Walcron']
  };

  constructor() {
    //do nothing
  }

  getTotalDurationInSeconds() {
    return this.$mainTimeline.totalDuration();
  }

  pauseAnimationAt(time:number) {
    return this.$mainTimeline.pause(time);
  }

  isInitialized() {
    return this.$initialized;
  }

  startPgm(configuration: any) {
    var self = this;

    this.$initialized = true;

    configuration = JSON.parse(configuration);

    var tween = {
      bubble: self.makeBubbles(),
      background: self.makeBackground(),
      text: self.makeText(),
      popup_1_Layer: self.makePopUpLayer(),
      popup_1_Text: self.makePopUpText(configuration.userName),
      popup_1_Text_Location: self.makePopUpTextLocation(configuration.userLocation),
      popup_1_Text_TQ: self.makePopUpTextThanks(),
      popup_1_Text_TQ2: self.makePopUpTextThanksMoveUp(),
      popup_1_Text_Greeting: self.makePopUpTextGreetings(),
      popup_1_removeCar: self.removeCar(),
      popup_1_carBouncing: self.makeCarBouncing(),
      popup_1_carTyreBouncing: self.makeCarTyresBouncing(),
      popup_1_carSmog: self.makeCarSmog(),
      popup_1_carMovingForward: self.makeCarMoving(),
      popup_1_scaleCar: self.makeScaleCar(),
      popup_1_map:self.makeMap(configuration.userLocation)
    };

    //Introduction
    self.add(tween.bubble, 0);
    self.add(tween.background, 0);
    self.add(tween.text, 0);
    self.remove([tween.bubble, tween.text], 5, true);
    self.add(tween.popup_1_Layer, 5);
    self.remove([tween.background], 6, false);

    //Show car and gratitude
    self.add(tween.popup_1_carBouncing, 5.5);
    self.add(tween.popup_1_carSmog, 5.5);
    self.add(tween.popup_1_carMovingForward, 5.5);
    self.add(tween.popup_1_carTyreBouncing, 5.5);
    self.remove([tween.popup_1_carBouncing, tween.popup_1_carMovingForward, tween.popup_1_carTyreBouncing, tween.popup_1_carSmog], 16, false);
    self.add(tween.popup_1_scaleCar, 16);
    self.add(tween.popup_1_Text, 17);
    self.add(tween.popup_1_removeCar, 18);
    self.remove([tween.popup_1_scaleCar], 18, true);
    self.add(tween.popup_1_Text_TQ, 18);
    self.add(tween.popup_1_Text_Greeting, 20);
    self.add(tween.popup_1_Text_TQ2, 21);
    self.add(tween.popup_1_map, 21);
    self.remove([tween.popup_1_Text_Greeting], 21, true);
  };

  add(tweenMax:any, duration:number) {
    this.$mainTimeline.add(tweenMax.getTween(), duration);
  }

  remove(tweens: Array<any>, delay: number, removeElement: boolean) {
    var self = this;

    var fn = function() {
      var eleIdx = tweens.length;
      for (var idx = 0; idx < eleIdx; idx++) {
        var selectedTween = tweens[idx];

        self.$mainTimeline.remove(selectedTween.getTween());

        if(removeElement) {
          console.log("Removed:-"+selectedTween.getName());
          selectedTween.removeTween();
        }
      };
    };

    this.$mainTimeline.addCallback(fn, delay);
  }

  start() {
    Util.requestJSON("/public/json/setting.json", this.startPgm.bind(this));
  }

  resume() {
    var self = this;
    return function() {
      self.$mainTimeline.resume();
    }
  }

  pause() {
    var self = this;
    return function() {
      self.$mainTimeline.pause();
    }
  }

  makeBubbles() {
    var obj = this.$objects;
    var bubbleTime = new BubbleCreator(obj.bubbles);
    return bubbleTime;
  }

  makeBackground() {
    var obj = this.$objects;
    var backgroundCreator = new BackgroundCreator(obj.coloring, obj.videoClip);
    var backgroundTime = backgroundCreator;
    return backgroundTime;
  }

  makeText() {
    var obj = this.$objects;
    var textTime = new TextCreator(obj.text, obj.floatingText);
    return textTime;
  }

  makePopUpLayer() {
    var obj = this.$objects;
    var layer = new CreatePopUpLayer(obj.layer_1_PopUp);
    return layer;
  }

  makePopUpText(value: string) {
    var obj = this.$objects.layer_1_PopUpText;
    this.$objects.layer_1_PopUpTextUser.innerText = value;
    var layer = new CreateStandardTweenTO(obj, {opacity: 1, display: "inline"}, 1);
    return layer;
  }

  makePopUpTextThanks() {
    var obj = this.$objects.layer_1_PopUpTextThanks;
    var layer = new CreateStandardTweenTO(obj, {opacity: 1, display: "block"}, 1);
    return layer;
  }

  makePopUpTextGreetings() {
    var obj = this.$objects.layer_1_PopUpTextGreetings;
    var layer = new CreateStandardTweenTO(obj, {opacity: 0, display: "none"}, 1);
    return layer;
  }

  makePopUpTextThanksMoveUp() {
    var obj = this.$objects.layer_1_PopUpTextThanks;
    var layer = new CreateStandardTweenTO(obj, {marginTop: 0 }, 1);
    return layer;
  }

  makeCarBouncing() {
    var obj = this.$objects.layer_1_Animation;
    var layer = new CreateStandardTweenTO(obj, {top: "+=5", repeat: -1}, 2);
    return layer;
  }

  makeCarMoving() {
    var obj = this.$objects.layer_1_Animation;
    var layer = new CreateStandardTweenTO(obj, {left: "0"}, 10);
    return layer;
  }

  makeCarTyresBouncing() {
    var obj = this.$objects.layer_1_Animation_Inner;
    var layer = new CreateStandardTweenTO(obj, {top: "+=2", repeat: -1}, 0.5);
    return layer;
  }

  makeCarSmog() {
    var obj = this.$objects.layer_1_Animation_Inner2;
    var layer = new CreateStandardTweenTO(obj, {opacity: 0, display: "none", repeat: -1}, 1);
    return layer;
  }

  makeScaleCar() {
    var obj = this.$objects.layer_1_Animation;
    var layer = new CreateStandardTweenTO(obj, {scale: 4, top: "50%", left: "50%"}, 1);
    return layer;
  }

  removeCar() {
    var obj = this.$objects.layer_1_Animation;
    var layer = new CreateStandardTweenTO(obj, {opacity: 0, display: "none"}, 1);
    return layer;
  }

  makePopUpTextLocation(value:string){
    this.$objects.layer_1_PopUpTextUserLocation.innerText = value.toUpperCase();
  }

  makeMap(value:string){
    var obj =  this.$objects.layer_1_Map;
    var layer = new CreateStandardTweenTO(obj, {opacity: 1, display: "inline"}, 1);
    var pointer;
    if ( value.toUpperCase() == 'BEIJING' ) {
        pointer = document.getElementById("beijing");
        pointer.style.display = 'block';
    } else {
        pointer = document.getElementById("malaysia");
        pointer.style.display = 'block';
    }

    var el = pointer.getElementsByClassName("pointer");
    TweenMax.to(el, 1, {opacity: 1, display: "inline", repeat: -1});

    return layer;
  }
}
