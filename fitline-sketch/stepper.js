import { axisConfig, sliderConfig, trendlineConfig, sliderLabelConfig, palette} from "./configs.js";

export function getTrendlineDisplay(myp5, stepper, trendline, point) {
    switch (stepper) {
      case 1:
        trendline.showSquaredError(myp5, point);
        break;
      case 2:
        trendline.showSquaredError(myp5, point);
        break;
    }
  }

  export function getTrendlineLabelDisplay(myp5, stepper, trendlineLabel) {
    switch (stepper) {
      case 1:
        trendlineLabel.showLabel(myp5, trendlineConfig.labelFill);
        break;
      case 2:
        trendlineLabel.showLabel(myp5, trendlineConfig.labelFill);
        break;
    }
  }

  export function getErrorCurveDisplay(myp5, stepper, errorCurveCloud, trendline, linearFitPoints, axes) {
    switch (stepper) {
      case 1:
        break;
      case 2:
        break;
    }
  }




export function getStaticCoordinateLabelDisplay(myp5, stepper, trendline, points) {
  switch (stepper) {
    case 1:
      break;
    case 2:
      break;
  }
}

export function getCoordinateLabelDisplay(myp5, stepper, trendline, points) {
  switch (stepper) {
    case 1:
      break;
    case 2:
      break;
  }
}
