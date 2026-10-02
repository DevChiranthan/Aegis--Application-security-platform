import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { SEV_LABEL } from '../data/api';
import { DistBar, BarList } from '../components/Shared';

export default function ReportsView({ findings, pairs, pushToast }) {
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState([
    { name: 'Weekly summary — Sep 5', size: '212 KB' },
    { name: 'Weekly summary — Aug 29', size: '198 KB' },
  ]);

  const open = findings.filter((f) => f.status !== 'Resolved');
  const sevCounts = ['critical', 'high', 'medium', 'low'].map((s) => ({
    label: SEV_LABEL[s],
    value: open.filter((f) => f.sev === s).length,
    color: `var(--sev-${s})`,
  }));
  const toolCounts = ['Semgrep', 'Trivy', 'Gitleaks', 'ZAP'].map((t) => ({
    label: t,
    value: findings.filter((f) => f.tool === t).length,
  }));

  function generate() {
    if (generating) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReports((r) => [
        { name: 'Weekly summary — Sep 12', size: '224 KB' },
        ...r,
      ]);
      pushToast('Report generated — aegis-report-2026-09-12.pdf', 'signal');
    }, 1300);
  }

  return (
    <div className="reports-grid">
      <div className="panel">
        <div className="panel-header">
          <span>Last scan</span>
        </div>
        <div className="drawer-section" style={{ padding: '14px 18px' }}>
          <div className="drawer-row">
            <span className="drawer-row-label">Completed</span>
            <span>14 minutes ago</span>
          </div>
          <div className="drawer-row">
            <span className="drawer-row-label">Duration</span>
            <span>3m 42s</span>
          </div>
          <div className="drawer-row">
            <span className="drawer-row-label">Tools run</span>
            <span>Semgrep, Trivy, Gitleaks, ZAP</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Findings by severity</span>
        </div>
        <div style={{ padding: '14px 18px' }}>
          <DistBar segments={sevCounts} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Findings by source</span>
        </div>
        <div style={{ padding: '14px 18px' }}>
          <BarList items={toolCounts} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Correlation summary</span>
        </div>
        <div className="drawer-section" style={{ padding: '14px 18px' }}>
          <div className="drawer-row">
            <span className="drawer-row-label">Matches this week</span>
            <span>{pairs.length}</span>
          </div>
          <div className="drawer-row">
            <span className="drawer-row-label">Avg. re-prioritization</span>
            <span>+1.3 severity levels</span>
          </div>
        </div>
      </div>

      <div className="panel reports-panel-wide">
        <div className="panel-header">
          <span>Generate report</span>
          <button className="btn-run" onClick={generate} disabled={generating}>
            {generating ? (
              <>
                <Loader2 size={13} strokeWidth={1.75} className="spin" />{' '}
                Generating…
              </>
            ) : (
              <>
                <FileText size={13} strokeWidth={1.75} /> Generate report
              </>
            )}
          </button>
        </div>
        <div className="report-list">
          {reports.map((r, i) => (
            <div className="report-row" key={i}>
              <FileText size={14} strokeWidth={1.75} className="asset-icon" />
              <span>{r.name}</span>
              <span className="muted">{r.size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

