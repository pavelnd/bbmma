import { Octagon } from "lucide-react";

export default function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative z-20 -mt-px overflow-hidden border-y border-line bg-carbon/80 py-3 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-8 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-mono text-[12px] font-600 tracking-wide text-white/75">{item}</span>
            <Octagon className="h-3 w-3 text-fon/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
