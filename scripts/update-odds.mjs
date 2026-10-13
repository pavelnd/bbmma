#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ОДНОРАЗОВОЕ обновление коэффициентов (запустили → записал → завершился).
 *  Периодического запуска внутри нет — для автообновления используйте
 *  scripts/odds-watch.mjs или cron (см. ниже).
 *
 *  Сайт читает dist/odds.json (в dev — public/odds.json) при каждой загрузке
 *  страницы. Этот скрипт перезаписывает файл БЕЗ пересборки проекта.
 *
 *  ▸ Вариант 1 — вручную (цифры вы берёте сами на сайтах БК):
 *      node scripts/update-odds.mjs fon.p1=2.10 win.p2=1.74 olimp.p2=1.80
 *
 *  ▸ Вариант 2 — один раз из вашего JSON-источника (прокси/агрегатор):
 *      node scripts/update-odds.mjs --url https://your-proxy.example/line.json \
 *        --map '{"fon.p1":"fonbet.p1","fon.x":"fonbet.x","fon.p2":"fonbet.p2","win.p1":"winline.p1","win.p2":"winline.p2","olimp.p1":"olimp.p1","olimp.x":"olimp.x","olimp.p2":"olimp.p2"}'
 *
 *  ▸ Автоматически каждые N минут:
 *      node scripts/odds-watch.mjs --url <ваш-источник> --map '{...}' --interval 15
 *    или cron:
 *      */15 * * * * cd /var/www/site && node scripts/update-odds.mjs --url ... >> /var/log/odds.log 2>&1
 *
 *  Ключи линии: fon.p1 / fon.x / fon.p2       — Fonbet (Спорт → Единоборства → UFC),
 *               win.p1 / win.p2              — Winline (MMA → UFC),
 *               olimp.p1 / olimp.x / olimp.p2 — Olimpbet (Единоборства → UFC).
 *
 *  Почему нет готового адаптера под fon.bet / winline.ru / olimp.bet:
 *  у букмекеров нет публичных API линии, сайты закрыты антибот-защитой
 *  (JS-челлендж, fingerprinting). Стабильный парсинг возможен только на
 *  сервере (headless-браузер/прокси) и требует поддержки. Альтернативы:
 *  партнёрский фид БК, агрегаторы коэффициентов с API, ручной ввод.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { applyUpdates, fetchUpdatesFromUrl, isValidOdd } from "./odds-lib.mjs";

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};

async function collectUpdates() {
  const url = get("--url");
  if (url) {
    const map = JSON.parse(get("--map") ?? "{}");
    return fetchUpdatesFromUrl(url, map);
  }
  // ручной режим: key=value
  const updates = {};
  for (const a of args) {
    if (a.startsWith("--")) continue;
    const eq = a.indexOf("=");
    if (eq <= 0) continue;
    const key = a.slice(0, eq);
    const v = Number(a.slice(eq + 1).replace(",", "."));
    if (!isValidOdd(v)) {
      console.warn(`⚠ пропущено «${a}»: кэф должен быть числом в диапазоне (1; 1000)`);
      continue;
    }
    updates[key] = v;
  }
  return updates;
}

const updates = await collectUpdates();
if (Object.keys(updates).length === 0) {
  console.error("Нет валидных обновлений. Пример: node scripts/update-odds.mjs fon.p1=2.10 win.p1=1.98");
  process.exit(1);
}

const wrote = applyUpdates(updates);
if (wrote === 0) {
  console.error("Не найден ни public/odds.json, ни dist/odds.json — запустите из корня проекта.");
  process.exit(1);
}

console.log("Изменено:", Object.entries(updates).map(([k, v]) => `${k} → ${v}`).join(", "));
console.log("Готово. Сайт подхватит новые коэффициенты при следующей загрузке страницы — пересборка не требуется.");
