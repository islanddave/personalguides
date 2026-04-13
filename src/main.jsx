import React from 'react'
import ReactDOM from 'react-dom/client'
import KinkGuide from './kink-guide.jsx'
import Caltasks from './caltasks.jsx'
import MorningDashboard from './morning-dashboard.jsx'
import PeppersGuide from './peppers.jsx'

/* ── Hostname-based routing ──
   Each subdomain renders a different guide.
   Add new guides here + update index.html <title> dynamically below.
   ──────────────────────────────────────── */
const ROUTES = {
  'caltasks.futureishere.net': { component: Caltasks, title: "Jen's Cowork Setup" },
  'morning.futureishere.net': { component: MorningDashboard, title: 'Morning Dashboard' },
  'peppers.futureishere.net': { component: PeppersGuide, title: 'Pepper Starter Guide' },
  // default: kink guide (original site)
}

const host = window.location.hostname
const route = ROUTES[host]
const App = route ? route.component : KinkGuide

// Update document title to match the routed guide
if (route) {
  document.title = route.title
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register service worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
