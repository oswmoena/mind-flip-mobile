import type { ConfigContext, ExpoConfig } from "expo/config";

// Configuración dinámica sobre app.json (que sigue siendo la base para iOS/Android).
// EXPO_WEB_BASE_URL solo se define en el build web del portafolio, para publicarlo en
// https://oswallmoena.cl/apps/mind-flip. Sin la variable, todo queda como en app.json.
// Docs (SDK 58): experiments.baseUrl, solo afecta a `expo export`, no al servidor de desarrollo.
export default ({ config }: ConfigContext): ExpoConfig => {
  const baseUrl = process.env.EXPO_WEB_BASE_URL?.trim();
  if (baseUrl && !/^\/[a-z0-9/-]+[a-z0-9]$/.test(baseUrl)) {
    throw new Error(`EXPO_WEB_BASE_URL debe empezar con "/" y no terminar en "/": "${baseUrl}"`);
  }
  return {
    ...config,
    name: config.name ?? "Mind Flip",
    slug: config.slug ?? "mind-flip",
    experiments: { ...config.experiments, ...(baseUrl ? { baseUrl } : {}) },
  };
};
