import GameLoop from "./gameloop.js";
import Walker from "./walker.js";
import WalkHistory from "./walkHistory.js";

class Engine {
  constructor() {
    this.gameloop = new GameLoop();
    this.walkers = [];
    this.walkHistory = new WalkHistory();
    this.maxWalkers = 500;
    this.drawHistoryEnabled = true;

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
        const newPosition = walker.walk(this.gameloop.cnv, this);
        if (newPosition !== null && this.drawHistoryEnabled)
          this.walkHistory.logPosition(newPosition);

        this.removeDeadWalkers();
      });

      if (this.drawHistoryEnabled) this.walkHistory.decayHistory();
    };

    this.gameloop.render = () => {
      this.gameloop.ctx.fillStyle = "white";
      this.gameloop.ctx.fillRect(
        0,
        0,
        this.gameloop.cnv.width,
        this.gameloop.cnv.height
      );

      if (this.drawHistoryEnabled)
        this.walkHistory.drawHistory(this.gameloop.ctx);

      this.walkers.forEach((walker) => {
        walker.draw(this.gameloop.ctx);
      });

      this.gameloop.printFPS();
    };
  }

  go() {
    this.walkers.push(new Walker());
    this.gameloop.start();
  }

  onSpawnWalker(newSpawn) {
    let newWalker = new Walker();
    newWalker.init(newSpawn.xPos, newSpawn.yPos);

    this.walkers.push(newWalker);
  }

  removeDeadWalkers() {
    this.walkers = this.walkers.filter((p) => p.isAlive);
  }
}

export default Engine;
