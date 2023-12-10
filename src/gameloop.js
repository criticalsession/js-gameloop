class GameLoop {
  constructor() {
    this.maxFPS = 60;
    this.cnv = null;
    this.ctx = null;
    this.loop = null;
    this.fps = {
      show: true,
      lastRenderTime: null,
      lastRenderCount: 0,
      renderFrequency: 60,
      lastFPS: null,
      msPassedSum: 0,
    };
  }

  prepareCanvas() {
    this.cnv = document.getElementById("canvas");
    this.ctx = this.cnv.getContext("2d");
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    this.cnv.width = window.innerWidth / 2;
    this.cnv.height = window.innerHeight / 2 - 10;
  }

  init() {}

  update() {}

  render() {}

  printFPS() {
    if (this.fps.show) {
      // work fps based on last frame
      const nowTime = new Date();

      if (this.fps.lastRenderTime !== null) {
        const msPassed = nowTime - this.fps.lastRenderTime;
        this.fps.msPassedSum += msPassed;
      }

      this.fps.lastRenderTime = nowTime;

      if (this.fps.lastRenderCount < this.fps.renderFrequency) {
        // increment counter, reuse last fps shown
        this.fps.lastRenderCount++;
      } else {
        // work average fps of last fps.renderFrequency frames
        this.fps.lastFPS =
          (1 / (this.fps.msPassedSum / this.fps.renderFrequency)) * 1000;

        // reset counters
        this.fps.lastRenderCount = 0;
        this.fps.msPassedSum = 0;
      }

      this.ctx.fillStyle = "red";
      this.ctx.font = "bold 16px sans-serif";
      if (this.fps.lastFPS !== null) {
        // print fps
        this.ctx.fillText(
          `FPS ${this.fps.lastFPS.toFixed(1)}`,
          this.cnv.width - 100,
          30
        );
      } else {
        this.ctx.fillText(`FPS --`, this.cnv.width - 100, 30);
      }
    }
  }

  start() {
    this.prepareCanvas();
    this.init();

    this.loop = setInterval(() => {
      this.update();
      this.render();
    }, 1000 / this.maxFPS);
  }
}

export default GameLoop;
