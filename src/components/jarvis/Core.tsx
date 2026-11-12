import type { CoreState } from "@/lib/jarvis-store";

const particles = Array.from({ length: 14 }, (_, i) => ({ a: `${i * 26}deg`, r: `${30 + (i % 4) * 5}%`, d: `${10 + (i % 5) * 4}s` }));

export function HoloCore({ state }: { state: CoreState }) {
  return (
    <div className="core" data-state={state} aria-label={`Núcleo: ${state}`}>
      <div className="ring r1" />
      <div className="ticks" />
      <div className="ring r2" />
      <div className="ring r3" />
      <div className="ring r4" />
      <div className="halo" />
      <div className="halo h2" />
      {particles.map((p, i) => (
        <span key={i} className="particle" style={{ ["--a" as string]: p.a, ["--r" as string]: p.r, ["--d" as string]: p.d }} />
      ))}
      <div className="orb" />
    </div>
  );
}
