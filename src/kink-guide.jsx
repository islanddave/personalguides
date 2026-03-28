/**
 * A Beginner's Guide to Kink \u2014 Mobile-First Web Version
 * React component \u00B7 Single file \u00B7 All inline styles
 * Mirrors PDF V008 content exactly
 *
 * Usage: import KinkGuide from './kink-guide'
 * Requires: React 17+ with useState
 */

import { useState } from "react"

// --- Palette ------------------------------------------------------------------
const C = {
  bg:          '#FDF8F2',
  ink:         '#2D2D2D',
  inkMid:      '#5A5A5A',
  inkSoft:     '#888888',
  sage:        '#5E9180',
  sageDark:    '#3D6B5A',
  sagePale:    '#EAF3F0',
  terra:       '#C8714A',
  terraDark:   '#9E4F2D',
  terraPale:   '#FDF0E8',
  gold:        '#C49520',
  goldPale:    '#FDF5DC',
  amber:       '#B87820',
  amberPale:   '#FDF3DC',
  success:     '#4A8F6A',
  successPale: '#EDF7F1',
  white:       '#ffffff',
}

// --- Icons --------------------------------------------------------------------
function Icon({ name, size = 24, color = C.sage }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: color, flexShrink: 0 }
  const none = "none"

  const icons = {
    check:      <svg {...p}><polyline points="3,12 9,18 21,6" fill={none} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    shield:     <svg {...p}><path d="M12 2L20 6v7c0 4.4-3.6 8-8 9-4.4-1-8-4.6-8-9V6z"/><polyline points="9,12 11,14 15,10" fill={none} stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    warn:       <svg {...p}><path d="M10.3 3.3L2.1 18a2 2 0 001.7 3h16.4a2 2 0 001.7-3L13.7 3.3a2 2 0 00-3.4 0z"/><line x1="12" y1="9" x2="12" y2="14" stroke={C.white} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17.5" r="0.8" fill={C.white}/></svg>,
    heart:      <svg {...p}><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 000-7.8z"/></svg>,
    book:       <svg {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    lock:       <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4" fill={none} stroke={color} strokeWidth="2"/></svg>,
    feather:    <svg {...p}><path d="M20.2 7.8l-7.7 7.7-4-4 7.7-7.7a5.5 5.5 0 017.7 7.7z" fill={color}/><path d="M20.2 7.8L9 19" fill={none} stroke={C.white} strokeWidth="1.5" strokeLinecap="round"/><path d="M17 11l-5.5 5.5" fill={none} stroke={C.white} strokeWidth="1" strokeLinecap="round"/></svg>,
    mask:       <svg {...p}><rect x="1" y="9" width="22" height="9" rx="4.5"/><ellipse cx="7.5" cy="13.5" rx="2.5" ry="2" fill={C.bg}/><ellipse cx="16.5" cy="13.5" rx="2.5" ry="2" fill={C.bg}/></svg>,
    hand:       <svg {...p}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="8" stroke={color} strokeWidth="2"/><line x1="10" y1="1" x2="10" y2="8" stroke={color} strokeWidth="2"/><line x1="14" y1="1" x2="14" y2="8" stroke={color} strokeWidth="2"/></svg>,
    bubble:     <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><circle cx="9" cy="11" r="1" fill={C.white}/><circle cx="12" cy="11" r="1" fill={C.white}/><circle cx="15" cy="11" r="1" fill={C.white}/></svg>,
    eye:        <svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" fill={C.white}/><circle cx="12" cy="12" r="1.5" fill={color}/></svg>,
    star:       <svg {...p}><circle cx="12" cy="16" r="4.5"/><circle cx="12" cy="16" r="2.5" fill={C.bg}/><rect x="11" y="3" width="2.5" height="13.5"/><rect x="12" y="4" width="4.5" height="2.5"/><rect x="12" y="8" width="4" height="2"/></svg>,
    candle:     <svg {...p}><rect x="9" y="8" width="6" height="13" rx="1.5"/><line x1="12" y1="8" x2="12" y2="5" stroke={C.inkMid} strokeWidth="1.5" strokeLinecap="round"/><path d="M12 2c0 0 2.5 2.5 0 3-2.5-0.5 0-3 0-3z" fill={C.terra}/></svg>,
    hourglass:  <svg {...p}><path d="M5 2h14l-5 8 5 8H5l5-8-5-8z"/><line x1="5" y1="2" x2="19" y2="2" stroke={color} strokeWidth="1.5"/><line x1="5" y1="22" x2="19" y2="22" stroke={color} strokeWidth="1.5"/></svg>,
    scales:     <svg {...p}><line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="2"/><line x1="4" y1="10" x2="20" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M4 10l-2 5a3 3 0 006 0l-2-5" fill={color}/><path d="M20 10l-2 5a3 3 0 006 0l-2-5" fill={color}/><line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
    mirror:     <svg {...p}><polygon points="12,2 22,12 12,22 2,12"/><circle cx="12" cy="12" r="2.5" fill={C.bg}/></svg>,
    exchange:   <svg {...p}><polygon points="4,18 20,18 17,13 14,16 12,13 10,16 7,13"/><rect x="4" y="18" width="16" height="3" rx="1.5"/><circle cx="8" cy="18" r="1.2" fill={C.bg}/><circle cx="12" cy="18" r="1.2" fill={C.bg}/><circle cx="16" cy="18" r="1.2" fill={C.bg}/></svg>,
    flame:      <svg {...p}><path d="M12 2c0 0 7 7 7 13a7 7 0 01-14 0c0-6 7-13 7-13z" fill={color}/><path d="M12 8c0 0 4 4 4 7a4 4 0 01-8 0c0-3 4-7 4-7z" fill={C.bg}/></svg>,
    foot:       <svg {...p}><rect x="5" y="12" width="11" height="8" rx="4"/><circle cx="7.5" cy="8.5" r="2.5"/><circle cx="11.5" cy="7.5" r="2.5"/><circle cx="15.5" cy="8.5" r="2"/><circle cx="19" cy="10" r="1.5"/></svg>,
    microphone: <svg {...p}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 01-14 0v-2" fill={none} stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2"/><line x1="9" y1="23" x2="15" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
    globe:      <svg {...p}><circle cx="12" cy="21" r="1.5"/><path d="M4 15q4-5 8 0 4 5 8 0" fill={none} stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M2 9q5-6 10 0 5 6 10 0" fill={none} stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
    person:     <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    beer:       <svg {...p}><circle cx="12" cy="5.5" r="3.5"/><path d="M7 21v-3a5 5 0 0110 0v3" fill={none} stroke={color} strokeWidth="2"/><circle cx="5" cy="9" r="3"/><path d="M2 21v-2.5a3 3 0 016 0V21" fill={none} stroke={color} strokeWidth="2"/><circle cx="19" cy="9" r="3"/><path d="M16 21v-2.5a3 3 0 016 0V21" fill={none} stroke={color} strokeWidth="2"/></svg>,
    clipboard:  <svg {...p}><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12" stroke={C.white} strokeWidth="1.5" strokeLinecap="round"/><line x1="9" y1="15" x2="15" y2="15" stroke={C.white} strokeWidth="1.5" strokeLinecap="round"/><polyline points="8,9 10,11 14,8" fill={none} stroke={C.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    map:        <svg {...p}><circle cx="12" cy="9" r="5.5"/><circle cx="12" cy="9" r="2.5" fill={C.bg}/><line x1="12" y1="14.5" x2="12" y2="22" stroke={color} strokeWidth="3" strokeLinecap="round"/></svg>,
  }

  return icons[name] || <svg {...p}><circle cx="12" cy="12" r="8"/></svg>
}

