import { trendlineConfig, axisConfig, curveConfig, sliderConfig} from "./configs.js";
import { Point, PointCloud } from "./components.js";
import { pointData } from "../main.js";

export function generateLinearFitPoints(myp5, numberOfPoints) {
    let ret = []
  
    let m = trendlineConfig.slopeInit;
    let b = trendlineConfig.yIntInit;
    let errorRange = trendlineConfig.maxError;
  
    for (let i = 0; i < numberOfPoints; i++) {
      let xMin = - axisConfig.left;
      let xMax = axisConfig.right;
  
      let x = myp5.random(xMin, xMax);
      let y = myp5.random(m*x + b - errorRange, m*x + b + errorRange);
      
      let point = new Point(parseInt(x), parseInt(y), (i + 1).toString());
      ret.push(point);
    }
  
    return ret;
  }

export function generateErrorCurvePoints(myp5, points) {
    let path = [];

    let qua  = points.map(p => p.x * p.x).reduce((partialSum, a) => partialSum + a, 0)     ;
    let lin  = points.map(p => p.x * p.y).reduce((partialSum, a) => partialSum + a, 0) * -2;
    let con  = points.map(p => p.y * p.y).reduce((partialSum, a) => partialSum + a, 0)     ;

    for (let b = sliderConfig.min; b < sliderConfig.max; b += 0.01) {
        let xPos = b;
        let yPos = (qua*b*b + lin*b + con);

        path.push({"x": xPos, "y": yPos});
    }

    return path;
}


export function hardcodeLinearFitPoints() {
  let ret = [];

  // let pointData = [ { "x": -130, "y": -40, "label": "1" }, { "x": -90, "y": 40, "label": "2" }, { "x": -30, "y": 60, "label": "3" }, { "x": 30, "y": 150, "label": "4" }, { "x": 70, "y": 200, "label": "5" }, { "x": 130, "y": 210, "label": "6" } ]

  pointData.forEach(p => {
    let point = new Point(p.x, p.y, p.label);
    ret.push(point);
  })

  return ret
}
