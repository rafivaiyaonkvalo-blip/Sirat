// Service Worker for Sirat - মারকাযুল ঈমান (PWA v9 - Subpath Compatible)
const CACHE_NAME = 'sirat-pwa-v9';
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '') || '';
const STATIC_ASSETS = [
  (BASE_PATH + '/logo.png').replace(/\/\//g, '/'),
  (BASE_PATH + '/manifest.json').replace(/\/\//g, '/')
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
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
  if (url.origin !== self.location.origin || url.pathname.includes('/api/') || url.searchParams.has('v')) {
    return;
  }

  // 1. Navigation / HTML Requests: ALWAYS NETWORK-FIRST
  const isNav = event.request.mode === 'navigate' || 
    url.pathname === '/' || 
    url.pathname === '/sirat' || 
    url.pathname === '/sirat/' || 
    url.pathname.endsWith('.html');

  if (isNav) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request) || caches.match(BASE_PATH + '/') || caches.match('/sirat/'))
    );
    return;
  }

  // 2. Static Assets: Network-first
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
