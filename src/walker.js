import { getRandomInt } from "./utils.js";
import { lifespanMin, lifespanMax, initialWalkerEnergy } from "./vars.js";
import EventEmitter from "tiny-emitter";

class Walker extends EventEmitter {
  constructor() {
    super();
    this.xPos = 0;
    this.yPos = 0;

    this.lastDirection = null;

    this.baseSpeed = 0; // lower is faster, 1 is fastest

    this.age = 0;
    this.lifespan = 0;
    this.isAlive = true;

    this.oddsOfSpawn = 100;
    this.keepDirectionPerc = 80;

    this.gridWidth = 0;
    this.gridHeight = 0;

    this.energy = initialWalkerEnergy;

    this.directions = {
      RIGHT: 1,
      LEFT: 2,
      DOWN: 3,
      UP: 4,
      RIGHT_UP: 5,
      RIGHT_DOWN: 6,
      LEFT_UP: 7,
      LEFT_DOWN: 8,
    };
  }

  init(startX, startY, gridWidth, gridHeight) {
    this.xPos = startX;
    this.yPos = startY;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.maxAge = getRandomInt(lifespanMin, lifespanMax);
  }

  walk() {
    if (!this.isAlive) return;

    this.age++;
    this.energy--;

    if (this.age >= this.maxAge) {
      this.die();
      return;
    }

    if (this.energy <= 0) {
      this.die();
      return;
    }

    const keepDirection = getRandomInt(0, 100); // todo: extract keep direction to vars
    let direction = getRandomInt(1, 8);
    if (
      keepDirection >= 100 - this.keepDirectionPerc &&
      this.lastDirection !== null
    ) {
      direction = this.lastDirection;
    }

    switch (direction) {
      case this.directions.RIGHT:
        this.xPos++;
        break;
      case this.directions.LEFT:
        this.xPos--;
        break;
      case this.directions.DOWN:
        this.yPos++;
        break;
      case this.directions.UP:
        this.yPos--;
        break;
      case this.directions.RIGHT_UP:
        this.xPos++;
        this.yPos--;
        break;
      case this.directions.RIGHT_DOWN:
        this.xPos++;
        this.yPos++;
        break;
      case this.directions.LEFT_UP:
        this.xPos--;
        this.yPos--;
        break;
      case this.directions.LEFT_DOWN:
        this.xPos--;
        this.yPos++;
        break;
    }

    const newDirection = this.checkLimits();
    if (newDirection) direction = newDirection;

    this.lastDirection = direction;

    return {
      xPos: this.xPos,
      yPos: this.yPos,
    };
  }

  checkLimits() {
    if (this.xPos > this.gridWidth - 1) {
      this.xPos = this.gridWidth - 2;
      return this.directions.LEFT;
    }

    if (this.xPos < 0) {
      this.xPos = 0;
      return this.directions.RIGHT;
    }

    if (this.yPos < 0) {
      this.yPos = 1;
      return this.directions.DOWN;
    }

    if (this.yPos > this.gridHeight - 1) {
      this.yPos = this.gridHeight - 2;
      return this.directions.UP;
    }

    return null;
  }

  checkSpawnWalker() {
    if (this.energy < 30) return null;

    if (getRandomInt(1, this.oddsOfSpawn) === this.oddsOfSpawn) {
      this.energy -= 50;

      return {
        xPos: this.xPos,
        yPos: this.yPos,
      };
    }

    return null;
  }

  die() {
    this.isAlive = false;
    this.emit('walker-died', {
      x: this.xPos,
      y: this.yPos
    });
  }

  eat(grass) {
    try {
      if (grass.isAlive) {
        this.energy += 20;
        grass.getEaten();
      }
    } catch {
      console.error(
        "Failed while trying to eat grass at ",
        this.xPos,
        this.yPos
      );
    }
  }
}

export default Walker;
