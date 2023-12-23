function Snake(_div, len) {
	var body = [];
	var bodyDiv = _div;
	
	while (bodyDiv.firstChild) bodyDiv.removeChild(bodyDiv.firstChild);
	for (var i = 0; i < len; i++) {
		var elem = [0, i];
		body.push(elem);
		var div = document.createElement("div");
		div.setAttribute("o", 2);
		div.style.left = elem[1] * WIDTH_OUTER + w2/2 + "px";
		div.style.top  = elem[0] * WIDTH_OUTER + w2/2 + "px";
		snakeDiv.appendChild(div);
	}
	
}