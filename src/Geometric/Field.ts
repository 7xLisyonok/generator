import { Nearest } from "./NearestLib.js";
import { readArrayNumber, TextTemplate } from "lisy-sudoku-solver";



class Cell {
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



class Block {
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



type GeometricFieldParams = {
    blocks: string | Array<number>;
    nearest: Nearest;
};



export class GeometricField {
    blocks = new Array<Block>();
    cells = new Array<Cell>();
    private _nearest: Nearest;
    private _textTemplate: TextTemplate | undefined;
    private _params: GeometricFieldParams;

    constructor(params: GeometricFieldParams) {
        this._params = params;
        const { blocks, nearest } = params;
        this._nearest = nearest;
        const blocksArr = readArrayNumber(blocks);
        this.createBlocks(blocksArr);
        //this.fillNearest();
    }

    isNearestCells(cellIndex1: number, cellIndex2: number) {
        return this._nearest.Is(cellIndex1, cellIndex2);
    }

    allNearestIndexes(cellIndex: number) {
        return this._nearest.All(cellIndex);
    }

    allNearestCells(cellIndex: number) {
        return this.allNearestIndexes(cellIndex).map(cellIndex => this.cells[cellIndex]);
    }

    private createBlocks(blocksDescription: Array<number>) {
        const blocksInit: Array<Block> = [];
        blocksDescription.forEach((blockIndex, cellIndex) => {
            if (!(blockIndex in blocksInit)) blocksInit[blockIndex] = new Block(this, blockIndex);
            const block = blocksInit[blockIndex];
            const currCell = new Cell(this, cellIndex, block);
            block.addCell(currCell);
            this.cells.push(currCell);
        });

        let blockIndex = 0;
        const blocksResult: Array<Block> = [];
        blocksInit.forEach(blockInit => {
            const blockParts = blockInit.getConnectedParts();
            blockParts.forEach(block => {
                block.index = ++blockIndex;
                block.cells.forEach(cell => cell.block = block);
                blocksResult.push(block);                    
            });
        });

        this.blocks = blocksResult.filter(block => !!block);
    }

    checkBlocksConnected() {
        return this.blocks.every(block => block.checkConnected());
    }

    renderBlocks() {
        if (!this._textTemplate) {
            const tempate = (typeof this._params.blocks === 'string') ? this._params.blocks : this.getBlockDescription();
            this._textTemplate = new TextTemplate(tempate);
        }

        const values = this.cells.map(cell => cell.block.index);
        return this._textTemplate.render(values);
    }

    private getBlockDescription() {
        const values = this.cells.map(cell => cell.block.index);
        return values.join('');
    }    

    swapCells(cellIndex1: number, cellIndex2: number) {
        const cell1 = this.cells[cellIndex1];
        const cell2 = this.cells[cellIndex2];

        const block1 = cell1.block;
        const block2 = cell2.block;

        block1.cells.delete(cell1);
        block2.cells.delete(cell2);

        block1.addCell(cell2);
        block2.addCell(cell1);

        cell1.block = block2;
        cell2.block = block1;
    }

    checkSwap(cellIndex1: number, cellIndex2: number) {
        this.swapCells(cellIndex1, cellIndex2);
        const blockCheck1 = this.cells[cellIndex1].block;
        const blockCheck2 = this.cells[cellIndex2].block;
        const result = blockCheck1.checkConnected() && blockCheck2.checkConnected();
        this.swapCells(cellIndex1, cellIndex2);
        return result;
    }

    public nearestInfo() {
        return this.cells
            .map(cell => {
                const nearestList = this.allNearestIndexes(cell.index)
                    .join(' ');

                return `${cell.index} => ${nearestList}`
            })
            .join('\n');
    }
}