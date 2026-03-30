import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// LIVE DATA — Claude replaces ONLY this section. Component code is frozen.
// ═══════════════════════════════════════════════════════════════════════════

const BRIEFING_DATE = "Monday, Mar 30";
const BRIEFING_TIME = "4:24p";
const GREETING = "Good afternoon, Dave.";

const CAL_SUMMARY = "Clear day · clear week";
const calEvents = [];
const IS_MONDAY = true;
const weekShape = [
  { day: "Mon", count: 0, flag: "light" },
  { day: "Tue", count: 0, flag: "light" },
  { day: "Wed", count: 0, flag: "light" },
  { day: "Thu", count: 0, flag: "light" },
  { day: "Fri", count: 0, flag: "light" },
  { day: "Sat", count: 0, flag: "light" },
  { day: "Sun", count: 0, flag: "light" },
];

const SYSTEMS_STATUS = "amber";
const SYSTEMS_SUMMARY = "env-assumption systemic — 7 instances, 39% of all errors. 7 new today (5 after morning review). Tool-scope mismatch is the dominant root cause across sessions.";
const ERROR_COUNT_24H = 7;
const ERROR_COUNT_7D = 17;
const PRIORITY_ACTION = {
  title: "Add tool-scope quick-ref to CLAUDE.md",
  fix: "5-bullet map: mcp→user FS only · Read/Write/Edit→sandbox only · bash→sandbox, no local scripts · WebFetch→GET-only · Chrome JS→outbound HTTP, no local files",
  impact: "Eliminates root cause for ~40% of all errors logged since system inception (7 of 17)",
};
const errorTrends = [
  { label: "env-assumption", count7d: 7, direction: "up" },
  { label: "stale-knowledge", count7d: 2, direction: "up" },
  { label: "tool-limitation", count7d: 1, direction: "flat" },
];

