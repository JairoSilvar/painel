/* Portal de Mídia — service worker leve (só UI) */
const CACHE = 'portal-midia-v60-ui';
const ASSETS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS).catch(function() {});
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Nunca cachear streams de áudio/vídeo nem APIs de terceiros
  if (/m3u8|mp3|aac|audio|stream|youtube|googlevideo|cast/i.test(url.href)) return;
  if (url.origin !== self.location.origin) return;

  const isAppShell = req.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.endsWith('/');

  if (isAppShell) {
    // NETWORK-FIRST para o "app shell": sempre tenta buscar a versão mais
    // nova primeiro. Só cai para o cache se a rede falhar (offline).
    // Isso evita ficar preso numa versão antiga/quebrada depois de um deploy.
    event.respondWith(
      fetch(req).then(function(res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(function(c) { c.put(req, copy); });
        }
        return res;
      }).catch(function() {
        return caches.match(req).then(function(cached) {
          return cached || caches.match('./');
        });
      })
    );
    return;
  }

  // Demais recursos estáticos: cache-first com atualização em segundo plano.
  event.respondWith(
    caches.match(req).then(function(cached) {
      const network = fetch(req).then(function(res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(function(c) { c.put(req, copy); });
        }
        return res;
      }).catch(function() {
        return cached;
      });
      return cached || network;
    })
  );
});
