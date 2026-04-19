import { useState } from "react";

// ══════════════════════════════════════════════════════════════════════════
// SOURCE OF TRUTH FOR COMPONENT CODE.
// Any change to a component (RatingPanel, CalendarSection, etc.) MUST be made
// here in this file — NOT in morning-dashboard-latest.jsx or deploy-queue.jsx.
// Those files are outputs generated FROM this prototype. Editing them directly
// means the next morning run will silently revert your change.
// ══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// LIVE DATA — Claude replaces ONLY this section. Component code is frozen.
// ═══════════════════════════════════════════════════════════════════════════

const BRIEFING_DATE = "Sunday, Apr 19";
const BRIEFING_TIME = "7:31a";
const TIP_DATE = "0419.0731"; // MMDD.HHMM — scopes tip IDs to this run
const GREETING = "Good morning, Dave.";

// Calendar data
const CAL_SUMMARY = "Clear today";
const calEvents = [];
const IS_MONDAY = false;
const weekShape = [];

// Systems health data
const SYSTEMS_STATUS = "amber";
const SYSTEMS_SUMMARY = "Meta systemic ×3 (7d): context-parsing, registry gaps, Block CE hard-stop. mcp-behavior recurring ×2. Manifest backlog ~30.";
const ERROR_COUNT_24H = 1;
const ERROR_COUNT_7D = 6;
const PRIORITY_ACTION = {
  title: "Run apply_manifest_update_20260419.py",
  fix: "Terminal: python3 session-backups/apply_manifest_update_20260419.py — registers ~30 sessions",
  impact: "manifest.json diverging daily; Drive backlog ~30 and growing",
};
const errorTrends = [
  {
    label: "meta",
    count7d: 3,
    direction: "up",
    detail: "Context-parsing miss on continuation pickup (Apr 14, HIGH), registry gap (Apr 15, low), Block CE hard-stop (Apr 18, low). 3 instances = systemic. 27 min burned.",
    fix: "Echo-confirm action against handoff Pending before any bootstrap on continuation sessions. Proc gaps → proc fix before next run.",
  },
  {
    label: "mcp-behavior",
    count7d: 2,
    direction: "flat",
    detail: "edit_file schema confusion (Apr 13, low) and google_drive_fetch param (Apr 13, low). Both resolved immediately. Pattern: schema not checked before call.",
    fix: "ToolSearch before first MCP call each session. AE-013 cached: mcp edit = edits:[{oldText,newText}]; built-in Edit = old_string/new_string.",
  },
  {
    label: "deploy/build",
    count7d: 1,
    direction: "flat",
    detail: "Netlify project enumeration miss (Apr 14, HIGH, 25 min burned). AE-022 now deployed — first check is project enumeration via API.",
    fix: "AE-022 first-check rule active. Enumerate Netlify projects FIRST on any content-length:0 symptom.",
  },
];

// Tips data
const TIPS_LABEL = "10 tips scored";
const tips = [
  {
    id: 1, score: 92, category: "Projects",
    headline: "Cowork settings hit 14-day drift threshold TODAY",
    detail: "The Cowork settings snapshot was last updated Apr 5 — exactly 14 days ago. awesome-nifty-cannon thread has PASTE files ready in CLAUDE-md-fix/. Two paste ops in Cowork Settings → Global Instructions + User Preferences updated → thread closes. The 14-day flag fires in tomorrow's dashboard if this isn't done.",
    action: "Open Cowork Settings → paste from CLAUDE-md-fix/PASTE-cowork-global-claude-md.txt, then PASTE-user-preferences.txt",
    sessionPrompt: "I want to paste the Cowork settings updates from CLAUDE-md-fix/. Walk me through what to paste and where so I can close the awesome-nifty-cannon thread.",
  },
  {
    id: 2, score: 88, category: "Automation",
    headline: "Design the auto-apply manifest step — close the recurrence permanently",
    detail: "The session-archive manifest update has been a manual Terminal step for 4+ consecutive days (apply_manifest_update_20260419.py, ~30-session backlog). The fix is a post-archive proc.md step that calls the script automatically after each archival run. One automation session ends the daily reminder.",
    action: "Design and add an auto-apply step to session-archive proc.md that runs the manifest update script post-archive",
    sessionPrompt: "I want to automate apply_manifest_update_*.py so it runs automatically after every session-archive run. Read the session-archive proc.md and design the addition. The script lives in session-backups/.",
  },
  {
    id: 3, score: 86, category: "Agents",
    headline: "Dispatch JSX validation agent — unblocks Block CE momentum item",
    detail: "The Block Consideration Engine scored a 3-day momentum block at 79/100 yesterday but hit a hard-stop at pre-flight validation: the prototype is 77KB, too large to JSX-validate inline. A dedicated agent dispatch pattern solves this: dispatch with only the prototype path, agent reads in isolation, returns brace count + hook inventory + parse verdict. Unblocks implementation this session.",
    action: "Dispatch: 'Read /Users/davenichols/AI/Claude/morning-dashboard/morning-dashboard-prototype.jsx. Count JSX pairs, inventory all hooks (useState, useEffect, etc.), verify no parse errors. Return verdict.'",
    sessionPrompt: "I need to validate the morning-dashboard prototype JSX before implementing a new block. Read the prototype at /Users/davenichols/AI/Claude/morning-dashboard/morning-dashboard-prototype.jsx and give me: total line count, all hooks used, and any parse/brace errors.",
  },
  {
    id: 4, score: 84, category: "Projects",
    headline: "Deploy pipeline followups: vault write is the easiest first item",
    detail: "confident-determined-lamport (5d) has 5 items: GitHub PAT tracking, vault write, CLAUDE.md rule extension, NS1 key, monthly health check. The vault write is the fastest: capture Netlify site topology (project IDs, aliases, kinkguide vs personalguides) to Obsidian reference/deploy-pipeline.md. Zero tools, 10 min, closes one of 5 items.",
    action: "Write Netlify site topology + PAT expiry context to Obsidian/Claude/reference/deploy-pipeline.md",
    sessionPrompt: "pickup deploy pipeline followups — I want to start with the vault write item. Help me capture the Netlify site topology (site IDs, domain aliases, which project serves which subdomain) to Obsidian reference/deploy-pipeline.md.",
  },
  {
    id: 5, score: 82, category: "Dave-actionable-strategy",
    headline: "Maquis Inc research: 30-min sprint or archive today",
    detail: "stoic-jolly-cerf is 17 days old with a single mandate: deep research on Maquis Inc (NY, Sept 2025) and all businesses using 'Maquis' globally. No progress. No blocker. Sunday is the ideal day to run the 30-min agent research sprint or make the archive call. No thread should idle at 20 days without a decision.",
    action: "Either: dispatch a research agent for Maquis Inc today, OR archive the thread",
    sessionPrompt: "pickup maquis inc research — I want to either complete this research sprint today or consciously archive the thread. Start by reminding me what I originally wanted from this, then let's decide.",
  },
  {
    id: 6, score: 80, category: "Dave-actionable-workflow",
    headline: "Dashboard tips overhaul: textbook archive candidate",
    detail: "friendly-practical-darwin (14 days, status: active) — the handoff summary says 'no changes made, all pending items carry forward.' That's the definition of a stale no-progress thread. If there's no specific plan to advance it, archive it. One call, thread gone, index lighter.",
    action: "Read handoff for friendly-practical-darwin and decide: concrete plan or archive",
    sessionPrompt: "I want to either advance or archive the dashboard-tips-overhaul thread (friendly-practical-darwin). Load the handoff and tell me what's pending, then recommend: continue or archive?",
  },
  {
    id: 7, score: 78, category: "Dave-actionable-workflow",
    headline: "Vault write enforcement Option B is still unscoped (10d)",
    detail: "trusting-youthful-einstein (10d): Option A (handoff verification step) was built and deployed. Option B (scheduled enrichment task) was scoped as a follow-on but never designed. The handoff is marked active, meaning the thread is open. A 20-min session designs Option B and closes the thread.",
    action: "Design Option B: scheduled task that enriches vault from recent session context",
    sessionPrompt: "pickup vault write enforcement — I want to design Option B (the scheduled enrichment task). Read the trusting-youthful-einstein handoff and let's scope the task.",
  },
  {
    id: 8, score: 76, category: "Workflow",
    headline: "chat rename removal: confirm daemon idle, then archive",
    detail: "sleepy-serene-mayer (11d): 'Step 9 excised from handoff skill, daemon installed but idle — optional cleanup only.' The daemon is installed but not running anything. Confirm with launchctl, then archive. A 2-minute confirmation closes an 11-day thread.",
    action: "Run: launchctl list | grep rename — if no output, daemon is idle → archive the thread",
    sessionPrompt: "I want to confirm the chat-rename daemon is idle and archive the sleepy-serene-mayer thread. Check launchctl for any rename-related daemon and tell me if it's safe to mark this integrated.",
  },
  {
    id: 9, score: 74, category: "Workflow",
    headline: "Bootstrap phase 1 elimination: one investigation session",
    detail: "intelligent-lucid-albattani (13d): 'investigate whether ToolSearch can be eliminated by making filesystem MCP always-available (1 round trip vs 2).' This is a concrete question with a concrete test. One session, one CLAUDE.md update, 1 RT saved per session. Or kill the thread if the investigation shows it's not feasible.",
    action: "Investigate: can filesystem MCP be made always-available in Cowork? Read /Users/davenichols/AI/Claude/claude_desktop_config.json tooling notes.",
    sessionPrompt: "pickup bootstrap phase 1 elimination — I want to investigate whether the filesystem MCP can be always-available so ToolSearch isn't needed. Tell me what the handoff says about the investigation path.",
  },
  {
    id: 10, score: 72, category: "Workflow",
    headline: "Log health automation thread looks completable",
    detail: "optimistic-great-bardeen (11d): 'Automated daily log health checks in morning-dashboard — session-archive.log and deploy-log.md now parsed in Step 3j; escalates to SYSTEMS_STATUS when failures detected, silent when healthy.' That sounds done. Read the handoff — if Pending is empty or None, archive it.",
    action: "Read optimistic-great-bardeen handoff — if Pending=None, mark integrated",
    sessionPrompt: "Read the handoff for optimistic-great-bardeen (log-health-automation) at /Users/davenichols/AI/Claude/handoffs/handoff-20260408.0844-optimistic-great-bardeen.md and tell me if it's archivable.",
  },
];

