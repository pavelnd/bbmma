import { motion } from "framer-motion";
import { ArrowLeftRight, BadgeCheck, Crown, Ruler, Scale, Timer, Zap } from "lucide-react";
import type { Fighter } from "../data/fight";
import type { Picked } from "./OddsBoard";

export default function FighterCards({ fighters, onPick }: { fighters: Fighter[]; onPick: (p: Picked) => void }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex items-center justify-center gap-3 text-center">
          <span className="h-px w-10 bg-white/15" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-mist">Карточки бойцов</span>
          <span className="h-px w-10 bg-white/15" />
        </div>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-center text-[clamp(26px,3.6vw,44px)] font-900 uppercase leading-[1.02] text-white">
          Наведите — <span className="text-stroke">переверните карту</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {fighters.map((f, i) => {
            const isRed = f.corner === "red";
            const accent = isRed ? "text-fon" : "text-blu";
            const tag = isRed ? "П1" : "П2";
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 50, rotateY: isRed ? -8 : 8 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flip-scene mx-auto h-[480px] w-full max-w-[460px] sm:h-[520px]"
              >
                <div className="flip-inner relative h-full w-full">
                  {/* FRONT */}
                  <div className={`flip-face absolute inset-0 overflow-hidden rounded-[28px] border bg-panel ${isRed ? "border-fon/25" : "border-blu/25"}`}>
                    <img src={f.image} alt={f.lastName} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
                    <div className={`absolute left-0 top-0 h-full w-1.5 ${isRed ? "bg-fon" : "bg-blu"}`} />

                    <div className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md ${isRed ? "bg-fon/60" : "bg-blu/60"}`}>
                      <ArrowLeftRight className="h-3 w-3" />
                      переверните
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">
                        <Crown className="h-4 w-4" />
                        {f.rank}
                      </div>
                      <h3 className="font-display mt-2 text-[clamp(24px,2.6vw,34px)] font-800 uppercase leading-[1.02] text-white">
                        {f.firstName}
                        <br />
                        <span className={accent}>{f.lastName}</span>
                      </h3>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="rounded-lg bg-white/10 px-3 py-1.5 font-mono text-[13px] font-700 text-white backdrop-blur">
                          {f.record.wins}-{f.record.losses}-{f.record.draws}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-mist">{f.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className={`flip-face flip-back absolute inset-0 overflow-hidden rounded-[28px] border p-6 sm:p-7 ${isRed ? "border-fon/35 bg-[linear-gradient(160deg,#1c0d11,#0c0d13_55%)]" : "border-blu/35 bg-[linear-gradient(160deg,#0d1524,#0c0d13_55%)]"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={`font-display text-[13px] font-800 uppercase tracking-[0.14em] ${accent}`}>
                          {f.firstName} {f.lastName}
                        </div>
                        <div className="mt-1 text-[11px] font-bold italic text-mist">«{f.nickname}»</div>
                      </div>
                      <span className="rounded-lg border border-line bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] font-700 text-gold">
                        {f.record.wins}-{f.record.losses}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2.5">
                      {[
                        { icon: Timer, label: "Возраст", value: `${f.stats.age} года` },
                        { icon: Ruler, label: "Рост", value: `${f.stats.heightCm} см` },
                        { icon: Ruler, label: "Размах рук", value: `${f.stats.reachCm} см` },
                        { icon: Scale, label: "Вес", value: `${f.stats.weightKg} кг` },
                        { icon: Zap, label: "Серия", value: f.stats.streak },
                        { icon: BadgeCheck, label: "Стиль", value: f.stats.style },
                      ].map((s) => (
                        <div key={s.label} className="rounded-xl border border-line bg-white/[0.03] p-3">
                          <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-mist">
                            <s.icon className={`h-3 w-3 ${accent}`} />
                            {s.label}
                          </div>
                          <div className="mt-1 font-mono text-[13px] font-700 text-white">{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        onPick({
                          key: isRed ? "fon.p1" : "fon.p2",
                          label: `Fonbet · ${tag} · ${f.lastName} — победа`,
                          odds: f.odds,
                        })
                      }
                      className={`card-sheen mt-6 flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition active:scale-95 ${
                        isRed ? "border-fon/40 bg-fon/10 hover:bg-fon/20" : "border-blu/40 bg-blu/10 hover:bg-blu/20"
                      }`}
                    >
                      <span className="text-left text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
                        {tag} · Победа {f.lastName}
                      </span>
                      <span className={`font-mono text-[26px] font-800 ${accent}`}>{f.odds.toFixed(2)}</span>
                    </button>

                    <div className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-mist/60">
                      добавить в купон
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
