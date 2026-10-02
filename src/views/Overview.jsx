import Environment from '../components/Environment';
import { AssetPanel, LiveEventPanel, CorrelationChain } from '../components/Panels';
import { overallRisk, openFindings } from '../lib/derive';

const LEGEND = [['healthy', 'Healthy'], ['warning', 'Warning'], ['critical', 'Critical'], ['attack', 'Under attack'], ['scanning', 'Scanning']];

export default function Overview({ assets, edges, findings, events, pairs, intel, activity, attack, scanning,
  selectedAsset, onSelectAsset, activeEventId, onSelectEvent, onOpenFinding, onOpenSession, scanLabel }) {
  const open = openFindings(findings);
  const critical = open.filter((f) => f.sev === 'critical').length;
  const matched = new Set([...pairs.map((p) => p.finding), ...events.filter((e) => e.correlation === 'MATCHED').map((e) => e.finding)]);
  const risk = overallRisk(assets);
  const selected = assets.find((a) => a.id === selectedAsset);
  const activeEvent = events.find((e) => e.id === activeEventId) || events.find((e) => e.correlation === 'MATCHED');
  const pair = pairs.find((p) => activeEvent && p.finding === activeEvent.finding) || pairs[0];
  const live = attack || (activeEvent && { path: activeEvent.path, target: activeEvent.target });

  return (
    <div className="ov">
      <div className="ov-stage">
        <div className="env-stage">
          <Environment assets={assets} edges={edges} selectedId={selectedAsset} onSelect={onSelectAsset} attack={attack || (activeEventId ? live : null)} scanning={scanning} />
          <div className="hud hud-tl">
            <div><div className={`hud-metric-v ${risk >= 60 ? 'warn' : ''}`}>{risk}</div><div className="hud-metric-l">Posture risk</div></div>
            <div><div className="hud-metric-v danger">{critical}</div><div className="hud-metric-l">Critical</div></div>
            <div><div className="hud-metric-v">{events.length}</div><div className="hud-metric-l">Attacks seen</div></div>
            <div><div className="hud-metric-v intel">{matched.size}</div><div className="hud-metric-l">Correlated</div></div>
          </div>
          <div className="hud hud-scan"><span className={`dot ${scanLabel ? 'dot-live' : ''}`} />{scanLabel || 'Scanners idle · next run 5h 46m'}</div>
          <div className="hud hud-bl">
            {LEGEND.map(([k, l]) => <span className="legend-i" key={k} style={{ '--c': `var(--st-${k})` }}><i className="legend-d" />{l}</span>)}
          </div>
          {selected && <AssetPanel asset={selected} findings={findings} events={events} activity={activity}
            onClose={() => onSelectAsset(null)} onOpenFinding={onOpenFinding} onOpenEvent={onSelectEvent} />}
        </div>
        {pair && <CorrelationChain pair={pair} assets={assets} intel={intel} onOpenFinding={onOpenFinding} onOpenSession={onOpenSession} onSelectAsset={onSelectAsset} />}
      </div>
      <LiveEventPanel events={events} assets={assets} activeId={activeEventId} onSelect={onSelectEvent} onOpenFinding={onOpenFinding} />
    </div>
  );
}