// --- Typography helpers -------------------------------------------------------
const T = {
  body:    { fontSize: 16, lineHeight: 1.6, color: '#2D2D2D', fontFamily: 'system-ui, -apple-system, sans-serif' },
  small:   { fontSize: 14, lineHeight: 1.5, color: '#2D2D2D' },
  caption: { fontSize: 13, lineHeight: 1.4, color: '#5A5A5A', fontStyle: 'italic' },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.sage },
  h1:      { fontSize: 28, fontWeight: 800, lineHeight: 1.2, color: C.sageDark, fontFamily: 'system-ui, -apple-system, sans-serif' },
  h2:      { fontSize: 20, fontWeight: 700, lineHeight: 1.3, color: C.terraDark, marginTop: 24, marginBottom: 8, fontFamily: 'system-ui, -apple-system, sans-serif' },
}

// --- Reusable components ------------------------------------------------------
const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    style={{ color: C.terraDark, fontWeight: 600, textDecoration: 'none' }}>
    {children}
  </a>
)

const Term = ({ children }) => <span style={{ fontWeight: 700, color: C.terraDark }}>{children}</span>

const SectionBanner = ({ eyebrow, title, id }) => (
  <div id={id} style={{ borderBottom: `2px solid ${C.sagePale}`, paddingBottom: 12, marginBottom: 20, paddingTop: 8, scrollMarginTop: 60 }}>
    <p style={{ ...T.eyebrow, margin: '0 0 4px' }}>{eyebrow}</p>
    <h2 style={{ ...T.h1, fontSize: 24, margin: 0 }}>{title}</h2>
  </div>
)

const IconCard = ({ icon, title, body, bg = C.sagePale, border = C.sage, iconColor }) => (
  <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
    <div style={{ paddingTop: 2, flexShrink: 0 }}>
      <Icon name={icon} size={26} color={iconColor || border} />
    </div>
    <div>
      <p style={{ ...T.small, fontWeight: 700, color: border, margin: '0 0 4px' }}>{title}</p>
      <p style={{ ...T.small, margin: 0, color: C.ink }} dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  </div>
)

