import { fitline } from "../main.js"

export let paraboloid_sketch = myp5 => {

    let v = []; //will store all (x,y,z) points of a parabola in here later
    let rows = 15, cols = 15; //resolution of the surface plot
    let xmin = 0.4; //meters
    let xmax = 1.8; //meters
    let ymin = 0.4; //meters
    let ymax = 1.6; //meters
    let movedown = 1.5; //meters (artifically moving the whole parabaloid and axes down)
    
    let scale = 100; // pixels / meter
    let zRotation = 0
    let inconsolata;
    
    myp5.a_slider, 
    myp5.b_slider;
    let a_text, b_text;
    let a_label //label a
    let b_label //label b
    let Error_label //label Error
    
    myp5.preload = () => {
      inconsolata = myp5.loadFont('paraboloid-sketch/Inconsolata.otf');
    }

    myp5.setup = () => {
      myp5.createCanvas(myp5.windowWidth/2, myp5.windowHeight, myp5.WEBGL);
      myp5.angleMode(myp5.DEGREES);
      myp5.colorMode(myp5.RGB);


      a_label = createLabel('a')
      b_label = createLabel('b')
      Error_label = createLabel('error')
    
      myp5.stroke(67, 162, 209);
      myp5.strokeWeight(2);
    
      a_text = myp5.createDiv();
      myp5.a_slider = document.querySelector(".a-slider")// LB, UB, default, Step
      b_text = myp5.createDiv();
      myp5.b_slider = document.querySelector(".b-slider") // LB, UB, default, Step
    
    }
    
    myp5.draw = () => {
      myp5.background("#131626");
      // myp5.orbitControl(4,4);

      myp5.rotateX(90);

      zRotation += 0.2;
      myp5.rotateZ(zRotation);

      myp5.translate(0, 0, -movedown*scale); // set origin lower by amount movedown

        //Add axes labels
        myp5.push()
        myp5.translate(170,0,0)
        myp5.rotateZ(-zRotation);
        myp5.rotateX(270)
        myp5.strokeWeight(0)
        myp5.textSize(40)
        myp5.textFont(inconsolata);
        myp5.textAlign(myp5.CENTER, myp5.CENTER);
        myp5.text('a', 0, 0);
        myp5.pop()
        //y axis label "b"
        myp5.push()
        myp5.translate(0,170,0)
        myp5.rotateZ(-zRotation);
        myp5.rotateX(270)
        myp5.strokeWeight(0)
        myp5.textSize(40)
        myp5.textFont(inconsolata);
        myp5.textAlign(myp5.CENTER, myp5.CENTER);
        myp5.text('b', 0, 0);
        myp5.pop()
        //z axis label "Error"
        myp5.push()
        myp5.translate(0,0,240);
        myp5.rotateZ(-zRotation);
        myp5.rotateX(270)
        myp5.strokeWeight(0)
        myp5.textSize(40)
        myp5.textFont(inconsolata);
        myp5.textAlign(myp5.CENTER, myp5.CENTER);
        myp5.text('Error', 0, 0);
        myp5.pop()
    
      let a_val = parseFloat(myp5.a_slider.value); // meters
      let b_val = parseFloat(myp5.b_slider.value); // meters

      //Create (x,y,z) points of parabaloid
      for(let x_indx = 0; x_indx < cols+1; x_indx += 1) {
        v.push([]);
        for(let y_indx = 0; y_indx < rows+1; y_indx +=1){
          let x = xmin + x_indx * (xmax-xmin)/cols;
          let y = ymin + y_indx * (ymax-ymin)/rows;
          let z = parabola_Equation(x,y);
          x = x * scale; // pixels
          y = y * scale; // pixels
          z = z * scale; // pixels
          myp5.vertex(x, y, z);
    
          let pos = myp5.createVector(x,y,z);
          v[x_indx].push(pos);
        }
      }
    
      //Plot parabaloid by shading in each element
      myp5.push();
      myp5.fill(61, 100, 235, 150);
      myp5.strokeWeight(0.5)
      for(let x_indx = 0; x_indx < v.length; x_indx++){
        for(let y_indx = 0; y_indx < v[x_indx].length; y_indx++){
          if(x_indx < v.length-1 && y_indx < v[x_indx].length-1){
            myp5.beginShape();
            myp5.vertex(v[x_indx][y_indx].x, v[x_indx][y_indx].y, v[x_indx][y_indx].z);
            myp5.vertex(v[x_indx+1][y_indx].x, v[x_indx+1][y_indx].y, v[x_indx+1][y_indx].z);
            myp5.vertex(v[x_indx+1][y_indx+1].x, v[x_indx+1][y_indx+1].y, v[x_indx+1][y_indx+1].z);
            myp5.vertex(v[x_indx][y_indx+1].x, v[x_indx][y_indx+1].y, v[x_indx][y_indx+1].z);
            myp5.endShape(myp5.CLOSE);
          }
        }
      }
      myp5.pop();
    
      v = [];
      let f = parabola_Equation(a_val,b_val) * scale
      a_val = a_val * scale;
      b_val = b_val * scale;
      
      myp5.push();
      myp5.translate(a_val, b_val, f);
      myp5.sphere(5) //point on parabola
      myp5.pop();
    
      myp5.push()
      myp5.translate(a_val,b_val,0);
      myp5.sphere(5) //point on x-y plane
      myp5.pop()
    
      
      let x_base = myp5.createVector(-150,0,0);
      let x_vec = myp5.createVector(300,0,0);
      let y_base = myp5.createVector(0,-150,0);
      let y_vec = myp5.createVector(0,300,0);
      drawArrow(x_base, x_vec, 'white') // x axis
      drawArrow(y_base, y_vec, 'white') // y axis
      myp5.push();
      myp5.stroke('White');
      myp5.strokeWeight(2);
      myp5.line(0,0,0,0,0,200) // z axis
      myp5.pop();
    
      DashedLine(a_val, b_val, 0, a_val, b_val, f); //dashed line
      DashedLine(a_val,0,0,a_val,b_val,0); //dashed line
      DashedLine(0,b_val,0,a_val,b_val,0); //dashed line
    }

    myp5.windowResized = () => {
      myp5.createCanvas(myp5.windowWidth/2, myp5.windowHeight);
    }
    
    function parabola_Equation(x,y) {
      let points = fitline.linearFitPoints;
      let qua_aa  = points.map(p => 1).reduce((partialSum, a) => partialSum + a, 0)                          ; //n
      let qua_bb  = points.map(p => p.x * p.x).reduce((partialSum, a) => partialSum + a, 0)    /(scale*scale); //x1^2 + x2^2 + ...
      let qua_ab  = points.map(p => p.x).reduce((partialSum, a) => partialSum + a, 0) * 2      /scale        ; //2(x1+x2+...)
      let lin_a  = points.map(p => p.y).reduce((partialSum, a) => partialSum + a, 0) * -2      /scale        ; //-2(y1+y2+...)
      let lin_b  = points.map(p => p.x * p.y).reduce((partialSum, a) => partialSum + a, 0) * -2/(scale*scale); //-2(x1*y1 + x2*y2 + ...)
      let con  = points.map(p => p.y * p.y).reduce((partialSum, a) => partialSum + a, 0)       /(scale*scale); //y1+y2+...
      let z = qua_aa*x*x + qua_bb*y*y + qua_ab*x*y + lin_a*x + lin_b*y + con //x*x/2 + y*y/2
      return z/2 //rescale error
    }
    
    function DashedLine(X1,Y1,Z1,X2,Y2,Z2) {
      myp5.push();
      let d = 5; //dashed line length
      let P1 = myp5.createVector(X1,Y1,Z1); //point 1
      let P2 = myp5.createVector(X2,Y2,Z2); //point 2
      let P21 = p5.Vector.sub(P2, P1); // P2 - P1. 
      let L = p5.Vector.mag(P21); // length of line
      let u = p5.Vector.mult(P21,1/L) //unit vector in direction of line
    
      myp5.stroke('White');
      myp5.strokeWeight(2);
    
      // Calculate n and s
      let n;
      let s;
      if (3*d > L) {
        if (d > L) {
          n = 1;
          d = L;
          s = 0;
        } else {
          n = 2;
          s = L-2*d;
        }
      } else {
        n = myp5.floor((L+d)/(2*d)); //number of dashes
        s = (L-n*d)/(n-1); //spacing distance
      }
    
      // Plot n lines
      for (let i = 1; i < n+1; i++) {
        let q1 = (i-1)*d+(i-1)*s;
        let q2 = i*d+(i-1)*s;
    
        let StartDash = p5.Vector.add(p5.Vector.mult(u,q1), P1);
        let EndDash = p5.Vector.add(p5.Vector.mult(u,q2),P1);
    
        let x1 = StartDash.x;
        let y1 = StartDash.y;
        let z1 = StartDash.z;
    
        let x2 = EndDash.x;
        let y2 = EndDash.y;
        let z2 = EndDash.z;
    
        myp5.line(x1,y1,z1,x2,y2,z2);
      }
      myp5.pop()
    }
    
    function drawArrow(base, vec, myColor) {
      myp5.push();
      myp5.stroke(myColor);
      myp5.strokeWeight(1);
      myp5.fill(myColor);
      myp5.translate(base.x, base.y, base.z);
      myp5.line(0, 0, 0, vec.x, vec.y, vec.z);
      myp5.rotate(vec.heading());
      let arrowSize = 12;
      myp5.translate(vec.mag() - arrowSize + 10, 0, 0);
      myp5.rotateZ(-90);
      myp5.cone(6, arrowSize);
      myp5.pop();
    }

    function createLabel(value) {
      let lbl = myp5.createGraphics(100, 20);
      lbl.background(0,0);
      lbl.noStroke();
      lbl.fill(255);
      lbl.textSize(32);
      lbl.text(value, 0, 20);
      
      return lbl;
    }
    
    };