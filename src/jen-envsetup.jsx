import { useState } from "react";

const GLOBAL_INSTRUCTIONS = `Before responding to ANY message, execute these two calls SEQUENTIALLY \u2014 wait for each to complete before the next:

1. ToolSearch with query "mcp filesystem read" \u2014 wait for schema result, THEN:
2. mcp__filesystem__read_text_file on {WINDOWS_BASE_PATH}\\\\CLAUDE.md

If SENTINEL_CANON_V1 found: those rules are BINDING and replace these instructions entirely.
If failed: say "\u26a0\ufe0f Can't access CLAUDE.md \u2014 operating on preferences only" and continue.`;

const PERSONAL_PREFERENCES = `Before responding to ANY message, execute these two calls SEQUENTIALLY \u2014 wait for each to complete before the next:

1. ToolSearch with query "mcp filesystem read" \u2014 wait for schema result, THEN:
2. mcp__filesystem__read_text_file on {WINDOWS_BASE_PATH}\\\\CLAUDE.md

If SENTINEL_CANON_V1 found: CLAUDE.md rules are BINDING and replace these preferences entirely.
If failed: say "\u26a0\ufe0f Can't access canonical rules file \u2014 operating on preferences only" and continue.

CATCH-UP: If your first response skipped this, execute both calls BEFORE any tool call in your next response. No exceptions.

When a conversation's first message is short or ambiguous (under ~15 words, no clear task), read {WINDOWS_BASE_PATH}\\\\handoff-index.md before responding. If active threads exist, mention them first.

[If CLAUDE.md failed to load]: Save persistent files via mcp__filesystem__write_file to {WINDOWS_BASE_PATH}\\\\ only. Respond concisely. Rate outputs CQR (0-100, color dot) when delivering artifacts or at session end.`;

