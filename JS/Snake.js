function Snake(snakeDiv, len, _ow) {
	var body;
	var ow, iw, w2;
	var styleFixed = document.createElement("style");
	var styleSize  = document.createElement("style");
	var styleColor = document.createElement("style");
	document.body.appendChild(styleFixed);
	document.body.appendChild(styleSize );
	document.body.appendChild(styleColor);
	
	styleFixed.textContent =
	"div.snake {\n\
		position: absolute;\n\
		width: 0;\n\
		height: 0;\n\
	}\n\
	div.snake>div {\n\
		position: absolute;\n\
		display: inline-block;\n\
	}\n\
	div.snake>div[o='0'] {transform: rotate(180deg);}\n\
	div.snake>div[o='1'] {transform: rotate(-90deg);}\n\
	div.snake>div[o='2'] {transform: rotate(0deg);}\n\
	div.snake>div[o='3'] {transform: rotate(90deg);}";
	
	function updateStyleSize() {
		styleSize.textContent = 
		"div.snake>div {\n\
			width: " + iw + "px;\n\
			height: " + iw + "px;\n\
			transform-origin: " + iw/2 + "px " + iw/2 + "px;\n\
			padding-right: " + w2 + "px;\n\
		}"
	}
	
	function appendSnakePiece(pos, dir) {
		body.push(pos);
		var div = document.createElement("div");
		div.setAttribute("o", dir);
		div.style.left = pos[1] * ow + w2/2 + "px";
		div.style.top  = pos[0] * ow + w2/2 + "px";
		snakeDiv.appendChild(div);
	}
	
	this.updateColors = function(colHead, colTail, colHeadAI, colTailAI) {
		var text = "";
		var N = 10;
		for (var i = 0; i < N; ++i)
			text += "div.snake>div:nth-last-child(" + (i+1) + ") { background-image: linear-gradient(to left, " +
					colHead.mix(colTail, i/N).toString("hex6") + ", " + colHead.mix(colTail, (i+1)/N).toString("hex6") + "); }\n";
		text += "div.snake>div { background-color: " + colTail.toString("hex6") + "; }";
		text += "\n";
		for (var i = 0; i < N; ++i)
			text += "div.snake.ai>div:nth-last-child(" + (i+1) + ") { background-image: linear-gradient(to left, " +
					colHead.mix(colTail, i/N).toString("hex6") + ", " + colHead.mix(colTail, (i+1)/N).toString("hex6") + "); }\n";
		text += "div.snake.ai>div { background-color: " + colTail.toString("hex6") + "; }";
		styleColor.textContent = text;
	}
	
	this.resize = function(_ow) {
		ow = _ow;
		iw = ow / 1.25;
		w2 = ow - iw;
		updateStyleSize();
	}
	
	this.reset = function(len, ow) {
		body = [];
		while (snakeDiv.firstChild) snakeDiv.removeChild(snakeDiv.firstChild);
		acn(snakeDiv, "snake");
		this.resize(ow);
		for (var i = 0; i < len; i++)
			appendSnakePiece([0, i], 2);
		this.direction = 2;
	}
	
	this.contains = function(elem) {
		for (var i = 0; i < body.length; i++)
			if (body[i][0] == elem[0] && body[i][1] == elem[1]) return true;
		return false;
	}
	
	this.getNextTile = function() {
		var dir = this.direction;
		var dx = (dir - 1) % 2;
		var dy = (dir - 2) % 2;
		var head = this.head();
		return [head[0] + dy, head[1] + dx];
	}
	
	this.move = function(pos, eat) {
		var dir = this.direction;
		snakeDiv.lastChild.setAttribute("o", dir);
		appendSnakePiece(pos, (dir + 2) % 4);
		if (eat) return;
		body = body.slice(1);
		snakeDiv.removeChild(snakeDiv.firstChild);
	}
	
	this.length = () => body.length;
	this.head = () => body[body.length - 1];
	
	this.reset(len, _ow);
}