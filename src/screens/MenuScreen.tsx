import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useTheme } from '@/hooks/useTheme';
import { rankingAvailable } from '../services/dbService';
import type { AppTheme } from '@/config/theme';
import type { GameMode } from '../types/game';
import type { MenuScreenProps } from '../navigation/types';

type MenuNavigation = MenuScreenProps['navigation'];

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type GridOption = { label: string; cols: number; gridSize: number };
type ModeOption = { label: string; description: string; value: GameMode };
type TimeOption = { label: string; seconds: number };

const GRID_OPTIONS: GridOption[] = [
  { label: '4 × 4', cols: 4, gridSize: 16 },
  { label: '6 × 4', cols: 6, gridSize: 24 },
  { label: '6 × 6', cols: 6, gridSize: 36 },
];

const TIME_OPTIONS: TimeOption[] = [
  { label: '2 min',  seconds: 120 },
  { label: '5 min',  seconds: 300 },
  { label: '10 min', seconds: 600 },
];

function computeMoveSuggestions(gridSize: number): [number, number, number] {
  const min = gridSize / 2;
  return [
    Math.round(min * 1.2),
    Math.round(min * 1.4),
    Math.round(min * 1.6),
  ];
}

const TOGGLE_THUMB_SHADOW = Platform.select({
  web:     { boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)' },
  default: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
});

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function MenuScreen() {
  const theme      = useTheme();
  const navigation = useNavigation<MenuNavigation>();
  const { t }      = useTranslation();

  const MODE_OPTIONS: ModeOption[] = [
    { label: t('menu.modes.classic.label'),      description: t('menu.modes.classic.desc'),      value: 'CLASSIC'       },
    { label: t('menu.modes.timeAttack.label'),   description: t('menu.modes.timeAttack.desc'),   value: 'TIME_ATTACK'   },
    { label: t('menu.modes.limitedMoves.label'), description: t('menu.modes.limitedMoves.desc'), value: 'LIMITED_MOVES' },
  ];

  const [gridOption,         setGridOption]         = useState<GridOption>(GRID_OPTIONS[0]);
  const [mode,               setMode]               = useState<GameMode>('CLASSIC');
  const [hasShuffleModifier, setHasShuffleModifier] = useState(false);
  const [scoringEnabled,     setScoringEnabled]     = useState(true);
  const [maxTime,            setMaxTime]            = useState<TimeOption>(TIME_OPTIONS[0]);

  const minMoves        = gridOption.gridSize / 2;
  const moveSuggestions = computeMoveSuggestions(gridOption.gridSize);

  const [movesPreset,     setMovesPreset]     = useState<number | 'custom'>(moveSuggestions[0]);
  const [customMovesText, setCustomMovesText] = useState('');

  useEffect(() => {
    setMovesPreset(computeMoveSuggestions(gridOption.gridSize)[0]);
    setCustomMovesText('');
  }, [gridOption.gridSize]);

  const customMovesValue = parseInt(customMovesText, 10);
  const isCustomInvalid  = movesPreset === 'custom' && !isNaN(customMovesValue) && customMovesValue < minMoves;
  const maxMoves: number = movesPreset === 'custom'
    ? (isNaN(customMovesValue) || customMovesValue < minMoves ? minMoves : customMovesValue)
    : movesPreset;

  function handleStart() {
    navigation.navigate('game', {
      gridSize:           String(gridOption.gridSize),
      mode,
      hasShuffleModifier: String(hasShuffleModifier),
      ...(mode === 'TIME_ATTACK'    && { maxTime:  String(maxTime.seconds) }),
      ...(mode === 'LIMITED_MOVES' && { maxMoves: String(maxMoves) }),
      scoringEnabled: String(scoringEnabled),
    });
  }

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.menuBg }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header
          title={t('common.appName')}
          subtitle={t('menu.subtitle')}
          rightAction={
            <View style={styles.headerActions}>
              <LanguageToggle />
              <ThemeToggle />
            </View>
          }
        />

        <Section title={t('menu.sections.grid')} theme={theme}>
          <View style={styles.row}>
            {GRID_OPTIONS.map((opt) => (
              <Chip
                key={opt.gridSize}
                label={opt.label}
                selected={gridOption.gridSize === opt.gridSize}
                onPress={() => setGridOption(opt)}
                theme={theme}
              />
            ))}
          </View>
        </Section>

        <Section title={t('menu.sections.mode')} theme={theme}>
          {MODE_OPTIONS.map((opt) => (
            <ModeCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={mode === opt.value}
              onPress={() => setMode(opt.value)}
              theme={theme}
            />
          ))}
        </Section>

        {mode === 'TIME_ATTACK' && (
          <Section title={t('menu.sections.timeLimit')} theme={theme}>
            <View style={styles.row}>
              {TIME_OPTIONS.map((opt) => (
                <Chip
                  key={opt.seconds}
                  label={opt.label}
                  selected={maxTime.seconds === opt.seconds}
                  onPress={() => setMaxTime(opt)}
                  theme={theme}
                />
              ))}
            </View>
          </Section>
        )}

        {mode === 'LIMITED_MOVES' && (
          <Section title={t('menu.sections.movesLimit')} theme={theme}>
            <View style={styles.row}>
              {moveSuggestions.map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={String(suggestion)}
                  selected={movesPreset === suggestion}
                  onPress={() => { setMovesPreset(suggestion); setCustomMovesText(''); }}
                  theme={theme}
                  opacity={movesPreset === suggestion ? 1 : 0.4}
                />
              ))}
              <TextInput
                style={[
                  styles.chip,
                  styles.customMovesInput,
                  {
                    backgroundColor: movesPreset === 'custom' ? theme.primarySoft : theme.chip,
                    borderColor:     isCustomInvalid ? '#ef4444' : movesPreset === 'custom' ? theme.primary : 'transparent',
                    color:           movesPreset === 'custom' ? theme.primary : theme.textMuted,
                    opacity:         movesPreset === 'custom' ? 1 : 0.4,
                  },
                ]}
                placeholder={t('menu.customPlaceholder')}
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                value={customMovesText}
                maxLength={3}
                returnKeyType="done"
                onChangeText={(text) => {
                  setCustomMovesText(text.replace(/[^0-9]/g, ''));
                  setMovesPreset('custom');
                }}
                onFocus={() => setMovesPreset('custom')}
              />
            </View>
            <Text style={[styles.movesHint, { color: isCustomInvalid ? '#ef4444' : theme.textMuted }]}>
              {isCustomInvalid
                ? t('menu.movesError',  { min: minMoves })
                : t('menu.movesHint',   { min: minMoves })}
            </Text>
          </Section>
        )}

        <Section title={t('menu.sections.modifiers')} theme={theme}>
          <Pressable
            onPress={() => setHasShuffleModifier((v) => !v)}
            style={[
              styles.modifierRow,
              { backgroundColor: theme.surfaceAlt, borderColor: 'transparent' },
              hasShuffleModifier && { backgroundColor: theme.primarySoft, borderColor: theme.primary },
            ]}
          >
            <View style={styles.modifierText}>
              <Text style={[styles.modifierLabel, { color: theme.text }]}>{t('menu.modifiers.shuffle.label')}</Text>
              <Text style={[styles.modifierDesc,  { color: theme.textMuted }]}>{t('menu.modifiers.shuffle.desc')}</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: hasShuffleModifier ? theme.toggleTrackActive : theme.toggleTrack }]}>
              <View style={[styles.toggleThumb, TOGGLE_THUMB_SHADOW, { backgroundColor: theme.toggleThumb }, hasShuffleModifier && styles.toggleThumbActive]} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => setScoringEnabled((v) => !v)}
            style={[
              styles.modifierRow,
              { backgroundColor: theme.surfaceAlt, borderColor: 'transparent', marginTop: 8 },
              scoringEnabled && { backgroundColor: theme.primarySoft, borderColor: theme.primary },
            ]}
          >
            <View style={styles.modifierText}>
              <Text style={[styles.modifierLabel, { color: theme.text }]}>{t('menu.modifiers.scoring.label')}</Text>
              <Text style={[styles.modifierDesc,  { color: theme.textMuted }]}>{t('menu.modifiers.scoring.desc')}</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: scoringEnabled ? theme.toggleTrackActive : theme.toggleTrack }]}>
              <View style={[styles.toggleThumb, TOGGLE_THUMB_SHADOW, { backgroundColor: theme.toggleThumb }, scoringEnabled && styles.toggleThumbActive]} />
            </View>
          </Pressable>
        </Section>

        <Button title={t('menu.startButton')} onPress={handleStart} style={styles.startButton} />

        {rankingAvailable && (
          <Pressable onPress={() => navigation.navigate('ranking')} style={styles.rankingLink}>
            <Text style={[styles.rankingLinkText, { color: theme.textMuted }]}>
              {t('menu.rankingLink')}
            </Text>
          </Pressable>
        )}

        <View style={styles.legalFooter}>
          <Text style={[styles.legalFooterText, { color: theme.textSubtle }]}>
            {t('menu.footer.tagline')}
          </Text>
          <View style={styles.legalFooterLinks}>
            <Pressable onPress={() => navigation.navigate('help')}>
              <Text style={[styles.legalFooterLink, { color: theme.textSubtle }]}>{t('menu.footer.help')}</Text>
            </Pressable>
            <Text style={[styles.legalFooterSep, { color: theme.textSubtle }]}>·</Text>
            <Pressable onPress={() => navigation.navigate('legal')}>
              <Text style={[styles.legalFooterLink, { color: theme.textSubtle }]}>{t('menu.footer.legal')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Section({ title, children, theme }: { title: string; children: React.ReactNode; theme: AppTheme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>{title}</Text>
      {children}
    </View>
  );
}

function Chip({
  label, selected, onPress, theme, opacity = 1,
}: { label: string; selected: boolean; onPress: () => void; theme: AppTheme; opacity?: number }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: selected ? theme.primarySoft : theme.chip, borderColor: selected ? theme.primary : 'transparent', opacity }]}
    >
      <Text style={[styles.chipLabel, { color: selected ? theme.primary : theme.textMuted }]}>{label}</Text>
    </Pressable>
  );
}

