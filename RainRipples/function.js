var ctx;
var screen_width;
var screen_height;
var interval = 5;

var num_droplets = 50;
var min_drop_length = 20;
var length_step = 20;
var min_fall_speed = 5;
var speed_step = 2;

var high_horizon;
var low_horizon;
var horizon_height;
var ripple_speed = 0.5; 
var num_ripples = 3;

window.onload = function() {
  ctx = document.getElementById('canvas').getContext('2d');
  Resize();
  GenerateDroplets();
};

window.addEventListener('resize', Resize);

function Resize() {
  screen_width = document.documentElement.clientWidth;
  screen_height = document.documentElement.clientHeight;
  ctx.canvas.width = screen_width;
  ctx.canvas.height = screen_height;
  // The horizon values are set here
  high_horizon = screen_height * 2/5;
  low_horizon = screen_height;
  horizon_height = low_horizon - high_horizon;
}

function GetRandInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function DrawLine(startX, startY, endX, endY) {
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
}

var droplets = [];
class Droplet {
  constructor(x, y, end_y_splash, fall_speed, length, splash_type) {
    this.x = x;
    this.y = y;
    this.end_y_splash = end_y_splash;
    this.fall_speed = fall_speed;
    this.length = length;
    this.splash_type = splash_type;
  }
}

function SetSLT(end_y_splash) {
  // 4 different slt's based on horizon location (SLT = speed, length, type)
  // Closer droplets move faster, are longer, and have larger splashes
  var slt = [min_fall_speed, min_drop_length, 'ripple4'];
  if (end_y_splash >= high_horizon + horizon_height * 1/4) {
     slt = [slt[0]+=speed_step, slt[1]+=length_step, 'ripple3'];
  } 
  if (end_y_splash >= high_horizon + horizon_height * 2/4) {
    slt = [slt[0]+=speed_step, slt[1]+=length_step, 'ripple2'];
  } 
  if (end_y_splash >= high_horizon + horizon_height * 3/4) {
    slt = [slt[0]+=speed_step, slt[1]+=length_step, 'ripple1'];
  }
  return slt;
}

function GenerateDroplets() {
  for (let i = 0; i < num_droplets; i++) {
    var drop = SetDropletValues();
    droplets.push(drop);
  }
}

function SetDropletValues() {
  var x = GetRandInRange(0, screen_width);
  var y = 0;
  var end_y_splash = GetRandInRange(high_horizon, low_horizon);
  var slt = SetSLT(end_y_splash);
  var drop = new Droplet(x, y, end_y_splash, slt[0], slt[1], slt[2]);
  return drop;
}

function AnimateRainfall() {
  for (let i = 0; i < num_droplets; i++) {
    if (droplets[i].y >= droplets[i].end_y_splash) {
      AnimateRipple(droplets[i]);
      droplets[i] = SetDropletValues();
    } else {
      droplets[i].y += droplets[i].fall_speed;
    }
    DrawLine(droplets[i].x, droplets[i].y, droplets[i].x, droplets[i].y+droplets[i].length);
  }
}

function AnimateRipple(droplet) {
  var newRipple = document.createElement('div');
  newRipple.className = 'ripples';
  newRipple.style.left = `${droplet.x}px`;
  newRipple.style.top = `${droplet.y}px`;
  document.body.appendChild(newRipple);

  if (droplet.splash_type == 'ripple4') newRipple.style.animation = `ripple4 ${ripple_speed}s ease`;
  if (droplet.splash_type == 'ripple3') newRipple.style.animation = `ripple3 ${ripple_speed}s ease`;
  if (droplet.splash_type == 'ripple2') newRipple.style.animation = `ripple2 ${ripple_speed}s ease`;
  if (droplet.splash_type == 'ripple1') newRipple.style.animation = `ripple1 ${ripple_speed}s ease`;
  newRipple.onanimationend = () => document.body.removeChild(newRipple);
}

function Update() {
  ctx.clearRect(0,0, screen_width, screen_height);
  AnimateRainfall();
}

setInterval(Update, interval);