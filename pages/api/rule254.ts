// define "generateRule254" function that takes two arguments, "numRows" and "numCols". The function should return a two-dimensional array representing the state of the automaton.

export function generateRule254(numCols: number, numRows: number) {
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
            const left = col === 0 ? 0 : grid[col-1][row - 1]
            // get the value of the previous row's center cell
            const center = grid[col][row - 1];
            // get the value of the previous row's right cell
            const right = col === numCols - 1 ? 0 : grid[col + 1][row - 1];

            //
            if (left || right || center) {
                grid[col][row] = 1;
            }

        }
    }

    // after looping through all cells in the row, return the two-dimensional array
    return grid;
}