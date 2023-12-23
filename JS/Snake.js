function Snake(snakeDiv, styleElement, len, _ow) {
	var body;
	var ow, iw, w2;
	
	function updateStyles() {
		styleElement.textContent = 
		"div.snake {\n\
			position: absolute;\n\
			width: 0;\n\
			height: 0;\n\
		}\n\
		div.snake>div {\n\
			position: absolute;\n\
			background-color: #225;\n\
			display: inline-block;\n\
			width: " + iw + "px;\n\
			height: " + iw + "px;\n\
			transform-origin: " + iw/2 + "px " + iw/2 + "px;\n\
			padding-right: " + w2 + "px;\n\
		}";
	}
	
	this.resize = function(_ow) {
		ow = _ow;
		iw = ow / 1.25;
		w2 = ow - iw;
		updateStyles();
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