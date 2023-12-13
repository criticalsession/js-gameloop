import GameLoop from "./gameloop.js";
import Walker from "./walker.js";
import Grass from "./grass.js";
import { maxWalkers, colors } from "./vars.js";

class Engine {
  constructor() {
    this.gameloop = new GameLoop();
    this.walkers = [];
    this.grass = [,];
    this.drawHistoryEnabled = false;
    this.removeDeadWalkersCounter = 0;
    this.population = 0;
    this.cnvWidth = 0;
    this.cnvHeight = 0;

    this.renderWalkers = new Set();

    this.gridSize = 4;
    this.gridWidth = 0;
    this.gridHeight = 0;

    this.canvas;

    this.gameloop.init = () => {
      this.cnvWidth = this.gameloop.cnv.width;
      this.cnvHeight = this.gameloop.cnv.height;

      this.gridWidth = this.cnvWidth / this.gridSize;
      this.gridHeight = this.cnvHeight / this.gridSize;

      this.canvas = this.gameloop.ctx;

      this.walkers.forEach((walker) => {
        walker.init(
          parseInt(this.gridWidth / 2),
          parseInt(this.gridHeight / 2),
          this.gridWidth,
          this.gridHeight
        );
      });

      this.initGrass();
    };

    this.gameloop.update = () => {
      this.renderWalkers = new Set();
      this.renderGrass = new Set();

      this.walkers.forEach((walker) => {
        walker.walk();
        if (walker.isAlive) {
          if (this.walkers.length < maxWalkers) {
            const walkerSpawned = walker.checkSpawnWalker();
            if (walkerSpawned !== null) this.onSpawnWalker(walkerSpawned);
          }

          this.renderWalkers.add([
            walker.xPos * this.gridSize,
            walker.yPos * this.gridSize,
          ]);
        }
      });

      this.removeDeadWalkersCounter++;
      if (this.removeDeadWalkersCounter >= 100) {
        this.removeDeadWalkers();
        this.removeDeadWalkersCounter = 0;
      }
    };

    this.gameloop.render = () => {
      this.canvas.fillStyle = colors.ground;
      this.canvas.fillRect(0, 0, this.cnvWidth, this.cnvHeight);

      this.canvas.fillStyle = colors.grass;
      for (let x = 0; x < this.gridWidth; x++) {
        for (let y = 0; y < this.gridHeight; y++) {
          this.canvas.fillRect(
            x * this.gridSize,
            y * this.gridSize,
            this.gridSize,
            this.gridSize
          );
        }
      }

      this.canvas.fillStyle = colors.walker;
      this.renderWalkers.forEach((w) => {
        this.canvas.fillRect(w[0], w[1], this.gridSize, this.gridSize);
      });

      this.gameloop.printData(this.population);

      this.renderWalkers.clear();
      this.renderGrass.clear();
    };
  }

  go() {
    this.walkers.push(new Walker());
    this.population = 1;
    this.gameloop.start();
  }

  onSpawnWalker(newSpawn) {
    let newWalker = new Walker();
    newWalker.init(
      newSpawn.xPos,
      newSpawn.yPos,
      this.gridWidth,
      this.gridHeight
    );

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

  initGrass() {
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        this.grass[(x, y)] = new Grass(x, y);
      }
    }
  }
}

export default Engine;
