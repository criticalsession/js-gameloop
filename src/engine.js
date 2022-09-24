import GameLoop from "./gameloop.js";
import Walker from "./walker.js";
import WalkHistory from "./walkHistory.js";

class Engine {
  constructor() {
    this.gameloop = new GameLoop();
    this.walkers = [];
    this.walkHistory = new WalkHistory();

    this.gameloop.init = () => {
      this.walkers.forEach((walker) => {
        walker.init(
          parseInt(this.gameloop.cnv.width / 2),
          parseInt(this.gameloop.cnv.height / 2)
        );
      });
    };

    this.gameloop.update = () => {
      this.walkers.forEach((walker) => {
        const newPosition = walker.walk(this.gameloop.cnv);
        if (newPosition !== null) this.walkHistory.logPosition(newPosition);
      });

      this.walkHistory.decayHistory();
    };

    this.gameloop.render = () => {
      this.gameloop.ctx.fillStyle = "white";
      this.gameloop.ctx.fillRect(
        0,
        0,
        this.gameloop.cnv.width,
        this.gameloop.cnv.height
      );

      this.walkHistory.drawHistory(this.gameloop.ctx);

      this.walkers.forEach((walker) => {
        walker.draw(this.gameloop.ctx);
      });
    };
  }

  go() {
    this.walkers.push(new Walker());
    this.gameloop.start();
  }
}

export default Engine;
