document.addEventListener('DOMContentLoaded', () => {
    const playerForm = document.getElementById('playerForm');
    const gameBoard = document.getElementById('gameBoard');
    const message = document.getElementById('message');
    const startGameBtn = document.getElementById('startGameBtn');
    const restartBtn = document.getElementById('restartBtn');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const boardSizeSelect = document.getElementById('boardSize');

    let currentPlayer = 'X';
    let board = [];
    let gameActive = true;
    let boardSize = 3;

    function initializeBoard() {
        board = Array(boardSize * boardSize).fill('');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            gameBoard.appendChild(cell);
        }
    }

    const winningConditions = (size) => {
        let conditions = [];

        // Rows
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            conditions.push(row);
        }

        // Columns
        for (let i = 0; i < size; i++) {
            let col = [];
            for (let j = 0; j < size; j++) {
                col.push(i + j * size);
            }
            conditions.push(col);
        }

        // Diagonals
        let diag1 = [];
        let diag2 = [];
        for (let i = 0; i < size; i++) {
            diag1.push(i * size + i);
            diag2.push((i + 1) * (size - 1));
        }
        conditions.push(diag1);
        conditions.push(diag2);

        return conditions;
    };

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        board[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.innerHTML = `${currentPlayer === 'X' ? player1Input.value || 'Player 1' : player2Input.value || 'Player 2'}'s turn`;
    }

    function handleResultValidation() {
        let roundWon = false;
        const conditions = winningConditions(boardSize);
        for (let i = 0; i < conditions.length; i++) {
            const condition = conditions[i];
            let check = board[condition[0]];
            if (check === '') continue;
            if (condition.every(index => board[index] === check)) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            message.innerHTML = `${currentPlayer === 'X' ? player1Input.value || 'Player 1' : player2Input.value || 'Player 2'} wins!`;
            gameActive = false;
            return;
        }

        let roundDraw = !board.includes('');
        if (roundDraw) {
            message.innerHTML = `Draw!`;
            gameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = 'X';
        board = Array(boardSize * boardSize).fill('');
        message.innerHTML = `${player1Input.value || 'Player 1'}'s turn`;
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
        initializeBoard();
    }

    function startGame() {
        const player1 = player1Input.value.trim();
        const player2 = player2Input.value.trim();
        boardSize = parseInt(boardSizeSelect.value);

        if (player1 && player2) {
            playerForm.classList.add('hidden');
            gameBoard.classList.remove('hidden');
            restartBtn.classList.remove('hidden');

            message.innerHTML = `${player1}'s turn`;
            initializeBoard();

            document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
            restartBtn.addEventListener('click', handleRestartGame);
        } else {
            alert('Please enter names for both players.');
        }
    }

    startGameBtn.addEventListener('click', startGame);
});