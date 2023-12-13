import _ from "lodash";

import { getRandomInt } from "./utils.js";
import GameLoop from "./gameloop.js";
import Walker from "./walker.js";
import Grass from "./grass.js";
import {
  maxWalkers,
  colors,
  grassGrowPercChance,
  growGrassRate,
  initialGrassRate,
} from "./vars.js";

class Engine {
  constructor() {
    this.gameloop = new GameLoop();
    this.walkers = [];
    this.grass = [];
    this.drawHistoryEnabled = false;
    this.removeDeadWalkersCounter = 0;
    this.population = 0;
    this.cnvWidth = 0;
    this.cnvHeight = 0;

    this.lastGrowGrass = 0;

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

      for (let i = 0; i < this.population; i++) {
        let walker = new Walker();
        walker.on("walker-died", (data) => {
          this.walkerDied(data);
        });
        walker.init(
          parseInt(this.gridWidth / 2),
          parseInt(this.gridHeight / 2),
          this.gridWidth,
          this.gridHeight
        );

        this.walkers.push(walker);
      }

      this.initGrass();
    };

    this.gameloop.update = () => {
      this.lastGrowGrass += getRandomInt(-2, 5);
      if (this.lastGrowGrass >= growGrassRate) {
        this.growGrass();
        this.lastGrowGrass = 0;
      }

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

          // try to eat grass
          walker.eat(this.grass[walker.xPos][walker.yPos]);
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
          if (this.grass[x][y].isAlive) {
            this.canvas.fillRect(
              x * this.gridSize,
              y * this.gridSize,
              this.gridSize,
              this.gridSize
            );
          }
        }
      }

      this.canvas.fillStyle = colors.walker;
      this.renderWalkers.forEach((w) => {
        this.canvas.fillRect(w[0], w[1], this.gridSize, this.gridSize);
      });

      this.gameloop.printData(this.population);

      this.renderWalkers.clear();
    };
  }

  go() {
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

    newWalker.on("walker-died", (data) => {
      this.walkerDied(data);
    });

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
      this.grass[x] = [];
      for (let y = 0; y < this.gridHeight; y++) {
        this.grass[x][y] = new Grass(x, y, getRandomInt(1, 100) <= initialGrassRate);
      }
    }
  }

  walkerDied({ x, y }) {
    this.grass[x][y].grow();
  }

  growGrass() {
    let newGrass = [];

    for (let x = 0; x < this.gridWidth; x++) {
      newGrass[x] = [];

      for (let y = 0; y < this.gridHeight; y++) {
        let tile = this.grass[x][y];
        newGrass[x][y] = _.cloneDeep(tile);

        if (!tile.isAlive) {
          let touchingGrass = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              if (
                x + i >= 0 &&
                x + i < this.gridWidth &&
                y + j >= 0 &&
                y + j < this.gridHeight
              ) {
                if (this.grass[x + i][y + j].isAlive) {
                  touchingGrass++;
                }
              }
            }
          }

          if (touchingGrass > 0) {
            if (getRandomInt(0, 100) <= (grassGrowPercChance / (touchingGrass / 2))) {
              newGrass[x][y].grow();
            }
          }
        }
      }
    }

    this.grass = newGrass;
  }
}

export default Engine;
