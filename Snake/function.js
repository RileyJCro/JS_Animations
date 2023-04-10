
var cxt;                     // The context for the canvas
var cnv_width, cnv_height;   // Hold the canvas dimensions
var interval = 10;
var interval_counter = 0;

// clearInterval(interval_id);  if you ever want variable set intervals
// interval_id = setInterval(Update, interval);

var grid_size;
var cell;
var grid_divs = 30;        // # of divisions in a row/col
var grid_line_color = 'blue';
var grid_fill_color = 'black';
var snake_speed = 5;
var state_grid;

var snake_head;
var snake_body;
var direction;             // x, y (left/down = -1, nothing = 0, right/up = 1)
var snake_color = 'green';
var body_len;

var food;
var food_color = 'red';
var food_inc = 3;
var score_multiplier = 1;

var growing;
var last;
var ended;
var free_arr = [];
var input_dirs = [];
var num_inputs = 0;

window.onload = function() {
  Resize();
};

window.addEventListener("resize", Resize);

function Resize() {
  cxt = document.getElementById("canvas").getContext("2d");
  cnv_width = document.documentElement.clientWidth;
  cnv_height = document.documentElement.clientHeight;
  grid_size = cnv_width;
  if (cnv_width > cnv_height) { grid_size = cnv_height; }
  cxt.canvas.width = cxt.canvas.height = grid_size;
  var canvas = document.getElementById("canvas");
  canvas.style.left = `${(cnv_width-grid_size)/2}px`;
  canvas.style.width = canvas.style.height = grid_size;
  var rwrapper = document.getElementById("right_wrapper");
  rwrapper.style.right = `${(cnv_width-grid_size)/8}px`;
  var lwrapper = document.getElementById("left_wrapper");
  lwrapper.style.left = `${(cnv_width-grid_size)/8}px`;
  cell = grid_size / grid_divs;
  InitGame();
}

function InitGame() {
  cxt.clearRect(0, 0, cnv_width, cnv_height);
  state_grid = [];
  CreateGrid();
  snake_head = [RandomCellPos(), RandomCellPos()];
  snake_body = [];
  body_len = 0;
  direction = [0, 0]
  growing = 0;
  last = [];

  input_dirs = [];
  UpdateScore();
  document.getElementById("end_wrapper").style.display = "none";
  while (true) {  // Make sure the snake head and food are not in the same spot
    SpawnFood();
    if (food[0] != snake_head[0] && food[1] != snake_head[1]) { break; }
    DrawSquare(food[0], food[1], cell, grid_line_color, grid_fill_color);
  }
  DrawSquare(snake_head[0], snake_head[1], cell, grid_line_color, snake_color);
  ended = false
}

// HOW MANY INTERVALS BETWEEN SNAKE MOVES
function getSnakeSpeed() {
  snake_speed = document.getElementById("snake_speed").valueAsNumber;
}

function getFoodIncrease() {
  food_inc = document.getElementById("food_inc").valueAsNumber;
}

function getGridSize() {
  grid_divs = document.getElementById("grid_size").valueAsNumber;
  Resize();
}

// COLORS----------------------------
function getSnakeColor() {
  snake_color = document.getElementById("snake_color").value;
}

function getFoodColor() {
  food_color = document.getElementById("food_color").value;
}

function getGridFill() {
  grid_fill_color = document.getElementById("grid_fill").value;
  InitGame();
}

function getGridLineColor() {
  grid_line_color = document.getElementById("grid_line_color").value;
  InitGame();
}

function RandomColor() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
}

function SetRandomColors() {
  document.getElementById("snake_color").value = RandomColor();
  getSnakeColor();
  document.getElementById("food_color").value = RandomColor();
  getFoodColor();
  document.getElementById("grid_fill").value = RandomColor();
  getGridFill();
  document.getElementById("grid_line_color").value = RandomColor();
  getGridLineColor();
}

window.addEventListener('keydown', UpdateDirection);

function UpdateDirection(e) {
  switch(e.keyCode) {
    case 87:
        if (!ended) { direction = [0, -1]; }
        break;
    case 83:
        if (!ended) { direction = [0, 1]; }
        break;
    case 65:
        if (!ended) {  direction = [-1, 0]; }
        break;
    case 68:
        if (!ended) { direction = [1, 0]; }
        break;
    case 13:
        InitGame();
        break;
  }

  if (num_inputs == 0) {
    input_dirs.unshift(direction);    // Store the previous direction
  }
  if (num_inputs == 1) {
    var tmp = direction;
    direction = [input_dirs[0][0], input_dirs[0][1]];  // Swap the new and old directions
    input_dirs.shift()
    input_dirs.unshift(tmp);
  }

  num_inputs++;
}

function RandomCellPos() {
  return Math.ceil((grid_divs-1) * Math.random());
}

function CreateGrid() {
  var cur_x = 0, cur_y = 0;
  for (let i = 0; i < grid_divs; i++) {    // row
    for (let j = 0; j < grid_divs; j++) {  // col
      state_grid.push("0"); // initialize the grid with 0's for empty
      DrawSquare(cur_x, cur_y, cell, grid_line_color, grid_fill_color);
      cur_y += 1;
    }
    cur_x += 1;
    cur_y = 0;
  }
}

