import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { SeverityTag, CweTag, StatusText, LiveDot, Chip, Timeline } from './Shared';

export default function Drawer({
  pairs,
  actions,
  assets,
  drawer,
  findings,
  onClose,
  onMarkTriaged,
  onOpenFinding,
  onOpenSession,
}) {
  const open = !!drawer;
  let content = null;

  if (drawer && drawer.kind === 'finding') {
    const finding = findings.find((f) => f.id === drawer.id);
    const pair = finding ? pairs.find((p) => p.finding === finding.id) : null;
    if (finding) {
      content = (
        <>
          <div className="drawer-header">
            <div>
              <div className="drawer-id mono">{finding.id}</div>
              <div className="drawer-title">{finding.title}</div>
            </div>
            <button className="drawer-close" onClick={onClose}>
              <X size={16} strokeWidth={1.75} />
            </button>
          </div>
          <div className="drawer-tags">
            <SeverityTag level={finding.sev} large />
            <CweTag cwe={finding.cwe} />
          </div>

          <div className="drawer-divider" />

          <div className="drawer-section">
            <div className="drawer-section-title">Why this matters</div>
            <div className="drawer-row"><span className="drawer-row-label">Scanner</span><span>{finding.scanner}</span></div>
            <div className="drawer-row"><span className="drawer-row-label">Affected asset</span><span>{(assets.find((a) => a.id === finding.asset) || {}).name || '—'}</span></div>
            <div className="drawer-row"><span className="drawer-row-label">Status</span><StatusText status={finding.status} /></div>
            <div className="drawer-row"><span className="drawer-row-label">Correlation</span>{pair ? <span className="corr-pill MATCHED">MATCHED · {pair.confidence}%</span> : <span className="muted">No match</span>}</div>
            <div className="drawer-row drawer-row-block"><span className="drawer-row-label">Evidence</span><div className="evidence-code">{finding.evidence}</div></div>
            <div className="drawer-row drawer-row-block">
              <span className="drawer-row-label">Live attacker evidence</span>
              {pair ? (
                <div className="evidence">
                  <div className="evidence-top">
                    <LiveDot active /> <span className="mono">{pair.ip}</span>
                  </div>
                  <div className="evidence-detail">{pair.via}</div>
                </div>
              ) : (
                <span className="muted">No live match yet</span>
              )}
            </div>
          </div>

          <div className="drawer-divider" />

          <div className="drawer-section">
            <div className="drawer-section-title">Risk history</div>
            <Timeline
              steps={
                pair
                  ? pair.history
                  : [finding.sev.charAt(0).toUpperCase() + finding.sev.slice(1)]
              }
            />
          </div>

          <div className="drawer-divider" />

          <div className="drawer-section">
            <div className="drawer-section-title">Recommended action</div>
            <p className="drawer-action-text">{actions[finding.id]}</p>
          </div>

          <div className="drawer-actions">
            <button
              className="btn-secondary"
              disabled={
                finding.status === 'Triaged' || finding.status === 'Resolved'
              }
              onClick={() => onMarkTriaged(finding.id)}
            >
              {finding.status === 'Triaged' ? (
                <>
                  <Check size={13} strokeWidth={1.75} /> Triaged
                </>
              ) : (
                'Mark triaged'
              )}
            </button>
            <button
              className="btn-ghost"
              disabled={!pair}
              onClick={() =>
                pair && onOpenSession(pair, { kind: 'finding', id: finding.id })
              }
            >
              View evidence
            </button>
          </div>
        </>
      );
    }
  }

  if (drawer && drawer.kind === 'session') {
    const session = drawer.session;
    const pair = session ? pairs.find((p) => p.ip === session.ip && p.time === session.time) : null;
    if (session) {
      content = (
        <>
          <div className="drawer-header">
            <div>
              <div className="drawer-id mono">{session.ip}</div>
              <div className="drawer-title">Honeypot session</div>
            </div>
            <button className="drawer-close" onClick={onClose}>
              <X size={16} strokeWidth={1.75} />
            </button>
          </div>
          <div className="drawer-tags">
            <Chip>{session.proto}</Chip>
            {session.live && (
              <span className="corr-yes">
                <LiveDot active /> live
              </span>
            )}
          </div>

          <div className="drawer-divider" />

          <div className="drawer-section">
            <div className="drawer-row">
              <span className="drawer-row-label">Duration</span>
              <span>{session.dur}</span>
            </div>
            <div className="drawer-row">
              <span className="drawer-row-label">Observed</span>
              <span>{session.time}</span>
            </div>
            <div className="drawer-row drawer-row-block">
              <span className="drawer-row-label">Behavior</span>
              <span>{session.detail}</span>
            </div>
            <div className="drawer-row">
              <span className="drawer-row-label">Technique</span>
              <span>{session.tag}</span>
            </div>
          </div>

          {pair && (
            <>
              <div className="drawer-divider" />
              <div className="drawer-section">
                <div className="drawer-section-title">Linked finding</div>
                <button
                  className="linked-finding"
                  onClick={() =>
                    onOpenFinding(pair.finding, { kind: 'session', session })
                  }
                >
                  <span className="mono">{pair.finding}</span>
                  <span className="linked-finding-title">{pair.title}</span>
                  <ChevronRight size={14} strokeWidth={1.75} />
                </button>
              </div>
            </>
          )}
        </>
      );
    }
  }

  return (
    <>
      <div className={`overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`}>
        {drawer && drawer.returnTo && (
          <button
            className="drawer-back"
            onClick={() => {
              const rt = drawer.returnTo;
              if (rt.kind === 'session') onOpenSession(rt.session, null);
              else onOpenFinding(rt.id, null);
            }}
          >
            <ChevronLeft size={13} strokeWidth={1.75} /> Back to{' '}
            {drawer.returnTo.kind === 'session'
              ? drawer.returnTo.session.ip
              : drawer.returnTo.id}
          </button>
        )}
        {content}
      </aside>
    </>
  );
}

