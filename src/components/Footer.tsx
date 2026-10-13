import { OctagonIcon, ShieldAlert, ExternalLink } from "lucide-react";
import { EVENT } from "../data/fight";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-carbon/70">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-fon to-fon-deep">
                <OctagonIcon className="h-5 w-5 text-white" strokeWidth={2.4} />
              </span>
              <span className="font-display text-[13px] font-800 tracking-[0.18em] text-white">
                FON<span className="text-fon">·</span>LINE
              </span>
            </div>
            <p className="mt-4 max-w-md text-[12.5px] font-semibold leading-relaxed text-mist">
              Информационная страница о титульном бое {EVENT.tag}: Александр Волкановски — Мовсар Евлоев,
              {EVENT.dateLabel}, {EVENT.arena}, {EVENT.city}. Коэффициенты приведены по опубликованным основным
              линиям букмекеров Fonbet, Winline и Olimpbet.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <a
                href="https://fon.bet"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-[12px] font-bold text-white transition hover:border-fon/50 hover:bg-fon/10"
              >
                fon.bet
                <ExternalLink className="h-3.5 w-3.5 text-fon" />
              </a>
              <a
                href="https://winline.ru"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-[12px] font-bold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                winline.ru
                <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
              </a>
              <a
                href="https://olimp.bet"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-[12px] font-bold text-white transition hover:border-blu/50 hover:bg-blu/10"
              >
                olimp.bet
                <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
              </a>
            </div>
          </div>

          {/* nav */}
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-mist">Разделы</div>
            <ul className="mt-4 space-y-2.5 text-[13px] font-bold text-white/80">
              <li><a href="#top" className="transition hover:text-fon">Афиша боя</a></li>
              <li><a href="#line" className="transition hover:text-fon">Коэффициенты Fonbet</a></li>
            </ul>
            <div className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.24em] text-mist">Событие</div>
            <p className="mt-3 text-[12px] font-semibold leading-relaxed text-mist">
              {EVENT.tag} · {EVENT.type}
              <br />
              {EVENT.dateLabel} · {EVENT.timeLabel}
            </p>
          </div>

          {/* warning */}
          <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">
              <ShieldAlert className="h-4 w-4" />
              Ответственная игра
            </div>
            <p className="mt-3 text-[11.5px] font-semibold leading-relaxed text-mist">
              Ставки на спорт доступны только совершеннолетним (18+) в легальных букмекерских конторах.
              Воспринимайте пари как развлечение, а не способ заработка. Коэффициенты могут измениться —
              актуальная линия на fon.bet.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-lg bg-fon/15 px-2.5 py-1 font-mono text-[11px] font-800 text-fon">18+</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-mist/70">не азартная игра</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-[11px] font-semibold text-mist/70">
            © 2026 Волкановски — Евлоев · Линии Fonbet, Winline и Olimpbet. Сайт не является официальным ресурсом перечисленных букмекеров или UFC.
          </p>
          <p className="font-mono text-[10.5px] font-600 text-mist/50">
            React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
