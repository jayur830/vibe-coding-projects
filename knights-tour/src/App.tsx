import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Position, GameStatus, Board, Move } from './types';
import './App.css';

const App: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(8);
  const [board, setBoard] = useState<Board>([]);
  const [currentPosition, setCurrentPosition] = useState<Position>({ row: 0, col: 0 });
  const [moveCount, setMoveCount] = useState<number>(1);
  const [gameState, setGameState] = useState<GameStatus>('playing');
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);

  // 나이트의 움직임 (L자 모양) - useMemo로 최적화
  const knightMoves = useMemo<Move[]>(() => [
    { rowDelta: -2, colDelta: -1 }, { rowDelta: -2, colDelta: 1 },
    { rowDelta: -1, colDelta: -2 }, { rowDelta: -1, colDelta: 2 },
    { rowDelta: 1, colDelta: -2 }, { rowDelta: 1, colDelta: 2 },
    { rowDelta: 2, colDelta: -1 }, { rowDelta: 2, colDelta: 1 }
  ], []);

  // 유효한 위치인지 확인
  const isValidPosition = useCallback((row: number, col: number): boolean => {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  }, [boardSize]);

  // 가능한 다음 움직임 계산
  const calculatePossibleMoves = useCallback((row: number, col: number, currentBoard: Board): Position[] => {
    const moves: Position[] = [];
    for (const { rowDelta, colDelta } of knightMoves) {
      const newRow = row + rowDelta;
      const newCol = col + colDelta;
      if (isValidPosition(newRow, newCol) && currentBoard[newRow][newCol] === 0) {
        moves.push({ row: newRow, col: newCol });
      }
    }
    return moves;
  }, [knightMoves, isValidPosition]);

  // 게임 초기화
  const initializeGame = useCallback((): void => {
    const newBoard: Board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
    const startPos: Position = { row: 0, col: 0 };
    newBoard[startPos.row][startPos.col] = 1;

    setBoard(newBoard);
    setCurrentPosition(startPos);
    setMoveCount(1);
    setGameState('playing');

    const initialMoves = calculatePossibleMoves(startPos.row, startPos.col, newBoard);
    setPossibleMoves(initialMoves);
  }, [calculatePossibleMoves, boardSize]);

  // 보드 크기 변경 처리
  const handleBoardSizeChange = useCallback((newSize: number): void => {
    setBoardSize(newSize);
  }, []);

  // 게임 시작 시 또는 보드 크기 변경 시 초기화
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 칸 클릭 처리
  const handleCellClick = useCallback((row: number, col: number): void => {
    console.log('Cell clicked:', row, col);
    console.log('Game state:', gameState);
    console.log('Possible moves:', possibleMoves);

    if (gameState !== 'playing') {
      console.log('Game not in playing state');
      return;
    }

    // 현재 위치에서 갈 수 있는 곳인지 확인
    const isValidMove = possibleMoves.some(move => move.row === row && move.col === col);
    if (!isValidMove) {
      console.log('Invalid move');
      return;
    }

    console.log('Valid move detected');

    // 새로운 보드 상태 생성
    const newBoard = board.map(boardRow => [...boardRow]);
    const newMoveCount = moveCount + 1;
    newBoard[row][col] = newMoveCount;

    // 상태 업데이트
    setBoard(newBoard);
    setCurrentPosition({ row, col });
    setMoveCount(newMoveCount);

    // 게임 완료 확인
    if (newMoveCount === boardSize * boardSize) {
      setGameState('won');
      setPossibleMoves([]);
      return;
    }

    // 다음 가능한 움직임 계산
    const nextMoves = calculatePossibleMoves(row, col, newBoard);
    setPossibleMoves(nextMoves);

    // 더 이상 움직일 수 없으면 게임 종료
    if (nextMoves.length === 0) {
      setGameState('stuck');
    }
  }, [gameState, possibleMoves, board, moveCount, calculatePossibleMoves, boardSize]);

  // 셀 렌더링
  const renderCell = useCallback((row: number, col: number): React.ReactElement => {
    // 보드가 아직 초기화되지 않은 경우 방어
    if (!board || !board[row]) {
      return (
        <div
          key={`${row}-${col}`}
          className="cell loading"
          style={{ cursor: 'default' }}
        >
          Loading...
        </div>
      );
    }

    const cellValue = board[row][col];
    const isCurrentPosition = currentPosition.row === row && currentPosition.col === col;
    const isPossibleMove = possibleMoves.some(move => move.row === row && move.col === col);
    const isVisited = cellValue > 0;
    const isEvenSquare = (row + col) % 2 === 0;

    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${isEvenSquare ? 'even' : 'odd'} ${isCurrentPosition ? 'current' : ''} ${isPossibleMove ? 'possible' : ''} ${isVisited ? 'visited' : ''}`}
        onClick={() => handleCellClick(row, col)}
        style={{ cursor: isPossibleMove ? 'pointer' : 'default' }}
      >
        {isCurrentPosition && <div className="knight">♞</div>}
        {isVisited && !isCurrentPosition && <div className="move-number">{cellValue}</div>}
        {isPossibleMove && <div className="possible-dot"></div>}
      </div>
    );
  }, [board, currentPosition, possibleMoves, handleCellClick]);

  // 게임 상태 메시지
  const getStatusMessage = (): string => {
    switch (gameState) {
      case 'won':
        return '🎉 축하합니다! 기사의 여행을 완성했습니다!';
      case 'stuck':
        return '😔 더 이상 움직일 수 없습니다. 다시 시도해보세요!';
      default:
        return `움직임 ${moveCount}/${boardSize * boardSize} - 다음 움직임: ${possibleMoves.length}개 가능`;
    }
  };

  // 힌트 시스템 (Warnsdorff의 규칙 적용)
  const getHint = (): Position | null => {
    if (possibleMoves.length === 0) return null;

    let bestMove: Position | null = null;
    let minDegree = Infinity;

    for (const move of possibleMoves) {
      const tempBoard = board.map(boardRow => [...boardRow]);
      tempBoard[move.row][move.col] = moveCount + 1;
      const futureMoves = calculatePossibleMoves(move.row, move.col, tempBoard);

      if (futureMoves.length < minDegree) {
        minDegree = futureMoves.length;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const hint = getHint();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    handleBoardSizeChange(parseInt(e.target.value));
  };

  return (
    <div className="App">
      <div className="game-container">
        <h1>기사의 여행 (Knight's Tour)</h1>
        <p className="game-description">
          체스의 나이트가 모든 칸을 정확히 한 번씩 방문하세요! 🐎
        </p>

        <div className="game-settings">
          <label htmlFor="boardSize">보드 크기: </label>
          <select
            id="boardSize"
            value={boardSize}
            onChange={handleSelectChange}
            className="board-size-selector"
          >
            <option value={5}>5×5</option>
            <option value={6}>6×6</option>
            <option value={7}>7×7</option>
            <option value={8}>8×8</option>
          </select>
        </div>

        <div className="status-panel">
          <div className="status-message">{getStatusMessage()}</div>
          {hint && gameState === 'playing' && (
            <div className="hint">
              💡 힌트: ({hint.row + 1}, {hint.col + 1}) 칸을 추천합니다!
            </div>
          )}
        </div>

        <div className="board" style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`
        }}>
          {board.length > 0 ? (
            Array.from({ length: boardSize }, (_, row) => (
              <div key={row} className="board-row">
                {Array.from({ length: boardSize }, (_, col) => renderCell(row, col))}
              </div>
            ))
          ) : (
            <div className="loading-message">게임을 초기화하는 중...</div>
          )}
        </div>

        <div className="controls">
          <button className="reset-button" onClick={initializeGame}>
            🔄 새 게임
          </button>
          <div className="progress">
            진행률: {Math.round((moveCount / (boardSize * boardSize)) * 100)}%
          </div>
        </div>

        <div className="rules">
          <h3>게임 규칙</h3>
          <ul>
            <li>나이트는 L자 모양으로만 움직일 수 있습니다</li>
            <li>각 칸은 정확히 한 번만 방문할 수 있습니다</li>
            <li>모든 {boardSize * boardSize}칸을 방문하면 승리입니다</li>
            <li>초록색 점은 이동 가능한 위치입니다</li>
          </ul>
          <div className="difficulty-info">
            <h4>난이도 정보</h4>
            <ul>
              <li>5×5: 매우 어려움 (해가 존재하지 않을 수 있음)</li>
              <li>6×6: 어려움 (해가 매우 제한적)</li>
              <li>7×7: 보통 (도전적이지만 해결 가능)</li>
              <li>8×8: 표준 (전통적인 기사의 여행)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 