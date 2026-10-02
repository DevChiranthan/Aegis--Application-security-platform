// Environment data model. Every shape here maps 1:1 to what the backend will return
// (see api.js) — the UI never imports this file directly, only through api.js.

export const ASSET_NODES = [
  { id: 'traffic',  name: 'External traffic', type: 'Internet / users',  icon: 'globe',    x: 90,  y: 290, status: 'healthy',  risk: 12 },
  { id: 'honeypot', name: 'Honeypot',         type: 'Cowrie decoy net',  icon: 'radar',    x: 290, y: 90,  status: 'healthy',  risk: 5  },
  { id: 'gateway',  name: 'API Gateway',      type: 'API',               icon: 'network',  x: 320, y: 290, status: 'attack',   risk: 72 },
  { id: 'web',      name: 'Juice Shop',       type: 'Web application',   icon: 'app',      x: 560, y: 150, status: 'critical', risk: 81 },
  { id: 'admin',    name: 'Admin Portal',     type: 'Internal tool',     icon: 'admin',    x: 560, y: 430, status: 'critical', risk: 64 },
  { id: 'postgres', name: 'PostgreSQL',       type: 'Database',          icon: 'db',       x: 810, y: 300, status: 'warning',  risk: 38 },
  { id: 'redis',    name: 'Redis',            type: 'Cache / flag store',icon: 'redis',    x: 810, y: 110, status: 'healthy',  risk: 9  },
  { id: 'cicd',     name: 'CI/CD pipeline',   type: 'GitHub Actions',    icon: 'git',      x: 320, y: 480, status: 'warning',  risk: 55 },
];

// kind: 'flow' = runtime traffic, 'deploy' = pipeline, 'intel' = honeypot ↔ asset correlation link
export const EDGES = [
  { from: 'traffic', to: 'gateway', kind: 'flow' },
  { from: 'traffic', to: 'honeypot', kind: 'flow' },
  { from: 'gateway', to: 'web', kind: 'flow' },
  { from: 'gateway', to: 'admin', kind: 'flow' },
  { from: 'web', to: 'postgres', kind: 'flow' },
  { from: 'admin', to: 'postgres', kind: 'flow' },
  { from: 'web', to: 'redis', kind: 'flow' },
  { from: 'cicd', to: 'web', kind: 'deploy' },
  { from: 'cicd', to: 'admin', kind: 'deploy' },
  { from: 'honeypot', to: 'gateway', kind: 'intel' },
];

// finding id -> asset id, plus evidence text
export const FINDING_ASSET = {
  'AEG-1042': 'web', 'AEG-1039': 'cicd', 'AEG-1035': 'web', 'AEG-1031': 'web',
  'AEG-1028': 'admin', 'AEG-1024': 'gateway', 'AEG-1019': 'gateway',
  'AEG-1015': 'gateway', 'AEG-1011': 'web', 'AEG-1006': 'admin',
};
export const FINDING_EVIDENCE = {
  'AEG-1042': "app/routes/search.ts:34 — query built via string concatenation: `SELECT * FROM Products WHERE name LIKE '%${q}%'`",
  'AEG-1039': 'deploy/release.sh:12 — AKIA… access key committed in commit 9c1e4f2',
  'AEG-1035': 'POST /feedback reflects <script> payload unescaped in response body (ZAP alert 40012)',
  'AEG-1031': 'package-lock.json → lodash@4.17.15 (CVE-2020-8203)',
  'AEG-1028': 'GET /api/admin/users returned 200 with a non-admin bearer token (ZAP)',
  'AEG-1024': 'Multipart upload with external DTD triggered outbound request to scanner callback',
  'AEG-1019': 'session/handler.ts:88 — node-serialize unserialize() on cookie value',
  'AEG-1015': '/api/preview?url=http://169.254.169.254 reachable from the gateway network',
  'AEG-1011': 'HTTP 500 body contains full stack trace and SQL text',
  'AEG-1006': 'CSRF token now validated on /api/profile/update (re-scan clean)',
};

