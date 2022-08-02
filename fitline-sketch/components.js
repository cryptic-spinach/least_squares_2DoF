import { palette, styles, projectionVecPalette, projectionVecStyles, axisConfig, axisPalette, squaresConfig, curveConfig, verticalPalette, verticalStyles, coordinatesLabelConfig, parabolaPalette} from "./configs.js";
import { showValues } from "./helpers.js";

export class Point {
    constructor (x, y, label = "") {
        this.x = x;
        this.y = y;
        this.label = label
    }

    show(myp5, myStroke = palette.pointStroke, myFill = palette.pointFill) {
        let strokeWithOpacity = myp5.color(myStroke);
        strokeWithOpacity.setAlpha(styles.pointStrokeOpacity);

        let fillWithOpacity = myp5.color(myFill);
        fillWithOpacity.setAlpha(styles.pointFillOpacity);

        myp5.push();
        myp5.fill(fillWithOpacity);
        myp5.stroke(strokeWithOpacity);
        myp5.strokeWeight(styles.pointStrokeWeight);
        myp5.ellipse(this.x, this.y, styles.pointRadius, styles.pointRadius);
        myp5.pop();
    }

    showLabel(myp5, myColor = palette.labelFill, myOpacity = styles.labelOpacity, xOffset = styles.labelOffsetX, yOffset = styles.labelOffsetY, myTextSize = styles.labelTextSize, myStrokeWeight = 1) {
        let colorWithOpacity = myp5.color(myColor);
        colorWithOpacity.setAlpha(myOpacity)

        myp5.push();
        myp5.translate(this.x, this.y)
        myp5.scale(1, -1);


        myp5.stroke(myColor);
        myp5.fill(colorWithOpacity);
        myp5.strokeWeight(myStrokeWeight)
        myp5.textSize(myTextSize);
        myp5.text(this.label, xOffset, yOffset)

        myp5.pop();
    }

    showCoordinates(myp5, needsFlip) {
        let flip = 1;
        let staticOffset = 0;

        if (needsFlip) {
            flip = -1;
            staticOffset = -70;
        }

        let label = "(x , y )"
        let mainLabel = new Point(this.x, this.y, label)
        mainLabel.showLabel(myp5, coordinatesLabelConfig.textStroke, styles.labelOpacity, flip * coordinatesLabelConfig.labelX + staticOffset,  flip * coordinatesLabelConfig.labelY, coordinatesLabelConfig.textSize, 0.5);
        

        let subscript = new Point(this.x, this.y, this.label);
        subscript.showLabel(myp5, coordinatesLabelConfig.textStroke, styles.labelOpacity, flip * coordinatesLabelConfig.labelX + coordinatesLabelConfig.firstSubscriptX + staticOffset, flip * coordinatesLabelConfig.labelY + coordinatesLabelConfig.firstSubscriptY, coordinatesLabelConfig.subTextSize, 0.5);
        subscript.showLabel(myp5, coordinatesLabelConfig.textStroke, styles.labelOpacity, flip * coordinatesLabelConfig.labelX + coordinatesLabelConfig.secondSubscriptX + staticOffset, flip * coordinatesLabelConfig.labelY + coordinatesLabelConfig.secondSubscriptY, coordinatesLabelConfig.subTextSize, 0.5);
    }
}

export class Segment {
    constructor (point_1, point_2, label = "") {
        this.point_1 = point_1;
        this.point_2 = point_2;
    }

    getSlopeVec(myp5) {
        return myp5.createVector(this.point_2.x - this.point_1.x, this.point_2.y - this.point_1.y);
    }

    getNumericSlope(myp5) {
        let slopeVec = this.getSlopeVec(myp5)
        return slopeVec.y/slopeVec.x;
    }

    getProjection(myp5, u, v) {
        return v.copy().mult(u.copy().dot(v) / v.copy().dot(v));
    }


    // Displays perpendicular distance from line l to point m
    getPerpendicularDistance(myp5, m) {
        // Choose the origin along l.
        // Create a vector u with tip at m.
        let u = myp5.createVector(m.x - this.point_1.x, m.y - this.point_1.y); 

        // Create unit vector v pointing along l.
        let v = this.getSlopeVec(myp5).normalize();

        // Calculate the projection of u onto v. Call it w.
        let w = this.getProjection(myp5, u, v);
        
        // Draw a line connecting m and the tip of w.
        let perpDistStart = new Point(this.point_1.x + w.x, this.point_1.y + w.y);
        let perpDistEnd = new Point(this.point_1.x + u.x, this.point_1.y + u.y);
        let perpDist = new Segment(perpDistEnd, perpDistStart);
        return perpDist;
    }

