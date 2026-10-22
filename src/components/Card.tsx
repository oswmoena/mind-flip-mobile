import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import type { CardType } from '../types/game';

type FA5IconName = React.ComponentProps<typeof FontAwesome5>['name'];

const ICON_NAMES: FA5IconName[] = [
  'star',    'heart',   'bolt',    'moon',    'sun',
  'fire',    'leaf',    'gem',     'crown',   'rocket',
  'music',   'bell',    'flag',    'globe',   'compass',
  'anchor',  'plane',   'car',     'coffee',  'camera',
];

const FLIP_DURATION = 350;

// shadow* props are deprecated on web — use boxShadow there instead.
const FACE_SHADOW = Platform.select({
  web:     { boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.18)' },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});

interface CardSize { width: number; height: number }

interface CardProps {
  card: CardType;
  onPress: () => void;
  size?: CardSize;
  isShuffling?: boolean;
}

function CardComponent({ card, onPress, size, isShuffling }: CardProps) {
  const theme = useTheme();

  // ── Flip animation ────────────────────────────────────────────────────────
  const progress = useSharedValue(card.isFlipped || card.isMatched || card.isExpired ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(
      card.isFlipped || card.isMatched || card.isExpired ? 1 : 0,
      { duration: FLIP_DURATION },
    );
  }, [card.isFlipped, card.isMatched, card.isExpired, progress]);

  const backFaceStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(progress.value, [0, 1], [0, 180]);
    return { transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }] };
  });

  const frontFaceStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(progress.value, [0, 1], [180, 360]);
    return { transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }] };
  });

  // ── Shuffle animation ─────────────────────────────────────────────────────
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isShuffling || card.isMatched || card.isFlipped) return;
    scale.value = withSequence(
      withTiming(0.82, { duration: 100 }),
      withTiming(1.05, { duration: 120 }),
      withTiming(0.88, { duration: 90 }),
      withTiming(1.02, { duration: 80 }),
      withTiming(1,    { duration: 60 }),
    );
  }, [isShuffling, card.isMatched, card.isFlipped, scale]);

  const shuffleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const iconName = ICON_NAMES[card.symbolId % ICON_NAMES.length];
  const iconSize = size ? Math.floor(size.width * 0.38) : 28;

  const frontBg = card.isMatched ? theme.cardMatched
    : card.isExpired             ? theme.cardExpired
    : theme.cardFront;

  const iconColor = card.isMatched ? theme.cardMatchedIcon
    : card.isExpired              ? theme.cardExpiredIcon
    : theme.cardIcon;

  const containerSize = size ?? { width: 80, height: 100 };

  return (
    <Animated.View style={[styles.container, containerSize, shuffleStyle]}>
      <Pressable
        onPress={onPress}
        disabled={card.isFlipped || card.isMatched || !!card.isExpired}
        style={StyleSheet.absoluteFill}
      >
        {/* Back face */}
        <Animated.View
          style={[styles.face, FACE_SHADOW, backFaceStyle, { backgroundColor: theme.cardBack }]}
        >
          <FontAwesome5 name="question" size={iconSize} color={theme.cardBackIcon} />
        </Animated.View>

        {/* Front face */}
        <Animated.View
          style={[
            styles.face,
            FACE_SHADOW,
            frontFaceStyle,
            { backgroundColor: frontBg, opacity: card.isMatched ? 0.9 : 1 },
          ]}
        >
          <FontAwesome5 name={iconName} size={iconSize} color={iconColor} solid />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export const Card = React.memo(CardComponent);

const styles = StyleSheet.create({
  container: { margin: 6 },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
});
