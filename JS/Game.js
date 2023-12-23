function Game(M, N, gameDiv, gameStyle, startDelay) {
	var snake = false;
	var gameover = false;
	var delay = startDelay;
	var wrap = false;
	var m, n;
	var inputDir;
	var foodpos, foodDiv;
	var ow, iw, w2;
	
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

	function move() {
		if (!snake) return;
		if ((inputDir - snake.direction) & 1) {
			snake.direction = inputDir;
		}
		var dir = snake.direction;
		var dx = (dir - 1) % 2;
		var dy = (dir - 2) % 2;
		var head = snake.head();
		var elem = [head[0] + dy, head[1] + dx];
		var wrap = $("wrap").checked;
		if (!wrap && (elem[0] == -1 || elem[0] == m || elem[1] == -1 || elem[1] == n) || snake.contains(elem)) {
			gameover = true;
			acn($("overlay"), "shown");
			return;
		}
		elem = [byMod(elem[0], m), byMod(elem[1], n)];
		var eat = (elem[0] == foodpos[0] && elem[1] == foodpos[1]);
		snake.move(elem, dir, eat);
		
		if (eat) {
			dropFood();
			delay = Math.max(20, delay * .95);
		}
	}
	
	function createField(M, N) {
		m = M;
		n = N;
		var dimX = document.documentElement.clientWidth - 2;  // 2 for border
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
	
	this.stackInput = function(input) { inputDir = input; }
	
	this.restart = function(len) {
		snake.reset(len, ow);
		gameover = false;
		rcn($("overlay"), "shown");
		inputDir = 2;
		run();
	}
	
	this.createSnake = function(styleElement, len) {
		if (snake) { this.restart(len); return; }
		var snakeDiv = document.createElement("div");
		acn(snakeDiv, "snake");
		gameDiv.appendChild(snakeDiv);
		snake = new Snake(snakeDiv, styleElement, len, ow);
		inputDir = snake.direction;
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