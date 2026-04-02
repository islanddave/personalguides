import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// LIVE DATA — Claude replaces ONLY this section. Component code is frozen.
// ═══════════════════════════════════════════════════════════════════════════

const BRIEFING_DATE = "Wednesday, Apr 1";
const BRIEFING_TIME = "3:32a";
const TIP_DATE = "0401.0332";
const GREETING = "Good morning, Dave.";

const CAL_SUMMARY = "9 events — ⚠️ Nika Tutoring (12:15p) conflicts with work blocks 12:30–2:00p";
const calEvents = [
  { id: 1, time: "10:00a", end: "10:30a", dur: "30m", title: "Work (Busy)", color: "#e07d31", prep: null, allDay: false },
  { id: 2, time: "11:30a", end: "12:00p", dur: "30m", title: "Work (Busy)", color: "#e07d31", prep: null, allDay: false },
  { id: 3, time: "12:15p", end: "2:15p", dur: "2h", title: "Nika Tutoring (Jen)", color: "#42d692", prep: "⚠️ Overlaps work blocks 12:30–2:00p. Confirm Jen's materials are ready before 12:15p.", allDay: false },
  { id: 4, time: "12:30p", end: "1:30p", dur: "1h", title: "Work (Busy) ⚠️ conflict", color: "#e07d31", prep: "Overlaps Nika Tutoring — review if this needs rescheduling.", allDay: false },
  { id: 5, time: "1:30p", end: "2:00p", dur: "30m", title: "Work (Busy) ⚠️ conflict", color: "#e07d31", prep: "Overlaps Nika Tutoring — review if this needs rescheduling.", allDay: false },
  { id: 6, time: "2:00p", end: "3:00p", dur: "1h", title: "Work (Busy)", color: "#e07d31", prep: null, allDay: false },
  { id: 7, time: "3:00p", end: "3:30p", dur: "30m", title: "Work (Busy)", color: "#e07d31", prep: null, allDay: false },
  { id: 8, time: "3:30p", end: "4:00p", dur: "30m", title: "Work (Busy)", color: "#e07d31", prep: null, allDay: false },
  { id: 9, time: "4:00p", end: "5:00p", dur: "1h", title: "Work (Busy)", color: "#e07d31", prep: null, allDay: false },
];
const IS_MONDAY = false;
const weekShape = [];

const SYSTEMS_STATUS = "amber";
const SYSTEMS_SUMMARY = "Error rate spiked — 8 errors in 7 days vs 2 prior week. Three categories recurring at 2 each: tool-scope, mcp-behavior, api-contract. bold-peaceful-bardeen cascade (3 errors) notable.";
const ERROR_COUNT_24H = 7;
const ERROR_COUNT_7D = 8;
const PRIORITY_ACTION = {
  title: "Pre-deploy JSX hook validation",
  fix: "Before chunk deploy: grep 'useEffect|useRef|useCallback|useMemo' in JSX vs import line. Prevents blank production page.",
  impact: "~45 min saved per blank-page incident (brave-amazing-tesla cost)",
};
const errorTrends = [
  { label: "tool-scope", count7d: 2, direction: "up", detail: "Edit/Bash tools used on Mac filesystem paths. CLAUDE.md explicitly prohibits this — avoidable.", fix: "Always use mcp__filesystem__* for /Users/davenichols/ paths. Edit and Bash are sandbox-scoped." },
  { label: "mcp-behavior", count7d: 2, direction: "up", detail: "MCP param type errors + Chrome JS session failures. Mixed root causes.", fix: "Always pass array/object params as native JSON, not quoted strings. If Chrome JS fails, try sandbox curl as fallback." },
  { label: "api-contract", count7d: 2, direction: "up", detail: "Wrong relay action names and urllib double-fetch bug. Relay API pattern still fragile.", fix: "Use subprocess curl with --max-redirs 0 for relay calls from Python. Check prior handoffs for relay action names before guessing." },
];

