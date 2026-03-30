import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// LIVE DATA — Claude replaces ONLY this section. Component code is frozen.
// ═══════════════════════════════════════════════════════════════════════════

const BRIEFING_DATE = "Monday, Mar 30";
const BRIEFING_TIME = "10:21a";
const GREETING = "Good morning, Dave.";

const CAL_SUMMARY = "2 events today";
const calEvents = [
  {
    id: 1, time: "12:00p", end: "1:00p", dur: "1h",
    title: "Kate in \u{1F1FA}\u{1F1E6} — need Dave's Zoom", color: "#42d692",
    prep: "Kate is calling from Ukraine. Open Zoom before noon and keep the link ready for her.",
    allDay: false,
  },
  {
    id: 2, time: "9:00p", end: "9:45p", dur: "45m",
    title: "Jen therapy", color: "#7986CB",
    prep: "Quiet the house by 8:55p. No interruptions during session.",
    allDay: false,
  },
];
const IS_MONDAY = true;
const weekShape = [
  { day: "Mon", count: 2, flag: "busy" },
  { day: "Tue", count: 1, flag: "" },
  { day: "Wed", count: 1, flag: "" },
  { day: "Thu", count: 0, flag: "light" },
  { day: "Fri", count: 1, flag: "" },
  { day: "Sat", count: 2, flag: "busy" },
  { day: "Sun", count: 2, flag: "busy" },
];

const SYSTEMS_STATUS = "amber";
const SYSTEMS_SUMMARY = "env-assumption systemic: 5 of 12 errors (7d). Vault task can't run local scripts — launchd fix needed. Tool scope mismatch persists.";
const ERROR_COUNT_24H = 2;
const ERROR_COUNT_7D = 12;
const PRIORITY_ACTION = {
  title: "Add tool-scope quick-ref to CLAUDE.md",
  fix: "5-bullet map: mcp__filesystem→user FS, Read/Write/Edit→sandbox, bash→sandbox, WebFetch→GET only, Chrome JS→outbound HTTP. L-006 at conf 0.6.",
  impact: "Eliminates ~40% of all errors across 7-day window"
};
const errorTrends = [
  { label: "env-assumption", count7d: 5, direction: "up" },
  { label: "wrong-tool/syntax", count7d: 4, direction: "up" },
  { label: "unnecessary-step", count7d: 1, direction: "flat" },
];

const TIPS_LABEL = "10 tips scored";
const tips = [
  {
    id: 1, score: 96, category: "Finance",
    headline: "Treasury Ladder — April Maturity Is This Week",
    detail: "The only growth vector with a hard external deadline. Even 15 minutes of research today prevents a lapsed decision worth real money. Day 5 of the 90-day consulting clock — this is the one item that can't wait. T-bill or CD rolling into nothing is a real cost.",
    action: "Research rollover options for April maturity dates — 15 min max",
    sessionPrompt: "Help me review the Treasury Ladder situation. April maturity is this week. What are my rollover options and what should I know before deciding?",
  },
  {
    id: 2, score: 93, category: "Errors",
    headline: "env-assumption Is Now Systemic — Act On It",
    detail: "5 instances in 7 days, 35+ minutes burned. Core mitigation: before designing any protocol, verify platform capabilities. Vault task failure today is the 5th instance. L-006 is ready for promotion at conf 0.6 — this isn't provisional anymore.",
    action: "Add 5-bullet tool-scope map to CLAUDE.md — 10 minutes",
    sessionPrompt: "I need to add a tool-scope quick reference to CLAUDE.md to fix the env-assumption error pattern. Help me draft it: mcp__filesystem scope, Read/Write/Edit scope, bash scope, WebFetch limits, Chrome JS scope.",
  },
  {
    id: 3, score: 91, category: "Strategy",
    headline: "Clear Monday + Clear Week = Growth Vector Day",
    detail: "Zero calendar events all week except Zoom support and Jen's therapy. Day 5 of the 90-day consulting clock with zero revenue-facing sessions. The tooling is mature enough — infrastructure sprint has run its course. Pick ONE growth vector today.",
    action: "Open a session focused on employment contract review OR portfolio creation",
    sessionPrompt: "I want to make progress on my employment contract review today. Help me understand what I need to prepare and what the key decisions are.",
  },
  {
    id: 4, score: 88, category: "Infrastructure",
    headline: "Vault Backup Needs launchd, Not Scheduled Tasks",
    detail: "Today's vault-sync failure (E-vigilant-sweet-mccarthy-001) confirmed: scheduled tasks run in a Linux sandbox with no access to /Users/davenichols. vault-backup.py needs a launchd plist — same 15-minute setup as the compression guard watcher.",
    action: "Set up launchd plist for vault-backup.py in Terminal (15 min)",
    sessionPrompt: "Help me set up a launchd plist to run vault-backup.py daily. I have a launchd watcher for compression guard — use the same pattern.",
  },
  {
    id: 5, score: 86, category: "Quality",
    headline: "Paste Schemas in Agent Prompts — Don't Describe Them",
    detail: "E-great-brave-brown errors showed agents inferring wrong key names from prose descriptions. 3 of 5 bugs were preventable by pasting the actual JSON schema. When dispatching agents for structured data work, paste the schema directly — saves 2-3 correction cycles.",
    action: "Next agent dispatch: include the target file's actual schema as literal JSON",
    sessionPrompt: "Show me how to structure agent dispatch prompts for tasks involving structured data to avoid schema inference errors.",
  },
  {
    id: 6, score: 83, category: "Workflow",
    headline: "Two Active Threads Need Triage Today",
    detail: "dispatch-stress-test (zen-admiring-dijkstra) is active, bootstrap layered defense (serene-sweet-feynman) is loaded. Both need a decision. Stale active threads slow auto-pickup for every new session — 2 threads means 2 index scans before every response.",
    action: "Say 'threads' to review and triage active handoffs",
    sessionPrompt: "threads",
  },
  {
    id: 7, score: 80, category: "Quality",
    headline: "CQR Data Ready for First Pattern Extraction",
    detail: "9 entries across 4 days. Compliance sessions (78) vs build sessions (~93 avg) is a real signal: meta-operational work has a CQR penalty. First pattern extraction can produce 1-2 promotable lessons from evidence already in the log.",
    action: "Promote compliance/build CQR gap to lessons.md this session",
    sessionPrompt: "Review my cqr-log.md and help me extract patterns. I want to promote at least one new lesson based on the compliance vs build session gap.",
  },
  {
    id: 8, score: 78, category: "Strategy",
    headline: "Day 5: Builder Bias Persists",
    detail: "Every session since baseline = infrastructure. Vault, dispatch, dashboard, CQR, bootstrap — all sophisticated, all internal. Sophistication ≠ progress toward $2.98M freedom number. The minimum viable consulting artifact is still undefined. What could exist by Friday?",
    action: "Name one consulting artifact that could exist by Friday",
    sessionPrompt: "Help me identify the minimum viable consulting artifact I could create this week — proposal, case study, LinkedIn post, or something else. I need to break out of infrastructure-only mode.",
  },
  {
    id: 9, score: 75, category: "Workflow",
    headline: "Handoff Index Needs Archival",
    detail: "40+ entries in 5 days, most integrated or dead. Auto-pickup scans the full index on every session start — a lean index is a faster index. Archive threads older than 7 days with status integrated/dead.",
    action: "Archive dead/integrated threads from before 2026-03-26",
    sessionPrompt: "Help me archive old handoff threads. Archive all dead and integrated entries from before 2026-03-26 to handoff-index-archive.md.",
  },
  {
    id: 10, score: 72, category: "Creative",
    headline: "World Bible Hasn't Been Touched in 5 Days",
    detail: "Book-bible V021 is stable but no creative sessions since the infrastructure sprint began. The Cartographer's Residue world is frozen. If writing energy is available after infrastructure tasks, a bible session would break the loop and deliver intrinsic value.",
    action: "Say 'bible status' to check patched but uncommitted work",
    sessionPrompt: "bible status",
  },
];