const CategoryCard = ({ icon, name, tagline, desc, bg = C.sagePale, border = C.sage }) => (
  <div style={{ background: bg, border: `1px solid ${border}`, borderTop: `3px solid ${border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
    <div style={{ paddingTop: 2, flexShrink: 0 }}>
      <Icon name={icon} size={28} color={border} />
    </div>
    <div>
      <p style={{ margin: '0 0 5px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: C.sageDark }}>{name}</span>
        <span style={{ fontStyle: 'italic', fontSize: 13, color: C.inkMid }}> {'\u2014'} {tagline}</span>
      </p>
      <p style={{ ...T.small, margin: 0 }} dangerouslySetInnerHTML={{ __html: desc }} />
    </div>
  </div>
)

const StepCard = ({ num, title, body }) => (
  <div style={{ display: 'flex', gap: 0, marginBottom: 10, border: `1px solid ${C.sagePale}`, borderRadius: 10, overflow: 'hidden' }}>
    <div style={{ background: C.sagePale, width: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontWeight: 800, fontSize: 20, color: C.sageDark }}>{num}</span>
    </div>
    <div style={{ background: C.white, padding: '10px 14px', flex: 1 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: C.sageDark, margin: '0 0 4px' }}>{title}</p>
      <p style={{ ...T.small, margin: 0 }}>{body}</p>
    </div>
  </div>
)

const CalloutBox = ({ icon, label, children, bg = C.sagePale, border = C.sage }) => (
  <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
    {label && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {icon && <Icon name={icon} size={20} color={border} />}
        <span style={{ fontWeight: 700, fontSize: 15, color: border }}>{label}</span>
      </div>
    )}
    <div style={T.small}>{children}</div>
  </div>
)

const BreatheBox = ({ quote, sub }) => (
  <div style={{ background: C.goldPale, border: `1px solid ${C.sagePale}`, borderRadius: 10, padding: '20px 20px', marginBottom: 14, textAlign: 'center' }}>
    <p style={{ fontWeight: 700, fontSize: 16, color: C.sageDark, lineHeight: 1.4, margin: '0 0 8px' }}>"{quote}"</p>
    <p style={{ ...T.caption, margin: 0 }}>{sub}</p>
  </div>
)

const TLDR = ({ text }) => (
  <CalloutBox icon="check" label="TL;DR" bg={C.sagePale} border={C.sage}>
    <p style={{ margin: 0 }}>{text}</p>
  </CalloutBox>
)

// --- Section: Cover -----------------------------------------------------------
const Cover = () => (
  <div style={{ padding: '40px 20px 28px', textAlign: 'center' }}>
    <div style={{ marginBottom: 20 }}>
      <svg width={64} height={64} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill={C.sagePale}/>
        {[0,1,2,3,4,5].map(i => {
          const a = Math.PI/2 + Math.PI*2*i/6
          return <circle key={i} cx={40+22*Math.cos(a)} cy={40+22*Math.sin(a)} r={5} fill={C.sage}/>
        })}
        <circle cx="40" cy="40" r="10" fill={C.sageDark}/>
      </svg>
    </div>
    <h1 style={{ ...T.h1, margin: '0 0 8px' }}>A Beginner's Guide to Kink</h1>
    <p style={{ ...T.caption, fontSize: 15, margin: '0 0 20px' }}>For the curious, the newly-exploring, and everyone who's wondered "what if"</p>
    <div style={{ height: 1, background: C.sagePale, margin: '0 auto 18px', maxWidth: 200 }}/>
    <p style={{ ...T.small, color: C.inkMid, fontStyle: 'italic', margin: '0 0 20px', lineHeight: 1.5 }}>
      Starting this exploration at any point in life {'\u2014'} your 20s, your 40s, your 60s {'\u2014'} is completely valid. This guide assumes no prior knowledge.
    </p>
    <BreatheBox
      quote="Curious is exactly the right place to start."
      sub="You don't have to figure out who you are today. Just read, notice what sparks, and go at your own pace."
    />
  </div>
)

// --- Nav ----------------------------------------------------------------------
const NAV_ITEMS = [
  { id: 's1', label: 'Myths' },
  { id: 's2', label: 'What is kink?' },
  { id: 's3', label: 'Consent' },
  { id: 's4', label: 'Categories' },
  { id: 's5', label: 'Solo' },
  { id: 's6', label: 'With a partner' },
  { id: 's7', label: 'Kink vs abuse' },
  { id: 's8', label: 'Community' },
  { id: 's9', label: 'Starting path' },
  { id: 's10', label: 'Glossary' },
  { id: 's11', label: 'Resources' },
]

const NavBar = () => (
  <div style={{ position: 'sticky', top: 0, zIndex: 100, background: C.bg, borderBottom: `1px solid ${C.sagePale}`, overflowX: 'auto', whiteSpace: 'nowrap', padding: '8px 16px', WebkitOverflowScrolling: 'touch' }}>
    {NAV_ITEMS.map(({ id, label }) => (
      <a key={id} href={`#${id}`}
        style={{ display: 'inline-block', marginRight: 6, padding: '5px 12px', borderRadius: 20, background: C.sagePale, color: C.sageDark, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        {label}
      </a>
    ))}
  </div>
)

// --- Section 1: Myths ---------------------------------------------------------
const S1 = () => (
  <section style={{ padding: '24px 16px 16px' }}>
    <SectionBanner id="s1" eyebrow="Before we begin" title="Let's clear the air" />
    <p style={{ ...T.body, marginBottom: 16 }}>Most people arrive with a few misconceptions {'\u2014'} from movies, jokes, half-remembered headlines, or just decades of not talking about this stuff openly. Let's knock those out first.</p>
    {[
      { icon: 'check',     title: "Myth: People into kink have something wrong with them",
        body: "Research consistently shows kink practitioners report lower anxiety, stronger communication skills, and higher relationship satisfaction than the general population. Curiosity about kink is not a symptom of anything." },
      { icon: 'hourglass', title: "Myth: This is for younger people \u2014 I'm too old to start",
        body: "There is no age limit on curiosity or self-discovery. Many people begin exploring kink in their 40s, 50s, or later \u2014 often because they finally have the self-knowledge, the confidence, and the time to do it thoughtfully. Starting later frequently means starting smarter." },
      { icon: 'scales',    title: "Myth: The Dominant is in charge; the Submissive just goes along",
        body: "In ethical kink, both people hold real power. The person in the Submissive role can stop everything at any moment with a single word. Many practitioners say the Submissive actually holds more power, because the Dominant's behavior is constrained entirely by consent." },
      { icon: 'heart',     title: "Myth: Kink is primarily about sex",
        body: "For many people, it's equally or primarily about trust, vulnerability, emotional intensity, and connection. Some scenes involve no sex at all. The lines are personal and vary widely." },
      { icon: 'map',       title: "Myth: You have to go all the way in",
        body: "Most kink is completely modular. Try one small thing, see how it feels, stop or continue. Plenty of people practice light kink indefinitely and find it satisfying. There's no finish line." },
    ].map(m => <IconCard key={m.title} bg={C.successPale} border={C.success} {...m} />)}
  </section>
)

// --- Section 2: What is kink? -------------------------------------------------
const S2 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s2" eyebrow="The basics" title="What is kink, exactly?" />
    <p style={T.body}>The word "kink" is a broad umbrella term for sexual interests, practices, and fantasies that fall outside what a given culture considers conventional. There's no fixed master list \u2014 it's personal, contextual, and constantly evolving.</p>
    <p style={{ ...T.body, marginTop: 12 }}><Term>BDSM</Term> <span style={{ fontStyle: 'italic', color: C.inkMid, fontSize: 14 }}>(an acronym for Bondage/Discipline, Dominance/Submission, and Sadism/Masochism {'\u2014'} the largest and most common cluster of kink activities)</span></p>
    <p style={{ ...T.body, marginTop: 12 }}>Kink and BDSM overlap significantly but aren't identical: kink is the broader umbrella, BDSM is the most common territory within it.</p>
    <p style={{ ...T.body, marginTop: 12, marginBottom: 16 }}>How common is this? More than you'd guess. One major study found nearly half of respondents had tried at least one BDSM activity. A 2014 study found 65% of women and 53% of men had fantasized about being sexually dominated. This is not niche.</p>
    <TLDR text="Kink = anything outside conventional sex. BDSM = the most common type. Both require enthusiastic, ongoing consent. Both are far more common than most people realize." />
  </section>
)

// --- Section 3: Consent -------------------------------------------------------
const S3 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s3" eyebrow="The foundation" title="Consent: the one non-negotiable" />
    <p style={{ ...T.body, marginBottom: 16 }}>Before exploring categories, before anything physical, there's consent. The kink community is actually more rigorous about consent than most other sexual contexts.</p>
    <h2 style={T.h2}>Three frameworks you'll hear about</h2>
    <IconCard icon="shield" title="SSC \u2014 Safe, Sane, and Consensual"
      body="All activity should be physically and emotionally safe, done with a clear mind, and fully agreed upon. The classic framework \u2014 simple and effective for most beginners."
      bg={C.sagePale} border={C.sage} />
    <IconCard icon="warn" title="RACK \u2014 Risk-Aware Consensual Kink"
      body="A refinement: some kink carries inherent risk that can't be fully eliminated. The goal becomes risk awareness and active agreement, rather than pretending no risk exists."
      bg={C.sagePale} border={C.sage} iconColor={C.amber} />
    <IconCard icon="mirror" title="PRICK \u2014 Personal Responsibility, Informed Consensual Kink"
      body="The most individual-centered model. Each person owns their research, their limits, and their readiness. You show up prepared, informed, and honest."
      bg={C.sagePale} border={C.sage} />
    <h2 style={T.h2}>Hard limits vs. soft limits</h2>
    <CalloutBox icon="warn" label="Two terms you'll hear constantly" bg={C.amberPale} border={C.amber}>
      <p style={{ margin: '0 0 8px' }}><Term>Hard limit</Term> {'\u2014'} an absolute boundary. A firm no, always, under any circumstances. Non-negotiable. Never pushed, argued with, or tested.</p>
      <p style={{ margin: '0 0 8px' }}><Term>Soft limit</Term> {'\u2014'} something that makes you hesitate. Might be okay with the right partner, after more experience, under specific conditions. Not a yes, not a final no.</p>
      <p style={{ margin: 0 }}>Making a list of your own limits privately before any conversation with a partner is one of the most useful things a new person can do.</p>
    </CalloutBox>
    <h2 style={T.h2}>Safewords</h2>
    <p style={{ ...T.body, marginBottom: 12 }}>A <Term>safeword</Term> (a word agreed upon in advance that immediately stops all play) is the core safety mechanism of kink. It must be agreed upon before anything begins.</p>
    <CalloutBox icon="check" label="The traffic light system \u2014 most beginner-friendly" bg={C.goldPale} border={C.gold}>
      <p style={{ margin: '0 0 6px' }}><span style={{ fontWeight: 700, color: C.success }}>{'\u25CF'} GREEN</span> {'\u2014'} All good, keep going</p>
      <p style={{ margin: '0 0 6px' }}><span style={{ fontWeight: 700, color: C.gold }}>{'\u25CF'} YELLOW</span> {'\u2014'} Slow down, check in with me</p>
      <p style={{ margin: '0 0 10px' }}><span style={{ fontWeight: 700, color: C.terra }}>{'\u25CF'} RED</span> {'\u2014'} Stop completely, right now</p>
      <p style={{ margin: 0 }}>If speech might be restricted: agree on a non-verbal signal beforehand {'\u2014'} tapping out three times, or holding an object and dropping it.</p>
    </CalloutBox>
  </section>
)

