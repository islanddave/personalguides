---
session: cowork-web-deploy
title: kink guide web deploy
project: Personal Guides
created: 2026-03-27T20:00:00Z
summary: Kink guide V008 PDF complete. JSX web version built but broken. Deploy to Netlify via git pipeline — may need scaffolding + walkthrough.
status: active
---

## State

PDF (final, web-ready version):
- Version: V008 · 20260327
- Script: /Users/davenichols/AI/Claude/Personal Guides/kink_guide_pdf.py
- Run in Claude sandbox: python3 kink_guide_pdf.py → outputs to /mnt/user-data/outputs/

Web component (JSX — BROKEN, displays nothing):
- /Users/davenichols/AI/Claude/Personal Guides/kink-guide.jsx
- This is the first attempt. It was generated in a Claude chat session and has NOT been tested in a real React environment. It renders nothing. Do not use as-is. Needs diagnosis and fix before deploy.

Git repo (bare, needs scaffold):
- /Users/davenichols/AI/Claude/Personal Guides/
- Has .git, README.md, index.html (empty), kink_guide_pdf.py, kink-guide.jsx, /handoffs/
- No package.json, no Vite config, no build tooling yet
- Pipeline: Git → GitHub → Netlify (already set up from other projects — Dave knows this flow)

## Project brief

Dave built a "A Beginner's Guide to Kink" — a 19-page PDF guide targeted at a vanilla woman, ~49, Western Massachusetts, newly curious, no prior kink knowledge. It's been through 8 versions of polish.

Goal: two deliverables
1. PDF (V008) — done, final
2. Mobile-friendly web version — same content, responsive, deployable as PWA or at minimum a hosted mobile-first web page via the existing Git/GitHub/Netlify pipeline

The JSX component approach was chosen because Dave can host React pages himself via git push. No manual file export or copy-paste — everything should go from Claude-generated asset → committed to git → auto-deployed on Netlify.

Dave may be rusty on the pipeline steps and may want a walkthrough. Ideally the steps get documented so future projects can reuse the same flow without rebuilding from memory.

## What needs to happen in this Cowork session

Priority 1 — Fix the broken JSX component
- Diagnose why kink-guide.jsx renders nothing (likely: missing React import style, JSX transform issue, or component not mounted correctly in a bare index.html)
- The component itself is a single-file React component with all inline styles, no external CSS, no Tailwind. Content is all hardcoded. Should be self-contained once the scaffold is right.

Priority 2 — Scaffold the React project
- Add package.json, vite.config.js, index.html (proper), main.jsx entrypoint
- Make it deployable as a static site (Vite build → /dist)
- Optionally: add PWA manifest + service worker for installability on mobile

Priority 3 — Deploy pipeline
- Commit to GitHub repo
- Connect to Netlify (or verify existing connection)
- Push → auto-deploys
- Document the steps in a reusable reference so Dave can repeat this for future guides without help

Priority 4 — Save deployment steps to a file in the repo
- Create DEPLOY.md or similar in the Personal Guides folder
- Covers: scaffold once, then for future guides just add a new .jsx file + route

## Content summary (so Cowork doesn't need the PDF or chat history)

The kink guide has 11 sections:
1. Myths first (5 myth-busting cards)
2. What is kink? + BDSM definition
3. Consent frameworks (SSC, RACK, PRICK) + hard/soft limits + safewords + traffic light system
4. Categories at a glance (9 category cards: Power Exchange, Bondage, Sensation Play, Impact Play, Role-play, Voyeurism, Fetishes, Temperature Play, Psychological/Verbal)
5. Solo exploration (4 sub-sections: fantasy as data, yes/no/maybe list, solo experiments, recommended reading)
6. With a partner (5 step cards + sub drop/dom drop callout)
7. Kink vs. abuse (core distinction + red flags)
8. Community & resources (BOINK Holyoke MA, classes, online communities, podcasts, professional support)
9. Starting path (7 step cards, solo phase + partner-ready phase)
10. Glossary (26 terms, searchable in web version)
11. Further Resources (local, books, online, podcasts, professional)

Design: cream/sage/terra/gold palette. All inline styles in JSX. SVG icons (no external icon library).

## Known issues with kink-guide.jsx

1. Component renders nothing in a bare HTML context — likely needs a proper React root mount (main.jsx + index.html) rather than just dropping the .jsx file in a folder
2. SVG icon definitions use JSX syntax inside an object literal — this works fine in a proper JSX compiler but will fail if the file is loaded as plain JS
3. Sections use dangerouslySetInnerHTML for inline bold/italic — verify this is safe (it is, content is hardcoded not user-generated)
4. No error boundary — if one section throws, whole page goes blank
5. Should be tested at 375px (iPhone SE) and 390px (iPhone 14) viewport widths

## Asset upload option

If it saves time, Dave can upload:
- V008 PDF (for reference / to show Cowork what we're trying to match)
- kink-guide.jsx (current broken version, for Cowork to diagnose)

Dave has these files locally. He can drag them into the Cowork session.

## Deployment pipeline (what we know)

Dave has done this before with other projects (Claude Helper Portal lives at /Users/davenichols/AI/Claude/Instructions/ and is deployed via Netlify). The pattern is:
- Write files locally (via Claude filesystem MCP or manually)
- git add / commit / push to GitHub
- Netlify watches the branch and auto-deploys

For this project:
- Repo: /Users/davenichols/AI/Claude/Personal Guides/ (already a git repo)
- Needs: GitHub remote set up (may already exist — check with git remote -v)
- Netlify: needs to point at this repo if not already connected

The goal is to make the whole cycle — idea in Claude → web hosted page — happen without copy-paste, file export/download, or manual steps beyond a git push. Claude in Cowork has filesystem MCP access and can write files directly to the Mac, so Claude can write the scaffold files to disk, Dave commits and pushes.

## Landmines

- The Personal Guides git repo may not have a GitHub remote yet. Check before assuming it does.
- Dave's Claude Helper Portal (Instructions/) uses plain HTML not React — don't confuse the two repos.
- kink-guide.jsx uses JSX object syntax for icons: `const icons = { check: <svg>...</svg> }` — this is valid JSX but requires a JSX-aware bundler (Vite is fine, bare browser is not).
- Vite dev server default port is 5173. If something else is on that port, it'll fail silently or prompt for another port.
- Netlify free tier: build command = `npm run build`, publish directory = `dist`. If vite.config.js sets a different base path, Netlify routing may break.
- PWA service worker caching can cause stale deploys. If going PWA, add a version string to the service worker registration.

## Thread dependencies

- kink guide podcast rev (integrated): the Claude chat session that produced V008 PDF and kink-guide.jsx. That thread is closed. All relevant files are on disk.
- Claude Helper Portal (Instructions/): separate project, same Netlify account. Don't merge.
