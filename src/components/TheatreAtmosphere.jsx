import { useMemo } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

function DustField({ reduced }) {
  const grains = useMemo(
    () =>
      Array.from({ length: reduced ? 0 : 22 }, (_, index) => ({
        id: index,
        left: `${4 + ((index * 17) % 92)}%`,
        top: `${8 + ((index * 29) % 80)}%`,
        size: 1 + (index % 3) * 0.6,
        delay: (index * 0.7) % 8,
        duration: 11 + (index % 6),
      })),
    [reduced]
  );

  return (
    <div className="dust" aria-hidden="true">
      {grains.map((grain) => (
        <span
          key={grain.id}
          className="dust-mote"
          style={{
            left: grain.left,
            top: grain.top,
            width: grain.size,
            height: grain.size,
            animationDelay: `${grain.delay}s`,
            animationDuration: `${grain.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function TheatreAtmosphere() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="theatre" aria-hidden="true">
      <div className="theatre-void" />
      <div className="theatre-velvet theatre-velvet-left" />
      <div className="theatre-velvet theatre-velvet-right" />
      <div className="theatre-proscenium" />
      <div className="theatre-rays" />
      <div className="theatre-spot theatre-spot-main" />
      <div className="theatre-spot theatre-spot-left" />
      <div className="theatre-spot theatre-spot-right" />
      <div className="theatre-floor" />
      <DustField reduced={reduced} />
      <div className="theatre-grain" />
      <div className="theatre-vignette" />
    </div>
  );
}
