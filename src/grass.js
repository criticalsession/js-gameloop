class Grass {
    constructor(x, y) {
        this.xPos = x;
        this.yPos = y;
        this.isAlive = true;
    }

    getEaten() {
        this.isAlive = false;
    }

    grow() {
        this.isAlive = true;
    }
}

export default Grass;