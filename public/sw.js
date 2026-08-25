// ALSITS Service Worker — PWA Support
const CACHE_NAME = 'alsits-v1';

// Asset statis yang di-cache saat install
const STATIC_ASSETS = [
  '/',
  '/public-view',
  '/business-hub',
  '/manifest.json',
];

// Install: cache asset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Jika ada asset yang gagal, tetap lanjut install
      });
    })
  );
  self.skipWaiting();
});

// Activate: bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network-first untuk API, Cache-first untuk asset statis
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Jangan cache request API / backend
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/functions/') ||
    request.method !== 'GET'
  ) {
    return; // biarkan network handle
  }

  // Untuk navigasi (HTML pages) — Network-first, fallback ke cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Simpan copy ke cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Offline: sajikan dari cache atau halaman utama
          return caches.match(request) || caches.match('/') || new Response(
            '<html><body><h2 style="font-family:sans-serif;text-align:center;margin-top:40px">Anda sedang offline. Silakan periksa koneksi internet.</h2></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Untuk asset statis (JS, CSS, gambar) — Cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      });
    })
  );
});
