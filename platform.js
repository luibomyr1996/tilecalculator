var platform = document.getElementById("platform");
var ctx = platform.getContext("2d");
ctx.strokeStyle = "black";
ctx.lineWidth = 4;

var tooltip = document.getElementById("tooltip");
var canvasOffset = $("#platform").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var storedLines = [];
var startPoint = null;
var endPoint = new Point(0, 0);
const closeToPointRounding = 10;
var isDown;

var background = new Image();
background.src = "grid.jpg";

background.onload = function () {
  ctx.drawImage(background, 0, 0);
}

//var tileFgr = new Path2D();
var isTileActive = false;

$("#platform").mousedown(function (e) {
  handleMouseDown(e);
});
$("#platform").mousemove(function (e) {
  handleMouseMove(e);
  if (!isDown) {
    return;
  }
  handleMouseMoveWithDownMouse(e);
});
$("#platform").mouseup(function (e) {
  handleMouseUp(e);
});
$("#clear").click(function () {
  storedLines.length = 0;
  ctx.drawImage(background, 0, 0);
  $('body>span.appended').remove();
});

function handleMouseDown(e) {
  if (startPoint === null) {
    startPoint = getPoint(e);
  } else {
    startPoint = endPoint;
  }
  console.log(storedLines);
  //startPoint = getPoint(e);
  isDown = true;
}

function handleMouseUp(e) {
  isDown = false;
  if (isTileActive) {
    mouseUpForTile(e);
  } else {
    mouseUpForFlat(e);
  }
}

function handleMouseMove(e) {
  const point = getPoint(e);
  //checkIfTileIsHovered(point);
}

function handleMouseMoveWithDownMouse(e) {
  if (isTileActive) {
    moveForTile(e);
  } else {
    moveForFlat(e);
  }
}

function mouseUpForFlat(e) {
  endPoint = getPoint(e);
  var line = new Line(startPoint, endPoint);
  storedLines.push(line);
  //isCloseToPoint();
  redrawStoredLines();
  attachTooltip(line);
  tooltip.innerHTML = "";
}

function mouseUpForTile(params) {
  
}

function moveForTile(e) {
  var point = getPoint(e);
  ctx.drawImage(background, 0, 0);
  redrawStoredLines();
  ctx.fillRect(point.x, point.y, tileWidth, tileHeight);
  ctx.stroke();
  //tileFgr.rect(point.x, point.y, tileWidth, tileHeight);
  
  //ctx.fill(tileFgr);
}

function moveForFlat(e) {
  endPoint = getPoint(e);
  redrawStoredLines();
  drawLine(startPoint, endPoint);
  showTooltip();
}

function getPoint(e) {
  var mouseX = parseInt(e.clientX - offsetX);
  var mouseY = parseInt(e.clientY - offsetY);
  return new Point(mouseX, mouseY);
}

function showTooltip() {
  var line = new Line(startPoint, endPoint);
  tooltip.style.top = (line.endPoint.y) + 'px';
  tooltip.style.left = (line.endPoint.x) + 'px';
  tooltip.innerHTML = line.length;
}

function attachTooltip(line) {
  var tooltip1 = document.createElement("span");
  tooltip1.classList = ['appended'];
  tooltip1.innerHTML = line.length;
  tooltip1.style.top = (line.middlePoint.y + offsetY) + 'px';
  tooltip1.style.left = (line.middlePoint.x + offsetX) + 'px';
  $("body").append(tooltip1);
}

function drawLine(startPoint, endPoint) {
  //ctx.lineWidth = 0.2;
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
}

function redrawStoredLines() {
  ctx.drawImage(background, 0, 0);
  if (storedLines.length == 0) {
    return;
  }
  // redraw each stored line
  for (var i = 0; i < storedLines.length; i++) {
    drawLine(storedLines[i].startPoint, storedLines[i].endPoint);
  }
}






// flat is ready
function flatAndTileIsReady() {
  var isFlatReady = Utils.isShapeClosed(storedLines) && tileWidth != 0 && tileHeight != 0;

  if (isFlatReady) {
    isTileSelected = true;
  }
}


function setTile() {
  const rectangle = new Path2D();
  rectangle.rect(450, 50, tileWidth, tileHeight)
  ctx.stroke(rectangle);
  ctx.fill(rectangle);
  ctx.stroke();
  // tileFgr.rect(450, 50, tileWidth, tileHeight);
  // ctx.fillStyle = "green";
  // ctx.fill(tileFgr);
  isTileActive = true;
}
//додати похибку 20221112
function drawTilesOnFlat() {
  const poligonPoints = Utils.getAreaPoints(storedLines);
  const edgePoints = Utils.getEdgePoints(storedLines);
  console.log(edgePoints);
  for (let index = edgePoints.minXPoint.x; index < edgePoints.maxXPoint.x; index+=tileWidth) {
    for (let index2 = edgePoints.minYPoint.y; index2 < edgePoints.maxYPoint.y; index2+=tileHeight) {
      ctx.strokeStyle = "red"; 

      const isPointInPoligon1 = isPointInPolygon(poligonPoints, new Point(index, index2));
      const isPointInPoligon2 = isPointInPolygon(poligonPoints, new Point(index+tileWidth, index2));
      const isPointInPoligon3 = isPointInPolygon(poligonPoints, new Point(index, index2+tileHeight));
      const isPointInPoligon4 = isPointInPolygon(poligonPoints, new Point(index+tileWidth, index2+tileHeight));

      if (isPointInPoligon1 || isPointInPoligon2 || isPointInPoligon3 || isPointInPoligon4) {
        const rectangle = new Path2D();
        rectangle.rect(index, index2, tileWidth, tileHeight);
        ctx.stroke(rectangle);
      }
      // const rectangle = new Path2D();
      // rectangle.rect(index, index2, tileWidth, tileHeight);
      // ctx.stroke(rectangle);
    }

    //to show walls over tiles
    ctx.strokeStyle = "black"; 

    for (var i = 0; i < storedLines.length; i++) {
      drawLine(storedLines[i].startPoint, storedLines[i].endPoint);
    }
  }

}

