import { CorrelationChain } from '../components/Panels';

const STORY = ['Scanners find vulnerabilities', 'Honeypots observe behavior', 'Threat intel adds context', 'Correlation links them', 'AI risk engine prioritizes'];

export default function CorrelationView({ pairs, assets, intel, onOpenFinding, onOpenSession, onSelectAsset }) {
  return (
    <div className="panel panel-signal">
      <div className="panel-header"><span>Correlation engine</span><span className="panel-header-sub">{pairs.length} open findings re-prioritized by live attacker activity</span></div>
      <div className="corr-story">{STORY.map((s, i) => <span key={s}><b className="mono">{i + 1}</b>{s}</span>)}</div>
      {pairs.map((p) => (
        <CorrelationChain key={p.finding} pair={p} assets={assets} intel={intel} onOpenFinding={onOpenFinding} onOpenSession={onOpenSession} onSelectAsset={onSelectAsset} />
      ))}
    </div>
  );
}
