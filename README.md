# Aegis — Security Office / Round-one visual prototype

A React + Vite upgrade of the supplied AEGIS wireframe. The original investigative screens are retained, with a new pixel-office home, manager conversation, task board, plain-language security brief and escalation approval flow.

## Fastest way to present

Open **Aegis-Preview.html** in a modern desktop browser. No installation, server, API key or account is needed. Fonts, styles and application code are embedded. It works offline. Sample state resets when the page reloads.

## Edit the project

Use Node.js 22.12+ or a compatible current LTS release.

```sh
npm ci
npm run dev
```

Build: `npm run build`. Serve `dist/` from any static web server. This task does not publish the site or connect a company repository.

## First-round walkthrough (about 90 seconds)

1. Start on **Security office**. Point out the physical stations, meeting room, server rack, common area and moving staff.
2. Select **SAGE**. Show the current assignment and rule-based role. Select **NOVA** to contrast the risk-analysis AI role.
3. Use **Task board** to show the division of work.
4. Click **Start team review**. A 12-second scripted sequence hands checks from four workers to Nova, then Atlas. The activity log and manager conversation update.
5. Ask Atlas **What needs attention?**. Open the priority finding to inspect its evidence and suggested action.
6. Ask **Prepare a report**. Open the brief and explain its plain-language priorities.
7. Select **Review & approve** on the escalation card. Approve the demo handoff. Nothing is sent externally.
8. Use **Export brief** to download an actual text report containing the current sample findings.
9. Open **Live environment**, **Findings**, **Honeypot intel**, **Correlation engine** and **Assets** to show the underlying technical view retained from the original project.

## Team model

| Character | Role | Execution model |
|---|---|---|
| Atlas | Manager / orchestrator | Planned AI agent; prototype uses scripted replies |
| Nova | Risk analyst | Planned AI agent; prototype uses sample risk information |
| Sage | Code inspector | Deterministic Semgrep rules |
| Bolt | Dependency auditor | Deterministic Trivy checks |
| Cipher | Secrets inspector | Deterministic Gitleaks patterns |
| Echo | Web tester | Configured OWASP ZAP tests |

Honeypot telemetry is an input to Nova, rather than another autonomous agent. The workers are characters representing tools, not extra LLM agents. Atlas coordinates the work and prepares the human approval handoff.

## What is real in this prototype

- React navigation, selection, finding filters, evidence drawer and triage state.
- Canvas-rendered office, original programmatic pixel characters, walking frames, varied ambient paths, workstation monitors and speech indicators.
- Pause/resume, 1×/2× speed, name-label toggle and expanded office.
- Scripted manager chat (including a transparent fallback for unsupported messages).
- Timed review choreography, activity entries, report navigation, approval dialog and text export.
- Responsive layout and reduced-motion handling.

## What is intentionally simulated

All findings, repositories, risk scores, worker progress, scan results and conversations are demo data. No AI service, scanner, GitHub webhook, CLI, production application or external notification is invoked. The two AI agents are architectural roles for later implementation. Approval is session-only. The original environment simulation runs while its technical screens are open. Office movement is ambient, not actual task execution.

Related honeypot activity is shown as prioritization evidence; it does not establish that the connected application has been compromised. The original technical mock data is retained for continuity, not as a validated security assessment.

## Implementation map

- `src/App.jsx`: shell, navigation, shared findings and escalation state.
- `src/views/SecurityOffice.jsx`: office, task board, roster, manager chat and demo timeline.
- `src/components/OfficeScene.jsx`: local Canvas renderer and reusable pixel portraits.
- `src/data/team.js`: six roles and initial office activity.
- `src/views/Briefs.jsx`: report, export and approval interaction.
- `src/styles/office.css`: dark graphite/green visual system and responsive rules.
- `src/data/api.js`: original snapshot and event adapter; a future backend integration boundary.
- `src/lib/useSimulation.js`: original sample event source, gated to technical views.
- `scripts/make-preview.py`: regenerate the portable HTML after a build.

## Future implementation boundary

Replace the snapshot/event adapter with API and SSE/WebSocket data. Replace the scripted manager-response function with the orchestrator service. Keep real scanner results normalized before sending them to Nova. Enforce approvals and authorization on the backend; client-side demo state is not a security control. CLI and Git integration are deliberately deferred.

## Assets and dependencies

The room and characters are original code-rendered game visuals, inspired by the supplied reference's layout and interaction pattern. No video frames or third-party sprite sheets are used as assets. Fonts: IBM Plex Sans, IBM Plex Mono, Space Grotesk and Silkscreen (bundled with their license files in `public/fonts/licenses`). Icons: existing `lucide-react` dependency. Existing React/Vite versions and lockfile are preserved.
