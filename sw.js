const CACHE = 'utilmoeum-v2';
const PRECACHE = [
  '/',
  '/salary-calculator',
  '/bmi-calculator',
  '/dday-calculator',
  '/lottery',
  '/realestate',
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
  // 페이지 탐색은 네트워크 우선 (리다이렉트 문제 방지)
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // 정적 자산은 캐시 우선 → 없으면 네트워크
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
