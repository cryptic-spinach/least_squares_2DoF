import { canvasConfig, sliderConfig, axisConfig, palette, trendlineConfig, stepperButtonConfig, sliderLabelConfig, trendlineLabelConfig, styles, curveConfig, testPoint1Config, testPoint2Config } from "./configs.js";
import { controlsInit } from "./controls.js";
import { formatTableAsJson, showValue, showValues, sliderInit, positionButton} from "./helpers.js"
import { Point, Segment, Axes, PointCloud, Slider } from "./components.js";
import { getTrendlineDisplay, getTrendlineLabelDisplay, getErrorCurveDisplay, getCoordinateLabelDisplay, getStaticCoordinateLabelDisplay } from "./stepper.js"
import { generateLinearFitPoints, generateErrorCurvePoints, hardcodeLinearFitPoints } from "./point-factory.js";

export let sketch_1DoF = myp5 => {
  myp5.aSlider;
  myp5.bSlider;
  myp5.linearFitPoints;
  let errorCurvePoints;
  myp5.originalTrendline;
  myp5.buttons;
  myp5.stepper;

  myp5.setup = () => {
    myp5.createCanvas(myp5.windowWidth - canvasConfig.trimX, myp5.windowHeight - canvasConfig.trimY);
  
    controlsInit();
    myp5.buttons = myp5.buttonsInit(myp5);
    myp5.aSlider = document.querySelector(".a-slider");
    myp5.bSlider = document.querySelector(".b-slider");

    myp5.linearFitPoints = hardcodeLinearFitPoints(myp5);
    //linearFitPoints = generateLinearFitPoints(myp5, 5);
    errorCurvePoints = generateErrorCurvePoints(myp5, myp5.linearFitPoints);

    myp5.stepper = 1;


    let trendlineStart = new Point( - axisConfig.left + axisConfig.x - trendlineConfig.extraX, - axisConfig.down + trendlineConfig.yIntInit + axisConfig.y - trendlineConfig.extraY);
    let trendlineEnd   = new Point(  axisConfig.right + axisConfig.x + trendlineConfig.extraX,   axisConfig.up + trendlineConfig.yIntInit + axisConfig.y + trendlineConfig.extraX);
    myp5.originalTrendline = new Segment(trendlineStart, trendlineEnd);
  };

  myp5.draw = () => {
    myp5.background(palette.backgroundFill);
    myp5.translate((myp5.windowWidth - canvasConfig.trimX)/2, (myp5.windowHeight - canvasConfig.trimY)/2);
    myp5.scale(1, -1);
    myp5.angleMode(myp5.RADIANS);
    myp5.updateDOM();

    // Calculation
    let sliderLabel = new Point(sliderLabelConfig.x, sliderLabelConfig.y, "b = " + parseFloat(myp5.bSlider.value).toFixed(2));
    let trendlineLabel = new Point(trendlineLabelConfig.x, trendlineLabelConfig.y, "y = a + bx");

    let trendlineAxes = new Axes(axisConfig.x, axisConfig.y, axisConfig.right, axisConfig.up, axisConfig.left, axisConfig.down, "x", "y");
    let curveAxes = new Axes(-axisConfig.x, axisConfig.y, axisConfig.right, axisConfig.up, axisConfig.left, axisConfig.down, "b = " + parseFloat(myp5.bSlider.value).toFixed(2), "Error", axisConfig.horizontalLabelXOffset, axisConfig.horizontalLabelYOffset, axisConfig.verticalLabelXOffset, axisConfig.verticalLabelYOffset);


    // let trendlineStart = new Point( - axisConfig.left + axisConfig.x, - axisConfig.down + axisConfig.y + parseFloat(myp5.aSlider.value) * axisConfig.up/2);
    // let trendlineEnd   = new Point(  axisConfig.right + axisConfig.x,   axisConfig.up + axisConfig.y + parseFloat(myp5.aSlider.value) * axisConfig.up/2);
    
    let trendlineStart = new Point(  - axisConfig.left + axisConfig.x, axisConfig.y + parseFloat(myp5.aSlider.value) * axisConfig.up/2);
    let trendlineEnd   = new Point( axisConfig.right + axisConfig.x,  axisConfig.y + parseFloat(myp5.aSlider.value) * axisConfig.up/2);
    
    let trendline = new Segment(trendlineStart, trendlineEnd);

    let pivot = new Point(axisConfig.x, axisConfig.y + parseFloat(myp5.aSlider.value) * axisConfig.up/2)

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

    getTrendlineLabelDisplay(myp5, myp5.stepper, trendlineLabel);
    getErrorCurveDisplay(myp5, myp5.stepper, errorCurveCloud, trendline, myp5.linearFitPoints, curveAxes);
    getCoordinateLabelDisplay(myp5, myp5.stepper, trendline, linearFitCloud.points);
    getStaticCoordinateLabelDisplay(myp5, myp5.stepper, myp5.originalTrendline, linearFitCloud.points);
    
    // myp5.noLoop()
  };

  myp5.windowResized = () => {
    myp5.resizeCanvas(myp5.windowWidth - canvasConfig.trimX, myp5.windowHeight - canvasConfig.trimY);
    myp5.updateDOM();
  }

  myp5.updateDOM = () => {
    let i = 0;
    myp5.buttons.forEach(b => {
      positionButton(myp5, b, i);
      i++;
    })
  }
  
  myp5.keyPressed = () => {
    if (myp5.keyCode == 80) {
      console.log(myp5.linearFitPoints);
    }
  }

  myp5.buttonsInit = () => {
    let ret = [];
    let cnv = document.querySelector(".fitline")
  
    for (let i = 0; i < 2; i++) {
      let stepperButton = document.createElement("button");
      stepperButton.innerHTML = (i+1).toString();
      stepperButton.className = "stepper-buttons";
      positionButton(myp5, stepperButton, i)
      stepperButton.addEventListener("click", () => {
        myp5.stepper = i + 1;
      })
      cnv.appendChild(stepperButton);
      ret.push(stepperButton);
    }
  
    
    return ret;
  }

};