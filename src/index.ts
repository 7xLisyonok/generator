import { Rect } from "./Geometric/NearestLib.js";
//import { Puzzle } from "lisy-sudoku-solver";
import { GeometricField } from "./Geometric/Field.js";
import Random from "./Random.js";
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
    nearest: new Rect(15, 15),
    
    blocks: `
        111222111......
        111222111......
        111222111......
        222111222......
        222111222......
        222111222......
        111222...222111
        111222...222111
        111222...222111
        ......222111222
        ......222111222
        ......222111222
        ......111222111
        ......111222111
        ......111222111  
    `,
});
/*
        111111111
        222222222
        333333333
        444444444
        555555555
        666666666
        777777777
        888888888
        999999999

        1111222211112222
        1111222211112222
        1111222211112222
        1111222211112222
        2222111122221111
        2222111122221111
        2222111122221111
        2222111122221111
        1111222211112222
        1111222211112222
        1111222211112222
        1111222211112222
        2222111122221111
        2222111122221111
        2222111122221111
        2222111122221111
                
        111222111......
        111222111......
        111222111......
        222111222......
        222111222......
        222111222......
        111222...222111
        111222...222111
        111222...222111
        ......222111222
        ......222111222
        ......222111222
        ......111222111
        ......111222111
        ......111222111        

*/
//console.log(field);
//console.log(field.nearestInfo());

const { cells, blocks } = field;

//if (iteration % 10 !== 0) return;

const drawBlocks = () => {
    process.stdout.cursorTo(0, 0);
    console.log('---------------------------------');
    console.log(field.renderBlocks());
    console.log('---------------------------------');
};


console.clear();
console.time('test1');

field.mixFast({ 
    iterationCount: 1000,
    progressCallback: (iteration, count) => {
        if (iteration % 50 !== 0) return;
        const percent = Math.floor(iteration / (count-1) * 100);

        drawBlocks();
        console.log(percent + '%');
    }
});

drawBlocks();
console.timeEnd('test1');
