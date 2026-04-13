import React, { useState } from 'react'

const P = {
  cream: '#f8f5f0',
  green: '#2d6a4f',
  greenLight: '#52b788',
  terra: '#b7532a',
  gold: '#c9a84c',
  dark: '#1a1a1a',
  mid: '#4a4a4a',
  light: '#777',
  border: '#d4c9be',
  warn: '#fff8e6',
  warnBorder: '#c9a84c',
  alert: '#fde8e0',
  alertBorder: '#b7532a',
  purple: '#7b5ea7',
  blue: '#4a7fb5',
  brown: '#7a5c3c',
}

const ITEMS = [
  {
    id: 1, tag: 'Structure', tagColor: P.green,
    name: '4-Tier Chrome Wire Rack (48"\u00d724"\u00d772")',
    note: 'Foundation of the whole setup. 24" depth fits two 10\u00d720 trays deep per shelf \u2014 do not get the 18" version.',
    qty: '\u00d71', est: '$85\u2013100',
    url: 'https://www.amazon.com/Trinity-4-Tier-Black-Wire-Shelving/dp/B00NPRBR6G',
  },
  {
    id: 2, tag: 'Lighting', tagColor: P.purple,
    name: 'Barrina T5 LED Grow Lights 4ft (4-bar set)',
    note: 'Buy 2 sets. Zip-tie 2 bars to the underside of each shelf. Run 14\u201316 hrs/day on a timer. Keep 2\u20134" above plant tops.',
    qty: '\u00d72 sets', est: '$60\u201375 each',
    url: 'https://www.amazon.com/Barrina-Spectrum-Equivalent-Lights-Greenhouse/dp/B08CV1KXVT',
  },
  {
    id: 3, tag: 'Lighting', tagColor: P.purple,
    name: 'Mechanical Outlet Timer',
    note: 'One per light circuit. Set to 14\u201316 hrs on, 8\u201310 hrs off. Consistency matters more than intensity.',
    qty: '\u00d72', est: '$8\u201312 each',
    url: 'https://www.amazon.com/Grow1-Single-Outlet-Mechanical-Timer/dp/B0057R2UCC',
  },
  {
    id: 4, tag: 'Heat', tagColor: P.terra,
    name: 'VIVOSUN 10\u00d720 Seedling Heat Mat',
    note: 'Peppers germinate best at 80\u201385\u00b0F. Two mats let you run peppers and strawberries simultaneously without waiting.',
    qty: '\u00d72', est: '$20\u201325 each',
    url: 'https://www.amazon.com/VIVOSUN-Seedling-Digital-Thermostat-Standard/dp/B016MKY7C8',
  },
  {
    id: 5, tag: 'Heat', tagColor: P.terra,
    name: 'Inkbird Thermostat Controller',
    note: 'Set to 82\u00b0F. Without a thermostat, mats overshoot and kill germination. Non-negotiable at this scale.',
    qty: '\u00d72', est: '$18\u201325 each',
    url: 'https://www.amazon.com/Inkbird-Electronic-Temperature-Germination-Controlling/dp/B01486LZ50',
  },
  {
    id: 6, tag: 'Containers', tagColor: P.green,
    name: '72-Cell Plug Trays + Solid Water Tray (10\u00d720)',
    note: 'Start seeds here. Move to solo cups after 2\u20133 sets of true leaves. Solid water tray goes underneath.',
    qty: '\u00d74', est: '$25\u201335 per 2-pack',
    url: 'https://www.amazon.com/Seed-Starter-Cell-Extra-Strength/dp/B01KTO6G5E',
  },
  {
    id: 7, tag: 'Containers', tagColor: P.green,
    name: 'Solo Cups 18oz (100-ct)',
    note: 'Poke 3\u20134 drainage holes in the bottom. Perfect pot-up vessel before transplanting to final containers.',
    qty: '\u00d71 pack', est: '$8\u201312',
    url: 'https://www.amazon.com/s?k=red+solo+cups+18+oz+100+count',
  },
  {
    id: 8, tag: 'Soil', tagColor: P.brown,
    name: 'Espoma Organic Seed Starter Mix (16 qt)',
    note: 'Do not use regular potting soil in cells \u2014 too dense, holds too much water, seedlings damp off. Get 2 bags.',
    qty: '\u00d72 bags', est: '$12\u201315 each',
    url: 'https://www.amazon.com/Espoma-SS16-16-Quart-Organic-Starter/dp/B0046VHU1G',
  },
  {
    id: 9, tag: 'Containers', tagColor: P.green, note2: 'Have Some',
    name: 'Jiffy Peat Pots 2" (50-ct)',
    note: 'You already have some \u2014 grab one refill pack. Sow 2 seeds per pot, thin to the strongest seedling.',
    qty: '\u00d71 pack', est: '$8\u201312',
    url: 'https://www.amazon.com/Jiffy-Peat-Pot-Strip-Sheets/dp/B076QLRVWL',
  },
  {
    id: 10, tag: 'Airflow', tagColor: P.blue,
    name: 'Clip-On Fan (6")',
    note: 'Oscillate gently across the shelves. Prevents damping off and strengthens stems. Do not blast directly at seedlings.',
    qty: '\u00d71', est: '$15\u201320',
    url: 'https://www.amazon.com/VIVOSUN-6Inches-Portable-2-Speed-Adjustable/dp/B07H3M2DHY',
  },
  {
    id: 11, tag: 'Fertilizer', tagColor: P.gold,
    name: 'Fox Farm Grow Big Liquid Fertilizer (1 pt)',
    note: 'Start at 1/4 strength after first true leaves, move to 1/2 strength after the second set. Once weekly.',
    qty: '\u00d71', est: '$10\u201314',
    url: 'https://www.amazon.com/FoxFarm-Liquid-Fertilizer-Quart-Bottle/dp/B07JJ81BYM',
  },
  {
    id: 12, tag: 'Other', tagColor: P.mid,
    name: 'Plastic Plant Labels (300-ct + marker)',
    note: 'Label every tray by variety at sowing time. You will mix them up otherwise \u2014 guaranteed.',
    qty: '\u00d71', est: '$7\u201310',
    url: 'https://www.amazon.com/Plastic-Seedlings-Markers-Nursery-Permanet/dp/B0BJD69ZNB',
  },
]