// Finds open spots when the grid is almost full
function GenerateFreeArray() {
    for (let i = 0; i < grid_divs; i++) {
        for (let j = 0; j < grid_divs; j++) {
            if (state_grid[i*grid_divs+j] != "S") {
              free_arr.push([i,j]);
            }
        }
    }
}

function SpawnFood() {
if (body_len > 2*(grid_divs*grid_divs)/4) {
  free_arr = [];
  GenerateFreeArray();
  var index = Math.ceil((free_arr.length-1)*Math.random());
  food[0] = free_arr[index][0];
  food[1] = free_arr[index][1];
} else {
  while (true) {
    food = [RandomCellPos(), RandomCellPos()];
    if (state_grid[food[0]*grid_divs + food[1]] == "0") { break; }
  }
}
  DrawSquare(food[0], food[1], cell, grid_line_color, food_color);
}

function DrawSquare(x, y, size, line_color, fill_color) {
  cxt.fillStyle = fill_color;
  cxt.strokeStyle = line_color;
  cxt.globalAlpha = 1;
  cxt.beginPath();
  cxt.rect(x*size, y*size, size, size);
  cxt.fill();
  cxt.stroke();
  cxt.closePath();
}

function Grow() {
  snake_body.push([snake_head[0], snake_head[1]]);
  body_len += 1;
  growing -= 1;
  UpdateScore();
}

function UpdateScore() {
  var score = document.getElementById("score");
  score.innerHTML = (`${body_len * score_multiplier}`);
}

function OutOfBounds() {
  if (snake_head[0] < 0 || snake_head[0] >= grid_divs ||
      snake_head[1] < 0 || snake_head[1] >= grid_divs) {
    return true;  
  }
  return false;
 }

function MoveHead() {
  snake_head[0] += direction[0];
  snake_head[1] += direction[1];
}

function UpdateHighscore() {
  var high_score = document.getElementById("high_score");
  if (parseInt(end_score.innerHTML) > parseInt(high_score.innerHTML)) {
    high_score.innerHTML = end_score.innerHTML;
  }
}

function EndGame() {
  UpdateScore();
  DrawSquare(food[0], food[1], cell, grid_line_color, grid_fill_color);  // Clear the apple
  var end_wrapper = document.getElementById("end_wrapper");
  end_wrapper.style.display = "inline-block"; // Make the end screen visible
  end_wrapper.querySelector(".label").innerHTML = "GAME OVER";  // Set the end message
  var end_score = document.getElementById("end_score");
  end_score.innerHTML = (`${body_len * score_multiplier}`);
  UpdateHighscore();
  ended = true;
}

function WinGame() {
  EndGame();
  var end_wrapper = document.getElementById("end_wrapper");
  end_wrapper.querySelector(".label").innerHTML = "You won!";
  DrawSquare(snake_head[0], snake_head[1], cell, grid_line_color, snake_color); // Draw the snake head
}

function ShiftBody() {
  if (growing > 0) {
    DrawSquare(snake_body[0][0],snake_body[0][1],cell,grid_line_color,grid_fill_color); 
    state_grid[snake_body[0][0]*grid_divs+snake_body[0][1]] = "0";
  }
  if (body_len > 0) {
    snake_body.shift();
    snake_body.push([snake_head[0], snake_head[1]]);
    DrawSquare(last[0], last[1], cell, grid_line_color, grid_fill_color);
    state_grid[last[0]*grid_divs+last[1]] = "0";
    last = [snake_body[0][0], snake_body[0][1]];
  }
}

function Update() {

  interval_counter += 1;
  if (interval_counter < snake_speed) {
    return;
  }
  interval_counter = 0;

  if (direction[0] == 0 && direction[1] == 0) { return; }  // At start don't move

  if (ended == true) {
    return;
  }

  if (body_len+1 == grid_divs*grid_divs) {
    body_len += 1;
    WinGame();
    return;
  }
 
  if (OutOfBounds()) { 
    EndGame();
    return;
  }

  var board_index = snake_head[0]*grid_divs + snake_head[1];
  if (state_grid[board_index] == "S") { 
    EndGame(); 
    return;
  }
  state_grid[board_index] = "S";  // Write a snake spot to the board

  if (body_len == 0) { 
    DrawSquare(snake_head[0], snake_head[1], cell, grid_line_color, grid_fill_color); 
    state_grid[snake_head[0]*grid_divs+snake_head[1]] = "0";    // Free the old snake spot
  }

  if (snake_head[0] == food[0] && snake_head[1] == food[1]) {
    SpawnFood();
    growing += food_inc;
    Grow();
  } else if (growing > 0) {
    Grow();
  } else {
    ShiftBody();
  }
  MoveHead();
  DrawSquare(snake_head[0], snake_head[1], cell, grid_line_color, snake_color);

  // If you do multiple directions in the same interval, set direction and clear
  if (num_inputs == 2) {
    direction = [input_dirs[0][0], input_dirs[0][1]];
    input_dirs = [];
  }

  num_inputs = 0;
}

setInterval(Update, interval);