const TIPS_LABEL = "10 tips scored";
const tips = [
  {
    id: 1, score: 90, category: "Dave-actionable-strategy",
    headline: "Utility AI talent gap is your entry point — 61% of execs name it as barrier #1",
    detail: "Fresh from today's sector scan: 61% of utility executives cite AI talent as their top deployment barrier. This directly validates your AI & DevOps Readiness Audit positioning. Frame it as: 'I help utilities build the internal AI-ready teams your infrastructure investments require.' Credibility-building, timely, verifiable.",
    action: "Draft a 2-sentence LinkedIn DM to an energy operations contact using this data point as the hook.",
    sessionPrompt: "Help me draft a 2-sentence LinkedIn message to an energy sector operations leader. Positioning: AI readiness audit for utilities facing talent gaps. Use the stat: 61% of utility execs cite AI talent as their #1 deployment barrier (EPRI/Utility Dive 2026).",
  },
  {
    id: 2, score: 87, category: "Dave-actionable-workflow",
    headline: "3 threads have completion signals — close them in 5 minutes",
    detail: "Relay v5 deploy (summary: 'deployed and verified live'), task config portability done (summary: 'all 6 items complete'), and filename convention update (summary: 'CLAUDE.md updated') all have clear completion language in their handoff summaries. These don't need pickups — just integration. 5-minute triage eliminates 3 entries from auto-pickup scanning.",
    action: "In your next session, say: 'Mark relay v5 deploy, task config portability done, and filename convention update as integrated.'",
    sessionPrompt: "I want to mark these threads as integrated: relay v5 deploy, task config portability done, filename convention update. Check their summaries and confirm each is complete, then update the handoff index.",
  },
  {
    id: 3, score: 85, category: "Dave-actionable-data",
    headline: "Error rate spiked 3× this week — three recurring categories forming",
    detail: "Prior review showed 2 errors in 7 days. This review found 8, with tool-scope, mcp-behavior, and api-contract each at 2 instances. No systemic category yet (3+ required) but the acceleration is notable. The most avoidable pattern: tool-scope (Edit/Bash on Mac paths) — covered by a CLAUDE.md rule that sessions are still ignoring.",
    action: "At the start of your first work session today: read the error-log.md entries from this week and note the tool-scope pattern explicitly.",
    sessionPrompt: "Review error-log.md entries from the past 7 days. Summarize the patterns and tell me which are most avoidable given existing CLAUDE.md rules.",
  },
  {
    id: 4, score: 84, category: "Dave-actionable-workflow",
    headline: "Skill deploy binding rule is live — but 5 skills still need the bootstrap update",
    detail: "The stoic-clever-carson rule is now in CLAUDE.md: always use 'skill deploy' for source file pushes. The gap: pensive-sharp-mccarthy confirmed family-calendar is missing from Drive, and vigilant-brave-edison picked up the remaining 4 (handoff/session/book-bible/cartography) but was cut short. The 'skill bootstrap remaining 5' thread is loaded and ready.",
    action: "Say 'pickup skill bootstrap remaining 5' to finish the 5 outstanding deploys — each takes ~2 minutes via skill deploy.",
    sessionPrompt: "pickup skill bootstrap remaining 5",
  },
  {
    id: 5, score: 88, category: "Dave-actionable-workflow",
    headline: "Parallel dispatch: if tasks don't share outputs, fire them simultaneously",
    detail: "Agent dispatch V0 is in production for compression-guard continuation, but parallel dispatch is also authorized for regular sessions. The test: 'Does task B need task A's output?' If no, run both at once. Your current deep sessions — reading 8 files, fetching calendar, running web searches — could all be parallelized. Single-hop parallel work recovers 30–50% of session time on dense tasks like this morning's dashboard run.",
    action: "Next dense session: identify 3 independent tasks and fire them in one message rather than sequentially.",
    sessionPrompt: "Show me which of my current pending work items could be executed in parallel rather than sequentially. Pick the 3 most independent and propose a parallel dispatch plan.",
  },
  {
    id: 6, score: 80, category: "Dave-actionable-workflow",
    headline: "Family Research has active threads but no Project — canon gets re-read every session",
    detail: "The handoff index shows two Family Research threads (charlie-nichols integrated, nichols-occupations-military loaded). Every new genealogy session has to re-read the handoff for names, dates, and research questions. A Family Research Project with a context doc seeded from the current handoffs would carry the canon automatically, eliminating the re-read overhead.",
    action: "In Cowork, create a 'Family Research' Project and draft a context doc with key names (Charlie Nichols, Pauline Goolsby, Virgil branch), key dates, and the open research questions from the loaded handoff.",
    sessionPrompt: "Help me create a Family Research Project in Cowork. Draft the project context document with key people, dates, military records, and open research questions from my handoff files.",
  },
  {
    id: 7, score: 78, category: "Dave-actionable-workflow",
    headline: "Session skill: prior design exists in skill-relay-pipeline handoff — here's where it stands",
    detail: "You started a session skill design earlier this week (adoring-eloquent-hawking handoff: 'Drive queue + Jen dashboard callout + skill-manager Step 9'). Currently: no SKILL.md exists, no .skill package built. The design is scoped but was blocked on jen-config stabilizing. Jen-config is now effectively complete (all blockers cleared via loving-busy-newton). The session skill is the next natural creative build — no urgency, just a slow-burn parallel track.",
    action: "No action needed today. This is awareness context. When you have a 90-minute window after Jen's setup day, say: 'pickup skill relay pipeline' to review the design.",
    sessionPrompt: "pickup skill relay pipeline",
  },
  {
    id: 8, score: 74, category: "Dave-actionable-data",
    headline: "April 11 CD maturity is 10 days out — confirm the allocation path from the handoff",
    detail: "The relaxed-confident-hawking session ran an independent analysis of the $241.4K in CDs maturing April 11+14. A plan was sketched and a calendar event set. The question is whether you still agree with that plan — a 10-minute re-read and confirmation prevents a day-of scramble when the CD actually matures.",
    action: "Say 'pickup treasury ladder april execution' to review the allocation plan and note whether you confirm or want to adjust.",
    sessionPrompt: "pickup treasury ladder april execution",
  },
  {
    id: 9, score: 72, category: "Housekeeping",
    headline: "24 active/loaded threads — finance freedom number and cal skill MVP are approaching stale",
    detail: "Finance freedom number (6 days old) and cal skill MVP refinement (5 days) both approach the 7-day stale threshold. Neither is closeable without a pickup, but both should be explicitly status-checked this week rather than silently aging. Finance thread has strong completion context; cal skill has 7 scoped items.",
    action: "Before starting new work this week: 'pickup finance freedom number' and decide: continue, park, or defer.",
    sessionPrompt: "pickup finance freedom number — show me the state and help me decide: close, continue, or park.",
  },
  {
    id: 10, score: 68, category: "Confirmatory",
    headline: "This dashboard is the patched version — all magical-festive-newton fixes applied",
    detail: "Yesterday's dashboard patches deployed successfully: clipboard copy buttons work, TIP_DATE format upgraded to MMDD.HHMM (you're seeing 0401.0332 above), skills section corrected to exactly 6 skills, and FooterBar replaces the old chips. The bold-focused-dirac overhaul is integrated. Morning.futureishere.net is the live production dashboard.",
    action: "No action needed — just confirmation that the dashboard you're reading is the fully patched version.",
    sessionPrompt: "Open morning.futureishere.net and confirm the current dashboard is rendering. Check that TIP_DATE shows 0401 prefix and the clipboard buttons work.",
  },
];