// Skills progress
const SKILLS_PROGRESS = [
  { name: "Calendar",      level: "Stable",  trend: "→" },
  { name: "Handoff",       level: "Stable",  trend: "↑" },
  { name: "Bible",         level: "Stable",  trend: "→" },
  { name: "Cartography",   level: "Early",   trend: "→" },
  { name: "Skill Manager", level: "Stable",  trend: "→" },
  { name: "Session",       level: "Early",   trend: "→" },
];

// Thread Pulse
const threads = [
  { title: "cowork settings paste", project: "Claude", status: "active", ageLabel: "5d", summary: "GI rearchitecture done, CLAUDE.md V3 check live, handoff v2.3.1 deployed. Remaining: paste Global Instructions + User Preferences into Cowork Settings.", pickupCmd: "pickup cowork settings paste", stale: false },
  { title: "deploy pipeline followups", project: "Claude", status: "active", ageLabel: "5d", summary: "5 items: GitHub PAT tracking, vault write, CLAUDE.md rule, NS1 key, monthly health check. RES-001/003/004 fixed.", pickupCmd: "pickup deploy pipeline followups", stale: false },
  { title: "dashboard conflict display bug", project: "Claude", status: "active", ageLabel: "4d", summary: "Fixed blank ⚠️ icons — conflict field must be string not boolean. proc.md schema + prototype defensive fallback deployed.", pickupCmd: "pickup dashboard conflict display bug", stale: false },
  { title: "cqr log row fix", project: "Claude", status: "active", ageLabel: "6d", summary: "Fixed malformed great-quirky-heisenberg row in cqr-log.md. conf-range and FF columns corrected.", pickupCmd: "pickup cqr log row fix", stale: false },
  { title: "jen config v3.8.0 sync", project: "jen-config", status: "active", ageLabel: "6d", summary: "CLAUDE.md cascade complete, manifest v3.8.0 with PDF_Tools+Word connectors. Drive manifest sync pending (relay-manifest-upload.py).", pickupCmd: "pickup jen config v3.8.0 sync", stale: false },
  { title: "raisin freshstart everbank research", project: "Finance", status: "active", ageLabel: "5d", summary: "FRESHSTART + EverBank 4.10% likely stackable (~75% conf). EverBank featured on FRESHSTART landing page. Docx update pending.", pickupCmd: "pickup raisin freshstart everbank stacking research", stale: false },
  { title: "treasury t-bill execution", project: "Finance", status: "active", ageLabel: "6d", summary: "8-week T-bills at Schwab, flat curve confirmed. $110k Apr 15 auction. Confirm execution status.", pickupCmd: "pickup treasury t-bill execution", stale: false },
  { title: "vault write enforcement", project: "Claude", status: "active", ageLabel: "10d", summary: "Option A (handoff verification v2.0.4) deployed. Option B (scheduled enrichment task) unscoped.", pickupCmd: "pickup vault write enforcement", stale: true },
  { title: "chat rename removal", project: "Claude", status: "active", ageLabel: "11d", summary: "Step 9 excised from handoff skill, deployed v2.0.3. Daemon idle — optional cleanup only.", pickupCmd: "pickup chat rename removal", stale: true },
  { title: "log health automation", project: "Claude", status: "active", ageLabel: "11d", summary: "Step 3j added — session-archive + deploy-log parsed, SYSTEMS_STATUS escalation live.", pickupCmd: "pickup log health automation", stale: true },
  { title: "session archive sentinel verified", project: "Claude", status: "active", ageLabel: "11d", summary: "Completion sentinel step confirmed in proc. task-sentinels/ dir live.", pickupCmd: "pickup session archive sentinel verified", stale: true },
  { title: "bootstrap phase 1 elimination", project: "Claude", status: "active", ageLabel: "13d", summary: "PREFS_KERNEL_V3 deployed. Investigate always-available filesystem MCP to eliminate ToolSearch RT.", pickupCmd: "pickup bootstrap phase 1 elimination", stale: true },
  { title: "delete stale scheduled task", project: "Claude", status: "active", ageLabel: "13d", summary: "skill-token-optimization-run confirmed disabled, no API delete — needs manual removal via Cowork UI.", pickupCmd: "pickup delete stale scheduled task", stale: true },
  { title: "dashboard tips overhaul", project: "Claude", status: "active", ageLabel: "14d", summary: "No-op session — loaded quirky-magical-meitner, confirmed state, no changes made. All pending items carry forward.", pickupCmd: "pickup dashboard tips overhaul", stale: true },
  { title: "maquis inc research", project: "Claude", status: "active", ageLabel: "17d", summary: "Deep research on Maquis Inc (NY, Sept 2025) and all 'Maquis' businesses globally with tech/AI emphasis.", pickupCmd: "pickup maquis inc research", stale: true },
  { title: "jen config project scoping", project: "jen-config", status: "active", ageLabel: "16d", summary: "Scoped jen-config as standalone Project. 3 index hygiene items executed.", pickupCmd: "pickup jen config project scoping", stale: true },
  { title: "jen setup day ready to execute", project: "jen-config", status: "active", ageLabel: "18d", summary: "Consolidated setup day handoff. Manifest v2.5.3, V4.2.0 canonical, all blockers cleared. Pick up on Jen's Windows machine.", pickupCmd: "pickup jen setup day ready to execute", stale: true },
  { title: "stoic-jolly-cerf maquis research", project: "Claude", status: "loaded", ageLabel: "17d", summary: "Deep research on Maquis Inc (NY, Sept 2025) and all businesses using 'Maquis' globally.", pickupCmd: "pickup maquis inc research", stale: true },
  { title: "optimistic-tender-galileo cqr fix", project: "Claude", status: "loaded", ageLabel: "6d", summary: "Fixed malformed great-quirky-heisenberg row. conf-range=[80-88], ff-level=Low corrected.", pickupCmd: "pickup cqr log row fix", stale: false },
];
const THREAD_COUNT = 19;
const THREAD_STALE_COUNT = 12;

// Open Decisions
const DECISIONS_LABEL = "0 open";
const openDecisions = [];

