import type { GameMode } from '../types/game';

export interface ScoreParams {
  gridSize: number;
  moves: number;
  mode: GameMode;
  remainingMoves?: number;
  maxMoves?: number;
  remainingTime?: number;
  maxTime?: number;
  shuffleEnabled: boolean;
  maxCombo: number;
}

const BASE_PTS: Record<number, number> = { 16: 1000, 24: 1500, 36: 2500 };

export function calculateScore({
  gridSize, moves, mode,
  remainingMoves, maxMoves,
  remainingTime, maxTime,
  shuffleEnabled, maxCombo,
}: ScoreParams): number {
  const minMoves   = gridSize / 2;
  const basePts    = BASE_PTS[gridSize] ?? 1000;
  const efficiency = minMoves / moves;

  let modeMult = 1.0;
  if (mode === 'TIME_ATTACK' && remainingTime !== undefined && maxTime) {
    modeMult = 1 + (remainingTime / maxTime) * 0.5;
  } else if (mode === 'LIMITED_MOVES' && remainingMoves !== undefined && maxMoves) {
    modeMult = 1 + (remainingMoves / maxMoves) * 0.5;
  }

  const shuffleMult = shuffleEnabled ? 1.3 : 1.0;
  const comboMult   = 1 + Math.max(0, maxCombo - 1) * 0.1;

  return Math.floor(basePts * efficiency * modeMult * shuffleMult * comboMult);
}
