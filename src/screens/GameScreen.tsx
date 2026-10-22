import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { ComboToast } from '@/components/ComboToast';
import { MovesCounter } from '@/components/MovesCounter';
import { FailureCounter } from '@/components/FailureCounter';
import { GameBoard } from '@/components/GameBoard';
import { Header } from '@/components/Header';
import { useCountdown } from '@/hooks/useCountdown';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { calculateScore } from '../utils/scoreCalculator';
import { saveRankingEntry, rankingAvailable } from '../services/dbService';
import { useTranslation } from 'react-i18next';
import type { GameMode } from '../types/game';

const COLUMNS: Record<number, number> = { 16: 4, 24: 6, 36: 6 };
const FLIP_DURATION = 350;

const SHUFFLE_TEXT_SHADOW = Platform.select({
  web:     { textShadow: '0px 2px 6px rgba(0,0,0,0.4)' } as object,
  default: {
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});

export default function GameScreen() {
  const theme  = useTheme();
  const router = useRouter();
  const { t }  = useTranslation();

  const goBack = useCallback(
    () => router.canGoBack() ? router.back() : router.replace('/'),
    [router],
  );

  const { gridSize: gridSizeStr, mode, hasShuffleModifier, maxTime: maxTimeStr, maxMoves: maxMovesStr, scoringEnabled: scoringEnabledStr } =
    useLocalSearchParams<{
      gridSize: string;
      mode: GameMode;
      hasShuffleModifier: string;
      maxTime?: string;
      maxMoves?: string;
      scoringEnabled?: string;
    }>();

  const gridSize       = parseInt(gridSizeStr ?? '16', 10);
  const numColumns     = COLUMNS[gridSize] ?? 4;
  const shuffleActive  = hasShuffleModifier === 'true';
  const isTimeAttack   = mode === 'TIME_ATTACK';
  const isLimitedMoves = mode === 'LIMITED_MOVES';
  const maxSeconds     = parseInt(maxTimeStr  ?? '120', 10);
  const maxMoves       = parseInt(maxMovesStr ?? '30',  10);
  const scoringEnabled = scoringEnabledStr !== 'false';

  const [gameExpired,   setGameExpired]   = useState(false);
  const [movesExpired,  setMovesExpired]  = useState(false);
  const [gameWon,       setGameWon]       = useState(false);
  const [wonMoves,      setWonMoves]      = useState(0);
  const [wonScore,      setWonScore]      = useState(0);
  const [wonMaxCombo,   setWonMaxCombo]   = useState(0);
  const [toastCombo,    setToastCombo]    = useState<number | null>(null);
  const [toastKey,      setToastKey]      = useState(0);
  const timeLeftRef = useRef(maxSeconds);

  const handleMovesExpire = useCallback(() => {
    setTimeout(() => setMovesExpired(true), FLIP_DURATION + 100);
  }, []);

  const { cards, moves, consecutiveFailures, consecutiveMatches, isShuffling, handleCardClick, revealAll } =
    useMemoryGame({
      gridSize,
      onGameWin: (finalMoves, finalMaxCombo) => {
        if (scoringEnabled) {
          setWonScore(calculateScore({
            gridSize,
            moves:          finalMoves,
            mode,
            remainingTime:  isTimeAttack   ? timeLeftRef.current      : undefined,
            maxTime:        isTimeAttack   ? maxSeconds                : undefined,
            remainingMoves: isLimitedMoves ? maxMoves - finalMoves     : undefined,
            maxMoves:       isLimitedMoves ? maxMoves                  : undefined,
            shuffleEnabled: shuffleActive,
            maxCombo:       finalMaxCombo,
          }));
        }
        setWonMoves(finalMoves);
        setWonMaxCombo(finalMaxCombo);
        setGameWon(true);
      },
      shuffleEnabled: shuffleActive,
      maxMoves:       isLimitedMoves ? maxMoves          : undefined,
      onMovesExpired: isLimitedMoves ? handleMovesExpire : undefined,
    });

  const handleTimeExpire = useCallback(() => {
    revealAll();
    setTimeout(() => setGameExpired(true), FLIP_DURATION + 100);
  }, [revealAll]);

  const { timeLeft, display: timerDisplay } = useCountdown({
    seconds: maxSeconds,
    enabled: isTimeAttack && !gameExpired && !gameWon,
    onExpire: handleTimeExpire,
  });
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Trigger combo toast when consecutive matches increase
  useEffect(() => {
    if (!scoringEnabled || consecutiveMatches < 2 || gameWon) return;
    setToastCombo(consecutiveMatches);
    setToastKey(k => k + 1);
  }, [consecutiveMatches]);

  // ── Shuffle overlay ──────────────────────────────────────────────────────
  const overlayOpacity = useSharedValue(0);
  const textScale      = useSharedValue(0.6);

  useEffect(() => {
    if (isShuffling) {
      overlayOpacity.value = withTiming(1,   { duration: 200 });
      textScale.value      = withSpring(1,   { damping: 12, stiffness: 180 });
    } else {
      overlayOpacity.value = withTiming(0,   { duration: 300 });
      textScale.value      = withTiming(0.6, { duration: 200 });
    }
  }, [isShuffling, overlayOpacity, textScale]);

  const shuffleOverlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const shuffleTextStyle    = useAnimatedStyle(() => ({ transform: [{ scale: textScale.value }] }));

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.pageBg }]}>
      <Header
        title="Mind Flip"
        subtitle={t('game.moves', { count: moves })}
        rightSubtitle={isTimeAttack ? timerDisplay : undefined}
        rightSubtitleNode={
          isLimitedMoves
            ? <MovesCounter remaining={maxMoves - moves} maxMoves={maxMoves} active={!movesExpired && !gameWon} />
            : undefined
        }
        rightAction={<ThemeToggle />}
        style={styles.header}
      />

      {shuffleActive && <FailureCounter failures={consecutiveFailures} />}

      <GameBoard
        cards={cards}
        onCardPress={handleCardClick}
        numColumns={numColumns}
        isShuffling={isShuffling}
      />

      {!gameExpired && !movesExpired && !gameWon && (
        <Pressable onPress={() => goBack()} style={[styles.backButton, { borderColor: theme.primary }]}>
          <Text style={[styles.backText, { color: theme.primary }]}>{t('game.exit')}</Text>
        </Pressable>
      )}

      {/* Combo toast */}
      {toastCombo !== null && (
        <ComboToast
          key={toastKey}
          combo={toastCombo}
          onDone={() => setToastCombo(null)}
        />
      )}

      {/* Shuffle overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.shuffleOverlay, shuffleOverlayStyle, styles.noPointer]}
      >
        <Animated.Text style={[styles.shuffleText, SHUFFLE_TEXT_SHADOW, shuffleTextStyle]}>
          {t('game.shuffling')}
        </Animated.Text>
      </Animated.View>

      {/* Time-up overlay */}
      {gameExpired && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.expiredOverlay]}>
          <Text style={styles.expiredEmoji}>⏰</Text>
          <Text style={styles.expiredTitle}>{t('game.timeUp.title')}</Text>
          <Text style={styles.expiredSubtitle}>{t('game.timeUp.subtitle')}</Text>
          <Pressable onPress={() => goBack()} style={[styles.expiredButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.expiredButtonText}>{t('common.backMenu')}</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Moves-expired overlay */}
      {movesExpired && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.expiredOverlay]}>
          <Text style={styles.expiredEmoji}>🃏</Text>
          <Text style={styles.expiredTitle}>{t('game.movesUp.title')}</Text>
          <Text style={styles.expiredSubtitle}>{t('game.movesUp.subtitle')}</Text>
          <Pressable onPress={goBack} style={[styles.expiredButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.expiredButtonText}>{t('common.backMenu')}</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Win overlay */}
      {gameWon && (
        <ConfettiOverlay
          moves={wonMoves}
          onBack={goBack}
          isJustInTime={isLimitedMoves && wonMoves === maxMoves}
          score={scoringEnabled ? wonScore : undefined}
          onSaveScore={scoringEnabled && rankingAvailable ? (name) => {
            saveRankingEntry({
              name,
              score:      wonScore,
              grid_size:  gridSize,
              mode,
              moves:      wonMoves,
              max_combo:  wonMaxCombo,
              created_at: new Date().toISOString(),
            });
          } : undefined}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page:       { flex: 1 },
  header:     { paddingHorizontal: 24, paddingTop: 16 },
  backButton: {
    marginHorizontal: 24,
    marginBottom:     24,
    alignSelf:        'flex-start',
    paddingVertical:  8,
    paddingHorizontal: 16,
    borderRadius:     10,
    borderWidth:      1.5,
  },
  backText: { fontSize: 15, fontWeight: '600' },

  shuffleOverlay: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  noPointer:   { pointerEvents: 'none' },
  shuffleText: { fontSize: 36, fontWeight: '800', color: '#ffffff', letterSpacing: 0.5 },

  expiredOverlay: {
    backgroundColor: 'rgba(0,0,0,0.70)',
    justifyContent:  'center',
    alignItems:      'center',
    gap:             8,
    padding:         24,
  },
  expiredEmoji:    { fontSize: 52 },
  expiredTitle:    { fontSize: 28, fontWeight: '800', color: '#ffffff', textAlign: 'center' },
  expiredSubtitle: { fontSize: 15, color: '#e5e7eb', textAlign: 'center', marginBottom: 8 },
  expiredButton: {
    marginTop:       16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius:    12,
  },
  expiredButtonText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
});
