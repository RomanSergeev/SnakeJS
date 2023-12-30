function Game(M, N, gameDiv, startDelay) {
	var snake = false;
	var gameover = false;
	var delay = startDelay;
	var wrap = false;
	var m, n;
	var inputStack;
	var foodpos, foodDiv;
	var ow, iw, w2;
	var stacked;
	var gameStyle = document.createElement("style");
	document.body.appendChild(gameStyle);
	
	function dropFood() {
		var pos;
		do {
			pos = [randomInteger(m), randomInteger(n)];
		} while (snake && snake.contains(pos));
		foodpos = pos.slice();
		foodDiv.style.left = pos[1] * ow + w2/2 + "px";
		foodDiv.style.top  = pos[0] * ow + w2/2 + "px";
	}
	
	function run() {
		move();
		!gameover && setTimeout(run, delay);
	}
	
	function processInput() {
		if (inputStack.length == 0) return;
		snake.direction = inputStack[0];
		inputStack = inputStack.slice(1);
	}

	function move() {
		if (!snake) return;
		processInput();
		var elem = snake.getNextTile();
		if (!wrap && (elem[0] == -1 || elem[0] == m || elem[1] == -1 || elem[1] == n) || snake.contains(elem)) {
			gameover = true;
			acn($("overlay"), "shown");
			return;
		}
		elem = [byMod(elem[0], m), byMod(elem[1], n)];
		var eat = (elem[0] == foodpos[0] && elem[1] == foodpos[1]);
		snake.move(elem, eat);
		
		if (eat) {
			dropFood();
			delay = Math.max(20, delay * .95);
		}
	}
	
	function createField(M, N) {
		m = M;
		n = N;
		var dimX = document.documentElement.clientWidth - 2; // 2 for border
		var dimY = document.documentElement.clientHeight - 2;
		ow = Math.min(20, Math.max(1, Math.min(Math.floor(dimX / n), Math.floor(dimY / m))));
		iw = ow / 1.25;
		w2 = ow - iw;
		gameStyle.textContent =
		"div.game {\n\
			position: relative;\n\
			display: inline-block;\n\
			border: 1px solid #558;\n\
			width: " + ow * n + "px;\n\
			height: " + ow * m + "px;\n\
			left: " + Math.max(0, (dimX - ow * n - 2) / 2) + "px;\n\
			top: " + Math.max(0, (dimY - ow * m - 2) / 2) + "px;\n\
		}\n\
		div.game.bordered {\n\
			box-shadow: 0 0 20px #558;\n\
		}\n\
		div.food {\n\
			position: absolute;\n\
			background-color: #522;\n\
			width: " + iw + "px;\n\
			height: " + iw + "px;\n\
		}";
	}
	
	function validInput(dir1, dir2) { return (dir1 - dir2) & -2 != dir1 - dir2; }
	
	this.stackInput = function(input) {
		if (!snake) return;
		if (!isIntegerInRange(input, 0, 3)) return;
		if (!stacked || inputStack.length == 0) {
			if (validInput(input, snake.direction))
				inputStack = [input];
			return;
		}
		var last = inputStack[inputStack.length - 1];
		if (validInput(input, last))
			inputStack.push(input);
	}
	
	this.setStacked = x => {
		stacked = !!x;
		if (!stacked) inputStack = inputStack.slice(0, 1);
	}
	
	this.restart = function(len) {
		snake.reset(len, ow);
		gameover = false;
		delay = startDelay;
		inputStack = [];
		dropFood();
		rcn($("overlay"), "shown");
		//inputStack = [snake.direction];
		run();
	}
	
	this.createSnake = function(len) {
		if (snake) { this.restart(len); return; }
		var snakeDiv = document.createElement("div");
		acn(snakeDiv, "snake");
		gameDiv.appendChild(snakeDiv);
		snake = new Snake(snakeDiv, len, ow);
		inputStack = [];
	}
	
	this.setSnakeStyle = function(colHead, colTail, colHeadAI, colTailAI) {
		snake?.updateColors(colHead, colTail, colHeadAI, colTailAI);
	}
	
	this.setWrap = function(wrapped) {
		wrap = wrapped;
		if (wrap) acn(gameDiv, "bordered");
		else rcn(gameDiv, "bordered");
	}
	
	this.over = () => gameover;
	
	acn(gameDiv, "game");
	createField(M, N);
	foodDiv = document.createElement("div");
	acn(foodDiv, "food");
	gameDiv.appendChild(foodDiv);
	dropFood();
	run();
}