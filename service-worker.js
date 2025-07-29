const CACHE_NAME = "pdf-cache-v" + new Date().getTime(); // [1] dynamic versioning

const FILES_TO_CACHE = [
  "/PDFviewerMain/",
  "/PDFviewerMain/index.html",
  "/PDFviewerMain/Centaur.woff2",
  "/PDFviewerMain/manifest.json",
  "/PDFviewerMain/jquery.min.js",
  "/PDFviewerMain/icon.png",
  "/PDFviewerMain/fall24.html",
  "/PDFviewerMain/winter24.html",
  "/PDFviewerMain/service-worker.js",
  "/PDFviewerMain/spring25.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE).catch((err) => {
        console.error("Cache addAll failed:", err);
      });
    })
  );
  self.skipWaiting(); // [2] activate new SW immediately
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // delete old versions
          }
        })
      );
    })
  );
  self.clients.claim(); // [3] take control immediately
});

// [4] fetch handler - bypass cache for HTML, JS, CSS
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  const isHTML = req.headers.get("accept")?.includes("text/html");
  const isJSorCSS = req.destination === "script" || req.destination === "style";

  if (isHTML || isJSorCSS) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(req))
    );
  } else {
    event.respondWith(caches.match(req).then((res) => res || fetch(req)));
  }
});

// [6] respond to skipWaiting trigger from page
self.addEventListener("message", (event) => {
  if (event.data?.action === "skipWaiting") {
    self.skipWaiting();
  }
});
