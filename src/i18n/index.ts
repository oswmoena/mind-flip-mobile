import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import es from './locales/es';
import en from './locales/en';

export type Language = 'es' | 'en';
const LANG_KEY = '@mindflip_lang';

const deviceLang = getLocales()[0]?.languageCode ?? 'es';
const defaultLang: Language = deviceLang.startsWith('es') ? 'es' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng:           defaultLang,
  fallbackLng:   'es',
  interpolation: { escapeValue: false },
  // Disable missing key warnings — our keys are exhaustive
  missingKeyHandler: false,
});

/** Call once at app startup to restore the user's saved preference. */
export async function loadSavedLanguage(): Promise<void> {
  try {
    const saved = await AsyncStorage.getItem(LANG_KEY);
    if (saved === 'es' || saved === 'en') {
      await i18n.changeLanguage(saved);
    }
  } catch {
    // Ignore — default language stays
  }
}

/** Change language and persist the choice. */
export async function setLanguage(lang: Language): Promise<void> {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANG_KEY, lang);
}

export { i18n };
