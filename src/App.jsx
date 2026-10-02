import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Activity, ListChecks, Radio, GitMerge, Server, FileText, Settings as SettingsIcon, Check, Loader2, RefreshCw, Building2, Shield, ChevronDown, ArrowUpRight } from 'lucide-react';
import { getSnapshot } from './data/api';
import { useSimulation } from './lib/useSimulation';
import { enrichAssets } from './lib/derive';
import Drawer from './components/Drawer';
import Overview from './views/Overview';
import FindingsView from './views/Findings';
import HoneypotView from './views/Honeypot';
import CorrelationView from './views/Correlation';
import AssetsView from './views/Assets';
import SettingsView from './views/Settings';
import SecurityOffice from './views/SecurityOffice';
import Briefs from './views/Briefs';

const NAV = [
  { id: 'office', label: 'Security office', icon: Building2 },
  { id: 'overview', label: 'Live environment', icon: Activity },
  { id: 'findings', label: 'Findings', icon: ListChecks },
  { id: 'honeypot', label: 'Honeypot intel', icon: Radio },
  { id: 'correlation', label: 'Correlation engine', icon: GitMerge },
  { id: 'assets', label: 'Assets', icon: Server },
  { id: 'reports', label: 'Reports & escalations', icon: FileText },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function AegisApp() {
  const snapshot = useMemo(() => getSnapshot(), []);
  const [view, setView] = useState('office');
  const [escalated, setEscalated] = useState(false);
  const [drawer, setDrawer] = useState(null);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState([]);
  const [scanState, setScanState] = useState('idle');
  const [scanStep, setScanStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);
  const searchRef = useRef(null);
  const scanTools = ['Semgrep', 'Trivy', 'Gitleaks', 'ZAP'];
  const scanOrder = ['web', 'cicd', 'gateway', 'admin'];

  function pushToast(message, tone) {
    const id = Date.now() + Math.random();
    setToasts((x) => [...x, { id, message, tone }]);
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 3200);
  }

  const sim = useSimulation(snapshot, pushToast, view === 'overview' || view === 'honeypot' || view === 'assets' || view === 'correlation');
  const { findings, setFindings, events, attack, scanning, setScanning } = sim;
  const assets = useMemo(() => enrichAssets(sim.assets, findings), [sim.assets, findings]);
  const shared = { assets, edges: snapshot.edges, findings, events, pairs: snapshot.pairs, intel: snapshot.intel, activity: snapshot.activity, attack, scanning };

  useEffect(() => {
    function handler(e) {
      const tag = document.activeElement && document.activeElement.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); searchRef.current && searchRef.current.focus(); }
      if (e.key === 'Escape') { setDrawer(null); setSelectedAsset(null); }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function markTriaged(id) {
    setFindings((fs) => fs.map((f) => (f.id === id ? { ...f, status: 'Triaged' } : f)));
    pushToast(`${id} marked as triaged`, 'default');
  }
  const openFinding = (id, returnTo) => setDrawer({ kind: 'finding', id, returnTo: returnTo || null });
  const openSession = (ref, returnTo) => {
    const session = snapshot.sessions.find((s) => s.ip === ref.ip && s.time === ref.time) || ref;
    setDrawer({ kind: 'session', session, returnTo: returnTo || null });
  };
  const selectEvent = (id) => {
    setActiveEventId((cur) => (cur === id ? null : id));
    const e = events.find((x) => x.id === id);
    if (e) setSelectedAsset(e.target);
    if (view !== 'overview' && view !== 'assets') setView('overview');
  };
  function selectAsset(id) { setSelectedAsset(id); if (view === 'correlation' || view === 'honeypot') setView('assets'); }

  function runScan() {
    if (scanState === 'running') return;
    setScanState('running'); setScanStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i++; setScanStep(i);
      setScanning(i <= scanOrder.length ? { [scanOrder[i - 1]]: true } : {});
      if (i >= scanTools.length) {
        clearInterval(iv);
        setTimeout(() => {
          setScanning({}); setScanState('done');
          pushToast('Scan complete — 1 finding re-prioritized', 'signal');
          setTimeout(() => setScanState('idle'), 1600);
        }, 700);
      }
    }, 900);
  }

  const scanLabel = scanState === 'running' ? `${scanTools[Math.max(0, scanStep - 1)]} scanning…` : Object.values(scanning).some(Boolean) ? 'Scanner running…' : null;
  const current = NAV.find((n) => n.id === view);
  const selectedId = drawer && drawer.kind === 'finding' ? drawer.id : null;
  const navPrimary = NAV.slice(0, 5);
  const navSecondary = NAV.slice(5);
  const flush = view === 'overview' || view === 'assets';

  return (
    <div className="aegis">
      <aside className="sidebar">
        <div className="brand">
          <Shield size={28} strokeWidth={1.6} className="brand-shield" />
          <span className="brand-name">aegis<span className="brand-period">.</span></span>
        </div>
        <div className="workspace-switch"><div className="workspace-logo">J</div><div>Juice Shop<span>Demo workspace</span></div><ChevronDown size={14}/></div><div className="nav-label">WORKSPACE</div><nav className="nav">
          {navPrimary.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${view === n.id ? 'active' : ''}`}
              onClick={() => setView(n.id)}
            >
              <n.icon size={17} strokeWidth={1.75} className="nav-icon" />
              {n.label}{n.id==='office'&&<span className="nav-new">06</span>}
            </button>
          ))}
          <div className="nav-divider" />
          {navSecondary.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${view === n.id ? 'active' : ''}`}
              onClick={() => setView(n.id)}
            >
              <n.icon size={17} strokeWidth={1.75} className="nav-icon" />
              {n.label}{n.id==='office'&&<span className="nav-new">06</span>}
            </button>
          ))}
        </nav><div className="sidebar-bottom"><div className="demo-notice"><span className="demo-pill">PROTOTYPE</span><p>A working look at your future security team.</p><span>Sample data · no live scans</span></div><div className="profile-row"><div className="profile-initials">CR</div><div>Chiranthan Reddy<span>Workspace owner</span></div></div></div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">{current.label}</span>
            <span className="topbar-divider" />
            <span className="topbar-env">Workspace / staging</span>
          </div>
          <div className="topbar-right"><span className="demo-pill top-demo">DEMO MODE</span>
            <div className="search-wrap">
              <Search size={13} strokeWidth={1.75} className="search-icon" />
              <input
                ref={searchRef}
                className="search"
                placeholder="Search findings…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); if(e.target.value) setView('findings'); }}
              />
              {search === '' && <span className="kbd-hint">/</span>}
            </div>
            <button
              className="btn-run"
              onClick={runScan}
              disabled={scanState === 'running'}
            >
              {scanState === 'idle' && (
                <>
                  <RefreshCw size={13} strokeWidth={1.75} /> Demo scan
                </>
              )}
              {scanState === 'running' && (
                <>
                  <Loader2 size={13} strokeWidth={1.75} className="spin" />{' '}
                  {scanTools[Math.max(0, scanStep - 1)] || 'Starting'}…
                </>
              )}
              {scanState === 'done' && (
                <>
                  <Check size={13} strokeWidth={1.75} /> Done
                </>
              )}
            </button>
          </div>
        </header>

        <div className={`content ${flush ? 'content-flush' : ''} ${view==='office'?'office-content':''}`}>
          <div style={{display:view==='office'?'block':'none'}}><SecurityOffice findings={findings} onNavigate={setView} onOpenFinding={openFinding} escalated={escalated} onEscalate={()=>setEscalated(true)}/></div>
          {view === 'overview' && <Overview {...shared} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} activeEventId={activeEventId} onSelectEvent={selectEvent} onOpenFinding={openFinding} onOpenSession={openSession} scanLabel={scanLabel} />}
          {view === 'findings' && <FindingsView findings={findings} assets={assets} search={search} onOpenFinding={openFinding} selectedId={selectedId} />}
          {view === 'honeypot' && <HoneypotView {...shared} sessions={snapshot.sessions} onOpenSession={openSession} onOpenFinding={openFinding} />}
          {view === 'correlation' && <CorrelationView {...shared} onOpenFinding={openFinding} onOpenSession={openSession} onSelectAsset={selectAsset} />}
          {view === 'assets' && <AssetsView {...shared} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} onOpenFinding={openFinding} onSelectEvent={selectEvent} />}
          {view === 'reports' && <Briefs findings={findings} onOpenFinding={openFinding} escalated={escalated} onEscalate={()=>{setEscalated(true);pushToast('Demo escalation approved — no external message sent');}} />}
          {view === 'settings' && <SettingsView />}
        </div>
      </div>

      <Drawer drawer={drawer} findings={findings} assets={assets} pairs={snapshot.pairs} actions={snapshot.actions}
        onClose={() => setDrawer(null)} onMarkTriaged={markTriaged} onOpenFinding={openFinding} onOpenSession={openSession} />

      <div className="toast-stack">
        {toasts.map((t) => (
          <div
            className={`toast ${t.tone === 'signal' ? 'toast-signal' : ''}`}
            key={t.id}
          >
            <Check size={14} strokeWidth={1.75} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
