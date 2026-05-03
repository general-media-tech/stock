// ══════════════════════════════════════════════
// GMT POS — Service Worker v2.0
// Cache-First للملفات، Network-Only لـ Supabase
// ══════════════════════════════════════════════

const CACHE_NAME = 'gmt-pos-v2';

const CORE_FILES = [
  './',
  './index.html',
  './gmt_branch.html',
  './inv_mobile.html',
  './gmt_reports.html',
  './gmt_label_printer.html',
  './gmt_orders.html',
  './logo.jpg',
  './manifest.json',
];

const EXTERNAL_FILES = [
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/umd/index.min.js',
];

// ── INSTALL ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(CORE_FILES).catch(err => console.warn('[SW] Core cache failed:', err));
      await Promise.allSettled(EXTERNAL_FILES.map(url => cache.add(url).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── FETCH ──
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Supabase API — شبكة فقط
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(req).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          status: 503, headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // 2. Fonts & CDN — Cache-First
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(r => {
        if (r.ok) caches.open(CACHE_NAME).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => new Response('', { status: 404 })))
    );
    return;
  }

  // 3. صور — Cache-First
  if (url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || url.pathname.includes('/storage/')) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(r => {
        if (r.ok) caches.open(CACHE_NAME).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => new Response('', { status: 404 })))
    );
    return;
  }

  // 4. ملفات محلية — Stale-While-Revalidate
  if (req.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(req);
        const fetchPromise = fetch(req).then(r => {
          if (r.ok) cache.put(req, r.clone());
          return r;
        }).catch(() => null);
        if (cached) { fetchPromise.catch(() => {}); return cached; }
        return (await fetchPromise) ||
          new Response('<h1 dir="rtl" style="font-family:sans-serif;text-align:center;padding:40px">⚠️ لا يوجد اتصال</h1>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      })
    );
  }
});

// ── MESSAGE ──
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
