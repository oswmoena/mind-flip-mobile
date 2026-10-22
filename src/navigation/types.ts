import type { NativeStackScreenProps } from 'expo-router';
import type { GameMode } from '../types/game';

/**
 * Params serialized como strings porque expo-router los transporta via URL.
 * Parsear en GameScreen con parseInt / comparación de string.
 */
export type GameScreenParams = {
  gridSize: string;
  mode: GameMode;
  hasShuffleModifier: string; // 'true' | 'false'
  maxTime?: string;            // seconds, only present for TIME_ATTACK
  maxMoves?: string;           // move limit, only present for LIMITED_MOVES
  scoringEnabled?: string;     // 'true' | 'false'
};

export type RootStackParamList = {
  index: undefined;
  game: GameScreenParams;
  ranking: undefined;
  legal: undefined;
  help: undefined;
};

// Typed screen prop shortcuts used by each screen component.
export type MenuScreenProps = NativeStackScreenProps<RootStackParamList, 'index'>;
export type GameScreenNavProps = NativeStackScreenProps<RootStackParamList, 'game'>;

// Note: expo-router declares ReactNavigation.RootParamList as a `type` (not an
// interface), so merging is not possible. Each screen passes RootStackParamList
// explicitly to useNavigation<NativeStackNavigationProp<RootStackParamList, ...>>
// to achieve the same compile-time safety without global augmentation.
