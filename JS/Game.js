function Game(M, N, gameDiv, startDelay) {
	var snake = false;
	var gameover = false;
	var delay = startDelay;
	var bordered = false;
	var m, n;
	var inputStack;
	var foodpos, foodDiv;
	var ow, iw, w2;
	var stacked = false;
	var styleFixed = document.createElement("style");
	var styleSize  = document.createElement("style");
	var styleColor = document.createElement("style");
	document.body.appendChild(styleFixed);
	document.body.appendChild(styleSize );
	document.body.appendChild(styleColor);
	
	styleFixed.textContent = 
	"div.game {\n\
		position: relative;\n\
		display: inline-block;\n\
	}\n\
	div.food {\n\
		position: absolute;\n\
	}";
	
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
	
	function lose() {
		gameover = true;
		window.dispatchEvent(new Event("gameEnded"));
	}
	
	function hitsBorder(elem) { return elem[0] == -1 || elem[0] == m || elem[1] == -1 || elem[1] == n; }

	function move() {
		if (!snake) return;
		processInput();
		var elem = snake.getNextTile();
		if (!bordered && hitsBorder(elem) || snake.contains(elem))
			return lose();
		elem = [byMod(elem[0], m), byMod(elem[1], n)];
		var eat = (elem[0] == foodpos[0] && elem[1] == foodpos[1]);
		snake.move(elem, eat);
		if (snake.length() == m * n) return lose();
		
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
		styleSize.textContent =
		"div.game {\n\
			width: " + ow * n + "px;\n\
			height: " + ow * m + "px;\n\
			left: " + Math.max(0, (dimX - ow * n - 2) / 2) + "px;\n\
			top: " + Math.max(0, (dimY - ow * m - 2) / 2) + "px;\n\
		}\n\
		div.food {\n\
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
		window.dispatchEvent(new Event("gameStarted"));
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
	
	this.setPalette = function(colHead, colTail, colHeadAI, colTailAI, colFood) {
		var colHead1 = new Color(colHead  );
		var colTail1 = new Color(colTail  );
		var colHead2 = new Color(colHeadAI);
		var colTail2 = new Color(colTailAI);
		var colFood1 = new Color(colFood  );
		snake?.updateColors(colHead1, colTail1, colHead2, colTail2);
		
		styleColor.textContent =
		"div.game {\n\
			border: 1px solid " + colHead1.toString("hex6") + ";\n\
		}\n\
		div.game.bordered {\n\
			box-shadow: 0 0 20px " + colHead1.toString("hex6") + ";\n\
		}\n\
		div.food {\n\
			background-color: " + colFood.toString("hex6") + ";\n\
		}";
	}
	
	this.setBordered = function(isBordered) {
		bordered = !!isBordered;
		if (bordered) acn(gameDiv, "bordered");
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