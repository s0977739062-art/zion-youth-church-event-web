const CACHE_NAME = "zion-youth-cache-v1";
const APP_SHELL = [
    "./index.html",
    "./kids-art.html",
    "./kids-character.html",
    "./music-class.html",
    "./reading-club.html",
    "./sports.html",
    "./study-ko.html",
    "./youth-worship.html",
    "./style.css",
    "./manifest.json",
    "./images/pwa-icon-192.png",
    "./images/pwa-icon-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName.startsWith("zion-youth-cache-") && cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET" || url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        event.waitUntil(cacheResponse(request, response.clone()));
                    }
                    return response;
                })
                .catch(async () => {
                    const cachedPage = await caches.match(request)
                        || await caches.match(new URL(url.pathname, self.location.origin).href)
                        || await caches.match("./index.html");
                    return cachedPage || Response.error();
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then((response) => {
                    if (response.ok) {
                        event.waitUntil(cacheResponse(request, response.clone()));
                    }
                    return response;
                });
            })
    );
});

async function cacheResponse(request, response) {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response);
    } catch (error) {
        console.error("Unable to cache the requested page asset.", error);
    }
}
