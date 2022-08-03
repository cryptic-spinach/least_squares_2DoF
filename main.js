import { sketch_1DoF } from "./fitline-sketch/animation.js"
import { paraboloid_sketch } from "./paraboloid-sketch/animation.js"

export let fitline = new p5(sketch_1DoF, document.querySelector(".fitline"));
export let paraboloid = new p5(paraboloid_sketch, document.querySelector(".paraboloid"));