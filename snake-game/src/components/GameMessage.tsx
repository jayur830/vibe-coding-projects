import React from 'react';
import { gameStyles } from '../styles/gameStyles';

interface GameMessageProps {
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
}

export const GameMessage: React.FC<GameMessageProps> = ({ gameStarted, gameOver, score }) => {
  return (
    <div style={gameStyles.message}>
      {!gameStarted && !gameOver && (
        <div>
          <p style={gameStyles.messageText}>스페이스바를 눌러 게임을 시작하세요!</p>
          <p style={gameStyles.subText}>방향키로 뱀을 조작하세요</p>
        </div>
      )}

      {gameOver && (
        <div>
          <p style={gameStyles.gameOverTitle}>게임 오버!</p>
          <p style={gameStyles.messageText}>최종 점수: {score}</p>
          <p style={gameStyles.subText}>스페이스바를 눌러 다시 시작하세요</p>
        </div>
      )}

      {gameStarted && !gameOver && (
        <div style={gameStyles.subText}>
          <p>방향키: 이동</p>
          <p>목표: 빨간 음식을 먹어 점수를 올리세요!</p>
        </div>
      )}
    </div>
  );
}; 