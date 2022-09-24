import random from "random";

class Walker {
  constructor() {
    this.xPos = 0;
    this.yPos = 0;
    this.color = "black";

    this.size = 1;
    this.step = 4;

    this.lastDirection = null;

    this.baseSpeed = 0.1; // lower is faster, 1 is fastest
    this.speedCounter = 0;

    this.directions = {
      UP: 4,
      LEFT: 2,
      RIGHT: 1,
      DOWN: 3,
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

  walk(cnv) {
    if (this.speedCounter < this.calculateSpeed()) {
      this.speedCounter++;
      return null;
    }

    this.speedCounter = 0;

    const keepDirection = random.int(0, 100);
    let direction = random.int(1, 4);
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
    }

    this.checkLimits(cnv);

    this.lastDirection = direction;

    this.tryGrow();

    return {
      xPos: this.xPos,
      yPos: this.yPos,
      size: this.drawSize(),
    };
  }

  tryGrow() {
    const chance = random.int(0, 1024);
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
}

export default Walker;
