import { useCallback, useMemo, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import OddsBoard, { type Picked } from "./components/OddsBoard";
import FighterCards from "./components/FighterCards";
import TaleOfTape from "./components/TaleOfTape";
import RecentFights from "./components/RecentFights";
import BetSlip from "./components/BetSlip";
import Footer from "./components/Footer";
import { useOddsFeed } from "./hooks/useOddsFeed";
import { EVENT, FIGHTERS, TICKER_KEYS } from "./data/fight";

export default function App() {
  const [picks, setPicks] = useState<Record<string, Picked>>({});
  const [slipOpen, setSlipOpen] = useState(false);

  // живая лента коэффициентов: /odds.json поверх встроенных значений
  const feed = useOddsFeed();
  const p1 = feed.odds["fon.p1"] ?? 2.03;
  const p2 = feed.odds["fon.p2"] ?? 1.82;

  const fighters = useMemo(
    () => FIGHTERS.map((f) => ({ ...f, odds: f.id === "volk" ? p1 : p2 })),
    [p1, p2]
  );

  const tickerItems = useMemo(() => {
    const items = TICKER_KEYS.map(({ key, text }) => {
      const v = feed.odds[key];
      return v ? `${text} — ${v.toFixed(2)}` : null;
    }).filter((x): x is string => !!x);
    items.push(`${EVENT.tag} · Этихад Арена · 24.10.2026`);
    return items;
  }, [feed.odds]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const togglePick = useCallback((sel: Picked) => {
    setPicks((prev) => {
      const next = { ...prev };
      if (next[sel.key]) delete next[sel.key];
      else next[sel.key] = sel;
      return next;
    });
  }, []);

  const addPick = useCallback((sel: Picked) => {
    setPicks((prev) => ({ ...prev, [sel.key]: sel }));
  }, []);

  const heroPick = useCallback(
    (key: string, label: string, odds: number) => {
      addPick({ key, label, odds });
      setSlipOpen(true);
    },
    [addPick]
  );

  return (
    <div className="min-h-screen bg-ink text-white">
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-fon via-gold to-blu"
      />

      <Header slipCount={Object.keys(picks).length} onOpenSlip={() => setSlipOpen(true)} />

      <main>
        <Hero onPick={heroPick} line={{ p1, p2 }} />
        <Ticker items={tickerItems} />
        <OddsBoard picks={picks} onToggle={togglePick} feed={feed} />
        <FighterCards
          fighters={fighters}
          onPick={(p) => {
            addPick(p);
            setSlipOpen(true);
          }}
        />
        <TaleOfTape />
        <RecentFights />
      </main>

      <Footer />

      <BetSlip
        open={slipOpen}
        onClose={() => setSlipOpen(false)}
        picks={picks}
        onRemove={(key) =>
          setPicks((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          })
        }
        onClear={() => setPicks({})}
      />
    </div>
  );
}
