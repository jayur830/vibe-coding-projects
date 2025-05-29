import { useSnakeGame } from '../hooks/useSnakeGame';
import { GameHeader } from './GameHeader';
import { GameGrid } from './GameGrid';
import { GameMessage } from './GameMessage';
import { gameStyles } from '../styles/gameStyles';

export default function SnakeGame() {
  const {
    snake,
    food,
    gameOver,
    score,
    gameStarted,
  } = useSnakeGame();

  return (
    <div style={gameStyles.container}>
      <GameHeader score={score} snake={snake} food={food} />
      <GameGrid snake={snake} food={food} />
      <GameMessage gameStarted={gameStarted} gameOver={gameOver} score={score} />
    </div>
  );
} 