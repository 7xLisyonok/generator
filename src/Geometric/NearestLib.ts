type NearestFunction = (cellIndex1: number, cellIndex2: number) => boolean;

type NearestListFunction = (cellIndex1: number) => Array<number>;

export interface Nearest {
    Is: NearestFunction;
    All: NearestListFunction;
    get size(): number;
};

export class Rect implements Nearest {
    constructor(
        private width: number,
        private height: number
    ) {}

    private toCoords(index: number) {
        const x = index % this.width;
        const y = (index - x) / this.width;
        return [x, y];
    }

    private toIndex(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
        return y * this.width + x;
    }

    Is(cIndex1: number, cIndex2: number) {
        const [x1, y1] = this.toCoords(cIndex1);
        const [x2, y2] = this.toCoords(cIndex2);
        const xDiff = Math.abs(x1 - x2);
        const yDiff = Math.abs(y1 - y2);
        return (xDiff + yDiff) <= 1;
    }

    All(cIndex: number) {
        const [x, y] = this.toCoords(cIndex);
        const list = [
            this.toIndex(x + 1, y),
            this.toIndex(x - 1, y),
            this.toIndex(x, y + 1),
            this.toIndex(x, y - 1),
        ];
        return list.filter(index => index >= 0);
    }

    get size() {
        return this.width * this.height;
    }
}



