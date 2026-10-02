import { Link2 } from 'lucide-react';
import { Chip, LiveDot } from '../components/Shared';

const BARS = [3, 5, 4, 8, 6, 9, 7, 12, 10, 14, 9, 13];

export default function HoneypotView({ sessions, events, pairs, intel, assets, onOpenSession, onOpenFinding }) {
  const ips = new Set(sessions.map((s) => s.ip));
  const decoys = new Set(sessions.map((s) => s.decoy));
  const name = (id) => (assets.find((a) => a.id === id) || {}).name || id;
  return (
    <>
      <div className="hp-strip">
        <div><b>{sessions.length}</b><span>Sessions</span></div>
        <div><b>{ips.size}</b><span>Attacker IPs</span></div>
        <div><b>{decoys.size}</b><span>Decoys touched</span></div>
        <div><span>Events / hour</span><div className="hp-bars">{BARS.map((h, i) => <i key={i} style={{ height: `${h * 7}%` }} />)}</div></div>
      </div>
      <div className="panel panel-signal" style={{ marginBottom: 18 }}>
        <div className="panel-header"><span><LiveDot active /> Live intelligence stream</span><span className="panel-header-sub">Cowrie · traffic monitor · updates as events arrive</span></div>
        <div className="feed feed-wide">
          {events.slice(0, 5).map((e) => (
            <div className="ev" key={e.id} style={{ cursor: 'default' }}>
              <div className="ev-top"><span>{e.ts} · {e.source}</span><span className={`corr-pill ${e.correlation}`}>{e.correlation}</span></div>
              <div className="ev-tech"><span className="mono">{e.ip}</span> · {e.technique} → {name(e.target)} <span className="tech-chip">{e.cwe}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><span>Session log</span><span className="panel-header-sub">deception depth: credentials, topology, escalation paths</span></div>
        <div className="feed feed-wide">
          {sessions.map((s, i) => {
            const pair = pairs.find((p) => p.ip === s.ip && p.time === s.time);
            const ti = intel[s.ip];
            return (
              <div className="feed-row feed-row-clickable" key={i} onClick={() => onOpenSession(s)}>
                <div className="feed-top"><span className="mono">{s.ip}</span><Chip>{s.proto}</Chip><Chip>{s.decoy}</Chip><span className="muted">{s.dur}</span><span className="feed-time">{s.time}</span></div>
                <div className="feed-detail">{s.detail}</div>
                <div className="feed-bottom">
                  <span className="feed-tag"><LiveDot active={s.live} /> {s.tag}</span>
                  {ti && <span className="intel-chip">rep {ti.score} · {ti.geo} · {ti.tags.join(', ')}</span>}
                  {pair && <button className="linked-chip" onClick={(e) => { e.stopPropagation(); onOpenFinding(pair.finding, { kind: 'session', session: s }); }}><Link2 size={11} strokeWidth={1.75} /> Linked · {pair.finding}</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