const SHELF = [
  { tier: 'Tier 4 \u2014 Top', label: 'Storage / Strawberries', bg: '#f0f0f0', border: '#ccc',
    detail: 'Supplies, extra soil, spray bottles. Or use for strawberries if a window is nearby \u2014 they tolerate lower light than peppers.' },
  { tier: 'Tier 3', label: 'Grow-Out: Solo Cups', bg: '#e8f5e9', border: '#52b788',
    detail: '4 trays of solo-cup peppers (weeks 4\u20136). 2 Barrina bars zip-tied to the underside of Tier 4 above. Fan positioned to sweep across this level.' },
  { tier: 'Tier 2', label: 'Grow-Out: Seedlings', bg: '#e8f5e9', border: '#52b788',
    detail: 'Cell trays of established seedlings (weeks 2\u20134). 2 Barrina bars zip-tied to the underside of Tier 3 above.' },
  { tier: 'Tier 1 \u2014 Bottom', label: 'Germination Station', bg: '#fde8e0', border: '#b7532a',
    detail: '1\u20132 cell trays on heat mats (thermostat at 82\u00b0F). 2 Barrina bars zip-tied to Tier 2 underside. Plastic wrap over trays until sprouts emerge. Once sprouted, trays move up \u2014 next seed batch comes in.' },
]

