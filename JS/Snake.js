function Snake(snakeDiv, len, _ow) {
	var body;
	var ow, iw, w2;
	var styleMain = document.createElement("style");
	var styleTail = document.createElement("style");
	document.body.appendChild(styleMain);
	document.body.appendChild(styleTail);
	
	function updateMainStyle() {
		styleMain.textContent = 
		"div.snake {\n\
			position: absolute;\n\
			width: 0;\n\
			height: 0;\n\
		}\n\
		div.snake>div {\n\
			position: absolute;\n\
			display: inline-block;\n\
			width: " + iw + "px;\n\
			height: " + iw + "px;\n\
			transform-origin: " + iw/2 + "px " + iw/2 + "px;\n\
			padding-right: " + w2 + "px;\n\
		}\n\
		div.snake>div[o='0'] {transform: rotate(180deg);}\n\
		div.snake>div[o='1'] {transform: rotate(-90deg);}\n\
		div.snake>div[o='2'] {transform: rotate(0deg);}\n\
		div.snake>div[o='3'] {transform: rotate(90deg);}"
	}
	
	this.updateColors = function(colHead, colTail, colHeadAI, colTailAI) {
		var colHead1 = new Color(colHead  );
		var colTail1 = new Color(colTail  );
		var colHead2 = new Color(colHeadAI);
		var colTail2 = new Color(colTailAI);
		var text = "";
		var N = 10;
		for (var i = 0; i < N; ++i)
			text += "div.snake>div:nth-last-child(" + (i+1) + ") { background-image: linear-gradient(to left, " +
					colHead1.mix(colTail1, i/N).toString("hex6") + ", " + colHead1.mix(colTail1, (i+1)/N).toString("hex6") + "); }\n";
		text += "div.snake>div { background-color: " + colTail1.toString("hex6") + "; }";
		text += "\n";
		for (var i = 0; i < N; ++i)
			text += "div.snake.ai>div:nth-last-child(" + (i+1) + ") { background-image: linear-gradient(to left, " +
					colHead2.mix(colTail2, i/N).toString("hex6") + ", " + colHead2.mix(colTail2, (i+1)/N).toString("hex6") + "); }\n";
		text += "div.snake.ai>div { background-color: " + colTail2.toString("hex6") + "; }";
		styleTail.textContent = text;
	}
	
	this.resize = function(_ow) {
		ow = _ow;
		iw = ow / 1.25;
		w2 = ow - iw;
		updateMainStyle();
	}
	
	this.reset = function(len, ow) {
		while (snakeDiv.firstChild) snakeDiv.removeChild(snakeDiv.firstChild);
		acn(snakeDiv, "snake");
		body = [];
		this.resize(ow);
		for (var i = 0; i < len; i++) {
			var elem = [0, i];
			body.push(elem);
			var div = document.createElement("div");
			div.setAttribute("o", 2);
			div.style.left = elem[1] * ow + w2/2 + "px";
			div.style.top  = elem[0] * ow + w2/2 + "px";
			snakeDiv.appendChild(div);
		}
		var head = snakeDiv.children[snakeDiv.children.length - 1];
		head.setAttribute("o", 0);
		this.direction = 2;
	}
	
	this.contains = function(elem) {
		for (var i = 0; i < body.length; i++)
			if (body[i][0] == elem[0] && body[i][1] == elem[1]) return true;
		return false;
	}
	
	this.move = function(pos, dir, eat) {
		body.push(pos);
		var div = document.createElement("div");
		snakeDiv.lastChild.setAttribute("o", dir);
		div.setAttribute("o", (dir + 2) % 4);
		div.style.left = pos[1] * ow + w2/2 + "px";
		div.style.top  = pos[0] * ow + w2/2 + "px";
		snakeDiv.appendChild(div);
		if (eat) return;
		body = body.slice(1);
		snakeDiv.removeChild(snakeDiv.firstChild);
	}
	
	this.head = () => body[body.length - 1];
	
	this.reset(len, _ow);
}