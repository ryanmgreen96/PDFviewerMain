



const CACHE_NAME = "pdf-cache-v3"; // Update version if caching doesn't refresh

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
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE).catch((err) => {
        console.error("Cache addAll failed:", err);
      });
    })
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Delete old versions
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});