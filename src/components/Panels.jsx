import { X, ChevronRight, Radio, Bug, Fingerprint, Server, ShieldAlert } from 'lucide-react';
import { SeverityTag, CweTag, LiveDot } from './Shared';
import { STATUS_LABEL } from './Environment';

export function AssetPanel({ asset, findings, events, activity, onClose, onOpenFinding, onOpenEvent }) {
  const mine = findings.filter((f) => f.asset === asset.id && f.status !== 'Resolved');
  const attacks = events.filter((e) => e.target === asset.id || (e.finding && mine.some((f) => f.id === e.finding)));
  const recent = [...attacks.slice(0, 2).map((e) => `${e.technique} detected (${e.ts})`), ...(activity[asset.id] || [])].slice(0, 4);
  return (
    <div className={`ctx st-${asset.status} ${asset.x < 500 ? "ctx-right" : ""}`} onClick={(e) => e.stopPropagation()}>
      <div className="ctx-head">
        <div>
          <div className="ctx-name">{asset.name}</div>
          <div className="ctx-type">{asset.type}</div>
          <div className="ctx-status"><i />{STATUS_LABEL[asset.status]}</div>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="Close"><X size={15} strokeWidth={1.75} /></button>
      </div>
      <div className="ctx-stats">
        <div className="ctx-stat"><b>{asset.risk}</b><span>Risk</span></div>
        <div className="ctx-stat"><b>{asset.findingCount}</b><span>Findings</span></div>
        <div className="ctx-stat"><b style={{ color: asset.critical ? 'var(--st-critical)' : undefined }}>{asset.critical}</b><span>Critical</span></div>
        <div className="ctx-stat"><b>{asset.high}</b><span>High</span></div>
      </div>
      <div className="ctx-sec">
        <h4>Vulnerabilities</h4>
        {mine.length === 0 && <div className="ctx-plain">No open findings</div>}
        {mine.slice(0, 5).map((f) => (
          <button key={f.id} className="ctx-item" onClick={() => onOpenFinding(f.id)}>
            <SeverityTag level={f.sev} /><span className="ctx-t">{f.title}</span><CweTag cwe={f.cwe} />
          </button>
        ))}
      </div>
      <div className="ctx-sec">
        <h4>Associated attacks</h4>
        {attacks.length === 0 && <div className="ctx-plain">None observed</div>}
        {attacks.slice(0, 3).map((e) => (
          <button key={e.id} className="ctx-item" onClick={() => onOpenEvent(e.id)}>
            <LiveDot active={e.correlation !== 'NONE'} /><span className="ctx-t">{e.technique} · <span className="mono">{e.ip}</span></span><ChevronRight size={12} />
          </button>
        ))}
      </div>
      <div className="ctx-sec">
        <h4>Recent activity</h4>
        {recent.map((r, i) => <div className="ctx-plain" key={i}>{r}</div>)}
      </div>
    </div>
  );
}

export function LiveEventPanel({ events, assets, activeId, onSelect, onOpenFinding }) {
  const name = (id) => (assets.find((a) => a.id === id) || {}).name || id;
  return (
    <aside className="live">
      <div className="live-head">
        <span className="live-tag"><LiveDot active /> Live security events</span>
        <span className="muted mono">{events.length}</span>
      </div>
      <div className="live-feed">
        {events.map((e) => (
          <div key={e.id} className={`ev ${activeId === e.id ? 'on' : ''}`} onClick={() => onSelect(e.id)}>
            <div className="ev-top"><span>{e.ts}</span><span className={`corr-pill ${e.correlation}`}>{e.correlation === 'MATCHED' ? `MATCHED ${e.confidence}%` : e.correlation}</span></div>
            <div className="ev-tech">{e.technique}</div>
            <dl className="ev-kv">
              <dt>Attacker</dt><dd className="mono">{e.ip}</dd>
              <dt>CWE</dt><dd className="mono">{e.cwe}</dd>
              <dt>Target</dt><dd>{name(e.target)}</dd>
              <dt>Source</dt><dd>{e.source}</dd>
              <dt>Finding</dt><dd>{e.finding ? <a className="mono intel-chip" href="#f" onClick={(x) => { x.preventDefault(); x.stopPropagation(); onOpenFinding(e.finding); }}>{e.finding}</a> : '—'}</dd>
              <dt>Risk impact</dt><dd className={e.impact ? 'impact-up' : ''}>{e.impact ? `+${e.impact} on ${name(e.target)}` : 'none'}</dd>
            </dl>
          </div>
        ))}
      </div>
    </aside>
  );
}

const NODE_COLORS = { finding: '#E5533D', attack: '#FF3D71', honeypot: '#4FA090', asset: '#4C9AFF', intel: '#89B8C2' };

// Finding ↔ Attack ↔ Honeypot ↔ Asset ↔ Threat intelligence → risk prioritization
export function CorrelationChain({ pair, assets, intel, onOpenFinding, onOpenSession, onSelectAsset, compact }) {
  const asset = assets.find((a) => a.id === pair.asset);
  const ti = intel[pair.intelIp || pair.ip];
  const nodes = [
    { k: 'finding', icon: Bug, label: 'Finding', t: pair.finding, s: `${pair.title} · ${pair.cwe}`, on: () => onOpenFinding(pair.finding) },
    { k: 'attack', icon: ShieldAlert, label: 'Observed attack', t: pair.ip, s: `${pair.title} attempt · ${pair.time}`, on: () => onOpenSession(pair) },
    { k: 'honeypot', icon: Radio, label: 'Honeypot evidence', t: pair.decoy, s: pair.via, on: () => onOpenSession(pair) },
    { k: 'asset', icon: Server, label: 'Asset', t: asset ? asset.name : pair.asset, s: asset ? `Risk ${asset.risk} · ${asset.findingCount} open` : '', on: () => onSelectAsset && onSelectAsset(pair.asset) },
    { k: 'intel', icon: Fingerprint, label: 'Threat intel', t: ti ? `${ti.score}/100 · ${ti.geo}` : 'No data', s: ti ? `${ti.rep}` : '', on: () => {} },
  ];
  return (
    <div className="chain-wrap">
      <div className="chain">
        {nodes.map((n) => (
          <button key={n.k} className="chain-node" style={{ '--c': NODE_COLORS[n.k] }} onClick={n.on}>
            <div className="k"><n.icon size={12} strokeWidth={1.75} />{n.label}</div>
            <div className="t">{n.t}</div>
            <div className="s">{n.s}</div>
          </button>
        ))}
      </div>
      <div className="chain-result">
        <span className="corr-pill MATCHED">MATCHED · {pair.cwe}</span>
        <div className="conf"><span className="muted">Confidence {pair.confidence}%</span><div className="conf-track"><div className="conf-fill" style={{ width: `${pair.confidence}%` }} /></div></div>
        <span className="muted">AI risk engine →</span>
        <span className="risk-shift">{pair.history.join(' → ')}</span>
      </div>
    </div>
  );
}
