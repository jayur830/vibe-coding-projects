export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  gameOver: boolean;
  score: number;
  gameStarted: boolean;
};

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  GAME_SPEED: 100,
  SCORE_INCREMENT: 10,
} as const;

export const INITIAL_STATE = {
  SNAKE: [{ x: 10, y: 10 }],
  FOOD: { x: 15, y: 15 },
  DIRECTION: 'RIGHT' as Direction,
} as const;

export const DIRECTION_MAP = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
} as const;

export const OPPOSITE_DIRECTIONS = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
} as const; 