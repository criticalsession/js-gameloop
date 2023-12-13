import {maxFPS} from './vars.js'

class GameLoop {
  constructor() {
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
    this.dataContainers = {
      fps: null,
      population: null,
    };
  }

  prepareCanvas() {
    this.cnv = document.getElementById("canvas");
    this.ctx = this.cnv.getContext("2d");
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    this.cnv.width = window.innerWidth / 2;
    this.cnv.height = window.innerHeight / 2 - 10;

    this.dataContainers.fps = document.getElementById('fps');
    this.dataContainers.population = document.getElementById('population');
  }

  init() {}

  update() {}

  render() {}

  printData(population) {
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
        this.dataContainers.fps.innerHTML = `FPS: ${this.fps.lastFPS.toFixed(1)}`;
      } else {
        this.dataContainers.fps.innerHTML = `FPS: calculating...`;
      }
    } else {
      this.dataContainers.fps.innerHTML = `FPS: disabled`;
    }

    this.dataContainers.population.innerHTML = `Population: ${population}`;
  }

  start() {
    this.prepareCanvas();
    this.init();
    this.renderCycle();
  }

  renderCycle() {
    this.update();
    this.render();
    setTimeout(() => {
      this.renderCycle();
    }, 1000 / maxFPS);
  }
}

export default GameLoop;
