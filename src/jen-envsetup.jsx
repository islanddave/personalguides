const S = {
  page: { fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 860, margin: "0 auto", padding: "32px 24px", color: "#1a1a2e", lineHeight: 1.6 },
  header: { borderBottom: "3px solid #4f46e5", paddingBottom: 16, marginBottom: 32 },
  h1: { fontSize: 28, fontWeight: 700, color: "#1a1a2e", margin: 0 },
  subtitle: { color: "#6b7280", marginTop: 4, fontSize: 14 },
  phase: { marginBottom: 36, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" },
  phaseHeader: { background: "#4f46e5", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 },
  phaseNum: { background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  phaseTitle: { fontWeight: 600, fontSize: 16 },
  phaseBody: { padding: "20px 24px" },
  step: { marginBottom: 14, paddingLeft: 16, borderLeft: "3px solid #e0e7ff" },
  stepLabel: { fontWeight: 600, fontSize: 13, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 },
  stepText: { fontSize: 14, color: "#374151" },
  code: { background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2px 7px", fontFamily: "monospace", fontSize: 13, color: "#1f2937" },
  codeBlock: { background: "#1e1e2e", color: "#cdd6f4", borderRadius: 8, padding: "12px 16px", fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, overflowX: "auto", margin: "8px 0" },
  callout: { background: "#fef3c7", border: "1px solid #fbbf24", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#92400e", margin: "10px 0" },
  successCallout: { background: "#d1fae5", border: "1px solid #34d399", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#065f46", margin: "10px 0" },
  refBox: { background: "#f8faff", border: "1px solid #c7d2fe", borderRadius: 8, padding: 16, marginBottom: 24 },
  refTitle: { fontWeight: 700, fontSize: 13, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 },
  refRow: { display: "flex", gap: 8, marginBottom: 6, fontSize: 13, flexWrap: "wrap", alignItems: "baseline" },
  refLabel: { color: "#6b7280", minWidth: 140 },
  refVal: { fontFamily: "monospace", color: "#1f2937", background: "#ede9fe", padding: "1px 6px", borderRadius: 3, fontSize: 12 },
  checkList: { listStyle: "none", padding: 0, margin: 0 },
  checkItem: { display: "flex", gap: 10, padding: "5px 0", fontSize: 13, borderBottom: "1px solid #f3f4f6", alignItems: "flex-start" },
  checkNum: { color: "#4f46e5", fontWeight: 700, minWidth: 22, fontSize: 12 },
  h3: { fontSize: 15, fontWeight: 600, color: "#374151", margin: "16px 0 8px" },
  tag: { display: "inline-block", background: "#fee2e2", color: "#991b1b", borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600, marginLeft: 6, verticalAlign: "middle" },
  tagBlue: { display: "inline-block", background: "#dbeafe", color: "#1e40af", borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600, marginLeft: 6, verticalAlign: "middle" },
};

function Phase({ num, title, bg, children }) {
  return (
    <div style={S.phase}>
      <div style={{ ...S.phaseHeader, background: bg || "#4f46e5" }}>
        <div style={S.phaseNum}>{num}</div>
        <div style={S.phaseTitle}>{title}</div>
      </div>
      <div style={S.phaseBody}>{children}</div>
    </div>
  );
}

function Step({ label, children }) {
  return (
    <div style={S.step}>
      <div style={S.stepLabel}>{label}</div>
      <div style={S.stepText}>{children}</div>
    </div>
  );
}

export default function JenEnvSetup() {
  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>Jen Cowork Setup Guide</h1>
        <div style={S.subtitle}>Import Prompt v4.1.0 · 2026-04-01 · Dave operator runbook</div>
      </div>

      <div style={S.refBox}>
        <div style={S.refTitle}>Quick Reference — Key IDs &amp; Paths</div>
        <div style={S.refRow}><span style={S.refLabel}>Import Prompt (Drive)</span><span style={S.refVal}>1PqnKfajuRxrbYiBrnlxajja4G-8jE99e</span></div>
        <div style={S.refRow}><span style={S.refLabel}>CLAUDE.md template</span><span style={S.refVal}>1k39C2IwHmHr03hMO4W7ukg5pIaa8QpL-p1FJhhJ7sDU</span></div>
        <div style={S.refRow}><span style={S.refLabel}>Skills folder</span><span style={S.refVal}>1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</span></div>
        <div style={S.refRow}><span style={S.refLabel}>Morning dashboard proc</span><span style={S.refVal}>1V49LPRFG3--gTiSG-trAAmR_r3CJO2Hk2A1ZOI2jH2g</span></div>
        <div style={S.refRow}><span style={S.refLabel}>Tip-intake proc</span><span style={S.refVal}>1RV5pT-VEHlWN2wg17-kLIQRYVtklrWL1</span></div>
        <div style={S.refRow}><span style={S.refLabel}>jen-morning domain</span><span style={S.refVal}>jen-morning.futureishere.net</span></div>
        <div style={S.refRow}><span style={S.refLabel}>Jen's Google account</span><span style={S.refVal}>jennifer.of.koetters@gmail.com</span></div>
        <div style={S.refRow}><span style={S.refLabel}>GitHub repo</span><span style={S.refVal}>islanddave/personalguides</span></div>
      </div>

      <Phase num="1" title="Pre-Setup: Manual UI Steps (Dave on Jen's machine)" bg="#6366f1">
        <Step label="1 — Install Cowork">
          Download and install the Cowork desktop app on Jen's Windows machine. Sign in with Jen's Anthropic/Claude account.
        </Step>
        <Step label="2 — Connect MCP: Filesystem">
          Cowork → Settings → Integrations → Filesystem. Add allowed directory: <span style={S.code}>C:\Users\jen\AI\Claude</span> (or Jen's actual username). Verify: run <span style={S.code}>mcp__filesystem__list_allowed_directories</span> returns the path.
        </Step>
        <Step label="3 — Connect MCP: Google Calendar">
          Cowork → Settings → Integrations → Google Calendar → Connect. OAuth with Jen's Google account (<span style={S.code}>jennifer.of.koetters@gmail.com</span>). After connecting, run <span style={S.code}>gcal_list_calendars</span> and note the family calendar ID — you'll need it in Phase 2.
        </Step>
        <Step label="4 — Connect MCP: Google Drive">
          Cowork → Settings → Integrations → Google Drive → Connect. OAuth with Jen's Google account. Verify read access to shared skills folder: <span style={S.code}>1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</span>.
          <div style={S.callout}>⚠️ Skills folder must already be shared with jennifer.of.koetters@gmail.com (OI-003 — done 2026-03-30).</div>
        </Step>
        <Step label="5 — Connect MCP: Claude in Chrome">
          Install Claude in Chrome extension in Jen's Chrome browser. Connect via Cowork → Customize → Plugins or the Chrome extension store.
        </Step>
        <Step label="6 — Install Productivity Plugin">
          Cowork → Customize → Plugins → Marketplace → search "productivity" → Install. This provides TASKS.md task management.
        </Step>
        <Step label="7 — Install skill-manager (MANUAL)">
          This one can't be bootstrapped — must be done manually first.
          <ol style={{ margin: "8px 0 0", paddingLeft: 20, fontSize: 14 }}>
            <li>Open Drive folder <span style={S.code}>1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</span></li>
            <li>Download <span style={S.code}>skill-manager.skill</span></li>
            <li>Cowork → Settings → Skills → Upload → select the file</li>
          </ol>
        </Step>
        <Step label="8 — Paste Global Instructions">
          Cowork → Settings → Global Instructions. Fetch content from Drive doc <span style={S.code}>1tXDqK2L2d2GHRLiI3F1mVWNHMDa9F3TFpCMsIp1udMU</span> and paste.
        </Step>
        <Step label="9 — Paste Personal Preferences">
          Cowork → Settings → Personal Preferences. Fetch content from Drive doc <span style={S.code}>1N9dIK_ap4V41wQ3wJDXXlzn02loztLOZoZqK4LEw_Q0</span> and paste.
        </Step>
      </Phase>

      <Phase num="2" title="Gather Parameters" bg="#7c3aed">
        <Step label="BASE_PATH">
          Confirm Jen's AI/Claude path. Convention: <span style={S.code}>C:\Users\jen\AI\Claude</span>. If using "auto" the import prompt discovers it via filesystem MCP.
        </Step>
        <Step label="FAMILY_CALENDAR_ID">
          Run <span style={S.code}>gcal_list_calendars</span> in Cowork on Jen's machine. Copy the family/home calendar ID (format: <span style={S.code}>abc123@group.calendar.google.com</span>).
        </Step>
        <Step label="GITHUB_PAT">
          Dave's GitHub PAT with write access to <span style={S.code}>islanddave/personalguides</span>. Located at <span style={S.code}>/Users/davenichols/AI/Claude/.secrets/github-pat</span>. Import prompt writes it to Jen's machine at <span style={S.code}>{"{BASE_PATH}\\.secrets\\github-pat"}</span>.
        </Step>
      </Phase>

      <Phase num="3" title="Run Import Prompt" bg="#0891b2">
        <Step label="Open fresh session">
          On Jen's machine, open a new Cowork session (not a continuation). Fresh context ensures no contamination.
        </Step>
        <Step label="Fetch &amp; paste prompt">
          Fetch the import prompt from Drive file <span style={S.code}>1PqnKfajuRxrbYiBrnlxajja4G-8jE99e</span> and paste into the session.
        </Step>
        <Step label="Fill in parameters">
          At the top of the prompt, fill in the three values before pasting:
          <div style={S.codeBlock}>
            BASE_PATH = auto<br/>
            FAMILY_CALENDAR_ID = [from Phase 2]<br/>
            GITHUB_PAT = [Dave's PAT]
          </div>
        </Step>
        <Step label="Let it run">
          Claude works through Steps 0–7k automatically. Each step reports ✅ or ⚠️. Steps are idempotent — safe to re-run if interrupted.
          <div style={{ ...S.callout, background: "#ede9fe", border: "1px solid #a78bfa", color: "#5b21b6" }}>
            ⏸️ Claude pauses after Phase 4 (step 7j) and again after Phase 5 (step 7n) for manual PowerShell steps. Don't skip ahead — wait for Claude's prompt.
          </div>
        </Step>
      </Phase>

      <Phase num="4" title="Tip-Intake Server (Manual PowerShell)" bg="#0f766e">
        <div style={S.callout}>
          ⚠️ Claude will pause here and say "Phase 4 files are written." Do this step then tell Claude "tip-intake setup complete".
        </div>
        <Step label="Open PowerShell (not as admin)">
          Right-click PowerShell → "Run as user" (not "Run as administrator"). Admin mode breaks Task Scheduler registration.
        </Step>
        <Step label="Run setup script">
          <div style={S.codeBlock}>
            cd {"{BASE_PATH}"}\\scheduled-tasks\\tip-intake<br/>
            .\\setup-tip-intake.ps1
          </div>
        </Step>
        <Step label="Expected output">
          Script installs FastAPI + uvicorn, registers <span style={S.code}>JenNichols-TipIntake</span> Task Scheduler entry (starts at login), and starts the server immediately.
          <div style={S.successCallout}>
            ✓ Server live: {"{"}"ok":true,"server":"tip-intake","version":"1.0.0","port":7878{"}"}
          </div>
        </Step>
        <Step label="Tell Claude to continue">
          Reply in the Cowork session: <span style={S.code}>tip-intake setup complete</span> and Claude will create the MCP processor task (step 7k) and proceed to Phase 5.
        </Step>
      </Phase>

      <Phase num="5" title="Cowork Rename Pipeline (Manual PowerShell)" bg="#b45309">
        <div style={S.callout}>
          ⚠️ Claude will pause after step 7m and say "Phase 5 files are written." Do this step then tell Claude "rename pipeline setup complete".
        </div>
        <Step label="Capture Chrome cookies (first time)">
          Open Jen's Chrome → claude.ai → DevTools (F12) → Network tab → click any request → Headers → find "Cookie:" → copy the entire value. Paste into Notepad → Save as <span style={S.code}>%USERPROFILE%\.claude_session</span>. Cookies expire ~7 days; refresh when you get 401/403 errors.
        </Step>
        <Step label="Run setup script">
          <div style={S.codeBlock}>
            cd {"{BASE_PATH}"}\\cowork-api<br/>
            .\\setup-cowork-rename.ps1
          </div>
        </Step>
        <Step label="Expected output">
          Script installs curl-cffi, sets <span style={S.code}>COWORK_BASE_PATH</span> env var, attempts to auto-discover and set <span style={S.code}>COWORK_ORG_ID</span>, then registers <span style={S.code}>JenNichols-CoworkRename</span> Task Scheduler entry running every 2 minutes.
          <div style={S.successCallout}>
            Set COWORK_BASE_PATH=C:\Users\jen\AI\Claude<br/>
            Set COWORK_ORG_ID=[uuid]<br/>
            Registered 'JenNichols-CoworkRename' (every 2 minutes).<br/>
            rename-pending: OK
          </div>
          <div style={S.callout}>If COWORK_ORG_ID wasn't auto-set (no cookie file yet), set it manually after cookie capture: <span style={S.code}>[System.Environment]::SetEnvironmentVariable('COWORK_ORG_ID', '&lt;id&gt;', 'User')</span> — get the ID by running <span style={S.code}>python session_manager.py whoami</span></div>
        </Step>
        <Step label="Verify">
          <span style={S.code}>python "{"{BASE_PATH}"}\\cowork-api\\session_manager.py" list</span> should show recent Cowork sessions.
        </Step>
        <Step label="Tell Claude to continue">
          Reply: <span style={S.code}>rename pipeline setup complete</span> — Claude runs Step 8 verification.
        </Step>
      </Phase>

      <Phase num="6" title="Verification (17 Checks)" bg="#374151">
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 0, marginBottom: 16 }}>
          Claude runs these automatically in Step 8. Listed here for manual cross-check if needed.
        </p>
        <ul style={S.checkList}>
          {[
            [1, "CLAUDE.md — exists and contains SENTINEL_CANON_V1"],
            [2, "learning\\agent-engineering.md — exists and non-empty"],
            [3, "learning\\rubric.md — exists and non-empty"],
            [4, "learning\\lessons.md — exists and non-empty"],
            [5, "TASKS.md — exists"],
            [6, "scheduled-tasks\\morning-dashboard\\proc.md — exists and non-empty"],
            [7, "scheduled-tasks\\claude-md-backup\\proc.md — exists and non-empty"],
            [8, "Scheduled task jen-morning-dashboard — exists"],
            [9, "Scheduled task jen-claude-md-backup — exists"],
            [10, "proc-registry.json — exists and contains schema_version"],
            [11, "morning-dashboard\\jen-morning-dashboard-prototype.jsx — exists and non-empty"],
            [12, "scheduled-tasks\\morning-dashboard\\config.json — exists and non-empty"],
            [13, "scheduled-tasks\\tip-intake\\tip_intake_server.py — exists and non-empty"],
            [14, "scheduled-tasks\\tip-intake\\setup-tip-intake.ps1 — exists and non-empty"],
            [15, "Scheduled task jen-tip-intake-processor — exists"],
            [16, "cowork-api\\session_manager.py — exists and non-empty"],
            [17, "cowork-api\\setup-cowork-rename.ps1 — exists and non-empty"],
          ].map(([n, text]) => (
            <li key={n} style={S.checkItem}>
              <span style={S.checkNum}>{n}.</span>
              <span style={{ color: n >= 10 ? "#1f2937" : "#374151" }}>
                {n >= 10 && <span style={{ fontWeight: 600 }}></span>}{text}
                {n === 10 && <span style={S.tagBlue}>proc-registry</span>}
                {n === 11 && <span style={S.tagBlue}>JSX template</span>}
                {n === 16 && <span style={S.tagBlue}>cowork-api</span>}
                {n === 17 && <span style={S.tagBlue}>cowork-api</span>}
              </span>
            </li>
          ))}
        </ul>
      </Phase>

      <Phase num="7" title="Post-Setup: Final Steps" bg="#be185d">
        <Step label="Family calendar skill setup">
          In Cowork on Jen's machine, run: <span style={S.code}>skill setup family-calendar</span>. Provide the FAMILY_CALENDAR_ID when prompted.
        </Step>
        <Step label="Netlify domain aliases">
          Dave does this from his Mac, Netlify dashboard:
          <ul style={{ fontSize: 14, marginTop: 6 }}>
            <li>Add alias <span style={S.code}>jen-morning.futureishere.net</span> → personalguides site</li>
            <li>Add alias <span style={S.code}>jen-envsetup.futureishere.net</span> → personalguides site</li>
          </ul>
        </Step>
        <Step label="Test morning dashboard">
          Verify <span style={S.code}>jen-morning.futureishere.net</span> loads. First automated run: 7:30 AM daily. Trigger manually: open Cowork → Scheduled Tasks → jen-morning-dashboard → Run now.
        </Step>
        <Step label="Test tip-intake server">
          From Jen's machine: <span style={S.code}>curl http://localhost:7878/health</span> → should return <span style={S.code}>{"{"}ok:true{"}"}</span>. Or Invoke-RestMethod in PowerShell.
        </Step>
        <Step label="Test session rename">
          After any Cowork session ends (handoff written), check within 2 minutes that the session name updates in the session list. Run <span style={S.code}>python session_manager.py list</span> to verify.
        </Step>
        <Step label="Drive skills folder">
          OI-003 resolved — jennifer.of.koetters@gmail.com already has Viewer access to <span style={S.code}>1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</span>.
        </Step>
        <Step label="OI-010 — Deploy skill-manager v1.3.0">
          <span style={S.tag}>ACTION NEEDED</span> Run <span style={S.code}>skill deploy skill-manager</span> from Dave's machine before setup day to push v1.3.0 (SkillsInbox / Step 9) to Drive. Jen's bootstrap will then install the latest version.
        </Step>
      </Phase>

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 20, marginTop: 8, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
        jen-config v2.3.0 · import prompt v4.1.0 · 17 verification checks · manifest: 1Wi2ymkaAXGcO9tSZlFh7CmESAEysqhdv
      </div>
    </div>
  );
}
