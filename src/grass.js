class Grass {
    constructor(x, y, alive = true) {
        this.xPos = x;
        this.yPos = y;
        this.isAlive = alive;
    }

    getEaten() {
        this.isAlive = false;
    }

    grow() {
        this.isAlive = true;
    }
}

export default Grass;