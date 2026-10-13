import { useEffect, useState } from "react";
import { BOOKIES } from "../data/fight";

export interface OddsFeed {
  /** true — данные загружены из /odds.json (обновляется без пересборки) */
  live: boolean;
  /** метка времени из файла odds.json */
  updatedAt: string | null;
  /** карта key -> коэффициент (json поверх встроенных значений) */
  odds: Record<string, number>;
}

// встроенная (офлайн) копия линии — дефолт, если odds.json недоступен
const DEFAULT_ODDS: Record<string, number> = {};
for (const b of BOOKIES) {
  for (const s of b.selections) DEFAULT_ODDS[s.key] = s.odds;
}

export function useOddsFeed(): OddsFeed {
  const [feed, setFeed] = useState<OddsFeed>({
    live: false,
    updatedAt: null,
    odds: DEFAULT_ODDS,
  });

  useEffect(() => {
    let cancelled = false;
    const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
    const url = `${base}odds.json?ts=${Date.now()}`;

    fetch(url, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: unknown) => {
        if (cancelled || typeof data !== "object" || !data) return;
        const root = data as { odds?: unknown; updatedAt?: unknown };
        const incoming = root.odds;
        if (typeof incoming !== "object" || !incoming) return;

        // валидируем и аккуратно мерджим поверх встроенных значений
        const merged: Record<string, number> = { ...DEFAULT_ODDS };
        for (const key of Object.keys(merged)) {
          const v = Number((incoming as Record<string, unknown>)[key]);
          if (Number.isFinite(v) && v > 1 && v < 1000) merged[key] = v;
        }
        setFeed({
          live: true,
          updatedAt: typeof root.updatedAt === "string" ? root.updatedAt : null,
          odds: merged,
        });
      })
      .catch(() => {
        // тихий фолбэк: остаёмся на встроенной копии линии
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return feed;
}

export function formatUpdatedAt(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return (
    new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Moscow",
    }).format(d) + " МСК"
  );
}
