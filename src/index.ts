import { Rect } from "./Geometric/NearestLib.js";
//import { Puzzle } from "lisy-sudoku-solver";
import { GeometricField } from "./Geometric/Field.js";
/*
const field = new GeometricField({
    blocks: `
        1 1 1 2 2 2 3 3 3 . . . . . .
        1 1 1 2 2 2 3 3 3 . . . . . .
        1 1 1 2 2 2 3 3 3 . . . . . .
        4 4 4 5 5 5 6 6 6 . . . . . .
        4 4 4 5 5 5 6 6 6 . . . . . .
        4 4 4 5 5 5 6 6 6 . . . . . .
        7 7 7 8 8 8 . . . A A A B B B 
        7 7 7 8 8 8 . . . A A A B B B
        7 7 7 8 8 8 . . . A A A B B B
        . . . . . . C C C D D D E E E
        . . . . . . C C C D D D E E E
        . . . . . . C C C D D D E E E
        . . . . . . F F F G G G H H H                    
        . . . . . . F F F G G G H H H
        . . . . . . F F F G G G H H H                    
    `,

    nearest: Rect.nearestFunction(15, 15),
    nearestList: Rect.nearestListFunction(15, 15),
});
*/


const field = new GeometricField({
    blocks: `
        1 1 1 2 2 2 3 3 3
        1 1 1 2 2 2 3 3 3
        4 4 4 5 5 5 6 6 6
        4 4 4 5 5 5 6 6 6
        7 7 7 8 8 8 9 9 9
        7 7 7 8 8 8 9 9 9
        A A A B B B C C C
        A A A B B B C C C
        D D D E E E F F F
    `,

    nearest: Rect.nearestFunction(9, 9),
    nearestList: Rect.nearestListFunction(9, 9),
});
/*
        1 1 1 1 1 1 1 1 1
        2 2 2 2 2 2 2 2 2
        3 3 3 3 3 3 3 3 3
        4 4 4 4 4 4 4 4 4
        5 5 5 5 5 5 5 5 5
        6 6 6 6 6 6 6 6 6
        7 7 7 7 7 7 7 7 7
        8 8 8 8 8 8 8 8 8
        9 9 9 9 9 9 9 9 9

*/
//console.log(field);
//console.log(field.nearestInfo());

const { cells, blocks } = field;
/*
console.time('test1');
const goodPairs1: Array<Array<number>> = [];
blocks.forEach(block => {
    const blockCells = block.cells;
    const blockNearest = block.getAllNearest();
    
    blockCells.forEach(cellFrom => {
        blockNearest.forEach(cellTo => {
            if (cellFrom.index > cellTo.index) return;
            //if (!cellFrom.block.isNearest(cellTo)) return;
            //if (!cellTo.block.isNearest(cellFrom)) return;
    
            if (field.checkSwap(cellFrom.index, cellTo.index)) {
                goodPairs1.push([cellFrom.index, cellTo.index]);
            }
        })
    })
});
console.timeEnd('test1');
console.log(goodPairs1);
*/

console.time('test2');
function getGoodParts2() {
    const goodPairs: Array<Array<number>> = [];
    for(var fromIndex = 0; fromIndex < cells.length; fromIndex++) {
        for(var toIndex = fromIndex + 1; toIndex < cells.length; toIndex++) {
            const cellFrom = cells[fromIndex];
            if (cellFrom.block.index === 0) continue;
            const cellTo = cells[toIndex];
            if (cellTo.block.index === 0) continue;

            if (cellFrom.block.isSame(cellTo.block)) continue;
            if (!cellFrom.block.isNearest(cellTo)) continue;
            //if (!cellTo.block.isNearest(cellFrom)) continue;

            if (field.checkSwap(fromIndex, toIndex)) {
                goodPairs.push([fromIndex, toIndex]);
            }
        }
    }
    return goodPairs;
}
//console.timeEnd('test2');
//console.log(goodParts);

function getRandomInt(from: number, to: number) {
    const len = to - from + 1;
    return Math.floor(Math.random() * len) + from;
}

const colorsReplace: { [id: string] : string; } = {
    '1': '\x1b[31m1\x1b[0m',
    '2': '\x1b[32m2\x1b[0m',
    '3': '\x1b[33m3\x1b[0m',
    '4': '\x1b[34m4\x1b[0m',
    '5': '\x1b[35m5\x1b[0m',
    '6': '\x1b[36m6\x1b[0m',
    '7': '\x1b[43m\x1b[30m7\x1b[0m',
    '8': '\x1b[47m\x1b[30m8\x1b[0m',
    '9': '\x1b[46m\x1b[30m9\x1b[0m',
    'A': '\x1b[31mA\x1b[0m',
    'B': '\x1b[32mB\x1b[0m',
    'C': '\x1b[33mC\x1b[0m',
    'D': '\x1b[34mD\x1b[0m',
    'E': '\x1b[35mE\x1b[0m',
    'F': '\x1b[36mF\x1b[0m',
    'G': '\x1b[43m\x1b[30mG\x1b[0m',
    'H': '\x1b[47m\x1b[30mH\x1b[0m',
    'I': '\x1b[46m\x1b[30mI\x1b[0m',  
};

let iterationCount = 600;
for(var i = 0; i < iterationCount; i++) {
    //console.time('goodPartsGeneration');
    const goodParts = getGoodParts2();
    //console.timeEnd('goodPartsGeneration');

    const rndPartIndex = getRandomInt(0, goodParts.length - 1);
    const rndPart = goodParts[rndPartIndex];
    field.swapCells(rndPart[0], rndPart[1]);
    
    if (i % 100 !== 0) continue;
    console.clear();
    console.log('---------------------------------');
    let renderedBlocks = field.renderBlocks()
        .split('')
        .map(char => {
            if (char in colorsReplace) return colorsReplace[char];
            return char;
        })
        .join('')
    ;    
    console.log(renderedBlocks);
}




/*
111111122
112222222
333333333
444444444
555555555
666666666
777777777
888888888
999999999
*/


/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/    