function ModeCard({ label, description, selected, onPress, theme }: {
  label: string; description: string; selected: boolean; onPress: () => void; theme: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.modeCard, { backgroundColor: selected ? theme.primarySoft : theme.surfaceAlt, borderColor: selected ? theme.primary : 'transparent' }]}
    >
      <Text style={[styles.modeLabel, { color: selected ? theme.primaryBold : theme.text }]}>{label}</Text>
      <Text style={[styles.modeDesc,  { color: selected ? theme.primary : theme.textMuted }]}>{description}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  page:       { flex: 1 },
  scrollView: { flex: 1 },
  content:    { padding: 24, paddingBottom: 40 },

  headerActions: { flexDirection: 'row', gap: 8 },

  section:      { marginBottom: 28 },
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },

  row:  { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 2 },
  chipLabel:        { fontSize: 14, fontWeight: '600' },
  customMovesInput: { textAlign: 'center', fontSize: 14, fontWeight: '600' },
  movesHint:        { fontSize: 11, marginTop: 8 },

  modeCard:  { padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 2 },
  modeLabel: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  modeDesc:  { fontSize: 13 },

  modifierRow:    { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, gap: 12 },
  modifierText:   { flex: 1 },
  modifierLabel:  { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  modifierDesc:   { fontSize: 13 },

  toggle:            { width: 44, height: 24, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 2 },
  toggleThumb:       { width: 20, height: 20, borderRadius: 10 },
  toggleThumbActive: { alignSelf: 'flex-end' },

  startButton: { marginTop: 8, paddingVertical: 16 },

  rankingLink:     { alignItems: 'center', paddingVertical: 14 },
  rankingLinkText: { fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },

  legalFooter:      { alignItems: 'center', paddingTop: 8, paddingBottom: 8, gap: 6 },
  legalFooterText:  { fontSize: 11, textAlign: 'center' },
  legalFooterLinks: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legalFooterLink:  { fontSize: 11, textDecorationLine: 'underline' },
  legalFooterSep:   { fontSize: 11 },
});
