import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { setLanguage, type Language } from '../i18n';
import { useTheme } from '@/hooks/useTheme';

export function LanguageToggle() {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const current = i18n.language as Language;

  return (
    <Pressable
      onPress={() => setLanguage(current === 'es' ? 'en' : 'es')}
      style={[styles.button, { backgroundColor: theme.chip }]}
      hitSlop={8}
    >
      <Text style={[styles.label, { color: theme.textMuted }]}>
        {current === 'es' ? 'EN' : 'ES'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
});
