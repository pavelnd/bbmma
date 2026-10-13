import { motion } from "framer-motion";
import { History } from "lucide-react";
import { FIGHTERS } from "../data/fight";

export default function RecentFights() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3"
        >
          <History className="h-5 w-5 text-gold" />
          <h2 className="font-display text-[clamp(20px,2.6vw,32px)] font-800 uppercase text-white">Форма к бою</h2>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">последние 5 поединков</span>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {FIGHTERS.map((f, fi) => {
            const isRed = f.corner === "red";
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: fi * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl border border-line bg-panel/60"
              >
                <div className={`flex items-center justify-between border-b border-line px-5 py-4 ${isRed ? "bg-fon/[0.06]" : "bg-blu/[0.06]"}`}>
                  <div className="flex items-center gap-3">
                    <img src={f.image} alt="" className={`h-10 w-10 rounded-xl border object-cover ${isRed ? "border-fon/40" : "border-blu/40"}`} />
                    <div>
                      <div className="font-display text-[13px] font-700 uppercase tracking-wide text-white">
                        {f.firstName} {f.lastName}
                      </div>
                      <div className={`font-mono text-[10px] font-600 ${isRed ? "text-fon" : "text-blu"}`}>
                        {f.stats.streak}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-lg bg-white/8 px-2.5 py-1 font-mono text-[11px] font-700 text-white">
                    {f.record.wins}-{f.record.losses}
                  </span>
                </div>

                <div>
                  {f.recent.map((r, i) => (
                    <motion.div
                      key={r.date + r.opponent}
                      initial={{ opacity: 0, x: isRed ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="flex items-center gap-4 border-b border-line px-5 py-3.5 transition last:border-b-0 hover:bg-white/[0.03]"
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-[11px] font-800 ${
                          r.result === "W"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-fon/15 text-fon"
                        }`}
                      >
                        {r.result === "W" ? "В" : "П"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-bold text-white">{r.opponent}</div>
                        <div className="text-[11px] font-semibold text-mist">{r.method}</div>
                      </div>
                      <span className="font-mono text-[11px] font-600 text-mist/70">{r.date}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