const TIMELINE = [
  { week: 'Now \u2014 Wk 1\u20132', label: 'Sow & Germinate', color: '#b7532a',
    steps: ['Soak seeds 12\u201324 hrs in warm water before planting', 'Sow 2 seeds per cell, 1/4" deep \u2014 cover lightly', 'Heat mat on (82\u00b0F via thermostat), plastic wrap over trays', 'Lights on 14\u201316 hrs/day from day one', 'Mist to keep moist \u2014 never let dry out, never waterlog'] },
  { week: 'Wk 2\u20133', label: 'Sprouts Emerge', color: '#2d6a4f',
    steps: ['Remove plastic wrap once 50%+ have sprouted', 'Thin to 1 seedling per cell \u2014 snip, do not pull', 'Keep lights 2\u20134" above seedling tops', 'Fan on low \u2013 gentle air movement only', 'No fertilizer yet \u2014 seed leaves need no feeding'] },
  { week: 'Wk 3\u20135', label: 'True Leaf Growth', color: '#2d6a4f',
    steps: ['First true leaves appear (not the seed leaves)', 'Begin fertilizer at 1/4 strength, once/week', 'Pot up to solo cups when roots fill the cell', 'Bottom-water solo cups \u2014 pour into tray, let absorb'] },
  { week: 'Wk 5\u20136', label: 'Grow-Out', color: '#52b788',
    steps: ['Plants bushing out in solo cups', 'Fertilize at 1/2 strength once/week', 'Increase fan airflow as canopy fills in', 'Lights still 14\u201316 hrs/day'] },
  { week: 'Wk 6\u20137', label: 'Harden Off', color: '#7b5ea7',
    steps: ['Day 1\u20132: 1 hr outside in shade, then back in', 'Day 3\u20134: 2\u20133 hrs, partial sun', 'Day 5\u20137: Half day, more direct sun', 'Day 8\u201310: Full day outdoors', 'Bring in any night temps below 50\u00b0F', 'Do NOT skip hardening \u2014 skipping causes sunscald and weeks of stall'] },
  { week: 'Late May+', label: 'Transplant', color: '#c9a84c',
    steps: ['Pioneer Valley (Springfield/Northampton): after May 10\u201315', 'Berkshires: after May 20\u2013June 1', 'Peppers need consistent 60\u00b0F+ nights', 'Use row cover if late frost threatens', 'Minimum 5-gallon container or in-ground'] },
]

const TIPS = [
  { icon: '\ud83c\udf21\ufe0f', title: 'Heat Mat + Thermostat',
    body: 'Set thermostat to 82\u00b0F. Without it, mats run too hot (90\u00b0F+ kills germination) or too cold. Once a batch sprouts and moves up, the mat stays on Tier 1 for the next round. Two mats let you run peppers and others at the same time.' },
  { icon: '\ud83d\udca7', title: 'Watering Rules',
    body: 'Mist seeds in cells. Bottom-water solo cups (pour into the solid tray below and let it absorb). Never let seedlings sit in standing water more than 1 hour. Never let the mix dry out completely. Inconsistent moisture = damping off or root stress.' },
  { icon: '\ud83c\udf31', title: 'Seed Prep',
    body: 'Soak seeds in warm (not hot) water for 12\u201324 hrs before planting. Speeds germination by 3\u20135 days. Discard any seeds that are still floating after the first hour \u2014 they\'re likely not viable.' },
  { icon: '\ud83d\udca8', title: 'Airflow Is Non-Negotiable',
    body: '60+ plants on a warm, humid shelf stack = damping off risk. A gentle oscillating fan prevents it and builds strong, thick stems. Don\'t blast \u2014 just keep air moving across the canopy.' },
  { icon: '\u2600\ufe0f', title: 'Hardening Off',
    body: '7\u201310 days of graduated outdoor exposure before transplanting. Start with 1\u20132 hrs of shade. Add time and sun daily. Bring in any night below 50\u00b0F. Peppers moved straight from indoor lights to full sun will sunscald and lose 2\u20133 weeks of growth.' },
  { icon: '\ud83c\udf53', title: 'Strawberries',
    body: 'From seed = very slow, requires cold stratification first, needs a separate growing track. From runners or bare-root crowns = easy and compatible with this setup. Put them on the top shelf or near a south window. Clarify which you have before planting.' },
]

const Tab = ({ id, label, active, onClick }) => (
  React.createElement('button', {
    onClick: () => onClick(id),
    style: {
      padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer',
      fontSize: 13, fontWeight: active ? 700 : 400,
      color: active ? '#2d6a4f' : '#4a4a4a',
      borderBottom: active ? '3px solid #2d6a4f' : '3px solid transparent',
      whiteSpace: 'nowrap',
    }
  }, label)
)

