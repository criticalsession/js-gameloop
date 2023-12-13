import { getRandomInt } from "./utils.js";
import { lifespanMin, lifespanMax } from "./vars.js";

class Walker {
  constructor() {
    this.xPos = 0;
    this.yPos = 0;

    this.size = 1;
    this.step = 4;

    this.lastDirection = null;

    this.baseSpeed = 0; // lower is faster, 1 is fastest
    this.speedCounter = 0;

    this.age = 0;
    this.lifespan = 0;
    this.isAlive = true;

    this.oddsOfSpawn = 100;
    this.keepDirectionPerc = 80;

    this.cnvWidth = 0;
    this.cnvHeight = 0;

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

  init(startX, startY, cnvWidth, cnvHeight) {
    this.xPos = startX;
    this.yPos = startY;
    this.cnvWidth = cnvWidth;
    this.cnvHeight = cnvHeight;

    this.maxAge = getRandomInt(lifespanMin, lifespanMax);
  }

  calculateSpeed() {
    return this.baseSpeed * (this.size * this.size);
  }

  drawSize() {
    return this.size * 4;
  }

  walk(cnv, engine) {
    if (!this.isAlive) return;

    this.age++;
    if (this.age >= this.maxAge) {
      this.isAlive = false;
      return;
    }

    if (this.speedCounter < this.calculateSpeed()) {
      this.speedCounter++;
      return null;
    }

    this.speedCounter = 0;

    const keepDirection = getRandomInt(0, 100);
    let direction = getRandomInt(1, 8);
    if (keepDirection >= (100 - this.keepDirectionPerc) && this.lastDirection !== null) {
      direction = this.lastDirection;
    }

    switch (direction) {
      case this.directions.RIGHT:
        this.xPos += this.step;
        break;
      case this.directions.LEFT:
        this.xPos += -this.step;
        break;
      case this.directions.DOWN:
        this.yPos += this.step;
        break;
      case this.directions.UP:
        this.yPos += -this.step;
        break;
      case this.directions.RIGHT_UP:
        this.xPos += this.step;
        this.yPos += -this.step;
      break;
      case this.directions.RIGHT_DOWN:
        this.xPos += this.step;
        this.yPos += this.step;
      break;
      case this.directions.LEFT_UP:
        this.xPos += -this.step;
        this.yPos += -this.step;
      break;
      case this.directions.LEFT_DOWN:
        this.xPos += -this.step;
        this.yPos += this.step;
      break;
    }

    const newDirection = this.checkLimits(cnv);
    if (newDirection) direction = newDirection;

    this.lastDirection = direction;

    return {
      xPos: this.xPos,
      yPos: this.yPos,
      size: this.drawSize(),
    };
  }

  checkLimits() {
    if (this.xPos + this.drawSize() > this.cnvWidth) {
      this.xPos = this.cnvWidth - this.drawSize();
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

    if (this.yPos + this.drawSize() > this.cnvHeight) {
      this.yPos = this.cnvHeight - this.drawSize();
      return this.directions.UP;
    }

    return null;
  }

  checkSpawnWalker() {
    if (getRandomInt(1, this.oddsOfSpawn) === this.oddsOfSpawn) {
      return {
        xPos: this.xPos,
        yPos: this.yPos,
      };
    }

    return null;
  }
}

export default Walker;
