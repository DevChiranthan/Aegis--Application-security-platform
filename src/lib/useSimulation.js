import { useEffect, useRef, useState } from 'react';
import { subscribe } from '../data/api';
import { nowClock } from './derive';

const NEW_FINDINGS = {
  ZAP: { title: 'Missing rate limiting on /rest/user/login', cwe: 'CWE-307', sev: 'medium' },
  Gitleaks: { title: 'Slack webhook token in .github/workflows', cwe: 'CWE-798', sev: 'high' },
};

// Frontend-only live simulation. Same state shape a real event stream would feed.
export function useSimulation(snapshot, pushToast, enabled = true) {
  const [assets, setAssets] = useState(snapshot.assets);
  const [findings, setFindings] = useState(snapshot.findings);
  const [events, setEvents] = useState(snapshot.events);
  const [attack, setAttack] = useState(null);
  const [scanning, setScanning] = useState({});
  const timers = useRef([]);
  const counter = useRef(1043);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const patch = (id, fn) => setAssets((as) => as.map((a) => (a.id === id ? { ...a, ...fn(a) } : a)));
  const settle = (a) => ({ status: a.risk >= 60 ? 'critical' : a.risk >= 35 ? 'warning' : 'healthy' });

  function run(s) {
    if (s.type === 'attack') {
      const id = `evt-${Date.now()}`;
      const evt = { id, ts: nowClock(), ip: s.ip, technique: s.technique, cwe: s.cwe, target: s.target, source: s.source,
        correlation: 'PENDING', impact: 0, confidence: 0, finding: s.finding, path: s.path, note: s.note };
      setEvents((e) => [evt, ...e].slice(0, 30));
      setAttack({ id, path: s.path, target: s.target });
      patch(s.target, () => ({ status: 'attack' }));
      later(() => {
        setEvents((e) => e.map((x) => (x.id === id ? { ...x, correlation: 'MATCHED', impact: s.impact, confidence: s.confidence } : x)));
        patch(s.target, (a) => ({ risk: Math.min(99, a.risk + s.impact) }));
        pushToast(`Correlation detected — ${s.finding} ↔ ${s.ip}`, 'signal');
      }, 2600);
      later(() => { setAttack((a) => (a && a.id === id ? null : a)); patch(s.target, settle); }, 7000);
    } else if (s.type === 'scan') {
      setScanning((x) => ({ ...x, [s.target]: true }));
      later(() => {
        setScanning((x) => ({ ...x, [s.target]: false }));
        const n = NEW_FINDINGS[s.tool];
        if (!n) return;
        const id = `AEG-${counter.current++}`;
        setFindings((f) => [{ id, ...n, tool: s.tool, scanner: s.tool, status: 'Open', correlated: false, asset: s.target,
          evidence: `${s.tool} rule match on ${s.target} (auto-detected)` }, ...f]);
        pushToast(`${s.tool} finished — new finding ${id}`, 'signal');
      }, 3400);
    } else if (s.type === 'degrade') {
      patch(s.target, () => ({ status: 'warning' }));
      pushToast('Redis latency degraded — asset marked Warning', 'default');
      later(() => patch(s.target, () => ({ status: 'healthy' })), 9000);
    }
  }

  useEffect(() => {
    if (!enabled) return;
    const un = subscribe(run);
    return () => { un(); timers.current.forEach(clearTimeout); timers.current = []; };
  }, [enabled]);

  return { assets, findings, setFindings, events, attack, scanning, setScanning };
}
