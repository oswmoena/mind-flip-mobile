import { useTheme } from '@/hooks/useTheme';
import {
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
  rightSubtitle?: string;
  rightSubtitleNode?: React.ReactNode;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
};

export function Header({
  title,
  subtitle,
  rightSubtitle,
  rightSubtitleNode,
  rightAction,
  style,
  titleStyle,
  subtitleStyle,
}: HeaderProps) {
  const theme = useTheme();
  const hasSubtitleRow = subtitle || rightSubtitle || rightSubtitleNode;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }, titleStyle]}>{title}</Text>
        {rightAction}
      </View>
      {hasSubtitleRow ? (
        <View style={styles.subtitleRow}>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textMuted }, subtitleStyle]}>
              {subtitle}
            </Text>
          ) : <View />}
          {rightSubtitle ? (
            <Text style={[styles.subtitle, styles.subtitleRight, { color: theme.primary }, subtitleStyle]}>
              {rightSubtitle}
            </Text>
          ) : rightSubtitleNode ?? null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { marginBottom: 24 },
  titleRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title:       { fontSize: 28, fontWeight: '800' },
  subtitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  subtitle:    { fontSize: 16 },
  subtitleRight: { fontWeight: '700' },
});
