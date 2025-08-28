const CACHE_NAME = 'macaron-store-cache-v1';
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
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

// Fetch: Network-first for CSS/JS, cache-first for everything else
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.destination === 'style' || request.destination === 'script') {
    // Network-first for CSS & JS
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request)) // Fallback to cache if offline
    );
  } else {
    // Cache-first for everything else (HTML, images, fonts, etc.)
    event.respondWith(
      caches.match(request).then(response => response || fetch(request))
    );
  }
});
