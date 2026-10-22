import type { GameMode } from "../types/game";

// Web stub — expo-sqlite no está disponible en web.
// Metro resuelve este archivo en lugar de dbService.ts cuando el target es web.

export interface UserRecord {
  id?: number;
  gameMode: "CLASSIC" | "TIME_ATTACK" | "LIMITED_MOVES";
  gridSize: number;
  bestScore: number;
  updatedAt: string;
}

export interface RankingEntry {
  id?: number;
  name: string;
  score: number;
  grid_size: number;
  mode: GameMode;
  moves: number;
  max_combo: number;
  created_at: string;
}

export const initDatabase    = async (): Promise<null>       => null;
export const saveRecord      = async (_db: null, _record: UserRecord): Promise<void> => {};
export const getVerifiedRecords = async (_db: null): Promise<UserRecord[]> => [];

export const saveRankingEntry  = async (_entry: Omit<RankingEntry, "id">): Promise<void> => {};
export const getTopRankings    = async (_mode: GameMode, _gridSize: number): Promise<RankingEntry[]> => [];

export const rankingAvailable = false;
