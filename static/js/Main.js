import Game from './Game.js';
import Net from './Net.js';
import Ui from './Ui.js';
const ui = new Ui();
const game = new Game(ui);
const net = new Net(game, ui);

window.addEventListener('resize', game.onWindowResize, false);
document.getElementById("root").addEventListener('mousedown', function (ev) { game.onMouseDown(ev) }, false)


