import type { CSSProperties } from 'react';
import { GAME_CONFIG } from '../types/game';

export const COLORS = {
  BACKGROUND: '#000000',
  GRID_BACKGROUND: '#111827',
  CELL_DEFAULT: '#1f2937',
  CELL_BORDER: '#374151',
  SNAKE_HEAD: '#10b981',
  SNAKE_HEAD_BORDER: '#059669',
  SNAKE_BODY: '#34d399',
  SNAKE_BODY_BORDER: '#10b981',
  FOOD: '#ef4444',
  FOOD_BORDER: '#dc2626',
  TEXT_PRIMARY: 'white',
  TEXT_SECONDARY: '#9ca3af',
  TEXT_ERROR: '#f87171',
} as const;

export const gameStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: COLORS.BACKGROUND,
    color: COLORS.TEXT_PRIMARY,
    padding: '16px',
    fontFamily: 'Arial, sans-serif'
  } as CSSProperties,

  header: {
    marginBottom: '24px'
  } as CSSProperties,

  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px'
  } as CSSProperties,

  score: {
    fontSize: '1.25rem',
    textAlign: 'center',
    marginBottom: '8px'
  } as CSSProperties,

  debug: {
    fontSize: '0.875rem',
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: '24px'
  } as CSSProperties,

  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, 1fr)`,
    gap: '0',
    border: '4px solid white',
    backgroundColor: COLORS.GRID_BACKGROUND,
    padding: '8px',
    marginBottom: '24px'
  } as CSSProperties,

  cell: {
    width: '24px',
    height: '24px',
    boxSizing: 'border-box'
  } as CSSProperties,

  message: {
    textAlign: 'center',
    maxWidth: '400px'
  } as CSSProperties,

  messageText: {
    marginBottom: '8px',
    fontSize: '1.125rem'
  } as CSSProperties,

  subText: {
    fontSize: '0.875rem',
    color: COLORS.TEXT_SECONDARY
  } as CSSProperties,

  gameOverTitle: {
    fontSize: '1.5rem',
    color: COLORS.TEXT_ERROR,
    marginBottom: '8px'
  } as CSSProperties,
};

export const getCellStyle = (
  isSnakeHead: boolean,
  isSnakeBody: boolean,
  isFood: boolean
): CSSProperties => {
  let backgroundColor: string = COLORS.CELL_DEFAULT;
  let border = `1px solid ${COLORS.CELL_BORDER}`;
  
  if (isSnakeHead) {
    backgroundColor = COLORS.SNAKE_HEAD;
    border = `2px solid ${COLORS.SNAKE_HEAD_BORDER}`;
  } else if (isSnakeBody) {
    backgroundColor = COLORS.SNAKE_BODY;
    border = `1px solid ${COLORS.SNAKE_BODY_BORDER}`;
  } else if (isFood) {
    backgroundColor = COLORS.FOOD;
    border = `2px solid ${COLORS.FOOD_BORDER}`;
  }

  return {
    ...gameStyles.cell,
    backgroundColor,
    border,
  };
}; 