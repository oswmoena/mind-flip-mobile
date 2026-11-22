import Head from 'expo-router/head';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { PortfolioBar } from './PortfolioBar.web';

// Marco de la versión web: título e idioma de la página, barra del portafolio arriba y la app
// centrada con un ancho de móvil, para que en escritorio no se estire a todo el ancho.
// Los costados usan el fondo del tema. (Se usa expo-router/head y no un +html.tsx propio para
// conservar la plantilla de Expo, que incrusta los estilos de react-native-web.)
const MAX_WIDTH = 560;
const DESCRIPTION =
  'Juego de memoria: encuentra todos los pares antes de que se acaben el tiempo o los movimientos. Tres modos, tres tableros y puntaje con combos.';

export function WebShell({ children }: PropsWithChildren) {
  const theme = useTheme();
  return (
    <View style={[styles.page, { backgroundColor: theme.pageBg }]}>
      <Head>
        <html lang="es" />
        <title>Mind Flip · Juego de memoria</title>
        <meta name="description" content={DESCRIPTION} />
      </Head>
      <PortfolioBar />
      <View style={styles.app}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  app: { flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
});
