// The only module the UI touches for data. Swap the bodies for fetch() calls later;
// the returned shapes are the contract.
import * as legacy from './legacy';
import * as env from './environment';

export function getSnapshot() {
  return {
    assets: env.ASSET_NODES, edges: env.EDGES, findings: legacy.FINDINGS.map((f) => ({
      ...f, scanner: f.tool, asset: env.FINDING_ASSET[f.id], evidence: env.FINDING_EVIDENCE[f.id],
    })),
    sessions: legacy.SESSIONS.map((s) => ({ ...s, decoy: env.SESSION_DECOY[s.ip] })),
    pairs: legacy.PAIRS.map((p) => ({ ...p, ...env.PAIR_META[p.finding] })),
    intel: env.INTEL, activity: env.ASSET_ACTIVITY, events: env.SEED_EVENTS, actions: legacy.ACTIONS,
  };
}
// Live-event source. Returns an unsubscribe fn. Replace with SSE/WebSocket.
export function subscribe(onScenario, everyMs = 8000) {
  let i = 0;
  const iv = setInterval(() => onScenario(env.SCENARIOS[i++ % env.SCENARIOS.length]), everyMs);
  const first = setTimeout(() => onScenario(env.SCENARIOS[i++ % env.SCENARIOS.length]), 2500);
  return () => { clearInterval(iv); clearTimeout(first); };
}
export { SEV_LABEL } from './legacy';
