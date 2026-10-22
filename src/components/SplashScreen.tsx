import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';

interface SplashScreenProps {
  visible: boolean;
  onHidden: () => void;
}

export function SplashScreen({ visible, onHidden }: SplashScreenProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!visible) {
      opacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) runOnJS(onHidden)();
      });
    }
  }, [visible, opacity, onHidden]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.container, animStyle]} pointerEvents="none">
      <View style={styles.brandContainer}>
        <Text style={styles.title}>SoloJugar</Text>

        <View style={styles.badgeContainer}>
          <Text style={styles.flagEmoji}>🇨🇱</Text>
          <Text style={styles.badgeText}>DESARROLLADO EN CHILE</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F172A',
    justifyContent:  'center',
    alignItems:      'center',
    zIndex:          999,
  },
  brandContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize:      36,
    fontWeight:    'bold',
    color:         '#FFFFFF',
    letterSpacing: 1.2,
    marginBottom:  16,
  },
  badgeContainer: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical:  6,
    borderRadius:     20,
    borderWidth:      1,
    borderColor:      'rgba(255, 255, 255, 0.15)',
    gap:              8,
  },
  flagEmoji: {
    fontSize: 16,
  },
  badgeText: {
    color:         '#94A3B8',
    fontSize:      11,
    fontWeight:    '600',
    letterSpacing: 1,
  },
});
