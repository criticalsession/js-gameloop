import GameLoop from "./gameloop.js";
import Walker from "./walker.js";
import { maxWalkers } from './vars.js';

class Engine {
  constructor() {
    this.gameloop = new GameLoop();
    this.walkers = null;
    this.drawHistoryEnabled = false;
    this.removeDeadWalkersCounter = 0;

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
        if (this.walkers.size < maxWalkers) {
          const walkerSpawned = walker.checkSpawnWalker();
          if (walkerSpawned !== null) this.onSpawnWalker(walkerSpawned);
        }
      });

      this.removeDeadWalkersCounter++;
      if (this.removeDeadWalkersCounter >= 100){
        this.removeDeadWalkers();
        this.removeDeadWalkersCounter = 0;
      }
    };

    this.gameloop.render = () => {
      this.gameloop.ctx.fillStyle = "white";
      this.gameloop.ctx.fillRect(
        0,
        0,
        this.gameloop.cnv.width,
        this.gameloop.cnv.height
      );

      this.walkers.forEach((walker) => {
        walker.draw(this.gameloop.ctx);
      });

      this.gameloop.printData(this.walkers.size);
    };
  }

  go() {
    this.walkers = new Set();
    this.walkers.add(new Walker());
    this.gameloop.start();
  }

  onSpawnWalker(newSpawn) {
    let newWalker = new Walker();
    newWalker.init(newSpawn.xPos, newSpawn.yPos);

    this.walkers.add(newWalker);
  }

  removeDeadWalkers() {
    for (let w of this.walkers) {
      if (!w.isAlive) {
        this.walkers.delete(w);
      }
    }
  }
}

export default Engine;
