#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────────────────
 *  АВТООБНОВЛЕНИЕ коэффициентов — long-running процесс для вашего сервера.
 *
 *  Каждые N минут запрашивает ваш JSON-источник и перезаписывает odds.json.
 *  Сайт подхватывает новые значения при следующей загрузке страницы.
 *
 *  Запуск:
 *      node scripts/odds-watch.mjs \
 *        --url https://your-proxy.example/line.json \
 *        --map '{"fon.p1":"fonbet.p1","fon.p2":"fonbet.p2","win.p1":"winline.p1","win.p2":"winline.p2","olimp.p1":"olimp.p1","olimp.p2":"olimp.p2"}' \
 *        --interval 15
 *
 *  --interval  частота обновления в минутах (по умолчанию 15, минимум 1).
 *
 *  Держать процесс живым на сервере:
 *      pm2 start scripts/odds-watch.mjs --name odds -- --url ... --interval 15
 *      pm2 save && pm2 startup
 *
 *  Остановка: Ctrl+C (или pm2 stop odds).
 *
 *  Важно: источник (--url) — это ВАШ серверный JSON (прокси/парсер/фид БК).
 *  Парсить fon.bet / winline.ru напрямую этот скрипт не умеет — там
 *  антибот-защита, нужен отдельный сборщик на сервере.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { applyUpdates, fetchUpdatesFromUrl, KNOWN_KEYS } from "./odds-lib.mjs";

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};

const url = get("--url");
const mapRaw = get("--map") ?? "{}";
const intervalMin = Math.max(1, Number(get("--interval") ?? 15) || 15);

if (!url) {
  console.error("Укажите источник: --url https://your-proxy/line.json");
  console.error("Для одноразового ручного обновления используйте scripts/update-odds.mjs");
  process.exit(1);
}

let map;
try {
  map = JSON.parse(mapRaw);
} catch {
  console.error("Невалидный JSON в --map");
  process.exit(1);
}

const unknown = Object.keys(map).filter((k) => !KNOWN_KEYS.includes(k));
if (unknown.length) {
  console.warn(`⚠ неизвестные ключи в --map (сайт их проигнорирует): ${unknown.join(", ")}`);
}

async function tick() {
  const stamp = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  try {
    const updates = await fetchUpdatesFromUrl(url, map);
    const count = Object.keys(updates).length;
    if (count === 0) {
      console.warn(`[${stamp}] источник не вернул ни одного валидного кэфа — файл не тронут`);
      return;
    }
    const wrote = applyUpdates(updates, { verbose: false });
    const brief = Object.entries(updates).map(([k, v]) => `${k}=${v}`).join(" ");
    console.log(`[${stamp}] ✓ ${count} кэфов → ${wrote} файл(а): ${brief}`);
  } catch (e) {
    console.error(`[${stamp}] ошибка: ${e.message} (следующая попытка через ${intervalMin} мин)`);
  }
}

console.log("──────────────────────────────────────────────");
console.log(` 👁 odds-watch: обновление каждые ${intervalMin} мин`);
console.log(` источник: ${url}`);
console.log(" остановка: Ctrl+C");
console.log("──────────────────────────────────────────────");

await tick(); // первый прогон сразу
const timer = setInterval(tick, intervalMin * 60_000);

process.on("SIGINT", () => {
  clearInterval(timer);
  console.log("\nостановлено");
  process.exit(0);
});
process.on("SIGTERM", () => {
  clearInterval(timer);
  process.exit(0);
});
