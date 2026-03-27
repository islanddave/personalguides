import React from 'react'
import ReactDOM from 'react-dom/client'
import KinkGuide from './kink-guide.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KinkGuide />
  </React.StrictMode>
)

// Register service worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
