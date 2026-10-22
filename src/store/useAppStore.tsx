import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

type AppStoreState = {
  userName: string;
  setUserName: (name: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
};

const AppStoreContext = createContext<AppStoreState | undefined>(undefined);

export function AppStoreProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [userName, setUserName] = useState('Jugador');
  // Seed from system preference; user can override via toggleTheme.
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = useCallback(() => setIsDark(v => !v), []);

  const value = useMemo(
    () => ({ userName, setUserName, isDark, toggleTheme }),
    [userName, isDark, toggleTheme],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) throw new Error('useAppStore must be used inside AppStoreProvider');
  return context;
}
