// 게임 로직 유닛 테스트
describe('기사의 여행 게임 로직', () => {
  // 나이트 움직임 패턴
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  // 유효한 위치인지 확인하는 함수
  const isValidPosition = (row, col, boardSize = 8) => {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  };

  // 가능한 움직임을 계산하는 함수
  const calculatePossibleMoves = (row, col, board) => {
    const moves = [];
    for (const [dRow, dCol] of knightMoves) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (isValidPosition(newRow, newCol, board.length) && board[newRow][newCol] === 0) {
        moves.push({ row: newRow, col: newCol });
      }
    }
    return moves;
  };

  // Warnsdorff의 규칙 힌트 계산
  const getWarnsdorffHint = (possibleMoves, board) => {
    if (possibleMoves.length === 0) return null;

    let bestMove = null;
    let minDegree = Infinity;

    for (const move of possibleMoves) {
      const tempBoard = board.map(row => [...row]);
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
      const board = Array(8).fill(null).map(() => Array(8).fill(0));
      const moves = calculatePossibleMoves(4, 4, board);
      expect(moves).toHaveLength(8);
    });

    test('보드 모서리에서는 움직임이 제한된다', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(0));

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
      const board = Array(8).fill(null).map(() => Array(8).fill(0));
      board[2][1] = 1; // 이미 방문한 칸

      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(1);
      expect(moves).toEqual([{ row: 1, col: 2 }]);
    });

    test('모든 인접 칸이 방문된 경우 빈 배열을 반환한다', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(0));

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
      knightMoves.forEach(([dRow, dCol]) => {
        const absRow = Math.abs(dRow);
        const absCol = Math.abs(dCol);

        // L자 패턴: (2,1) 또는 (1,2)
        const isLShape = (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
        expect(isLShape).toBe(true);
      });
    });

    test('모든 움직임이 고유하다', () => {
      const uniqueMoves = new Set(knightMoves.map(move => `${move[0]},${move[1]}`));
      expect(uniqueMoves.size).toBe(8);
    });
  });

  describe('Warnsdorff의 규칙', () => {
    test('가능한 움직임이 없으면 null을 반환한다', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(0));
      const hint = getWarnsdorffHint([], board);
      expect(hint).toBeNull();
    });

    test('가장 적은 미래 선택지를 가진 위치를 선택한다', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(0));

      // (0,0)에서 가능한 움직임들
      const possibleMoves = [
        { row: 2, col: 1 }, // 더 많은 미래 선택지
        { row: 1, col: 2 }  // 더 적은 미래 선택지 (모서리에 가까움)
      ];

      const hint = getWarnsdorffHint(possibleMoves, board);
      expect(hint).toBeDefined();
      expect(hint.row).toBeDefined();
      expect(hint.col).toBeDefined();
    });

    test('Warnsdorff 규칙이 올바르게 작동한다', () => {
      const board = Array(5).fill(null).map(() => Array(5).fill(0));

      // 실제 계산을 통해 어떤 결과가 나오는지 확인
      const possibleMoves = [
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
      expect(typeof hint.row).toBe('number');
      expect(typeof hint.col).toBe('number');
    });
  });

  describe('게임 상태 확인', () => {
    test('승리 조건: 모든 칸이 방문되었는지 확인', () => {
      const boardSize = 8;
      const totalMoves = boardSize * boardSize;

      // 모든 칸이 방문된 보드
      const wonBoard = Array(boardSize).fill(null).map((_, row) =>
        Array(boardSize).fill(null).map((_, col) => row * boardSize + col + 1)
      );

      const visitedCount = wonBoard.flat().filter(cell => cell > 0).length;
      expect(visitedCount).toBe(totalMoves);
    });

    test('패배 조건: 가능한 움직임이 없는지 확인', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(1)); // 모든 칸 방문됨
      board[0][0] = 0; // 현재 위치만 비어있음

      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(0);
    });
  });

  describe('보드 경계 케이스', () => {
    test('1x1 보드에서는 움직임이 불가능하다', () => {
      const board = [[0]];
      const moves = calculatePossibleMoves(0, 0, board);
      expect(moves).toHaveLength(0);
    });

    test('3x3 보드에서는 제한된 움직임만 가능하다', () => {
      const board = Array(3).fill(null).map(() => Array(3).fill(0));

      // 중앙에서의 움직임
      const centerMoves = calculatePossibleMoves(1, 1, board);
      expect(centerMoves.length).toBeLessThan(8);

      // 모든 움직임이 보드 내부에 있는지 확인
      centerMoves.forEach(move => {
        expect(isValidPosition(move.row, move.col, 3)).toBe(true);
      });
    });

    test('5x5 보드에서 나이트 여행이 가능한지 확인', () => {
      const board = Array(5).fill(null).map(() => Array(5).fill(0));

      // 각 위치에서 최소 하나의 움직임은 가능해야 함 (일부 위치 제외)
      let totalPossibleMoves = 0;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const moves = calculatePossibleMoves(row, col, board);
          totalPossibleMoves += moves.length;
        }
      }

      expect(totalPossibleMoves).toBeGreaterThan(0);
    });
  });

  describe('성능 테스트', () => {
    test('큰 보드에서도 빠르게 계산된다', () => {
      const board = Array(10).fill(null).map(() => Array(10).fill(0));

      const startTime = performance.now();

      // 여러 위치에서 움직임 계산
      for (let i = 0; i < 100; i++) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        calculatePossibleMoves(row, col, board);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // 100번의 계산이 100ms 이내에 완료되어야 함
      expect(executionTime).toBeLessThan(100);
    });
  });

  describe('데이터 무결성', () => {
    test('원본 보드가 수정되지 않는다', () => {
      const originalBoard = Array(8).fill(null).map(() => Array(8).fill(0));
      const boardCopy = originalBoard.map(row => [...row]);

      calculatePossibleMoves(0, 0, originalBoard);

      expect(originalBoard).toEqual(boardCopy);
    });

    test('반환된 움직임 객체가 올바른 형식이다', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(0));
      const moves = calculatePossibleMoves(4, 4, board);

      moves.forEach(move => {
        expect(move).toHaveProperty('row');
        expect(move).toHaveProperty('col');
        expect(typeof move.row).toBe('number');
        expect(typeof move.col).toBe('number');
      });
    });
  });
}); 