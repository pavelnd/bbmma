import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CalendarDays, ChevronDown, Crown, MapPin, Swords, Trophy } from "lucide-react";
import { EVENT, FIGHTERS } from "../data/fight";
import ParticleField from "./ParticleField";

/* ---------------- countdown ---------------- */

function useCountdown(targetIso: string) {
  const calc = () => {
    const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
    return {
      d: Math.floor(diff / 86_400_000),
      h: Math.floor((diff / 3_600_000) % 24),
      m: Math.floor((diff / 60_000) % 60),
      s: Math.floor((diff / 1000) % 60),
      done: diff <= 0,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso]);
  return t;
}

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative grid h-14 w-12 place-items-center overflow-hidden rounded-xl border border-line bg-white/[0.04] backdrop-blur-sm sm:h-[68px] sm:w-[58px]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={str}
            initial={{ y: 26, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -26, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-2xl font-700 text-white sm:text-[28px]"
          >
            {str}
          </motion.span>
        </AnimatePresence>
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/5" />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-mist">{label}</span>
    </div>
  );
}

/* ---------------- fighter side ---------------- */

function FighterSide({ i, odds, onPick }: { i: 0 | 1; odds: number; onPick: (key: string, label: string, odds: number) => void }) {
  const f = FIGHTERS[i];
  const isRed = f.corner === "red";
  const key = isRed ? "fon.p1" : "fon.p2";
  const tag = isRed ? "П1" : "П2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.35 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col ${isRed ? "items-start" : "items-end text-right"}`}
    >
      {/* giant stroke name */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-6 select-none font-display text-[clamp(42px,6.5vw,110px)] font-900 uppercase leading-none tracking-tight opacity-60 text-stroke ${
          isRed ? "left-0" : "right-0"
        }`}
      >
        {f.lastName.split(" ")[0].slice(0, 4)}
      </span>

      {/* portrait */}
      <div className="relative mt-10 w-full max-w-[340px]">
        <div
          className={`absolute -inset-6 rounded-[32px] opacity-40 blur-3xl transition duration-700 group-hover:opacity-70 ${
            isRed
              ? "bg-[radial-gradient(circle_at_40%_30%,rgba(255,46,63,0.5),transparent_65%)]"
              : "bg-[radial-gradient(circle_at_60%_30%,rgba(47,123,255,0.5),transparent_65%)]"
          }`}
        />
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <img
            src={f.image}
            alt={`${f.firstName} ${f.lastName}`}
            className="aspect-[4/5] w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.05]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          {/* corner badge */}
          <div
            className={`absolute top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md ${
              isRed ? "left-3 bg-fon/85" : "right-3 bg-blu/85"
            }`}
          >
            <Swords className="h-3 w-3" />
            {isRed ? "Красный угол" : "Синий угол"}
          </div>
          {/* bottom info */}
          <div className={`absolute inset-x-0 bottom-0 p-4 ${isRed ? "" : "text-right"}`}>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold" style={{ justifyContent: isRed ? "flex-start" : "flex-end" }}>
              <Crown className="h-3.5 w-3.5" />
              {f.rank}
            </div>
            <div className="mt-0.5 font-mono text-[12px] font-semibold text-mist">
              {f.record.wins}-{f.record.losses}-{f.record.draws} · {f.country}
            </div>
          </div>
        </div>
      </div>

      {/* name + odds */}
      <div className={`mt-5 ${isRed ? "" : "flex flex-col items-end"}`}>
        <h2 className="font-display text-[clamp(22px,2.6vw,36px)] font-800 uppercase leading-[1.02] text-white">
          {f.firstName}
          <br />
          <span className={isRed ? "text-fon" : "text-blu"}>{f.lastName}</span>
        </h2>
        <p className="mt-1 text-[12px] font-bold italic tracking-wide text-mist">«{f.nickname}»</p>

        <button
          onClick={() => onPick(key, `Fonbet · ${tag} · ${f.lastName} — победа`, odds)}
          className={`card-sheen mt-4 flex items-center gap-3 rounded-2xl border px-5 py-3 transition active:scale-95 ${
            isRed
              ? "border-fon/30 bg-fon/10 hover:border-fon/60 hover:bg-fon/20"
              : "border-blu/30 bg-blu/10 hover:border-blu/60 hover:bg-blu/20"
          }`}
        >
          <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-mist">{tag} · победа</span>
          <motion.span
            key={odds}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`font-mono text-2xl font-800 ${isRed ? "text-fon" : "text-blu"}`}
          >
            {odds.toFixed(2)}
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- hero ---------------- */

export default function Hero({
  onPick,
  line,
}: {
  onPick: (key: string, label: string, odds: number) => void;
  line: { p1: number; p2: number };
}) {
  const t = useCountdown(EVENT.targetIso);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.25]);

  return (
    <section id="top" className="noise octagon-bg relative min-h-screen overflow-hidden">
      {/* split lights */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_12%_42%,rgba(255,46,63,0.16),transparent_70%),radial-gradient(60%_55%_at_88%_42%,rgba(47,123,255,0.15),transparent_70%)]" />
      {/* octagon outline */}
      <motion.svg
        style={{ y: yBg }}
        viewBox="0 0 100 100"
        className="pointer-events-none absolute left-1/2 top-[54%] h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.10]"
        aria-hidden
      >
        <polygon points="50,2 84,16 98,50 84,84 50,98 16,84 2,50 16,16" fill="none" stroke="white" strokeWidth="0.24" />
        <polygon points="50,10 78,22 90,50 78,78 50,90 22,78 10,50 22,22" fill="none" stroke="white" strokeWidth="0.16" />
        <line x1="50" y1="2" x2="50" y2="98" stroke="white" strokeWidth="0.12" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="white" strokeWidth="0.12" />
      </motion.svg>

      <ParticleField />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 pb-16 pt-28 sm:px-8">
        {/* top meta */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="rounded-full border border-fon/40 bg-fon/10 px-4 py-1.5 font-display text-[11px] font-700 tracking-[0.2em] text-fon">
            {EVENT.tag}
          </span>
          <span className="rounded-full border border-line bg-white/[0.04] px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] text-mist">
            {EVENT.type}
          </span>
        </motion.div>

        <div className="mt-10 grid flex-1 grid-cols-2 items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <FighterSide i={0} odds={line.p1} onPick={onPick} />

          {/* center column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="order-first col-span-2 flex flex-col items-center lg:order-none lg:col-span-1"
          >
            <div className="flex items-center gap-2 text-gold">
              <Trophy className="h-4 w-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Бой за пояс</span>
              <Trophy className="h-4 w-4" />
            </div>

            <div className="font-display my-3 text-[clamp(64px,8vw,120px)] font-900 leading-none gold-text animate-flicker select-none">
              VS
            </div>

            {/* countdown */}
            <div className="mt-2 flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-mist">
                {t.done ? "Бой идёт прямо сейчас" : "До выхода в октагон"}
              </span>
              <div className="flex items-start gap-2 sm:gap-2.5">
                <Digit value={t.d} label="дней" />
                <span className="pt-4 font-mono text-xl text-white/30">:</span>
                <Digit value={t.h} label="часов" />
                <span className="pt-4 font-mono text-xl text-white/30">:</span>
                <Digit value={t.m} label="минут" />
                <span className="pt-4 font-mono text-xl text-white/30">:</span>
                <Digit value={t.s} label="секунд" />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
              <div className="flex items-center gap-2 text-[12px] font-bold text-white">
                <CalendarDays className="h-3.5 w-3.5 text-fon" />
                {EVENT.dateLabel} · {EVENT.timeLabel}
              </div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-mist">
                <MapPin className="h-3.5 w-3.5 text-blu" />
                {EVENT.arena}, {EVENT.city}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist/70">
                {EVENT.division}
              </div>
            </div>
          </motion.div>

          <FighterSide i={1} odds={line.p2} onPick={onPick} />
        </div>

        {/* scroll cue */}
        <motion.a
          href="#line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mx-auto mt-12 flex flex-col items-center gap-2 text-mist transition hover:text-white"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Линия Fonbet</span>
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}
