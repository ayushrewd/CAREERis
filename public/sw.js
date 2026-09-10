const CACHE_NAME = "careeris-app-v3";
const APP_ASSETS = [
  "/manifest.json",
  "/icon.svg",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/icons/icon-72.png",
  "/icons/icon-96.png",
  "/icons/icon-128.png",
  "/icons/icon-144.png",
  "/icons/icon-152.png",
  "/icons/icon-192.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Do not intercept non-same-origin or API calls or Next.js development HMR
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("_next/webpack-hmr") ||
    request.mode === "navigate"
  ) {
    return;
  }

  // Cache only stable public assets. Next.js bundles are intentionally excluded
  // so a deployed update or local development build can never be shadowed by an
  // older application bundle.
  if (
    url.pathname.startsWith("/icons/") ||
    APP_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
