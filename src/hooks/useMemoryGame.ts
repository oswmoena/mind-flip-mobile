import { useCallback, useEffect, useRef, useState } from 'react';
import type { CardType } from '../types/game';
import { applyShuffleModifier, generateDeck } from '../utils/gameHelpers';

interface UseMemoryGameProps {
  gridSize: number;
  onGameWin: (moves: number, maxCombo: number) => void;
  shuffleEnabled?: boolean;
  maxMoves?: number;
  onMovesExpired?: () => void;
}

export function useMemoryGame({ gridSize, onGameWin, shuffleEnabled = false, maxMoves, onMovesExpired }: UseMemoryGameProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isLockboard, setIsLockboard] = useState(false);
  const [moves, setMoves] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [isShuffling,         setIsShuffling]         = useState(false);
  const [consecutiveMatches,  setConsecutiveMatches]  = useState(0);
  const [maxCombo,            setMaxCombo]            = useState(0);

  const cardsRef            = useRef(cards);
  const selectedRef         = useRef(selectedIndices);
  const lockRef             = useRef(isLockboard);
  const failuresRef         = useRef(consecutiveFailures);
  const movesRef            = useRef(moves);
  const onGameWinRef        = useRef(onGameWin);
  const maxMovesRef         = useRef(maxMoves);
  const onMovesExpiredRef   = useRef(onMovesExpired);
  const shuffleEnabledRef       = useRef(shuffleEnabled);
  const consecutiveMatchesRef   = useRef(consecutiveMatches);
  const maxComboRef             = useRef(maxCombo);

  cardsRef.current          = cards;
  selectedRef.current       = selectedIndices;
  lockRef.current           = isLockboard;
  failuresRef.current       = consecutiveFailures;
  movesRef.current          = moves;
  onGameWinRef.current      = onGameWin;
  maxMovesRef.current       = maxMoves;
  onMovesExpiredRef.current = onMovesExpired;
  shuffleEnabledRef.current     = shuffleEnabled;
  consecutiveMatchesRef.current = consecutiveMatches;
  maxComboRef.current           = maxCombo;

  const startNewGame = useCallback(() => {
    setCards(generateDeck(gridSize));
    setSelectedIndices([]);
    setIsLockboard(false);
    setMoves(0);
    setConsecutiveFailures(0);
    setIsShuffling(false);
    setConsecutiveMatches(0);
    setMaxCombo(0);
  }, [gridSize]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCardClick = useCallback((clickedIndex: number) => {
    if (lockRef.current) return;

    const current  = cardsRef.current;
    const selected = selectedRef.current;

    if (current[clickedIndex].isFlipped || current[clickedIndex].isMatched) return;
    if (selected.length === 2) return;

    const flipped = current.map((c, i) =>
      i === clickedIndex ? { ...c, isFlipped: true } : c,
    );
    setCards(flipped);

    const newSelected = [...selected, clickedIndex];
    setSelectedIndices(newSelected);

    if (newSelected.length < 2) return;

    setMoves(m => m + 1);
    setIsLockboard(true);

    const [first, second]  = newSelected;
    const isMatch          = flipped[first].symbolId === flipped[second].symbolId;
    const finalMoves       = movesRef.current + 1;
    const currentFailures  = failuresRef.current;

    if (isMatch) {
      setTimeout(() => {
        const prevCards = cardsRef.current;
        const matched = prevCards.map((c, i) =>
          i === first || i === second ? { ...c, isMatched: true } : c,
        );
        const allWon   = matched.every(c => c.isMatched);
        const isExpired = !allWon && maxMovesRef.current !== undefined && finalMoves >= maxMovesRef.current;

        if (isExpired) {
          const revealed = matched.map(c =>
            c.isMatched ? c : { ...c, isFlipped: true, isExpired: true },
          );
          setCards(revealed);
          setIsLockboard(true);
          setSelectedIndices([]);
          onMovesExpiredRef.current?.();
        } else {
          const newCombo = consecutiveMatchesRef.current + 1;
          setConsecutiveMatches(newCombo);
          setMaxCombo(prev => Math.max(prev, newCombo));
          setCards(matched);
          setSelectedIndices([]);
          setIsLockboard(false);
          setConsecutiveFailures(0);
          if (allWon) onGameWinRef.current(finalMoves, Math.max(maxComboRef.current, newCombo));
        }
      }, 600);
    } else {
      setTimeout(() => {
        const isExpired = maxMovesRef.current !== undefined && finalMoves >= maxMovesRef.current;

        if (isExpired) {
          // Reveal all without unflipping the failed pair first
          setCards(prev => prev.map(c =>
            c.isMatched ? c : { ...c, isFlipped: true, isExpired: true },
          ));
          setIsLockboard(true);
          setSelectedIndices([]);
          onMovesExpiredRef.current?.();
          return;
        }

        setCards(prev =>
          prev.map((c, i) =>
            i === first || i === second ? { ...c, isFlipped: false } : c,
          ),
        );
        setSelectedIndices([]);
        setConsecutiveMatches(0);

        const next = currentFailures + 1;

        if (shuffleEnabledRef.current && next >= 5) {
          setConsecutiveFailures(5);
          setTimeout(() => {
            setIsShuffling(true);
            setTimeout(() => {
              setCards(applyShuffleModifier);
              setTimeout(() => {
                setIsShuffling(false);
                setIsLockboard(false);
                setConsecutiveFailures(0);
              }, 600);
            }, 500);
          }, 500);
        } else {
          setIsLockboard(false);
          setConsecutiveFailures(next);
        }
      }, 1000);
    }
  }, []);

  const revealAll = useCallback(() => {
    setIsLockboard(true);
    setCards(prev =>
      prev.map(c => c.isMatched ? c : { ...c, isFlipped: true, isExpired: true }),
    );
  }, []);

  return { cards, moves, consecutiveFailures, consecutiveMatches, maxCombo, isShuffling, handleCardClick, startNewGame, revealAll };
}
