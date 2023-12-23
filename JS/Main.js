window.onload = function() {
	body = document.body;
	ael($("wrap"), "change", checkWrap);
	wrap.checked = true;
	checkWrap();
	gameStart(30, 40, 4, 100);
}

gameStart = function(w, h, sw, d) {
	gameover = false;
	createField(w, h);
	//createSnake(sw, [0, sw]);
	dropFood();
	rcn($("overlay"), "shown");
	delay = d;
	moveRec();
}

checkWrap = function() {
	tcn($("game"), "bordered");
}

toggleWrap = function() {
	$("wrap").checked = !$("wrap").checked;
	checkWrap();
}

// left top right bottom
window.addEventListener("keydown", function(event) {
	switch(event.keyCode) {
		case 37:
		case 38:
		case 39:
		case 40: { event.preventDefault(); inputDir = event.keyCode - 37; break; /*setDirection(event.keyCode - 37);*/ }
		case 32: { if (gameover) gameStart(30, 40, 4, 100); break; }
		case 66: { toggleWrap(); break; }
		default: break;
	}
});

// 37 left 38 up 39 right 40 down
var snake, foodpos;
var curDir, inputDir;
var delay;
var gameover;
var stackedInput = false;
var inputStack = [];
var M, N, WIDTH_OUTER, WIDTH_INNER, w2;

function setDirection(dir) {
	/*if ((dir - curDir) & 1) {
		curDir = dir;
	}*/
}

function createField(m, n) {
	M = m;
	N = n;
	var dimX = document.documentElement.clientWidth - 2;  // 2 for border
	var dimY = document.documentElement.clientHeight - 2;
	var ow = Math.min(20, Math.max(1, Math.min(Math.floor(dimX / N), Math.floor(dimY / M))));
	WIDTH_OUTER = ow;
	WIDTH_INNER = ow / 1.25;
	w2 = WIDTH_OUTER - WIDTH_INNER;
	$("gameStyle").textContent =
	"div#game {\n\
		width: " + WIDTH_OUTER * N + "px;\n\
		height: " + WIDTH_OUTER * M + "px;\n\
		left: " + Math.max(0, (dimX - WIDTH_OUTER * N - 2) / 2) + "px;\n\
		top: " + Math.max(0, (dimY - WIDTH_OUTER * M - 2) / 2) + "px;\n\
	}\n\
	div#food {\n\
		width: " + WIDTH_INNER + "px;\n\
		height: " + WIDTH_INNER + "px;\n\
	}";
	snake = new Snake($("s"), $("snakeStyle"), 4, ow);
	inputDir = curDir = 2;
}

function dropFood() {
	var pos;
	do {
		pos = [Math.floor(Math.random() * M), Math.floor(Math.random() * N)];
	} while (snake.contains(pos));
	foodpos = pos.slice();
	$("food").style.left = pos[1] * WIDTH_OUTER + w2/2 + "px";
	$("food").style.top  = pos[0] * WIDTH_OUTER + w2/2 + "px";
}

function moveRec() {
	move();
	!gameover && setTimeout(moveRec, delay);
}

function move() {
	if ((inputDir - curDir) & 1) {
		curDir = inputDir;
	}
	var dir = curDir;
	var dx = (dir - 1) % 2;
	var dy = (dir - 2) % 2;
	var head = snake.head();
	var elem = [head[0] + dy, head[1] + dx];
	var wrap = $("wrap").checked;
	if (!wrap && (elem[0] == -1 || elem[0] == M || elem[1] == -1 || elem[1] == N) || snake.contains(elem)) {
		gameover = true;
		acn($("overlay"), "shown");
		return;
	}
	elem = [(elem[0] + M) % M, (elem[1] + N) % N];
	var eat = (elem[0] == foodpos[0] && elem[1] == foodpos[1]);
	snake.move(elem, dir, eat);
	
	if (eat) {
		dropFood();
		delay = Math.max(20, delay * .95);
	}
}