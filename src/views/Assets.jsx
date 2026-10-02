import Environment, { STATUS_LABEL } from '../components/Environment';
import { AssetPanel } from '../components/Panels';

export default function AssetsView({ assets, edges, findings, events, activity, attack, scanning, selectedAsset, onSelectAsset, onOpenFinding, onSelectEvent }) {
  const selected = assets.find((a) => a.id === selectedAsset);
  return (
    <div className="assets-split">
      <div className="env-stage">
        <Environment assets={assets} edges={edges} selectedId={selectedAsset} onSelect={onSelectAsset} attack={attack} scanning={scanning} compact />
        {selected && <AssetPanel asset={selected} findings={findings} events={events} activity={activity} onClose={() => onSelectAsset(null)} onOpenFinding={onOpenFinding} onOpenEvent={onSelectEvent} />}
      </div>
      <aside className="live">
        <div className="live-head"><span>Assets</span><span className="muted mono">{assets.length}</span></div>
        <div className="live-feed">
          {assets.map((a) => (
            <div key={a.id} className={`ev ${selectedAsset === a.id ? 'on' : ''}`} onClick={() => onSelectAsset(a.id)}>
              <div className="ev-top"><span>{a.type}</span><span style={{ color: `var(--st-${a.status})` }}>● {STATUS_LABEL[a.status]}</span></div>
              <div className="ev-tech">{a.name}</div>
              <div className="ev-kv"><dt>Risk</dt><dd className="mono">{a.risk}</dd><dt>Open findings</dt><dd>{a.findingCount}{a.critical ? ` · ${a.critical} critical` : ''}</dd></div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
