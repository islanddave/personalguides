import React from 'react'
import ReactDOM from 'react-dom/client'
import KinkGuide from './kink-guide.jsx'
import Caltasks from './caltasks.jsx'
import MorningDashboard from './morning-dashboard.jsx'
import JenMorningDashboard from './jen-morning-dashboard.jsx'
import JenEnvSetup from './jen-envsetup.jsx'

const ROUTES = {
  'caltasks.futureishere.net': { component: Caltasks, title: "Jen's Cowork Setup" },
  'morning.futureishere.net': { component: MorningDashboard, title: 'Morning Dashboard' },
  'jen-morning.futureishere.net': { component: JenMorningDashboard, title: "Jen's Morning Dashboard" },
  'jen-envsetup.futureishere.net': { component: JenEnvSetup, title: "Jen's Cowork Setup Guide" },
}

const host = window.location.hostname
const route = ROUTES[host]
const App = route ? route.component : KinkGuide

if (route) {
  document.title = route.title
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