// Morning Intent
const morningIntent = [
  { rank: 1, text: "Cowork settings 14-day drift hits TODAY — paste 2 files, close awesome-nifty-cannon thread", source: "systems", pickupCmd: "Open Cowork Settings and paste PASTE-cowork-global-claude-md.txt then PASTE-user-preferences.txt from CLAUDE-md-fix/" },
  { rank: 2, text: "Run apply_manifest_update_20260419.py — morning archive ran clean, ~30 sessions unregistered", source: "systems", pickupCmd: "Run: python3 /Users/davenichols/AI/Claude/session-backups/apply_manifest_update_20260419.py" },
  { rank: 3, text: "Dispatch JSX validation agent — unblocks Block CE 3-day momentum item deferred since yesterday", source: "threads", pickupCmd: "I need to validate the morning-dashboard prototype JSX before implementing a new block. Read the prototype and return brace count + hooks + parse verdict." },
];

// Consulting Signals
const consultSignals = [];
const CONSULT_SIGNAL_DATE = "2026-04-19";

// Goal Anchor
const goalAnchor = {
  label: "AI Consulting Practice",
  target: "First paying engagement",
  milestone: "Day 24 of 90-day sprint",
  elapsedPct: 13,
  horizonLabel: "Sep 26, 2026",
};

// Monday Scorecard
const mondayScorecard = null;

// Dashboard Meta
const dashboardMeta = {
  version: "V009-20260413",
  changelog: [
    { date: "2026-04-13", type: "added",   item: "Open Decisions block",          note: "Surfaces unresolved choices from handoff [DECISION]-tagged Pending items. Stakes-coded, stale-flagged, expandable with context and copyable pickup cmd." },
    { date: "2026-04-13", type: "changed", item: "Signals — talking point layer", note: "Each signal now includes a ready-to-paste verbatim talking point for outreach or calls. Copy button per signal." },
    { date: "2026-04-01", type: "added",   item: "Dashboard Meta block",      note: "Self-documenting: block inventory, changelog, and next-evolution ideas with copy prompts." },
    { date: "2026-03-28", type: "added",   item: "Morning Intent block",       note: "Top 3 synthesized priorities from threads, calendar, goals, systems. Replaced passive summary." },
    { date: "2026-03-28", type: "added",   item: "Goal Anchor block",          note: "90-day sprint progress bar driven by goals.json. Gives the daily grind a horizon line." },
    { date: "2026-03-28", type: "added",   item: "Consulting Signal block",    note: "3 curated industry signals, each connected to practice positioning." },
    { date: "2026-03-27", type: "changed", item: "Calendar → sidebar",         note: "Shifted from main column to sidebar so tips and threads get more vertical space." },
    { date: "2026-03-26", type: "added",   item: "Thread Pulse block",         note: "Full thread list with age, project, stale flag, and copyable pickup commands." },
    { date: "2026-03-25", type: "changed", item: "Tip ID copy",                note: "Each tip gets a copyable ID for the tip-rating feedback loop." },
    { date: "2026-03-24", type: "added",   item: "Monday Scorecard block",     note: "Weekly CQR analysis by domain, conditionally rendered on Mondays." },
  ],
  nextIdeas: [
    {
      idea: "3-day momentum block",
      desc: "Yesterday's key action, today's primary move, what tomorrow unlocks. Makes sprint progress feel real even on slow days.",
      sessionPrompt: "I want to add a '3-day momentum' block to my morning dashboard. It should show: yesterday's key action, today's primary move, and what tomorrow unlocks. Draft the data schema and a React component matching the dashboard's visual style.",
    },
    {
      idea: "Weekly rhythm view",
      desc: "Which day is deep work, outreach, Nika, rest. Puts each daily card in context of the week's intended shape.",
      sessionPrompt: "I want to add a weekly rhythm block to my morning dashboard showing my intended day-type for each day (deep work / outreach / family / rest). Draft the data structure and a React component matching the dashboard's visual style.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT — Do not modify below this line.
// ═══════════════════════════════════════════════════════════════════════════

// Static per-skill metadata. Never changes day-to-day — task only writes SKILLS_PROGRESS (3 dynamic fields).
const SKILLS_META = {
  "Calendar": {
    description: "ADHD-friendly calendar management via Google Calendar. Triggers on the 'cal' prefix. Handles day/week views, event creation, conflict detection, and prep nudges.",
    nextStep: {
      New: "Use it in 2–3 real sessions. Check trigger patterns and GCal read/write access.",
      Early: "Exercise conflict detection and prep nudges. Verify week-view on Mondays.",
      Maturing: "Edge cases: multi-day events, timezone events, and cancellations. Check allDay handling.",
      Stable: "Stable — monitor for GCal API changes or trigger drift. No active gaps.",
    },
    sessionPrompt: null,
  },
  "Handoff": {
    description: "Session continuity system. Writes structured handoff files (State, Decisions, Pending, Landmines), maintains the handoff index, and supports auto-pickup at session start.",
    nextStep: {
      New: "Write a handoff at end of any 3+ tool-call session. Verify the index is written.",
      Early: "Test auto-pickup in a fresh session. Verify 'pickup [slug]' loads the right file.",
      Maturing: "Validate multi-thread scenarios. Test dispatch handoffs from autonomous sessions.",
      Stable: "Stable and rising — auto-pickup reliability is the quality bar. Watch for index drift in multi-session days.",
    },
    sessionPrompt: null,
  },
  "Bible": {
    description: "World Bible management for The Overwritten. Read/write/commit to a Google Doc via Apps Script relay. In-session patch log prevents data loss before commits.",
    nextStep: {
      New: "Run a 'bible get' and 'bible add' cycle. Verify relay auth is working.",
      Early: "Test 'bible commit' with a descriptive message. Verify version shows in Drive history.",
      Maturing: "Validate 'bible rollback' and patch log recovery on a resumed session.",
      Stable: "Stable — relay endpoint drift is the main risk. Test after any Apps Script redeploy.",
    },
    sessionPrompt: "bible status",
  },
  "Cartography": {
    description: "Map creation and versioning for The Overwritten. SVG-as-text stored in Google Docs. Supports world, region, and city map types with named revision system and patch log.",
    nextStep: {
      New: "Run 'map new' for a simple test map. Verify the Google Doc is created in the World Bible folder.",
      Early: "Complete 2–3 end-to-end sessions: create, edit, commit, rollback. Validate patch log recovery on resume.",
      Maturing: "Test all map types (world/region/city). Exercise alias and orphan commands.",
      Stable: "Stable — validate after any Apps Script or Drive folder change.",
    },
    sessionPrompt: "map status",
  },
  "Skill Manager": {
    description: "Deploy, install, and update shared skills via Google Drive. Manages the skill registry and bootstrap flow for sharing skills across environments.",
    nextStep: {
      New: "Run 'skill status' to verify registry access. Try installing one skill.",
      Early: "Test full deploy/install cycle. Verify the skill appears in Cowork Customize → Skills.",
      Maturing: "Validate update flow on an existing skill. Check for version conflicts.",
      Stable: "Stable — validate after any Drive folder reorganization or relay endpoint change.",
    },
    sessionPrompt: null,
  },
  "Session": {
    description: "Session orchestrator. Loads the right skill stubs for a given work context: book, consulting, design, coding, writing. Reduces cold-start friction for recurring workflows.",
    nextStep: {
      New: "Try 'book session' and 'consulting session'. Verify the right skills are stub-loaded.",
      Early: "Exercise at least 3 session types. Confirm the right tools are available after load.",
      Maturing: "Add a new session type for a workflow not yet covered. Test transition between session types.",
      Stable: "Stable — add new session types as workflows develop. Monitor for stub-load drift.",
    },
    sessionPrompt: "session list",
  },
};

const LEVEL_STYLE = {
  New:      { color: "#6b7280", bg: "#f3f4f6" },
  Early:    { color: "#92400e", bg: "#fef3c7" },
  Maturing: { color: "#5b21b6", bg: "#ede9fe" },
  Stable:   { color: "#065f46", bg: "#d1fae5" },
};

// Source badge styles for Morning Intent
const INTENT_SOURCE_STYLE = {
  threads:  { color: "#6366f1", bg: "#eef2ff" },
  calendar: { color: "#0284c7", bg: "#e0f2fe" },
  systems:  { color: "#c48a20", bg: "#fdf5dc" },
  goal:     { color: "#4a7d6a", bg: "#e8f0ec" },
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');`;

const DASH_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  .db-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: #f7f5f1;
    color: #1a1a1a;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    font-size: 115%;
  }
  .db-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    background: #ffffff;
    border-bottom: 1px solid rgba(0,0,0,.09);
    position: sticky;
    top: 0;
    z-index: 10;
    flex-shrink: 0;
  }
  .db-header-meta {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .db-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      "left  side"
      "left  side2"
      "foot  foot";
    gap: 16px;
    padding: 20px 24px 24px;
    flex: 1;
    align-items: start;
  }
  .db-grid.monday {
    grid-template-areas:
      "left  side"
      "left  side2"
      "score score"
      "foot  foot";
  }
  .db-left  { grid-area: left; display: flex; flex-direction: column; gap: 16px; }
  .db-side  { grid-area: side;  display: flex; flex-direction: column; gap: 16px; }
  .db-side2 { grid-area: side2; display: flex; flex-direction: column; gap: 16px; }
  .db-score { grid-area: score; }
  .db-foot  { grid-area: foot; }
  @media (max-width: 760px) {
    .db-grid, .db-grid.monday {
      grid-template-columns: 1fr;
      grid-template-areas: "left" "side" "side2" "score" "foot";
      padding: 14px 14px 20px;
      gap: 12px;
    }
    .db-header { padding: 12px 14px; }
  }
`;

const C = {
  bg: "#f7f5f1", surface: "#ffffff", surfaceAlt: "#f2f0ec",
  surfaceHover: "#eae7e1", border: "rgba(0,0,0,.09)", borderStrong: "rgba(0,0,0,.15)",
  ink: "#1a1a1a", inkMid: "#4a4a4a", inkSoft: "#7a7a7a", inkFaint: "#a0a0a0",
  sage: "#4a7d6a", sageDark: "#2d5c48", sageLight: "#8fb8a5", sagePale: "#e8f0ec",
  green: "#2d8a56", greenPale: "#e6f4ec",
  amber: "#c48a20", amberPale: "#fdf5dc",
  red: "#c43030", redPale: "#fde8e8",
  scoreHigh: "#2d8a56", scoreMid: "#c48a20", scoreLow: "#9a9a9a",
  ratingBg: "#eef2ff", ratingBorder: "#c7d2fe",
  promptBg: "#f0fdf4", promptBorder: "#86efac",
  gc: {
    default: "#039BE5", 1: "#7986CB", 2: "#33B679", 3: "#8E24AA",
    4: "#E67C73", 5: "#E4C441", 6: "#F4511E", 7: "#039BE5",
    8: "#616161", 9: "#3F51B5", 10: "#0B8043", 11: "#D50000",
  }
};

const F = {
  display: "'Nunito', sans-serif",
  body: "'DM Sans', system-ui, sans-serif",
  mono: "'DM Mono', monospace",
};

const sectionCard = {
  background: C.surface, borderRadius: 12,
  border: `1px solid ${C.border}`, overflow: "hidden",
};
const sectionHeader = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "14px 18px 12px", borderBottom: `1px solid ${C.border}`,
};
const sectionLabel = {
  fontFamily: F.mono, fontSize: 11, fontWeight: 500,
  letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkSoft,
};
const sectionBody = { padding: "14px 18px 16px" };

function copyText(str) {
  const doExec = () => {
    const el = document.createElement("textarea");
    el.value = str;
    el.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none";
    document.body.appendChild(el); el.focus(); el.select();
    try { document.execCommand("copy"); } catch(_) {}
    document.body.removeChild(el);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str).catch(doExec);
  } else { doExec(); }
}

function StatusDot({ status }) {
  const color = status === "green" ? C.green : status === "amber" ? C.amber : C.red;
  return (<span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 0 2px ${color}22`, marginRight: 8, flexShrink: 0 }} />);
}

