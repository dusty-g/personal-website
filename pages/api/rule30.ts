// define "generateRule30" function that takes two arguments, "numRows" and "numCols". The function should return a two-dimensional array representing the state of the automaton.
export function generateRule30(numCols: number, numRows: number) {
    // create an empty 2D array with "numRows" rows and "numCols" columns, initialized with 0s
    const grid = Array(numRows)
        .fill(0)
        .map(() => Array(numCols).fill(0));
    
    //set the middle of the first row to 1
    grid[Math.floor(numCols / 2)][0] = 1;
    // // set the first row randomly to 0 or 1
    // for (let col = 0; col < numCols; col++) {
    //     grid[col][0] = Math.round(Math.random());
    // }
    
    // loop through each row, starting at the second row
    for (let row = 1; row < numRows; row++) {
        // loop through each cell in the row
        for (let col = 0; col < numCols; col++) {
            // get the value of the previous row's adjacent cells
            // we want the left cell to wrap around to the right side of the grid
            const previousLeft = col === 0 ? grid[numCols - 1][row - 1] : grid[col-1][row - 1]
            // const left = col === 0 ? 0 : grid[col-1][row - 1]
            // get the value of the previous row's center cell
            const previousCenter = grid[col][row - 1];
            // get the value of the previous row's right cell
            const previousRight = col === numCols - 1 ? 0 : grid[col + 1][row - 1];

            // If the previous row's right and center are both 0, then the current cell should be equal to the previous row's left cell. Otherwise, it should be the opposite of the previous row's left cell.
            if (previousRight === 0 && previousCenter === 0) {
                grid[col][row] = previousLeft;
            } else {
                grid[col][row] = previousLeft === 0 ? 1 : 0;
            }


        }
    }

    // after looping through all cells in the row, return the two-dimensional array
    return grid;
}