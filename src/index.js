import GameLoop from "./gameloop.js";
import Walker from "./walker.js";
import WalkHistory from "./walkHistory.js";

let gameloop = new GameLoop();
let walkers = [];
let walkHistory = new WalkHistory();

window.onload = function () {
  for (let i = 0; i < 300; i++) {
    walkers.push(new Walker());
  }

  gameloop.start();
};

gameloop.init = function () {
  walkers.forEach((walker) => {
    walker.init(
      parseInt(gameloop.cnv.width / 2),
      parseInt(gameloop.cnv.height / 2)
    );
  });
};

gameloop.update = function () {
  walkers.forEach((walker) => {
    const newPosition = walker.walk(gameloop.cnv);
    if (newPosition !== null) walkHistory.logPosition(newPosition);
  });

  walkHistory.decayHistory();
};

gameloop.render = function () {
  gameloop.ctx.fillStyle = "white";
  gameloop.ctx.fillRect(0, 0, gameloop.cnv.width, gameloop.cnv.height);

  walkHistory.drawHistory(gameloop.ctx);

  walkers.forEach((walker) => {
    walker.draw(gameloop.ctx);
  });
};
