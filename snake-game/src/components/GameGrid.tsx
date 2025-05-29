import React from 'react';
import type { Position } from '../types/game';
import { GAME_CONFIG } from '../types/game';
import { gameStyles, getCellStyle } from '../styles/gameStyles';

interface GameGridProps {
  snake: Position[];
  food: Position;
}

const GameCell: React.FC<{
  x: number;
  y: number;
  snake: Position[];
  food: Position;
}> = ({ x, y, snake, food }) => {
  const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
  const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
  const isFood = food.x === x && food.y === y;

  return (
    <div
      key={`${x}-${y}`}
      style={getCellStyle(isSnakeHead, isSnakeBody, isFood)}
    />
  );
};

export const GameGrid: React.FC<GameGridProps> = ({ snake, food }) => {
  return (
    <div style={gameStyles.grid}>
      {Array.from({ length: GAME_CONFIG.GRID_SIZE }, (_, y) =>
        Array.from({ length: GAME_CONFIG.GRID_SIZE }, (_, x) => (
          <GameCell key={`${x}-${y}`} x={x} y={y} snake={snake} food={food} />
        ))
      )}
    </div>
  );
}; 