const TIPS_LABEL = "10 tips scored";
const tips = [
  {
    id: 1, score: 93, category: "Infrastructure",
    headline: "Chrome JS → Apps Script: always use Content-Type: text/plain",
    detail: "ritchie-001 confirmed: application/json triggers a CORS preflight that Apps Script doesn't handle from arbitrary origins. text/plain is a 'simple request' per the CORS spec — no preflight sent. Apps Script receives the body via e.postData.contents and JSON.parse works regardless of content-type. This is now a confirmed platform pattern embedded in every relay-using session. The savings: 2 failed fetches vs. zero when the pattern is applied upfront.",
    action: "For all Chrome JS → Apps Script POSTs: set headers: {'Content-Type': 'text/plain'}, body: JSON.stringify(payload)",
    sessionPrompt: "I need to POST data from Chrome JS to my Google Apps Script relay. Show me the correct fetch call pattern that avoids CORS preflight issues.",
  },
  {
    id: 2, score: 91, category: "Tools",
    headline: "Check tab URL before javascript_tool — chrome:// pages silently fail",
    detail: "ritchie-002 confirmed: javascript_tool returns 'Browser URL could not be parsed' on chrome://newtab/ and any internal browser URL. Chrome extension content scripts are blocked on privileged pages by browser security policy. After tabs_context_mcp, always verify the tab URL starts with http:// or https:// before calling javascript_tool. Any real HTTPS URL works — drive.google.com is a safe default. This is the most common single-cause of 'why won't my JS run' confusion.",
    action: "After tabs_context_mcp: if tab URL contains chrome:// or about:, navigate to https://drive.google.com before any javascript_tool call",
    sessionPrompt: "Walk me through the correct sequence for getting a Chrome tab ready for javascript_tool calls, including what to check before executing any JS.",
  },
  {
    id: 3, score: 89, category: "Infrastructure",
    headline: "window._c* vars don't survive context boundaries — always re-load all chunks",
    detail: "dirac-001 proved: reusing window vars from a prior context window produced 1-char base64 corruption that passed the length check (7000 chars) but decoded to broken JSX. The GitHub PUT returned 200 and the commit succeeded — but the page threw a ReferenceError on load. Length checks are necessary but not sufficient for b64 integrity. The only safe pattern: re-run Python chunk generation and re-load ALL chunk files via mcp__filesystem__read_file on every deploy attempt, even if prior chunks look correct.",
    action: "Before every deploy: re-run python chunk script, re-load ALL chunk files from disk — never skip any chunk re-load",
    sessionPrompt: "Explain the b64 chunk pipeline for deploying JSX files to GitHub via Chrome JS. What are the failure modes I need to guard against, and what's the correct procedure?",
  },
  {
    id: 4, score: 87, category: "Workflow",
    headline: "Jen-config is 3 bounded sessions from completion",
    detail: "S1 (handoff + family-calendar skills), S2 (CLAUDE.md template + prefs), S3 (learning files), and S5 (claude-md-backup proc) are complete and live on Drive. S4 (skills packaging), S6 (scheduled task procs), and S7 (tips/onboarding) are the remaining sessions. Each is bounded and autonomous-safe — no decisions required from Dave mid-session. A clear week is a good window to close these. Jen gets a functional environment; you clear one active thread from the auto-pickup queue.",
    action: "Say 'pickup jen config s3 s5 complete' to load the thread and start S4 (skills packaging)",
    sessionPrompt: "pickup jen config s3 s5 complete",
  },
  {
    id: 5, score: 85, category: "Workflow",
    headline: "5 active threads are slowing auto-pickup — triage 2 today",
    detail: "Active threads: skill-system-gap-review, filename-convention-update, jen-config-s3-s5-complete, finance-freedom-number, and cal-skill-MVP-refinement. Auto-pickup scans all active threads at every session start — the more active threads, the more ambiguous the pickup signal. filename-convention-update (summary suggests a single CLAUDE.md edit was the output) and cal-skill-MVP-refinement (loaded, not active — the preview pipeline blocker may still be unresolved) are likely candidates to close or park.",
    action: "Open handoff index, read summaries for 'filename-convention-update' and 'cal-skill-MVP-refinement', decide: close or park each",
    sessionPrompt: "threads — show me all active handoff threads. I want to triage which ones to close, park, or continue today.",
  },
  {
    id: 6, score: 83, category: "Quality",
    headline: "Error logging at 25% compliance — log at the pivot, not at session end",
    detail: "The compliance gap is a timing problem, not a discipline problem. 'At session end' competes with everything winding down — the entry gets skipped. The pattern that actually works: when approach A fails and you shift to approach B, that transition is the exact moment to log. The error is fresh, the contrast is clear, and the entry takes 2 minutes. 17 errors in 7 days with ~25 sessions means most sessions still produce zero entries. Closing the gap to even 50% compliance would double the data density for pattern detection.",
    action: "At every approach pivot: write the error entry immediately (category + recovery + avoidable?) before continuing to approach B",
    sessionPrompt: "Help me write an error log entry for a failure that just happened in my session. Walk me through the schema: task context, domain, approach tried, failure, recovery, root cause, category, avoidable, wasted effort.",
  },
  {
    id: 7, score: 80, category: "Quality",
    headline: "CQR step > session rating gap (~5 pts) is information — track it deliberately",
    detail: "From the log: step ratings average ~92 (individual artifact quality is high) while session ratings average ~87 (session-level goal completion is lower). A consistent 5-point gap suggests sessions regularly end before all goals are addressed — either scope is too large or goal-setting is too ambitious. Tracking the gap deliberately for 5 sessions would reveal whether this is a scoping problem or a completion problem, and what to adjust.",
    action: "For the next 5 sessions: explicitly note the step vs. session gap in the CQR entry and add a one-line hypothesis for why the gap exists",
    sessionPrompt: "Review my CQR log at /Users/davenichols/AI/Claude/learning/cqr-log.md and analyze the gap between step ratings and session ratings. Is there a pattern by session type?",
  },
  {
    id: 8, score: 78, category: "Finance",
    headline: "Treasury ladder April maturity — decision window is days, not weeks",
    detail: "April T-bill maturity is arriving this week. The decision has three branches: reinvest in short-duration T-bills, extend the ladder to a longer duration, or redirect to equities given the current rate environment. With a clear week and no calendar pressure, a 15-minute research session can frame the decision with current rates. Every day of non-decision is a small cost: cash sitting between maturities earns nothing. This is the only growth vector with a hard external deadline.",
    action: "Open a fresh session and research current 4-week, 8-week, 13-week T-bill rates vs. money market alternatives — frame the decision in 3 options",
    sessionPrompt: "I have Treasury bills maturing this week in April. Help me compare current 4-week, 8-week, and 13-week T-bill rates against alternatives. Context: $570K in assets, $2.98M freedom number, 90-day consulting clock active.",
  },
  {
    id: 9, score: 75, category: "Strategy",
    headline: "Skills ratings need external signal — the bar is lower than it feels",
    detail: "All 8 skills are at Day 4 ratings, all flat for 5 days. The learning system can't update scores without new evidence, and infrastructure-only sessions don't calibrate monetization or market-value skills. The bar for 'counts as external signal' is lower than it feels: a 5-line email to an energy-sector contact asking what frustrates them about AI adoption qualifies. So does reading one recent industry report and summarizing the AI angle. You don't need a client — you need contact with the market.",
    action: "Identify one energy or financial services contact and send a 5-line email asking what's frustrating them about AI adoption in their org",
    sessionPrompt: "Help me draft a short outreach message to someone in the energy sector about AI adoption challenges. Context: I'm a CAIO-level consultant building my first engagements. Keep it under 5 lines, no pitch.",
  },
  {
    id: 10, score: 72, category: "Learning",
    headline: "L-006 is promotion-ready — 7 instances, confidence 0.6, write it today",
    detail: "L-006 (tool scope matching) has 7 corroborating instances across env-assumption errors and is currently provisional with REVIEW_REQUIRED status. Promoting it makes it discoverable during the learning bootstrap (which future sessions run for non-trivial work), directly reducing the env-assumption error rate. The confidence level of 0.6 is appropriate — the pattern is consistent but the tool landscape could change with platform updates. Promotion takes 5 minutes and is autonomous-safe.",
    action: "Open lessons.md and promote L-006: status → active, confidence → 0.70, add 3 most recent corroborating instances (ritchie-001, ritchie-002, albattani-001)",
    sessionPrompt: "Read /Users/davenichols/AI/Claude/learning/lessons.md and help me promote L-006 (tool scope matching) from provisional to confirmed. Update confidence to 0.70, status to active, and add the 3 most recent corroborating error instances.",
  },
];

const SKILLS_PROGRESS = [
  { name: "Rule/Process Design", level: "Stable", trend: "→" },
  { name: "Systems Thinking", level: "Stable", trend: "→" },
  { name: "Iteration Discipline", level: "Stable", trend: "→" },
  { name: "Tool Ecosystem", level: "Stable", trend: "→" },
  { name: "Monetization", level: "No signal", trend: "→" },
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
    grid-template-columns: 1.55fr 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "cal   side"
      "tips  tips"
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
      grid-template-areas: "cal" "side" "tips" "foot";
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
  const cmdText = `tip rate ${tip.id} ${myScore || "?"}${comment ? ` "${comment}"` : ""}`;
  const handleCopy = () => {
    const text = `tip rate ${tip.id} ${myScore}${comment ? ` "${comment}"` : ""}`;
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
        <div className="db-cal">
          <CalendarSection />
        </div>
        <div className="db-side">
          <SystemsSection />
          <SkillsCard />
        </div>
        <div className="db-tips">
          <TipsSection />
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
