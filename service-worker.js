// Auto-updating service worker for Macaron Store PWA
const CACHE_NAME = 'macaron-store-cache-' + Date.now();
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Install: Precache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  // Activate this service worker immediately
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  // Take control of open clients immediately
  self.clients.claim();
});

// Fetch: Network-first for HTML/CSS/JS, cache-first for others
self.addEventListener('fetch', event => {
  const { request } = event;

  if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    // Network-first
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first for images, fonts, etc.
    event.respondWith(
      caches.match(request).then(response => response || fetch(request))
    );
  }
});
