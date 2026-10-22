import type { CardType } from '@/types/game';

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/** In-place Fisher-Yates — returns the same array for composability. */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Generates a shuffled deck of `gridSize` cards (gridSize / 2 matched pairs). */
export function generateDeck(gridSize: number): CardType[] {
  const pairs = gridSize / 2;
  const deck: CardType[] = [];

  for (let i = 0; i < pairs; i++) {
    deck.push(
      { id: `card-${i}-a`, symbolId: i, isFlipped: false, isMatched: false },
      { id: `card-${i}-b`, symbolId: i, isFlipped: false, isMatched: false },
    );
  }

  return shuffleArray(deck);
}

/**
 * Pure "La Revuelta" transformer — shuffles only unmatched cards and returns
 * a new array. Matched cards remain in place. All unmatched cards are reset
 * face-down.
 *
 * SRP: lives here (data transformation), not inside the hook (React state).
 */
export function applyShuffleModifier(cards: CardType[]): CardType[] {
  const unmatched = shuffleArray(cards.filter(c => !c.isMatched));
  let i = 0;
  return cards.map(card =>
    card.isMatched ? card : { ...unmatched[i++], isFlipped: false },
  );
}
