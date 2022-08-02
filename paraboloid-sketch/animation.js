export let paraboloid_sketch = myp5 => {

    let v = []; //will store all (x,y,z) points of a parabola in here later
    let rows = 10, cols = 10; //resolution of the surface plot
    let xmax = 1.5; //meters
    let xmin = -1.5; //meters
    let ymax = 1.5; //meters
    let ymin = -1.5; //meters
    
    let scale = 100; // pixels / meter
    
    myp5.a_slider, 
    myp5.b_slider;
    let a_text, b_text;
    
    myp5.setup = () => {
      myp5.createCanvas(800,600, myp5.WEBGL);
      myp5.angleMode(myp5.DEGREES);
      myp5.colorMode(myp5.RGB);
    
      myp5.stroke(67, 162, 209);
      myp5.strokeWeight(2);
    
      a_text = myp5.createDiv();
      myp5.a_slider = myp5.createSlider(xmin,xmax,1,0.01) // LB, UB, default, Step
      b_text = myp5.createDiv();
      myp5.b_slider = myp5.createSlider(ymin,ymax,1,0.01) // LB, UB, default, Step
    
    }
    
    myp5.draw = () => {
      myp5.background(61,61,61);
      myp5.orbitControl(4,4);
    
      myp5.rotateX(90);
    
      let a_val = myp5.a_slider.value(); // meters
      let b_val = myp5.b_slider.value(); // meters
    
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
      for(let x_indx = 0; x_indx < v.length; x_indx++){
        for(let y_indx = 0; y_indx < v[x_indx].length; y_indx++){
          myp5.fill(61, 100, 235);
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
    
      a_text.html("a = " + myp5.a_slider.value());
      b_text.html("b = " + myp5.b_slider.value());
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
    
      let x_base = myp5.createVector(-250,0,0);
      let x_vec = myp5.createVector(500,0,0);
      let y_base = myp5.createVector(0,-250,0);
      let y_vec = myp5.createVector(0,500,0);
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
    
    function parabola_Equation(x,y) {
      return x*x/2 + y*y/2 + 0.2
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
      myp5.strokeWeight(2);
      myp5.fill(myColor);
      myp5.translate(base.x, base.y, base.z);
      myp5.line(0, 0, 0, vec.x, vec.y, vec.z);
      myp5.rotate(vec.heading());
      let arrowSize = 12;
      myp5.translate(vec.mag() - arrowSize, 0, 0);
      myp5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      myp5.pop();
    }
    
    };