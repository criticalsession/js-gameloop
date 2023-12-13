import GameLoop from "./gameloop.js";
import Walker from "./walker.js";
import { maxWalkers, colors } from './vars.js';

class Engine {
  constructor() {
    this.gameloop = new GameLoop();
    this.walkers = [];
    this.drawHistoryEnabled = false;
    this.removeDeadWalkersCounter = 0;
    this.population = 0;
    this.cnvWidth = 0; 
    this.cnvHeight = 0;

    this.renderCells = new Set();

    this.gameloop.init = () => {
      this.cnvWidth = this.gameloop.cnv.width;
      this.cnvHeight = this.gameloop.cnv.height;

      this.walkers.forEach((walker) => {
        walker.init(
          parseInt(this.cnvWidth / 2),
          parseInt(this.cnvHeight / 2),
          this.cnvWidth,
          this.cnvHeight
        );
      });
    };

    this.gameloop.update = () => {
      this.renderCells = new Set();
      this.walkers.forEach((walker) => {
        const newPosition = walker.walk(this.gameloop.cnv, this);
        if (this.walkers.length < maxWalkers) {
          const walkerSpawned = walker.checkSpawnWalker();
          if (walkerSpawned !== null) this.onSpawnWalker(walkerSpawned);
        }

        if (walker.isAlive) {
          this.renderCells.add([ walker.xPos, walker.yPos, walker.size * 4 ]);
        }
      });

      this.removeDeadWalkersCounter++;
      if (this.removeDeadWalkersCounter >= 100){
        this.removeDeadWalkers();
        this.removeDeadWalkersCounter = 0;
      }
    };

    this.gameloop.render = () => {
      this.gameloop.ctx.fillStyle = colors.ground;
      this.gameloop.ctx.fillRect(
        0,
        0,
        this.cnvWidth,
        this.cnvHeight
      );

      this.renderCells.forEach(cell => {
        this.gameloop.ctx.fillStyle = colors.walker;
        this.gameloop.ctx.fillRect(cell[0], cell[1], cell[2], cell[2]);
      });

      this.gameloop.printData(this.population);

      this.renderCells.clear();
    };
  }

  go() {
    this.walkers.push(new Walker());
    this.population = 1;
    this.gameloop.start();
  }

  onSpawnWalker(newSpawn) {
    let newWalker = new Walker();
    newWalker.init(newSpawn.xPos, newSpawn.yPos, this.cnvWidth, this.cnvHeight);

    this.walkers.push(newWalker);
    this.population++;
  }

  removeDeadWalkers() {
    for (let i = this.walkers.length - 1; i >= 0; i--) {
      const w = this.walkers[i];
      if (!w.isAlive) {
        this.walkers.splice(i, 1);
        this.population--;
      }
    }
  }
}

export default Engine;
