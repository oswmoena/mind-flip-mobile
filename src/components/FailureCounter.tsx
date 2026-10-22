import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

// 5 failures allowed; the 5th triggers the shuffle.
const ALLOWED_FAILURES = 5;

// Color ramp: index = current failure count (0 = neutral, 5 = all-red danger).
const FAILURE_COLORS = [
  '#9ca3af', // 0 – gray   (neutral)
  '#eab308', // 1 – yellow
  '#f59e0b', // 2 – amber
  '#f97316', // 3 – orange
  '#ef4444', // 4 – red
  '#dc2626', // 5 – deep red (shuffle incoming!)
] as const;

interface FailureCounterProps {
  failures: number;
}

function FailureCounterComponent({ failures }: FailureCounterProps) {
  const theme   = useTheme();
  const opacity = useSharedValue(1);
  const prevRef = useRef(failures);

  useEffect(() => {
    const prev      = prevRef.current;
    prevRef.current = failures;

    // Blink only when failures increment, not when they reset to 0 after shuffle.
    if (failures <= prev) return;

    opacity.value = withSequence(
      withTiming(0.1, { duration: 70 }),
      withTiming(1,   { duration: 70 }),
      withTiming(0.1, { duration: 70 }),
      withTiming(1,   { duration: 100 }),
    );
  }, [failures, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const color = FAILURE_COLORS[Math.min(failures, ALLOWED_FAILURES)];

  return (
    <Animated.View style={[styles.row, animStyle]}>
      <Text style={[styles.label, { color }]}>Revuelta</Text>
      <View style={styles.dots}>
        {Array.from({ length: ALLOWED_FAILURES }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i < failures ? color : theme.separator },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export const FailureCounter = React.memo(FailureCounterComponent);

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 4, gap: 10 },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  dots:  { flexDirection: 'row', gap: 6 },
  dot:   { width: 11, height: 11, borderRadius: 6 },
});
