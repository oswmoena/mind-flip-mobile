import { useEffect } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface ComboToastProps {
  combo: number;
  onDone: () => void;
}

const COMBO_TEXT_SHADOW = Platform.select({
  web:     { textShadow: '0px 3px 10px rgba(0,0,0,0.55)' } as object,
  default: {
    textShadowColor:  'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
});

export function ComboToast({ combo, onDone }: ComboToastProps) {
  const { t }   = useTranslation();
  const opacity = useSharedValue(0);
  const scale      = useSharedValue(0.6);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Fade in → hold → fade out
    opacity.value = withSequence(
      withTiming(1,   { duration: 180 }),
      withDelay(520, withTiming(0, { duration: 300 })),
    );
    // Pop scale
    scale.value = withSequence(
      withTiming(1.18, { duration: 150 }),
      withTiming(1.0,  { duration: 80 }),
    );
    // Float up when fading out, notify done on finish
    translateY.value = withDelay(
      700,
      withTiming(-55, { duration: 300 }, (finished) => {
        if (finished) runOnJS(onDone)();
      }),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = combo === 2 ? t('combo.first') : t('combo.nth', { n: combo - 1 });

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animStyle]} pointerEvents="none">
      <Text style={[styles.text, COMBO_TEXT_SHADOW]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position:  'absolute',
    alignSelf: 'center',
    top:       '42%',
    zIndex:    50,
  },
  text: {
    fontSize:   38,
    fontWeight: '900',
    color:      '#F59E0B',
    letterSpacing: 1,
  },
});