const SKILLS_PROGRESS = [
  { name: "Systems thinking", level: "Maturing", trend: "\u2192" },
  { name: "Rule/process design", level: "Stable", trend: "\u2192" },
  { name: "Tool ecosystem awareness", level: "Maturing", trend: "\u2192" },
  { name: "Iteration discipline", level: "Maturing", trend: "\u2192" },
  { name: "Monetization", level: "New", trend: "\u2192" },
  { name: "Scoping under constraint", level: "Early", trend: "\u2192" },
];


// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT — Do not modify below this line.
// ═══════════════════════════════════════════════════════════════════════════

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');`;

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
  border: `1px solid ${C.border}`, marginBottom: 16, overflow: "hidden",
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
          <div style={{ fontFamily: F.body, fontSize: 14, color: C.inkSoft, padding: "8px 0" }}>Nothing on the calendar today. A good day to catch up or Irest.</div>
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
          <StatusDot status={SYSTEMS_STATU} />
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

function SkillsBar() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "10px 18px", background: C.surfaceAlt, borderRadius: 8, marginTop: 2 }}>
      {SKILLS_PROGRESS.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: F.mono, fontSize: 11, color: C.inkMid }}>
          <span style={{ color: C.ink, fontWeight: 500 }}>{s.name}</span>
          <span style={{ color: C.inkFaint }}>·</span>
          <span>{s.level}</span>
          <span style={{ color: s.trend === "↑" ? C.green : C.inkFaint }}>{s.trend}</span>
        </div>
      ))}
    </div>
  );
}

export default function MorningDashboard() {
  return (
    <div style={{ fontFamily: F.body, background: C.bg, color: C.ink, padding: "20px 16px", minHeight: "100vh", maxWidth: 580, margin: "0 auto" }}>
      <style>{FONTS}</style>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: F.display, fontSize: 18, fontWeight: 800, color: C.ink }}>{GREETING}</span>
          <span style={{ fontFamily: F.mono, fontSize: 12, color: C.inkFaint }}>{BRIEFING_TIME}</span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: 13, color: C.inkSoft }}>{BRIEFING_DATE}</div>
      </div>
      <CalendarSection />
      <SystemsSection />
      <TipsSection />
      <SkillsBar />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, padding: "8px 0" }}>
        {["cal", "cal add [event]", "tip rate [n] [score]"].map((h, i) => (
          <span key={i} style={{ fontFamily: F.mono, fontSize: 11, color: C.inkSoft, padding: "3px 8px", background: C.surfaceAlt, borderRadius: 4, border: `1px solid ${C.border}` }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

