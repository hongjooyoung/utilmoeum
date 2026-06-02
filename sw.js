const CACHE = 'utilmoeum-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/salary-calculator.html',
  '/bmi-calculator.html',
  '/dday-calculator.html',
  '/lottery.html',
  '/realestate.html',
  '/style.css',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // CDN 요청은 캐시 우선 → 없으면 네트워크
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