// --- Section 4: The landscape -------------------------------------------------
const S4 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s4" eyebrow="What's out there" title="The landscape: categories at a glance" />
    <p style={{ ...T.body, marginBottom: 16 }}>Think of this as a menu, not a checklist. Most people find themselves curious about two or three categories rather than just one.</p>
    {[
      { icon: 'exchange', name: 'Power Exchange', tagline: 'one person leads, one follows',
        desc: `The most widely explored area. One partner takes the guiding role (<b style="color:#9E4F2D">Dominant</b> or <b style="color:#9E4F2D">Top</b>), the other follows (<b style="color:#9E4F2D">Submissive</b> or <b style="color:#9E4F2D">Bottom</b>). Can be limited to a single session or an ongoing dynamic. Everything is negotiated in advance.`,
        bg: C.sagePale, border: C.sage },
      { icon: 'lock', name: 'Bondage & Restraint', tagline: 'physical restriction as part of play',
        desc: `Ranges from holding wrists to elaborate rope work (called <b style="color:#9E4F2D">shibari</b>). The point isn't restriction itself \u2014 it's the trust, vulnerability, and sensation. Safety note: never leave someone alone while restrained; always have safety scissors within reach.`,
        bg: C.terraPale, border: C.terra },
      { icon: 'feather', name: 'Sensation Play', tagline: 'exploring the full range of physical feeling',
        desc: 'Temperature (ice, warm wax), texture contrast (soft vs. scratchy), blindfolds. Sensation isn\'t just about pleasure \u2014 it\'s about presence and full-body awareness. One of the easiest areas to try solo first.',
        bg: C.sagePale, border: C.sage },
      { icon: 'hand', name: 'Impact Play', tagline: 'consensual striking',
        desc: 'Spanking, paddling, flogging. Safe zones: buttocks, upper thighs, upper back, shoulders. Avoid: lower back/kidneys, spine, joints, neck, head. Always start lighter than you think you need to.',
        bg: C.terraPale, border: C.terra },
      { icon: 'mask', name: 'Role-play & Fantasy', tagline: 'acting out scenarios and characters',
        desc: 'Psychological rather than physical. Characters, scenarios, or power dynamics played out verbally or in costume. Doesn\'t need to be elaborate. Discuss the scenario outside of the scene first.',
        bg: C.sagePale, border: C.sage },
      { icon: 'eye', name: 'Voyeurism & Exhibitionism', tagline: 'watching or being watched',
        desc: `<b style="color:#9E4F2D">Voyeurism</b>: arousal from watching. <b style="color:#9E4F2D">Exhibitionism</b>: arousal from being watched. Ranges from mirrors during sex to consensual presence at kink events. Always requires active, explicit consent from everyone involved.`,
        bg: C.terraPale, border: C.terra },
      { icon: 'star', name: 'Fetishes', tagline: 'specific arousal linked to an object or body part',
        desc: 'The range is enormous: feet, leather, latex, specific fabrics. Common, normal, and only a concern if they cause distress or require non-consenting partners.',
        bg: C.sagePale, border: C.sage },
      { icon: 'candle', name: 'Temperature Play', tagline: 'hot and cold as sensation tools',
        desc: 'Ice cubes, warm wax (soy or low-temp candles only \u2014 never standard household candles near face or hair). One of the most accessible forms of sensation play to try alone first.',
        bg: C.terraPale, border: C.terra },
      { icon: 'bubble', name: 'Psychological & Verbal Play', tagline: 'words and tone as the medium',
        desc: `Easiest to underestimate. Verbal dynamics \u2014 commanding language, praise, or consensual humiliation \u2014 can be among the most emotionally intense forms of kink. <b style="color:#9E4F2D">Aftercare</b> is especially important here.`,
        bg: C.sagePale, border: C.sage },
    ].map(c => <CategoryCard key={c.name} {...c} />)}
  </section>
)

