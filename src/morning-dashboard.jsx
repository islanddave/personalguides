import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// LIVE DATA — Claude replaces ONLY this section. Component code is frozen.
// ═══════════════════════════════════════════════════════════════════════════

const BRIEFING_DATE = "Tuesday, Mar 31";
const BRIEFING_TIME = "3:32a";
const TIP_DATE = "0331"; // MMDD — scopes tip IDs: 0331-01 through 0331-10
const GREETING = "Good morning, Dave.";

// Calendar data
const CAL_SUMMARY = "Clear day — nothing scheduled";
const calEvents = [];
const IS_MONDAY = false;
const weekShape = [];

// Systems health data
const SYSTEMS_STATUS = "green";
const SYSTEMS_SUMMARY = "2 errors yesterday — both env-assumption variants (b64 format + JS build validity). Pattern is recurring: 2 of 7 days.";
const ERROR_COUNT_24H = 2;
const ERROR_COUNT_7D = 2;
const PRIORITY_ACTION = {
  title: "env-assumption recurring",
  fix: "Before any protocol design: verify platform state (file validity, tool scope, format compatibility). Don't assume — check.",
  impact: "~35 min saved per instance avoided"
};
const errorTrends = [
  { label: "env-assumption", count7d: 2, direction: "up" },
  { label: "deploy/build", count7d: 2, direction: "flat" },
];

