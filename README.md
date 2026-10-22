# Mind Flip 🃏

Juego de memoria desarrollado en Chile con React Native + Expo SDK 56.

Encuentra todos los pares de cartas antes de que se acabe el tiempo, los movimientos, o simplemente a tu ritmo.

---

## Modos de juego

| Modo | Descripción |
|---|---|
| 🎯 Clásico | Sin límites. Juega a tu ritmo |
| ⏱ Contrareloj | Descubre todos los pares antes de que el tiempo se agote |
| 🃏 Movimientos | Número fijo de intentos. Cada par de cartas volteadas = 1 movimiento |

## Tableros

`4×4` · `6×4` · `6×6`

## Modificadores

- **La Revuelta** — tras 5 fallos consecutivos, las cartas sin descubrir se barajan
- **Jugar con puntos** — activa el sistema de puntaje y combos

## Sistema de puntaje

```
Puntaje = Base × Eficiencia × Modo × Revuelta × Combo
```

- **Base:** 1.000 / 1.500 / 2.500 según el tablero
- **Eficiencia:** movimientos mínimos ÷ movimientos usados
- **Modo:** hasta +50% por tiempo o movimientos restantes
- **Revuelta:** ×1.3 si estaba activa
- **Combo:** +10% por cada nivel de combo máximo

El ranking guarda los top 10 por modo y tablero en SQLite local con integridad SHA-256.

---

## Stack técnico

- **Expo SDK 56** · expo-router v3 · TypeScript estricto
- **React Native Reanimated v4** — todas las animaciones
- **expo-sqlite v14** — ranking local (iOS/Android); stub sin dependencias para web
- **i18next + react-i18next** — ES 🇨🇱 / EN 🇺🇸, detección automática del dispositivo
- **AsyncStorage** — persistencia de idioma y tema
- **crypto-js** — firmas SHA-256 para integridad del ranking
- Arquitectura limpia: `screens/` · `components/` · `hooks/` · `services/` · `utils/`

## Estructura

```
src/
├── app/              # Rutas expo-router
├── components/       # UI puro (Card, GameBoard, Header, ConfettiOverlay…)
├── screens/          # Pantallas completas (MenuScreen, GameScreen…)
├── hooks/            # Lógica (useMemoryGame, useCountdown, useTheme)
├── services/         # Base de datos (dbService.ts / dbService.web.ts)
├── i18n/             # Traducciones ES + EN
├── utils/            # Funciones puras (scoreCalculator, gameHelpers)
├── types/            # Tipos TypeScript globales
├── config/           # Tema (colores claro/oscuro)
├── navigation/       # Tipos de rutas
└── store/            # Estado global (useAppStore)
```

---

## Correr el proyecto

```bash
npm install
npx expo start
```

Escanea el QR con la app **Expo Go** o abre en web presionando `w`.

## Build para producción

Requiere cuenta en [expo.dev](https://expo.dev) y EAS CLI instalado (`npm install -g eas-cli`).

```bash
# Ambas plataformas
eas build --platform all --profile production

# Solo Android (.aab para Play Store)
eas build --platform android --profile production

# Solo iOS (.ipa para App Store)
eas build --platform ios --profile production
```

---

## Privacidad

Mind Flip no recopila datos personales ni usa publicidad. Los puntajes y apodos se almacenan exclusivamente en el dispositivo del usuario. Más información en la pantalla de **Términos y Privacidad** dentro de la app.

---

Desarrollado por **PurePlay Games** · Chile 🇨🇱
