import { Block } from "./Block";
import { GeometricField } from "./Field";

export class Cell {
    constructor(
        private _field: GeometricField, 
        public index: number, 
        public block: Block
    ) { }

    isNearest(cell: Cell): boolean {
        return this._field
            .allNearestIndexes(cell.index)
            .some(nearestIndex => cell.index === nearestIndex);
    }
}