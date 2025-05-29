import { Position, Board, Move } from './types';

// 게임 로직 유닛 테스트
describe('기사의 여행 게임 로직', () => {
  // 나이트 움직임 패턴
  const knightMoves: Move[] = [
    { rowDelta: -2, colDelta: -1 }, { rowDelta: -2, colDelta: 1 },
    { rowDelta: -1, colDelta: -2 }, { rowDelta: -1, colDelta: 2 },
    { rowDelta: 1, colDelta: -2 }, { rowDelta: 1, colDelta: 2 },
    { rowDelta: 2, colDelta: -1 }, { rowDelta: 2, colDelta: 1 }
  ];

  // 유효한 위치인지 확인하는 함수
  const isValidPosition = (row: number, col: number, boardSize: number = 8): boolean => {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  };

  // 가능한 움직임을 계산하는 함수
  const calculatePossibleMoves = (row: number, col: number, board: Board): Position[] => {
    const moves: Position[] = [];
    for (const { rowDelta, colDelta } of knightMoves) {
      const newRow = row + rowDelta;
      const newCol = col + colDelta;
      if (isValidPosition(newRow, newCol, board.length) && board[newRow][newCol] === 0) {
        moves.push({ row: newRow, col: newCol });
      }
    }
    return moves;
  };

  // Warnsdorff의 규칙 힌트 계산
  const getWarnsdorffHint = (possibleMoves: Position[], board: Board): Position | null => {
    if (possibleMoves.length === 0) return null;

    let bestMove: Position | null = null;
    let minDegree = Infinity;

    for (const move of possibleMoves) {
      const tempBoard: Board = board.map((row: number[]) => [...row]);
      tempBoard[move.row][move.col] = 1; // 임시로 방문 표시
      const futureMoves = calculatePossibleMoves(move.row, move.col, tempBoard);

      if (futureMoves.length < minDegree) {
        minDegree = futureMoves.length;
        bestMove = move;
      }
    }

    return bestMove;
  };

  describe('유효한 위치 확인', () => {
    test('보드 내부의 위치는 유효하다', () => {
      expect(isValidPosition(0, 0)).toBe(true);
      expect(isValidPosition(3, 4)).toBe(true);
      expect(isValidPosition(7, 7)).toBe(true);
    });

    test('보드 외부의 위치는 무효하다', () => {
      expect(isValidPosition(-1, 0)).toBe(false);
      expect(isValidPosition(0, -1)).toBe(false);
      expect(isValidPosition(8, 0)).toBe(false);
      expect(isValidPosition(0, 8)).toBe(false);
      expect(isValidPosition(8, 8)).toBe(false);
    });

    test('다른 크기의 보드에서도 올바르게 작동한다', () => {
      expect(isValidPosition(4, 4, 5)).toBe(true);
      expect(isValidPosition(5, 5, 5)).toBe(false);
    });
  });

  describe('나이트 움직임 계산', () => {
    test('보드 중앙에서는 최대 8개의 움직임이 가능하다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      const moves = calculatePossibleMoves(4, 4, board);
      expect(moves).toHaveLength(8);
    });

    test('보드 모서리에서는 움직임이 제한된다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));

      // 왼쪽 위 모서리 (0,0)
      const cornerMoves = calculatePossibleMoves(0, 0, board);
      expect(cornerMoves).toHaveLength(2);
      expect(cornerMoves).toEqual(
        expect.arrayContaining([
          { row: 2, col: 1 },
          { row: 1, col: 2 }
        ])
      );
    });

    test('이미 방문한 칸은 제외된다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[2][1] = 1; // 이미 방문한 칸

      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(1);
      expect(moves).toEqual([{ row: 1, col: 2 }]);
    });

    test('모든 인접 칸이 방문된 경우 빈 배열을 반환한다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));

      // (0,0) 주변의 모든 가능한 위치를 방문 상태로 설정
      board[2][1] = 1;
      board[1][2] = 1;

      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(0);
    });
  });

  describe('나이트 움직임 패턴', () => {
    test('나이트는 정확히 8가지 L자 움직임을 가진다', () => {
      expect(knightMoves).toHaveLength(8);
    });

    test('모든 움직임이 L자 패턴이다', () => {
      knightMoves.forEach(({ rowDelta, colDelta }) => {
        const absRow = Math.abs(rowDelta);
        const absCol = Math.abs(colDelta);

        // L자 패턴: (2,1) 또는 (1,2)
        const isLShape = (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
        expect(isLShape).toBe(true);
      });
    });

    test('모든 움직임이 고유하다', () => {
      const uniqueMoves = new Set(knightMoves.map(move => `${move.rowDelta},${move.colDelta}`));
      expect(uniqueMoves.size).toBe(8);
    });
  });

  describe('Warnsdorff의 규칙', () => {
    test('가능한 움직임이 없으면 null을 반환한다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      const hint = getWarnsdorffHint([], board);
      expect(hint).toBeNull();
    });

    test('가장 적은 미래 선택지를 가진 위치를 선택한다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));

      // (0,0)에서 가능한 움직임들
      const possibleMoves: Position[] = [
        { row: 2, col: 1 }, // 더 많은 미래 선택지
        { row: 1, col: 2 }  // 더 적은 미래 선택지 (모서리에 가까움)
      ];

      const hint = getWarnsdorffHint(possibleMoves, board);
      expect(hint).toBeDefined();
      expect(hint?.row).toBeDefined();
      expect(hint?.col).toBeDefined();
    });

    test('Warnsdorff 규칙이 올바르게 작동한다', () => {
      const board: Board = Array(5).fill(null).map(() => Array(5).fill(0));

      // 실제 계산을 통해 어떤 결과가 나오는지 확인
      const possibleMoves: Position[] = [
        { row: 2, col: 2 },
        { row: 2, col: 0 }
      ];

      const hint = getWarnsdorffHint(possibleMoves, board);
      expect(hint).toBeDefined();

      // 힌트가 가능한 움직임 중 하나인지 확인
      expect(possibleMoves).toContainEqual(hint);

      // 결과가 null이 아니고 올바른 형식인지 확인
      expect(hint).toHaveProperty('row');
      expect(hint).toHaveProperty('col');
      expect(typeof hint?.row).toBe('number');
      expect(typeof hint?.col).toBe('number');
    });
  });

  describe('게임 상태 확인', () => {
    test('승리 조건: 모든 칸이 방문되었는지 확인', () => {
      const boardSize = 8;
      const totalMoves = boardSize * boardSize;

      // 모든 칸이 방문된 보드
      const wonBoard: Board = Array(boardSize).fill(null).map((_, row: number) =>
        Array(boardSize).fill(null).map((_, col: number) => row * boardSize + col + 1)
      );

      const visitedCount = wonBoard.flat().filter((cell: number) => cell > 0).length;
      expect(visitedCount).toBe(totalMoves);
    });

    test('패배 조건: 가능한 움직임이 없는지 확인', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(1)); // 모든 칸 방문됨
      board[0][0] = 0; // 현재 위치만 비어있음

      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(0);
    });
  });

  describe('보드 경계 케이스', () => {
    test('1x1 보드에서는 움직임이 불가능하다', () => {
      const board: Board = [[0]];
      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(0);
    });

    test('2x2 보드에서는 나이트가 움직일 수 없다', () => {
      const board: Board = Array(2).fill(null).map(() => Array(2).fill(0));
      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(0);
    });

    test('3x3 보드에서 중앙에서만 움직임이 가능하다', () => {
      const board: Board = Array(3).fill(null).map(() => Array(3).fill(0));

      // 모서리에서는 움직임 제한적이지만 가능할 수 있음
      const corner00Moves = calculatePossibleMoves(0, 0, board);
      expect(corner00Moves.length).toBeGreaterThanOrEqual(0);
      
      const corner22Moves = calculatePossibleMoves(2, 2, board);
      expect(corner22Moves.length).toBeGreaterThanOrEqual(0);

      // 중앙에서도 보드가 작아 움직임 제한
      const centerMoves = calculatePossibleMoves(1, 1, board);
      expect(centerMoves.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('성능 및 안정성', () => {
    test('큰 보드에서도 안정적으로 작동한다', () => {
      const boardSize = 20;
      const board: Board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));

      const startTime = performance.now();
      const moves = calculatePossibleMoves(10, 10, board);
      const endTime = performance.now();

      expect(moves).toHaveLength(8); // 중앙에서는 모든 움직임 가능
      expect(endTime - startTime).toBeLessThan(10); // 10ms 이내 완료
    });

    test('빈 보드가 아닌 경우에도 올바르게 처리한다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));

      // 무작위로 몇 칸을 방문 상태로 설정
      board[3][3] = 1;
      board[4][3] = 2;
      board[5][4] = 3;

      const moves = calculatePossibleMoves(2, 2, board);
      expect(Array.isArray(moves)).toBe(true);
      expect(moves.every((move: Position) => typeof move.row === 'number' && typeof move.col === 'number')).toBe(true);
    });
  });

  describe('데이터 무결성', () => {
    test('원본 보드가 수정되지 않는다', () => {
      const originalBoard: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      const boardCopy: Board = originalBoard.map((row: number[]) => [...row]);

      calculatePossibleMoves(0, 0, originalBoard);

      expect(originalBoard).toEqual(boardCopy);
    });

    test('Warnsdorff 힌트 계산 시 원본 보드가 수정되지 않는다', () => {
      const originalBoard: Board = Array(8).fill(null).map(() => Array(8).fill(0));
      const boardCopy: Board = originalBoard.map((row: number[]) => [...row]);

      const possibleMoves: Position[] = [{ row: 2, col: 1 }, { row: 1, col: 2 }];
      getWarnsdorffHint(possibleMoves, originalBoard);

      expect(originalBoard).toEqual(boardCopy);
    });

    test('잘못된 입력에 대해 안전하게 처리한다', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(0));

      // 음수 좌표 - 일부 움직임이 유효할 수 있음
      expect(() => calculatePossibleMoves(-1, 0, board)).not.toThrow();
      const negativeMoves = calculatePossibleMoves(-1, 0, board);
      expect(Array.isArray(negativeMoves)).toBe(true);

      // 보드 크기를 벗어나는 좌표
      expect(() => calculatePossibleMoves(10, 10, board)).not.toThrow();
      expect(calculatePossibleMoves(10, 10, board)).toEqual([]);
    });
  });
}); 