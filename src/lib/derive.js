// Derived values — computed from raw API data so backends only need to send facts.
export const openFindings = (fs) => fs.filter((f) => f.status !== 'Resolved');
export function enrichAssets(assets, findings) {
  return assets.map((a) => {
    const mine = openFindings(findings).filter((f) => f.asset === a.id);
    return { ...a, findingCount: mine.length, critical: mine.filter((f) => f.sev === 'critical').length, high: mine.filter((f) => f.sev === 'high').length };
  });
}
export const overallRisk = (assets) => {
  const r = assets.map((a) => a.risk);
  return Math.round(0.6 * Math.max(...r) + 0.4 * (r.reduce((s, x) => s + x, 0) / r.length));
};
export const nowClock = () => new Date().toTimeString().slice(0, 8);
