var steps = [];
var is_over = false;
var canvas;
var step_idx = 0;
var board = [];

const LEFT_MARGIN = 15;
const TOP_MARGIN = 15;
const GRID_SIZE = 30;
const NUM_ROW = 15;
const NUM_COL = 15;

var inter_id;
var play_status = 0;
var who_to_move;
var g_is_hvc;

function detect(x, y, color, direction){
  var delta_x = direction[0];
  var delta_y = direction[1];
  var cursor_x = x + delta_x;
  var cursor_y = y + delta_y;
  var adjacent_count = 0;
  while ( board[cursor_x][cursor_y] == color ){
    adjacent_count += 1;
    cursor_x += delta_x;
    cursor_y += delta_y;
  }
  return adjacent_count;
}

function updateState(x, y, color){
  var directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
  ];
  for(var i = 0; i < 4; i++){
    var k1 = detect(x, y, color, directions[i]);
    var k2 = detect(x, y, color, directions[7-i]);
    if ( k1 + k2 >= 4 ){
      alert("game over! player " + color + " win" );
    }
  }
  board[x][y] = color;
}

function getMousePos(canvas, evt) {
  // get canvas position
  var obj = canvas;
  var top = 0;
  var left = 0;

  while(obj && obj.tagName != 'BODY') {
    top += obj.offsetTop;
    left += obj.offsetLeft;
    obj = obj.offsetParent;
  }

  // return relative mouse position
  var mouseX = evt.clientX - left + window.pageXOffset;
  var mouseY = evt.clientY - top + window.pageYOffset;
  return {
    x: mouseX,
      y: mouseY
  };
}

function drawBoard() {
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 900, 900);
  ctx.fillStyle = "rgb(0,0,0)";
  var i;
  ctx.beginPath();
  for (i = 0 ; i < NUM_COL ; ++i) {
    ctx.moveTo(i * GRID_SIZE + LEFT_MARGIN, TOP_MARGIN);
    ctx.lineTo(i * GRID_SIZE + LEFT_MARGIN,
        (NUM_ROW-1) * GRID_SIZE + TOP_MARGIN);
  }
  for (i = 0 ; i < NUM_ROW ; ++i) {
    ctx.moveTo(LEFT_MARGIN, i * GRID_SIZE + TOP_MARGIN);
    ctx.lineTo(LEFT_MARGIN + (NUM_COL-1) * GRID_SIZE,
        i * GRID_SIZE + TOP_MARGIN);
  }
  ctx.stroke();
}

function init(){
  for(var i = 0; i < NUM_ROW; i++) {
    board[i] = [];
    for(var j = 0; j < NUM_COL; j++){
      board[i][j] = 0;
    }
  }
}

function load() {
  canvas = document.getElementById('arena');
  canvas.height = 800;
  canvas.width = 800;
  //initial board
  init();
  draw();
  
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  who_to_move = 1;
}

function draw() {
  drawBoard();
  var color = 0;
  for (var i = 0 ; i < step_idx ; ++i) {
    drawChess(steps[i].x, steps[i].y, color);
    color = 1 - color;
  }
}

function drawChess(x, y, color) {
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.beginPath();
  ctx.arc(LEFT_MARGIN + y * GRID_SIZE,
      TOP_MARGIN + x * GRID_SIZE,
      GRID_SIZE/2, 0, Math.PI*2, true);
  if (color === 0) ctx.fill();
  else ctx.stroke();
}

function onMouseMove(evt) {
}

function onMouseDown(evt) {
  if (g_is_hvc === 0) return;
  if (is_over) return;
  who_to_move = (who_to_move + 1) % 2 + 1;
    tmp = getMousePos(canvas, evt);
  chess_pos = {x: 0, y: 0};
  chess_pos.y = Math.floor((tmp.x - LEFT_MARGIN) / GRID_SIZE + 0.5);
  chess_pos.x = Math.floor((tmp.y - TOP_MARGIN) / GRID_SIZE + 0.5);
  if (chess_pos.x < 0 || chess_pos.x >= NUM_ROW ||
      chess_pos.y < 0 || chess_pos.y >= NUM_COL) {
        return;
      }
  updateState(chess_pos.y, chess_pos.x, who_to_move);
  steps.push(chess_pos);
  ++step_idx;
  draw();
}

function nextStep() {
  if (steps.length === 0) {
    console.log('Steps are not loaded.');
    return;
  }
  if (++step_idx >= steps.length)
    step_idx = steps.length;
  draw();
}

function prevStep() {
  if (steps.length === 0) {
    console.log('Steps are not loaded.');
    return;
  }
  if (--step_idx < 0)
    step_idx = 0;
  draw();
}

$(document).ready(function(){
  load();
});



