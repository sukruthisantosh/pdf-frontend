const CACHE_NAME = 'pdf-cache-v1';
const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    // Cache PDF files
    if (event.request.url.endsWith('.pdf')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 