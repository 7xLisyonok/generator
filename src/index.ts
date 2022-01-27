import { Puzzle } from "lisy-sudoku-solver";

const IS_CELL_REG = /[0-9A-Za-z\.]/;
const IS_CELL_EMPTY = /[\.]/;

function readArrayNumber(originalString: string | Array<number>): Array<number> {
    if (typeof originalString !== 'string') return originalString;

    return originalString
        .split('')
        .filter(e => IS_CELL_REG.test(e))
        .map(e => IS_CELL_EMPTY.test(e) ? '0' : e)
        .map(e => Number.parseInt(e, 36))
    ;        
}

class Cell {
    nearest: Array<Cell> = [];
    constructor(public index: number) { }
}

class Block {
    cells: Array<Cell> = [];
}

type NearestFunction = (cell1: Cell, cell2: Cell) => boolean;

function createBlocks(blocksDescription: Array<number>) {
    const blocks: Array<Block> = [];
    const allCells: Array<Cell> = [];

    blocksDescription.forEach((blockIndex, cellIndex) => {
        if (!(blockIndex in blocks)) blocks[blockIndex] = new Block();
        const block = blocks[blockIndex];
        const currCell = new Cell(cellIndex);
        allCells.push(currCell);
        block.cells.push(new Cell(cellIndex));
    });

    return {
        blocks,
        cells: allCells,
    }
}


const blocksDesc = `
    1 1 1 1 1 1 1 1 1
    2 2 2 2 2 2 2 2 2
    3 3 3 3 3 3 3 3 3
    4 4 4 4 4 4 4 4 4
    5 5 5 5 5 5 5 5 5
    6 6 6 6 6 6 6 6 6
    7 7 7 7 7 7 7 7 7
    8 8 8 8 8 8 8 8 8
    9 9 9 9 9 9 9 9 9
`;

function RectNearest(width: number): NearestFunction {
    const ReadCoords = (index: number) => {
        const x = index % width;
        const y = (index - x) / width;
        return [x, y];
    }

    return (cell1, cell2) => {
        const [x1, y1] = ReadCoords(cell1.index);
        const [x2, y2] = ReadCoords(cell2.index);
        const xDiff = Math.abs(x1 - x2);
        const yDiff = Math.abs(y1 - y2);
        return (xDiff + yDiff) <= 1;
    }
}

function FillNearest(cells: Array<Cell>, nearest: NearestFunction) {
    cells.forEach((cellFill, cellFillIndex) => {
        cells.forEach((cellTest, cellTestIndex) => {
            if (cellFillIndex === cellTestIndex) return;
            if (nearest(cellFill, cellTest)) {
                cellFill.nearest.push(cellTest);
            }
        });
    });
}


const blocksArr = readArrayNumber(blocksDesc);
const { blocks, cells } = createBlocks(blocksArr);

const isCellNearest = RectNearest(9);
FillNearest(cells, isCellNearest);

//console.log(blocks);
console.log(cells.map(cell => `${cell.index} => ${cell.nearest.map(nearest => nearest.index )}`));