    getVerticalDistance(myp5, m) {
        let perpDist = this.getPerpendicularDistance(myp5, m).getSlopeVec(myp5);
        let vertDist;

        if (perpDist.y > 0) {
            vertDist = perpDist.copy().setHeading(myp5.PI/2);
        }
        else {
            vertDist = perpDist.copy().setHeading(-myp5.PI/2);
        }

        let angle = perpDist.angleBetween(vertDist)

        if (Math.cos(angle) != 0 && perpDist.y != 0) {
            vertDist.setMag(perpDist.mag() / Math.cos(angle));
            return vertDist;
        }
        else {
            return;
        }
    }

    showVerticalDistanceMidpoint(myp5, m) {
        let vertDist = this.getVerticalDistance(myp5, m);
        let topVec = myp5.createVector(m.x, m.y);
        let bottomVec = topVec.copy().add(vertDist)
        if (vertDist != null) {
            let midX = (topVec.x + bottomVec.x)/2;
            let midY = (topVec.y + bottomVec.y)/2;
            let midPoint = new Point(midX, midY, "r");
            midPoint.showLabel(myp5, coordinatesLabelConfig.textStroke, styles.labelOpacity, coordinatesLabelConfig.verticalLabelX,  coordinatesLabelConfig.verticalLabelY, coordinatesLabelConfig.textSize, 0.5);
        
            let subscript = new Point(midX, midY, m.label);
            subscript.showLabel(myp5, coordinatesLabelConfig.textStroke, styles.labelOpacity, coordinatesLabelConfig.verticalSubLabelX,  coordinatesLabelConfig.verticalSubLabelY, coordinatesLabelConfig.subTextSize, 0.5);
        } else {
            let midX = m.x;
            let midY = m.y;
            let midPoint = new Point(midX, midY, "r");
            midPoint.showLabel(myp5, coordinatesLabelConfig.textStroke, styles.labelOpacity, coordinatesLabelConfig.verticalLabelX,  coordinatesLabelConfig.verticalLabelY, coordinatesLabelConfig.textSize, 0.5);
        
            let subscript = new Point(midX, midY, m.label);
            subscript.showLabel(myp5, coordinatesLabelConfig.textStroke, styles.labelOpacity, coordinatesLabelConfig.verticalSubLabelX,  coordinatesLabelConfig.verticalSubLabelY, coordinatesLabelConfig.subTextSize, 0.5);
        }

    }

    getNeedsFlip(myp5, m) {
        let perpDist = this.getPerpendicularDistance(myp5, m).getSlopeVec(myp5);
        return perpDist.y > 0
    }


    showAsVector(myp5, myColor = palette.segmentFill, myWeight = styles.segmentWeight, myOpacity = styles.segmentOpacity) {
        let slopeVec = this.getSlopeVec(myp5);
        this.showVec(myp5, this.point_1, slopeVec, myColor, myWeight, myOpacity, true);
    }
    
    showAsSegment(myp5, myColor = palette.segmentFill, myWeight = styles.segmentWeight, myOpacity = styles.segmentOpacity) {
        let slopeVec = this.getSlopeVec(myp5);
        this.showVec(myp5, this.point_1, slopeVec, myColor, myWeight, myOpacity, false);
    }

    showAsAxis(myp5, myColor = palette.segmentFill, myWeight = styles.segmentWeight, myOpacity = axisConfig.axisOpacity) {
        let slopeVec = this.getSlopeVec(myp5);
        this.showVec(myp5, this.point_1, slopeVec, myColor, myWeight, myOpacity, true);
        this.showVec(myp5, this.point_2, slopeVec.mult(-1), myColor, myWeight, myOpacity, true);
    }

