import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Receipt, Trash2, X, ShieldAlert, Banknote } from "lucide-react";
import type { Picked } from "./OddsBoard";

interface Props {
  open: boolean;
  onClose: () => void;
  picks: Record<string, Picked>;
  onRemove: (key: string) => void;
  onClear: () => void;
}

const QUICK = [100, 500, 1000, 5000];

export default function BetSlip({ open, onClose, picks, onRemove, onClear }: Props) {
  const [stake, setStake] = useState("1000");
  const [tried, setTried] = useState(false);

  const items = Object.values(picks);
  const totalOdds = useMemo(
    () => items.reduce((acc, it) => acc * it.odds, 1),
    [items]
  );
  const stakeNum = Math.max(0, parseFloat(stake.replace(",", ".")) || 0);
  const payout = stakeNum * (items.length ? totalOdds : 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[420px] flex-col border-l border-line bg-carbon shadow-[-30px_0_80px_rgba(0,0,0,0.6)]"
          >
            {/* head */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-fon/15">
                  <Receipt className="h-4.5 w-4.5 text-fon" />
                </span>
                <div>
                  <div className="font-display text-[13px] font-800 uppercase tracking-wide text-white">Купон</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">демо-режим</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={onClear} className="rounded-lg p-2 text-mist transition hover:bg-white/8 hover:text-white" title="Очистить">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button onClick={onClose} className="rounded-lg p-2 text-mist transition hover:bg-white/8 hover:text-white" title="Закрыть">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border border-dashed border-white/15 text-mist">
                    <Receipt className="h-7 w-7" />
                  </span>
                  <p className="max-w-[240px] text-[12.5px] font-semibold leading-relaxed text-mist">
                    Купон пуст. Нажмите на коэффициент в линии, чтобы добавить исход сюда.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-mist">
                    Экспресс · {items.length} {items.length === 1 ? "событие" : items.length < 5 ? "события" : "событий"}
                  </div>
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.div
                        key={it.key}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-3.5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-mist">UFC 333 · Волкановски — Евлоев</div>
                          <div className="mt-0.5 truncate text-[13px] font-bold text-white">{it.label}</div>
                        </div>
                        <span className="rounded-lg bg-fon/15 px-2.5 py-1.5 font-mono text-[15px] font-800 text-fon">
                          {it.odds.toFixed(2)}
                        </span>
                        <button onClick={() => onRemove(it.key)} className="rounded-lg p-1.5 text-mist transition hover:bg-white/8 hover:text-fon">
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* stake */}
                  <div className="mt-5 rounded-2xl border border-line bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-mist">
                      <Banknote className="h-3.5 w-3.5 text-gold" />
                      Сумма ставки
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-line bg-ink px-4 py-3 focus-within:border-fon/50">
                      <input
                        value={stake}
                        onChange={(e) => setStake(e.target.value.replace(/[^\d.,]/g, ""))}
                        inputMode="decimal"
                        className="w-full bg-transparent font-mono text-lg font-700 text-white outline-none"
                        placeholder="0"
                      />
                      <span className="font-mono text-sm font-700 text-mist">₽</span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                      {QUICK.map((q) => (
                        <button
                          key={q}
                          onClick={() => setStake(String(q))}
                          className="rounded-lg border border-line bg-white/[0.03] py-1.5 font-mono text-[11px] font-700 text-mist transition hover:border-fon/40 hover:text-white"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="border-t border-line px-5 py-4">
              <div className="flex items-center justify-between text-[12px] font-bold text-mist">
                <span>Общий коэффициент</span>
                <span className="font-mono text-[16px] font-800 text-white">
                  {items.length ? totalOdds.toFixed(2) : "—"}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[12px] font-bold text-mist">
                <span>Возможный выигрыш</span>
                <span className="font-mono text-[16px] font-800 text-gold">
                  {items.length && stakeNum ? `${payout.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽` : "—"}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setTried(true);
                  setTimeout(() => setTried(false), 2600);
                }}
                disabled={items.length === 0}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-fon to-fon-deep py-4 font-display text-[13px] font-800 uppercase tracking-[0.14em] text-white shadow-[0_14px_36px_-12px_rgba(255,46,63,0.7)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Сделать ставку
              </motion.button>

              <AnimatePresence>
                {tried && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-3 text-center text-[11px] font-bold text-gold"
                  >
                    Демо-режим: приём ставок недоступен. Реальные пари — только на fon.bet
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-snug text-mist/70">
                <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0" />
                Визуализация купона в информационных целях. Сайт не принимает ставки и не связан с БК «Фонбет».
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
