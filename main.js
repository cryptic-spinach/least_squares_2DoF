import { sketch_1DoF } from "./fitline-sketch/animation.js"
import { paraboloid_sketch } from "./paraboloid-sketch/animation.js"

export let fitline = new p5(sketch_1DoF, document.querySelector(".fitline"));
export let paraboloid = new p5(paraboloid_sketch, document.querySelector(".paraboloid"));

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

