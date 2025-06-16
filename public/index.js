document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const puzzleStringTextarea = document.getElementById('puzzle-string');
    const solveButton = document.getElementById('solve-button');
    const clearButton = document.getElementById('clear-button');
    const messageArea = document.getElementById('message-area');
    const puzzleSelect = document.getElementById('puzzle-select');

    const samplePuzzles = [
        ['Sample 1 (Easy)', '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....'],
        ['Sample 2 (Medium)', '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'],
        ['Sample 3 (Hard)', '8..........36......7..9.2...5...7.......457.....1...3...1.4...9.6..8..'],
        ['Invalid Puzzle (Length)', '8..'],
        ['Invalid Puzzle (Chars)', '8..a.........36......7..9.2...5...7.......457.....1...3...1.4...9.6..8..'],
        ['Unsolvable Puzzle', '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....']
    ];

    // Populate puzzle select dropdown
    samplePuzzles.forEach((puzzle, index) => {
        const option = document.createElement('option');
        option.value = puzzle[1];
        option.textContent = puzzle[0];
        puzzleSelect.appendChild(option);
    });
    
    // Create the grid
    const rows = 'ABCDEFGHI';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.id = `${rows[r]}${c + 1}`;
            cell.classList.add('sudoku-input', 'border', 'border-gray-300');
            if ((c + 1) % 3 === 0 && c < 8) cell.classList.add('grid-border-right');
            if ((r + 1) % 3 === 0 && r < 8) cell.classList.add('grid-border-bottom');
            cell.addEventListener('input', () => updateTextareaFromGrid());
            grid.appendChild(cell);
        }
    }

    // Load selected puzzle into board
    puzzleSelect.addEventListener('change', (e) => {
        loadPuzzleToBoard(e.target.value);
    });

    const loadPuzzleToBoard = (puzzleString) => {
        clearMessage();
        for (let i = 0; i < 81; i++) {
            const row = rows[Math.floor(i / 9)];
            const col = (i % 9) + 1;
            const cell = document.getElementById(`${row}${col}`);
            cell.value = puzzleString[i] && puzzleString[i] !== '.' ? puzzleString[i] : '';
        }
        puzzleStringTextarea.value = puzzleString;
    };
    
    const getPuzzleStringFromGrid = () => {
        let puzzle = '';
        for (let i = 0; i < 81; i++) {
            const row = rows[Math.floor(i/9)];
            const col = (i % 9) + 1;
            const cell = document.getElementById(`${row}${col}`);
            puzzle += cell.value || '.';
        }
        return puzzle;
    };

    const updateTextareaFromGrid = () => {
        puzzleStringTextarea.value = getPuzzleStringFromGrid();
    };

    puzzleStringTextarea.addEventListener('input', (e) => {
        loadPuzzleToBoard(e.target.value);
    });
    
    const clearMessage = () => {
        messageArea.textContent = '';
    };
    
    const showMessage = (msg) => {
        messageArea.textContent = msg;
    };

    solveButton.addEventListener('click', async () => {
        clearMessage();
        const puzzleString = puzzleStringTextarea.value;
        
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ puzzle: puzzleString })
        });
        
        const data = await response.json();

        if (data.error) {
            showMessage(data.error);
        } else if (data.solution) {
            loadPuzzleToBoard(data.solution);
            showMessage('Puzzle Solved!');
            setTimeout(clearMessage, 3000);
        }
    });

    clearButton.addEventListener('click', () => {
        loadPuzzleToBoard('.'.repeat(81));
        clearMessage();
    });
    
    // Load first sample puzzle on start
    loadPuzzleToBoard(samplePuzzles[0][1]);
});
