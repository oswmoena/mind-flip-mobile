import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';

const CONFETTI_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#FBBF24', '#06B6D4',
];
const PARTICLE_COUNT = 60;

const WIN_TEXT_SHADOW = Platform.select({
  web:     { textShadow: '0px 2px 8px rgba(0,0,0,0.2)' } as object,
  default: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});

interface ParticleData {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  driftX: number;
  finalRotation: number;
  width: number;
  height: number;
}

interface ConfettiParticleProps {
  data: ParticleData;
  screenHeight: number;
}

const ConfettiParticle = React.memo(function ConfettiParticle({
  data,
  screenHeight,
}: ConfettiParticleProps) {
  const translateY = useSharedValue(-40);
  const translateX = useSharedValue(0);
  const rotation   = useSharedValue(0);
  const opacity    = useSharedValue(0);

  useEffect(() => {
    opacity.value    = withDelay(data.delay, withTiming(1,                  { duration: 120 }));
    translateY.value = withDelay(data.delay, withTiming(screenHeight + 40,  { duration: data.duration }));
    translateX.value = withDelay(data.delay, withTiming(data.driftX,        { duration: data.duration }));
    rotation.value   = withDelay(data.delay, withTiming(data.finalRotation, { duration: data.duration }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left:            data.x,
          width:           data.width,
          height:          data.height,
          backgroundColor: data.color,
          borderRadius:    data.height > data.width ? 2 : data.width / 2,
        },
        animStyle,
      ]}
    />
  );
});

interface ConfettiOverlayProps {
  moves: number;
  onBack: () => void;
  isJustInTime?: boolean;
  score?: number;
  onSaveScore?: (name: string) => void;
}

export function ConfettiOverlay({ moves, onBack, isJustInTime = false, score, onSaveScore }: ConfettiOverlayProps) {
  const theme      = useTheme();
  const { t }      = useTranslation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [playerName, setPlayerName] = useState('');
  const [isSaved,    setIsSaved]    = useState(false);

  function handleSave() {
    const trimmed = playerName.trim();
    if (!trimmed || !onSaveScore) return;
    onSaveScore(trimmed);
    setIsSaved(true);
  }

  const particles = useMemo<ParticleData[]>(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const w = 7 + Math.floor(Math.random() * 9);
      return {
        id:            i,
        x:             Math.random() * screenWidth,
        color:         CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay:         Math.random() * 700,
        duration:      2000 + Math.random() * 1500,
        driftX:        (Math.random() - 0.5) * 150,
        finalRotation: Math.random() * 720 - 360,
        width:         w,
        height:        Math.random() > 0.5 ? w : Math.round(w * 1.8),
      };
    }),
  [screenWidth]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.backdrop]}>
      {particles.map(p => (
        <ConfettiParticle key={p.id} data={p} screenHeight={screenHeight} />
      ))}

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={styles.trophy}>{isJustInTime ? '🎯' : '🏆'}</Text>
        <Text style={[styles.title, { color: theme.text }, WIN_TEXT_SHADOW]}>
          {isJustInTime ? t('confetti.justInTime') : t('confetti.win')}
        </Text>
        {isJustInTime && (
          <Text style={[styles.justInTimeLabel, { color: theme.primary }]}>
            {t('confetti.justInTimeSub')}
          </Text>
        )}
        <Text style={[styles.movesLabel, { color: theme.textMuted }]}>
          {t('confetti.move', { count: moves })}
        </Text>
        {score !== undefined && (
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreLabel, { color: theme.textMuted }]}>{t('confetti.scoreLabel')}</Text>
            <Text style={[styles.scoreValue, { color: theme.primary }]}>
              {score.toLocaleString()}
            </Text>
          </View>
        )}

        {score !== undefined && onSaveScore && (
          isSaved ? (
            <View style={[styles.savedBadge, { backgroundColor: theme.primarySoft }]}>
              <Text style={[styles.savedText, { color: theme.primary }]}>{t('confetti.saved')}</Text>
            </View>
          ) : (
            <View style={styles.saveRow}>
              <TextInput
                style={[styles.nameInput, { backgroundColor: theme.surface, borderColor: theme.primary, color: theme.text }]}
                placeholder={t('confetti.namePlaceholder')}
                placeholderTextColor={theme.textMuted}
                value={playerName}
                onChangeText={setPlayerName}
                maxLength={20}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              <Pressable
                onPress={handleSave}
                disabled={!playerName.trim()}
                style={[styles.saveBtn, { backgroundColor: theme.primary, opacity: playerName.trim() ? 1 : 0.4 }]}
              >
                <Text style={styles.saveBtnText}>{t('confetti.saveButton')}</Text>
              </Pressable>
            </View>
          )
        )}

        <Pressable onPress={onBack} style={[styles.button, { backgroundColor: theme.primary }]}>
          <Text style={styles.buttonText}>{t('confetti.backButton')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent:  'center',
    alignItems:      'center',
    padding:         24,
  },
  particle: {
    position: 'absolute',
    top:      0,
  },
  card: {
    borderRadius:    24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems:      'center',
    width:           '100%',
    maxWidth:        340,
    gap:             6,
  },
  trophy:           { fontSize: 56, marginBottom: 4 },
  title:            { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  justInTimeLabel:  { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  movesLabel:  { fontSize: 16, marginBottom: 8 },
  scoreRow:    { alignItems: 'center', marginTop: 4 },
  scoreLabel:  { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  scoreValue:  { fontSize: 32, fontWeight: '900', marginTop: 2 },

  saveRow: {
    flexDirection: 'row', gap: 8, width: '100%', marginTop: 8,
  },
  nameInput: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 1.5, fontSize: 14,
  },
  saveBtn: {
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 10, justifyContent: 'center',
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },

  savedBadge: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, marginTop: 8 },
  savedText:  { fontSize: 13, fontWeight: '700' },

  button: {
    marginTop:       20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius:    12,
  },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
});
