import { axisConfig, palette, styles} from "./configs.js";
import { Point, Segment, Axes, PointCloud} from "./components.js";
import { hardcodeLinearFitPoints } from "./point-factory.js";
import { controlsInit } from "./controls.js";

export let sketch_1DoF = myp5 => {
  myp5.aSlider;
  myp5.bSlider;
  myp5.aSliderLabel
  myp5.bSliderLabel

  myp5.linearFitPoints;
  myp5.graphics;
  myp5.sliderContainer;

  let centerX;
  let centerY;

  let canvasShare;

  let oldSliderA;
  let oldSliderB;

  myp5.setup = () => {

    canvasShare = 5/12;

    if (myp5.windowWidth/myp5.windowHeight > (16/9)) {
      myp5.createCanvas(myp5.windowHeight * (16/9) * canvasShare, myp5.windowHeight);
    }
    else {
      myp5.createCanvas(myp5.windowWidth * canvasShare, myp5.windowWidth/(16/9));
    }

    // myp5.pixelDensity(1);

    myp5.graphics = myp5.createGraphics(1920 * canvasShare, 1080);

    centerX = 1920 * canvasShare /2;
    centerY = 1080/2;
  
    // controlsInit();
    myp5.aSlider = document.querySelector(".a-slider");
    myp5.bSlider = document.querySelector(".b-slider");

    myp5.aSliderLabel = document.querySelector(".a-label");
    myp5.bSliderLabel = document.querySelector(".b-label");

    myp5.sliderContainer = document.querySelector(".slider-container");


    myp5.linearFitPoints = hardcodeLinearFitPoints();
    //linearFitPoints = generateLinearFitPoints(myp5, 5);
  };

  myp5.draw = () => {
    myp5.background(palette.backgroundFill);

    myp5.graphics.clear();
    myp5.graphics.translate(centerX, centerY);
    myp5.graphics.scale(1, -1);
    myp5.graphics.angleMode(myp5.RADIANS);

    let newSliderA = parseFloat(myp5.aSlider.value).toFixed(2);
    let newSliderB = parseFloat(myp5.bSlider.value).toFixed(2);

    if (oldSliderA != newSliderA || oldSliderB != newSliderB) {
      myp5.aSliderLabel.innerHTML = "a = " + newSliderA;
      myp5.bSliderLabel.innerHTML = "b = " + newSliderB;
    }

    oldSliderA = newSliderA;
    oldSliderB = newSliderB;

    let trendlineAxes = new Axes(axisConfig.x, axisConfig.y, axisConfig.right, axisConfig.up, axisConfig.left, axisConfig.down, "x", "y");
    let trendlineStart = new Point(  - axisConfig.left + axisConfig.x, axisConfig.y + parseFloat(myp5.aSlider.value) * 100);
    let trendlineEnd   = new Point( axisConfig.right + axisConfig.x,  axisConfig.y + parseFloat(myp5.aSlider.value) * 100);
    let trendline = new Segment(trendlineStart, trendlineEnd);

    let pivot = new Point(axisConfig.x, axisConfig.y + parseFloat(myp5.aSlider.value) * 100)

    trendline.rotateSegmentByAngle(myp5, parseFloat(myp5.bSlider.value), pivot)

    let linearFitCloud = new PointCloud(myp5.linearFitPoints, axisConfig.x, axisConfig.y)

    // Display
    trendlineAxes.show(myp5);
    trendline.showAsLine(myp5, "#ffffff", 4, styles.segmentOpacity);

    linearFitCloud.points.forEach(p => {
      trendline.showSquaredError(myp5, p);
    });

    linearFitCloud.points.forEach(p => {
      p.show(myp5);
    });

    myp5.image(myp5.graphics, 0, 0, myp5.width, myp5.height);
    myp5.graphics.reset();
  };

  myp5.windowResized = () => {
    if (myp5.windowWidth/myp5.windowHeight > (16/9)) {
      myp5.resizeCanvas(myp5.windowHeight*(16/9) * canvasShare, myp5.windowHeight);
    }
    else {
      myp5.resizeCanvas(myp5.windowWidth * canvasShare, myp5.windowWidth/(16/9));
    }
  }
  
};