import { Nearest } from "./NearestLib.js";
import { readArrayNumber, TextTemplate } from "lisy-sudoku-solver";
import Random from "../Random.js";
import { Block } from "./Block.js";
import { Cell } from "./Cell.js";


type GeometricFieldParams = {
    blocks: string | Array<number>;
    nearest: Nearest;
};


type MixParams = {
    iterationCount?: number,
    progressCallback: (iterationIndex?: number, iterationCount?: number) => void
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
            if (blockInit.index === 0) return;
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
        return this._textTemplate.renderNumbersColored(values);
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

    public get activeCellsCount() {
        return this.cells.reduce((sum, cell) => sum + +(cell.block.index > 0), 0);
    }


    getGoodPairs() {
        const cells = this.cells;
        const goodPairs: Array<Array<number>> = [];

        for(var fromIndex = 0; fromIndex < cells.length; fromIndex++) {
            for(var toIndex = fromIndex + 1; toIndex < cells.length; toIndex++) {
                const cellFrom = cells[fromIndex];
                if (cellFrom.block.index === 0) continue;

                const cellTo = cells[toIndex];
                if (cellTo.block.index === 0) continue;
    
                if (cellFrom.block.isSame(cellTo.block)) continue;
                if (!cellFrom.block.isNearest(cellTo)) continue;
                if (!cellTo.block.isNearest(cellFrom)) continue;
    
                if (this.checkSwap(fromIndex, toIndex)) {
                    goodPairs.push([fromIndex, toIndex]);
                }
            }
        }

        return goodPairs;
    }

    mix({ iterationCount = this.activeCellsCount * 2, progressCallback }: MixParams) {
        for(var i = 0; i < iterationCount; i++) {
            const goodParts = this.getGoodPairs();
        
            if (goodParts.length === 0) throw new Error("No swappable pairs");
        
            const rndPartIndex = Random.int(0, goodParts.length - 1);
            const rndPart = goodParts[rndPartIndex];
            this.swapCells(rndPart[0], rndPart[1]);
            
            progressCallback.call(this, i, iterationCount);
        }        
    }
}
