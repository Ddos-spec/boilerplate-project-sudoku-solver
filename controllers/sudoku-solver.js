class SudokuSolver {
  /**
   * Validates if the puzzle string is valid.
   * @param {string} puzzleString - The puzzle string to validate.
   * @returns {{ valid: boolean, error?: string }} - An object indicating validity and error message if any.
   */
  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    }
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  /**
   * Transforms a puzzle string into a 2D grid.
   * @param {string} puzzleString - The 81-character puzzle string.
   * @returns {Array<Array<string|number>>} - A 9x9 grid.
   */
  transformToGrid(puzzleString) {
    const grid = [];
    let i = 0;
    for (let row = 0; row < 9; row++) {
      grid.push(puzzleString.slice(i, i + 9).split(''));
      i += 9;
    }
    return grid;
  }

  /**
   * Checks if a value can be placed in a specific row.
   * @param {string} puzzleString - The puzzle string.
   * @param {number} row - The row index (0-8).
   * @param {number} column - The column index (0-8).
   * @param {number|string} value - The value to check.
   * @returns {boolean} - True if placement is valid, false otherwise.
   */
  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
    // If the value is already at the coordinate, it's technically a valid "placement"
    if (grid[row][column] == value) {
        grid[row][column] = '.'; // Temporarily remove it to check for conflicts elsewhere
    }
    return !grid[row].includes(String(value));
  }

  /**
   * Checks if a value can be placed in a specific column.
   * @param {string} puzzleString - The puzzle string.
   * @param {number} row - The row index (0-8).
   * @param {number} column - The column index (0-8).
   * @param {number|string} value - The value to check.
   * @returns {boolean} - True if placement is valid, false otherwise.
   */
  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
     if (grid[row][column] == value) {
        grid[row][column] = '.'; 
    }
    for (let i = 0; i < 9; i++) {
      if (grid[i][column] == value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if a value can be placed in a specific 3x3 region.
   * @param {string} puzzleString - The puzzle string.
   * @param {number} row - The row index (0-8).
   * @param {number} column - The column index (0-8).
   * @param {number|string} value - The value to check.
   * @returns {boolean} - True if placement is valid, false otherwise.
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
     if (grid[row][column] == value) {
        grid[row][column] = '.';
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[startRow + r][startCol + c] == value) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Solves the Sudoku puzzle using a backtracking algorithm.
   * @param {string} puzzleString - The puzzle string.
   * @returns {string|false} - The solved puzzle string or false if unsolvable.
   */
  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid && validation.error !== 'Required field missing') {
        // We let the solve function handle a valid but unsolvable puzzle
        // but not an invalidly formatted one.
        return false;
    }
    
    const grid = this.transformToGrid(puzzleString);

    const solveGrid = (grid) => {
        const find = findEmpty(grid);
        if (!find) {
            return true; // Puzzle is solved
        }
        
        const [row, col] = find;

        for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, String(num))) {
                grid[row][col] = String(num);

                if (solveGrid(grid)) {
                    return true;
                }

                grid[row][col] = '.'; // Backtrack
            }
        }
        return false;
    };

    const findEmpty = (grid) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === '.') {
                    return [r, c];
                }
            }
        }
        return null;
    };

    const isValidPlacement = (grid, row, col, val) => {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === val) return false;
        }
        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === val) return false;
        }
        // Check 3x3 region
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (grid[startRow + r][startCol + c] === val) return false;
            }
        }
        return true;
    };
    
    // First, check if the initial puzzle is valid
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = grid[r][c];
            if (val !== '.') {
                grid[r][c] = '.'; // Temporarily remove to check
                if (!isValidPlacement(grid, r, c, val)) {
                    grid[r][c] = val; // Put it back
                    return false; // Initial puzzle is invalid
                }
                grid[r][c] = val; // Put it back
            }
        }
    }


    if (solveGrid(grid)) {
      return grid.flat().join('');
    } else {
      return false;
    }
  }
}

module.exports = SudokuSolver;
