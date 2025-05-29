// 게임 위치를 나타내는 인터페이스
export interface Position {
  row: number;
  col: number;
}

// 나이트의 가능한 움직임
export interface Move {
  rowDelta: number;
  colDelta: number;
}

// 게임 상태
export type GameStatus = 'playing' | 'won' | 'stuck';

// 힌트 정보
export interface Hint {
  position: Position;
  accessibility: number;
}

// 게임 설정
export interface GameConfig {
  boardSize: number;
  initialPosition: Position;
}

// 움직임 가능성 체크 결과
export interface MovePossibility {
  position: Position;
  isValid: boolean;
  accessibility?: number;
}

// 보드 상태 - 각 셀의 방문 순서 (0은 미방문)
export type Board = number[][]; 