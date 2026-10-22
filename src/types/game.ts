export interface CardType {
  id: string;
  symbolId: number;
  isFlipped: boolean;
  isMatched: boolean;
  isExpired?: boolean;
}

export type GameMode = 'CLASSIC' | 'TIME_ATTACK' | 'LIMITED_MOVES';
