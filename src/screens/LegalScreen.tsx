import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import type { AppTheme } from '@/config/theme';

const DEVELOPER = 'PurePlay Games';
const EMAIL     = 'o.moena.salgado@gmail.com';
const APP_NAME  = 'Mind Flip';

export default function LegalScreen() {
  const theme  = useTheme();
  const router = useRouter();
  const { t }  = useTranslation();

  const date     = t('legal.updatedAt');
  const goBack   = useCallback(
    () => router.canGoBack() ? router.back() : router.replace('/'),
    [router],
  );

  const tv = (key: string) => t(key as never, { date, name: DEVELOPER, email: EMAIL, app: APP_NAME });

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.menuBg }]}>
      <Header
        title={t('legal.title')}
        style={styles.header}
        rightAction={
          <Pressable onPress={goBack} style={[styles.backBtn, { borderColor: theme.primary }]}>
            <Text style={[styles.backBtnText, { color: theme.primary }]}>{t('common.back')}</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Section title={tv('legal.privacy.heading')} theme={theme}>
          <Paragraph theme={theme}>{tv('legal.privacy.updated')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.privacy.s1h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.privacy.s1b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.privacy.s2h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.privacy.s2b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.privacy.s3h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.privacy.s3b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.privacy.s4h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.privacy.s4b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.privacy.s5h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.privacy.s5b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.privacy.s6h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.privacy.s6b')}</Paragraph>
        </Section>

        <Section title={tv('legal.terms.heading')} theme={theme}>
          <Paragraph theme={theme}>{tv('legal.terms.updated')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.terms.s1h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.terms.s1b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.terms.s2h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.terms.s2b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.terms.s3h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.terms.s3b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.terms.s4h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.terms.s4b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.terms.s5h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.terms.s5b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.terms.s6h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.terms.s6b')}</Paragraph>
          <SubHeading theme={theme}>{tv('legal.terms.s7h')}</SubHeading>
          <Paragraph theme={theme}>{tv('legal.terms.s7b')}</Paragraph>
        </Section>

        <Text style={[styles.footer, { color: theme.textSubtle }]}>
          {t('legal.copyright', { year: new Date().getFullYear(), name: DEVELOPER, app: APP_NAME })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children, theme }: { title: string; children: React.ReactNode; theme: AppTheme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>{children}</View>
    </View>
  );
}

function SubHeading({ children, theme }: { children: React.ReactNode; theme: AppTheme }) {
  return <Text style={[styles.subHeading, { color: theme.text }]}>{children}</Text>;
}

function Paragraph({ children, theme }: { children: React.ReactNode; theme: AppTheme }) {
  return <Text style={[styles.paragraph, { color: theme.textMuted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  page:    { flex: 1 },
  header:  { paddingHorizontal: 24, paddingTop: 16 },
  content: { padding: 24, paddingBottom: 48 },

  backBtn:     { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1.5 },
  backBtnText: { fontSize: 14, fontWeight: '600' },

  section:      { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  sectionCard:  { borderRadius: 16, padding: 20, gap: 4 },

  subHeading: { fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 2 },
  paragraph:  { fontSize: 14, lineHeight: 22 },

  footer: { fontSize: 11, textAlign: 'center', marginTop: 8 },
});
