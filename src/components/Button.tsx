import { useTheme } from '@/hooks/useTheme';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, style, ...props }: ButtonProps) {
  const theme = useTheme();
  return (
    <Pressable style={[styles.button, { backgroundColor: theme.primary }, style]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: { color: '#ffffff', fontWeight: '700' },
});
