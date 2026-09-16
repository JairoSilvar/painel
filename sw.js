/* Painel Mídia v6.1 — service worker leve; áudio/vídeo nunca é cacheado. */
var CACHE = 'painel-midia-v61-ui';
var ASSETS = ['./', './index.html', './manifest.webmanifest'];

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
      var jobs = [];
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== CACHE) jobs.push(caches.delete(keys[i]));
      }
      return Promise.all(jobs);
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (!req || req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (/m3u8|mp3|aac|audio|stream|youtube|googlevideo|cast/i.test(url.href)) return;
  if (url.origin !== self.location.origin) return;

  var isAppShell = req.mode === 'navigate' ||
    /\.html$|\.webmanifest$|\/$/.test(url.pathname);

  if (isAppShell) {
    event.respondWith(
      fetch(req).then(function(res) {
        if (res && res.ok) {
          var copy = res.clone();
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

  event.respondWith(
    caches.match(req).then(function(cached) {
      var network = fetch(req).then(function(res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function(c) { c.put(req, copy); });
        }
        return res;
      }).catch(function() { return cached; });
      return cached || network;
    })
  );
});
