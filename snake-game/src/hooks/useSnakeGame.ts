import { useState, useCallback, useEffect } from 'react';
import type { Position, Direction } from '../types/game';
import { GAME_CONFIG, INITIAL_STATE } from '../types/game';
import {
  generateRandomFood,
  getNextPosition,
  isOutOfBounds,
  isCollisionWithSnake,
  isSamePosition,
  isOppositeDirection,
} from '../utils/gameUtils';

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([...INITIAL_STATE.SNAKE]);
  const [food, setFood] = useState<Position>(INITIAL_STATE.FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_STATE.DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_STATE.DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const resetGame = useCallback(() => {
    setSnake([...INITIAL_STATE.SNAKE]);
    setFood(INITIAL_STATE.FOOD);
    setDirection(INITIAL_STATE.DIRECTION);
    setNextDirection(INITIAL_STATE.DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    if (!isOppositeDirection(direction, newDirection)) {
      setNextDirection(newDirection);
    }
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setDirection(nextDirection);

    setSnake(currentSnake => {
      const head = currentSnake[0];
      const newHead = getNextPosition(head, nextDirection);

      // 벽 충돌 체크
      if (isOutOfBounds(newHead)) {
        setGameOver(true);
        return currentSnake;
      }

      // 자기 자신과 충돌 체크
      if (isCollisionWithSnake(newHead, currentSnake)) {
        setGameOver(true);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // 음식 먹기 체크
      if (isSamePosition(newHead, food)) {
        setScore(prev => prev + GAME_CONFIG.SCORE_INCREMENT);
        setFood(generateRandomFood(newSnake));
        return newSnake; // 뱀이 길어짐
      } else {
        newSnake.pop(); // 꼬리 제거
        return newSnake;
      }
    });
  }, [nextDirection, food, gameOver, gameStarted]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    
    if (!gameStarted && e.code === 'Space') {
      startGame();
      return;
    }

    if (gameOver && e.code === 'Space') {
      resetGame();
      return;
    }

    // 방향키 처리
    const directionMap: Record<string, Direction> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
    };

    const newDirection = directionMap[e.key];
    if (newDirection) {
      changeDirection(newDirection);
    }
  }, [direction, gameOver, gameStarted, startGame, resetGame, changeDirection]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // 게임 루프
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_CONFIG.GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return {
    // 상태
    snake,
    food,
    direction,
    gameOver,
    score,
    gameStarted,
    
    // 액션
    startGame,
    resetGame,
    changeDirection,
  };
}; 