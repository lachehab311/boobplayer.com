const CACHE_NAME = 'ibo-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/lib/hls.min.js',
    '/lib/dash.all.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
