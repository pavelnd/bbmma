import { motion } from "framer-motion";
import {
  ChevronRight,
  CircleDot,
  ExternalLink,
  Flame,
  Info,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import { BOOKIES, type Bookie, type OddSelection } from "../data/fight";
import { formatUpdatedAt, type OddsFeed } from "../hooks/useOddsFeed";

export interface Picked {
  key: string;
  label: string;
  odds: number;
}

interface Props {
  picks: Record<string, Picked>;
  onToggle: (sel: Picked) => void;
  feed: OddsFeed;
}

/** накладывает живые коэффициенты на шаблон линии */
const withLive = (sel: OddSelection, odds: Record<string, number>): OddSelection => ({
  ...sel,
  odds: odds[sel.key] ?? sel.odds,
});

/* ---------------- brand badge ---------------- */

function BrandBadge({ brand, name }: { brand: Bookie["brand"]; name: string }) {
  if (brand === "fon") {
    return (
      <span className="rounded-md bg-gradient-to-br from-fon to-fon-deep px-2.5 py-1 font-display text-[13px] font-800 italic tracking-wide text-white shadow-[0_0_20px_-4px_rgba(255,46,63,0.7)]">
        {name}
      </span>
    );
  }
  if (brand === "win") {
    return (
      <span className="rounded-md bg-white px-2.5 py-1 font-display text-[13px] font-800 italic tracking-wide text-zinc-900 shadow-[0_0_20px_-4px_rgba(255,255,255,0.35)]">
        {name}
        <span className="text-sky-600">.</span>
      </span>
    );
  }
  return (
    <span className="rounded-md bg-gradient-to-br from-[#12306b] to-[#0a1c44] px-2.5 py-1 font-display text-[13px] font-800 italic tracking-wide text-white shadow-[0_0_20px_-4px_rgba(47,123,255,0.5)]">
      {name}
      <span className="text-amber-400">.</span>
    </span>
  );
}

/* ---------------- compact selection row-cell ---------------- */

function Cell({
  sel,
  prefix,
  best,
  active,
  onToggle,
}: {
  sel: OddSelection;
  prefix: string;
  best: boolean;
  active: boolean;
  onToggle: (p: Picked) => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() =>
        onToggle({
          key: sel.key,
          label: `${prefix} · ${sel.label}${sel.detail ? ` · ${sel.detail}` : ""}`,
          odds: sel.odds,
        })
      }
      className={`card-sheen group relative flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
        active
          ? "border-fon/70 bg-fon/[0.14] shadow-[0_0_30px_-10px_rgba(255,46,63,0.55)]"
          : best
            ? "border-gold/40 bg-gold/[0.06] hover:border-gold/70"
            : "border-line bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
      }`}
    >
      <span className="flex min-w-0 flex-col">
        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${active ? "text-white" : "text-mist"}`}>
          {sel.label}
          {sel.hot && !best && (
            <span className="flex items-center gap-0.5 rounded-full bg-gold/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-gold">
              <Flame className="h-2 w-2" />
              топ
            </span>
          )}
        </span>
        <span className={`truncate text-[12.5px] font-bold leading-tight ${active ? "text-white/90" : "text-mist/90"}`}>
          {sel.detail}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        {best && (
          <span className="hidden items-center gap-1 rounded-full bg-gold/15 px-2 py-1 text-[8.5px] font-extrabold uppercase tracking-wider text-gold sm:flex">
            <Sparkles className="h-2.5 w-2.5" />
            лучшая цена
          </span>
        )}
        <motion.span
          key={sel.odds}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`font-mono text-[24px] font-800 leading-none transition-colors duration-300 sm:text-[27px] ${
            active ? "text-fon" : best ? "text-gold" : "text-white group-hover:text-fon"
          }`}
        >
          {sel.odds.toFixed(2)}
        </motion.span>
        {active && (
          <span className="grid h-4 w-4 place-items-center rounded-full bg-fon">
            <CircleDot className="h-3 w-3 text-white" />
          </span>
        )}
      </span>
    </motion.button>
  );
}

/* ---------------- mini probability ---------------- */

function MiniProb({ p1, p2 }: { p1: number; p2: number }) {
  const vPct = Math.round((1 / p1) * 100);
  const ePct = Math.round((1 / p2) * 100);
  const barPct = (vPct / (vPct + ePct)) * 100;
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-2.5">
      <span className="shrink-0 font-mono text-[11px] font-700 text-fon">{vPct}%</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="absolute inset-0 rounded-full transition-all duration-700"
          style={{ background: `linear-gradient(90deg, #ff2e3f ${barPct}%, #2f7bff ${barPct}%)` }}
        />
      </div>
      <span className="shrink-0 font-mono text-[11px] font-700 text-blu">{ePct}%</span>
      <span className="hidden items-center gap-1.5 text-[9px] font-600 uppercase tracking-[0.18em] text-mist/60 md:flex">
        <TrendingUp className="h-3 w-3" />
        имплайд
      </span>
    </div>
  );
}

/* ---------------- bookie card (compact, full width) ---------------- */

function BookieCard({
  bookie,
  odds,
  picks,
  onToggle,
  bestKeys,
  index,
}: {
  bookie: Bookie;
  odds: Record<string, number>;
  picks: Props["picks"];
  onToggle: Props["onToggle"];
  bestKeys: Set<string>;
  index: number;
}) {
  const p1Sel = bookie.selections.find((s) => s.label === "П1");
  const p2Sel = bookie.selections.find((s) => s.label === "П2");
  const p1 = p1Sel ? (odds[p1Sel.key] ?? 0) : 0;
  const p2 = p2Sel ? (odds[p2Sel.key] ?? 0) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-line bg-gradient-to-b from-panel2/80 to-panel/40 p-4 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] sm:p-5"
    >
      {/* card header — одна строка */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <BrandBadge brand={bookie.brand} name={bookie.name} />
        <nav className="flex items-center gap-1 text-[11px] font-bold text-mist">
          {bookie.breadcrumb.map((c, i) => (
            <span key={c} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-white/25" />}
              <span className={i === bookie.breadcrumb.length - 1 ? "rounded bg-white/8 px-1.5 py-0.5 text-white" : ""}>
                {c}
              </span>
            </span>
          ))}
        </nav>
        <span className="hidden rounded-full border border-line bg-white/[0.04] px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-mist xl:inline">
          {bookie.marketNote}
        </span>
        <a
          href={bookie.url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto flex items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] font-700 text-white/80 transition hover:border-fon/50 hover:text-white"
        >
          {bookie.url.replace("https://", "")}
          <ExternalLink className="h-3 w-3 text-fon" />
        </a>
      </div>

      {/* компактные строки исходов */}
      <div className={`mt-4 grid grid-cols-1 gap-2 ${bookie.grid}`}>
        {bookie.selections.map((sel) => {
          const liveSel = withLive(sel, odds);
          return (
            <Cell
              key={sel.key}
              sel={liveSel}
              prefix={bookie.short}
              best={bestKeys.has(sel.key)}
              active={!!picks[sel.key]}
              onToggle={onToggle}
            />
          );
        })}
      </div>

      {p1 > 1 && p2 > 1 && <MiniProb p1={p1} p2={p2} />}
    </motion.div>
  );
}

