type StorageRecord = Record<string, string>;
const memoryStorage: StorageRecord = {};

export async function saveGameState(key: string, value: unknown) {
  memoryStorage[key] = JSON.stringify(value);
  return Promise.resolve();
}

export async function loadGameState<T>(key: string): Promise<T | undefined> {
  const raw = memoryStorage[key];
  if (!raw) return Promise.resolve(undefined);
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}