export const INTEL = {
  '185.220.101.42': { rep: 'Known Tor exit node', score: 91, tags: ['tor', 'scanner', 'sqlmap'], asn: 'AS4224', geo: 'DE' },
  '91.219.237.4':   { rep: 'Bulletproof hosting range', score: 84, tags: ['brute-force', 'privesc'], asn: 'AS57523', geo: 'RU' },
  '194.61.24.102':  { rep: 'Reported for XSS spraying', score: 73, tags: ['xss', 'botnet'], asn: 'AS208046', geo: 'NL' },
  '45.155.205.19':  { rep: 'Mass scanner (Shodan-like)', score: 58, tags: ['scanner'], asn: 'AS49505', geo: 'RU' },
};

export const PAIR_META = {
  'AEG-1042': { asset: 'web',   confidence: 94, decoy: 'decoy-db-01',    intelIp: '185.220.101.42' },
  'AEG-1028': { asset: 'admin', confidence: 88, decoy: 'decoy-admin-01', intelIp: '91.219.237.4' },
  'AEG-1035': { asset: 'web',   confidence: 81, decoy: 'decoy-admin-01', intelIp: '194.61.24.102' },
};

export const SESSION_DECOY = {
  '185.220.101.42': 'decoy-ssh-01', '45.155.205.19': 'decoy-web-01', '91.219.237.4': 'decoy-ssh-02',
  '103.74.19.61': 'decoy-web-01', '194.61.24.102': 'decoy-admin-01',
};

export const ASSET_ACTIVITY = {
  gateway: ['ZAP scan detected (14m ago)', 'Rate-limit tripped from 185.220.101.42'],
  web: ['Semgrep flagged 2 new sinks', 'Reflected payload blocked by WAF rule 941100'],
  admin: ['Non-admin token accepted on /api/admin/users', 'Session anomaly: 3 geos in 10 min'],
  postgres: ['Slow-query spike from web tier', 'Connection pool at 78%'],
  redis: ['Honeypot flag written for 45.155.205.19'],
  cicd: ['Gitleaks found AWS key in release.sh', 'Pipeline run #412 passed'],
  honeypot: ['3 active Cowrie sessions', 'Decoy DB shell touched'],
  traffic: ['1.2k req/min', 'Tor exit node share up 4%'],
};

// Scripted simulation. Real backend replaces this with an event stream (SSE/WebSocket).
export const SCENARIOS = [
  { type: 'attack', ip: '185.220.101.42', technique: 'SQL injection', cwe: 'CWE-89', target: 'postgres',
    source: 'Honeypot · decoy-db-01', finding: 'AEG-1042', impact: 6, confidence: 94,
    path: ['traffic', 'gateway', 'web', 'postgres'], note: "UNION SELECT payload against /rest/products/search" },
  { type: 'scan', target: 'admin', tool: 'ZAP' },
  { type: 'attack', ip: '91.219.237.4', technique: 'Privilege escalation probe', cwe: 'CWE-284', target: 'admin',
    source: 'Honeypot · decoy-ssh-02', finding: 'AEG-1028', impact: 4, confidence: 88,
    path: ['traffic', 'gateway', 'admin'], note: 'Replayed decoy sudoers path against /api/admin/users' },
  { type: 'degrade', target: 'redis' },
  { type: 'attack', ip: '194.61.24.102', technique: 'Reflected XSS', cwe: 'CWE-79', target: 'web',
    source: 'Honeypot · decoy-admin-01', finding: 'AEG-1035', impact: 3, confidence: 81,
    path: ['traffic', 'gateway', 'web'], note: 'Scripted <script> payload in feedback form' },
  { type: 'scan', target: 'cicd', tool: 'Gitleaks' },
];

export const SEED_EVENTS = [
  { id: 'evt-seed-2', ts: '09:14:07', ip: '185.220.101.42', technique: 'Credential brute force', cwe: 'CWE-307', target: 'honeypot',
    source: 'Honeypot · decoy-ssh-01', correlation: 'NONE', impact: 0, confidence: 0, finding: null, path: ['traffic', 'honeypot'] },
  { id: 'evt-seed-1', ts: '09:02:51', ip: '45.155.205.19', technique: 'Scanner sweep /wp-admin', cwe: 'CWE-200', target: 'gateway',
    source: 'Traffic monitor', correlation: 'NONE', impact: 1, confidence: 0, finding: null, path: ['traffic', 'gateway'] },
];
