'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Check for missing fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Validate puzzle string
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
          return res.json({ error: validation.error });
      }
      
      // Validate coordinate
      if (!/^[A-I][1-9]$/i.test(coordinate)) {
          return res.json({ error: 'Invalid coordinate' });
      }
      
      // Validate value
      if (!/^[1-9]$/.test(value)) {
          return res.json({ error: 'Invalid value' });
      }

      const row = coordinate.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate.slice(1), 10) - 1;

      // If the spot is already filled with the same value, it's valid
      const grid = solver.transformToGrid(puzzle);
      if (grid[row][col] == value) {
          return res.json({ valid: true });
      }
      
      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, col, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      } else {
        return res.json({ valid: true });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      
      // Validate puzzle string
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }

      const solution = solver.solve(puzzle);

      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      
      return res.json({ solution: solution });
    });
};
