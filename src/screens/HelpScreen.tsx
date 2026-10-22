import React, { useCallback, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import type { AppTheme } from '@/config/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type HelpItem =
  | { type: 'text';    body: string }
  | { type: 'row';     label: string; value: string }
  | { type: 'formula'; steps: { symbol: string; desc: string }[] }
  | { type: 'tip';     body: string };

interface HelpSection { id: string; emoji: string; title: string; items: HelpItem[] }

export default function HelpScreen() {
  const theme    = useTheme();
  const router   = useRouter();
  const { t }    = useTranslation();
  const [openId, setOpenId] = useState<string | null>('basics');

  const s = (id: string) => `help.sections.${id}` as const;

  const SECTIONS: HelpSection[] = [
    {
      id: 'basics', emoji: '🧠', title: t(`${s('basics')}.title`),
      items: [
        { type: 'text', body: t(`${s('basics')}.p1`) },
        { type: 'text', body: t(`${s('basics')}.p2`) },
      ],
    },
    {
      id: 'grids', emoji: '🔲', title: t(`${s('grids')}.title`),
      items: [
        { type: 'row',  label: t(`${s('grids')}.r1.label`), value: t(`${s('grids')}.r1.value`) },
        { type: 'row',  label: t(`${s('grids')}.r2.label`), value: t(`${s('grids')}.r2.value`) },
        { type: 'row',  label: t(`${s('grids')}.r3.label`), value: t(`${s('grids')}.r3.value`) },
        { type: 'text', body:  t(`${s('grids')}.note`) },
      ],
    },
    {
      id: 'modes', emoji: '🎮', title: t(`${s('modes')}.title`),
      items: [
        { type: 'row',  label: t(`${s('modes')}.r1.label`), value: t(`${s('modes')}.r1.value`) },
        { type: 'row',  label: t(`${s('modes')}.r2.label`), value: t(`${s('modes')}.r2.value`) },
        { type: 'row',  label: t(`${s('modes')}.r3.label`), value: t(`${s('modes')}.r3.value`) },
        { type: 'tip',  body:  t(`${s('modes')}.tip`) },
      ],
    },
    {
      id: 'modifiers', emoji: '⚡', title: t(`${s('modifiers')}.title`),
      items: [
        { type: 'row',  label: t(`${s('modifiers')}.r1.label`), value: t(`${s('modifiers')}.r1.value`) },
        { type: 'row',  label: t(`${s('modifiers')}.r2.label`), value: t(`${s('modifiers')}.r2.value`) },
        { type: 'text', body:  t(`${s('modifiers')}.note`) },
      ],
    },
    {
      id: 'combos', emoji: '🔥', title: t(`${s('combos')}.title`),
      items: [
        { type: 'text', body:  t(`${s('combos')}.intro`) },
        { type: 'row',  label: t(`${s('combos')}.r1.label`), value: t(`${s('combos')}.r1.value`) },
        { type: 'row',  label: t(`${s('combos')}.r2.label`), value: t(`${s('combos')}.r2.value`) },
        { type: 'row',  label: t(`${s('combos')}.r3.label`), value: t(`${s('combos')}.r3.value`) },
        { type: 'text', body:  t(`${s('combos')}.note`) },
      ],
    },
    {
      id: 'score', emoji: '⭐', title: t(`${s('score')}.title`),
      items: [
        { type: 'text', body: t(`${s('score')}.intro`) },
        {
          type: 'formula',
          steps: [
            { symbol: t(`${s('score')}.f1.symbol`), desc: t(`${s('score')}.f1.desc`) },
            { symbol: t(`${s('score')}.f2.symbol`), desc: t(`${s('score')}.f2.desc`) },
            { symbol: t(`${s('score')}.f3.symbol`), desc: t(`${s('score')}.f3.desc`) },
            { symbol: t(`${s('score')}.f4.symbol`), desc: t(`${s('score')}.f4.desc`) },
            { symbol: t(`${s('score')}.f5.symbol`), desc: t(`${s('score')}.f5.desc`) },
          ],
        },
        { type: 'tip', body: t(`${s('score')}.tip`) },
      ],
    },
    {
      id: 'ranking', emoji: '🏆', title: t(`${s('ranking')}.title`),
      items: [
        { type: 'text', body: t(`${s('ranking')}.p1`) },
        { type: 'text', body: t(`${s('ranking')}.p2`) },
        { type: 'tip',  body: t(`${s('ranking')}.tip`) },
      ],
    },
  ];

  const goBack = useCallback(
    () => router.canGoBack() ? router.back() : router.replace('/'),
    [router],
  );

  function toggle(id: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId(prev => prev === id ? null : id);
  }

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.menuBg }]}>
      <Header
        title={t('help.title')}
        subtitle={t('help.subtitle')}
        style={styles.header}
        rightAction={
          <Pressable onPress={goBack} style={[styles.backBtn, { borderColor: theme.primary }]}>
            <Text style={[styles.backBtnText, { color: theme.primary }]}>{t('common.back')}</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section) => (
          <Accordion
            key={section.id}
            section={section}
            open={openId === section.id}
            onToggle={() => toggle(section.id)}
            theme={theme}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Accordion({ section, open, onToggle, theme }: {
  section: HelpSection; open: boolean; onToggle: () => void; theme: AppTheme;
}) {
  return (
    <View style={[styles.accordion, { backgroundColor: theme.surface }]}>
      <Pressable onPress={onToggle} style={styles.accordionHeader}>
        <Text style={styles.accordionEmoji}>{section.emoji}</Text>
        <Text style={[styles.accordionTitle, { color: theme.text }]}>{section.title}</Text>
        <Text style={[styles.chevron, { color: theme.textMuted }]}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      {open && (
        <View style={[styles.accordionBody, { borderTopColor: theme.chip }]}>
          {section.items.map((item, i) => (
            <HelpItemView key={i} item={item} theme={theme} />
          ))}
        </View>
      )}
    </View>
  );
}

function HelpItemView({ item, theme }: { item: HelpItem; theme: AppTheme }) {
  switch (item.type) {
    case 'text':
      return <Text style={[styles.itemText, { color: theme.textMuted }]}>{item.body}</Text>;
    case 'row':
      return (
        <View style={styles.itemRow}>
          <Text style={[styles.itemRowLabel, { color: theme.text }]}>{item.label}</Text>
          <Text style={[styles.itemRowValue, { color: theme.textMuted }]}>{item.value}</Text>
        </View>
      );
    case 'formula':
      return (
        <View style={[styles.formulaBox, { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
          {item.steps.map((step, i) => (
            <View key={i} style={styles.formulaRow}>
              <Text style={[styles.formulaSymbol, { color: theme.primary }]}>{step.symbol}</Text>
              <Text style={[styles.formulaDesc,   { color: theme.textMuted }]}>{step.desc}</Text>
            </View>
          ))}
        </View>
      );
    case 'tip':
      return (
        <View style={[styles.tipBox, { backgroundColor: theme.primarySoft }]}>
          <Text style={[styles.tipText, { color: theme.primary }]}>💡 {item.body}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  page:    { flex: 1 },
  header:  { paddingHorizontal: 24, paddingTop: 16 },
  content: { padding: 24, paddingBottom: 48, gap: 10 },

  backBtn:     { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1.5 },
  backBtnText: { fontSize: 14, fontWeight: '600' },

  accordion:       { borderRadius: 16, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 10 },
  accordionEmoji:  { fontSize: 20 },
  accordionTitle:  { flex: 1, fontSize: 16, fontWeight: '700' },
  chevron:         { fontSize: 11 },
  accordionBody:   { paddingHorizontal: 16, paddingBottom: 16, gap: 8, borderTopWidth: 1 },

  itemText:      { fontSize: 14, lineHeight: 22, marginTop: 4 },
  itemRow:       { flexDirection: 'row', gap: 8, marginTop: 2 },
  itemRowLabel:  { fontSize: 14, fontWeight: '600', flexShrink: 0 },
  itemRowValue:  { flex: 1, fontSize: 14, lineHeight: 20 },

  formulaBox:    { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8, marginTop: 4 },
  formulaRow:    { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  formulaSymbol: { fontSize: 13, fontWeight: '700', width: 100, flexShrink: 0 },
  formulaDesc:   { flex: 1, fontSize: 12, lineHeight: 18 },

  tipBox:  { borderRadius: 10, padding: 12, marginTop: 4 },
  tipText: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
});