const SKILLS_PROGRESS = [
  { name: "Calendar",      level: "Stable",   trend: "→" },
  { name: "Handoff",       level: "Stable",   trend: "↑" },
  { name: "Bible",         level: "Stable",   trend: "→" },
  { name: "Cartography",   level: "Early",    trend: "→" },
  { name: "Skill Manager", level: "Maturing", trend: "↑" },
  { name: "Session",       level: "Early",    trend: "→" },
];

const threads = [
  { title: "finance freedom number", project: "Finance", status: "active", ageLabel: "6d", summary: "Freedom Number ($2.98M), 4 timeline scenarios, interaction rules built", pickupCmd: "pickup finance freedom number", stale: false },
  { title: "cal skill MVP refinement", project: "family-cal", status: "active", ageLabel: "5d", summary: "7 items scoped, preview pipeline workaround found", pickupCmd: "pickup cal skill MVP refinement", stale: false },
  { title: "filename convention update", project: "Claude", status: "active", ageLabel: "2d", summary: "V###-YYYYMMDD.HHMM updated in CLAUDE.md — appears complete", pickupCmd: "pickup filename convention update", stale: false },
  { title: "skill token optimization hop 2", project: "Claude", status: "active", ageLabel: "2d", summary: "Phase 0+1 done. 4 shards still pending write.", pickupCmd: "pickup skill token optimization hop 2", stale: false },
  { title: "jen setup day execution", project: "jen-config", status: "active", ageLabel: "2d", summary: "All blockers cleared. Needs Jen's Windows machine.", pickupCmd: "pickup jen setup day execution", stale: false },
  { title: "relay v5 deploy", project: "Claude", status: "active", ageLabel: "2d", summary: "Apps Script relay v5 deployed and verified live — closeable", pickupCmd: "pickup relay v5 deploy", stale: false },
  { title: "quality gate production upgrade", project: "Claude", status: "active", ageLabel: "2d", summary: "10 production upgrades catalogued, ready to execute.", pickupCmd: "pickup quality gate production upgrade", stale: false },
  { title: "task config portability done", project: "Claude", status: "active", ageLabel: "2d", summary: "All 6 items complete — closeable", pickupCmd: "pickup task config portability done", stale: false },
  { title: "morning dashboard cal fix", project: "Claude", status: "active", ageLabel: "1d", summary: "GCal empty-result bug fixed, proc.md updated, FooterBar added", pickupCmd: "pickup morning dashboard cal fix", stale: false },
  { title: "dashboard blank page fix", project: "Claude", status: "active", ageLabel: "1d", summary: "Emergency fix deployed — Mar 31 backup live, bundle clean", pickupCmd: "pickup dashboard blank page fix", stale: false },
  { title: "treasury ladder april execution", project: "Finance", status: "active", ageLabel: "1d", summary: "$241.4K maturing Apr 11+14, plan sketched, calendar event set", pickupCmd: "pickup treasury ladder april execution", stale: false },
  { title: "tip ratings + actionable filter", project: "Claude", status: "active", ageLabel: "1d", summary: "3 tip ratings logged, Dave-actionable filter added to proc.md", pickupCmd: "pickup tip ratings + actionable filter", stale: false },
  { title: "dashboard patches deployed", project: "morning-dashboard", status: "active", ageLabel: "1d", summary: "All clipboard + TIP_DATE patches applied and verified", pickupCmd: "pickup dashboard patches deployed", stale: false },
  { title: "error taxonomy cors", project: "Claude", status: "active", ageLabel: "1d", summary: "CORS pattern wired into learning system — taxonomy + L-008 + LEARNING-OPS", pickupCmd: "pickup error taxonomy cors", stale: false },
  { title: "skill deploy rule", project: "Claude", status: "active", ageLabel: "1d", summary: "Binding CLAUDE.md rule: always use skill deploy for source files", pickupCmd: "pickup skill deploy rule", stale: false },
  { title: "skill deploy safety rule", project: "Claude", status: "active", ageLabel: "1d", summary: "Handoff v1.9.1 + family-calendar v2.1.2 deployed; Document Write Safety rule added", pickupCmd: "pickup skill deploy safety rule", stale: false },
  { title: "session skill tip rotation", project: "Claude", status: "active", ageLabel: "today", summary: "Session skill tip 3-theme rotation added to morning dashboard", pickupCmd: "pickup session skill tip rotation", stale: false },
  { title: "vault readme github push", project: "Claude", status: "active", ageLabel: "today", summary: "iCloud vault done; GitHub README push blocked (sandbox 403) — needs Chrome JS", pickupCmd: "pickup vault readme github push", stale: false },
  { title: "skills bootstrap deploy verify", project: "Claude", status: "active", ageLabel: "today", summary: "family-calendar MISSING from Drive; 4 others unverified", pickupCmd: "pickup skills bootstrap deploy verify", stale: false },
  { title: "skill relay pipeline", project: "Claude", status: "loaded", ageLabel: "2d", summary: "Drive queue + Jen dashboard callout designed; Drive uploads pending", pickupCmd: "pickup skill relay pipeline", stale: false },
  { title: "nichols occupations military backwards", project: "Family Research", status: "loaded", ageLabel: "2d", summary: "Corrected John Thomas lineage, Pauline's 4 kids confirmed, Virgil branch ID'd", pickupCmd: "pickup nichols occupations military backwards", stale: false },
  { title: "skill pipeline gap analysis", project: "Claude", status: "loaded", ageLabel: "today", summary: "5 ranked deployment pipeline gaps identified by expert critique", pickupCmd: "pickup skill pipeline gap analysis", stale: false },
  { title: "skill bootstrap remaining 5", project: "Claude", status: "loaded", ageLabel: "today", summary: "skill-manager v1.3.1 deployed. 5 skills still need bootstrap update + deploy.", pickupCmd: "pickup skill bootstrap remaining 5", stale: false },
  { title: "setup day blockers cleared", project: "jen-config", status: "loaded", ageLabel: "1d", summary: "skill-manager v1.3.0 on Drive. All setup day blockers resolved.", pickupCmd: "pickup setup day blockers cleared", stale: false },
];
const THREAD_COUNT = 24;
const THREAD_STALE_COUNT = 0;

