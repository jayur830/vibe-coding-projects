import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('틱택토 게임', () => {
  describe('초기 렌더링', () => {
    test('게임 제목이 표시된다', () => {
      render(<App />);
      const title = screen.getByText('틱택토 게임');
      expect(title).toBeInTheDocument();
    });

    test('빈 3x3 게임 보드가 렌더링된다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      expect(squares).toHaveLength(9);
      
      squares.forEach((square: HTMLElement) => {
        expect(square).toHaveTextContent('');
      });
    });

    test('초기 상태 메시지가 표시된다', () => {
      render(<App />);
      const status = screen.getByText('다음 차례: X');
      expect(status).toBeInTheDocument();
    });

    test('다시 시작 버튼이 표시된다', () => {
      render(<App />);
      const resetButton = screen.getByText('다시 시작');
      expect(resetButton).toBeInTheDocument();
      expect(resetButton.tagName).toBe('BUTTON');
    });
  });

  describe('게임 플레이', () => {
    test('첫 번째 클릭에서 X가 표시된다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      fireEvent.click(squares[0]);
      expect(squares[0]).toHaveTextContent('X');
      expect(screen.getByText('다음 차례: O')).toBeInTheDocument();
    });

    test('두 번째 클릭에서 O가 표시된다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      
      expect(squares[0]).toHaveTextContent('X');
      expect(squares[1]).toHaveTextContent('O');
      expect(screen.getByText('다음 차례: X')).toBeInTheDocument();
    });

    test('이미 채워진 칸은 클릭할 수 없다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[0]); // 같은 칸 다시 클릭
      
      expect(squares[0]).toHaveTextContent('X');
      expect(screen.getByText('다음 차례: O')).toBeInTheDocument(); // 여전히 O 차례
    });

    test('플레이어가 번갈아가며 플레이한다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[2]); // X
      fireEvent.click(squares[3]); // O
      
      expect(squares[0]).toHaveTextContent('X');
      expect(squares[1]).toHaveTextContent('O');
      expect(squares[2]).toHaveTextContent('X');
      expect(squares[3]).toHaveTextContent('O');
    });
  });

  describe('승리 조건', () => {
    test('가로줄 승리를 감지한다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // X가 첫 번째 줄을 완성
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[2]); // X - 승리
      
      expect(screen.getByText('승리자: X')).toBeInTheDocument();
    });

    test('세로줄 승리를 감지한다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // X가 첫 번째 열을 완성
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[3]); // X
      fireEvent.click(squares[2]); // O
      fireEvent.click(squares[6]); // X - 승리
      
      expect(screen.getByText('승리자: X')).toBeInTheDocument();
    });

    test('대각선 승리를 감지한다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // X가 대각선을 완성
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[4]); // X
      fireEvent.click(squares[2]); // O
      fireEvent.click(squares[8]); // X - 승리
      
      expect(screen.getByText('승리자: X')).toBeInTheDocument();
    });

    test('역대각선 승리를 감지한다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // X가 역대각선을 완성
      fireEvent.click(squares[2]); // X
      fireEvent.click(squares[0]); // O
      fireEvent.click(squares[4]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[6]); // X - 승리
      
      expect(screen.getByText('승리자: X')).toBeInTheDocument();
    });

    test('O도 승리할 수 있다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // O가 첫 번째 줄을 완성
      fireEvent.click(squares[3]); // X
      fireEvent.click(squares[0]); // O
      fireEvent.click(squares[4]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[6]); // X
      fireEvent.click(squares[2]); // O - 승리
      
      expect(screen.getByText('승리자: O')).toBeInTheDocument();
    });
  });

  describe('무승부', () => {
    test('모든 칸이 채워지고 승리자가 없으면 무승부를 표시한다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // 무승부 시나리오 설정
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[2]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[3]); // X
      fireEvent.click(squares[5]); // O
      fireEvent.click(squares[7]); // X
      fireEvent.click(squares[6]); // O
      fireEvent.click(squares[8]); // X
      
      expect(screen.getByText('무승부!')).toBeInTheDocument();
    });
  });

  describe('승리 하이라이트', () => {
    test('승리한 줄이 하이라이트된다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // X가 첫 번째 줄을 완성
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[2]); // X - 승리
      
      // 승리한 칸들이 winning 클래스를 가져야 함
      expect(squares[0]).toHaveClass('winning');
      expect(squares[1]).toHaveClass('winning');
      expect(squares[2]).toHaveClass('winning');
    });
  });

  describe('게임 재시작', () => {
    test('다시 시작 버튼이 게임을 초기화한다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      const resetButton = screen.getByText('다시 시작');
      
      // 몇 수 두기
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[2]); // X
      
      // 리셋 전 상태 확인
      expect(squares[0]).toHaveTextContent('X');
      expect(squares[1]).toHaveTextContent('O');
      expect(squares[2]).toHaveTextContent('X');
      
      // 게임 리셋
      fireEvent.click(resetButton);
      
      // 모든 칸이 비워져야 함
      squares.forEach((square: HTMLElement) => {
        expect(square).toHaveTextContent('');
      });
      
      // X가 다시 시작해야 함
      expect(screen.getByText('다음 차례: X')).toBeInTheDocument();
    });

    test('승리 후에도 다시 시작할 수 있다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      const resetButton = screen.getByText('다시 시작');
      
      // X 승리 시나리오
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[2]); // X - 승리
      
      expect(screen.getByText('승리자: X')).toBeInTheDocument();
      
      // 게임 리셋
      fireEvent.click(resetButton);
      
      // 게임이 초기 상태로 돌아가야 함
      expect(screen.getByText('다음 차례: X')).toBeInTheDocument();
      squares.forEach((square: HTMLElement) => {
        expect(square).toHaveTextContent('');
        expect(square).not.toHaveClass('winning');
      });
    });
  });

  describe('게임 종료 후 클릭 방지', () => {
    test('승리 후에는 클릭이 무시된다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // X 승리 시나리오
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[2]); // X - 승리
      
      expect(screen.getByText('승리자: X')).toBeInTheDocument();
      
      // 승리 후 빈 칸 클릭 시도
      fireEvent.click(squares[5]);
      
      // 칸이 비어있어야 함 (클릭이 무시됨)
      expect(squares[5]).toHaveTextContent('');
    });

    test('무승부 후에는 클릭이 무시된다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      // 무승부 시나리오 (마지막 칸만 남겨두고)
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[2]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[3]); // X
      fireEvent.click(squares[5]); // O
      fireEvent.click(squares[7]); // X
      fireEvent.click(squares[6]); // O
      fireEvent.click(squares[8]); // X - 무승부
      
      expect(screen.getByText('무승부!')).toBeInTheDocument();
      
      // 무승부 후에는 어떤 칸도 클릭되지 않아야 함
      // (이미 모든 칸이 채워진 상태이므로, 이 테스트는 주로 로직 확인용)
      const originalContent = squares.map((square: HTMLElement) => square.textContent);
      
      // 다시 클릭해봐도 변화 없어야 함
      fireEvent.click(squares[0]);
      
      squares.forEach((square: HTMLElement, index: number) => {
        expect(square.textContent).toBe(originalContent[index]);
      });
    });
  });

  describe('접근성', () => {
    test('게임 보드의 모든 칸이 버튼이다', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      squares.forEach((square: HTMLElement) => {
        expect(square.tagName).toBe('BUTTON');
      });
    });

    test('상태 정보가 텍스트로 제공된다', () => {
      render(<App />);
      
      // 초기 상태
      expect(screen.getByText('다음 차례: X')).toBeInTheDocument();
      
      const squares = screen.getAllByRole('button').filter((button: HTMLElement) => 
        button.className.includes('square')
      );
      
      fireEvent.click(squares[0]);
      expect(screen.getByText('다음 차례: O')).toBeInTheDocument();
    });
  });
}); 