window.onload = function() {
	body = document.body;
	snakeDiv = $("s");
	ael($("wrap"), "change", checkWrap);
	wrap.checked = true;
	checkWrap();
	gameStart(30, 40, 4, 100);
}

gameStart = function(w, h, sw, d) {
	gameover = false;
	createField(w, h);
	createSnake(sw, [0, sw]);
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
var snakeDiv;
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
	document.getElementById("snakeStyle").textContent =
	"div#game {\n\
		width: " + WIDTH_OUTER * N + "px;\n\
		height: " + WIDTH_OUTER * M + "px;\n\
		left: " + Math.max(0, (dimX - WIDTH_OUTER * N - 2) / 2) + "px;\n\
		top: " + Math.max(0, (dimY - WIDTH_OUTER * M - 2) / 2) + "px;\n\
	}\n\
	div#s>div {\n\
	    width: " + WIDTH_INNER + "px;\n\
		height: " + WIDTH_INNER + "px;\n\
		transform-origin: " + WIDTH_INNER/2 + "px " + WIDTH_INNER/2 + "px;\n\
		padding-right: " + w2 + "px;\n\
	}\n\
	div#food {\n\
		width: " + WIDTH_INNER + "px;\n\
		height: " + WIDTH_INNER + "px;\n\
	}";
}

function createSnake(len, headPos) {
	snake = [];
	while (snakeDiv.firstChild) snakeDiv.removeChild(snakeDiv.firstChild);
	for (var i = 0; i < len; i++) {
		var elem = [headPos[0], headPos[1] - (len - i - 1)];
		snake.push(elem);
		var div = document.createElement("div");
		div.setAttribute("o", 2);
		div.style.left = elem[1] * WIDTH_OUTER + w2/2 + "px";
		div.style.top  = elem[0] * WIDTH_OUTER + w2/2 + "px";
		snakeDiv.appendChild(div);
	}
	var head = snakeDiv.children[snakeDiv.children.length - 1];
	head.setAttribute("o", 0);
	inputDir = curDir = 2;
}

function dropFood() {
	var pos;
	do {
		pos = [Math.floor(Math.random() * M), Math.floor(Math.random() * N)];
	} while (snakeContains(pos));
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
	var head = snake[snake.length - 1];
	var elem = [head[0] + dy, head[1] + dx];
	var wrap = $("wrap").checked;
	if (!wrap && (elem[0] == -1 || elem[0] == M || elem[1] == -1 || elem[1] == N) || snakeContains(elem)) {
		gameover = true;
		acn($("overlay"), "shown");
		return;
	}
	elem = [(elem[0] + M) % M, (elem[1] + N) % N];
	var eat = (elem[0] == foodpos[0] && elem[1] == foodpos[1]);
	snake.push(elem);
	var div = document.createElement("div");
	snakeDiv.lastChild.setAttribute("o", dir);
	div.setAttribute("o", (dir + 2) % 4);
	div.style.left = elem[1] * WIDTH_OUTER + w2/2 + "px";
	div.style.top  = elem[0] * WIDTH_OUTER + w2/2 + "px";
	snakeDiv.appendChild(div);
	if (eat) {
		dropFood();
		delay = Math.max(20, delay * .95);
	} else {
		snake = snake.slice(1);
		snakeDiv.removeChild(snakeDiv.firstChild);
	}
}

function snakeContains(elem) {
	for (var i = 0; i < snake.length; i++)
		if (snake[i][0] == elem[0] && snake[i][1] == elem[1]) return true;
	return false;
}