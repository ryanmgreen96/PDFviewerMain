

const CACHE_NAME = 'pdf-cache-v2'; // Change this version each update

const FILES_TO_CACHE = [
  '/PDFviewerMain',
  '/PDFviewerMain/index.html',
  '/PDFviewerMain/Centaur.woff2',
  '/PDFviewerMain/manifest.json',
  '/PDFviewerMain/jquery.min.js',
  '/PDFviewerMain/icon.png',
  '/PDFviewerMain/fall24.html',
  '/PDFviewerMain/winter24.html',
  
  // Add all necessary assets — ONLY those that exist!
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
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