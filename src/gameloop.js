class GameLoop {
  constructor() {
    this.fps = 30;
    this.cnv = null;
    this.ctx = null;
    this.loop = null;
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

  start() {
    this.prepareCanvas();
    this.init();

    this.loop = setInterval(() => {
      this.update();
      this.render();
    }, 1000 / this.fps);
  }
}

export default GameLoop;