function isPointInPolygon(polygon, testPoint)
    {
        result = false;
        j = polygon.length - 1;
        for (let i = 0; i < polygon.length; i++)
        {
            if (polygon[i].y < testPoint.y && polygon[j].y >= testPoint.y || polygon[j].y < testPoint.y && polygon[i].y >= testPoint.y)
            {
                if (polygon[i].x + (testPoint.y - polygon[i].y) / (polygon[j].y - polygon[i].y) * (polygon[j].x - polygon[i].x) < testPoint.x)
                {
                    result = !result;
                }
            }
            j = i;
        }
        return result;
    }


// function checkIfTileIsHovered(point) {
//   if (ctx.isPointInPath(tileFgr, point.x, point.y)) {
//     platform.style.cursor = "pointer";
//   } else {
//     platform.style.cursor = "auto";
//   }
// }

// function moveTile(e) {
//   if (isDown) {
//     var point = new Point(e);
//     console.log(point);
//   }

// }


//https://oguzhanoya.github.io/jquery-steps/


function calculateArea() {
  var points = Utils.getAreaPoints(storedLines);

  for (let index = 0; index < points.length - 2; index++) {
    var line1 = new Line(points[0], points[index + 1]);
    var line2 = new Line(points[index + 1], points[index + 2]);
    var line3 = new Line(points[0], points[index + 2]);

    console.log(gauss(points));
    console.log(index, line1.length, line2.length, line3.length);
    
  }
}

//lines cant intersects. You cannot write line from the begging of previous line. Only proceed from the end(Gauss doesn't work in another way)!!!
//use svg
function gauss(points) {
  var A = 0;
  console.log(points);
  for (let i = 0; i < points.length - 1; i++) {
    A += (points[i].x * points[i + 1].y) - (points[i + 1].x * points[i].y);

    //A += points[i].x * points[(i + 1) % points.length].y - points[i].y * points[(i + 1) % points.length].x
  }
  return Math.abs(A + points[points.length - 1].x * points[0].y - points[0].x * points[points.length - 1].y) / 2; 
  //Math.abs(A) / 2;
}

// function calculateArea() {
//   console.log('test');
//     console.log(intersects(storedLines[0], storedLines[1]));
// }


// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(line1, line2) {
  var det, gamma, lambda;
  det = (line1.endPoint.x - line1.startPoint.x) * (line2.endPoint.y - line2.startPoint.y) - (line2.endPoint.x - line2.startPoint.x) * (line1.endPoint.y - line1.startPoint.y);
  if (det === 0) {
    return false;
  } else {
    lambda = ((line2.endPoint.y - line2.startPoint.y) * (line2.endPoint.x - line1.startPoint.x) + (line2.startPoint.x - line2.endPoint.x) * (line2.endPoint.y - line1.startPoint.y)) / det;
    gamma = ((line1.startPoint.y - line1.endPoint.y) * (line2.endPoint.x - line1.startPoint.x) + (line1.endPoint.x - line1.startPoint.x) * (line2.endPoint.y - line1.startPoint.y)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};



// // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
// function intersects(p1: Point, p2, a,b,c,d,p,q,r,s) {
//   var det, gamma, lambda;
//   det = (c - a) * (s - q) - (r - p) * (d - b);
//   if (det === 0) {
//     return false;
//   } else {
//     lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
//     gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
//     return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
//   }
// };



// function isCloseToPoint() {
//   if (storedLines.length < 2) {
//     return;
//   }
//   var lastLine = storedLines[storedLines.length - 1];
//   for (let index = 0; index < storedLines.length - 1; index++) {
//     const el = storedLines[index];
//     if (Math.abs(el.startPoint.x - lastLine.startPoint.x) < closeToPointRounding && Math.abs(el.startPoint.y - lastLine.startPoint.y) < closeToPointRounding) {
//       lastLine.startPoint.x = el.startPoint.x;
//       lastLine.startPoint.y = el.startPoint.y;
//     }
//     if (Math.abs(el.endPoint.x - lastLine.endPoint.x) < closeToPointRounding && Math.abs(el.endPoint.y - lastLine.endPoint.y) < closeToPointRounding) {
//       lastLine.endPoint.x = el.endPoint.x;
//       lastLine.endPoint.y = el.endPoint.y;
//     }
//     if (Math.abs(el.startPoint.x - lastLine.endPoint.x) < closeToPointRounding && Math.abs(el.startPoint.y - lastLine.endPoint.y) < closeToPointRounding) {
//       lastLine.endPoint.x = el.startPoint.x;
//       lastLine.endPoint.y = el.startPoint.y;
//     }
//     if (Math.abs(el.endPoint.x - lastLine.startPoint.x) < closeToPointRounding && Math.abs(el.endPoint.y - lastLine.startPoint.y) < closeToPointRounding) {
//       lastLine.startPoint.x = el.endPoint.x;
//       lastLine.startPoint.y = el.endPoint.y;
//     }
//   }
// }
