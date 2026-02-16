const CACHE_NAME = 'biz-registry-v6';
// List every file you want to work offline
const ASSETS_TO_CACHE = [
  './Index.html',    // Capitalized to match your file
  './manifest.json',
  './icon2.png'      // Your phone's icon image
];

// Install: Save files to the browser's "Vault"
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Delete old caches when you update the version
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// Fetch: Intercept network requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached file if found, otherwise go to internet
      return response || fetch(event.request);
    })
  );
});
evt.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(evt.request).then(cachedRes => {
        const fetchPromise = fetch(evt.request).then(networkRes => {
          // Update the cache with the fresh version for NEXT time
          if (networkRes.ok) {
            cache.put(evt.request, networkRes.clone());
          }
          return networkRes;
        }).catch(() => {
            // If network fails and no cache, this prevents a crash
            return cachedRes; 
        });

        // Return the cached version immediately (fast), or wait for network
        return cachedRes || fetchPromise;
      });
    })
  );
});
                 