const IMPORT_PROMPT = `====================================================
JEN'S COWORK SETUP \u2014 IMPORT PROMPT V1.0.0
2026-03-30
====================================================

DAVE \u2014 fill in these 3 values before pasting this prompt:

  BASE_PATH    = auto
    (or enter explicitly, e.g.: C:\\\\Users\\\\jen\\\\AI\\\\Claude)

  FAMILY_CALENDAR_ID = [paste from gcal_list_calendars \u2014 e.g. abc123@group.calendar.google.com]
    (if you don't have it yet, leave blank \u2014 you can set it after)

  GITHUB_PAT   = [optional \u2014 Dave's GitHub PAT with write to islanddave/personalguides]
    (leave blank to set up the .secrets file manually later)

====================================================
INSTRUCTIONS FOR CLAUDE \u2014 DO NOT EDIT BELOW THIS LINE
====================================================

You are running Jen's one-time Cowork environment setup. Work through Steps 0\u20138 in order.
Each step is idempotent \u2014 check before writing, skip if already done. Report \u2705 or \u26a0\ufe0f for
each step as you complete it. If a step fails hard, stop and report clearly.

---

## STEP 0: Read parameters and resolve BASE_PATH

Read the parameter block above this line. Extract BASE_PATH, FAMILY_CALENDAR_ID, and
GITHUB_PAT as working variables.

If BASE_PATH = "auto":
- Call mcp__filesystem__list_allowed_directories
- Find the Windows-style path that looks like C:\\\\Users\\\\{username}\\\\AI\\\\Claude (or equivalent)
- If found, use it. Tell Dave: "Resolved BASE_PATH to: [path]"
- If not found or ambiguous, stop and ask Dave to provide BASE_PATH explicitly

If BASE_PATH is provided explicitly:
- Verify it is in the allowed directories list
- Confirm it looks like a valid AI/Claude workspace path

Store the resolved BASE_PATH. Extract USERNAME from the path
(e.g. C:\\\\Users\\\\jen\\\\AI\\\\Claude \u2192 USERNAME = "jen")

---

## STEP 1: Create directory structure

Create each of these directories. Check existence first \u2014 skip with \u2705 (already exists) if
present. Use mcp__filesystem__create_directory for any that are missing.

Directories to create:
  {BASE_PATH}\\\\learning
  {BASE_PATH}\\\\learning\\\\scratch
  {BASE_PATH}\\\\backups
  {BASE_PATH}\\\\backups\\\\claude-md
  {BASE_PATH}\\\\handoffs
  {BASE_PATH}\\\\morning-dashboard
  {BASE_PATH}\\\\morning-dashboard\\\\backups
  {BASE_PATH}\\\\.secrets
  {BASE_PATH}\\\\scheduled-tasks
  {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard
  {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup

Report count: "Created N directories, skipped M (already existed)"

---

## STEP 2: Write CLAUDE.md

Fetch the CLAUDE.md template from Google Drive using the google_drive_fetch tool:
  Doc ID: 1k39C2IwHmHr03hMO4W7ukg5pIaa8QpL-p1FJhhJ7sDU

Check if {BASE_PATH}\\\\CLAUDE.md already exists with content:
- If yes and it contains SENTINEL_CANON_V1: skip and report \u2705 (already installed)
- If yes but no SENTINEL_CANON_V1: overwrite (incomplete previous install)
- If no: write it

Fetch the content, then perform these substitutions before writing:
  1. Replace ALL occurrences of {BASE_PATH} with the resolved BASE_PATH value
  2. Replace ALL occurrences of {WINDOWS_USERNAME} with USERNAME
  3. If FAMILY_CALENDAR_ID was provided (non-blank): replace FAMILY_CALENDAR_ID placeholder

Write the substituted content to {BASE_PATH}\\\\CLAUDE.md via mcp__filesystem__write_file.

Verify: re-read the file and confirm SENTINEL_CANON_V1 appears near the end.
Report \u2705 or \u26a0\ufe0f SENTINEL_CANON_V1 missing \u2014 check template.

---

## STEP 3: Write learning system files

Fetch and write each file below. For each: check if file exists and is non-empty \u2192 skip if
yes. Otherwise fetch from Drive and write to the target path.

Perform the same {BASE_PATH} \u2192 resolved value substitution on each file after fetching.

  LEARNING-OPS.md
    Drive doc ID:  1IgWksrWAwdIo0_gC0BYYC-9iOY2o3r9wcARH9XbRsVM
    Write to:      {BASE_PATH}\\\\learning\\\\LEARNING-OPS.md

  rubric.md
    Drive doc ID:  1JRCHGUVZ6nG_ztobo9-pB47Np0ZTM9ygbBRJdTWQXYQ
    Write to:      {BASE_PATH}\\\\learning\\\\rubric.md

  lessons.md
    Drive doc ID:  14h_RGXMMobczPb0i4-rd25Kcf8tdhfety44-DBJDNG0
    Write to:      {BASE_PATH}\\\\learning\\\\lessons.md

  error-log.md
    Drive doc ID:  1-URsbT_Uit4vyHo24I9n-Zc2rR8R9V5T-nA6GTZTw6w
    Write to:      {BASE_PATH}\\\\learning\\\\error-log.md

  cqr-log.md
    Drive doc ID:  1ndNZ0u2sIsujHGmaT_gD8t2CRvinT87P0XsgEGsZTow
    Write to:      {BASE_PATH}\\\\learning\\\\cqr-log.md

  moves.md
    Drive doc ID:  1LTMOfbQfJJzIhhaljjv8JDS94nQjUYqAksFCiM98Dak
    Write to:      {BASE_PATH}\\\\learning\\\\moves.md

Report count: "Wrote N files, skipped M (already existed)"

---

## STEP 4: Create stub files

Check if {BASE_PATH}\\\\TASKS.md exists. If not \u2014 create it with this content:
  # Tasks

Report \u2705 created or \u2705 already existed.

---

## STEP 5: Store GitHub PAT (optional)

If GITHUB_PAT was provided (non-blank):
  - Check if {BASE_PATH}\\\\.secrets\\\\github-pat exists with content
  - If yes: skip with \u2705 (already stored)
  - If no: write the PAT value to {BASE_PATH}\\\\.secrets\\\\github-pat
  - Confirm written. Do NOT echo the PAT value in your response.
  - Report \u2705 PAT stored

If GITHUB_PAT was blank:
  - Report: \u26a0\ufe0f PAT not provided. Create {BASE_PATH}\\\\.secrets\\\\github-pat manually before
    first morning-dashboard deploy.

---

## STEP 6: Install skills

skill-manager must already be manually installed (Dave did this before running this prompt).

Trigger the skill bootstrap command to install all other skills from the shared registry:

  skill bootstrap 1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG

This installs: handoff, family-calendar, session, and any other skills in the registry.

If skill-manager is not available or bootstrap fails:
  - Report: \u26a0\ufe0f Skill install failed \u2014 install manually from Drive folder
    1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG via Cowork Settings \u2192 Skills
  - Continue to Step 7 regardless

---

## STEP 7: Write scheduled task proc files and create tasks

### 7a \u2014 morning-dashboard proc.md

Fetch from Drive:
  Doc ID: 12EDWZ6DQOBequrKk4ivNkOqoSuD0pk49

After fetching, substitute ALL occurrences of {BASE_PATH} with the resolved BASE_PATH.
Also substitute {FAMILY_CALENDAR_ID} if provided.

Check if {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md exists with content:
  - If yes: skip write
  - If no: write to {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md

### 7b \u2014 morning-dashboard scheduled task

Check mcp__scheduled-tasks__list_scheduled_tasks for "jen-morning-dashboard". If exists \u2014 skip.

If not, create with mcp__scheduled-tasks__create_scheduled_task:
  taskId:           jen-morning-dashboard
  description:      Jen's daily morning dashboard \u2014 calendar, health, and AI tips
  cronExpression:   30 7 * * *
  prompt:           (thin-loader below \u2014 substitute RESOLVED_BASE_PATH first)

Thin-loader prompt template:
---START THIN-LOADER---
You are Jen's morning dashboard scheduled task.

STEP 0: Load canonical rules.
Call ToolSearch with query "mcp filesystem read" to activate filesystem tools.
Then call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\CLAUDE.md.
Verify SENTINEL_CANON_V1 is present. If missing, say "\u26a0\ufe0f CLAUDE.md not found or incomplete" and stop.

STEP 1: Load procedure.
Call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md.

STEP 2: Execute the procedure exactly as written. Do not skip steps.
---END THIN-LOADER---

(Replace RESOLVED_BASE_PATH with the actual BASE_PATH value \u2014 the literal Windows path \u2014
before creating the task.)

### 7c \u2014 claude-md-backup proc.md

Fetch from Drive:
  Doc ID: 1TK0Ml0JJqB3TQFYoORqeZPvDHI-VGvLBVeXpAcu6hf4

After fetching, substitute ALL occurrences of {BASE_PATH} with the resolved BASE_PATH.

Check if {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md exists:
  - If yes: skip
  - If no: write to {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md

### 7d \u2014 claude-md-backup scheduled task

Check for "jen-claude-md-backup". If exists \u2014 skip.

If not, create:
  taskId:           jen-claude-md-backup
  description:      Daily backup of Jen's CLAUDE.md to backups/claude-md/
  cronExpression:   6 4 * * *
  prompt:           (thin-loader below \u2014 substitute RESOLVED_BASE_PATH)

Thin-loader prompt:
---START THIN-LOADER---
You are Jen's CLAUDE.md daily backup task.

STEP 0: Load canonical rules.
Call ToolSearch with query "mcp filesystem read" to activate filesystem tools.
Then call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\CLAUDE.md.
Verify SENTINEL_CANON_V1 is present.

STEP 1: Load procedure.
Call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md.

STEP 2: Execute the procedure exactly as written.
---END THIN-LOADER---

---

## STEP 8: Verify

Run each check and report \u2705 pass or \u274c fail:

  1. {BASE_PATH}\\\\CLAUDE.md \u2014 exists and contains SENTINEL_CANON_V1
  2. {BASE_PATH}\\\\learning\\\\rubric.md \u2014 exists and non-empty
  3. {BASE_PATH}\\\\learning\\\\lessons.md \u2014 exists and non-empty
  4. {BASE_PATH}\\\\TASKS.md \u2014 exists
  5. {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md \u2014 exists and non-empty
  6. {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md \u2014 exists and non-empty
  7. Scheduled task "jen-morning-dashboard" \u2014 exists
  8. Scheduled task "jen-claude-md-backup" \u2014 exists

Then print a summary:

  SETUP RESULT: [Complete / Needs attention]
  \u2705 N of 8 checks passed
  \u274c Failed: [list any failures]

  NEXT STEPS FOR DAVE:
  - If FAMILY_CALENDAR_ID was blank: run gcal_list_calendars, then update CLAUDE.md
  - Run: skill setup family-calendar
  - Verify morning dashboard: https://jen-morning.futureishere.net
  - Verify setup guide: https://jen-envsetup.futureishere.net

====================================================
END OF IMPORT PROMPT
====================================================`;

