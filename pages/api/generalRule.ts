// generate cellular automata rules based on input number (converted to binary)
export function generateRule(numCols: number, numRows: number, ruleNum: number) {
    // create an empty 2D array with "numRows" rows and "numCols" columns, initialized with 0s
    const grid = Array(numRows)
        .fill(0)
        .map(() => Array(numCols).fill(0));
    
    // set the middle of the first row to 1
    grid[Math.floor(numCols / 2)][0] = 1;
    
    // loop through each row, starting at the second row
    for (let row = 1; row < numRows; row++) {
        // loop through each cell in the row
        for (let col = 0; col < numCols; col++) {
            // get the value of the previous row's adjacent cells
            const previousLeft = col === 0 ? 0 : grid[col-1][row - 1]
            // get the value of the previous row's center cell
            const previousCenter = grid[col][row - 1];
            // get the value of the previous row's right cell
            const previousRight = col === numCols - 1 ? 0 : grid[col + 1][row - 1];

            //subrules
            //1 0 0 0 0 0 0 0 all black, returns 0 or 1 depending on the eighth digit of 'number' converted to binary
            if (previousLeft && previousCenter && previousRight) {
                // use bitwise AND to get the 8th digit of the binary number. 10000000 = 128
                grid[col][row] = (ruleNum & 128) > 0 ? 1 : 0;
            }
            



        }
    }

    // after looping through all cells in the row, return the two-dimensional array
    return grid;
}