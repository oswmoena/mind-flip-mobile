import { useAppStore } from '../store/useAppStore';
import { DARK_THEME, LIGHT_THEME, type AppTheme } from '../config/theme';

export function useTheme(): AppTheme {
  const { isDark } = useAppStore();
  return isDark ? DARK_THEME : LIGHT_THEME;
}
