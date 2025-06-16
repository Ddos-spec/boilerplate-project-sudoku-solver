const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        // 1. Solve a puzzle with valid puzzle string
        test('Solve a puzzle with valid puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: puzzlesAndSolutions[0][0] })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
                    done();
                });
        });

        // 2. Solve a puzzle with missing puzzle string
        test('Solve a puzzle with missing puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field missing' });
                    done();
                });
        });

        // 3. Solve a puzzle with invalid characters
        test('Solve a puzzle with invalid characters', (done) => {
            const invalidPuzzle = '1.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....';
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidPuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                });
        });

        // 4. Solve a puzzle with incorrect length
        test('Solve a puzzle with incorrect length', (done) => {
            const shortPuzzle = '1.5..2.84..63.12.7.2..5...';
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: shortPuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                });
        });

        // 5. Solve a puzzle that cannot be solved
        test('Solve a puzzle that cannot be solved', (done) => {
            const unsolvablePuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....';
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: unsolvablePuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
                    done();
                });
        });
    });

    suite('POST /api/check', () => {
        // 6. Check a puzzle placement with all fields
        test('Check a puzzle placement with all fields', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ puzzle, coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { valid: true });
                    done();
                });
        });

        // 7. Check a puzzle placement with single placement conflict
        test('Check a puzzle placement with single placement conflict', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ puzzle, coordinate: 'A2', value: '4' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { valid: false, conflict: ['row'] });
                    done();
                });
        });

        // 8. Check a puzzle placement with multiple placement conflicts
        test('Check a puzzle placement with multiple placement conflicts', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ puzzle, coordinate: 'A2', value: '1' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column'] });
                    done();
                });
        });

        // 9. Check a puzzle placement with all placement conflicts
        test('Check a puzzle placement with all placement conflicts', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ puzzle, coordinate: 'A2', value: '5' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { valid: false, conflict: ['row', 'region'] });
                    done();
                });
        });

        // 10. Check a puzzle placement with missing required fields
        test('Check a puzzle placement with missing required fields', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], value: '1' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                    done();
                });
        });
        
        // 11. Check a puzzle placement with invalid characters
        test('Check a puzzle placement with invalid characters', (done) => {
             const invalidPuzzle = '1.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....';
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: invalidPuzzle, coordinate: 'A1', value: '2' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                });
        });
        
        // 12. Check a puzzle placement with incorrect length
        test('Check a puzzle placement with incorrect length', (done) => {
             const shortPuzzle = '1.5..2.84..63.';
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: shortPuzzle, coordinate: 'A1', value: '2' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                });
        });
        
        // 13. Check a puzzle placement with invalid placement coordinate
        test('Check a puzzle placement with invalid placement coordinate', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'Z1', value: '1' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid coordinate' });
                    done();
                });
        });
        
        // 14. Check a puzzle placement with invalid placement value
        test('Check a puzzle placement with invalid placement value', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A1', value: '10' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid value' });
                    done();
                });
        });
    });
});
