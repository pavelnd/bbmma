import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, OctagonIcon, Receipt, Radio } from "lucide-react";
import { EVENT } from "../data/fight";

function useMskClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Moscow",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Header({ slipCount, onOpenSlip }: { slipCount: number; onOpenSlip: () => void }) {
  const clock = useMskClock();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/85 backdrop-blur-xl border-b border-line shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-8">
        {/* logo */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-fon to-fon-deep shadow-[0_0_24px_-4px_rgba(255,46,63,0.7)]">
            <OctagonIcon className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="font-display text-[13px] font-800 tracking-[0.18em] text-white">
            FON<span className="text-fon">·</span>LINE
          </span>
        </a>

        {/* breadcrumb — как навигация fon.bet */}
        <nav className="hidden items-center gap-1 text-[12px] font-semibold text-mist md:flex">
          {EVENT.breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/25" />}
              <span
                className={
                  i === EVENT.breadcrumb.length - 1
                    ? "rounded-md bg-white/8 px-2 py-1 text-white"
                    : "px-1.5 py-1 transition hover:text-white"
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-fon animate-pulse-dot" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-mist">
              МСК <span className="text-white">{clock}</span>
            </span>
          </div>

          <a
            href="#line"
            className="hidden items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-white/15 lg:flex"
          >
            <Radio className="h-3.5 w-3.5 text-fon" />
            К линии
          </a>

          <button
            onClick={onOpenSlip}
            className="relative flex items-center gap-2 rounded-full bg-fon px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_8px_28px_-8px_rgba(255,46,63,0.8)] transition hover:brightness-110 active:scale-95"
          >
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Купон</span>
            {slipCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-gold px-1 font-mono text-[10px] font-800 text-ink">
                {slipCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
