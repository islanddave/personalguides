import { useState, useEffect, useCallback } from "react";

const T = {
  cream: "#FDF8F2", card: "#FFFDF9", ink: "#2D2D2D", inkMid: "#5A5A5A",
  inkSoft: "#6B6B6B", sage: "#5E9180", sageDark: "#3D6B5A", sageLight: "#A8CCBF",
  sagePale: "#EAF3F0", terra: "#C8714A", terraDark: "#9E4F2D", terraPale: "#FDF0E8",
  gold: "#C49520", amber: "#B87820", success: "#4A8F6A", successPale: "#EDF7F1",
  border: "rgba(0,0,0,.08)",
  fontDisplay: "'Nunito', 'Helvetica Rounded', sans-serif",
  fontBody: "'DM Sans', system-ui, sans-serif",
  fontMono: "'DM Mono', 'Courier New', monospace",
  shadow: "0 1px 6px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.04)",
  radius: "10px",
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else { fallback(); }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [text]);
  return (
    <button onClick={copy} aria-label="Copy to clipboard" style={{
      position: "absolute", top: 8, right: 8, border: "none", borderRadius: 6,
      padding: "4px 10px", fontSize: 12, fontFamily: T.fontDisplay, fontWeight: 700,
      cursor: "pointer", transition: "all 150ms ease",
      background: copied ? T.successPale : T.sagePale,
      color: copied ? T.success : T.sageDark,
    }}>
      {copied ? "\u2713 Copied" : "Copy"}
    </button>
  );
}

function Code({ children, bg = "#F5F0EB" }) {
  const text = typeof children === "string" ? children : "";
  return (
    <div style={{ position: "relative", margin: "8px 0 12px" }}>
      <CopyBtn text={text} />
      <div style={{
        fontFamily: T.fontMono, fontSize: 13, background: bg,
        padding: "12px 72px 12px 16px", borderRadius: 8,
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        lineHeight: 1.55, color: T.ink,
      }}>{children}</div>
    </div>
  );
}

function Callout({ label, labelColor, borderColor, children }) {
  return (
    <div style={{ borderLeft: `4px solid ${borderColor}`, paddingLeft: 16, margin: "12px 0" }}>
      <p style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 14,
        color: labelColor, margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontSize: 14, color: T.ink, margin: 0, lineHeight: 1.55 }}>{children}</p>
    </div>
  );
}
const Tip = ({ children }) => <Callout label="Tip" labelColor={T.gold} borderColor={T.gold}>{children}</Callout>;
const Note = ({ children }) => <Callout label="Note" labelColor={T.sageDark} borderColor={T.sageDark}>{children}</Callout>;
const Warn = ({ children }) => <Callout label="Heads up" labelColor={T.amber} borderColor={T.amber}>{children}</Callout>;
const STORAGE_KEY = "caltasks_checklist_v1";

