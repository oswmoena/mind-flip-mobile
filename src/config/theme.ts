export interface AppTheme {
  // Backgrounds
  pageBg:      string;
  menuBg:      string;
  surface:     string;
  surfaceAlt:  string;
  chip:        string;
  // Brand
  primary:     string;
  primarySoft: string;
  primaryBold: string;
  // Text
  text:        string;
  textMuted:   string;
  textSubtle:  string;
  // Separators / empty states
  separator:   string;
  // Cards
  cardBack:        string;
  cardBackIcon:    string;
  cardFront:       string;
  cardIcon:        string;
  cardMatched:     string;
  cardMatchedIcon: string;
  cardExpired:     string;
  cardExpiredIcon: string;
  // Toggle
  toggleTrack:       string;
  toggleTrackActive: string;
  toggleThumb:       string;
}

export const LIGHT_THEME: AppTheme = {
  pageBg:      '#f8fafc',
  menuBg:      '#ffffff',
  surface:     '#ffffff',
  surfaceAlt:  '#f9fafb',
  chip:        '#f3f4f6',

  primary:     '#2563eb',
  primarySoft: '#eff6ff',
  primaryBold: '#1d4ed8',

  text:        '#111827',
  textMuted:   '#6b7280',
  textSubtle:  '#9ca3af',

  separator:   '#e5e7eb',

  cardBack:        '#3B82F6',
  cardBackIcon:    '#ffffff',
  cardFront:       '#DBEAFE',
  cardIcon:        '#2563eb',
  cardMatched:     '#BBF7D0',
  cardMatchedIcon: '#15803d',
  cardExpired:     '#FECACA',
  cardExpiredIcon: '#dc2626',

  toggleTrack:       '#d1d5db',
  toggleTrackActive: '#2563eb',
  toggleThumb:       '#ffffff',
};

export const DARK_THEME: AppTheme = {
  pageBg:      '#0f172a',
  menuBg:      '#0f172a',
  surface:     '#1e293b',
  surfaceAlt:  '#1e293b',
  chip:        '#334155',

  primary:     '#3b82f6',
  primarySoft: '#1e3a5f',
  primaryBold: '#60a5fa',

  text:        '#f1f5f9',
  textMuted:   '#94a3b8',
  textSubtle:  '#64748b',

  separator:   '#334155',

  cardBack:        '#1d4ed8',
  cardBackIcon:    '#ffffff',
  cardFront:       '#1e3a8a',
  cardIcon:        '#93c5fd',
  cardMatched:     '#14532d',
  cardMatchedIcon: '#4ade80',
  cardExpired:     '#7f1d1d',
  cardExpiredIcon: '#f87171',

  toggleTrack:       '#475569',
  toggleTrackActive: '#3b82f6',
  toggleThumb:       '#f1f5f9',
};
