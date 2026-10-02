import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { SeverityTag, CweTag, StatusText, LiveDot, Segmented } from '../components/Shared';

export default function FindingsView({ findings, assets, search, onOpenFinding, selectedId }) {
  const [sev, setSev] = useState('All');
  const q = search.trim().toLowerCase();
  const name = (id) => (assets.find((a) => a.id === id) || {}).name || '—';
  const rows = findings.filter((f) => (sev === 'All' || f.sev === sev.toLowerCase()) &&
    (!q || [f.id, f.title, f.cwe, name(f.asset)].some((s) => s.toLowerCase().includes(q))));
  return (
    <div className="panel">
      <div className="panel-header">
        <span>All findings <span className="panel-header-sub">{rows.length} of {findings.length}</span></span>
        <Segmented options={['All', 'Critical', 'High', 'Medium', 'Low']} value={sev} onChange={setSev} />
      </div>
      <table>
        <thead><tr><th>ID</th><th>Finding</th><th>CWE</th><th>Asset</th><th>Scanner</th><th>Severity</th><th>Status</th><th>Correlation</th><th /></tr></thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className={`row-clickable ${selectedId === f.id ? 'row-selected' : ''}`} onClick={() => onOpenFinding(f.id)}>
              <td className="mono muted">{f.id}</td><td>{f.title}</td><td><CweTag cwe={f.cwe} /></td>
              <td className="muted">{name(f.asset)}</td><td className="muted">{f.scanner}</td>
              <td><SeverityTag level={f.sev} /></td><td><StatusText status={f.status} /></td>
              <td>{f.correlated ? <span className="corr-yes"><LiveDot active /> matched</span> : <span className="muted">—</span>}</td>
              <td><ChevronRight size={14} strokeWidth={1.75} className="row-chevron" /></td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={9} className="empty-row muted">No findings match</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
