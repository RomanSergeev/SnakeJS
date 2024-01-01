window.onload = function() {
	body  = document.body;
	wrap  = $("wrap");
	stack = $("stacked");
	ael(wrap, "change", updateGameBordered);
	game = new Game(30, 40, $("game"), 100);
	game.createSnake(4);
	game.setPalette("#558", "#225", "#558", "#223", "#522");
	
	updateGameBordered();
	updateGameStacked ();
}

updateGameBordered = () => game.setBordered(wrap .checked);
updateGameStacked  = () => game.setStacked (stack.checked);

ael(window, "gameStarted", () => rcn($("overlay"), "shown"));
ael(window, "gameEnded"  , () => acn($("overlay"), "shown"));
ael(window, "keydown"    , event => {
	switch(event.keyCode) {
		// 37 left 38 up 39 right 40 down
		case 37:
		case 38:
		case 39:
		case 40: { event.preventDefault(); game.stackInput(event.keyCode - 37); break; }
		case 32: { if (game.over()) game.restart(4); break; }
		case 66: { wrap .checked = !wrap .checked; updateGameBordered(); break; }
		case 83: { stack.checked = !stack.checked; updateGameStacked (); break; }
		default: break;
	}
});

var game;
var wrap, stack;