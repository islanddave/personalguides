const CACHE_NAME = 'kink-guide-v2'

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Bypass localhost entirely — Chrome's Private Network Access handles these
  // directly. Service worker interception causes TypeError when the fetch is
  // blocked or the response can't be cached across origins.
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return
  }

  // Navigation requests (HTML): network-first so index.html is always fresh
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          const clone = resp.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone))
          return resp
        })
        .catch(() => caches.match(e.request))
    )
    return
  }

  // Hashed assets (Vite bundles): cache-first — hash in filename guarantees correctness
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached
        return fetch(e.request).then((resp) => {
          const clone = resp.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone))
          return resp
        })
      })
    )
    return
  }

  // Everything else: network-first with cache fallback
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const clone = resp.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone))
        return resp
      })
      .catch(() => caches.match(e.request))
  )
})
