window.onload = function() {
	body = document.body;
	ael($("wrap"), "change", () => game.setWrap($("wrap").checked));
	game = new Game(30, 40, $("game"), 100);
	game.createSnake(4);
	game.setSnakeStyle("#558", "#225", "#558", "#223");
	
	checkWrap();
	rcn($("overlay"), "shown");
	//gameStart(30, 40, 4, 100);
}

checkWrap = () => game.setWrap(wrap.checked);

/*toggleWrap = function() {
	$("wrap").checked = !$("wrap").checked;
	checkWrap();
}*/

window.addEventListener("keydown", function(event) {
	switch(event.keyCode) {
		// 37 left 38 up 39 right 40 down
		case 37:
		case 38:
		case 39:
		case 40: { event.preventDefault(); game.stackInput(event.keyCode - 37); break; /*setDirection(event.keyCode - 37);*/ }
		case 32: { if (game.over()) game.restart(4); break; }
		//case 66: { toggleWrap(); break; }
		default: break;
	}
});

var game;