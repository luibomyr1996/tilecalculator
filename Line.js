class Line {
    constructor(startPoint, endPoint) {
        this.startPoint = new Point(startPoint.x, startPoint.y);
        this.endPoint = new Point(endPoint.x, endPoint.y);
        this.length = this.getLineLength();
        this.middlePoint = this.getMiddlePoint();
    }

    getLineLength() {
        var lineLength = Math.sqrt(Math.pow(this.endPoint.x - this.startPoint.x, 2)
            + Math.pow(this.endPoint.y - this.startPoint.y, 2));
        return Math.trunc(lineLength);
    }

    getMiddlePoint() {
        var middleX = Math.trunc((this.startPoint.x + this.endPoint.x) / 2);
        var middleY = Math.trunc((this.startPoint.y + this.endPoint.y) / 2);

        return new Point(middleX, middleY);
    }

    getLinePoints() {
        return [this.startPoint, this.endPoint];
    }

    isPointsMeet(line) {
        return this.startPoint.isEqual(line.startPoint)
            || this.startPoint.isEqual(line.endPoint)
            || this.endPoint.isEqual(line.startPoint)
            || this.endPoint.isEqual(line.endPoint);
    }

    isEqual(line) {
        return (this.startPoint.isEqual(line.startPoint)
            && this.endPoint.isEqual(line.endPoint))
            ||
            (this.startPoint.isEqual(line.endPoint)
                && this.endPoint.isEqual(line.startPoint));
    }
}