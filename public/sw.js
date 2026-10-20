// Service Worker for এসো আরবী শিখি - মারকাযুল ঈমান (PWA v8 - Zero Stale Cache Edition)
const CACHE_NAME = 'eso-arbi-v8';
const STATIC_ASSETS = [
  '/logo.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  // Activate immediately without waiting
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Delete all older stale caches immediately (v1 through v6)
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // NEVER cache or intercept /api/ endpoints, versioned assets (?v=...), or external requests
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.searchParams.has('v')) {
    return;
  }

  // 1. Navigation / HTML Requests: ALWAYS NETWORK-FIRST
  // Guarantees that users always receive the latest index.html with fresh asset hashes
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request) || caches.match('/'))
    );
    return;
  }

  // 2. Static Assets: Network-first for development/hashed assets to prevent stale JS traps
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

