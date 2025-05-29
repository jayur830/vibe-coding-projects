import type { Position, Direction } from '../types/game';
import { GAME_CONFIG } from '../types/game';

export const generateRandomFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const getNextPosition = (head: Position, direction: Direction): Position => {
  const newHead = { ...head };
  
  switch (direction) {
    case 'UP':
      newHead.y -= 1;
      break;
    case 'DOWN':
      newHead.y += 1;
      break;
    case 'LEFT':
      newHead.x -= 1;
      break;
    case 'RIGHT':
      newHead.x += 1;
      break;
  }
  
  return newHead;
};

export const isOutOfBounds = (position: Position): boolean => {
  return (
    position.x < 0 || 
    position.x >= GAME_CONFIG.GRID_SIZE || 
    position.y < 0 || 
    position.y >= GAME_CONFIG.GRID_SIZE
  );
};

export const isCollisionWithSnake = (position: Position, snake: Position[]): boolean => {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
};

export const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const isOppositeDirection = (current: Direction, next: Direction): boolean => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  
  return opposites[current] === next;
}; 