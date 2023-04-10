
var cxt;                     // The context for the canvas
var cnv_width, cnv_height;   // Hold the canvas dimensions

var dotArray = [];       // An array to hold circle information
var num_dots = 20;       // Default value for the number of circles
var r = 6;               // Default value for the dot radius
var lineLength = 300;    // Default value for lines to snap to circles
var dot_color = "white";
var line_color = 'rgb(150, 150, 150)';

window.onload = function() {
  cxt = document.getElementById("canvas").getContext("2d");
  resize();
  // Generate/display initial dots
  for (let i = 0; i < num_dots; i++) GenerateDot();
};

window.addEventListener("resize", resize);

function resize() {
  cnv_width = document.documentElement.clientWidth;
  cnv_height = document.documentElement.clientHeight;
  cxt.canvas.width = cnv_width;
  cxt.canvas.height = cnv_height;
  dotArray.forEach(dot => { 
    dot[0] = Math.ceil(cnv_width * Math.random()); 
    dot[0] = Math.ceil(cnv_height * Math.random()); 
  });
}
 
function GenerateDot() {
  var x = Math.ceil(cnv_width * Math.random());  
  var y = Math.ceil(cnv_height * Math.random());
  
  var speedX = Math.ceil(5 * Math.random());
  if (Math.random() <= 0.5) speedX = -speedX;
  var speedY = Math.ceil(5 * Math.random());
  if (Math.random() <= 0.5) speedY = -speedY;

  var c = [x, y, r, speedX, speedY];
  dotArray.push(c);
  DrawDot(x, y, r);
}

function RandomColor() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
}

function Randomize() {
  num_dots = Math.ceil(50 * Math.random());
  r = Math.ceil(50 * Math.random());
  lineLength = Math.ceil(cnv_width * Math.random());
  dot_color = RandomColor();
  line_color = RandomColor();
  dotArray = [];
  document.getElementById('num_dots').valueAsNumber = num_dots;
  document.getElementById('rad').valueAsNumber = r;
  document.getElementById('lineLength').valueAsNumber = lineLength;
  document.getElementById('dotColor').value = dot_color;
  document.getElementById('lineColor').value = line_color;
  for (let i = 0; i < num_dots; i++) GenerateDot(); 
}
 
function DrawDot(x, y, r) {
  cxt.fillStyle = dot_color;
  cxt.strokeStyle = dot_color;
  cxt.globalAlpha = 1;
  cxt.beginPath();
  cxt.ellipse(x, y, r, r, Math.PI / 4, 0, 2 * Math.PI);
  cxt.fill();
  cxt.stroke();
  cxt.closePath();
}

function DrawLine(x, y, endX, endY, opacity) {
  cxt.strokeStyle = line_color;
  cxt.globalAlpha = opacity;
  cxt.beginPath();
  cxt.moveTo(x, y);
  cxt.lineTo(endX, endY);
  cxt.stroke();
  cxt.closePath();
}

function adjustDotArray() {
  if (num_dots < dotArray.length) {
    for (let i = 0; i < dotArray.length - num_dots; i++) dotArray.pop();
  } 
  else { for (let i = 0; i < num_dots - dotArray.length; i++) GenerateDot(); }
}

function getDotColor() {
  dot_color = document.getElementById("dotColor").value;
}

function getLineColor() {
  line_color = document.getElementById("lineColor").value;
}

// Change the number of circles
function getNumDots() {
  num_dots = document.getElementById("num_dots").valueAsNumber;
  adjustDotArray();
}

function getRadius() {
  r = document.getElementById("rad").valueAsNumber;
  dotArray.forEach(dot => { dot[2] = r; } );
}

function getLineLength() {
  lineLength = document.getElementById("lineLength").valueAsNumber;
}

function Update() {
  cxt.clearRect(0,0, cnv_width, cnv_height);

  for (let i = 0; i < num_dots; i++) {
    dotArray[i][0] += dotArray[i][3]   // Update x_pos with speedX
    dotArray[i][1] += dotArray[i][4];  // Update y_pos with speedY
    
    // If the x_pos goes out of range, flip the sign of speedX
    if (dotArray[i][0] + dotArray[i][3] > cnv_width || dotArray[i][0] + dotArray[i][3] < 0) {
      dotArray[i][3] = -dotArray[i][3];
    }
    // If the y_pos goes out of range, flip the sign of speedY
    if (dotArray[i][1] + dotArray[i][4] > cnv_height || dotArray[i][1] + dotArray[i][4] < 0) {
      dotArray[i][4] = -dotArray[i][4];
    }
    // Compare the distance between circles
    for (let j = i + 1; j < num_dots; j++) {
      var distX = Math.abs(dotArray[i][0] - dotArray[j][0]);
      var distY = Math.abs(dotArray[i][1] - dotArray[j][1]);
      
      if (distX <= lineLength && distY <= lineLength) { 
        var opacity = (distX + distY) / lineLength * 2;
        opacity.toFixed(1);

        DrawLine(dotArray[i][0], dotArray[i][1], dotArray[j][0], dotArray[j][1], opacity);
      }
    }
    DrawDot(dotArray[i][0], dotArray[i][1], dotArray[i][2]);
  }
}
setInterval(Update, 9);
