import { getRandomInt } from "./utils.js";

class Walker {
  constructor() {
    this.xPos = 0;
    this.yPos = 0;
    this.color = "black";

    this.size = 1;
    this.step = 4;

    this.lastDirection = null;

    this.baseSpeed = 0; // lower is faster, 1 is fastest
    this.speedCounter = 0;

    this.age = 0;
    this.isAlive = true;

    this.oddsOfSpawn = 100;

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

  init(startX, startY) {
    this.xPos = startX;
    this.yPos = startY;
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
    if (this.age >= 600) {
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
    if (keepDirection >= 15 && this.lastDirection !== null) {
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

    this.checkLimits(cnv);

    this.lastDirection = direction;

    //this.tryGrow();

    return {
      xPos: this.xPos,
      yPos: this.yPos,
      size: this.drawSize(),
    };
  }

  tryGrow() {
    const chance = getRandomInt(0, 1024);
    if (chance === 1024) this.size++;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.drawSize(), this.drawSize());
  }

  checkLimits(cnv) {
    if (this.xPos + this.drawSize() > cnv.width) {
      this.xPos = cnv.width - this.drawSize();
      this.lastDirection = this.directions.LEFT;
    }

    if (this.xPos < 0) {
      this.xPos = 0;
      this.lastDirection = this.directions.RIGHT;
    }

    if (this.yPos < 0) {
      this.yPos = 1;
      this.lastDirection = this.directions.DOWN;
    }

    if (this.yPos + this.drawSize() > cnv.height) {
      this.yPos = cnv.height - this.drawSize();
      this.lastDirection = this.directions.UP;
    }
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
