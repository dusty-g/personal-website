// generate cellular automata rules based on input number (convert to binary)
export function generateRule(numCols: number, numRows: number, ruleNum: number, firstRowIsRandom: boolean) {

    // create an empty 2D array with "numRows" rows and "numCols" columns, initialized with 0s
    const grid = Array(numRows)
        .fill(0)
        .map(() => Array(numCols).fill(0));
    
    // set the middle of the first row to 1
    // grid[Math.floor(numCols / 2)][0] = 1;
    if (firstRowIsRandom) {
        for (let col = 0; col < numCols; col++) {
            grid[col][0] = Math.random() > 0.5 ? 1 : 0;
        }
    } else {
        grid[Math.floor(numCols / 2)][0] = 1;
    }
    
    // loop through each row, starting at the second row
    for (let row = 1; row < numRows; row++) {
        // loop through each cell in the row
        for (let col = 0; col < numCols; col++) {
            // we want the left cell to wrap around to the right side of the grid
            // get the value of the previous row's adjacent cells
            // const previousLeft = col === 0 ? 0 : grid[col-1][row - 1]
            const previousLeft = col === 0 ? grid[numCols - 1][row - 1] : grid[col-1][row - 1]
            // get the value of the previous row's center cell
            const previousCenter = grid[col][row - 1];
            // get the value of the previous row's right cell
            // const previousRight = col === numCols - 1 ? 0 : grid[col + 1][row - 1];
            const previousRight = col === numCols - 1 ? grid[0][row - 1] : grid[col + 1][row - 1];


            // use switch for the 8 cases
            switch (previousLeft + '' + previousCenter + '' + previousRight) {
                case '111':
                    grid[col][row] = (ruleNum & 128) > 0 ? 1 : 0;
                    break;
                case '110':
                    grid[col][row] = (ruleNum & 64) > 0 ? 1 : 0;
                    break;
                case '101':
                    grid[col][row] = (ruleNum & 32) > 0 ? 1 : 0;
                    break;
                case '100':
                    grid[col][row] = (ruleNum & 16) > 0 ? 1 : 0;
                    break;
                case '011':
                    grid[col][row] = (ruleNum & 8) > 0 ? 1 : 0;
                    break;
                case '010':
                    grid[col][row] = (ruleNum & 4) > 0 ? 1 : 0;
                    break;
                case '001':
                    grid[col][row] = (ruleNum & 2) > 0 ? 1 : 0;
                    break;
                case '000':
                    grid[col][row] = (ruleNum & 1) > 0 ? 1 : 0;
                    break;
        
                default:
                    break;
            }

        }
    }

    // after looping through all cells in the row, return the two-dimensional array
    return grid;
}