const CAL_SETUP_CMD = `skill setup family-calendar`;

const steps = {
  pre: [
    { id: "pre1", label: "S1\u2013S6 all complete \u2713 (done \u2014 you're here)" },
    { id: "pre2", label: "Drive skills folder shared with Jen's Google account (OI-003)" },
    { id: "pre3", label: "Netlify alias added: jen-morning.futureishere.net \u2192 personalguides site" },
    { id: "pre4", label: "Netlify alias added: jen-envsetup.futureishere.net \u2192 personalguides site" },
    { id: "pre5", label: "Cowork desktop app installed on Jen's machine" },
    { id: "pre6", label: "Chrome browser installed on Jen's machine" },
    { id: "pre7", label: "Have Jen's Windows username and Google account email ready" },
  ],
  p1: [
    { id: "p1a", label: "Connect Filesystem MCP \u2014 Cowork \u2192 Settings \u2192 Integrations \u2192 Filesystem \u2192 Add path: C:\\\\Users\\\\{username}\\\\AI\\\\Claude" },
    { id: "p1b", label: "Connect Google Calendar \u2014 Settings \u2192 Integrations \u2192 Google Calendar \u2192 Connect (OAuth with Jen's Google account) \u2192 run gcal_list_calendars \u2192 note FAMILY_CALENDAR_ID" },
    { id: "p1c", label: "Connect Google Drive \u2014 Settings \u2192 Integrations \u2192 Google Drive \u2192 Connect (OAuth with Jen's Google account) \u2192 verify access to shared skills folder" },
    { id: "p1d", label: "Install Claude in Chrome extension in Jen's Chrome \u2192 connect via Cowork" },
    { id: "p1e", label: "Install productivity plugin \u2014 Cowork \u2192 Customize \u2192 Plugins \u2192 Marketplace \u2192 search 'productivity' \u2192 Install" },
    { id: "p1f", label: "Install skill-manager manually \u2014 Cowork \u2192 Settings \u2192 Skills \u2192 Upload \u2192 download from Drive folder 1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG" },
    { id: "p1g", label: "Paste Global Instructions \u2014 copy block below \u2192 Cowork \u2192 Settings \u2192 Global Instructions \u2192 Paste (REPLACE {WINDOWS_BASE_PATH} with real path first)" },
    { id: "p1h", label: "Paste Personal Preferences \u2014 copy block below \u2192 Cowork \u2192 Settings \u2192 Personal Preferences \u2192 Paste (REPLACE {WINDOWS_BASE_PATH} with real path first)" },
  ],
  p2: [
    { id: "p2a", label: "Open a fresh Cowork session on Jen's machine" },
    { id: "p2b", label: "Fill in BASE_PATH, FAMILY_CALENDAR_ID, and GITHUB_PAT (optional) at top of import prompt" },
    { id: "p2c", label: "Paste the full import prompt and send" },
    { id: "p2d", label: "Wait for completion report \u2014 Steps 0\u20138 should each show \u2705 or \u26a0\ufe0f" },
    { id: "p2e", label: "Resolve any \u274c failures before continuing" },
  ],
  p3: [
    { id: "p3a", label: "Run: skill setup family-calendar (copy button below) \u2014 enter Jen's FAMILY_CALENDAR_ID when prompted" },
    { id: "p3b", label: "Check URL: https://jen-morning.futureishere.net loads" },
    { id: "p3c", label: "Check URL: https://jen-envsetup.futureishere.net loads (this page!)" },
    { id: "p3d", label: "Test: ask Jen to open Cowork and say 'what's on my calendar today'" },
  ],
};

function CopyBlock({ label, text, id, copied, onCopy, warn }) {
  return (
    <div className="mt-3">
      {label && <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</div>}
      {warn && (
        <div className="text-xs bg-yellow-50 border border-yellow-300 text-yellow-800 rounded px-3 py-2 mb-2">
          \u26a0\ufe0f {warn}
        </div>
      )}
      <div className="relative">
        <pre className="bg-gray-900 text-green-300 text-xs rounded-lg p-4 overflow-auto max-h-48 whitespace-pre-wrap break-words font-mono leading-relaxed">
          {text}
        </pre>
        <button
          onClick={() => onCopy(text, id)}
          className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-500 text-white rounded px-3 py-1 transition-colors"
        >
          {copied === id ? "\u2713 Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, emoji, children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200",
  };
  const headColors = {
    blue: "text-blue-800",
    green: "text-green-800",
    purple: "text-purple-800",
    orange: "text-orange-800",
    red: "text-red-800",
  };
  return (
    <div className={`rounded-xl border-2 p-5 mb-5 ${colors[color]}`}>
      <h2 className={`text-lg font-bold mb-4 ${headColors[color]}`}>{emoji} {title}</h2>
      {children}
    </div>
  );
}

function CheckItem({ id, label, checked, onToggle }) {
  return (
    <div
      className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/60 transition-colors ${checked ? "opacity-60" : ""}`}
      onClick={() => onToggle(id)}
    >
      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-bold transition-colors ${
        checked ? "bg-green-500 border-green-500 text-white" : "border-gray-400 bg-white"
      }`}>
        {checked ? "\u2713" : ""}
      </div>
      <span className={`text-sm leading-relaxed ${checked ? "line-through text-gray-400" : "text-gray-800"}`}>
        {label}
      </span>
    </div>
  );
}