// --- Section 5: Solo ----------------------------------------------------------
const S5 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s5" eyebrow="Starting point" title="Exploring solo first" />
    <p style={{ ...T.body, marginBottom: 16 }}>Solo exploration is exactly where to start. Not as a stepping stone to something else, but as a genuinely valuable stage in itself. One hour of honest private investigation will teach you more about what you actually respond to than months of tentative conversation.</p>
    <h2 style={T.h2}>1. Use fantasy as data</h2>
    <p style={{ ...T.body, marginBottom: 16 }}>What comes up repeatedly in your imagination, even when you're not trying? Recurring themes aren't labels or diagnoses {'\u2014'} they're information. Keep a private note somewhere. Don't judge, just observe.</p>
    <h2 style={T.h2}>2. Do the Yes / No / Maybe List</h2>
    <p style={{ ...T.body, marginBottom: 16 }}>A long list of kink activities rated privately: <strong>Yes</strong> (genuinely interested), <strong>No</strong> (not for me), <strong>Maybe</strong> (open to it with the right context). Search "kink checklist" or "yes no maybe list" for free templates.</p>
    <h2 style={T.h2}>3. Try low-stakes solo experiments</h2>
    <CalloutBox icon="feather" label="Solo experiments by category" bg={C.sagePale} border={C.sage}>
      {[
        ['Sensation play', 'Run an ice cube along your arm. Use a scarf as a blindfold while listening to music. Try soft vs. scratchy textures. Notice which sensations hold your attention.'],
        ['Temperature play', 'A warm flannel vs. ice. Low-temp soy candles exist specifically for wax play \u2014 test on your hand first.'],
        ['Restraint / stillness', 'Lie completely still for five minutes and notice the psychological response. Tells you whether stillness feels interesting or anxious.'],
        ['Fantasy & role framing', 'Try writing or voice-recording a scenario you find interesting. Articulating it \u2014 even privately \u2014 often clarifies what the actual draw is.'],
        ['Psychological dynamics', 'Notice how you respond to being told what to do vs. taking charge in everyday life. Quieter data, but it matters.'],
      ].map(([t, d]) => (
        <p key={t} style={{ margin: '0 0 8px' }}><strong>{t}</strong> {'\u2014'} {d}</p>
      ))}
    </CalloutBox>
    <h2 style={T.h2}>4. Read before you act</h2>
    <CalloutBox icon="book" label="Recommended reading" bg={C.goldPale} border={C.gold}>
      <p style={{ margin: '0 0 8px' }}><strong>The New Topping Book</strong> and <strong>The New Bottoming Book</strong> <em>by Dossie Easton &amp; Janet Hardy</em> {'\u2014'} Approachable, non-prescriptive, widely recommended. Start here. <A href="https://www.amazon.com/dp/1890159360">Amazon {'\u2192'}</A></p>
      <p style={{ margin: '0 0 8px' }}><strong>SM 101: A Realistic Introduction</strong> <em>by Jay Wiseman</em> {'\u2014'} Detailed, safety-focused, practical. <A href="https://www.amazon.com/dp/0963976389">Amazon {'\u2192'}</A></p>
      <p style={{ margin: 0 }}><strong>Playing Well with Others</strong> <em>by Lee Harrington &amp; Mollena Williams</em> {'\u2014'} Community, communication, navigating kink with other people. <A href="https://www.amazon.com/s?k=Playing+Well+with+Others+Harrington+Williams">Amazon {'\u2192'}</A></p>
    </CalloutBox>
  </section>
)

// --- Section 6: With a partner ------------------------------------------------
const S6 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s6" eyebrow="The next stage" title="When you're ready to involve someone else" />
    <CalloutBox label="Solo is complete in itself" bg={C.sagePale} border={C.sage}>
      <p style={{ margin: 0 }}>If you're not in a relationship right now, or if partnered exploration isn't on your radar, that's completely fine. Everything in Sections 5 and 9 is fully valid on its own. This section is here when and if you want it \u2014 not because it's the natural endpoint.</p>
    </CalloutBox>
    <p style={{ ...T.body, margin: '12px 0 16px' }}>Bringing kink into a relationship requires more explicit communication than most people are used to. That's not a drawback \u2014 it's exactly what makes it safe and actually good.</p>
    {[
      ['Negotiate before, not during', 'Consent in kink is established before anything begins, when everyone is clear-headed. Discuss what\'s in bounds, what isn\'t, what the safeword is, what aftercare looks like. This happens outside the bedroom, with normal voices.'],
      ['Start small, on purpose', 'One new thing at a time. Introducing a single restraint element, or agreeing on one small role-play scenario, is very different from building an elaborate dynamic. Escalation should always be explicit.'],
      ['Use a safeword, always', 'Even for mild exploration. Non-negotiable. The traffic light system works: Red = stop, Yellow = slow down. Agree on it before you start.'],
      ['Aftercare: don\'t skip it', 'Emotional and physical care following a scene. Both people need it \u2014 even the person who was \'in charge.\' Can be cuddling, water and snacks, quiet conversation. Discuss what each person needs before the scene.'],
      ['Debrief later', 'Hours later, or the next day \u2014 a relaxed conversation about what worked and what didn\'t. This is how good experiences get repeated and problems get caught early.'],
    ].map(([t, b], i) => <StepCard key={t} num={i+1} title={t} body={b} />)}
    <CalloutBox icon="warn" label="A heads-up: Sub Drop and Dom Drop" bg={C.amberPale} border={C.amber}>
      <p style={{ margin: '0 0 8px' }}><Term>Sub drop</Term> {'\u2014'} a crash in mood, energy, or emotional regulation that can happen hours or days after an intense scene. Caused by the drop-off of adrenaline, dopamine, and oxytocin.</p>
      <p style={{ margin: '0 0 8px' }}><Term>Dom drop</Term> {'\u2014'} the same phenomenon for the person in the guiding role. Often overlooked. They aren't unaffected.</p>
      <p style={{ margin: 0 }}>Both are completely normal. A follow-up check-in the next day is good practice when you're starting out.</p>
    </CalloutBox>
  </section>
)

