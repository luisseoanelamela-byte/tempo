const CACHE_NAME = 'tempo-galicia-v1';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Estrategia Cache First para assets estáticos
  const url = new URL(event.request.url);
  
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // Actualizar caché en segundo plano
        fetch(event.request).then(res => {
          if (res.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, res));
          }
        }).catch(() => {});
        return response;
      }
      return fetch(event.request).then(res => {
        if (res.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
        }
        return res;
      });
    }).catch(() => fetch(event.request))
  );
});
