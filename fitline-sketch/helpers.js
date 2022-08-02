import { axisConfig, canvasConfig, sliderConfig, trendlineConfig, debugConfig, stepperButtonConfig, curveConfig} from "./configs.js";
import { Point } from "./components.js"


export function toSeconds (milliseconds) {
    return (milliseconds / 1000).toFixed(2);
  }
  
export function formatTableAsJson (data) {
  let ret = {};

  for (let i = 0; i < data.getRowCount(); i++) {
    let rowKey = data.rows[i].arr[0].toString();
    let rowX = data.rows[i].arr[1].toString();
    let rowY = data.rows[i].arr[2].toString();
    ret[rowKey] = {x: rowX, y: rowY};
  }
  return ret;
}


export function sliderInit(myp5) {
  let ret;
  let sliderWidth = curveConfig.xScale * (sliderConfig.max - sliderConfig.min) * 1.02;

  ret = myp5.createSlider(sliderConfig.min, sliderConfig.max, 1, 0.01);
  ret.position((myp5.windowWidth - canvasConfig.trimX)/2 + sliderConfig.x, (myp5.windowHeight - canvasConfig.trimY)/2 + sliderConfig.y);
  ret.style('width', sliderWidth.toString() + "px");
  ret.class("b-control-with-axes");
  return ret;
}


export function positionButton(myp5, button, index) {
  button.style.left = parseInt(stepperButtonConfig.x + (myp5.windowWidth  - canvasConfig.trimX)/2 + 90 * index).toString() + "px";
  button.style.top  = parseInt(stepperButtonConfig.y + (myp5.windowHeight - canvasConfig.trimY)/2             ).toString() + "px";
}


export function showValues(myp5, pairs) {
  for (let i = 0; i < pairs.length; i++) {
    showValue(myp5, pairs[i].key, pairs[i].value, i);
  }
}

export function showValue(myp5, key, value, position = 0) {
  let keyPoint = new Point(debugConfig.showValueX, debugConfig.showValueY + position * 50, key);
  let valuePoint = new Point(debugConfig.showValueX + debugConfig.showValueSpacer, debugConfig.showValueY + position * 50, value);  
  keyPoint.showLabel(myp5, "#ffffff");
  valuePoint.showLabel(myp5, "#ffffff");
}