// --- Section 7: Kink vs abuse -------------------------------------------------
const S7 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s7" eyebrow="Knowing the line" title="Kink vs. abuse: the clear difference" />
    <CalloutBox icon="shield" label="The core distinction" bg={C.terraPale} border={C.terra}>
      <p style={{ margin: '0 0 8px' }}><strong>Kink:</strong> control is consensually given for a negotiated period, by someone with full power to withdraw it at any moment.</p>
      <p style={{ margin: '0 0 8px' }}><strong>Abuse:</strong> control is taken non-consensually, or consent is manufactured through pressure, manipulation, or coercion.</p>
      <p style={{ margin: 0 }}>If your safeword is ignored {'\u2014'} that is abuse. If your limits are pushed without agreement {'\u2014'} that is abuse.</p>
    </CalloutBox>
    <h2 style={{ ...T.h2, color: C.terraDark }}>Red flags to watch for</h2>
    {[
      'Dismissing limits as "too uptight" or "you\'ll get used to it"',
      'Insisting there\'s a "true" way to be submissive that requires something you\'re uncomfortable with',
      'Using the Dominant role to justify decisions that affect you outside of negotiated play',
      'Making consent feel like a formality rather than a real, working mechanism',
      'Continuing after a safeword is used',
    ].map(f => (
      <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
        <span style={{ color: C.terra, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{'\u2022'}</span>
        <p style={{ ...T.small, margin: 0 }}>{f}</p>
      </div>
    ))}
  </section>
)

// --- Section 8: Community & resources ----------------------------------------
const S8 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s8" eyebrow="Next steps" title="Community & resources" />
    <p style={{ ...T.body, marginBottom: 16 }}>The single most useful thing you can do after reading this guide is walk into a physical space with knowledgeable people.</p>

    <h2 style={T.h2}>Start local: B.O.I.N.K. {'\u2014'} Holyoke, MA</h2>
    <CalloutBox label={<>B.O.I.N.K. {'\u2014'} 358 Dwight St, Holyoke, MA {'\u00B7'} <A href="https://boink-ed.com">boink-ed.com</A></>} bg={C.terraPale} border={C.terra}>
      <p style={{ margin: '0 0 8px' }}>B.O.I.N.K. (Boundless Orgasms In Newfound Knowledge) is a sex-positive education studio and community space in Holyoke. Their explicit mission: "from vanilla to the most unique kinks \u2014 we are here for every side of everyone."</p>
      <p style={{ margin: 0 }}>LGBTQ-certified, welcoming to all ages and experience levels, specifically designed for curious beginners. You don't need to know anyone to walk in.</p>
    </CalloutBox>

    <h2 style={T.h2}>BOINK classes that map to this guide</h2>
    {[
      { icon: 'flame',      title: 'Hands on Kink',                      href: 'https://boink-ed.com/event',       body: "BOINK's regular beginner entry class. General introduction to kink basics. The right first class if you're not sure where to start. Check events page for current dates.", bg: C.sagePale, border: C.sage },
      { icon: 'foot',       title: 'Sole Worship: Couples Massage',       href: 'https://boink-ed.com/event',       body: "Sensory and body-focused workshop covering massage technique and sensation. Low-barrier, beginner-appropriate. Appropriate whether you attend solo or with a partner.", bg: C.sagePale, border: C.sage },
      { icon: 'lock',       title: 'Rope 101 & 102 Class',                href: 'https://boink-ed.com/event',       body: "Covers safety, scene negotiation and consent, foundational knots, and specific ties. Exactly the progression this guide recommends before trying restraint with a partner. Book early; sells out.", bg: C.terraPale, border: C.terra },
      { icon: 'clipboard',  title: 'Anatomy of a Scene',                  href: 'https://boink-ed.com/event',       body: "Building, negotiating, and navigating kink with agency. Ideal to attend after completing the solo phase.", bg: C.sagePale, border: C.sage },
      { icon: 'beer',       title: 'BOINK Munch (monthly)',               href: 'https://boink-ed.com/event',       body: "Casual, completely non-sexual social gatherings. No dress code, no pressure, no play. The right first in-person step.", bg: C.sagePale, border: C.sage },
      { icon: 'microphone', title: 'Backdoor BOINK Podcast',              href: null,                               body: "BOINK's podcast covers kink education, community topics, and real conversations about sexuality. Search on Spotify.", bg: C.sagePale, border: C.sage },
      { icon: 'book',       title: 'On-Demand Classes',                   href: 'https://boink-ed.com/ondemand',    body: "BOINK offers on-demand educational videos you can watch at home, privately. A natural bridge between reading this guide and attending in person.", bg: C.sagePale, border: C.sage },
    ].map(({ href, title, ...rest }) => (
      <IconCard key={title} title={href ? <A href={href}>{title} {'\u2192'}</A> : title} {...rest} />
    ))}

    <h2 style={T.h2}>Online communities</h2>
    <IconCard icon="globe"  bg={C.sagePale} border={C.sage} title={<A href="https://fetlife.com">FetLife {'\u2192'}</A>} body="The largest kink social network. Not a hook-up site \u2014 primarily educational groups, event listings, and community discussion. Search for Western MA groups." />
    <IconCard icon="bubble" bg={C.sagePale} border={C.sage} title={<A href="https://reddit.com/r/BDSMAdvice">r/BDSMAdvice {'\u2192'}</A>} body="A moderated Reddit community with a high signal-to-noise ratio. Good for specific beginner questions in an anonymous format." />
    <IconCard icon="book"   bg={C.sagePale} border={C.sage} title={<A href="https://kinkly.com">Kinkly.com {'\u2192'}</A>} body="Extensive glossary and educational articles, well-organized for beginners. Useful reference alongside this guide." />

    <h2 style={T.h2}>Beginner-friendly podcasts</h2>
    <p style={{ ...T.small, marginBottom: 12 }}>Good for commutes, walks, or any time you want to absorb material privately.</p>
    <IconCard icon="microphone" bg={C.sagePale} border={C.sage} title={<A href="https://tinahorn.net/yapit">Why Are People Into That?! {'\u2192'}</A>} body="Journalist Tina Horn interviews practitioners about specific kinks in a curious, non-judgmental format. Each episode unpacks one topic from scratch." />
    <IconCard icon="microphone" bg={C.terraPale} border={C.terra} title={<A href="https://americansexpodcast.com">American Sex Podcast {'\u2192'}</A>} body="AASECT award-winning podcast hosted by certified sex educator Sunny Megatron. Strong on consent frameworks and communication." />
    <IconCard icon="microphone" bg={C.sagePale} border={C.sage} title={<A href="https://savage.love/lovecast/">Savage Lovecast {'\u2192'}</A>} body="Long-running advice podcast covering the full range of human sexuality including kink and BDSM. Free on Spotify and Apple Podcasts." />

    <h2 style={T.h2}>Professional support</h2>
    <p style={{ ...T.small, marginBottom: 12 }}>If exploring kink brings up unexpected emotional content {'\u2014'} shame, confusion, past experiences {'\u2014'} kink-aware therapists are available and genuinely helpful. BOINK also offers one-on-one intimacy coaching (<A href="https://boink-ed.com/services">boink-ed.com/services</A>).</p>
    <IconCard icon="person" bg={C.sagePale} border={C.sage} title={<A href="https://www.aasect.org/referral-directory">AASECT Referral Directory {'\u2192'}</A>} body="Certified sexuality educators, counselors, and therapists, searchable by location." />
    <IconCard icon="person" bg={C.sagePale} border={C.sage} title={<A href="https://www.kapprofessionals.org">Kink Aware Professionals (KAP) {'\u2192'}</A>} body="NCSF-maintained directory of therapists, medical professionals, and legal professionals." />
  </section>
)

