var minSize: number = 100;
var maxSize: number = 1000;
var locWidth: number = window.screen.availWidth;
var locHeight: number = window.screen.availHeight

/**
 * Color the background or text
 **/
interface BGColors {
  bgColor: string;
  txtColor: string;
}

/**
 * Main object class to create tween objects.
 **/
class ObjectTween {

  private obj: any;
  private tween: any;
  private tweenInitialized: boolean = false;

  constructor(obj:any) {
    this.obj = obj;

  }

  getName() {
    if (this.obj instanceof HTMLCollection) {
      return "[" + this.obj[0].className + "]";
    }
    else {
      return this.obj.id;
    }
  }

  getTween() {
    if (this.tweenInitialized === false) {
      this.tween = this.initTween();
      this.tweenInitialized = true;
    }
    return this.tween;
  }

  initTween() {

  }

  removeTween() {

    if (this.obj instanceof HTMLCollection) {
      [].forEach.call(this.obj, function(el) {
        el.style.display = "none";
      });
    }
    else {
      this.obj.style.display = "none";
    }
  }
}

class BubbleCreator extends ObjectTween {

  private element: any;

  constructor(element: any) {
    super(element);
    this.element = element;
  }

  initTween() {
    var self = this;
    var tweens = [];
    [].forEach.call(this.element, function(el) {
      var element = el;
      var delay = Math.random() * 1;
      self.regen(el);
      tweens.push(
        TweenMax.from(
          element,
          2,
          {scale: 0, opacity: 1, borderWidth: "20px", ease: Circ.easeOut, delay: delay, repeat: -1, onRepeat :function(){self.regen(element);}}
        )
      );
    });

    return tweens;
  }

  regen(element:any) {
    var size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    var locX = Math.floor(Math.random() * (locWidth + 1));
    var locY = Math.floor(Math.random() * (locHeight + 1));
    element.style.width = size;
    element.style.height = size;
    element.style.left = locX;
    element.style.top = locY;
  }
}

class BackgroundCreator extends ObjectTween {

  private bgColors: Array<BGColors>;
  private $videoClip:any;
  private parallelTime1 = new TimelineLite();

  constructor(bgColors: Array<BGColors>, videoClipElement:any) {
    super(videoClipElement);
    this.bgColors = bgColors;
    this.$videoClip = videoClipElement;
  }

  initTween() {
    var bgColorIdx = this.bgColors.length;

    for (var idx = 0; idx < bgColorIdx; idx++) {
      var color = this.bgColors[idx];
      if(idx === 0) {
        this.parallelTime1.set(this.$videoClip, {backgroundColor: color.bgColor});
      }else {
        this.parallelTime1.to(this.$videoClip, 50, {backgroundColor: color.bgColor,delay:1});
      }
    }
    return [this.parallelTime1];
  }
}

class TextCreator extends ObjectTween {
  private texts:Array<string>;
  private $textElement:any;
  private parallelTime = new TimelineLite();

  constructor(text:Array<string>, textElement:any) {
    super(textElement);
    this.texts = text;
    this.$textElement = textElement;
  }

  initTween() {
    var self = this;
    var textIdx = self.texts.length;

    for(var idx = 0; idx < textIdx; idx++) {
      this.parallelTime.set(this.$textElement, {opacity: 1, textShadow: "0 0 2px #000000", text: self.texts[idx]})
                        .to(this.$textElement, 2, {delay: 1, opacity: 0.1, textShadow: "0 0 15px #000000"});
    }
    return this.parallelTime;
  }
}

class CreatePopUpLayer extends ObjectTween {
  private element;

  constructor(element: any) {
    super(element);
    this.element = element;
    element.style.width = "56px";
    element.style.height = "56px";
    element.style.borderRadius = "50px";
  }

  initTween() {
    var tween = TweenMax.to(
      this.element,
      0.5,
      {opacity: 1, width: "100%", height: "100%", borderRadius: 0, top: 0, left: 0}
    )
    return tween;
  }
}

class CreateStandardTweenTO extends ObjectTween {
  private element;
  private alter: any;
  private duration: number;

  constructor(element: any, alter: any, duration: number) {
    super(element);
    this.element = element;
    this.alter = alter;
    this.duration = duration;
  }

  initTween() {
    var tween = TweenMax.to(
      this.element,
      this.duration,
      this.alter
    );
    return tween;
  }
}