    showAsTrendline(myp5, myColor = palette.segmentFill, myWeight = styles.segmentWeight, myOpacity = styles.segmentOpacity) {
        let vec1 = myp5.createVector(axisConfig.x - this.point_1.x, axisConfig.y - this.point_1.y)
        let vec2 = myp5.createVector(axisConfig.x - this.point_2.x, axisConfig.y - this.point_2.y)

        let origin = new Point(axisConfig.x, axisConfig.y);

        let maxMag = myp5.dist(0, 0, axisConfig.right, axisConfig.up)

        vec1.setMag(maxMag);
        vec2.setMag(maxMag);

        this.showVec(myp5, origin, vec1, myColor, myWeight, myOpacity, false);
        this.showVec(myp5, origin, vec2, myColor, myWeight, myOpacity, false);
    }

    showAsDashedLine(myp5) {
        myp5.push();
        let d = 5; //dashed line length
        let P1 = myp5.createVector(this.point_1.x,this.point_1.y); //point 1
        let P2 = myp5.createVector(this.point_2.x,this.point_2.y); //point 2
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
    
      
          let x2 = EndDash.x;
          let y2 = EndDash.y;
    
      
          myp5.line(x1,y1,x2,y2);
        }
        myp5.pop()
    }

    showVec(myp5, base, vec, myColor, myWeight, myOpacity, showArrowTip) {
        let colorWithOpacity = myp5.color(myColor);
        colorWithOpacity.setAlpha(myOpacity)
        myp5.push();
        myp5.stroke(colorWithOpacity);
        myp5.strokeWeight(myWeight);
        myp5.fill(colorWithOpacity);
        myp5.translate(base.x, base.y);
        myp5.line(0, 0, vec.x, vec.y);
        if(showArrowTip) {
            myp5.rotate(vec.heading());
            myp5.translate(vec.mag() - styles.segmentArrowSize, 0);
            myp5.triangle(0, styles.segmentArrowSize / 2, 0, -styles.segmentArrowSize / 2, styles.segmentArrowSize, 0);
        }
        myp5.pop();
    }

    showPerpendicularDistance(myp5, m) {
        this.getPerpendicularDistance(myp5, m).showAsSegment(myp5, projectionVecPalette.distFill, projectionVecStyles.weight, projectionVecStyles.opacity);
    }

    showVerticalDistance(myp5, m) {
        let vertDist = this.getVerticalDistance(myp5, m);
        if (vertDist != null) {
            this.showVec(myp5, m, vertDist, projectionVecPalette.distFill, projectionVecStyles.weight, projectionVecStyles.opacity, false);
        }
    }

    showSquaredError(myp5, m) {
        let vertDist = this.getVerticalDistance(myp5, m);
        let myColor = myp5.color(squaresConfig.fill);
        myColor.setAlpha(squaresConfig.opacity);
        if (vertDist != null) {
            myp5.push();
            myp5.noStroke();
            myp5.fill(myColor);
            myp5.rect(m.x, m.y, vertDist.y, vertDist.y);
            myp5.pop();
        }
    }


    rotateSegmentByAngle(myp5, theta, rotateAboutPoint) {
        let vec1 = myp5.createVector(this.point_1.x - rotateAboutPoint.x, this.point_1.y - rotateAboutPoint.y)
        let transVec1 = vec1.copy().rotate(theta);

        let vec2 = myp5.createVector(this.point_2.x - rotateAboutPoint.x, this.point_2.y - rotateAboutPoint.y)
        let transVec2 = vec2.copy().rotate(theta);

        this.updatePoint1(transVec1, rotateAboutPoint);
        this.updatePoint2(transVec2, rotateAboutPoint);
    }

    rotateSegmentBySlope(myp5, slope) {
        let vec1 = myp5.createVector(axisConfig.x - axisConfig.left, axisConfig.y - (slope * axisConfig.left))
        let vec2 = myp5.createVector(axisConfig.x + axisConfig.right, axisConfig.y + (slope * axisConfig.right))

        this.point_1.x = vec1.x;
        this.point_1.y = vec1.y;

        this.point_2.x = vec2.x;
        this.point_2.y = vec2.y;
    }

    updatePoint1(vec, point) {
        this.point_1.x = vec.x + point.x;
        this.point_1.y = vec.y + point.y;
    }

    updatePoint2(vec, point) {
        this.point_2.x = vec.x + point.x;
        this.point_2.y = vec.y + point.y;
    }
}


