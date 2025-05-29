import React, { useState } from 'react';
import type { Board, Player, CellValue, WinInfo } from './types.ts';
import './App.css';

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  const calculateWinner = (squares: Board): WinInfo | null => {
    const lines: number[][] = [
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
        return { 
          winner: squares[a] as Player, 
          winningLine: lines[i] 
        };
      }
    }
    return null;
  };

  const handleClick = (index: number): void => {
    if (board[index] || winner) {
      return;
    }

    const newBoard: Board = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.winningLine);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const renderSquare = (index: number): React.ReactElement => {
    const isWinningSquare = winningLine.includes(index);
    return (
      <button
        className={`square ${isWinningSquare ? 'winning' : ''}`}
        onClick={() => handleClick(index)}
        key={index}
      >
        {board[index]}
      </button>
    );
  };

  const isDraw: boolean = !winner && board.every((square: CellValue) => square !== null);

  let status: string;
  if (winner) {
    status = `승리자: ${winner}`;
  } else if (isDraw) {
    status = '무승부!';
  } else {
    status = `다음 차례: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App">
      <div className="game">
        <h1>틱택토 게임</h1>
        <div className="status">{status}</div>
        <div className="board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
        <button className="reset-button" onClick={resetGame}>
          다시 시작
        </button>
      </div>
    </div>
  );
};

export default App;