// --- Section 9: Starting path -------------------------------------------------
const S9 = () => (
  <section style={{ padding: '8px 16px 16px' }}>
    <SectionBanner id="s9" eyebrow="Your first steps" title="A suggested starting path" />
    <p style={{ ...T.body, marginBottom: 16 }}>Steps 1{'\u2013'}5 are entirely solo. Steps 6{'\u2013'}7 only apply when you're ready to involve someone else. There's no timeline, and no requirement to reach the end.</p>
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.sage, margin: '0 0 10px' }}>SOLO PHASE {'\u2014'} steps 1 to 5</p>
    <StepCard num={1} title="Do the Yes / No / Maybe list" body="No audience, no pressure. Just you and a document. Be honest \u2014 nobody will see it. Search for free templates online; aim for a list with at least 50 items." />
    <StepCard num={2} title="Read at least one book" body="Before anything else. Start with The New Bottoming Book or The New Topping Book \u2014 whichever direction feels more natural to you." />
    <StepCard num={3} title="Try solo sensation experiments" body="Ice, a blindfold, texture contrast, stillness. The goal is to understand your own physical response before anyone else is involved. See Section 5." />
    <StepCard num={4} title="Write or record a private fantasy" body="Articulating something \u2014 even just for yourself \u2014 clarifies what the actual draw is. Not a commitment, not a plan. Just information." />
    <StepCard num={5} title="Browse community discussions" body="Read r/BDSMAdvice or FetLife groups without posting. Learn the vocabulary and how people actually talk about these things." />
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.terra, margin: '16px 0 10px' }}>WHEN YOU'RE READY \u2014 steps 6 and 7</p>
    <StepCard num={6} title="Have the conversation before any scene" body="Outside the bedroom, with normal voices. What do you each want to try? What are your limits? What's the safeword? What does aftercare look like?" />
    <StepCard num={7} title="Debrief afterward \u2014 then check in again the next day" body="What worked? What didn't? Sub drop and dom drop can arrive hours later \u2014 a follow-up check-in is good practice every time when you're starting out." />
    <CalloutBox label="If unexpected emotions come up at any stage" bg={C.sagePale} border={C.sage}>
      <p style={{ margin: 0 }}>That's normal, and it doesn't mean something went wrong. A kink-aware therapist from the AASECT or KAP directory is a legitimate resource, not an overreaction.</p>
    </CalloutBox>
    <BreatheBox
      quote="There's no destination here. Curiosity is the whole point."
      sub="You're not trying to arrive anywhere. Just understand yourself more honestly \u2014 and if you choose to share that with someone, do it safely and well."
    />
  </section>
)

// --- Section 10: Glossary -----------------------------------------------------
const GLOSSARY = [
  ['Aftercare', 'Emotional and physical care provided to all participants after a kink scene. Can include cuddling, water and snacks, quiet conversation, or simply being present together.'],
  ['BDSM', "An acronym for Bondage/Discipline, Dominance/Submission, and Sadism/Masochism. The most common cluster of kink activities."],
  ['Bottom', 'The person in the receptive or following role in a scene. Not necessarily permanent \u2014 many people switch roles.'],
  ['Bondage', 'Physical restraint as part of consensual play. Safety: never leave a restrained person alone; always have safety scissors within reach.'],
  ['Dominant (Dom / Domme)', 'The partner taking the active, guiding role in a scene. Not superior to the Submissive \u2014 just occupying a different role within a negotiated framework.'],
  ['Dom Drop', 'A crash in mood or emotional regulation experienced by the Dominant/Top after an intense scene. Treated the same way as Sub Drop.'],
  ['Hard Limit', 'An absolute, non-negotiable boundary. A hard limit is never pushed, argued with, or tested.'],
  ['Impact Play', 'Consensual striking \u2014 spanking, paddling, flogging, caning. Requires knowledge of safe and unsafe zones on the body.'],
  ['Kink', 'An umbrella term for sexual interests, practices, and fantasies outside conventional norms. BDSM is the most common subset.'],
  ['Munch', 'A casual, non-sexual social gathering for kink-curious and kink-identified people. The standard first step for in-person community.'],
  ['Negotiation', 'The explicit conversation that happens before any kink activity \u2014 covering limits, safewords, and aftercare. Non-optional.'],
  ['PRICK', 'Personal Responsibility, Informed Consensual Kink. A consent framework emphasizing individual ownership of research, limits, and safety.'],
  ['RACK', "Risk-Aware Consensual Kink. Acknowledges that some kink carries inherent risk, emphasizing informed agreement rather than assuming all risk can be eliminated."],
  ['Role-play', 'Acting out characters, scenarios, or power dynamics. Can be purely verbal, costumed, or elaborately staged.'],
  ['Safeword', 'A pre-agreed word or signal that immediately stops all play. Must be agreed upon before any scene begins.'],
  ['Scene', 'A defined play session with a beginning, middle, and end.'],
  ['Sensation Play', 'Kink activity centered on exploring physical sensation \u2014 temperature, texture, pressure. Highly accessible.'],
  ['Shibari', 'A Japanese rope bondage tradition emphasizing aesthetics, trust, and connection as much as restraint. Requires dedicated study to practice safely.'],
  ['Soft Limit', "A boundary that isn't absolute \u2014 something a person hesitates about but might consider under the right conditions."],
  ['SSC', 'Safe, Sane, and Consensual. All activity should be physically and emotionally safe, done with a clear mind, and fully agreed upon.'],
  ['Sub Drop', 'A crash in mood, energy, or emotional regulation after an intense scene. Caused by the drop-off of adrenaline, dopamine, and oxytocin.'],
  ['Submissive (Sub)', 'The partner in the receptive or following role. Holds genuine power \u2014 including the power to stop the scene at any moment.'],
  ['Switch', 'Someone who moves between Dominant/Top and Submissive/Bottom roles across different partners or scenes.'],
  ['Top', 'The partner in the active or giving role in a scene. Can be Dominant by temperament, or simply the person executing a technique.'],
  ['Vanilla', 'Conventional, non-kinky sexual activity. Not an insult \u2014 just a descriptor for the other end of the spectrum.'],
  ['Yes / No / Maybe List', 'A self-reflection tool: a long list of kink activities rated privately. Many free templates available online.'],
]

