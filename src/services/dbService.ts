import CryptoJS from "crypto-js"; // npm install crypto-js y npm install --save-dev @types/crypto-js
import * as SQLite from "expo-sqlite";
import type { GameMode } from "../types/game";

export interface UserRecord {
  id?: number;
  gameMode: "CLASSIC" | "TIME_ATTACK" | "LIMITED_MOVES";
  gridSize: number;
  bestScore: number;
  updatedAt: string;
}

// Clave secreta que se mezcla con los datos (Mantener fuera del alcance del usuario)
const SALT_KEY = "M1nD_FliP_Secr3t_S@lt_2026";

// Función utilitaria para generar la firma criptográfica única
const generateSignature = (
  mode: string,
  size: number,
  score: number,
): string => {
  const payload = `${mode}:${size}:${score}:${SALT_KEY}`;
  return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
};

/**
 * Inicializa la base de datos asíncronamente y asegura que las tablas existan.
 * Utiliza el modo WAL (Write-Ahead Logging) para rendimiento nativo óptimo.
 */
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync("flipshift_records.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS high_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_mode TEXT NOT NULL,
      grid_size INTEGER NOT NULL,
      best_score INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      data_signature TEXT NOT NULL
    );
  `);

  return db;
};

/**
 * Guarda o actualiza un récord calculando su respectiva firma de integridad.
 */
export const saveRecord = async (
  db: SQLite.SQLiteDatabase,
  record: UserRecord,
): Promise<void> => {
  const signature = generateSignature(
    record.gameMode,
    record.gridSize,
    record.bestScore,
  );

  // Buscar si ya existe un récord para este modo específico
  const existing: any = await db.getFirstAsync(
    "SELECT id, best_score FROM high_scores WHERE game_mode = ? AND grid_size = ?",
    [record.gameMode, record.gridSize],
  );

  if (existing) {
    // Para memorice clásico, "menor score" (menos movimientos) significa mejor récord
    if (record.bestScore < existing.best_score) {
      await db.runAsync(
        "UPDATE high_scores SET best_score = ?, updated_at = ?, data_signature = ? WHERE id = ?",
        [record.bestScore, record.updatedAt, signature, existing.id],
      );
    }
  } else {
    // Inserción limpia del primer récord alcanzado
    await db.runAsync(
      "INSERT INTO high_scores (game_mode, grid_size, best_score, updated_at, data_signature) VALUES (?, ?, ?, ?, ?)",
      [
        record.gameMode,
        record.gridSize,
        record.bestScore,
        record.updatedAt,
        signature,
      ],
    );
  }
};

/**
 * Recupera los récords filtrando y bloqueando cualquier registro que haya sido alterado externamente.
 */
export const getVerifiedRecords = async (
  db: SQLite.SQLiteDatabase,
): Promise<UserRecord[]> => {
  const rows: any[] = await db.getAllAsync(
    "SELECT * FROM high_scores ORDER BY best_score ASC",
  );
  const verifiedRecords: UserRecord[] = [];

  for (const row of rows) {
    const computedSig = generateSignature(
      row.game_mode,
      row.grid_size,
      row.best_score,
    );

    if (computedSig !== row.data_signature) {
      console.warn(
        `[ALERTA DE SEGURIDAD] Récord ID ${row.id} alterado de manera externa. Omitiendo.`,
      );
      continue;
    }

    verifiedRecords.push({
      id: row.id,
      gameMode: row.game_mode,
      gridSize: row.grid_size,
      bestScore: row.best_score,
      updatedAt: row.updated_at,
    });
  }

  return verifiedRecords;
};

// ── Rankings Top-10 (por modo + tablero) ─────────────────────────────────────

export interface RankingEntry {
  id?: number;
  name: string;
  score: number;
  grid_size: number;
  mode: GameMode;
  moves: number;
  max_combo: number;
  created_at: string;
}

let _rankingsDbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getRankingsDb(): Promise<SQLite.SQLiteDatabase> {
  if (!_rankingsDbPromise) {
    _rankingsDbPromise = SQLite.openDatabaseAsync("mindflip_rankings.db").then(
      async (db) => {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS rankings (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT    NOT NULL,
            score      INTEGER NOT NULL,
            grid_size  INTEGER NOT NULL,
            mode       TEXT    NOT NULL,
            moves      INTEGER NOT NULL,
            max_combo  INTEGER NOT NULL,
            created_at TEXT    NOT NULL,
            signature  TEXT    NOT NULL
          );
        `);
        return db;
      },
    );
  }
  return _rankingsDbPromise;
}

const generateRankingSignature = (entry: Omit<RankingEntry, "id">): string => {
  const payload = `${entry.name}:${entry.mode}:${entry.grid_size}:${entry.score}:${entry.moves}:${entry.max_combo}:${entry.created_at}:${SALT_KEY}`;
  return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
};

export async function saveRankingEntry(
  entry: Omit<RankingEntry, "id">,
): Promise<void> {
  const db = await getRankingsDb();
  const signature = generateRankingSignature(entry);
  await db.runAsync(
    `INSERT INTO rankings (name, score, grid_size, mode, moves, max_combo, created_at, signature)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.name,
      entry.score,
      entry.grid_size,
      entry.mode,
      entry.moves,
      entry.max_combo,
      entry.created_at,
      signature,
    ],
  );
}

type RankingRow = RankingEntry & { id: number; signature: string };

export async function getTopRankings(
  mode: GameMode,
  gridSize: number,
  limit = 10,
): Promise<RankingEntry[]> {
  const db = await getRankingsDb();
  const rows = await db.getAllAsync<RankingRow>(
    `SELECT * FROM rankings WHERE mode = ? AND grid_size = ? ORDER BY score DESC LIMIT ?`,
    [mode, gridSize, limit],
  );
  return rows
    .filter((r) => r.signature === generateRankingSignature(r))
    .map(({ signature: _sig, ...rest }) => rest as RankingEntry);
}

export const rankingAvailable = true;