function Checklist({ items }) {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch(e) { return new Set(); }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked])); }
    catch(e) { /* storage unavailable */ }
  }, [checked]);

  const toggle = (i) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const done = checked.size;
  const total = items.length;
  const allDone = done === total;

  const handleKey = (e, i) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(i); }
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.sagePale }}>
          <div style={{ height: 6, borderRadius: 3,
            width: `${(done / total) * 100}%`,
            background: allDone ? T.success : T.sage,
            transition: "width 400ms ease" }} />
        </div>
        <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.inkMid }}>
          {allDone ? "\u2713 All done" : `${done}/${total}`}
        </span>
      </div>
      {items.map((label, i) => {
        const isDone = checked.has(i);
        return (
          <div key={i} role="checkbox" aria-checked={isDone} tabIndex={0}
            onClick={() => toggle(i)} onKeyDown={(e) => handleKey(e, i)}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
              cursor: "pointer", outline: "none",
            }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              border: `2px solid ${isDone ? T.success : T.sageLight}`,
              background: isDone ? T.successPale : "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "all 150ms ease",
            }}>
              {isDone && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke={T.success} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{
              fontSize: 14, color: isDone ? T.inkSoft : T.ink,
              textDecoration: isDone ? "line-through" : "none",
              transition: "all 150ms ease",
            }}>{label}</span>
          </div>
        );
      })}
      {done > 0 && (
        <button onClick={(e) => { e.stopPropagation(); setChecked(new Set()); }} style={{
          marginTop: 8, border: "none", background: "none", cursor: "pointer",
          fontSize: 12, color: T.inkSoft, fontFamily: T.fontBody,
          textDecoration: "underline", padding: 0,
        }}>Reset progress</button>
      )}
    </div>
  );
}
function Step({ num, title, children }) {
  return (
    <div style={{
      background: T.card, borderRadius: T.radius, padding: "24px",
      boxShadow: T.shadow, marginBottom: 24, border: `1px solid ${T.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <span style={{
          fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: "#fff",
          background: T.terra, width: 28, height: 28, borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginRight: 10, flexShrink: 0,
        }}>{num}</span>
        <h2 style={{
          fontFamily: T.fontDisplay, fontSize: "clamp(20px, 4vw, 26px)",
          fontWeight: 800, color: T.sageDark, margin: 0, lineHeight: 1.25,
        }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function PathTable() {
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "12px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 400 }}>
        <tbody>
          {[
            ["From", T.sageDark, T.sagePale, "Mac: ~/.claude/skills/family-calendar/"],
            ["To", T.terraDark, T.terraPale, "Win: C:\\Users\\Jen\\.claude\\skills\\family-calendar\\"],
            ["Files", T.inkMid, "#F5F0EB", "SKILL.md + cal-template.jsx"],
          ].map(([label, color, bg, path]) => (
            <tr key={label}>
              <td style={{ padding: "8px 12px", fontWeight: 600, color,
                background: bg, width: 50, borderBottom: `1px solid ${T.border}`,
                whiteSpace: "nowrap" }}>{label}</td>
              <td style={{ padding: "8px 12px", fontFamily: T.fontMono, fontSize: 13,
                borderBottom: `1px solid ${T.border}`, wordBreak: "break-all" }}>{path}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IC({ children }) {
  return <code style={{ fontFamily: T.fontMono, fontSize: 13,
    background: "#F5F0EB", padding: "2px 6px", borderRadius: 4 }}>{children}</code>;
}
export default function Caltasks() {
  return (
    <div style={{
      background: T.cream, color: T.ink, fontFamily: T.fontBody,
      fontSize: "15px", lineHeight: 1.65, minHeight: "100vh",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 64px" }}>

        <header style={{
          textAlign: "center", padding: "48px 0 32px",
          borderBottom: `2px solid ${T.sagePale}`, marginBottom: 32,
        }}>
          <h1 style={{
            fontFamily: T.fontDisplay, fontSize: "clamp(28px, 5vw, 38px)",
            fontWeight: 800, color: T.sageDark, margin: "0 0 6px", lineHeight: 1.2,
          }}>Morning Routines for Jen</h1>
          <p style={{ fontFamily: T.fontBody, fontSize: 16, color: T.inkMid,
            fontWeight: 400, margin: 0 }}>
            Calendar briefing + Cowork tips on Windows
          </p>
          <span style={{
            display: "inline-block", fontFamily: T.fontDisplay, fontSize: 13,
            fontWeight: 700, color: T.terra, background: T.terraPale,
            padding: "4px 12px", borderRadius: 100, marginTop: 12,
          }}>4 steps &middot; ~15 minutes</span>
        </header>

        <p style={{
          textAlign: "center", fontStyle: "italic", color: T.inkMid,
          fontSize: 15, margin: "0 0 32px", padding: "0 24px", lineHeight: 1.6,
        }}>
          You already have the Claude app. This just wires up two morning
          tasks&mdash;one for your calendar, one for learning what this thing can do.
        </p>

        <div style={{ marginBottom: 28, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 420 }}>
            <thead>
              <tr>
                {["Task", "Time", "What it does"].map((h) => (
                  <th key={h} style={{
                    fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 13,
                    color: T.sageDark, background: T.sagePale, padding: "8px 12px",
                    textAlign: "left", borderBottom: `2px solid ${T.sageLight}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px 12px", fontWeight: 600, color: T.sageDark,
                  borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>Morning Briefing</td>
                <td style={{ padding: "8px 12px", fontFamily: T.fontMono, fontSize: 13,
                  borderBottom: `1px solid ${T.border}` }}>7:15 AM</td>
                <td style={{ padding: "8px 12px",
                  borderBottom: `1px solid ${T.border}` }}>
                  Today's calendar events with prep nudges. Week-ahead on Mondays.</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", fontWeight: 600, color: T.terraDark,
                  borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>Cowork Tips</td>
                <td style={{ padding: "8px 12px", fontFamily: T.fontMono, fontSize: 13,
                  borderBottom: `1px solid ${T.border}` }}>8:00 AM</td>
                <td style={{ padding: "8px 12px",
                  borderBottom: `1px solid ${T.border}` }}>
                  10 scored tips to build Cowork fluency. Tracks which skills you've explored.</td>
              </tr>
            </tbody>
          </table>
          <Note>Both tasks need Claude to be running. If the PC is asleep at fire time,
            they'll run when it wakes. Set Claude to launch on startup and forget about it.</Note>
        </div>
        <Step num={1} title="Enable Cowork">
          <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.65 }}>
            Claude &rarr; Settings &rarr; Desktop app &rarr; toggle Cowork on.
            Grant file access when prompted.
          </p>
          <Tip>While you're in settings, confirm Claude is set to launch on startup.
            That's what keeps the morning tasks reliable.</Tip>
        </Step>

        <Step num={2} title="Connect Google Calendar">
          <ol style={{ margin: "0 0 12px", paddingLeft: 20, fontSize: 15, lineHeight: 1.8 }}>
            <li><strong>Open the connector gallery</strong> &mdash; in Cowork settings, find
              connectors or integrations. Google Calendar is a managed connector in the
              registry &mdash; no manual config needed.</li>
            <li><strong>Click Connect on Google Calendar</strong> &mdash; standard Google sign-in
              flow. Use whichever account has Jen's calendar.</li>
            <li><strong>Authorize read + write access.</strong></li>
          </ol>
          <p style={{ margin: "0 0 8px", fontSize: 15 }}>Quick test &mdash; type this in Cowork:</p>
          <Code>cal tomorrow</Code>
          <p style={{ margin: 0, fontSize: 14, color: T.inkMid, lineHeight: 1.6 }}>
            Events showing = good. "cal" not recognized = fine, the skill
            comes next. As long as the connector itself is listed as connected, move on.</p>
        </Step>

        <Step num={3} title="Copy the Family Calendar Skill">
          <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.65 }}>
            Copy the entire skill folder from Dave's Mac to Jen's PC. The folder has
            two files: <strong>SKILL.md</strong> (the skill logic)
            and <strong>cal-template.jsx</strong> (the morning briefing's formatting
            template). Both are required.
          </p>
          <PathTable />
          <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.65 }}>
            Create the <IC>.claude\skills\</IC> folders on Windows if they don't exist.
            Transfer via USB, cloud, whatever. Restart Claude after copying.
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 15 }}>Verify:</p>
          <Code>cal help</Code>
        </Step>
        <Step num={4} title="Create the Scheduled Tasks">
          <p style={{ margin: "0 0 8px", fontSize: 15 }}>In Cowork, type:</p>
          <Code bg={T.sagePale}>{"Create a scheduled task called \"morning-briefing\" that runs every day at 7:15 AM. Daily ADHD-friendly calendar briefing \u2014 today\u2019s events with prep nudges, week-ahead on Mondays. Use the family-calendar skill formatting."}</Code>
          <Note>Cron will be <IC>15 7 * * *</IC>. The system adds a few minutes of jitter,
            so it'll land around 7:20&ndash;7:25.</Note>

          <p style={{ margin: "16px 0 8px", fontSize: 15 }}>Then:</p>
          <Code bg={T.terraPale}>{"Create a scheduled task called \"morning-cowork-tips\" that runs every day at 8:00 AM. Daily digest of 10 scored Cowork tips plus skills progress tracker. Help me learn what Claude and Cowork can do, one day at a time."}</Code>
          <Note>Cron will be <IC>0 8 * * *</IC>. With jitter, fires around
            8:05&ndash;8:10. Calendar lands first, then learning content.</Note>

          <p style={{ margin: "16px 0 8px", fontSize: 15 }}>Confirm both, then verify:</p>
          <Code>list my scheduled tasks</Code>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: T.inkMid }}>
            Both should show with next-run times.</p>

          <Warn>Both tasks only fire if Claude is running. If the PC is asleep at fire
            time, they'll run when Claude next opens. This is why Step 1's "launch on
            startup" matters.</Warn>
          <Tip>Adjust the times to Jen's morning. The gap between them matters more than
            the exact times &mdash; calendar first, tips after she's had a few minutes
            to absorb the day.</Tip>
        </Step>

        <div style={{
          background: T.card, borderRadius: T.radius, padding: "24px",
          boxShadow: T.shadow, marginBottom: 24, border: `1px solid ${T.border}`,
          borderTop: `4px solid ${T.sage}`,
        }}>
          <h2 style={{
            fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800,
            color: T.sageDark, margin: "0 0 4px",
          }}>Verification Checklist</h2>
          <Checklist items={[
            "Cowork mode is enabled",
            "Google Calendar connector is active and authorized",
            'Family-calendar skill is installed ("cal help" works)',
            "morning-briefing task is scheduled",
            "morning-cowork-tips task is scheduled",
            "Claude is set to launch on startup",
          ]} />
        </div>

        <p style={{
          textAlign: "center", fontFamily: T.fontDisplay, fontWeight: 700,
          fontSize: 18, color: T.sageDark, marginTop: 40,
        }}>That's it. Four steps. Go do something else.</p>
        <p style={{
          textAlign: "center", fontStyle: "italic", color: T.inkMid,
          fontSize: 14, marginTop: 8,
        }}>Tomorrow morning, Claude will be waiting with the day's plan.</p>

      </div>
    </div>
  );
}