// Tips data
// Tip schema: { id, score, headline, detail, category, action, sessionPrompt }
// - detail: 3-5 sentences with specific context, evidence, and stakes
// - action: 1-line concrete next step (shown as green arrow callout)
// - sessionPrompt: paste this into a new Cowork chat to start working on this item immediately
const TIPS_LABEL = "10 tips scored";
const tips = [
  {
    id: 1, score: 95, category: "Workflow",
    headline: "Triage active threads before starting new work today",
    detail: "The handoff index has 10+ active/loaded threads right now. Each one is context the next session has to load and evaluate. Three are immediately closeable: filename-convention-update (stoic-eager-gauss), relay v5 deploy (tender-determined-bardeen), and quality gate upgrade (loving-trusting-maxwell). Picking 2 to close or park takes under 5 minutes and measurably speeds every future session's auto-pickup scan. Stale active threads accumulate silently — they don't announce their cost.",
    action: "Say 'threads' in a new session, then mark 2 threads as dead or integrated",
    sessionPrompt: "threads — show me all active and loaded threads with their summaries. I want to triage and close 2-3 that are no longer relevant.",
  },
  {
    id: 2, score: 92, category: "Finance",
    headline: "Treasury ladder: April maturity is this week — 2 decisions, 15 minutes",
    detail: "You've flagged this in every dashboard since March 29. The decision has exactly 2 branches: reinvest in T-bills at current rates, or redirect to equities. You don't need a comprehensive investment strategy — you need 15 minutes of research on current 3-month T-bill yields, a quick comparison to your equity allocation, and a decision threshold you already have from your Freedom Number analysis. The only way this becomes a problem is if you keep deferring it past the maturity date.",
    action: "Open a new session: research current T-bill rates and make the reinvest vs redirect decision",
    sessionPrompt: "My treasury ladder has an April maturity coming this week. Research the current 3-month T-bill rate, compare to typical equity returns, and help me decide: reinvest or redirect. I want a recommendation in 15 minutes.",
  },
  {
    id: 3, score: 88, category: "Infrastructure",
    headline: "Tip-rating API bridge spec is complete — 15 minutes to a live submit button",
    detail: "The vibrant-serene-ramanujan thread has a complete FastAPI spec for localhost:7878. The CORS audit is done and the launchd plist design is ready. Right now the Rate button copies a command you paste into Cowork. The API bridge would make it a direct write to cqr-log.md with one click. Given you rated 3 tips yesterday and found the 60/50 ratings meaningful, closing the friction here has a direct payoff on tip quality signal.",
    action: "Say 'pickup vibrant-serene-ramanujan' — target is FastAPI server + launchd plist",
    sessionPrompt: "pickup vibrant-serene-ramanujan",
  },
  {
    id: 4, score: 85, category: "Workflow",
    headline: "Skill optimization hop 2: 4 shards, each is an independent 20-minute write",
    detail: "dreamy-youthful-babbage completed Phase 0 (path hygiene) and Phase 1 (bootstrap compression) for all 6 skills. Hop 2 has 4 large procedure shards pending — bible-ops, cartography, handoff, and schedule skill procedure blocks. These are isolated writes: you don't need all 4 in one session, and you don't need the previous hops fresh in memory. Each shard is a standalone document with clear scope. The total token reduction from Phase 2 completion is significant and compounds every session.",
    action: "Say 'pickup dreamy-youthful-babbage' — goal is completing 1-2 shards",
    sessionPrompt: "pickup dreamy-youthful-babbage",
  },
  {
    id: 5, score: 82, category: "Workflow",
    headline: "Jen setup day needs Jen's computer, not more planning",
    detail: "sweet-practical-brahmagupta is the complete setup day runbook — all 7 build sessions are done, manifest is v1.3.0, Netlify aliases are configured, and the import prompt is on Drive. The system has been built over 7 dedicated sessions across 2 days. The only remaining variable is scheduling 30-45 minutes at Jen's Windows machine. No more infrastructure is needed. The runbook will walk you through every step. This is a 'sit down and do it' item.",
    action: "Schedule 30-45 min with Jen at her Windows machine — say 'pickup sweet-practical-brahmagupta' at session start",
    sessionPrompt: "pickup sweet-practical-brahmagupta",
  },
  {
    id: 6, score: 79, category: "Quality",
    headline: "Rate 2-3 more tips from yesterday before context fades",
    detail: "You rated 0330-01 (95), 0330-02 (60), and 0330-03 (50) yesterday — tips 04-10 are unrated. Ratings are most accurate within 24-48 hours while the session context that makes a tip useful or irrelevant is still fresh. The 60/50 ratings on Claude-process tips were exactly the right signal — that feedback is now driving the Dave-actionable filter used for today's tips. Two more ratings takes under a minute and keeps the calibration signal flowing.",
    action: "Rate 2 tips now: 'tip rate 0330-04 [score]' and 'tip rate 0330-05 [score]'",
    sessionPrompt: "I want to quickly rate tips 0330-04 through 0330-10. Show me each headline and I'll rate them one at a time.",
  },
  {
    id: 7, score: 76, category: "Strategy",
    headline: "Day 6 consulting clock: the minimum viable outreach is one sentence",
    detail: "Day 6 of 90 days, zero consulting sessions. The tooling is genuinely mature — vault, dispatch, dashboard, CQR, tip rating all working. But maturity of tooling does not equal progress toward revenue. The consulting practice's first external signal doesn't require a finished portfolio. It requires one message to one person in the energy sector. Even 'I'm building an AI workflow practice and would value 15 minutes of your perspective' is a valid and meaningful move today.",
    action: "Write one sentence: 'The AI value I could demonstrate to an energy contact today is ___.' Then send it.",
    sessionPrompt: "Help me draft a 2-sentence LinkedIn message to an energy-sector professional. Goal: describe what I'm building and ask for a 15-minute call. Framing: AI workflow efficiency and cost reduction.",
  },
  {
    id: 8, score: 73, category: "Quality",
    headline: "Quality gate thread has 10 items catalogued — pick the easiest and ship it",
    detail: "loving-trusting-maxwell has 10 production quality gate upgrades documented: security scanning, test execution, build validation, parallelization, blocking vs advisory tiers, coverage thresholds, perf regression, smoke tests, contract validation, bypass mechanism. These have been sitting since March 30. The lowest-effort item is probably enforcing blocking vs advisory tier separation — a 2-line CLAUDE.md clarification. Cataloguing and shipping are different activities.",
    action: "Say 'pickup loving-trusting-maxwell' then ask 'what is the easiest item to ship right now?'",
    sessionPrompt: "pickup loving-trusting-maxwell",
  },
  {
    id: 9, score: 70, category: "Workflow",
    headline: "Archive integrated/dead handoff threads older than 7 days",
    detail: "The handoff index has 60+ entries spanning March 26-30. Entries marked dead or integrated from before March 24 are pure noise in the auto-pickup scan. The proc says archive threads >7 days old to handoff-index-archive.md but this hasn't been done. A single pass takes under 2 minutes and reduces the index from 60+ entries to ~20 active/loaded ones. Leaner index means faster auto-pickup at every session start — a small investment that compounds daily.",
    action: "In a new session: 'Read my handoff-index.md and archive all integrated/dead entries created before 2026-03-25'",
    sessionPrompt: "Read my handoff-index.md and archive all entries with status 'integrated' or 'dead' that were created before 2026-03-25. Move them to /Users/davenichols/AI/Claude/handoffs/handoff-index-archive.md and clean up the main index.",
  },
  {
    id: 10, score: 65, category: "Specialized Agents",
    headline: "Version your scheduled task proc.md files like you version skills",
    detail: "You apply V### versioning to skills, CLAUDE.md edits, and file deliverables — but proc.md files have no version history. When a scheduled task changes behavior (e.g., morning dashboard gained a GitHub deploy step), there's no record of what changed, when, or why. Adding a '## Version' section to each proc.md — one line per update with date and change summary — makes behavioral drift visible and enables rollback reasoning. This follows the same discipline already applied everywhere else in the stack.",
    action: "When next editing any proc.md: add a '## Version' section at top with today's date and the change summary",
    sessionPrompt: "Help me add version tracking to my scheduled task proc.md files. I want a lightweight convention that matches how I already version skills. Show me what the Version section should look like, then update morning-dashboard proc.md as the first example.",
  },
];

