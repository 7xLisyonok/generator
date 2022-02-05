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
    nearest: new Rect(15, 15),
    
    blocks: `
        1 1 1 2 2 2 1 1 1 . . . . . .   
        2 2 2 1 1 1 2 2 2 . . . . . .   
        1 1 1 2 2 2 1 1 1 . . . . . .   
        2 2 2 1 1 1 2 2 2 . . . . . .   
        1 1 1 2 2 2 1 1 1 . . . . . .   
        2 2 2 1 1 1 2 2 2 . . . . . .   
        1 1 1 2 2 2 . . . 2 2 2 1 1 1   
        2 2 2 1 1 1 . . . 1 1 1 2 2 2   
        1 1 1 2 2 2 . . . 2 2 2 1 1 1   
        . . . . . . 2 2 2 1 1 1 2 2 2   
        . . . . . . 1 1 1 2 2 2 1 1 1   
        . . . . . . 2 2 2 1 1 1 2 2 2   
        . . . . . . 1 1 1 2 2 2 1 1 1   
        . . . . . . 2 2 2 1 1 1 2 2 2   
        . . . . . . 1 1 1 2 2 2 1 1 1   
    `,
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

field.mix({ 
    progressCallback: (iteration) => {
        //if (iteration % 10 !== 0) return;
        console.clear();
        console.log('---------------------------------');
        console.log(field.renderBlocks());
    }
});





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