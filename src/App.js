import { useState } from 'react';

// component rendering for individual square on the board
function Square({ value, onSquareClick }) {
  let textColor = value === 'X' ? '#00a6fb' : '#D64933';

  return (
    <button className="square" style={{ color: textColor }} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// component for rendering the game board
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let statusColor;

  if (winner) {
    status = 'Winner: ' + winner;
    statusColor = winner === 'X' ? '#00a6fb' : '#D64933';
  } else if (squares.every((square) => square !== null)) {
    status = 'Tie Game!';
    statusColor = '#64F58D';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    statusColor = xIsNext ? '#00a6fb' : '#D64933';
  }

  return (
    <>
      <div className="status" style={{ color: statusColor }}>
        {status}
      </div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// main component for the game
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const restartGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  // generating the list of moves
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button
          className={move === currentMove ? 'moves-btn current-move' : 'moves-btn'}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol className="moves-list">{moves}</ol>
      </div>
      <button className="restart-btn" onClick={restartGame}>
        Restart Game
      </button>
    </div>
  );
}

// function to calculate the winner of the game
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