// Skills progress
const SKILLS_PROGRESS = [
  { name: "Calendar", level: "Stable", trend: "→" },
  { name: "Handoff", level: "Stable", trend: "↑" },
  { name: "Tip Rating", level: "New", trend: "↑" },
  { name: "Error Telemetry", level: "New", trend: "→" },
  { name: "Cartography", level: "Early", trend: "→" },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT — Do not modify below this line.
// ═══════════════════════════════════════════════════════════════════════════

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
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "tips  side"
      "cal   cal"
      "foot  foot";
    gap: 16px;
    padding: 20px 24px 24px;
    flex: 1;
    align-items: start;
  }
  .db-cal  { grid-area: cal; }
  .db-side { grid-area: side; display: flex; flex-direction: column; gap: 16px; }
  .db-tips { grid-area: tips; }
  .db-foot { grid-area: foot; }
  @media (max-width: 760px) {
    .db-grid {
      grid-template-columns: 1fr;
      grid-template-areas: "tips" "side" "cal" "foot";
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

function StatusDot({ status }) {
  const color = status === "green" ? C.green : status === "amber" ? C.amber : C.red;
  return (<span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 0 2px ${color}22`, marginRight: 8, flexShrink: 0 }} />);
}

function TrendArrow({ direction }) {
  const map = { up: { symbol: "↑", color: C.green }, down: { symbol: "↓", color: C.red }, flat: { symbol: "→", color: C.inkFaint } };
  const t = map[direction] || map.flat;
  return <span style={{ color: t.color, fontSize: 13, fontFamily: F.mono }}>{t.symbol}</span>;
}

function CalendarSection() {
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Calendar</span>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkSoft }}>{CAL_SUMMARY}</span>
      </div>
      <div style={sectionBody}>
        {calEvents.length === 0 ? (
          <div style={{ fontFamily: F.body, fontSize: 14, color: C.inkSoft, padding: "8px 0" }}>Nothing on the calendar today. A good day to catch up or rest.</div>
        ) : calEvents.map((ev, i) => (
          <div key={ev.id} style={{ marginBottom: i < calEvents.length - 1 ? 12 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 36, borderRadius: 2, background: ev.color, flexShrink: 0 }} />
              <div style={{ minWidth: 58, flexShrink: 0 }}>
                <div style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 500, color: C.ink }}>{ev.time}</div>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>{ev.dur}</div>
              </div>
              <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 500, color: C.ink, flex: 1 }}>{ev.title}</div>
            </div>
            {ev.prep && (
              <div style={{ fontFamily: F.body, fontSize: 12.5, color: C.inkMid, padding: "4px 0 0 71px", lineHeight: 1.4 }}>
                <span style={{ color: C.sage, marginRight: 4 }}>↳</span>{ev.prep}
              </div>
            )}
          </div>
        ))}
        {IS_MONDAY && weekShape.length > 0 && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
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
        <div style={{ fontFamily: F.body, fontSize: 14, color: C.ink, marginBottom: PRIORITY_ACTION ? 12 : errorTrends.length > 0 ? 10 : 0 }}>{SYSTEMS_SUMMARY}</div>
        {PRIORITY_ACTION && (
          <div style={{ background: C.amberPale, border: `1px solid ${C.amber}33`, borderRadius: 8, padding: "10px 14px", marginBottom: errorTrends.length > 0 ? 12 : 0 }}>
            <div style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Priority: {PRIORITY_ACTION.title}</div>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.inkMid }}>Fix: {PRIORITY_ACTION.fix}</div>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.inkSoft, marginTop: 2 }}>Impact: {PRIORITY_ACTION.impact}</div>
          </div>
        )}
        {errorTrends.length > 0 && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {errorTrends.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F.mono, fontSize: 12, color: C.inkMid }}>
                <TrendArrow direction={t.direction} /><span>{t.label}</span><span style={{ color: C.inkFaint }}>({t.count7d})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RatingPanel({ tip, onClose }) {
  const [myScore, setMyScore] = useState("");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const cmdText = `tip rate ${TIP_DATE}-${String(tip.id).padStart(2,'0')} ${myScore || "?"}${comment ? ` "${comment}"` : ""}`;
  const handleCopy = () => {
    const text = `tip rate ${TIP_DATE}-${String(tip.id).padStart(2,'0')} ${myScore}${comment ? ` "${comment}"` : ""}`;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ padding: "10px 18px 12px 18px", background: C.ratingBg, borderTop: `1px solid ${C.ratingBorder}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6366f1" }}>Rate this tip</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkFaint, fontSize: 14, padding: "0 2px", lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 8 }}>
        <input type="number" min="0" max="100" value={myScore} onChange={e => setMyScore(e.target.value)} placeholder="0–100" style={{ width: 64, padding: "6px 8px", fontFamily: F.mono, fontSize: 13, border: `1px solid ${C.ratingBorder}`, borderRadius: 6, background: "#fff", color: C.ink, outline: "none", flexShrink: 0 }} />
        <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment…" style={{ flex: 1, padding: "6px 10px", fontFamily: F.body, fontSize: 13, border: `1px solid ${C.ratingBorder}`, borderRadius: 6, background: "#fff", color: C.ink, outline: "none" }} />
        <button onClick={handleCopy} disabled={!myScore} style={{ padding: "6px 14px", borderRadius: 6, border: "none", cursor: myScore ? "pointer" : "not-allowed", background: copied ? C.green : myScore ? "#6366f1" : C.surfaceAlt, color: myScore ? "#fff" : C.inkFaint, fontFamily: F.mono, fontSize: 12, fontWeight: 500, transition: "background 200ms ease", flexShrink: 0 }}>{copied ? "Copied!" : "Copy"}</button>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 11, color: myScore ? "#6366f1" : C.inkFaint, background: "#fff", border: `1px solid ${C.ratingBorder}`, borderRadius: 5, padding: "5px 10px", letterSpacing: "0.02em" }}>{cmdText}</div>
    </div>
  );
}

