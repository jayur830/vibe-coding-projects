import React from 'react';
import type { Position } from '../types/game';
import { gameStyles } from '../styles/gameStyles';

interface GameHeaderProps {
  score: number;
  snake: Position[];
  food: Position;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ score, snake, food }) => {
  const snakeHead = snake[0];
  
  return (
    <div style={gameStyles.header}>
      <h1 style={gameStyles.title}>스네이크 게임</h1>
      <div style={gameStyles.score}>점수: {score}</div>
      <div style={gameStyles.debug}>
        뱀 위치: ({snakeHead?.x}, {snakeHead?.y}) | 음식: ({food.x}, {food.y}) | 길이: {snake.length}
      </div>
    </div>
  );
}; 