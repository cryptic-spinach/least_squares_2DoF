import { pointData } from "../main.js";

export let paraboloid_sketch = myp5 => {

    let v = []; //will store all (x,y,z) points of a parabola in here later
    let rows = 15, cols = 15; //resolution of the surface plot
    let xmin = 0.4; //meters
    let xmax = 1.8; //meters
    let ymin = 0.4; //meters
    let ymax = 1.6; //meters
    let movedown = 0.5; //meters (artifically moving the whole parabaloid and axes down)
    
    let scale = 100; // pixels / meter
    let zRotation = 0
    let inconsolata;
    
    myp5.a_slider, 
    myp5.b_slider;
    let a_text, b_text;
    
    myp5.graphics;

    let canvasShare;

    myp5.preload = () => {
      inconsolata = myp5.loadFont('paraboloid-sketch/Inconsolata.otf');
    }

    myp5.setup = () => {
      canvasShare = 5/12;

      if (myp5.windowWidth/myp5.windowHeight > (16/9)) {
        myp5.createCanvas(myp5.windowHeight * (16/9) * canvasShare, myp5.windowHeight);
      }
      else {
        myp5.createCanvas(myp5.windowWidth * canvasShare, myp5.windowWidth/(16/9));
      }

      myp5.graphics = myp5.createGraphics(myp5.width, myp5.height, myp5.WEBGL);
    
      myp5.graphics.angleMode(myp5.DEGREES);
      myp5.graphics.colorMode(myp5.RGB);

      myp5.graphics.stroke(67, 162, 209);
      myp5.graphics.strokeWeight(2);
    
      a_text = myp5.createDiv();
      myp5.a_slider = document.querySelector(".a-slider")// LB, UB, default, Step
      b_text = myp5.createDiv();
      myp5.b_slider = document.querySelector(".b-slider") // LB, UB, default, Step
    
    }
    
    myp5.draw = () => {
      myp5.background("#262b47");
      myp5.graphics.clear();

      myp5.graphics.camera(0, 500, 200)
      // myp5.rotateX(90);

      zRotation += 0.2;
      zRotation = zRotation % 360;
      
      myp5.graphics.rotateZ(zRotation);

      myp5.graphics.translate(0, 0, -movedown*scale); // set origin lower by amount movedown

    
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
          myp5.graphics.vertex(x, y, z);
    
          let pos = myp5.graphics.createVector(x,y,z);
          v[x_indx].push(pos);
        }
      }
    
      //Plot parabaloid by shading in each element
      myp5.graphics.push();
      myp5.graphics.fill(61, 100, 235, 200);
      myp5.graphics.strokeWeight(0.5)
      for(let x_indx = 0; x_indx < v.length; x_indx++){
        for(let y_indx = 0; y_indx < v[x_indx].length; y_indx++){
          if(x_indx < v.length-1 && y_indx < v[x_indx].length-1){
            myp5.graphics.beginShape();
            myp5.graphics.vertex(v[x_indx][y_indx].x, v[x_indx][y_indx].y, v[x_indx][y_indx].z);
            myp5.graphics.vertex(v[x_indx+1][y_indx].x, v[x_indx+1][y_indx].y, v[x_indx+1][y_indx].z);
            myp5.graphics.vertex(v[x_indx+1][y_indx+1].x, v[x_indx+1][y_indx+1].y, v[x_indx+1][y_indx+1].z);
            myp5.graphics.vertex(v[x_indx][y_indx+1].x, v[x_indx][y_indx+1].y, v[x_indx][y_indx+1].z);
            myp5.graphics.endShape(myp5.graphics.CLOSE);
          }
        }
      }
      myp5.graphics.pop();
    
      v = [];
      let f = parabola_Equation(a_val,b_val) * scale
      a_val = a_val * scale;
      b_val = b_val * scale;
      
      myp5.graphics.push();
      myp5.graphics.translate(a_val, b_val, f);
      myp5.graphics.sphere(5) //point on parabola
      myp5.graphics.pop();
    
      myp5.graphics.push()
      myp5.graphics.translate(a_val,b_val,0);
      myp5.graphics.sphere(5) //point on x-y plane
      myp5.graphics.pop()

      drawLine(150, 0, 0);
      drawLine(-150, 0, 0);
      drawLine(0, 150, 0);
      drawLine(0, -150, 0);
      drawLine(0, 0, 200);
    
      drawCone(150, 0, 0, 0, 0, -90);
      drawCone(-150, 0, 0, 0, 0, 90);
      drawCone(0, 150, 0, 0, 0, 0);
      drawCone(0, -150, 0, 0, 0, 180);
      drawCone(0, 0, 200, 90, 0, 0);
    
      // DashedLine(a_val, b_val, 0, a_val, b_val, f); //dashed line
      // DashedLine(a_val,0,0,a_val,b_val,0); //dashed line
      // DashedLine(0,b_val,0,a_val,b_val,0); //dashed line

      myp5.graphics.push();
      myp5.graphics.stroke('White');
      myp5.graphics.strokeWeight(1);
      myp5.graphics.line(a_val, b_val, 0, a_val, b_val, f); //dashed line
      myp5.graphics.line(a_val,0,0,a_val,b_val,0); //dashed line
      myp5.graphics.line(0,b_val,0,a_val,b_val,0); //dashed line
      myp5.graphics.pop();


      drawLabel(170,0,0,"a");
      drawLabel(0,170,0,"b");
      drawLabel(0,0,240,"Error");

      myp5.image(myp5.graphics, 0, 0, myp5.width, myp5.height);
    }

    myp5.windowResized = () => {
      if (myp5.windowWidth/myp5.windowHeight > (16/9)) {
        myp5.resizeCanvas(myp5.windowHeight*(16/9) * canvasShare, myp5.windowHeight);
      }
      else {
        myp5.resizeCanvas(myp5.windowWidth * canvasShare, myp5.windowWidth/(16/9));
      }
    }
    
    function parabola_Equation(x,y) {
      
      let points = pointData;
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
      
      myp5.graphics.push();
      let d = 5; //dashed line length
      let P1 = myp5.graphics.createVector(X1,Y1,Z1); //point 1
      let P2 = myp5.graphics.createVector(X2,Y2,Z2); //point 2
      let P21 = p5.Vector.sub(P2, P1); // P2 - P1. 
      let L = p5.Vector.mag(P21); // length of line
      let u = p5.Vector.mult(P21,1/L) //unit vector in direction of line
    
      myp5.graphics.stroke('White');
      myp5.graphics.strokeWeight(2);
    
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
    
        myp5.graphics.line(x1,y1,z1,x2,y2,z2);
      }
      myp5.graphics.pop()
    }
    

    function drawLine(x, y, z) {
      myp5.graphics.push();
      myp5.graphics.stroke("White");
      myp5.graphics.strokeWeight(2);
      myp5.graphics.fill("White");
      myp5.graphics.line(0, 0, 0, x, y, z);
      myp5.graphics.pop();
    }
    
    function drawCone(x, y, z, thetaX, thetaY, thetaZ) {
      myp5.graphics.push()
      myp5.graphics.stroke("White");
      myp5.graphics.strokeWeight(1);
      myp5.graphics.fill("White");
      myp5.graphics.translate(x, y, z);
      myp5.graphics.rotateX(thetaX);
      myp5.graphics.rotateY(thetaY);
      myp5.graphics.rotateZ(thetaZ);
      myp5.graphics.cone(6, 12);
      myp5.graphics.pop();
    }

    function drawLabel(x, y, z, label) {
      myp5.graphics.push()
      myp5.graphics.translate(x, y, z)
      myp5.graphics.rotateZ(-zRotation);
      myp5.graphics.rotateX(270)
      myp5.graphics.strokeWeight(0)
      myp5.graphics.textSize(40)
      myp5.graphics.textFont(inconsolata);
      myp5.graphics.textAlign(myp5.CENTER, myp5.CENTER);
      myp5.graphics.text(label, 0, 0);
      myp5.graphics.pop()
    }

    
    };