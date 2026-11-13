import type { CoreState } from "@/lib/jarvis-store";

const particles = Array.from({ length: 32 }, (_, i) => ({ a: `${i * 137.5}deg`, r: `${22 + (i % 8) * 3.2}cqw`, d: `${18 + (i % 7) * 4}s` }));
const arcLevel: Record<CoreState, number> = { repouso: 0.18, ouvindo: 0.45, processando: 0.78, falando: 1 };

export const stateLabel: Record<CoreState, string> = { repouso: "Standby", ouvindo: "Escutando", processando: "Analisando", falando: "Respondendo" };

export function HoloCore({ state }: { state: CoreState }) {
  const C = 2 * Math.PI * 48;
  return (
    <div className="core" data-state={state} aria-label={`Núcleo: ${stateLabel[state]}`}>
      <div className="vol" />
      <div className="cross" />
      <div className="ring r5" />
      <div className="neural-sphere" aria-hidden="true">
        <div className="neural-lattice" />
        <div className="neural-lattice neural-lattice-back" />
        <div className="neural-equator" />
      </div>
      <svg className="arc" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="none" stroke="var(--border)" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="var(--c)" strokeWidth="0.9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - arcLevel[state])} style={{ filter: "drop-shadow(0 0 2px var(--c))" }} />
      </svg>
      <div className="ring r1" />
      <div className="ticks" />
      <div className="ring r2" />
      <div className="ring r6" />
      <div className="ring r3" />
      <div className="ring r4" />
      <div className="ring r7" />
      <div className="scan" />
      <div className="halo" />
      <div className="halo h2" />
      {particles.map((p, i) => (
        <span key={i} className="particle" style={{ ["--a" as string]: p.a, ["--r" as string]: p.r, ["--d" as string]: p.d, opacity: 0.35 + (i % 3) * 0.25, width: i % 4 ? 2 : 3, height: i % 4 ? 2 : 3 }} />
      ))}
      <div className="orb" />
    </div>
  );
}
