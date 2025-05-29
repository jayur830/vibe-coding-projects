// 플레이어 타입
export type Player = 'X' | 'O';

// 셀 상태 타입 (null은 빈 셀)
export type CellValue = Player | null;

// 게임 보드 타입
export type Board = CellValue[];

// 게임 상태 타입
export type GameStatus = 'playing' | 'won' | 'draw';

// 승리 정보 인터페이스
export interface WinInfo {
  winner: Player;
  winningLine: number[]; // 승리한 라인의 인덱스 배열
}

// 게임 상태 인터페이스
export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winInfo: WinInfo | null;
} 