const morningIntent = [
  {
    rank: 1,
    text: "Nika Tutoring starts at 12:15p — confirm Jen's materials are ready and check whether the 12:30–2:00p work busy blocks are real meetings or placeholder blocks that can flex.",
    source: "calendar",
    pickupCmd: "cal next — show me today's events in detail and flag any conflicts.",
  },
  {
    rank: 2,
    text: "Close 3 completed threads: relay v5 deploy, task config portability done, and filename convention update all have completion language in their summaries — mark them integrated to clean up auto-pickup scanning.",
    source: "threads",
    pickupCmd: "I want to mark these threads as integrated: relay v5 deploy, task config portability done, filename convention update. Check their summaries and confirm each is complete.",
  },
  {
    rank: 3,
    text: "90-day sprint day 6: use today's consulting signal (61% of utilities cite AI talent as top barrier) to draft one prospecting message for an energy-sector contact.",
    source: "goal",
    pickupCmd: "Help me draft a 2-sentence LinkedIn outreach message to an energy sector operations leader. Use this hook: 61% of utility executives cite AI talent gap as their #1 AI deployment barrier in 2026.",
  },
];

const consultSignals = [
  {
    headline: "61% of utility executives cite AI talent gap as their #1 AI deployment barrier",
    why: "This directly validates the $20-35K AI Readiness Audit positioning. Frame it as: 'I help utilities build AI-ready teams to execute the infrastructure investments they're already making.'",
    source: "Utility Dive / EPRI 2026 Utilities & AI Survey",
  },
  {
    headline: "DOE launches Speed to Power initiative to accelerate grid infrastructure for AI data centers",
    why: "Federal urgency around grid AI creates consulting entry points at utility + integrator level. Use as a conversation-opener: 'How is your organization positioning for the federal grid AI push?'",
    source: "U.S. Department of Energy",
  },
  {
    headline: "Workflow redesign is the #1 factor linked to measurable AI ROI in 2026 (Deloitte State of AI)",
    why: "Validates execution-oriented consulting framing. Enterprises don't need more AI strategy — they need workflow transformation. Your practice positioning is aligned with where the ROI data points.",
    source: "Deloitte State of AI in the Enterprise 2026",
  },
];
const CONSULT_SIGNAL_DATE = "2026-04-01";

