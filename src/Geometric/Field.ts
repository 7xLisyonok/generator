import { NearestFunction, NearestListFunction } from "./NearestLib.js";
import { readArrayNumber, TextTemplate } from "lisy-sudoku-solver";



class Cell {
    nearests: Array<Cell> = [];

    constructor(
        public index: number, 
        public block: Block
    ) { }

    isNearest(cell: Cell): boolean {
        return this.nearests.some(nearest => cell.isSame(nearest));
    }

    isSame(cell: Cell) {
        return this.index === cell.index;
    }

    clearNearest() {
        this.nearests = [];
    }
}



class Block {
    cells = new Set<Cell>();

    get cellsArray() {
        return new Array(...this.cells);
    }

    constructor(public index: number = 0) {}
    
    isNearest(cell: Cell) {
        return this.cellsArray.some(blockCell => blockCell.isNearest(cell));
    }

    getAllNearest() {
        const allNearest = new Set<Cell>();
        this.cells.forEach(cell => {
            cell.nearests.forEach(nearest => {
                if (this.isSame(nearest.block)) return;
                allNearest.add(nearest);
            });
        });
        return allNearest;
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
                const newPart = new Block();
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
    nearest: NearestFunction;
    nearestList: NearestListFunction;
};



export class GeometricField {
    blocks = new Array<Block>();
    cells = new Array<Cell>();
    private _nearest: NearestFunction;
    private _nearestList: NearestListFunction;
    private _textTemplate: TextTemplate | undefined;
    private _params: GeometricFieldParams;

    constructor(params: GeometricFieldParams) {
        this._params = params;
        const { blocks, nearest, nearestList } = params;
        this._nearest = nearest;
        this._nearestList = nearestList;
        const blocksArr = readArrayNumber(blocks);
        this.createBlocks(blocksArr);
        this.fillNearest();
    }

    private createBlocks(blocksDescription: Array<number>) {
        const blocks: Array<Block> = [];

        blocksDescription.forEach((blockIndex, cellIndex) => {
            if (!(blockIndex in blocks)) blocks[blockIndex] = new Block(blockIndex);
            const block = blocks[blockIndex];
            const currCell = new Cell(cellIndex, block);
            block.addCell(currCell);
            this.cells.push(currCell);
        });

        this.blocks = blocks.filter(block => !!block);
    }

    private fillNearest() {
        //this.cells.forEach(cell => cell.clearNearest());

        this.cells.forEach((cell, cellIndex) => {
            const nearestIndexes = this._nearestList(cellIndex);
            nearestIndexes.forEach(nearestCellIndex => {
                const nearestCell = this.cells[nearestCellIndex];
                if (nearestCell) cell.nearests.push(nearestCell);
            });
        });
/*
        this.cells.forEach((cellFill, cellFillIndex) => {
            this.cells.forEach((cellTest, cellTestIndex) => {
                if (cellFillIndex === cellTestIndex) return;
                if (this._nearest(cellFill.index, cellTest.index)) {
                    cellFill.nearests.push(cellTest);
                }
            });
        });
*/
    }

    public nearestInfo() {
        return this.cells
            .map(cell => {
                const nearestList = cell.nearests
                    .map(nearest => nearest.index)
                    .join(' ');

                return `${cell.index} => ${nearestList}`
            })
            .join('\n');
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

    private simpleCloneWithSwap(cellIndex1: number, cellIndex2: number) {
        const values = this.cells.map(cell => cell.block.index);
        const cellValue1 = values[cellIndex1];
        values[cellIndex1] = values[cellIndex2];
        values[cellIndex2] = cellValue1;

        const newField = new GeometricField({
            blocks: values,
            nearest: this._nearest,
            nearestList: this._nearestList,
        });

        return newField;
    }

    private simpleClone() {
        const newField = new GeometricField({
            blocks: this.getBlockDescription(),
            nearest: this._nearest,
            nearestList: this._nearestList,
        });

        return newField;
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
        //const sClone = this.simpleClone();
        //sClone.swapCells(cellIndex1, cellIndex2);
        //const result = sClone.checkBlocksConnected();
        this.swapCells(cellIndex1, cellIndex2);
        const blockCheck1 = this.cells[cellIndex1].block;
        const blockCheck2 = this.cells[cellIndex2].block;
        const result = blockCheck1.checkConnected() && blockCheck2.checkConnected();
        this.swapCells(cellIndex1, cellIndex2);
        return result;
        /*
        const sClone = this.simpleCloneWithSwap(cellIndex1, cellIndex2);

        const blockCheck1 = sClone.cells[cellIndex1].block;
        const blockCheck2 = sClone.cells[cellIndex2].block;
        const result = blockCheck1.checkConnected() && blockCheck2.checkConnected();

        return result;
        */
    }
}