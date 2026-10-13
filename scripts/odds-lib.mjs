// Общая логика обновления odds.json — используется update-odds.mjs и odds-watch.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const TARGETS = [join(ROOT, "public", "odds.json"), join(ROOT, "dist", "odds.json")];

export const KNOWN_KEYS = [
  "fon.p1", "fon.x", "fon.p2",
  "win.p1", "win.p2",
  "olimp.p1", "olimp.x", "olimp.p2",
];

export function readJsonSafe(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

export function getPath(obj, path) {
  return String(path)
    .split(".")
    .reduce((acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined), obj);
}

export function isValidOdd(v) {
  return Number.isFinite(v) && v > 1 && v < 1000;
}

/** записывает updates в public/odds.json и dist/odds.json (если существует) */
export function applyUpdates(updates, { verbose = true } = {}) {
  let wrote = 0;
  for (const path of TARGETS) {
    const current = readJsonSafe(path);
    if (!current) continue;
    current.odds = { ...(current.odds ?? {}), ...updates };
    current.updatedAt = new Date().toISOString();
    writeFileSync(path, JSON.stringify(current, null, 2) + "\n", "utf8");
    if (verbose) console.log(`✓ обновлён ${path}`);
    wrote++;
  }
  return wrote;
}

/** тянет JSON по url и достаёт кэфы по map { "fon.p1": "путь.в.объекте" } */
export async function fetchUpdatesFromUrl(url, map) {
  console.log(`→ запрос: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`источник ответил HTTP ${res.status}`);
  const data = await res.json();
  const updates = {};
  for (const [key, path] of Object.entries(map ?? {})) {
    const v = Number(getPath(data, path));
    if (isValidOdd(v)) updates[key] = v;
    else console.warn(`⚠ ${key}: не число по пути «${path}» — пропущено`);
  }
  return updates;
}
