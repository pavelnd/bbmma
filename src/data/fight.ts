// ─────────────────────────────────────────────────────────────
// Основные линии букмекеров на бой Волкановски — Евлоев, UFC 333
// Fonbet:   fon.bet  → Спорт → Единоборства → UFC   (3-way)
// Winline:  winline.ru → MMA → UFC                   (2-way)
// Ключи namespaced (fon.* / win.*) — по ним обновляется odds.json
// ─────────────────────────────────────────────────────────────

export interface Fighter {
  id: "volk" | "evloev";
  firstName: string;
  lastName: string;
  nickname: string;
  country: string;
  corner: "red" | "blue";
  rank: string;
  record: { wins: number; losses: number; draws: number };
  odds: number; // чистая победа (Fonbet) — может перезаписываться живой лентой
  stats: {
    age: number;
    heightCm: number;
    reachCm: number;
    weightKg: number;
    streak: string;
    finishes: string;
    style: string;
  };
  recent: { date: string; opponent: string; result: "W" | "L"; method: string }[];
  image: string;
}

export interface OddSelection {
  key: string;
  label: string;
  detail?: string;
  odds: number;
  hot?: boolean;
}

export interface Bookie {
  id: "fonbet" | "winline" | "olimpbet";
  name: string;
  short: string; // префикс в купоне
  brand: "fon" | "win" | "olimp";
  url: string;
  breadcrumb: string[];
  captured: string;
  marketNote: string;
  grid: string; // tailwind-сетка для ячеек
  selections: OddSelection[];
}

export const EVENT = {
  tag: "UFC 333",
  type: "Титульный бой · 5 раундов",
  division: "Полулёгкий вес (до 65,8 кг)",
  arena: "Etihad Arena · Yas Island",
  city: "Абу-Даби, ОАЭ",
  dateLabel: "24 октября 2026",
  timeLabel: "23:00 МСК (ориентировочно)",
  targetIso: "2026-10-24T23:00:00+03:00",
  breadcrumb: ["Спорт", "Единоборства", "UFC 333"],
};

export const FIGHTERS: Fighter[] = [
  {
    id: "volk",
    firstName: "Александр",
    lastName: "Волкановски",
    nickname: "The Great",
    country: "Австралия",
    corner: "red",
    rank: "Чемпион UFC",
    record: { wins: 28, losses: 4, draws: 0 },
    odds: 2.03,
    stats: {
      age: 36,
      heightCm: 168,
      reachCm: 182,
      weightKg: 65.8,
      streak: "2 победы подряд",
      finishes: "15 досрочных",
      style: "Ударник · давление",
    },
    recent: [
      { date: "01.02.26", opponent: "Диего Лопес", result: "W", method: "Решение" },
      { date: "13.04.25", opponent: "Диего Лопес", result: "W", method: "Решение" },
      { date: "18.02.24", opponent: "Илия Топурия", result: "L", method: "KO" },
      { date: "21.10.23", opponent: "Ислам Махачев", result: "L", method: "KO" },
      { date: "08.07.23", opponent: "Яир Родригес", result: "W", method: "TKO" },
    ],
    image: "/images/volkanovski.jpg",
  },
  {
    id: "evloev",
    firstName: "Мовсар",
    lastName: "Евлоев",
    nickname: "Бесстрашный",
    country: "Россия",
    corner: "blue",
    rank: "№1 рейтинга",
    record: { wins: 20, losses: 0, draws: 0 },
    odds: 1.82,
    stats: {
      age: 32,
      heightCm: 170,
      reachCm: 184,
      weightKg: 66.2,
      streak: "20 побед подряд",
      finishes: "7 досрочных",
      style: "Борец · контроль",
    },
    recent: [
      { date: "22.03.26", opponent: "Лерон Мёрфи", result: "W", method: "Решение" },
      { date: "08.12.24", opponent: "Алджамейн Стерлинг", result: "W", method: "Решение" },
      { date: "21.01.24", opponent: "Арнольд Аллен", result: "W", method: "Решение" },
      { date: "07.05.23", opponent: "Диего Лопес", result: "W", method: "Решение" },
      { date: "05.06.22", opponent: "Дэн Иге", result: "W", method: "Решение" },
    ],
    image: "/images/evloev.jpg",
  },
];

// ── Основные линии ────────────────────────────────────────────

export const BOOKIES: Bookie[] = [
  {
    id: "fonbet",
    name: "Fonbet",
    short: "Fonbet",
    brand: "fon",
    url: "https://fon.bet",
    breadcrumb: ["Спорт", "Единоборства", "UFC"],
    captured: "Линия на октябрь 2026",
    marketNote: "3-way · с учётом ничьей",
    grid: "sm:grid-cols-3",
    selections: [
      { key: "fon.p1", label: "П1", detail: "Волкановски", odds: 2.03 },
      { key: "fon.x", label: "Х", detail: "Ничья", odds: 49.0 },
      { key: "fon.p2", label: "П2", detail: "Евлоев", odds: 1.82, hot: true },
    ],
  },
  {
    id: "winline",
    name: "Winline",
    short: "Winline",
    brand: "win",
    url: "https://winline.ru",
    breadcrumb: ["MMA", "UFC"],
    captured: "Линия на октябрь 2026",
    marketNote: "2-way · рынок «Победитель», при ничьей — возврат",
    grid: "sm:grid-cols-2",
    selections: [
      { key: "win.p1", label: "П1", detail: "Волкановски", odds: 1.94 },
      { key: "win.p2", label: "П2", detail: "Евлоев", odds: 1.77, hot: true },
    ],
  },
  {
    id: "olimpbet",
    name: "Olimpbet",
    short: "Olimpbet",
    brand: "olimp",
    url: "https://olimp.bet",
    breadcrumb: ["Единоборства", "UFC"],
    captured: "Линия на октябрь 2026",
    marketNote: "3-way · с учётом ничьей",
    grid: "sm:grid-cols-3",
    selections: [
      { key: "olimp.p1", label: "П1", detail: "Волкановски", odds: 2.14 },
      { key: "olimp.x", label: "Х", detail: "Ничья", odds: 50.0 },
      { key: "olimp.p2", label: "П2", detail: "Евлоев", odds: 1.76 },
    ],
  },
];

// Ключи для бегущей строки — собирается из живых данных
export const TICKER_KEYS: { key: string; text: string }[] = [
  { key: "fon.p1", text: "Fonbet · П1 Волкановски" },
  { key: "fon.x", text: "Fonbet · ничья" },
  { key: "fon.p2", text: "Fonbet · П2 Евлоев" },
  { key: "win.p1", text: "Winline · П1 Волкановски" },
  { key: "win.p2", text: "Winline · П2 Евлоев" },
  { key: "olimp.p1", text: "Olimpbet · П1 Волкановски" },
  { key: "olimp.p2", text: "Olimpbet · П2 Евлоев" },
];