function TrendArrow({ direction }) {
  const map = { up: { symbol: "↑", color: C.red }, down: { symbol: "↓", color: C.green }, flat: { symbol: "→", color: C.inkFaint } };
  const t = map[direction] || map.flat;
  return <span style={{ color: t.color, fontSize: 13, fontFamily: F.mono }}>{t.symbol}</span>;
}

function SessionPromptBox({ text, compact }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    if (e) e.stopPropagation();
    copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.sageDark, background: C.promptBg, border: `1px solid ${C.promptBorder}`, borderRadius: 5, padding: "3px 8px" }}>{text}</span>
        <button onClick={handleCopy} style={{ background: copied ? C.green : "#16a34a", border: "none", borderRadius: 4, cursor: "pointer", color: "#fff", fontFamily: F.mono, fontSize: 10, fontWeight: 600, padding: "3px 8px", transition: "background 200ms ease" }}>{copied ? "✓" : "Copy"}</button>
      </div>
    );
  }
  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
      <div style={{ fontFamily: F.mono, fontSize: 10, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Open new session →</div>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: F.mono, fontSize: 11.5, color: C.sageDark, background: C.promptBg, border: `1px solid ${C.promptBorder}`, borderRadius: 7, padding: "8px 52px 8px 12px", lineHeight: 1.55, wordBreak: "break-word" }}>{text}</div>
        <button onClick={handleCopy} style={{ position: "absolute", top: 6, right: 6, background: copied ? C.green : "#16a34a", border: "none", borderRadius: 5, cursor: "pointer", color: "#fff", fontFamily: F.mono, fontSize: 10, fontWeight: 600, padding: "4px 10px", transition: "background 200ms ease", whiteSpace: "nowrap" }}>{copied ? "✓ Copied" : "Copy"}</button>
      </div>
    </div>
  );
}