export default function PeppersGuide() {
  const [tab, setTab] = useState('list')

  return (
    React.createElement('div', { style: { fontFamily: 'system-ui,-apple-system,sans-serif', background: '#f8f5f0', minHeight: '100vh', color: '#1a1a1a' } },

      React.createElement('div', { style: { background: '#2d6a4f', color: 'white', padding: '22px 20px 18px' } },
        React.createElement('div', { style: { maxWidth: 680, margin: '0 auto' } },
          React.createElement('div', { style: { fontSize: 12, opacity: 0.75, marginBottom: 3, letterSpacing: 0.5 } }, '\ud83c\udf36 SEED STARTER GUIDE'),
          React.createElement('h1', { style: { margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px' } }, 'Pepper Starter Kit'),
          React.createElement('p', { style: { margin: '6px 0 0', opacity: 0.85, fontSize: 13 } }, 'Western Massachusetts \u00b7 5 dozen plants \u00b7 Budget-optimized')
        )
      ),

      React.createElement('div', { style: { background: '#fde8e0', borderBottom: '3px solid #b7532a', padding: '11px 20px' } },
        React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', fontSize: 13, lineHeight: 1.5 } },
          React.createElement('strong', null, '\u26a0\ufe0f You\'re 4\u20136 weeks behind ideal.'),
          ' Ideal start in western MA is early March. Plants will be smaller at transplant \u2014 that\'s manageable. Harden carefully, keep row cover handy, consider a few nursery starts as backup.'
        )
      ),

      React.createElement('div', { style: { borderBottom: '1px solid #d4c9be', background: 'white', position: 'sticky', top: 0, zIndex: 10, overflowX: 'auto' } },
        React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', display: 'flex' } },
          React.createElement(Tab, { id: 'list', label: '\ud83d\uded2 Shopping List', active: tab === 'list', onClick: setTab }),
          React.createElement(Tab, { id: 'setup', label: '\ud83d\udcd0 Shelf Setup', active: tab === 'setup', onClick: setTab }),
          React.createElement(Tab, { id: 'timeline', label: '\ud83d\udcc5 Timeline', active: tab === 'timeline', onClick: setTab }),
          React.createElement(Tab, { id: 'tips', label: '\ud83d\udca1 Key Tips', active: tab === 'tips', onClick: setTab })
        )
      ),

      React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', padding: '18px 16px 60px' } },

        tab === 'list' && React.createElement('div', null,
          React.createElement('p', { style: { fontSize: 13, color: '#4a4a4a', margin: '0 0 14px' } }, 'Tap any item to open on Amazon. Verify product specs before purchasing \u2014 links are best-matched but Amazon listings change.'),
          ...ITEMS.map(item =>
            React.createElement('a', { key: item.id, href: item.url, target: '_blank', rel: 'noopener noreferrer', style: { textDecoration: 'none', color: 'inherit', display: 'block' } },
              React.createElement('div', { style: { background: 'white', borderRadius: 10, padding: '13px 15px', marginBottom: 9, border: '1px solid #d4c9be', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } },
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 } },
                  React.createElement('div', { style: { flex: 1 } },
                    React.createElement('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 5 } },
                      React.createElement('span', { style: { background: item.tagColor, color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 } }, item.tag),
                      item.note2 && React.createElement('span', { style: { background: '#e8f5e9', color: '#2d6a4f', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 } }, item.note2)
                    ),
                    React.createElement('div', { style: { fontWeight: 600, fontSize: 14, marginBottom: 3 } }, item.name),
                    React.createElement('div', { style: { fontSize: 12, color: '#4a4a4a', lineHeight: 1.5 } }, item.note)
                  ),
                  React.createElement('div', { style: { textAlign: 'right', flexShrink: 0 } },
                    React.createElement('div', { style: { fontSize: 12, color: '#777' } }, item.qty),
                    React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: '#2d6a4f' } }, item.est),
                    React.createElement('div', { style: { fontSize: 11, color: '#aaa', marginTop: 2 } }, '\u2192 Amazon')
                  )
                )
              )
            )
          ),
          React.createElement('div', { style: { background: '#2d6a4f', color: 'white', borderRadius: 10, padding: '15px 16px', marginTop: 4 } },
            React.createElement('div', { style: { fontSize: 12, opacity: 0.85 } }, 'Estimated total'),
            React.createElement('div', { style: { fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' } }, '$315\u2013340'),
            React.createElement('div', { style: { fontSize: 12, opacity: 0.75, marginTop: 3 } }, 'Rack and lights are multi-season investments. Year two cost drops to soil + cups + seeds.')
          )
        ),

        tab === 'setup' && React.createElement('div', null,
          React.createElement('h2', { style: { fontSize: 17, margin: '0 0 6pk', color: '#2d6a4f' } }, '4-Tier Wire Rack Layout'),
          React.createElement('p', { style: { fontSize: 13, color: '#4a4a4a', marginBottom: 14, lineHeight: 1.5 } }, '48"\u00d724"\u00d772" chrome wire rack. Each shelf holds 4 standard 10\u00d720 trays (two across, two deep on the 24" depth). Barrina bars mount to the underside of the shelf above.'),
          ...SHELF.map(s =>
            React.createElement('div', { key: s.tier, style: { background: s.bg, border: '1px solid ' + s.border, borderRadius: 10, padding: '13px 15px', marginBottom: 10 } },
              React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 } }, s.tier),
              React.createElement('div', { style: { fontWeight: 700, fontSize: 15, marginBottom: 4 } }, s.label),
              React.createElement('div', { style: { fontSize: 13, color: '#4a4a4a', lineHeight: 1.5 } }, s.detail)
            )
          ),
          React.createElement('div', { style: { background: '#fff8e6', border: '1px solid #c9a84c', borderRadius: 10, padding: 13, marginTop: 4, fontSize: 13, lineHeight: 1.5 } },
            React.createElement('strong', null, 'Light mounting:'),
            ' Zip-tie Barrina bars to the underside of the shelf directly above each growing tier. Keep bars 2\u20134" above plant tops. Re-zip higher as plants grow. Use ratchet hangers (~$8) if you want easier height adjustment.'
          )
        ),

        tab === 'timeline' && React.createElement('div', null,
          React.createElement('h2', { style: { fontSize: 17, margin: '0 0 3px', color: '#2d6a4f' } }, 'Week-by-Week Plan'),
          React.createElement('p', { style: { fontSize: 13, color: '#4a4a4a', marginBottom: 14 } }, 'Starting today \u00b7 Target: late May transplant to western MA garden'),
          ...TIMELINE.map(t =>
            React.createElement('div', { key: t.week, style: { marginBottom: 13 } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
                React.createElement('span', { style: { background: t.color, color: 'white', borderRadius: 20, padding: '3px 11px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' } }, t.week),
                React.createElement('span', { style: { fontWeight: 700, fontSize: 14 } }, t.label)
              ),
              React.createElement('div', { style: { background: 'white', border: '1px solid #d4c9be', borderRadius: 10, padding: '11px 14px' } },
                ...t.steps.map((s, i) =>
                  React.createElement('div', { key: i, style: { display: 'flex', gap: 8, marginBottom: i < t.steps.length - 1 ? 6 : 0, fontSize: 13, color: '#4a4a4a', lineHeight: 1.4 } },
                    React.createElement('span', { style: { color: t.color, flexShrink: 0, fontWeight: 700 } }, '\u203a'),
                    React.createElement('span', null, s)
                  )
                )
              )
            )
          )
        ),

        tab === 'tips' && React.createElement('div', null,
          ...TIPS.map(t =>
            React.createElement('div', { key: t.title, style: { background: 'white', border: '1px solid #d4c9be', borderRadius: 10, padding: '13px 15px', marginBottom: 10 } },
              React.createElement('div', { style: { display: 'flex', gap: 11, alignItems: 'flex-start' } },
                React.createElement('span', { style: { fontSize: 22, flexShrink: 0, lineHeight: 1 } }, t.icon),
                React.createElement('div', null,
                  React.createElement('div', { style: { fontWeight: 700, fontSize: 14, marginBottom: 4 } }, t.title),
                  React.createElement('div', { style: { fontSize: 13, color: '#4a4a4a', lineHeight: 1.6 } }, t.body)
                )
              )
            )
          )
        )
      )
    )
  )
}
