import { SEV_LABEL } from '../data/api';

export function SeverityTag({ level, large }) {
  const key = level.toLowerCase();
  return (
    <span className={`sev sev-${key} ${large ? 'sev-lg' : ''}`}>
      <span className="sev-dot" />
      {SEV_LABEL[key] || level}
    </span>
  );
}

export function Chip({ children }) {
  return <span className="chip">{children}</span>;
}

export function CweTag({ cwe }) {
  return <span className="cwe">{cwe}</span>;
}

export function StatusText({ status }) {
  const key = status.toLowerCase();
  return (
    <span className={`status-ind status-${key}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export function LiveDot({ active }) {
  return <span className={`dot ${active ? 'dot-live' : ''}`} />;
}

export function Sparkline({ points, width = 68, height = 20 }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const d = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'} ${i * step} ${
          height - ((p - min) / range) * height
        }`
    )
    .join(' ');
  return (
    <svg width={width} height={height} className="sparkline">
      <path d={d} fill="none" stroke="var(--sev-high)" strokeWidth="1.5" />
    </svg>
  );
}

export function DistBar({ segments }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  return (
    <div className="distbar">
      <div className="distbar-track">
        {segments.map((s) => (
          <div
            key={s.label}
            className="distbar-seg"
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color,
            }}
            title={`${s.label}: ${s.value}`}
          />
        ))}
      </div>
      <div className="distbar-legend">
        {segments.map((s) => (
          <span key={s.label} className="distbar-legend-item">
            <span className="distbar-dot" style={{ background: s.color }} />{' '}
            {s.label} {s.value}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BarList({ items }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="barlist">
      {items.map((i) => (
        <div className="barlist-row" key={i.label}>
          <span className="barlist-label muted">{i.label}</span>
          <div className="barlist-track">
            <div
              className="barlist-fill"
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
          <span className="barlist-value mono">{i.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ steps, size }) {
  return (
    <div className={`timeline ${size === 'lg' ? 'timeline-lg' : ''}`}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <div className="timeline-step" key={i}>
            <span
              className={`timeline-dot timeline-dot-${s.toLowerCase()} ${
                last ? 'timeline-dot-current' : ''
              }`}
            />
            <span
              className={`timeline-label ${
                last ? 'timeline-label-current' : ''
              }`}
            >
              {s}
            </span>
            {!last && <span className="timeline-connector" />}
          </div>
        );
      })}
    </div>
  );
}

export function Toggle({ checked, onChange }) {
  return (
    <button
      className={`toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span className="toggle-knob" />
    </button>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button
          key={o}
          className={`segmented-item ${value === o ? 'active' : ''}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

