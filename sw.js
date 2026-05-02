// ══════════════════════════════════════════════
// GMT POS — Service Worker v1.0
// يخزّن الملفات الأساسية في الكاش ويسمح بالتشغيل أوفلاين
// ══════════════════════════════════════════════

const CACHE_NAME = 'gmt-pos-v1';

// الملفات الأساسية التي تُخزَّن عند التثبيت
const CORE_FILES = [
  './',
  './index.html',
  './gmt_branch.html',
  './inv_mobile.html',
  './gmt_reports.html',
  './logo.jpg',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/umd/index.min.js',
];

// ── INSTALL: خزّن الملفات الأساسية ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // نحاول تخزين كل ملف — إذا فشل أي ملف نكمل
      return Promise.allSettled(
        CORE_FILES.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: احذف الكاشات القديمة ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: استراتيجية Network-First مع Fallback للكاش ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // طلبات Supabase API — شبكة فقط (لا تُكاش)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // صور المنتجات — Cache-First (تحميل سريع)
  if (url.pathname.includes('/products-images/') || url.pathname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
    return;
  }

  // باقي الطلبات — Network-First مع Fallback للكاش
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // حدّث الكاش بالنسخة الجديدة
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── MESSAGE: تحديث فوري عند طلب من الصفحة ──
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
