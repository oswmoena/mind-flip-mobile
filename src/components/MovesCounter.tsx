import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface MovesCounterProps {
  remaining: number;
  maxMoves: number;
  active?: boolean;
}

const BLUE  = '#3B82F6';
const AMBER = '#F97316';
const RED   = '#EF4444';

export function MovesCounter({ remaining, maxMoves, active = true }: MovesCounterProps) {
  const opacity   = useSharedValue(1);
  const colorProg = useSharedValue(0); // 0 = blue · 1 = red

  // Start or stop pulse based on active
  useEffect(() => {
    if (active) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 450 }),
          withTiming(1,   { duration: 450 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [active, opacity]);

  // Shift color as remaining decreases
  useEffect(() => {
    const progress = maxMoves > 0 ? 1 - remaining / maxMoves : 1;
    colorProg.value = withTiming(Math.min(1, Math.max(0, progress)), { duration: 400 });
  }, [remaining, maxMoves, colorProg]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    color: interpolateColor(colorProg.value, [0, 0.5, 1], [BLUE, AMBER, RED]),
  }));

  return (
    <Animated.Text style={[{ fontSize: 16, fontWeight: '700' }, animStyle]}>
      {Math.max(0, remaining)} mov
    </Animated.Text>
  );
}
