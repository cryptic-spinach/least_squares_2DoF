import { sketch_1DoF } from "./fitline-sketch/animation.js"
import { paraboloid_sketch } from "./paraboloid-sketch/animation.js"

export let fitline = new p5(sketch_1DoF, document.querySelector(".fitline"));
export let paraboloid = new p5(paraboloid_sketch, document.querySelector(".paraboloid"));

export let pointData = [ { "x": -130, "y": -40, "label": "1" }, { "x": -90, "y": 40, "label": "2" }, { "x": -30, "y": 60, "label": "3" }, { "x": 30, "y": 150, "label": "4" }, { "x": 70, "y": 200, "label": "5" }, { "x": 130, "y": 210, "label": "6" } ]

// Selectors
export let sliderContainer = document.querySelector(".slider-container");

export let sliderCanvasShare = 1/6;


if (window.innerWidth/window.innerHeight > (16/9)) {
    sliderContainer.setAttribute("style", "width:" + (window.innerHeight*(16/9) * sliderCanvasShare).toString() + "px;" + "height:" + (window.innerHeight).toString() + "px;");
}
else {
    sliderContainer.setAttribute("style", "width:"  + (window.innerWidth * sliderCanvasShare).toString() + "px;" + "height:" + (window.innerWidth/(16/9)).toString() + "px;")
}

window.onresize = () => {

    if (window.innerWidth/window.innerHeight > (16/9)) {
        sliderContainer.setAttribute("style", "width:" + (window.innerHeight*(16/9) * sliderCanvasShare).toString() + "px;" + "height:" + (window.innerHeight).toString() + "px;")
    }
    else {
        sliderContainer.setAttribute("style", "width:"  + (window.innerWidth * sliderCanvasShare).toString() + "px;" + "height:" + (window.innerWidth/(16/9)).toString() + "px;")
    }
  
}

