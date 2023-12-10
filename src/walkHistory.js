class WalkHistory {
  constructor() {
    this.histories = [];
    this.historyColor = [
      "#CDF0AF",
      "#DBE9B6",
      "#E6E4BB",
      "#F2DFC1",
      "#F1D4BF",
      "#F0C4BB",
      "#F0B9B9",
    ];
    this.maxDepth = 7;
    this.decay = 60;
  }

  logPosition(pos) {
    if (pos === null || pos === undefined) return;

    let existingHistory = this.histories.find(
      (h) => h.xPos === pos.xPos && h.yPos === pos.yPos
    );

    if (existingHistory !== null && existingHistory !== undefined) {
      if (existingHistory.depth < this.maxDepth) {
        existingHistory.depth++;
      }

      existingHistory.decay = 0;
      existingHistory.size = pos.size;
    } else {
      this.histories.push({
        xPos: pos.xPos,
        yPos: pos.yPos,
        size: pos.size,
        depth: 1,
        decay: 0,
      });
    }
  }

  decayHistory() {
    this.histories.forEach((h) => {
      if (h.depth >= 1) {
        h.decay++;
        if (h.decay >= this.decay) {
          h.depth--;
          h.decay = 0;
        }
      }
    });
  }

  drawHistory(ctx) {
    this.histories
      .filter((h) => h.depth > 0)
      .forEach((h) => {
        ctx.fillStyle = this.historyColor[h.depth - 1];
        ctx.fillRect(h.xPos, h.yPos, h.size, h.size);
      });
  }
}

export default WalkHistory;
