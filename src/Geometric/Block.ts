import { Cell } from "./Cell";
import { GeometricField } from "./Field";

export class Block {
    cells = new Set<Cell>();

    get cellsArray() {
        return new Array(...this.cells);
    }

    constructor(
        private _field: GeometricField, 
        public index: number = 0
    ) {}

    isNearest(cell: Cell) {
        return this.cellsArray.some(blockCell => this._field.isNearestCells(cell.index, blockCell.index));
    }

    isSame(block: Block) {
        return this.index === block.index;
    }

    addCell(cell: Cell) {
        this.cells.add(cell);
    }

    addBlock(blockPart: Block) {
        blockPart.cells.forEach(cell => this.addCell(cell));
    }    

    getConnectedParts() {
        const parts = new Set<Block>();

        this.cells.forEach(cell => {
            // Проверяем, законечена ли ячейка уже с кем-то
            let mainPart: Block | undefined;
            parts.forEach(part => {
                if (part.isNearest(cell)) {
                    if (mainPart) {
                        mainPart.addBlock(part);
                        parts.delete(part);
                    } else {
                        part.addCell(cell);
                        mainPart = part;
                    }
                }
            });

            // Если незаконекчена, создаём новую "часть"
            if (!mainPart) {
                const newPart = new Block(this._field);
                newPart.addCell(cell);
                parts.add(newPart);
            }
        });

        return parts;
    }

    checkConnected() {
        const cParts = this.getConnectedParts();
        return cParts.size === 1;
    }
};