export class Axes {
    constructor(x, y, right, up, left, down, xLabel = "", yLabel = "", horizontalLabelXOffset = axisConfig.horizontalLabelXOffset, horizontalLabelYOffset = axisConfig.horizontalLabelYOffset, verticalLabelXOffset = axisConfig.verticalLabelXOffset, verticalLabelYOffset = axisConfig.verticalLabelYOffset) {
        this.x = x;
        this.y = y;
        this.right = right;
        this.up = up;
        this.left = left;
        this.down = down;
        this.xLabel = xLabel;
        this.yLabel = yLabel;
        this.horizontalLabelXOffset = horizontalLabelXOffset;
        this.horizontalLabelYOffset = horizontalLabelYOffset;
        this.verticalLabelXOffset = verticalLabelXOffset;
        this.verticalLabelYOffset = verticalLabelYOffset;
    }

    show(myp5) {
        let xAxisStart = new Point(-this.left + this.x, 0 + this.y);
        let xAxisEnd = new Point(this.right + this.x, 0 + this.y, this.xLabel);
        let xAxis = new Segment(xAxisStart, xAxisEnd);

        let yAxisStart = new Point(0 + this.x, -this.down + this.y);
        let yAxisEnd = new Point(0 + this.x, this.up + this.y, this.yLabel);
        let yAxis = new Segment(yAxisStart, yAxisEnd);
            
        xAxis.showAsAxis(myp5);
        yAxis.showAsAxis(myp5);

        xAxisEnd.showLabel(myp5, axisPalette.fill, styles.labelOpacity, this.horizontalLabelXOffset, this.horizontalLabelYOffset);
        yAxisEnd.showLabel(myp5, axisPalette.fill, styles.labelOpacity, this.verticalLabelXOffset, this.verticalLabelYOffset);
    }
}

export class PointCloud {
    constructor(points, xOffset, yOffset) {
        this.originalpoints = points;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        let offsetPoints = [];
        points.forEach(p => {
            let x = p.x + xOffset;
            let y = p.y + yOffset;
            let label = p.label;
            offsetPoints.push(new Point(x, y, label));
        });
        this.points = offsetPoints;
    }

    showAsCurve(myp5) {
        myp5.push()
        myp5.noFill()
        myp5.stroke(parabolaPalette.parabolaStroke);
        myp5.strokeWeight(3)

        let xScale = curveConfig.xScale;
        let yScale = curveConfig.yScale;
      
        myp5.beginShape();
        for (let v of this.originalpoints) {
          myp5.vertex(v.x * xScale + this.xOffset, v.y * yScale + this.yOffset);
        }
        myp5.endShape();
        myp5.pop()
    }

    showFunctionValue(myp5, fitline, fitpoints) {
        let fitlineVec = fitline.getSlopeVec(myp5);

        if (fitlineVec.x != 0) {
            let b = fitlineVec.y/fitlineVec.x

            let xScale = curveConfig.xScale;
            let yScale = curveConfig.yScale;
            
            let qua  = fitpoints.map(p => p.x * p.x).reduce((partialSum, a) => partialSum + a, 0)     ;
            let lin  = fitpoints.map(p => p.x * p.y).reduce((partialSum, a) => partialSum + a, 0) * -2;
            let con  = fitpoints.map(p => p.y * p.y).reduce((partialSum, a) => partialSum + a, 0)     ;
        
            let xPos = b * xScale;
            let yPos = (qua*b*b + lin*b + con) * yScale;

            let functionValueTracker = new Point(xPos + this.xOffset, yPos + this.yOffset);
            
            let inputValueTracker = new Point(xPos + this.xOffset, this.yOffset);

            let vertical = new Segment(functionValueTracker, inputValueTracker);

            vertical.showAsDashedLine(myp5)
            functionValueTracker.show(myp5, verticalPalette.pointStroke, verticalPalette.pointFill);
            inputValueTracker.show(myp5, verticalPalette.pointStroke, verticalPalette.pointFill);
        }
    }
}

export class Slider {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.selected = false;
    }

    show(myp5) {
        let point = new Point(this.getSliderPosition(), this.y);
        point.show(myp5);
    }

    getSliderPosition() {
        let xScale = curveConfig.xScale;
        let xPos = this.value * xScale;
        return this.x + xPos;
    }

    setSelected(isSelected) {
        this.selected = isSelected;
    }

    setValue(screenX) {
        this.value = (screenX - this.x) / curveConfig.xScale;

    }
    
}