/* ---------------- board ---------------- */

export default function OddsBoard({ picks, onToggle, feed }: Props) {
  const { odds, live, updatedAt } = feed;
  const stamp = formatUpdatedAt(updatedAt);

  // «лучшая цена» — максимум по каждому исходу среди всех букмекеров
  const bestKeys = new Set<string>();
  for (const tail of ["П1", "П2"] as const) {
    let bestKey: string | null = null;
    let bestVal = 0;
    for (const b of BOOKIES) {
      for (const s of b.selections) {
        if (s.label !== tail) continue;
        const v = odds[s.key];
        if (v && v > bestVal) {
          bestVal = v;
          bestKey = s.key;
        }
      }
    }
    if (bestKey) bestKeys.add(bestKey);
  }

  return (
    <section id="line" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_40%_at_50%_0%,rgba(255,46,63,0.06),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-8">
        {/* header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-mist">
                Единоборства · UFC 333 · основная линия
              </span>

              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-700 ${
                  live
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-gold/30 bg-gold/10 text-gold"
                }`}
                title={
                  live
                    ? "Коэффициенты загружены из файла odds.json — он обновляется без пересборки сайта"
                    : "Файл odds.json не найден рядом с сайтом — показана встроенная копия линии"
                }
              >
                {live ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {live ? (stamp ? `обновлено ${stamp}` : "odds.json подключён") : "офлайн-копия линии"}
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display mt-4 text-[clamp(30px,4.6vw,58px)] font-900 uppercase leading-[0.95] text-white"
            >
              Основная <span className="text-stroke-fon">линия</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2.5 self-start rounded-xl border border-line bg-white/[0.03] px-4 py-3 lg:self-auto"
          >
            <RefreshCw className="h-4 w-4 shrink-0 text-gold" />
            <p className="max-w-[320px] text-[11.5px] font-semibold leading-snug text-mist">
              Три букмекера, одна страница. Значения читаются из{" "}
              <span className="font-mono text-white/80">odds.json</span> (ключи{" "}
              <span className="font-mono text-white/80">fon.*</span>, <span className="font-mono text-white/80">win.*</span>,{" "}
              <span className="font-mono text-white/80">olimp.*</span>) без пересборки сайта.
            </p>
          </motion.div>
        </div>

        {/* вертикальная лента букмекеров */}
        <div className="mt-10 flex flex-col gap-4 sm:gap-5">
          {BOOKIES.map((b, i) => (
            <BookieCard key={b.id} bookie={b} odds={odds} picks={picks} onToggle={onToggle} bestKeys={bestKeys} index={i} />
          ))}
        </div>

        {/* footnote */}
        <div className="mt-8 flex items-start gap-2.5 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-mist" />
          <p className="text-[11.5px] leading-relaxed text-mist">
            Основные линии на бой Волкановски — Евлоев, UFC 333, 24 октября 2026: Fonbet (Спорт → Единоборства → UFC),
            Winline (MMA → UFC, рынок «Победитель», при ничьей — возврат), Olimpbet (Единоборства → UFC). «Лучшая цена»
            подсвечивает максимальный коэффициент по каждому исходу среди трёх БК. Коэффициенты меняются в реальном
            времени — сверяйтесь с актуальными линиями на сайтах букмекеров. Обновление — через{" "}
            <span className="font-mono text-white/80">odds.json</span> (скрипт{" "}
            <span className="font-mono text-white/80">scripts/update-odds.mjs</span>). Материал носит информационный характер.
          </p>
        </div>
      </div>
    </section>
  );
}
