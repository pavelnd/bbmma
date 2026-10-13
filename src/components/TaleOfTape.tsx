import { motion } from "framer-motion";
import { FIGHTERS } from "../data/fight";

interface Row {
  label: string;
  a: number;
  b: number;
  fmt: (v: number) => string;
  hint?: string;
}

const ROWS: Row[] = [
  { label: "Возраст", a: 36, b: 32, fmt: (v) => `${v} лет` },
  { label: "Рост", a: 168, b: 170, fmt: (v) => `${v} см` },
  { label: "Размах рук", a: 182, b: 184, fmt: (v) => `${v} см` },
  { label: "Вес", a: 65.8, b: 66.2, fmt: (v) => `${v} кг` },
  { label: "Победы", a: 28, b: 20, fmt: (v) => `${v}` },
  { label: "Поражения", a: 4, b: 0, fmt: (v) => `${v}` },
];

export default function TaleOfTape() {
  const [v, e] = FIGHTERS;
  return (
    <section className="relative border-y border-line bg-carbon/60 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(255,255,255,0.03),transparent_75%)]" />
      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-8">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-mist">Tale of the tape</span>
          <h2 className="font-display mt-4 text-[clamp(26px,3.6vw,44px)] font-900 uppercase text-white">
            Сравнение <span className="text-fon">бойцов</span>
          </h2>
        </div>

        {/* names */}
        <div className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="text-right">
            <div className="font-display text-[clamp(15px,2vw,24px)] font-800 uppercase text-white">{v.lastName}</div>
            <div className="font-mono text-[11px] font-600 text-fon">{v.record.wins}-{v.record.losses}-{v.record.draws}</div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white/[0.04] font-display text-[12px] font-800 text-gold">
            VS
          </div>
          <div>
            <div className="font-display text-[clamp(15px,2vw,24px)] font-800 uppercase text-white">{e.lastName}</div>
            <div className="font-mono text-[11px] font-600 text-blu">{e.record.wins}-{e.record.losses}-{e.record.draws}</div>
          </div>
        </div>

        {/* rows */}
        <div className="mt-8 space-y-5">
          {ROWS.map((row, idx) => {
            const total = row.a + row.b || 1;
            const leftPct = (row.a / total) * 100;
            const rightPct = (row.b / total) * 100;
            return (
              <div key={row.label}>
                <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-baseline gap-4">
                  <span className="text-right font-mono text-[15px] font-700 text-white">{row.fmt(row.a)}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-mist">{row.label}</span>
                  <span className="font-mono text-[15px] font-700 text-white">{row.fmt(row.b)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="flex h-1.5 justify-end overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${leftPct}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 1.1, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-l from-fon to-fon-deep"
                    />
                  </div>
                  <span className="w-4" />
                  <div className="flex h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${rightPct}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 1.1, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-blu to-blu-deep"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-[12px] font-semibold leading-relaxed text-mist">
          У Евлоева «ноль» в графе поражений и преимущество в габаритах, у Волкановски — чемпионский опыт
          и серия из пятираундовых войн на высшем уровне.
        </p>
      </div>
    </section>
  );
}
