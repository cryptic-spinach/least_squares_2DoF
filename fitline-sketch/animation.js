import { canvasConfig, sliderConfig, axisConfig, palette, trendlineConfig, stepperButtonConfig, sliderLabelConfig, trendlineLabelConfig, styles, curveConfig, testPoint1Config, testPoint2Config } from "./configs.js";
import { controlsInit } from "./controls.js";
import { formatTableAsJson, showValue, showValues, sliderInit, positionButton, positionASlider, positionBSlider, positionParaboloid} from "./helpers.js"
import { Point, Segment, Axes, PointCloud, Slider } from "./components.js";
import { getTrendlineDisplay, getTrendlineLabelDisplay, getErrorCurveDisplay, getCoordinateLabelDisplay, getStaticCoordinateLabelDisplay, getParaboloidDisplay, getSliderDisplay } from "./stepper.js"
import { generateLinearFitPoints, generateErrorCurvePoints, hardcodeLinearFitPoints } from "./point-factory.js";

export let sketch_1DoF = myp5 => {
  myp5.aSlider;
  myp5.bSlider;
  myp5.linearFitPoints;
  let errorCurvePoints;
  myp5.originalTrendline;
  myp5.stepper;
  myp5.paraboloid;

  myp5.graphics
  let centerX;
  let centerY;

  myp5.setup = () => {
    if (myp5.windowWidth/myp5.windowHeight > 1.77) {
      myp5.createCanvas(myp5.windowHeight*1.77/2, myp5.windowHeight);
    }
    else {
      myp5.createCanvas(myp5.windowWidth/2, myp5.windowWidth/1.77);
    }

    myp5.graphics = myp5.createGraphics(myp5.width, myp5.height);
    centerX = myp5.width/2;
    centerY = myp5.height/2;
  
    controlsInit();
    myp5.aSlider = document.querySelector(".a-slider");
    myp5.bSlider = document.querySelector(".b-slider");
    myp5.paraboloid = document.querySelector(".paraboloid");


    myp5.linearFitPoints = hardcodeLinearFitPoints(myp5);
    //linearFitPoints = generateLinearFitPoints(myp5, 5);
    errorCurvePoints = generateErrorCurvePoints(myp5, myp5.linearFitPoints);

    myp5.stepper = 1;


    let trendlineStart = new Point( - axisConfig.left + axisConfig.x - trendlineConfig.extraX, - axisConfig.down + trendlineConfig.yIntInit + axisConfig.y - trendlineConfig.extraY);
    let trendlineEnd   = new Point(  axisConfig.right + axisConfig.x + trendlineConfig.extraX,   axisConfig.up + trendlineConfig.yIntInit + axisConfig.y + trendlineConfig.extraX);
    myp5.originalTrendline = new Segment(trendlineStart, trendlineEnd);
  };

  myp5.draw = () => {
    myp5.graphics.clear();

    myp5.background(palette.backgroundFill);
    myp5.translate(myp5.windowWidth/2/2, myp5.windowHeight/2);
    myp5.scale(1, -1);
    myp5.angleMode(myp5.RADIANS);
    myp5.updateDOM();

    // Calculation
    // let sliderLabelA = new Point(sliderLabelConfig.ax, -sliderLabelConfig.ay, "a = " + parseFloat(myp5.aSlider.value).toFixed(2));
    // let sliderLabelB = new Point(sliderLabelConfig.bx, -sliderLabelConfig.by, "b = " + parseFloat(myp5.bSlider.value).toFixed(2));
    // let trendlineLabel = new Point(trendlineLabelConfig.x, trendlineLabelConfig.y, "y = a + bx");

    let trendlineAxes = new Axes(axisConfig.x, axisConfig.y, axisConfig.right, axisConfig.up, axisConfig.left, axisConfig.down, "x", "y");
    let curveAxes = new Axes(-axisConfig.x, axisConfig.y, axisConfig.right, axisConfig.up, axisConfig.left, axisConfig.down, "b = " + parseFloat(myp5.bSlider.value).toFixed(2), "Error", axisConfig.horizontalLabelXOffset, axisConfig.horizontalLabelYOffset, axisConfig.verticalLabelXOffset, axisConfig.verticalLabelYOffset);

    // let trendlineStart = new Point( - axisConfig.left + axisConfig.x, - axisConfig.down + axisConfig.y + parseFloat(myp5.aSlider.value) * axisConfig.up/2);
    // let trendlineEnd   = new Point(  axisConfig.right + axisConfig.x,   axisConfig.up + axisConfig.y + parseFloat(myp5.aSlider.value) * axisConfig.up/2);
    
    let trendlineStart = new Point(  - axisConfig.left + axisConfig.x, axisConfig.y + parseFloat(myp5.aSlider.value) * 100);
    let trendlineEnd   = new Point( axisConfig.right + axisConfig.x,  axisConfig.y + parseFloat(myp5.aSlider.value) * 100);
    
    let trendline = new Segment(trendlineStart, trendlineEnd);

    let pivot = new Point(axisConfig.x, axisConfig.y + parseFloat(myp5.aSlider.value) * 100)

    trendline.rotateSegmentByAngle(myp5, parseFloat(myp5.bSlider.value), pivot)
    // trendline.rotateSegmentBySlope(myp5, parseFloat(myp5.bSlider.value), parseFloat(myp5.aSlider.value) * axisConfig.up/2);

    let errorCurveCloud = new PointCloud(errorCurvePoints,  -axisConfig.x, axisConfig.y);
    let linearFitCloud = new PointCloud(myp5.linearFitPoints, axisConfig.x, axisConfig.y)


    // Display
    trendlineAxes.show(myp5);
    trendline.showAsLine(myp5, "#ffffff", 1.5, styles.segmentOpacity);


    linearFitCloud.points.forEach(p => {
      getTrendlineDisplay(myp5, myp5.stepper, trendline, p);
    });

    linearFitCloud.points.forEach(p => {
      p.show(myp5);
    });

    // getTrendlineLabelDisplay(myp5, myp5.stepper, trendlineLabel);
    getErrorCurveDisplay(myp5, myp5.stepper, errorCurveCloud, trendline, myp5.linearFitPoints, curveAxes);
    getCoordinateLabelDisplay(myp5, myp5.stepper, trendline, linearFitCloud.points);
    getStaticCoordinateLabelDisplay(myp5, myp5.stepper, myp5.originalTrendline, linearFitCloud.points);
    getParaboloidDisplay(myp5, myp5.stepper);
    getSliderDisplay(myp5, myp5.stepper, sliderLabelA, sliderLabelB);
    // myp5.noLoop()

    myp5.image(myp5.graphics, 0, 0, myp5.width, myp5.height);
    myp5.graphics.reset();
  };

  myp5.windowResized = () => {
    if (myp5.windowWidth/myp5.windowHeight > 1.77) {
      myp5.resizeCanvas(myp5.windowHeight*1.77/2, myp5.windowHeight);
    }
    else {
      myp5.resizeCanvas(myp5.windowWidth/2, myp5.windowWidth/1.77);
    }
    // myp5.updateDOM();
  }

  myp5.updateDOM = () => {
    positionASlider(myp5, myp5.aSlider)
    positionBSlider(myp5, myp5.bSlider)
    // positionParaboloid(myp5, myp5.paraboloid)
  }
  
  myp5.keyPressed = () => {
    if (myp5.keyCode == 80) {
      console.log(myp5.linearFitPoints);
    }
  }

};