function SessionPromptBox({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
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

function TipsSection() {
  const [expanded, setExpanded] = useState({});
  const [ratingOpen, setRatingOpen] = useState({});
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleRating = (id, e) => { e.stopPropagation(); setRatingOpen(prev => ({ ...prev, [id]: !prev[id] })); };
  const closeRating = (id) => setRatingOpen(prev => ({ ...prev, [id]: false }));
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
          const scoreColor = tip.score >= 80 ? C.scoreHigh : tip.score >= 60 ? C.scoreMid : C.scoreLow;
          const scoreBg = tip.score >= 80 ? C.greenPale : tip.score >= 60 ? C.amberPale : C.surfaceAlt;
          return (
            <div key={tip.id}>
              <div onClick={() => toggleExpand(tip.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", cursor: "pointer", background: isOpen ? C.surfaceAlt : "transparent", borderBottom: !isOpen && !isRating && !isLast ? `1px solid ${C.border}` : "none", transition: "background 150ms ease" }}>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint, width: 14, textAlign: "center", flexShrink: 0, transition: "transform 150ms ease", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
                <span onClick={(e) => toggleRating(tip.id, e)} title="Click to rate this tip" style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 500, color: isRating ? "#6366f1" : scoreColor, background: isRating ? C.ratingBg : scoreBg, border: isRating ? `1px solid ${C.ratingBorder}` : "1px solid transparent", padding: "2px 8px", borderRadius: 4, minWidth: 32, textAlign: "center", flexShrink: 0, cursor: "pointer", transition: "all 150ms ease", userSelect: "none" }}>{tip.score}</span>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.inkFaint, padding: "1px 5px", background: C.surfaceAlt, borderRadius: 3, flexShrink: 0, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>{TIP_DATE}-{String(tip.id).padStart(2,'0')}</span>
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
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <span style={sectionLabel}>Skills</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkFaint }}>progress</span>
      </div>
      <div style={{ padding: "12px 18px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
        {SKILLS_PROGRESS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span style={{ fontFamily: F.body, fontSize: 13, fontWeight: 500, color: C.ink, flex: 1 }}>{s.name}</span>
            <span style={{ fontFamily: F.mono, fontSize: 11, color: C.inkSoft, marginRight: 8 }}>{s.level}</span>
            <span style={{ fontFamily: F.mono, fontSize: 13, color: s.trend === "↑" ? C.green : s.trend === "↓" ? C.red : C.inkFaint }}>{s.trend}</span>
          </div>
        ))}
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
      <div className="db-grid">
        <div className="db-tips">
          <TipsSection />
        </div>
        <div className="db-side">
          <SystemsSection />
          <SkillsCard />
        </div>
        <div className="db-cal">
          <CalendarSection />
        </div>
        <div className="db-foot">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["cal", "cal add [event]", "tip rate [n] [score]"].map((h, i) => (
              <span key={i} style={{ fontFamily: F.mono, fontSize: 11, color: C.inkSoft, padding: "3px 8px", background: C.surfaceAlt, borderRadius: 4, border: `1px solid ${C.border}` }}>{h}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
