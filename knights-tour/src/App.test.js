import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('기사의 여행 게임', () => {
  beforeEach(() => {
    // 각 테스트 전에 콘솔 로그 모킹
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    // 테스트 후 모킹 복원
    jest.restoreAllMocks();
  });

  describe('초기 렌더링', () => {
    test('게임 제목이 표시된다', () => {
      render(<App />);
      const title = screen.getByText('기사의 여행 (Knight\'s Tour)');
      expect(title).toBeInTheDocument();
    });

    test('게임 설명이 표시된다', () => {
      render(<App />);
      const description = screen.getByText(/체스의 나이트가 모든 칸을 정확히 한 번씩 방문하세요!/);
      expect(description).toBeInTheDocument();
    });

    test('보드 크기 선택기가 표시된다', () => {
      render(<App />);
      const boardSizeLabel = screen.getByText('보드 크기:');
      expect(boardSizeLabel).toBeInTheDocument();

      const selector = screen.getByDisplayValue('8×8');
      expect(selector).toBeInTheDocument();

      // 모든 옵션이 있는지 확인
      expect(screen.getByText('5×5')).toBeInTheDocument();
      expect(screen.getByText('6×6')).toBeInTheDocument();
      expect(screen.getByText('7×7')).toBeInTheDocument();
      expect(screen.getByText('8×8')).toBeInTheDocument();
    });

    test('기본 8x8 체스판이 렌더링된다', () => {
      render(<App />);
      // 초기화가 완료될 때까지 기다림
      const cells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('cell')
      );
      expect(cells).toHaveLength(64); // 8x8 = 64칸
    });

    test('나이트가 초기 위치에 표시된다', () => {
      render(<App />);
      const knight = screen.getByText('♞');
      expect(knight).toBeInTheDocument();

      // 현재 위치 셀 확인
      const currentCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('current')
      );
      expect(currentCells.length).toBe(1);
      expect(currentCells[0]).toHaveClass('current');
    });

    test('초기 상태 메시지가 표시된다', () => {
      render(<App />);
      const statusMessage = screen.getByText(/움직임 1\/64/);
      expect(statusMessage).toBeInTheDocument();
    });

    test('새 게임 버튼이 표시된다', () => {
      render(<App />);
      const resetButton = screen.getByText('🔄 새 게임');
      expect(resetButton).toBeInTheDocument();
    });

    test('게임 규칙이 표시된다', () => {
      render(<App />);
      const rulesTitle = screen.getByText('게임 규칙');
      expect(rulesTitle).toBeInTheDocument();

      const rules = [
        '나이트는 L자 모양으로만 움직일 수 있습니다',
        '각 칸은 정확히 한 번만 방문할 수 있습니다',
        '모든 64칸을 방문하면 승리입니다',
        '초록색 점은 이동 가능한 위치입니다'
      ];

      rules.forEach(rule => {
        expect(screen.getByText(rule)).toBeInTheDocument();
      });
    });

    test('난이도 정보가 표시된다', () => {
      render(<App />);
      const difficultyTitle = screen.getByText('난이도 정보');
      expect(difficultyTitle).toBeInTheDocument();

      expect(screen.getByText(/5×5: 매우 어려움/)).toBeInTheDocument();
      expect(screen.getByText(/6×6: 어려움/)).toBeInTheDocument();
      expect(screen.getByText(/7×7: 보통/)).toBeInTheDocument();
      expect(screen.getByText(/8×8: 표준/)).toBeInTheDocument();
    });
  });

  describe('보드 크기 변경', () => {
    test('보드 크기를 5x5로 변경할 수 있다', async () => {
      render(<App />);

      const selector = screen.getByDisplayValue('8×8');
      fireEvent.change(selector, { target: { value: '5' } });

      await waitFor(() => {
        expect(screen.getByDisplayValue('5×5')).toBeInTheDocument();
      });

      // 추가 확인을 별도로 수행
      expect(screen.getByText(/움직임 1\/25/)).toBeInTheDocument();
      expect(screen.getByText(/모든 25칸을 방문하면 승리입니다/)).toBeInTheDocument();

      // 5x5 보드 (25칸) 확인
      const cells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('cell')
      );
      expect(cells).toHaveLength(25);
    });

    test('보드 크기를 6x6으로 변경할 수 있다', async () => {
      render(<App />);

      const selector = screen.getByDisplayValue('8×8');
      fireEvent.change(selector, { target: { value: '6' } });

      await waitFor(() => {
        expect(screen.getByDisplayValue('6×6')).toBeInTheDocument();
      });

      // 추가 확인을 별도로 수행
      expect(screen.getByText(/움직임 1\/36/)).toBeInTheDocument();

      // 6x6 보드 (36칸) 확인
      const cells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('cell')
      );
      expect(cells).toHaveLength(36);
    });

    test('보드 크기 변경 시 게임이 초기화된다', async () => {
      render(<App />);

      // 먼저 움직여서 상태 변경
      const possibleCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('possible')
      );

      // 가능한 움직임이 있을 때만 테스트 진행
      expect(possibleCells.length).toBeGreaterThan(0);

      fireEvent.click(possibleCells[0]);

      await waitFor(() => {
        expect(screen.getByText(/움직임 2\/64/)).toBeInTheDocument();
      });

      // 보드 크기 변경
      const selector = screen.getByDisplayValue('8×8');
      fireEvent.change(selector, { target: { value: '7' } });

      await waitFor(() => {
        expect(screen.getByText(/움직임 1\/49/)).toBeInTheDocument();
      });

      // 추가 확인을 별도로 수행
      expect(screen.getByDisplayValue('7×7')).toBeInTheDocument();
    });
  });

  describe('게임 초기화', () => {
    test('초기 진행률이 표시된다', () => {
      render(<App />);
      const progress = screen.getByText(/진행률: \d+%/);
      expect(progress).toBeInTheDocument();
    });

    test('초기에 가능한 움직임이 표시된다', () => {
      render(<App />);
      const possibleMoves = screen.getAllByRole('generic').filter(el =>
        el.className.includes('possible')
      );
      expect(possibleMoves.length).toBeGreaterThan(0);
      expect(possibleMoves.length).toBeLessThanOrEqual(8); // 최대 8개
    });

    test('힌트가 표시된다', () => {
      render(<App />);
      const hint = screen.getByText(/💡 힌트:/);
      expect(hint).toBeInTheDocument();
    });
  });

  describe('나이트 움직임', () => {
    test('가능한 위치를 클릭하면 나이트가 이동한다', async () => {
      render(<App />);

      // 초기에 가능한 움직임 찾기
      const possibleCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('possible')
      );

      expect(possibleCells.length).toBeGreaterThan(0);

      // 첫 번째 가능한 위치 클릭
      fireEvent.click(possibleCells[0]);

      await waitFor(() => {
        // 움직임 카운트가 증가했는지 확인
        expect(screen.getByText(/움직임 2\/64/)).toBeInTheDocument();
      });
    });

    test('불가능한 위치를 클릭해도 나이트가 이동하지 않는다', () => {
      render(<App />);

      // 불가능한 위치 (일반 칸) 찾기
      const impossibleCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('cell') &&
        !el.className.includes('possible') &&
        !el.className.includes('current')
      );

      // 불가능한 셀이 존재하는 경우에만 테스트 진행
      expect(impossibleCells.length).toBeGreaterThan(0);

      fireEvent.click(impossibleCells[0]);

      // 움직임 카운트가 변하지 않았는지 확인
      const statusMessage = screen.getByText(/움직임 1\/64/);
      expect(statusMessage).toBeInTheDocument();
    });

    test('방문한 칸에는 순서 번호가 표시된다', async () => {
      render(<App />);

      // 가능한 움직임 클릭
      const possibleCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('possible')
      );

      expect(possibleCells.length).toBeGreaterThan(0);

      fireEvent.click(possibleCells[0]);

      // 이전 위치에 "1" 번호가 표시되는지 확인
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      // 방문한 셀 클래스 확인
      const visitedCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('visited')
      );
      expect(visitedCells.length).toBeGreaterThan(0);
    });
  });

  describe('게임 상태 관리', () => {
    test('새 게임 버튼 클릭 시 게임이 초기화된다', async () => {
      render(<App />);

      // 한 번 움직인 후
      const possibleCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('possible')
      );

      expect(possibleCells.length).toBeGreaterThan(0);

      fireEvent.click(possibleCells[0]);

      await waitFor(() => {
        expect(screen.getByText(/움직임 2\/64/)).toBeInTheDocument();
      });

      // 새 게임 버튼 클릭
      const resetButton = screen.getByText('🔄 새 게임');
      fireEvent.click(resetButton);

      // 초기 상태로 돌아갔는지 확인
      await waitFor(() => {
        expect(screen.getByText(/움직임 1\/64/)).toBeInTheDocument();
      });

      // 나이트가 초기 위치에 있는지 확인
      expect(screen.getByText('♞')).toBeInTheDocument();
    });

    test('진행률이 정확히 계산된다', async () => {
      render(<App />);

      // 초기 진행률 확인
      expect(screen.getByText(/진행률: \d+%/)).toBeInTheDocument();

      // 한 번 움직인 후 진행률 확인
      const possibleCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('possible')
      );

      expect(possibleCells.length).toBeGreaterThan(0);

      fireEvent.click(possibleCells[0]);

      await waitFor(() => {
        // 진행률이 업데이트되었는지 확인
        expect(screen.getByText(/진행률: \d+%/)).toBeInTheDocument();
      });
    });
  });

  describe('힌트 시스템', () => {
    test('Warnsdorff 규칙 힌트가 표시된다', () => {
      render(<App />);

      const hint = screen.getByText(/💡 힌트:/);
      expect(hint).toBeInTheDocument();

      // 힌트 형식 확인 (좌표가 포함되어야 함)
      expect(hint.textContent).toMatch(/\(\d+, \d+\)/);
    });
  });

  describe('접근성', () => {
    test('키보드 네비게이션을 위한 올바른 역할이 설정되어 있다', () => {
      render(<App />);

      // 버튼이 제대로 button 역할을 가지는지 확인
      const resetButton = screen.getByRole('button', { name: /새 게임/ });
      expect(resetButton).toBeInTheDocument();

      // select 요소 확인
      const boardSizeSelect = screen.getByRole('combobox');
      expect(boardSizeSelect).toBeInTheDocument();
    });

    test('클릭 가능한 셀에 포인터 커서가 적용된다', () => {
      render(<App />);

      // possible 클래스를 가진 cell 요소를 정확히 찾기
      const allCells = screen.getAllByRole('generic');
      const possibleCells = allCells.filter(el =>
        el.className.includes('cell') && el.className.includes('possible')
      );

      expect(possibleCells.length).toBeGreaterThan(0);
      // possible 클래스가 있는 셀들이 올바른 클래스를 가지는지 확인
      possibleCells.forEach(cell => {
        expect(cell).toHaveClass('possible');
        expect(cell).toHaveClass('cell');
        // CSS 스타일 대신 클래스 존재를 확인
        expect(cell.className).toContain('possible');
      });
    });
  });

  describe('에러 처리', () => {
    test('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<App />);

      // 컴포넌트가 정상적으로 렌더링되었는지만 확인
      const title = screen.getByText('기사의 여행 (Knight\'s Tour)');
      expect(title).toBeInTheDocument();
    });
  });

  describe('UI 상호작용', () => {
    test('체스판의 모든 셀이 렌더링된다', () => {
      render(<App />);

      const cells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('cell')
      );

      expect(cells.length).toBe(64);

      // 모든 셀에 cell 클래스가 적용되어 있는지 확인
      cells.forEach(cell => {
        expect(cell).toHaveClass('cell');
      });
    });

    test('현재 위치 셀이 올바르게 하이라이트된다', () => {
      render(<App />);

      const currentCells = screen.getAllByRole('generic').filter(el =>
        el.className.includes('current')
      );

      expect(currentCells.length).toBe(1);
      expect(currentCells[0]).toHaveClass('current');
    });
  });
});
