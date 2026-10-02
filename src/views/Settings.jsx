import { useState } from 'react';
import { LiveDot, Toggle, Segmented } from '../components/Shared';

export default function SettingsView() {
  const [autoScan, setAutoScan] = useState(true);
  const [depth, setDepth] = useState('High');
  const [sensitivity, setSensitivity] = useState('Medium');

  const scanners = [
    { name: 'Semgrep', version: 'v1.78.0', status: 'Operational' },
    { name: 'Trivy', version: 'v0.52.0', status: 'Operational' },
    { name: 'Gitleaks', version: 'v8.18.2', status: 'Operational' },
    { name: 'ZAP', version: 'v2.15.0', status: 'Queued' },
  ];

  return (
    <div className="settings-grid">
      <div className="panel">
        <div className="panel-header">
          <span>Scan schedule</span>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row-title">Automatic scanning</div>
            <div className="settings-row-sub muted">
              Full scan every 6 hours. Next run in 5h 46m.
            </div>
          </div>
          <Toggle checked={autoScan} onChange={setAutoScan} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Scanner status</span>
        </div>
        {scanners.map((s) => (
          <div className="settings-row settings-row-compact" key={s.name}>
            <div className="settings-row-main">
              <LiveDot active={s.status === 'Operational'} />
              <span>{s.name}</span>
              <span className="muted mono">{s.version}</span>
            </div>
            <span className="muted">{s.status}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Honeypot status</span>
        </div>
        <div className="settings-row">
          <div className="settings-row-main">
            <LiveDot active /> Cowrie
          </div>
          <span className="muted">
            Running · 14d 6h uptime · 3 active sessions
          </span>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row-title">Deception depth</div>
            <div className="settings-row-sub muted">
              Fake credentials, topology, and near-miss escalation paths.
            </div>
          </div>
          <Segmented
            options={['Low', 'Medium', 'High']}
            value={depth}
            onChange={setDepth}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Correlation sensitivity</span>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row-title">Match threshold</div>
            <div className="settings-row-sub muted">
              How closely a honeypot technique must match a finding's CWE before
              it's re-prioritized.
            </div>
          </div>
          <Segmented
            options={['Low', 'Medium', 'High']}
            value={sensitivity}
            onChange={setSensitivity}
          />
        </div>
      </div>
    </div>
  );
}

