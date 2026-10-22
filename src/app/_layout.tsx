import { Stack } from 'expo-router';
import * as ExpoSplash from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppStoreProvider } from '@/store/useAppStore';
import { SplashScreen } from '@/components/SplashScreen';
import { loadSavedLanguage } from '../i18n';
import '../i18n';

// Keep the native splash visible until we explicitly hide it.
ExpoSplash.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady,    setAppReady]    = useState(false);
  const [splashGone,  setSplashGone]  = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadSavedLanguage();
      } finally {
        // Hide native splash, then let JS splash take over for the fade-out
        await ExpoSplash.hideAsync();
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppStoreProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="game"    options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="ranking" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="legal"   options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="help"    options={{ animation: 'slide_from_bottom' }} />
        </Stack>

        {/* JS splash rendered on top — fades out once app is ready */}
        {!splashGone && (
          <SplashScreen
            visible={!appReady}
            onHidden={() => setSplashGone(true)}
          />
        )}
      </AppStoreProvider>
    </GestureHandlerRootView>
  );
}
