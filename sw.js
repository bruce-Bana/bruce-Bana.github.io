const CACHE = 'bruce-bana-v2';
const PRECACHE = [
  './', './index.html', './about.html', './projects.html', './interests.html',
  './contact.html', './blog.html', './blog-building-python-ai-assistant.html',
  './blog-local-ai-on-older-hardware.html', './blog-building-bex-cli.html',
  './blog-rust-ai-command-interface.html', './dashboard.html', './lab.html',
  './search.html', './games.html', './cv.html', './style.css', './script.js',
  './profile.jpg', './offline.html', './site.webmanifest', './feed.xml',
  './robots.txt', './sitemap.xml'
];
const STATIC_PATHS = new Set(['/style.css', '/script.js', '/profile.jpg', '/site.webmanifest']);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith('bruce-bana-') && key !== CACHE)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Do not intercept cross-origin resources such as Google Fonts.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE);
          event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
        }
        return response;
      } catch {
        return (await caches.match(request)) ||
          (await caches.match(new URL('./offline.html', self.location).href)) ||
          new Response('You are offline. Reconnect and try again.', {
            status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  if (!STATIC_PATHS.has(url.pathname)) return;
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
    }
    return response;
  })());
});
