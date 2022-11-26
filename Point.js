class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isEqual(point) {
        return this.x === point.x && this.y === point.y;
    }
}
