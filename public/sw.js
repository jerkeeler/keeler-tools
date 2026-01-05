// Service Worker for Keeler Tools PWA
// Version: 1.1.0

const CACHE_VERSION = 'v5';
const CACHE_NAME = `keeler-tools-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Assets to pre-cache on install
// Note: JS files in /_astro/ will be cached at runtime on first request
// CSS is now inlined in HTML for better performance
const PRECACHE_URLS = [
    '/',
    '/learnings/',
    '/tools/random-picker/',
    '/tools/sun-angle-compass/',
    '/tools/days-until-calculator/',
    OFFLINE_PAGE,
    '/favicon.svg',
    '/favicon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-maskable.png',
];

// Install event - pre-cache all critical assets
self.addEventListener('install', (event) => {
    console.log('[SW] Install event');

    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pre-caching all pages and assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate event');

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests (like Plausible analytics)
    if (url.origin !== location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached response
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone the response (can only be consumed once)
                    const responseToCache = response.clone();

                    // Cache successful responses
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    // Network failed, return offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match(OFFLINE_PAGE);
                    }

                    // For other requests, just fail
                    return new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable',
                    });
                });
        })
    );
});

// Message event - handle skip waiting command
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
