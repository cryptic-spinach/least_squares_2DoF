import { sketch_1DoF } from "./fitline-sketch/animation.js"
import { paraboloid_sketch } from "./paraboloid-sketch/animation.js"

let fitline = new p5(sketch_1DoF, document.querySelector(".fitline"));
let paraboloid = new p5(paraboloid_sketch, document.querySelector(".paraboloid"));