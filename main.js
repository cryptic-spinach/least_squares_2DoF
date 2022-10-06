import { sketch_1DoF } from "./fitline-sketch/animation.js"
import { paraboloid_sketch } from "./paraboloid-sketch/animation.js"

export let fitline = new p5(sketch_1DoF, document.querySelector(".fitline"));
export let paraboloid = new p5(paraboloid_sketch, document.querySelector(".paraboloid"));

export let pointData = [ { "x": -130, "y": -40, "label": "1" }, { "x": -90, "y": 40, "label": "2" }, { "x": -30, "y": 60, "label": "3" }, { "x": 30, "y": 150, "label": "4" }, { "x": 70, "y": 200, "label": "5" }, { "x": 130, "y": 210, "label": "6" } ]

let sliderContainer = document.querySelector(".slider-container")

if (window.innerWidth/window.innerHeight > (16/9)) {
    // myp5.createCanvas(myp5.windowHeight*(16/9)/2, myp5.windowHeight);
    sliderContainer.width = window.innerHeight*(16/9)/3;
    sliderContainer.height = window.innerHeight;
}
else {
    // myp5.createCanvas(myp5.windowWidth/2, myp5.windowWidth/(16/9));
    sliderContainer.width = window.innerWidth/3;
    sliderContainer.height = window.innerWidth/(16/9);
}

window.onresize = () => {

    if (window.innerWidth/window.innerHeight > (16/9)) {
        // myp5.createCanvas(myp5.windowHeight*(16/9)/2, myp5.windowHeight);
        sliderContainer.width = window.innerHeight*(16/9)/3;
        sliderContainer.height = window.innerHeight;
    }
    else {
        // myp5.createCanvas(myp5.windowWidth/2, myp5.windowWidth/(16/9));
        sliderContainer.width = window.innerWidth/3;
        sliderContainer.height = window.innerWidth/(16/9);
    }
  
}