const goalAnchor = {
  label: "AI Consulting Practice",
  target: "First paying engagement",
  milestone: "90-day sprint: tooling → outreach → first client",
  elapsedPct: 3,
  horizonLabel: "Sep 2026",
};

const mondayScorecard = null;


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

function RatingPanel({ tip, onClose }) {
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
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.amber, lineHeight: 1.4 }}>{ev.conflict}</span>
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
          const scoreColor = tip.score >= 80 ? C.scoreHigh : tip.score >= 60 ? C.scoreMid : C.scoreLow;
          const scoreBg = tip.score >= 80 ? C.greenPale : tip.score >= 60 ? C.amberPale : C.surfaceAlt;
          return (
            <div key={tip.id}>
              <div onClick={() => toggleExpand(tip.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", cursor: "pointer", background: isOpen ? C.surfaceAlt : "transparent", borderBottom: !isOpen && !isRating && !isLast ? `1px solid ${C.border}` : "none", transition: "background 150ms ease" }}>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint, width: 14, textAlign: "center", flexShrink: 0, transition: "transform 150ms ease", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
                <span onClick={(e) => toggleRating(tip.id, e)} title="Click to rate this tip" style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 500, color: isRating ? "#6366f1" : scoreColor, background: isRating ? C.ratingBg : scoreBg, border: isRating ? `1px solid ${C.ratingBorder}` : "1px solid transparent", padding: "2px 8px", borderRadius: 4, minWidth: 32, textAlign: "center", flexShrink: 0, cursor: "pointer", transition: "all 150ms ease", userSelect: "none" }}>{tip.score}</span>
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
                  <RatingPanel tip={tip} onClose={() => closeRating(tip.id)} />
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
function ConsultingSignalSection() {
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Signals</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>{CONSULT_SIGNAL_DATE}</span>
      </div>
      <div style={{ padding: "6px 0" }}>
        {consultSignals.length === 0 ? (
          <div style={{ padding: "10px 18px", fontFamily: F.body, fontSize: 13, color: C.inkSoft }}>Quiet week — no new signals to surface.</div>
        ) : consultSignals.map((s, i) => (
          <div key={i} style={{ padding: "11px 18px", borderBottom: i < consultSignals.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 500, color: C.ink, lineHeight: 1.35, marginBottom: 5 }}>{s.headline}</div>
            <div style={{ fontFamily: F.body, fontSize: 12, color: C.inkMid, lineHeight: 1.5, marginBottom: 5 }}>{s.why}</div>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint }}>{s.source}</div>
          </div>
        ))}
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
          <ConsultingSignalSection />
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