const S10 = () => {
  const [q, setQ] = useState('')
  const filtered = q.trim() ? GLOSSARY.filter(([t, d]) => (t + d).toLowerCase().includes(q.toLowerCase())) : GLOSSARY
  return (
    <section style={{ padding: '8px 16px 16px' }}>
      <SectionBanner id="s10" eyebrow="Reference" title="Glossary of Terms" />
      <p style={{ ...T.small, marginBottom: 12 }}>Every term that appears in bold throughout this guide is defined here.</p>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search terms\u2026"
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.sagePale}`, background: C.white, fontSize: 15, color: C.ink, boxSizing: 'border-box', marginBottom: 14, outline: 'none' }}
      />
      {filtered.map(([term, def]) => (
        <div key={term} style={{ borderBottom: `1px solid ${C.sagePale}`, paddingBottom: 12, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: C.terraDark, margin: '0 0 4px' }}>{term}</p>
          <p style={{ ...T.small, margin: 0, color: C.inkMid }}>{def}</p>
        </div>
      ))}
      {filtered.length === 0 && <p style={{ color: C.inkSoft, fontStyle: 'italic' }}>No terms match "{q}"</p>}
    </section>
  )
}

// --- Section 11: Further Resources -------------------------------------------
const S11 = () => (
  <section style={{ padding: '8px 16px 28px' }}>
    <SectionBanner id="s11" eyebrow="Reference" title="Further Resources" />
    {[
      { heading: 'Local \u2014 Western Massachusetts', items: [
        { name: 'B.O.I.N.K.', sub: '358 Dwight St, Holyoke, MA', href: 'https://boink-ed.com', desc: 'Sex-positive education studio. Workshops, classes, munches, coaching, on-demand content. Beginner-welcoming, LGBTQ-certified. Check boink-ed.com/event for current schedule.' },
        { name: 'Backdoor BOINK Podcast', sub: 'Search on Spotify', href: null, desc: "BOINK's podcast covering kink education and community topics." },
        { name: 'BOINK On-Demand Classes', sub: 'boink-ed.com/ondemand', href: 'https://boink-ed.com/ondemand', desc: 'Study-at-home video classes. A private, self-paced bridge between reading and attending in person.' },
      ]},
      { heading: 'Books', items: [
        { name: 'The New Topping Book', sub: 'Dossie Easton & Janet Hardy', href: 'https://www.amazon.com/dp/1890159360', desc: 'The most widely recommended starting point for understanding the guiding role in BDSM.' },
        { name: 'The New Bottoming Book', sub: 'Dossie Easton & Janet Hardy', href: 'https://www.amazon.com/dp/1890159352', desc: 'Companion volume covering the receptive role. Read both regardless of your inclination.' },
        { name: 'SM 101: A Realistic Introduction', sub: 'Jay Wiseman', href: 'https://www.amazon.com/dp/0963976389', desc: 'Safety-focused, practical, and detailed. Covers physical techniques and risk management.' },
        { name: 'Playing Well with Others', sub: 'Lee Harrington & Mollena Williams', href: 'https://www.amazon.com/s?k=Playing+Well+with+Others+Harrington+Williams', desc: 'Community navigation, communication, and building healthy kink relationships.' },
        { name: 'The Ultimate Guide to Kink', sub: 'Tristan Taormino (ed.)', href: 'https://www.amazon.com/s?k=Ultimate+Guide+to+Kink+Taormino', desc: 'Multi-contributor anthology \u2014 specific practices covered in depth by practitioners.' },
        { name: 'When Someone You Love Is Kinky', sub: 'Dossie Easton & Catherine Liszt', href: 'https://www.amazon.com/s?k=When+Someone+You+Love+Is+Kinky+Easton', desc: 'For partners and family members trying to understand a kinky person in their life.' },
      ]},
      { heading: 'Online Communities', items: [
        { name: 'FetLife', sub: 'fetlife.com', href: 'https://fetlife.com', desc: 'The largest kink social network. Browse community groups and local Western MA event listings.' },
        { name: 'r/BDSMAdvice', sub: 'reddit.com/r/BDSMAdvice', href: 'https://reddit.com/r/BDSMAdvice', desc: 'Moderated and beginner-friendly. Good for specific questions.' },
        { name: 'Kinkly Glossary', sub: 'kinkly.com', href: 'https://kinkly.com', desc: 'Extensive A-Z dictionary of kink terms \u2014 useful reference alongside this guide.' },
        { name: 'NCSF', sub: 'ncsfreedom.org', href: 'https://ncsfreedom.org', desc: 'National Coalition for Sexual Freedom. Advocacy, legal resources, community support.' },
      ]},
      { heading: 'Podcasts', items: [
        { name: 'Why Are People Into That?!', sub: 'Hosted by Tina Horn', href: 'https://tinahorn.net/yapit', desc: 'Journalist Tina Horn interviews practitioners in depth. Curious, non-judgmental. Spotify, Apple Podcasts, all major platforms.' },
        { name: 'American Sex Podcast', sub: 'Hosted by Sunny Megatron', href: 'https://americansexpodcast.com', desc: 'AASECT award-winning podcast. Strong on consent, communication, and BDSM education.' },
        { name: 'Savage Lovecast', sub: 'Hosted by Dan Savage', href: 'https://savage.love/lovecast/', desc: 'Long-running advice podcast. Free episodes on Spotify and Apple Podcasts; extended version at savage.love.' },
        { name: 'Backdoor BOINK', sub: "BOINK's podcast \u2014 search on Spotify", href: null, desc: 'Local Western MA podcast from the BOINK studio team. Good before your first in-person visit.' },
      ]},
      { heading: 'Professional Support', items: [
        { name: 'AASECT Referral Directory', sub: 'aasect.org/referral-directory', href: 'https://www.aasect.org/referral-directory', desc: 'Find certified sexuality educators, counselors, and therapists by location.' },
        { name: 'Kink Aware Professionals (KAP)', sub: 'kapprofessionals.org', href: 'https://www.kapprofessionals.org', desc: 'NCSF directory of therapists, medical professionals, and legal professionals.' },
        { name: 'BOINK Intimacy Coaching', sub: 'boink-ed.com/services', href: 'https://boink-ed.com/services', desc: "One-on-one coaching sessions with BOINK's certified intimacy coaches. Bookable online." },
      ]},
    ].map(({ heading, items }) => (
      <div key={heading} style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: 700, fontSize: 13, color: C.terraDark, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px', paddingTop: 8, borderTop: `1px solid ${C.sagePale}` }}>{heading}</p>
        {items.map(({ name, sub, href, desc }) => (
          <div key={name} style={{ marginBottom: 10 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.ink, margin: '0 0 2px' }}>{name}</p>
            <p style={{ fontSize: 13, fontStyle: 'italic', color: C.inkMid, margin: '0 0 2px' }}>{href ? <A href={href}>{sub}</A> : sub}</p>
            <p style={{ fontSize: 13, color: C.ink, margin: 0, lineHeight: 1.4 }}>{desc}</p>
          </div>
        ))}
      </div>
    ))}
    <div style={{ borderTop: `1px solid ${C.sagePale}`, paddingTop: 16, marginTop: 8, textAlign: 'center' }}>
      <p style={{ fontSize: 13, fontStyle: 'italic', color: C.inkMid, margin: '0 0 4px', lineHeight: 1.5 }}>This guide was prepared as an educational overview for curious adults. It does not constitute professional therapeutic or medical advice.</p>
      <p style={{ fontSize: 12, color: C.inkSoft, margin: 0 }}>V008 {'\u00B7'} 20260327 {'\u00B7'} Web edition</p>
    </div>
  </section>
)

// --- Main export --------------------------------------------------------------
export default function KinkGuide() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', maxWidth: 640, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', color: C.ink }}>
      <Cover />
      <NavBar />
      <main>
        <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 /><S11 />
      </main>
    </div>
  )
}
