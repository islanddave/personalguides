# Deploy Guide — Personal Guides → Web

Reusable pipeline: Claude-generated JSX → Git → GitHub → Netlify → live mobile-friendly page.

## One-time setup (already done for this repo)

1. **Scaffold exists.** The repo has Vite + React configured:
   - `package.json` — dependencies and build scripts
   - `vite.config.js` — Vite with React plugin, outputs to `dist/`
   - `index.html` — HTML shell with `<div id="root">` and module script
   - `src/main.jsx` — React root mount + service worker registration
   - `public/manifest.json` — PWA manifest (edit name/description per guide)
   - `public/sw.js` — basic cache-first service worker

2. **Install dependencies** (first time or after cloning):
   ```
   cd ~/AI/Claude/Personal\ Guides
   npm install
   ```

3. **GitHub remote.** Create a repo on GitHub and add the remote:
   ```
   git remote add origin git@github.com:YOUR_USERNAME/personal-guides.git
   git push -u origin main
   ```

4. **Netlify.** Connect the GitHub repo in Netlify dashboard:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Branch: `main`

## Adding a new guide

1. **Claude generates the JSX** — a single-file React component with all inline styles and a default export.

2. **Save it to `src/`** — Claude writes it via filesystem MCP, or you copy it manually:
   ```
   src/my-new-guide.jsx
   ```

3. **Update `src/main.jsx`** to import the new component:
   ```jsx
   import MyNewGuide from './my-new-guide.jsx'
   ```
   For multiple guides, add a simple router or swap the component.

4. **Test locally:**
   ```
   npm run dev
   ```
   Opens at http://localhost:5173 — check on desktop and mobile viewports (375px, 390px).

5. **Commit and push:**
   ```
   git add -A
   git commit -m "Add my-new-guide"
   git push
   ```

6. **Netlify auto-deploys.** Live in ~30 seconds.

## Mobile testing

- Open the Netlify URL on your phone
- Tap "Add to Home Screen" (Safari) or the install prompt (Chrome) for PWA mode
- The service worker caches the page for offline use

## Updating the service worker

If you deploy an update and phones show stale content, bump the `CACHE_NAME` version string in `public/sw.js`:
```js
const CACHE_NAME = 'kink-guide-v2'  // was v1
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank page on Netlify | Check Netlify build logs. Ensure build command is `npm run build` and publish dir is `dist` |
| Works locally, blank on deploy | Check `vite.config.js` doesn't set a `base` path that conflicts with Netlify |
| Port 5173 in use | Kill the other process or run `npm run dev -- --port 3000` |
| Phone shows old version | Bump `CACHE_NAME` in `sw.js`, push, hard-refresh on phone |
| PWA won't install | Need HTTPS (Netlify provides this) and valid icons in `public/` |

## PWA icons

The manifest references `icon-192.png` and `icon-512.png` in `public/`. You can generate these from any square image using an online tool or:
```
npx pwa-asset-generator logo.png public/ --icon-only --type png
```
Until real icons are added, the PWA install prompt won't appear, but the site still works fine as a regular web page.

## File structure

```
Personal Guides/
├── index.html          ← HTML shell (Vite entry point)
├── package.json        ← deps + scripts
├── vite.config.js      ← Vite config
├── .gitignore          ← ignores node_modules/, dist/
├── DEPLOY.md           ← this file
├── README.md
├── kink_guide_pdf.py   ← PDF generator (not part of web build)
├── public/
│   ├── manifest.json   ← PWA manifest
│   └── sw.js           ← service worker
├── src/
│   ├── main.jsx        ← React root mount
│   └── kink-guide.jsx  ← guide component
└── handoffs/
    └── *.md            ← session handoff files
```