function RatingPanel({ tip, onClose, onRated }) {
  const [myScore, setMyScore] = useState("");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const tipId = `${TIP_DATE}-${String(tip.id).padStart(2,'0')}`;
  const cmdText = `tip rate ${tipId} ${myScore || "?"}${comment ? ` "${comment}"` : ""}`;
  const handleCopy = (e) => {
    if (e) e.stopPropagation();
    copyText(`tip rate ${tipId} ${myScore}${comment ? ` "${comment}"` : ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleSend = async (e) => {
    if (e) e.stopPropagation();
    if (!myScore) return;
    setSending(true);
    setSendErr(false);
    try {
      const res = await fetch("http://localhost:7878/tip-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipId, score: Number(myScore), comment: comment || "", ts: new Date().toISOString() })
      });
      if (!res.ok) throw new Error("server error");
      setSent(true);
      if (onRated) onRated(tip.id, Number(myScore), comment || null);
      setTimeout(() => onClose(), 1500);
    } catch {
      setSendErr(true);
    } finally {
      setSending(false);
    }
  };
  return (
    <div style={{ padding: "10px 18px 12px 18px", background: C.ratingBg, borderTop: `1px solid ${C.ratingBorder}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6366f1" }}>Rate this tip</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkFaint, fontSize: 14, padding: "0 2px", lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 8 }}>
        <input type="number" min="0" max="100" value={myScore} onChange={e => setMyScore(e.target.value)} placeholder="0–100" style={{ width: 64, padding: "6px 8px", fontFamily: F.mono, fontSize: 13, border: `1px solid ${C.ratingBorder}`, borderRadius: 6, background: "#fff", color: C.ink, outline: "none", flexShrink: 0 }} />
        <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment…" onKeyDown={e => { if (e.key === "Enter") handleSend(e); }} style={{ flex: 1, padding: "6px 10px", fontFamily: F.body, fontSize: 13, border: `1px solid ${C.ratingBorder}`, borderRadius: 6, background: "#fff", color: C.ink, outline: "none" }} />
        <button onClick={handleSend} disabled={!myScore || sending || sent} style={{ padding: "6px 14px", borderRadius: 6, border: "none", cursor: myScore && !sending && !sent ? "pointer" : "not-allowed", background: sent ? C.green : sendErr ? "#ef4444" : myScore ? "#6366f1" : C.surfaceAlt, color: myScore ? "#fff" : C.inkFaint, fontFamily: F.mono, fontSize: 12, fontWeight: 500, transition: "background 200ms ease", flexShrink: 0 }}>{sent ? "✓ Sent" : sending ? "…" : sendErr ? "Retry" : "Send"}</button>
        <button onClick={handleCopy} disabled={!myScore} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.ratingBorder}`, cursor: myScore ? "pointer" : "not-allowed", background: copied ? C.surfaceAlt : "transparent", color: myScore ? C.ink : C.inkFaint, fontFamily: F.mono, fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{copied ? "✓" : "Copy"}</button>
      </div>
      {sendErr && <div style={{ fontFamily: F.mono, fontSize: 11, color: "#ef4444", marginBottom: 6 }}>Server offline — use Copy to submit manually</div>}
      <div style={{ fontFamily: F.mono, fontSize: 11, color: myScore ? "#6366f1" : C.inkFaint, background: "#fff", border: `1px solid ${C.ratingBorder}`, borderRadius: 5, padding: "5px 10px", letterSpacing: "0.02em" }}>{cmdText}</div>
    </div>
  );
}

function CalendarSection() {
  const conflicts = calEvents.filter(ev => ev.conflict);
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Calendar</span>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkSoft }}>{CAL_SUMMARY}</span>
      </div>
      {conflicts.length > 0 && (
        <div style={{ background: C.amberPale, borderBottom: `1px solid ${C.amber}44`, padding: "8px 14px 9px", display: "flex", flexDirection: "column", gap: 4 }}>
          {conflicts.map(ev => (
            <div key={ev.id} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ color: C.amber, fontFamily: F.mono, fontSize: 12, flexShrink: 0, marginTop: 1 }}>⚠</span>
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.amber, lineHeight: 1.4 }}>{typeof ev.conflict === "string" ? ev.conflict : "Scheduling conflict — check calendar"}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ padding: "6px 0" }}>
        {calEvents.length === 0 ? (
          <div style={{ fontFamily: F.body, fontSize: 14, color: C.inkSoft, padding: "12px 18px" }}>Nothing on the calendar today.</div>
        ) : calEvents.map((ev, i) => {
          const isLast = i === calEvents.length - 1;
          return (
            <div key={ev.id} style={{ display: "flex", alignItems: "stretch", padding: "10px 18px", borderBottom: isLast ? "none" : `1px solid ${C.border}` }}>
              <div style={{ width: 3, borderRadius: 2, background: ev.color, flexShrink: 0, minHeight: 40, marginRight: 10 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40 }}>
                  <div style={{ minWidth: 58, flexShrink: 0 }}>
                    <div style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 500, color: C.ink }}>{ev.time}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>{ev.dur}</div>
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 500, color: C.ink, flex: 1, lineHeight: 1.35 }}>{ev.title}</div>
                </div>
                {ev.prep && (
                  <div style={{ fontFamily: F.body, fontSize: 12.5, color: C.inkMid, paddingTop: 8, paddingLeft: 68, lineHeight: 1.4 }}>
                    <span style={{ color: C.sage, marginRight: 4 }}>↳</span>{ev.prep}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {IS_MONDAY && weekShape.length > 0 && (
          <div style={{ margin: "10px 18px 4px", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            <div style={{ ...sectionLabel, marginBottom: 8, fontSize: 10 }}>This Week</div>
            {weekShape.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontFamily: F.mono, fontSize: 12 }}>
                <span style={{ width: 36, color: C.inkMid, flexShrink: 0 }}>{d.day}</span>
                <span style={{ color: C.ink }}>{d.count} event{d.count !== 1 ? "s" : ""}</span>
                {d.flag && <span style={{ fontSize: 11, color: d.flag === "busy" ? C.amber : C.sage, fontFamily: F.body }}>({d.flag})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SystemsSection() {
  const [trendOpen, setTrendOpen] = useState({});
  const [fixCopied, setFixCopied] = useState(null);
  const [paCopied, setPaCopied] = useState(false);
  const toggleTrend = (i) => setTrendOpen(prev => ({ ...prev, [i]: !prev[i] }));
  const copyFix = (text, key, e) => {
    e.stopPropagation();
    copyText(text);
    setFixCopied(key);
    setTimeout(() => setFixCopied(null), 2000);
  };
  const copyPaFix = (e) => {
    if (e) e.stopPropagation();
    if (!PRIORITY_ACTION) return;
    copyText(PRIORITY_ACTION.fix);
    setPaCopied(true);
    setTimeout(() => setPaCopied(false), 2000);
  };
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <StatusDot status={SYSTEMS_STATUS} />
          <span style={sectionLabel}>Systems</span>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkSoft }}>{ERROR_COUNT_24H} / 24h · {ERROR_COUNT_7D} / 7d</span>
      </div>
      <div style={sectionBody}>
        <div style={{ fontFamily: F.body, fontSize: 13, color: C.inkMid, lineHeight: 1.5, marginBottom: (PRIORITY_ACTION || errorTrends.length > 0) ? 12 : 0 }}>{SYSTEMS_SUMMARY}</div>
        {PRIORITY_ACTION && (
          <div style={{ background: C.amberPale, border: `1px solid ${C.amber}44`, borderRadius: 8, padding: "10px 14px", marginBottom: errorTrends.length > 0 ? 12 : 0 }}>
            <div style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Priority: {PRIORITY_ACTION.title}</div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: C.inkMid, flex: 1, lineHeight: 1.5 }}>Fix: {PRIORITY_ACTION.fix}</div>
              <button onClick={(e) => copyPaFix(e)} style={{ padding: "4px 10px", borderRadius: 5, border: "none", cursor: "pointer", background: paCopied ? C.green : C.sageDark, color: "#fff", fontFamily: F.mono, fontSize: 10, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap", transition: "background 200ms ease" }}>{paCopied ? "✓ Copied" : "Copy"}</button>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.inkSoft }}>Impact: {PRIORITY_ACTION.impact}</div>
          </div>
        )}
        {errorTrends.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {errorTrends.map((t, i) => {
              const isOpen = !!trendOpen[i];
              const hasFix = !!(t.detail || t.fix);
              return (
                <div key={i}>
                  <div
                    onClick={hasFix ? () => toggleTrend(i) : undefined}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 2px", cursor: hasFix ? "pointer" : "default", borderRadius: 4 }}
                  >
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint, width: 12, textAlign: "center", transition: "transform 150ms", transform: (hasFix && isOpen) ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block", flexShrink: 0 }}>{hasFix ? "▸" : ""}</span>
                    <TrendArrow direction={t.direction} />
                    <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkMid }}>{t.label}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>({t.count7d})</span>
                  </div>
                  {hasFix && isOpen && (
                    <div style={{ padding: "8px 10px 10px 22px", background: C.surfaceAlt, borderRadius: 6, marginBottom: 4 }}>
                      {t.detail && <div style={{ fontFamily: F.body, fontSize: 12.5, color: C.inkMid, lineHeight: 1.55, marginBottom: t.fix ? 8 : 0 }}>{t.detail}</div>}
                      {t.fix && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.sageDark, background: C.promptBg, border: `1px solid ${C.promptBorder}`, borderRadius: 6, padding: "6px 10px", flex: 1, lineHeight: 1.5 }}>{t.fix}</div>
                          <button onClick={(e) => copyFix(t.fix, i, e)} style={{ padding: "5px 10px", borderRadius: 5, border: "none", cursor: "pointer", background: fixCopied === i ? C.green : "#16a34a", color: "#fff", fontFamily: F.mono, fontSize: 10, fontWeight: 600, flexShrink: 0, transition: "background 200ms ease" }}>{fixCopied === i ? "✓" : "Copy"}</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TipsSection() {
  const [expanded, setExpanded] = useState({});
  const [ratingOpen, setRatingOpen] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const RATED_KEY = `rated_tips_${TIP_DATE}`;
  const [ratedTips, setRatedTips] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RATED_KEY) || "{}"); } catch { return {}; }
  });
  const handleRated = (tipId, score, comment) => {
    const updated = { ...ratedTips, [tipId]: { score, comment, ts: Date.now() } };
    setRatedTips(updated);
    try { localStorage.setItem(RATED_KEY, JSON.stringify(updated)); } catch {}
  };
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleRating = (id, e) => { e.stopPropagation(); setRatingOpen(prev => ({ ...prev, [id]: !prev[id] })); };
  const closeRating = (id) => setRatingOpen(prev => ({ ...prev, [id]: false }));
  const handleCopyId = (tipId, e) => {
    e.stopPropagation();
    const text = `${TIP_DATE}-${String(tipId).padStart(2,'0')}`;
    copyText(text);
    setCopiedId(tipId);
    setTimeout(() => setCopiedId(null), 1500);
  };
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Tips</span>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkSoft }}>{TIPS_LABEL}</span>
      </div>
      <div style={{ padding: "6px 0" }}>
        {tips.map((tip, i) => {
          const isOpen = expanded[tip.id];
          const isRating = ratingOpen[tip.id];
          const isLast = i === tips.length - 1;
          const isCopiedId = copiedId === tip.id;
          const isRated = !!ratedTips[tip.id];
          const ratedScore = ratedTips[tip.id]?.score;
          const scoreColor = tip.score >= 80 ? C.scoreHigh : tip.score >= 60 ? C.scoreMid : C.scoreLow;
          const scoreBg = tip.score >= 80 ? C.greenPale : tip.score >= 60 ? C.amberPale : C.surfaceAlt;
          return (
            <div key={tip.id}>
              <div onClick={() => toggleExpand(tip.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", cursor: "pointer", background: isOpen ? C.surfaceAlt : "transparent", borderBottom: !isOpen && !isRating && !isLast ? `1px solid ${C.border}` : "none", transition: "background 150ms ease" }}>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint, width: 14, textAlign: "center", flexShrink: 0, transition: "transform 150ms ease", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
                <span onClick={(e) => toggleRating(tip.id, e)} title={isRated ? `You rated: ${ratedScore} — click to re-rate` : "Click to rate this tip"} style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 500, color: isRated ? "#6366f1" : isRating ? "#6366f1" : scoreColor, background: isRated ? C.ratingBg : isRating ? C.ratingBg : scoreBg, border: isRated ? `1px solid ${C.ratingBorder}` : isRating ? `1px solid ${C.ratingBorder}` : "1px solid transparent", padding: "2px 8px", borderRadius: 4, minWidth: 32, textAlign: "center", flexShrink: 0, cursor: "pointer", transition: "all 150ms ease", userSelect: "none" }}>{isRated ? `✓ ${ratedScore}` : tip.score}</span>
                <span
                  onClick={(e) => handleCopyId(tip.id, e)}
                  title="Click to copy tip ID"
                  style={{ fontFamily: F.mono, fontSize: 10, color: isCopiedId ? C.green : C.inkFaint, padding: "1px 5px", background: isCopiedId ? C.greenPale : C.surfaceAlt, border: isCopiedId ? `1px solid ${C.green}44` : "1px solid transparent", borderRadius: 3, flexShrink: 0, letterSpacing: "0.03em", whiteSpace: "nowrap", cursor: "pointer", transition: "all 150ms ease", userSelect: "none" }}
                >{isCopiedId ? "✓ copied" : `${TIP_DATE}-${String(tip.id).padStart(2,'0')}`}</span>
                <div style={{ fontFamily: F.body, fontSize: 13.5, color: C.ink, flex: 1, lineHeight: 1.35 }}>{tip.headline}</div>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint, padding: "2px 6px", border: `1px solid ${C.border}`, borderRadius: 3, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tip.category}</span>
              </div>
              {isOpen && (
                <div style={{ padding: "8px 18px 14px 52px", background: C.surfaceAlt, borderBottom: !isRating && !isLast ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontFamily: F.body, fontSize: 13, color: C.inkMid, lineHeight: 1.6, marginBottom: tip.action ? 8 : 0 }}>{tip.detail}</div>
                  {tip.action && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: tip.sessionPrompt ? 0 : 2 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 11, color: C.sage, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.sageDark, lineHeight: 1.5 }}>{tip.action}</span>
                    </div>
                  )}
                  {tip.sessionPrompt && <SessionPromptBox text={tip.sessionPrompt} />}
                </div>
              )}
              {isRating && (
                <div style={{ borderBottom: !isLast ? `1px solid ${C.border}` : "none" }}>
                  <RatingPanel tip={tip} onClose={() => closeRating(tip.id)} onRated={handleRated} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillsCard() {
  const [expanded, setExpanded] = useState({});
  const toggle = (name) => setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Skills</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>progress</span>
      </div>
      <div style={{ padding: "6px 0" }}>
        {SKILLS_PROGRESS.map((s, i) => {
          const isOpen = !!expanded[s.name];
          const isLast = i === SKILLS_PROGRESS.length - 1;
          const ls = LEVEL_STYLE[s.level] || LEVEL_STYLE.New;
          const meta = SKILLS_META[s.name];
          const desc = meta?.description;
          const next = meta?.nextStep?.[s.level];
          const prompt = meta?.sessionPrompt;
          return (
            <div key={s.name}>
              <div
                onClick={() => toggle(s.name)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px", cursor: "pointer", background: isOpen ? C.surfaceAlt : "transparent", borderBottom: !isOpen && !isLast ? `1px solid ${C.border}` : "none", transition: "background 150ms ease" }}
              >
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint, width: 14, textAlign: "center", transition: "transform 150ms", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block", flexShrink: 0 }}>▸</span>
                <span style={{ fontFamily: F.body, fontSize: 13, fontWeight: 500, color: C.ink, flex: 1 }}>{s.name}</span>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: ls.color, background: ls.bg, padding: "2px 8px", borderRadius: 4, flexShrink: 0, marginRight: 4 }}>{s.level}</span>
                <span style={{ fontFamily: F.mono, fontSize: 13, color: s.trend === "↑" ? C.green : s.trend === "↓" ? C.red : C.inkFaint, flexShrink: 0 }}>{s.trend}</span>
              </div>
              {isOpen && (
                <div style={{ padding: "8px 18px 12px 44px", background: C.surfaceAlt, borderBottom: !isLast ? `1px solid ${C.border}` : "none" }}>
                  {desc && <div style={{ fontFamily: F.body, fontSize: 12.5, color: C.inkMid, lineHeight: 1.55, marginBottom: 8 }}>{desc}</div>}
                  {next && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 11, color: C.sage, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span style={{ fontFamily: F.mono, fontSize: 11, color: C.sageDark, lineHeight: 1.5 }}>{next}</span>
                    </div>
                  )}
                  {prompt && <SessionPromptBox text={prompt} compact={true} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Thread Pulse ─────────────────────────────────────────────────────────────
function ThreadPulseSection() {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const copy = (cmd, i, e) => {
    if (e) e.stopPropagation();
    copyText(cmd);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={sectionLabel}>Threads</span>
          {THREAD_STALE_COUNT > 0 && (
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.amber, background: C.amberPale, border: `1px solid ${C.amber}44`, padding: "1px 7px", borderRadius: 3 }}>⚠ {THREAD_STALE_COUNT} stale</span>
          )}
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkSoft }}>{THREAD_COUNT} in flight</span>
      </div>
      <div style={{ overflowY: "auto", maxHeight: 380 }}>
        {threads.length === 0 ? (
          <div style={{ ...sectionBody, color: C.inkSoft, fontFamily: F.body, fontSize: 14 }}>No active threads — inbox zero.</div>
        ) : threads.map((t, i) => {
          const isCopied = copiedIdx === i;
          const dotColor = t.status === "loaded" ? C.sage : C.amber;
          const dotStyle = t.status === "loaded"
            ? { width: 8, height: 8, borderRadius: "50%", border: `2px solid ${dotColor}`, flexShrink: 0, display: "inline-block" }
            : { width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0, display: "inline-block" };
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderBottom: i < threads.length - 1 ? `1px solid ${C.border}` : "none", background: t.stale ? `${C.amberPale}88` : "transparent" }}>
              <span style={dotStyle} title={t.status} />
              <span style={{ fontFamily: F.body, fontSize: 13, color: t.stale ? C.amber : C.ink, flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} title={t.summary}>{t.title}</span>
              <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkSoft, background: C.surfaceAlt, padding: "1px 6px", borderRadius: 3, flexShrink: 0, maxWidth: 76, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{t.project}</span>
              <span style={{ fontFamily: F.mono, fontSize: 11, color: t.stale ? C.amber : C.inkFaint, flexShrink: 0, minWidth: 32, textAlign: "right" }}>{t.ageLabel}</span>
              <button onClick={(e) => copy(t.pickupCmd, i, e)} style={{ padding: "3px 10px", borderRadius: 4, border: "none", cursor: "pointer", background: isCopied ? C.green : C.sagePale, color: isCopied ? "#fff" : C.sageDark, fontFamily: F.mono, fontSize: 10, fontWeight: 600, flexShrink: 0, transition: "all 150ms ease", whiteSpace: "nowrap" }}>{isCopied ? "✓" : "Copy"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Morning Intent ───────────────────────────────────────────────────────────
function MorningIntentSection() {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const copy = (cmd, i, e) => {
    if (e) e.stopPropagation();
    copyText(cmd);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Intent</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>top 3</span>
      </div>
      <div style={{ padding: "6px 0" }}>
        {morningIntent.map((item, i) => {
          const ss = INTENT_SOURCE_STYLE[item.source] || INTENT_SOURCE_STYLE.threads;
          const isCopied = copiedIdx === i;
          const isLast = i === morningIntent.length - 1;
          return (
            <div key={i} style={{ padding: "11px 18px", borderBottom: !isLast ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontFamily: F.display, fontSize: 20, fontWeight: 900, color: C.border, flexShrink: 0, lineHeight: 1.1, minWidth: 18, marginTop: 1 }}>{item.rank}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.body, fontSize: 13, color: C.ink, lineHeight: 1.5, marginBottom: 7 }}>{item.text}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: F.mono, fontSize: 9, color: ss.color, background: ss.bg, padding: "2px 7px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{item.source}</span>
                    <button onClick={(e) => copy(item.pickupCmd, i, e)} style={{ padding: "2px 9px", borderRadius: 3, border: "none", cursor: "pointer", background: isCopied ? C.green : C.surfaceAlt, color: isCopied ? "#fff" : C.inkSoft, fontFamily: F.mono, fontSize: 10, transition: "all 150ms ease", whiteSpace: "nowrap" }}>{isCopied ? "✓ Copied" : "Copy"}</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Goal Anchor ──────────────────────────────────────────────────────────────
function GoalAnchorCard() {
  const pct = Math.min(100, Math.max(0, goalAnchor.elapsedPct));
  return (
    <div style={{ ...sectionCard, padding: "13px 18px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: C.ink }}>{goalAnchor.label}</span>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint }}>{goalAnchor.horizonLabel}</span>
      </div>
      <div style={{ fontFamily: F.body, fontSize: 12, color: C.inkMid, marginBottom: 9 }}>{goalAnchor.target}</div>
      <div style={{ height: 4, background: C.surfaceAlt, borderRadius: 2, overflow: "hidden", marginBottom: 7 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: C.sage, borderRadius: 2 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.sageDark }}>{goalAnchor.milestone}</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>{pct}%</span>
      </div>
    </div>
  );
}

// ─── Consulting Signals ───────────────────────────────────────────────────────
const STAKES_STYLE = {
  high:   { color: "#c43030", bg: "#fde8e8", label: "high"   },
  medium: { color: "#4a7d6a", bg: "#e8f0ec", label: "med"    },
  low:    { color: "#a0a0a0", bg: "#f2f0ec", label: "low"    },
};
const STALE_DAYS_THRESHOLD = 4;

function OpenDecisionsSection() {
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const copy = (text, id, e) => {
    if (e) e.stopPropagation();
    copyText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);
  const staleCount = openDecisions.filter(d => d.staleDays >= STALE_DAYS_THRESHOLD).length;
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Decisions</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {staleCount > 0 && (
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.amber, background: C.amberPale, padding: "2px 7px", borderRadius: 4 }}>
              {staleCount} stale
            </span>
          )}
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>{openDecisions.length} open</span>
        </div>
      </div>
      {openDecisions.length === 0 ? (
        <div style={{ padding: "16px 18px", fontFamily: F.body, fontSize: 13, color: C.inkSoft }}>No open decisions — clear runway.</div>
      ) : (
        <div style={{ padding: "4px 0" }}>
          {openDecisions.map((d, i) => {
            const stk = STAKES_STYLE[d.stakes] || STAKES_STYLE.medium;
            const isStale = d.staleDays >= STALE_DAYS_THRESHOLD;
            const isExpanded = expandedId === d.id;
            const isCopied = copiedId === d.id;
            const isLast = i === openDecisions.length - 1;
            return (
              <div key={d.id} onClick={() => toggle(d.id)} style={{ padding: "11px 18px", borderBottom: isLast ? "none" : `1px solid ${C.border}`, cursor: "pointer", background: isExpanded ? C.surfaceAlt : "transparent", transition: "background 120ms ease" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 500, color: stk.color, background: stk.bg, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, marginTop: 2 }}>{stk.label}</span>
                  <div style={{ flex: 1 }}><span style={{ fontFamily: F.body, fontSize: 13, fontWeight: 500, color: C.ink, lineHeight: 1.35 }}>{d.question}</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    {isStale && <span style={{ fontFamily: F.mono, fontSize: 9, color: C.amber, background: C.amberPale, padding: "1px 5px", borderRadius: 3 }}>stale</span>}
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint }}>{d.staleDays}d</span>
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint }}>{isExpanded ? "▴" : "▾"}</span>
                  </div>
                </div>
                {d.options && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginLeft: 46, marginBottom: isExpanded ? 8 : 0 }}>
                    {d.options.map((opt, oi) => (
                      <span key={oi} style={{ fontFamily: F.mono, fontSize: 10, color: C.inkMid, background: C.surfaceAlt, padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.border}` }}>{opt}</span>
                    ))}
                  </div>
                )}
                {isExpanded && (
                  <div style={{ marginLeft: 46 }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontFamily: F.body, fontSize: 12, color: C.inkMid, lineHeight: 1.5, marginBottom: 10 }}>{d.context}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 11, color: C.sageDark, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 5, padding: "3px 8px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.threadCmd}</span>
                      <button onClick={(e) => copy(d.threadCmd, d.id, e)} style={{ background: isCopied ? C.green : "#16a34a", border: "none", borderRadius: 4, cursor: "pointer", color: "#fff", fontFamily: F.mono, fontSize: 10, fontWeight: 600, padding: "4px 10px", transition: "background 200ms ease", flexShrink: 0 }}>{isCopied ? "✓ Copied" : "Copy"}</button>
                    </div>
                    <div style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint, marginTop: 6 }}>↳ {d.thread}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ConsultingSignalSection() {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const copy = (text, i, e) => {
    if (e) e.stopPropagation();
    copyText(text);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Signals</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>{CONSULT_SIGNAL_DATE}</span>
      </div>
      <div style={{ padding: "6px 0" }}>
        {consultSignals.length === 0 ? (
          <div style={{ padding: "10px 18px", fontFamily: F.body, fontSize: 13, color: C.inkSoft }}>Quiet week — no new signals to surface.</div>
        ) : consultSignals.map((s, i) => {
          const isCopied = copiedIdx === i;
          return (
            <div key={i} style={{ padding: "11px 18px", borderBottom: i < consultSignals.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 500, color: C.ink, lineHeight: 1.35, marginBottom: 5 }}>{s.headline}</div>
              <div style={{ fontFamily: F.body, fontSize: 12, color: C.inkMid, lineHeight: 1.5, marginBottom: 7 }}>{s.why}</div>
              {s.talkingPoint && (
                <div style={{ background: C.sagePale, border: `1px solid ${C.border}`, borderRadius: 5, padding: "8px 11px", marginBottom: 7 }}>
                  <div style={{ fontFamily: F.body, fontSize: 12, color: C.sageDark, lineHeight: 1.5, marginBottom: 6 }}>{s.talkingPoint}</div>
                  <button onClick={(e) => copy(s.talkingPoint, i, e)} style={{ padding: "2px 9px", borderRadius: 3, border: "none", cursor: "pointer", background: isCopied ? C.green : C.sagePale, color: isCopied ? "#fff" : C.sageDark, fontFamily: F.mono, fontSize: 10, fontWeight: 600, transition: "all 150ms ease", border: `1px solid ${C.border}` }}>{isCopied ? "✓ Copied" : "Copy talking point"}</button>
                </div>
              )}
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint }}>{s.source}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dashboard Meta ───────────────────────────────────────────────────────────
function DashboardMetaSection() {
  const [view, setView] = useState("log");
  const [copiedIdx, setCopiedIdx] = useState(null);
  const copy = (text, i, e) => {
    if (e) e.stopPropagation();
    copyText(text);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };
  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setView(id)} style={{ fontFamily: F.mono, fontSize: 10, padding: "2px 8px", borderRadius: 3, border: "none", cursor: "pointer", background: view === id ? C.ink : "transparent", color: view === id ? "#fff" : C.inkSoft, transition: "all 120ms ease" }}>{label}</button>
  );
  const TYPE_STYLE = {
    added:   { color: C.green,    bg: C.greenPale },
    changed: { color: C.amber,    bg: C.amberPale },
    removed: { color: C.red,      bg: C.redPale   },
    fixed:   { color: C.sageDark, bg: C.sagePale  },
  };
  const BLOCKS = [
    { name: "Intent",         desc: "Top 3 synthesized priorities from threads, calendar, goals, and systems. Copyable session prompts for one-click action." },
    { name: "Calendar",       desc: "Today's events with contextual prep nudges. Travel reminders, material checks, conflict flags. Monday adds week-shape view." },
    { name: "Systems",        desc: "Error pattern analysis (24h, 7-day), vault health, compliance audit. Surfaces a single priority fix when actionable." },
    { name: "Skills",         desc: "Maturity levels for 6 active Cowork skills: Calendar, Handoff, Bible, Cartography, Skill Manager, Session." },
    { name: "Threads",        desc: "Active and loaded handoff threads with age, project, stale flag, and copyable pickup commands." },
    { name: "Goal Anchor",    desc: "90-day sprint progress bar driven by goals.json — label, target, milestone, elapsed %." },
    { name: "Decisions",      desc: "Open choices awaiting Dave's decision, sourced from handoff [DECISION]-tagged Pending items. Stakes-coded, stale-flagged, expandable with context and copyable pickup command." },
    { name: "Signals",        desc: "3 curated AI/energy industry signals from web search. Each tied to a why-it-matters consulting frame." },
    { name: "Mon Scorecard",  desc: "Weekly CQR averages by domain with trend arrows. Only renders on Mondays.", tag: "Mon" },
    { name: "Dashboard Meta", desc: "This block. Changelog, block inventory, and next-evolution ideas with copyable session prompts.", tag: "new" },
  ];
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Dashboard</span>
        <div style={{ display: "flex", gap: 3 }}>
          {tabBtn("log", "log")}
          {tabBtn("blocks", "blocks")}
          {tabBtn("next", "next")}
        </div>
      </div>
      {view === "log" && (
        <div>
          {dashboardMeta.changelog.map((entry, i) => {
            const ts = TYPE_STYLE[entry.type] || TYPE_STYLE.fixed;
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 16px", borderBottom: i < dashboardMeta.changelog.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontFamily: F.mono, fontSize: 9, color: ts.color, background: ts.bg, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, marginTop: 2 }}>{entry.type}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.body, fontSize: 12, fontWeight: 500, color: C.ink }}>{entry.item}</div>
                  <div style={{ fontFamily: F.body, fontSize: 11, color: C.inkMid, lineHeight: 1.4, marginTop: 1 }}>{entry.note}</div>
                </div>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint, flexShrink: 0, marginTop: 2 }}>{entry.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      )}
      {view === "blocks" && (
        <div>
          {BLOCKS.map((block, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 16px", borderBottom: i < BLOCKS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontFamily: F.display, fontSize: 12, fontWeight: 700, color: C.ink }}>{block.name}</span>
                  {block.tag && <span style={{ fontFamily: F.mono, fontSize: 9, color: C.inkSoft, background: C.surfaceAlt, padding: "1px 5px", borderRadius: 3, border: `1px solid ${C.border}` }}>{block.tag}</span>}
                </div>
                <div style={{ fontFamily: F.body, fontSize: 11, color: C.inkMid, lineHeight: 1.4 }}>{block.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {view === "next" && (
        <div>
          {dashboardMeta.nextIdeas.map((idea, i) => {
            const isCopied = copiedIdx === i;
            return (
              <div key={i} style={{ padding: "9px 16px", borderBottom: i < dashboardMeta.nextIdeas.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: F.body, fontSize: 12, fontWeight: 500, color: C.ink, marginBottom: 3 }}>{idea.idea}</div>
                <div style={{ fontFamily: F.body, fontSize: 11, color: C.inkMid, lineHeight: 1.4, marginBottom: 6 }}>{idea.desc}</div>
                <button onClick={(e) => copy(idea.sessionPrompt, i, e)} style={{ padding: "2px 9px", borderRadius: 3, border: "none", cursor: "pointer", background: isCopied ? C.green : C.surfaceAlt, color: isCopied ? "#fff" : C.inkSoft, fontFamily: F.mono, fontSize: 10, fontWeight: 500, transition: "all 150ms ease" }}>{isCopied ? "✓ Copied" : "Copy"}</button>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ padding: "5px 16px 8px", borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint }}>{dashboardMeta.version}</span>
      </div>
    </div>
  );
}

// ─── Monday Scorecard ─────────────────────────────────────────────────────────
// Only renders when IS_MONDAY and mondayScorecard is populated.
function MondayScorecardSection() {
  if (!mondayScorecard || !mondayScorecard.length) return null;
  const sorted = [...mondayScorecard].sort((a, b) => b.lastWeekAvg - a.lastWeekAvg);
  const top = sorted[0];
  const miss = sorted[sorted.length - 1];
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Week Recap</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>last 7 days · CQR by domain</span>
      </div>
      <div style={{ padding: "14px 18px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {mondayScorecard.map((d, i) => {
          const isTop = d.domain === top.domain;
          const isMiss = d.domain === miss.domain && top.domain !== miss.domain;
          const scoreColor = d.lastWeekAvg >= 90 ? C.green : d.lastWeekAvg >= 80 ? C.amber : C.red;
          return (
            <div key={i} style={{ padding: "10px 14px", background: isTop ? C.greenPale : isMiss ? C.amberPale : C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{d.domain}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontFamily: F.display, fontSize: 24, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{d.lastWeekAvg}</span>
                <span style={{ fontFamily: F.mono, fontSize: 14, color: d.trend === "↑" ? C.green : d.trend === "↓" ? C.red : C.inkFaint }}>{d.trend}</span>
              </div>
              {isTop && <div style={{ fontFamily: F.mono, fontSize: 9, color: C.green, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>top win</div>}
              {isMiss && <div style={{ fontFamily: F.mono, fontSize: 9, color: C.amber, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>top miss</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MorningDashboard() {
  return (
    <div className="db-root">
      <style>{FONTS + DASH_CSS}</style>
      <div className="db-header">
        <span style={{ fontFamily: F.display, fontSize: 20, fontWeight: 800, color: C.ink }}>{GREETING}</span>
        <div className="db-header-meta">
          <span style={{ fontFamily: F.body, fontSize: 13, color: C.inkSoft }}>{BRIEFING_DATE}</span>
          <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkFaint }}>{BRIEFING_TIME}</span>
        </div>
      </div>
      <div className={`db-grid${IS_MONDAY ? " monday" : ""}`}>
        <div className="db-left">
          <TipsSection />
          <ThreadPulseSection />
        </div>
        <div className="db-side">
          <CalendarSection />
          <SystemsSection />
          <SkillsCard />
        </div>
        <div className="db-side2">
          <MorningIntentSection />
          <GoalAnchorCard />
          <OpenDecisionsSection />
          <ConsultingSignalSection />
          <DashboardMetaSection />
        </div>
        {IS_MONDAY && mondayScorecard && (
          <div className="db-score">
            <MondayScorecardSection />
          </div>
        )}
        <div className="db-foot">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["cal", "cal add [event]", "tip rate [id] [score]", "pickup [thread]", "dash tips", "dash threads", "dash calendar", "dash signals"].map((h, i) => (
              <span key={i} style={{ fontFamily: F.mono, fontSize: 11, color: C.inkSoft, padding: "3px 8px", background: C.surfaceAlt, borderRadius: 4, border: `1px solid ${C.border}` }}>{h}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
