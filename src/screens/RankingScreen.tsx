import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { getTopRankings, rankingAvailable, RankingEntry } from '@/services/dbService';
import type { AppTheme } from '@/config/theme';
import type { GameMode } from '../types/game';

type GridOption = { label: string; gridSize: number };
type ModeOption = { label: string; value: GameMode };

const GRID_OPTIONS: GridOption[] = [
  { label: '4 × 4', gridSize: 16 },
  { label: '6 × 4', gridSize: 24 },
  { label: '6 × 6', gridSize: 36 },
];

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankingScreen() {
  const theme    = useTheme();
  const router   = useRouter();
  const { t, i18n } = useTranslation();

  const MODE_OPTIONS: ModeOption[] = [
    { label: t('ranking.modes.classic'),      value: 'CLASSIC'       },
    { label: t('ranking.modes.timeAttack'),   value: 'TIME_ATTACK'   },
    { label: t('ranking.modes.limitedMoves'), value: 'LIMITED_MOVES' },
  ];

  const [mode,     setMode]     = useState<GameMode>('CLASSIC');
  const [gridSize, setGridSize] = useState(16);
  const [entries,  setEntries]  = useState<RankingEntry[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    if (!rankingAvailable) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getTopRankings(mode, gridSize, 10);
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [mode, gridSize]);

  useEffect(() => { load(); }, [load]);

  const goBack = useCallback(
    () => router.canGoBack() ? router.back() : router.replace('/'),
    [router],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<RankingEntry>) => (
      <RankRow rank={index + 1} entry={item} theme={theme} locale={i18n.language} rowMeta={t('ranking.rowMeta', { moves: item.moves, combo: item.max_combo })} />
    ),
    [theme, i18n.language, t],
  );

  const keyExtractor = useCallback(
    (item: RankingEntry, index: number) => `${item.created_at}-${index}`,
    [],
  );

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.menuBg }]}>
      <Header
        title={t('ranking.title')}
        subtitle={t('ranking.subtitle')}
        rightAction={
          <Pressable onPress={goBack} style={[styles.backBtn, { borderColor: theme.primary }]}>
            <Text style={[styles.backBtnText, { color: theme.primary }]}>{t('common.back')}</Text>
          </Pressable>
        }
        style={styles.header}
      />

      <View style={styles.tabs}>
        {MODE_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setMode(opt.value)}
            style={[
              styles.tab,
              { backgroundColor: theme.chip },
              mode === opt.value && { backgroundColor: theme.primarySoft, borderColor: theme.primary },
            ]}
          >
            <Text style={[
              styles.tabLabel,
              { color: theme.textMuted },
              mode === opt.value && { color: theme.primary, fontWeight: '700' },
            ]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.gridRow}>
        {GRID_OPTIONS.map((opt) => (
          <Pressable
            key={opt.gridSize}
            onPress={() => setGridSize(opt.gridSize)}
            style={[
              styles.gridTab,
              { backgroundColor: theme.chip },
              gridSize === opt.gridSize && { backgroundColor: theme.primarySoft, borderColor: theme.primary },
            ]}
          >
            <Text style={[
              styles.gridTabLabel,
              { color: theme.textMuted },
              gridSize === opt.gridSize && { color: theme.primary, fontWeight: '700' },
            ]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {!rankingAvailable ? (
        <WebUnavailable title={t('ranking.webUnavailable.title')} desc={t('ranking.webUnavailable.desc')} theme={theme} />
      ) : loading ? (
        <ActivityIndicator style={styles.spinner} color={theme.primary} size="large" />
      ) : entries.length === 0 ? (
        <EmptyState title={t('ranking.empty.title')} desc={t('ranking.empty.desc')} theme={theme} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

function RankRow({ rank, entry, theme, locale, rowMeta }: {
  rank: number; entry: RankingEntry; theme: AppTheme; locale: string; rowMeta: string;
}) {
  const date = new Date(entry.created_at).toLocaleDateString(locale === 'es' ? 'es-CL' : 'en-US', {
    day: '2-digit', month: 'short', year: '2-digit',
  });

  return (
    <View style={[styles.row, { backgroundColor: theme.surface }]}>
      <Text style={styles.medal}>{MEDAL[rank] ?? `${rank}`}</Text>
      <View style={styles.rowMain}>
        <Text style={[styles.rowName, { color: theme.text }]} numberOfLines={1}>{entry.name}</Text>
        <Text style={[styles.rowMeta, { color: theme.textMuted }]}>{rowMeta} · {date}</Text>
      </View>
      <Text style={[styles.rowScore, { color: theme.primary }]}>{entry.score.toLocaleString()}</Text>
    </View>
  );
}

function EmptyState({ title, desc, theme }: { title: string; desc: string; theme: AppTheme }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🏅</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyDesc,  { color: theme.textMuted }]}>{desc}</Text>
    </View>
  );
}

function WebUnavailable({ title, desc, theme }: { title: string; desc: string; theme: AppTheme }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>📱</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyDesc,  { color: theme.textMuted }]}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page:   { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16 },

  backBtn:     { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1.5 },
  backBtnText: { fontSize: 14, fontWeight: '600' },

  tabs: { flexDirection: 'row', marginHorizontal: 24, marginTop: 20, gap: 8 },
  tab:  { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  tabLabel: { fontSize: 13 },

  gridRow: { flexDirection: 'row', marginHorizontal: 24, marginTop: 8, gap: 8 },
  gridTab: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 8, borderWidth: 2, borderColor: 'transparent' },
  gridTabLabel: { fontSize: 12 },

  spinner: { flex: 1 },
  list:    { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, gap: 8 },

  row:      { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, gap: 12 },
  medal:    { fontSize: 22, width: 32, textAlign: 'center' },
  rowMain:  { flex: 1 },
  rowName:  { fontSize: 15, fontWeight: '700' },
  rowMeta:  { fontSize: 11, marginTop: 2 },
  rowScore: { fontSize: 20, fontWeight: '900' },

  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 8 },
  emptyEmoji: { fontSize: 52, marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  emptyDesc:  { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
