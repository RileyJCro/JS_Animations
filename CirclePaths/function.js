var ctx;               // The canvas context 
var grid_size;         // The canvas size as a square
var num_cells = 8;     // The number of grid cells
var cell_size;         // The cell size
var half_cell;         // Half of the cell size
var circle_r;          // The circle radius
var dot_r;             // The dot radius
var axisX = [];        // Holds the topmost reference circles
var axisY = [];        // Holds the leftmost reference circles
var color = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'];
var dot_color = 'white';

window.onload = function() {
  ctx = document.getElementById('canvas').getContext('2d');
  Resize();
};

window.addEventListener('resize', Resize);

function Resize() {
  ctx.clearRect(0,0, grid_size, grid_size);
  grid_size = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
  ctx.canvas.width = ctx.canvas.height = grid_size;
  cell_size = grid_size / num_cells;
  half_cell = cell_size / 2;
  circle_r = half_cell * 5 / 6;
  dot_r = half_cell * 1 / 12;
  document.getElementById('canvas').style.marginLeft = `${0.25*document.documentElement.clientWidth}px`;
  CreateCircleAxes();
}

// Draw a circle with given position and radius
function DrawCircle(x, y, c) {
  ctx.strokeStyle = c;
  ctx.beginPath();
  // x, y, r, startAngle, endAngle(in radians), counterclockwise(false)
  ctx.arc(x, y, circle_r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

function DrawDot(x, y) {
  ctx.fillStyle = dot_color;
  ctx.strokeStyle = dot_color;
  ctx.beginPath();
  ctx.arc(x, y, dot_r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

function DrawLine(x, y, endX, endY, c) {
  ctx.strokeStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
}

// Draws the initial circles for the xy axes
function CreateCircleAxes() {
  axisX = [];
  axisY = [];
  var shift = cell_size + half_cell;

  for (let i = 1; i < num_cells; i++) {
    // cX, cY, angleSpeed, dotX, dotY
    var x = [shift, half_cell, i / 200, shift, half_cell + circle_r];
    var y = [half_cell, shift, i / 200, half_cell, shift + circle_r];
    DrawCircle(x[0], x[1], color[i-1]);
    DrawCircle(y[0], y[1], color[i-1]);
    DrawDot(x[3], x[4]);
    DrawDot(x[3], x[4]);
    axisX.push(x);
    axisY.push(y);
    shift += cell_size;
  }
}

function DrawNextFrame() {
  if (axisX[0][3] == cell_size + half_cell && axisX[0][4] >= half_cell + circle_r) {
    ctx.clearRect(0,0, grid_size, grid_size);
  }
  ctx.clearRect(0,0, grid_size, cell_size);    // Clear the first row
  ctx.clearRect(0,0, cell_size, grid_size);    // Clear the first column

  // Store the previous positions
  var lastX = [];
  var lastY = [];
  
  for (let i = 0; i < axisX.length; i++) {
    // Update the angle from circle's angle speed
    axisX[i][2] += (i + 1) / 100;
    axisY[i][2] += (i + 1) / 100;
    
    // Calculate the dot position adjustments from angle
    var x_comp = Math.ceil(circle_r * Math.sin(axisX[i][2]));
    var y_comp = Math.ceil(circle_r * Math.cos(axisY[i][2]));

    lastX.push(axisX[i][3]);
    lastY.push(axisY[i][4]);

    // Update dot position
    axisX[i][3] = axisX[i][0] + x_comp;
    axisX[i][4] = axisX[i][1] + y_comp;  
    axisY[i][3] = axisY[i][0] + x_comp;
    axisY[i][4] = axisY[i][1] + y_comp;

    // Draw the axis circles and dots
    DrawCircle(axisX[i][0], axisX[i][1], color[i]);
    DrawCircle(axisY[i][0], axisY[i][1]), color[i];
    DrawDot(axisX[i][3], axisX[i][4]);
    DrawDot(axisY[i][3], axisY[i][4]);

    for (let j = 0; j < axisY.length; j++) {
      DrawLine(lastX[i], lastY[j], axisX[i][3], axisY[j][4], color[i]); 
      DrawLine(lastX[j], lastY[i], axisX[j][3], axisY[i][4], color[i]); 
    }
  }
}

function Update() {
  DrawNextFrame();
}

setInterval(Update, 9);