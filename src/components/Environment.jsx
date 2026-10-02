import {
  Globe, AppWindow, Network, ShieldUser, Database, Zap, GitBranch, Radar, Server,
} from 'lucide-react';

const ICONS = { globe: Globe, app: AppWindow, network: Network, admin: ShieldUser, db: Database,
  redis: Zap, git: GitBranch, radar: Radar, server: Server };
export const STATUS_LABEL = { healthy: 'Healthy', warning: 'Warning', critical: 'Critical',
  attack: 'Under attack', scanning: 'Scanning', offline: 'Offline' };

const W = 1000, H = 560;

// Modular scene. Props are plain data (see data/api.js) so it works with API responses.
export default function Environment({ assets, edges, selectedId, onSelect, attack, scanning = {}, compact }) {
  const byId = Object.fromEntries(assets.map((a) => [a.id, a]));
  const pathEdges = new Set();
  if (attack) attack.path.forEach((n, i) => i && pathEdges.add(`${attack.path[i - 1]}>${n}`));
  const statusOf = (a) => (scanning[a.id] ? 'scanning' : a.status);

  return (
    <svg className={`env ${compact ? 'env-compact' : ''}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
      role="img" aria-label="Application security environment" onClick={() => onSelect(null)}>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" className="env-grid" />
        </pattern>
        <radialGradient id="vignette"><stop offset="0%" stopColor="#1a1f26" stopOpacity=".55" /><stop offset="100%" stopColor="#0F1114" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" />
      <ellipse cx="520" cy="290" rx="470" ry="270" fill="url(#vignette)" />
      {/* trust zones */}
      <text x="24" y="30" className="env-zone">EDGE</text>
      <text x="420" y="30" className="env-zone">APPLICATION TIER</text>
      <text x="740" y="30" className="env-zone">DATA TIER</text>
      <line x1="215" y1="20" x2="215" y2="540" className="env-zone-line" />
      <line x1="690" y1="20" x2="690" y2="540" className="env-zone-line" />

      {edges.map((e, i) => {
        const a = byId[e.from], b = byId[e.to];
        if (!a || !b) return null;
        const hot = pathEdges.has(`${e.from}>${e.to}`);
        const selected = selectedId && (e.from === selectedId || e.to === selectedId);
        const d = `M${a.x} ${a.y} L${b.x} ${b.y}`;
        const intelHot = e.kind === 'intel' && attack;
        return (
          <g key={i} className={`edge edge-${e.kind} ${hot ? 'edge-hot' : ''} ${selected ? 'edge-sel' : ''} ${intelHot ? 'edge-intel-on' : ''}`}>
            <path d={d} className="edge-line" />
            {(hot || intelHot) && (
              <circle r="4" className={intelHot && !hot ? 'pkt pkt-intel' : 'pkt'}>
                <animateMotion dur={hot ? '1.1s' : '1.6s'} repeatCount="indefinite" path={intelHot && !hot ? `M${b.x} ${b.y} L${a.x} ${a.y}` : d} />
              </circle>
            )}
            {!hot && !intelHot && e.kind === 'flow' && (
              <circle r="2" className="pkt pkt-idle">
                <animateMotion dur={`${5 + (i % 4)}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}

      {assets.map((a) => {
        const st = statusOf(a);
        const Icon = ICONS[a.icon] || Server;
        const hit = attack && attack.path.includes(a.id);
        const target = attack && attack.target === a.id;
        return (
          <g key={a.id} transform={`translate(${a.x} ${a.y})`}
            className={`node-g st-${st} ${selectedId === a.id ? 'is-sel' : ''} ${hit ? 'is-hit' : ''} ${target ? 'is-target' : ''}`}
            tabIndex={0} role="button" aria-label={`${a.name}, ${STATUS_LABEL[st]}, risk ${a.risk}`}
            onClick={(e) => { e.stopPropagation(); onSelect(a.id); }}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(a.id))}>
            <circle r="46" className="halo" />
            <circle r="34" className="ring-pulse" />
            <circle r="38" className="ring-scan" />
            <circle r="30" className="body" />
            <path d={`M0 -30 A30 30 0 ${a.risk > 50 ? 1 : 0} 1 ${(30 * Math.sin((Math.min(a.risk, 99) / 100) * 2 * Math.PI)).toFixed(2)} ${(-30 * Math.cos((Math.min(a.risk, 99) / 100) * 2 * Math.PI)).toFixed(2)}`} className="risk-arc" />
            <Icon x={-11} y={-11} size={22} strokeWidth={1.6} className="node-icon" />
            <text y="52" className="node-label">{a.name}</text>
            {!compact && <text y="67" className="node-sub">{STATUS_LABEL[st]} · {a.risk}</text>}
            {a.findingCount > 0 && <g transform="translate(24 -24)"><circle r="9" className="badge-bg" /><text y="3.5" className="badge-t">{a.findingCount}</text></g>}
          </g>
        );
      })}
    </svg>
  );
}