function Checklist({ items, checked, onToggle }) {
  const done = items.filter(i => checked[i.id]).length;
  return (
    <div>
      <div className="text-xs text-gray-500 mb-2 font-medium">{done}/{items.length} complete</div>
      <div className="space-y-1">
        {items.map(item => (
          <CheckItem key={item.id} {...item} checked={!!checked[item.id]} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

export default function JenEnvSetup() {
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const allItems = [...steps.pre, ...steps.p1, ...steps.p2, ...steps.p3];
  const totalDone = allItems.filter(i => checked[i.id]).length;
  const pct = Math.round((totalDone / allItems.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Jen's Cowork Setup</h1>
          <p className="text-gray-500 text-sm mb-4">Dave's operator runbook \u2014 follow in order</p>
          <div className="bg-white rounded-full h-3 border border-gray-200 overflow-hidden mb-1">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">{totalDone} of {allItems.length} steps complete ({pct}%)</div>
        </div>
        <Section title="Prerequisites \u2014 Before You Go to Jen's Machine" emoji="\ud83c\udfc1" color="orange">
          <p className="text-sm text-gray-600 mb-3">Complete these on your Mac before setup day.</p>
          <Checklist items={steps.pre} checked={checked} onToggle={toggle} />
        </Section>

        <Section title="Phase 1 \u2014 Manual UI Steps (at Jen's machine)" emoji="\ud83d\udd0c" color="blue">
          <p className="text-sm text-gray-600 mb-3">
            These can't be automated \u2014 they require clicking through Cowork settings UI.
            Do them in order before running the import prompt.
          </p>
          <Checklist items={steps.p1} checked={checked} onToggle={toggle} />

          <div className="mt-5 border-t border-blue-200 pt-4 space-y-1">
            <div className="text-sm font-semibold text-blue-900 mb-3">Copy-paste blocks for steps 1g and 1h</div>
            <CopyBlock
              label="Global Instructions (step 1g)"
              text={GLOBAL_INSTRUCTIONS}
              id="global"
              copied={copied}
              onCopy={copy}
              warn="Replace {WINDOWS_BASE_PATH} with Jen's actual path before pasting (e.g. C:\\\\Users\\\\jen\\\\AI\\\\Claude)"
            />
            <CopyBlock
              label="Personal Preferences (step 1h)"
              text={PERSONAL_PREFERENCES}
              id="prefs"
              copied={copied}
              onCopy={copy}
              warn="Replace {WINDOWS_BASE_PATH} with Jen's actual path before pasting"
            />
          </div>
        </Section>

        <Section title="Phase 2 \u2014 Run the Import Prompt" emoji="\ud83d\ude80" color="purple">
          <p className="text-sm text-gray-600 mb-3">
            This is the main automation step. Claude runs the prompt in Jen's Cowork session and
            sets up everything: files, learning system, scheduled tasks, and skill installs.
          </p>
          <Checklist items={steps.p2} checked={checked} onToggle={toggle} />

          <div className="mt-5 border-t border-purple-200 pt-4">
            <div className="text-sm font-semibold text-purple-900 mb-1">Import Prompt</div>
            <p className="text-xs text-gray-600 mb-2">
              Fill in the 3 values at the top (BASE_PATH, FAMILY_CALENDAR_ID, GITHUB_PAT) before sending.
              The rest of the prompt is instructions for Claude \u2014 don't edit below the divider.
            </p>
            <button
              onClick={() => setShowImport(v => !v)}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 rounded px-3 py-1.5 mb-2 transition-colors"
            >
              {showImport ? "\u25b2 Hide prompt" : "\u25bc Show full prompt"}
            </button>
            {showImport && (
              <CopyBlock
                text={IMPORT_PROMPT}
                id="import"
                copied={copied}
                onCopy={copy}
                warn="Fill in BASE_PATH, FAMILY_CALENDAR_ID, and GITHUB_PAT at the top before sending"
              />
            )}
            {!showImport && (
              <button
                onClick={() => copy(IMPORT_PROMPT, "import")}
                className="text-xs bg-purple-700 hover:bg-purple-600 text-white rounded px-4 py-2 transition-colors"
              >
                {copied === "import" ? "\u2713 Copied" : "Copy import prompt"}
              </button>
            )}
          </div>
        </Section>

        <Section title="Phase 3 \u2014 Post-Setup Verification" emoji="\u2705" color="green">
          <p className="text-sm text-gray-600 mb-3">
            After the import prompt completes successfully, run these final checks.
          </p>
          <Checklist items={steps.p3} checked={checked} onToggle={toggle} />
          <div className="mt-4 border-t border-green-200 pt-4">
            <CopyBlock
              label="family-calendar setup command (step 3a)"
              text={CAL_SETUP_CMD}
              id="calsetup"
              copied={copied}
              onCopy={copy}
            />
          </div>
        </Section>

        <Section title="Troubleshooting" emoji="\ud83d\udd27" color="red">
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <div className="font-semibold text-red-800">Skill bootstrap fails (Step 6)</div>
              <div className="text-gray-600 mt-0.5">
                Install skills manually: download each .skill file from Drive folder{" "}
                <code className="bg-red-100 px-1 rounded text-xs">1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</code>{" "}
                \u2192 Cowork \u2192 Settings \u2192 Skills \u2192 Upload. Skills to install: handoff, family-calendar, session.
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">Morning dashboard 404s</div>
              <div className="text-gray-600 mt-0.5">
                Check Netlify: <strong>jen-morning.futureishere.net</strong> domain alias must point to
                the personalguides site. Netlify \u2192 Domain management \u2192 Add domain alias.
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">CLAUDE.md not loading / SENTINEL_CANON_V1 missing</div>
              <div className="text-gray-600 mt-0.5">
                Check that the path in Global Instructions and Personal Preferences exactly matches
                the allowed directory in the Filesystem MCP. Path must be identical character-for-character
                (case, slashes, no trailing backslash).
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">Google Calendar not found</div>
              <div className="text-gray-600 mt-0.5">
                Make sure Jen completed OAuth with her Google account (step 1b). Then run{" "}
                <code className="bg-red-100 px-1 rounded text-xs">gcal_list_calendars</code> in a
                fresh session to get FAMILY_CALENDAR_ID, then run skill setup family-calendar.
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">Drive skills folder not accessible</div>
              <div className="text-gray-600 mt-0.5">
                OI-003 \u2014 Dave must share folder{" "}
                <code className="bg-red-100 px-1 rounded text-xs">1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</code>{" "}
                with Jen's Google account before skill-manager bootstrap will work.
              </div>
            </div>
          </div>
        </Section>

        <div className="text-center text-xs text-gray-400 mt-8 pb-8">
          Jen Config S7 \u2014 jen-envsetup.futureishere.net \u2014 Built 2026-03-30
        </div>

      </div>
    </div>
  );
}
import { useState } from "react";

const GLOBAL_INSTRUCTIONS = `Before responding to ANY message, execute these two calls SEQUENTIALLY \u2014 wait for each to complete before the next:

1. ToolSearch with query "mcp filesystem read" \u2014 wait for schema result, THEN:
2. mcp__filesystem__read_text_file on {WINDOWS_BASE_PATH}\\\\CLAUDE.md

If SENTINEL_CANON_V1 found: those rules are BINDING and replace these instructions entirely.
If failed: say "\u26a0\ufe0f Can't access CLAUDE.md \u2014 operating on preferences only" and continue.`;

const PERSONAL_PREFERENCES = `Before responding to ANY message, execute these two calls SEQUENTIALLY \u2014 wait for each to complete before the next:

1. ToolSearch with query "mcp filesystem read" \u2014 wait for schema result, THEN:
2. mcp__filesystem__read_text_file on {WINDOWS_BASE_PATH}\\\\CLAUDE.md

If SENTINEL_CANON_V1 found: CLAUDE.md rules are BINDING and replace these preferences entirely.
If failed: say "\u26a0\ufe0f Can't access canonical rules file \u2014 operating on preferences only" and continue.

CATCH-UP: If your first response skipped this, execute both calls BEFORE any tool call in your next response. No exceptions.

When a conversation's first message is short or ambiguous (under ~15 words, no clear task), read {WINDOWS_BASE_PATH}\\\\handoff-index.md before responding. If active threads exist, mention them first.

[If CLAUDE.md failed to load]: Save persistent files via mcp__filesystem__write_file to {WINDOWS_BASE_PATH}\\\\ only. Respond concisely. Rate outputs CQR (0-100, color dot) when delivering artifacts or at session end.`;

const IMPORT_PROMPT = `====================================================
JEN'S COWORK SETUP \u2014 IMPORT PROMPT V1.0.0
2026-03-30
====================================================

DAVE \u2014 fill in these 3 values before pasting this prompt:

  BASE_PATH    = auto
    (or enter explicitly, e.g.: C:\\\\Users\\\\jen\\\\AI\\\\Claude)

  FAMILY_CALENDAR_ID = [paste from gcal_list_calendars \u2014 e.g. abc123@group.calendar.google.com]
    (if you don't have it yet, leave blank \u2014 you can set it after)

  GITHUB_PAT   = [optional \u2014 Dave's GitHub PAT with write to islanddave/personalguides]
    (leave blank to set up the .secrets file manually later)

====================================================
INSTRUCTIONS FOR CLAUDE \u2014 DO NOT EDIT BELOW THIS LINE
====================================================

You are running Jen's one-time Cowork environment setup. Work through Steps 0\u20138 in order.
Each step is idempotent \u2014 check before writing, skip if already done. Report \u2705 or \u26a0\ufe0f for
each step as you complete it. If a step fails hard, stop and report clearly.

---

## STEP 0: Read parameters and resolve BASE_PATH

Read the parameter block above this line. Extract BASE_PATH, FAMILY_CALENDAR_ID, and
GITHUB_PAT as working variables.

If BASE_PATH = "auto":
- Call mcp__filesystem__list_allowed_directories
- Find the Windows-style path that looks like C:\\\\Users\\\\{username}\\\\AI\\\\Claude (or equivalent)
- If found, use it. Tell Dave: "Resolved BASE_PATH to: [path]"
- If not found or ambiguous, stop and ask Dave to provide BASE_PATH explicitly

If BASE_PATH is provided explicitly:
- Verify it is in the allowed directories list
- Confirm it looks like a valid AI/Claude workspace path

Store the resolved BASE_PATH. Extract USERNAME from the path
(e.g. C:\\\\Users\\\\jen\\\\AI\\\\Claude \u2192 USERNAME = "jen")

---

## STEP 1: Create directory structure

Create each of these directories. Check existence first \u2014 skip with \u2705 (already exists) if
present. Use mcp__filesystem__create_directory for any that are missing.

Directories to create:
  {BASE_PATH}\\\\learning
  {BASE_PATH}\\\\learning\\\\scratch
  {BASE_PATH}\\\\backups
  {BASE_PATH}\\\\backups\\\\claude-md
  {BASE_PATH}\\\\handoffs
  {BASE_PATH}\\\\morning-dashboard
  {BASE_PATH}\\\\morning-dashboard\\\\backups
  {BASE_PATH}\\\\.secrets
  {BASE_PATH}\\\\scheduled-tasks
  {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard
  {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup

Report count: "Created N directories, skipped M (already existed)"

---

## STEP 2: Write CLAUDE.md

Fetch the CLAUDE.md template from Google Drive using the google_drive_fetch tool:
  Doc ID: 1k39C2IwHmHr03hMO4W7ukg5pIaa8QpL-p1FJhhJ7sDU

Check if {BASE_PATH}\\\\CLAUDE.md already exists with content:
- If yes and it contains SENTINEL_CANON_V1: skip and report \u2705 (already installed)
- If yes but no SENTINEL_CANON_V1: overwrite (incomplete previous install)
- If no: write it

Fetch the content, then perform these substitutions before writing:
  1. Replace ALL occurrences of {BASE_PATH} with the resolved BASE_PATH value
  2. Replace ALL occurrences of {WINDOWS_USERNAME} with USERNAME
  3. If FAMILY_CALENDAR_ID was provided (non-blank): replace FAMILY_CALENDAR_ID placeholder

Write the substituted content to {BASE_PATH}\\\\CLAUDE.md via mcp__filesystem__write_file.

Verify: re-read the file and confirm SENTINEL_CANON_V1 appears near the end.
Report \u2705 or \u26a0\ufe0f SENTINEL_CANON_V1 missing \u2014 check template.

---

## STEP 3: Write learning system files

Fetch and write each file below. For each: check if file exists and is non-empty \u2192 skip if
yes. Otherwise fetch from Drive and write to the target path.

Perform the same {BASE_PATH} \u2192 resolved value substitution on each file after fetching.

  LEARNING-OPS.md
    Drive doc ID:  1IgWksrWAwdIo0_gC0BYYC-9iOY2o3r9wcARH9XbRsVM
    Write to:      {BASE_PATH}\\\\learning\\\\LEARNING-OPS.md

  rubric.md
    Drive doc ID:  1JRCHGUVZ6nG_ztobo9-pB47Np0ZTM9ygbBRJdTWQXYQ
    Write to:      {BASE_PATH}\\\\learning\\\\rubric.md

  lessons.md
    Drive doc ID:  14h_RGXMMobczPb0i4-rd25Kcf8tdhfety44-DBJDNG0
    Write to:      {BASE_PATH}\\\\learning\\\\lessons.md

  error-log.md
    Drive doc ID:  1-URsbT_Uit4vyHo24I9n-Zc2rR8R9V5T-nA6GTZTw6w
    Write to:      {BASE_PATH}\\\\learning\\\\error-log.md

  cqr-log.md
    Drive doc ID:  1ndNZ0u2sIsujHGmaT_gD8t2CRvinT87P0XsgEGsZTow
    Write to:      {BASE_PATH}\\\\learning\\\\cqr-log.md

  moves.md
    Drive doc ID:  1LTMOfbQfJJzIhhaljjv8JDS94nQjUYqAksFCiM98Dak
    Write to:      {BASE_PATH}\\\\learning\\\\moves.md

Report count: "Wrote N files, skipped M (already existed)"

---

## STEP 4: Create stub files

Check if {BASE_PATH}\\\\TASKS.md exists. If not \u2014 create it with this content:
  # Tasks

Report \u2705 created or \u2705 already existed.

---

## STEP 5: Store GitHub PAT (optional)

If GITHUB_PAT was provided (non-blank):
  - Check if {BASE_PATH}\\\\.secrets\\\\github-pat exists with content
  - If yes: skip with \u2705 (already stored)
  - If no: write the PAT value to {BASE_PATH}\\\\.secrets\\\\github-pat
  - Confirm written. Do NOT echo the PAT value in your response.
  - Report \u2705 PAT stored

If GITHUB_PAT was blank:
  - Report: \u26a0\ufe0f PAT not provided. Create {BASE_PATH}\\\\.secrets\\\\github-pat manually before
    first morning-dashboard deploy.

---

## STEP 6: Install skills

skill-manager must already be manually installed (Dave did this before running this prompt).

Trigger the skill bootstrap command to install all other skills from the shared registry:

  skill bootstrap 1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG

This installs: handoff, family-calendar, session, and any other skills in the registry.

If skill-manager is not available or bootstrap fails:
  - Report: \u26a0\ufe0f Skill install failed \u2014 install manually from Drive folder
    1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG via Cowork Settings \u2192 Skills
  - Continue to Step 7 regardless

---

## STEP 7: Write scheduled task proc files and create tasks

### 7a \u2014 morning-dashboard proc.md

Fetch from Drive:
  Doc ID: 12EDWZ6DQOBequrKk4ivNkOqoSuD0pk49

After fetching, substitute ALL occurrences of {BASE_PATH} with the resolved BASE_PATH.
Also substitute {FAMILY_CALENDAR_ID} if provided.

Check if {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md exists with content:
  - If yes: skip write
  - If no: write to {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md

### 7b \u2014 morning-dashboard scheduled task

Check mcp__scheduled-tasks__list_scheduled_tasks for "jen-morning-dashboard". If exists \u2014 skip.

If not, create with mcp__scheduled-tasks__create_scheduled_task:
  taskId:           jen-morning-dashboard
  description:      Jen's daily morning dashboard \u2014 calendar, health, and AI tips
  cronExpression:   30 7 * * *
  prompt:           (thin-loader below \u2014 substitute RESOLVED_BASE_PATH first)

Thin-loader prompt template:
---START THIN-LOADER---
You are Jen's morning dashboard scheduled task.

STEP 0: Load canonical rules.
Call ToolSearch with query "mcp filesystem read" to activate filesystem tools.
Then call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\CLAUDE.md.
Verify SENTINEL_CANON_V1 is present. If missing, say "\u26a0\ufe0f CLAUDE.md not found or incomplete" and stop.

STEP 1: Load procedure.
Call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md.

STEP 2: Execute the procedure exactly as written. Do not skip steps.
---END THIN-LOADER---

(Replace RESOLVED_BASE_PATH with the actual BASE_PATH value \u2014 the literal Windows path \u2014
before creating the task.)

### 7c \u2014 claude-md-backup proc.md

Fetch from Drive:
  Doc ID: 1TK0Ml0JJqB3TQFYoORqeZPvDHI-VGvLBVeXpAcu6hf4

After fetching, substitute ALL occurrences of {BASE_PATH} with the resolved BASE_PATH.

Check if {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md exists:
  - If yes: skip
  - If no: write to {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md

### 7d \u2014 claude-md-backup scheduled task

Check for "jen-claude-md-backup". If exists \u2014 skip.

If not, create:
  taskId:           jen-claude-md-backup
  description:      Daily backup of Jen's CLAUDE.md to backups/claude-md/
  cronExpression:   6 4 * * *
  prompt:           (thin-loader below \u2014 substitute RESOLVED_BASE_PATH)

Thin-loader prompt:
---START THIN-LOADER---
You are Jen's CLAUDE.md daily backup task.

STEP 0: Load canonical rules.
Call ToolSearch with query "mcp filesystem read" to activate filesystem tools.
Then call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\CLAUDE.md.
Verify SENTINEL_CANON_V1 is present.

STEP 1: Load procedure.
Call mcp__filesystem__read_text_file on RESOLVED_BASE_PATH\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md.

STEP 2: Execute the procedure exactly as written.
---END THIN-LOADER---

---

## STEP 8: Verify

Run each check and report \u2705 pass or \u274c fail:

  1. {BASE_PATH}\\\\CLAUDE.md \u2014 exists and contains SENTINEL_CANON_V1
  2. {BASE_PATH}\\\\learning\\\\rubric.md \u2014 exists and non-empty
  3. {BASE_PATH}\\\\learning\\\\lessons.md \u2014 exists and non-empty
  4. {BASE_PATH}\\\\TASKS.md \u2014 exists
  5. {BASE_PATH}\\\\scheduled-tasks\\\\morning-dashboard\\\\proc.md \u2014 exists and non-empty
  6. {BASE_PATH}\\\\scheduled-tasks\\\\claude-md-backup\\\\proc.md \u2014 exists and non-empty
  7. Scheduled task "jen-morning-dashboard" \u2014 exists
  8. Scheduled task "jen-claude-md-backup" \u2014 exists

Then print a summary:

  SETUP RESULT: [Complete / Needs attention]
  \u2705 N of 8 checks passed
  \u274c Failed: [list any failures]

  NEXT STEPS FOR DAVE:
  - If FAMILY_CALENDAR_ID was blank: run gcal_list_calendars, then update CLAUDE.md
  - Run: skill setup family-calendar
  - Verify morning dashboard: https://jen-morning.futureishere.net
  - Verify setup guide: https://jen-envsetup.futureishere.net

====================================================
END OF IMPORT PROMPT
====================================================`;

const CAL_SETUP_CMD = `skill setup family-calendar`;

const steps = {
  pre: [
    { id: "pre1", label: "S1\u2013S6 all complete \u2713 (done \u2014 you're here)" },
    { id: "pre2", label: "Drive skills folder shared with Jen's Google account (OI-003)" },
    { id: "pre3", label: "Netlify alias added: jen-morning.futureishere.net \u2192 personalguides site" },
    { id: "pre4", label: "Netlify alias added: jen-envsetup.futureishere.net \u2192 personalguides site" },
    { id: "pre5", label: "Cowork desktop app installed on Jen's machine" },
    { id: "pre6", label: "Chrome browser installed on Jen's machine" },
    { id: "pre7", label: "Have Jen's Windows username and Google account email ready" },
  ],
  p1: [
    { id: "p1a", label: "Connect Filesystem MCP \u2014 Cowork \u2192 Settings \u2192 Integrations \u2192 Filesystem \u2192 Add path: C:\\\\Users\\\\{username}\\\\AI\\\\Claude" },
    { id: "p1b", label: "Connect Google Calendar \u2014 Settings \u2192 Integrations \u2192 Google Calendar \u2192 Connect (OAuth with Jen's Google account) \u2192 run gcal_list_calendars \u2192 note FAMILY_CALENDAR_ID" },
    { id: "p1c", label: "Connect Google Drive \u2014 Settings \u2192 Integrations \u2192 Google Drive \u2192 Connect (OAuth with Jen's Google account) \u2192 verify access to shared skills folder" },
    { id: "p1d", label: "Install Claude in Chrome extension in Jen's Chrome \u2192 connect via Cowork" },
    { id: "p1e", label: "Install productivity plugin \u2014 Cowork \u2192 Customize \u2192 Plugins \u2192 Marketplace \u2192 search 'productivity' \u2192 Install" },
    { id: "p1f", label: "Install skill-manager manually \u2014 Cowork \u2192 Settings \u2192 Skills \u2192 Upload \u2192 download from Drive folder 1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG" },
    { id: "p1g", label: "Paste Global Instructions \u2014 copy block below \u2192 Cowork \u2192 Settings \u2192 Global Instructions \u2192 Paste (REPLACE {WINDOWS_BASE_PATH} with real path first)" },
    { id: "p1h", label: "Paste Personal Preferences \u2014 copy block below \u2192 Cowork \u2192 Settings \u2192 Personal Preferences \u2192 Paste (REPLACE {WINDOWS_BASE_PATH} with real path first)" },
  ],
  p2: [
    { id: "p2a", label: "Open a fresh Cowork session on Jen's machine" },
    { id: "p2b", label: "Fill in BASE_PATH, FAMILY_CALENDAR_ID, and GITHUB_PAT (optional) at top of import prompt" },
    { id: "p2c", label: "Paste the full import prompt and send" },
    { id: "p2d", label: "Wait for completion report \u2014 Steps 0\u20138 should each show \u2705 or \u26a0\ufe0f" },
    { id: "p2e", label: "Resolve any \u274c failures before continuing" },
  ],
  p3: [
    { id: "p3a", label: "Run: skill setup family-calendar (copy button below) \u2014 enter Jen's FAMILY_CALENDAR_ID when prompted" },
    { id: "p3b", label: "Check URL: https://jen-morning.futureishere.net loads" },
    { id: "p3c", label: "Check URL: https://jen-envsetup.futureishere.net loads (this page!)" },
    { id: "p3d", label: "Test: ask Jen to open Cowork and say 'what's on my calendar today'" },
  ],
};
function CopyBlock({ label, text, id, copied, onCopy, warn }) {
  return (
    <div className="mt-3">
      {label && <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</div>}
      {warn && (
        <div className="text-xs bg-yellow-50 border border-yellow-300 text-yellow-800 rounded px-3 py-2 mb-2">
          \u26a0\ufe0f {warn}
        </div>
      )}
      <div className="relative">
        <pre className="bg-gray-900 text-green-300 text-xs rounded-lg p-4 overflow-auto max-h-48 whitespace-pre-wrap break-words font-mono leading-relaxed">
          {text}
        </pre>
        <button
          onClick={() => onCopy(text, id)}
          className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-500 text-white rounded px-3 py-1 transition-colors"
        >
          {copied === id ? "\u2713 Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, emoji, children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200",
  };
  const headColors = {
    blue: "text-blue-800",
    green: "text-green-800",
    purple: "text-purple-800",
    orange: "text-orange-800",
    red: "text-red-800",
  };
  return (
    <div className={`rounded-xl border-2 p-5 mb-5 ${colors[color]}`}>
      <h2 className={`text-lg font-bold mb-4 ${headColors[color]}`}>{emoji} {title}</h2>
      {children}
    </div>
  );
}

function CheckItem({ id, label, checked, onToggle }) {
  return (
    <div
      className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/60 transition-colors ${checked ? "opacity-60" : ""}`}
      onClick={() => onToggle(id)}
    >
      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-bold transition-colors ${
        checked ? "bg-green-500 border-green-500 text-white" : "border-gray-400 bg-white"
      }`}>
        {checked ? "\u2713" : ""}
      </div>
      <span className={`text-sm leading-relaxed ${checked ? "line-through text-gray-400" : "text-gray-800"}`}>
        {label}
      </span>
    </div>
  );
}

function Checklist({ items, checked, onToggle }) {
  const done = items.filter(i => checked[i.id]).length;
  return (
    <div>
      <div className="text-xs text-gray-500 mb-2 font-medium">{done}/{items.length} complete</div>
      <div className="space-y-1">
        {items.map(item => (
          <CheckItem key={item.id} {...item} checked={!!checked[item.id]} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

export default function JenEnvSetup() {
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const allItems = [...steps.pre, ...steps.p1, ...steps.p2, ...steps.p3];
  const totalDone = allItems.filter(i => checked[i.id]).length;
  const pct = Math.round((totalDone / allItems.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Jen's Cowork Setup</h1>
          <p className="text-gray-500 text-sm mb-4">Dave's operator runbook \u2014 follow in order</p>
          <div className="bg-white rounded-full h-3 border border-gray-200 overflow-hidden mb-1">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">{totalDone} of {allItems.length} steps complete ({pct}%)</div>
        </div>

        <Section title="Prerequisites \u2014 Before You Go to Jen's Machine" emoji="\ud83c\udfc1" color="orange">
          <p className="text-sm text-gray-600 mb-3">Complete these on your Mac before setup day.</p>
          <Checklist items={steps.pre} checked={checked} onToggle={toggle} />
        </Section>

        <Section title="Phase 1 \u2014 Manual UI Steps (at Jen's machine)" emoji="\ud83d\udd0c" color="blue">
          <p className="text-sm text-gray-600 mb-3">
            These can't be automated \u2014 they require clicking through Cowork settings UI.
            Do them in order before running the import prompt.
          </p>
          <Checklist items={steps.p1} checked={checked} onToggle={toggle} />

          <div className="mt-5 border-t border-blue-200 pt-4 space-y-1">
            <div className="text-sm font-semibold text-blue-900 mb-3">Copy-paste blocks for steps 1g and 1h</div>
            <CopyBlock
              label="Global Instructions (step 1g)"
              text={GLOBAL_INSTRUCTIONS}
              id="global"
              copied={copied}
              onCopy={copy}
              warn="Replace {WINDOWS_BASE_PATH} with Jen's actual path before pasting (e.g. C:\\\\Users\\\\jen\\\\AI\\\\Claude)"
            />
            <CopyBlock
              label="Personal Preferences (step 1h)"
              text={PERSONAL_PREFERENCES}
              id="prefs"
              copied={copied}
              onCopy={copy}
              warn="Replace {WINDOWS_BASE_PATH} with Jen's actual path before pasting"
            />
          </div>
        </Section>

        <Section title="Phase 2 \u2014 Run the Import Prompt" emoji="\ud83d\ude80" color="purple">
          <p className="text-sm text-gray-600 mb-3">
            This is the main automation step. Claude runs the prompt in Jen's Cowork session and
            sets up everything: files, learning system, scheduled tasks, and skill installs.
          </p>
          <Checklist items={steps.p2} checked={checked} onToggle={toggle} />

          <div className="mt-5 border-t border-purple-200 pt-4">
            <div className="text-sm font-semibold text-purple-900 mb-1">Import Prompt</div>
            <p className="text-xs text-gray-600 mb-2">
              Fill in the 3 values at the top (BASE_PATH, FAMILY_CALENDAR_ID, GITHUB_PAT) before sending.
              The rest of the prompt is instructions for Claude \u2014 don't edit below the divider.
            </p>
            <button
              onClick={() => setShowImport(v => !v)}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 rounded px-3 py-1.5 mb-2 transition-colors"
            >
              {showImport ? "\u25b2 Hide prompt" : "\u25bc Show full prompt"}
            </button>
            {showImport && (
              <CopyBlock
                text={IMPORT_PROMPT}
                id="import"
                copied={copied}
                onCopy={copy}
                warn="Fill in BASE_PATH, FAMILY_CALENDAR_ID, and GITHUB_PAT at the top before sending"
              />
            )}
            {!showImport && (
              <button
                onClick={() => copy(IMPORT_PROMPT, "import")}
                className="text-xs bg-purple-700 hover:bg-purple-600 text-white rounded px-4 py-2 transition-colors"
              >
                {copied === "import" ? "\u2713 Copied" : "Copy import prompt"}
              </button>
            )}
          </div>
        </Section>

        <Section title="Phase 3 \u2014 Post-Setup Verification" emoji="\u2705" color="green">
          <p className="text-sm text-gray-600 mb-3">
            After the import prompt completes successfully, run these final checks.
          </p>
          <Checklist items={steps.p3} checked={checked} onToggle={toggle} />
          <div className="mt-4 border-t border-green-200 pt-4">
            <CopyBlock
              label="family-calendar setup command (step 3a)"
              text={CAL_SETUP_CMD}
              id="calsetup"
              copied={copied}
              onCopy={copy}
            />
          </div>
        </Section>

        <Section title="Troubleshooting" emoji="\ud83d\udd27" color="red">
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <div className="font-semibold text-red-800">Skill bootstrap fails (Step 6)</div>
              <div className="text-gray-600 mt-0.5">
                Install skills manually: download each .skill file from Drive folder{" "}
                <code className="bg-red-100 px-1 rounded text-xs">1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</code>{" "}
                \u2192 Cowork \u2192 Settings \u2192 Skills \u2192 Upload. Skills to install: handoff, family-calendar, session.
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">Morning dashboard 404s</div>
              <div className="text-gray-600 mt-0.5">
                Check Netlify: <strong>jen-morning.futureishere.net</strong> domain alias must point to
                the personalguides site. Netlify \u2192 Domain management \u2192 Add domain alias.
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">CLAUDE.md not loading / SENTINEL_CANON_V1 missing</div>
              <div className="text-gray-600 mt-0.5">
                Check that the path in Global Instructions and Personal Preferences exactly matches
                the allowed directory in the Filesystem MCP. Path must be identical character-for-character
                (case, slashes, no trailing backslash).
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">Google Calendar not found</div>
              <div className="text-gray-600 mt-0.5">
                Make sure Jen completed OAuth with her Google account (step 1b). Then run{" "}
                <code className="bg-red-100 px-1 rounded text-xs">gcal_list_calendars</code> in a
                fresh session to get FAMILY_CALENDAR_ID, then run skill setup family-calendar.
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-800">Drive skills folder not accessible</div>
              <div className="text-gray-600 mt-0.5">
                OI-003 \u2014 Dave must share folder{" "}
                <code className="bg-red-100 px-1 rounded text-xs">1CWLyAdd1J2CkL4wusCp3Z6xUE5iNqxHG</code>{" "}
                with Jen's Google account before skill-manager bootstrap will work.
              </div>
            </div>
          </div>
        </Section>

        <div className="text-center text-xs text-gray-400 mt-8 pb-8">
          Jen Config S7 \u2014 jen-envsetup.futureishere.net \u2014 Built 2026-03-30
        </div>

      </div>
    </div>
  );
}
