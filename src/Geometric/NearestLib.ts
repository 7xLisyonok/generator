export type NearestFunction = (cellIndex1: number, cellIndex2: number) => boolean;
export type NearestListFunction = (cellIndex1: number) => Array<number>;

export const Rect = {
    indexToCoordFunc(width: number) {
        return (index: number) => {
            const x = index % width;
            const y = (index - x) / width;
            return [x, y];
        }
    },

    coordToIndexFunc(width: number, height: number) {
        return (x: number, y: number) => {
            if (x < 0 || x >= width || y < 0 || y >= height) return -1;
            return y * width + x;
        }
    },

    nearestFunction(width: number, height: number): NearestFunction {
        const toCoords = this.indexToCoordFunc(width);
    
        return (cIndex1, cIndex2) => {
            const [x1, y1] = toCoords(cIndex1);
            const [x2, y2] = toCoords(cIndex2);
            const xDiff = Math.abs(x1 - x2);
            const yDiff = Math.abs(y1 - y2);
            return (xDiff + yDiff) <= 1;
        }
    },   

    nearestListFunction(width: number, height: number): NearestListFunction {
        const toCoords = this.indexToCoordFunc(width);
        const toIndex = this.coordToIndexFunc(width, height);
    
        return (cIndex) => {
            const [x, y] = toCoords(cIndex);
            const list = [
                toIndex(x + 1, y),
                toIndex(x - 1, y),
                toIndex(x, y + 1),
                toIndex(x, y - 1),
            ];
            return list.filter(index => index >= 0);
        }
    },
}



