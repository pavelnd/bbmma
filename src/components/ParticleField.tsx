import { useEffect, useRef } from "react";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  hue: "red" | "blue";
  tw: number;
}

export default function ParticleField({ density = 70 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: P[] = [];

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (initial = false): P => {
      const hue: P["hue"] = Math.random() < 0.5 ? "red" : "blue";
      // красные тяготеют влево, синие вправо
      const gx = hue === "red" ? Math.random() * w * 0.62 : w * 0.38 + Math.random() * w * 0.62;
      return {
        x: gx,
        y: initial ? Math.random() * h : h + 12,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(0.25 + Math.random() * 0.85),
        r: 0.6 + Math.random() * 1.9,
        life: 0,
        maxLife: 380 + Math.random() * 420,
        hue,
        tw: Math.random() * Math.PI * 2,
      };
    };

    resize();
    for (let i = 0; i < density; i++) particles.push(spawn(true));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.tw += 0.06;
        p.x += p.vx + Math.sin(p.tw * 0.5) * 0.14;
        p.y += p.vy;

        const fade = Math.sin((p.life / p.maxLife) * Math.PI);
        const alpha = Math.max(0, fade) * (0.5 + Math.abs(Math.sin(p.tw)) * 0.5);

        const [cr, cg, cb] = p.hue === "red" ? [255, 72, 86] : [88, 148, 255];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha * 0.75})`;
        ctx.shadowColor = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.shadowBlur = p.r * 5;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.life > p.maxLife || p.y < -14) particles[i] = spawn();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
