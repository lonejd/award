export default function AwardCounter({ index, total, visible }) {
  if (!visible) return null;
  const current = String(index + 1).padStart(2, "0");
  const end = String(total).padStart(2, "0");
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="award-counter" aria-hidden="true">
      <span>
        {current} / {end}
      </span>
      <div className="award-counter-track">
        <div className="award-counter-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
