const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new SudokuSolver();

suite('UnitTests', () => {
  suite('Solver logic tests', () => {
    // 1. Logic handles a valid puzzle string of 81 characters
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const validation = solver.validate(puzzleString);
      assert.isTrue(validation.valid);
      done();
    });

    // 2. Logic handles a puzzle string with invalid characters (not 1-9 or .)
    test('Logic handles a puzzle string with invalid characters', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....-';
      const validation = solver.validate(puzzleString);
      assert.isFalse(validation.valid);
      assert.equal(validation.error, 'Invalid characters in puzzle');
      done();
    });

    // 3. Logic handles a puzzle string that is not 81 characters in length
    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16...';
      const validation = solver.validate(puzzleString);
      assert.isFalse(validation.valid);
      assert.equal(validation.error, 'Expected puzzle to be 81 characters long');
      done();
    });

    // 4. Logic handles a valid row placement
    test('Logic handles a valid row placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const row = 0;
      const col = 1;
      const value = 3;
      assert.isTrue(solver.checkRowPlacement(puzzleString, row, col, value));
      done();
    });

    // 5. Logic handles an invalid row placement
    test('Logic handles an invalid row placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const row = 0;
      const col = 2;
      const value = 1;
      assert.isFalse(solver.checkRowPlacement(puzzleString, row, col, value));
      done();
    });

    // 6. Logic handles a valid column placement
    test('Logic handles a valid column placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const row = 0;
      const col = 1;
      const value = 9;
      assert.isTrue(solver.checkColPlacement(puzzleString, row, col, value));
      done();
    });

    // 7. Logic handles an invalid column placement
    test('Logic handles an invalid column placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const row = 0;
      const col = 0;
      const value = 8;
      assert.isFalse(solver.checkColPlacement(puzzleString, row, col, value));
      done();
    });

    // 8. Logic handles a valid region (3x3 grid) placement
    test('Logic handles a valid region (3x3 grid) placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const row = 0;
      const col = 1;
      const value = 2;
      assert.isTrue(solver.checkRegionPlacement(puzzleString, row, col, value));
      done();
    });

    // 9. Logic handles an invalid region (3x3 grid) placement
    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const row = 0;
      const col = 1;
      const value = 5;
      assert.isFalse(solver.checkRegionPlacement(puzzleString, row, col, value));
      done();
    });

    // 10. Valid puzzle strings pass the solver
    test('Valid puzzle strings pass the solver', (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      const solution = solver.solve(puzzleString);
      assert.isString(solution);
      assert.equal(solution, puzzlesAndSolutions[0][1]);
      done();
    });

    // 11. Invalid puzzle strings fail the solver
    test('Invalid puzzle strings fail the solver', (done) => {
      const puzzleString = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....';
      const solution = solver.solve(puzzleString);
      assert.isFalse(solution);
      done();
    });

    // 12. Solver returns the expected solution for an incomplete puzzle
    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
      const puzzleString = puzzlesAndSolutions[1][0];
      const solution = solver.solve(puzzleString);
      assert.equal(solution, puzzlesAndSolutions[1][1]);
      done();
    });
  });
});
