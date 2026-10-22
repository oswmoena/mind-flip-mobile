import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';

export function ThemeToggle() {
  const theme = useTheme();
  const { isDark, toggleTheme } = useAppStore();

  return (
    <Pressable
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: theme.chip }]}
      hitSlop={8}
    >
      <FontAwesome5
        name={isDark ? 'sun' : 'moon'}
        size={15}
        color={isDark ? '#f59e0b' : theme.textMuted}
        solid
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
