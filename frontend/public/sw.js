// G1Cure Service Worker
// Version: 2.0.0 - Simplified for Vite builds

const CACHE_VERSION = 'g1cure-v2.0.0';
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE_ASSETS = `precache-${CACHE_VERSION}`;

// Minimal essential files to precache
// Note: Vite generates hashed filenames, so we cache these dynamically on first load
const ESSENTIAL_URLS = [
  '/',
  '/manifest.json',
];

// Install event - precache essential files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(PRECACHE_ASSETS)
      .then((cache) => {
        console.log('[ServiceWorker] Precaching essential files');
        // Only cache files that definitely exist
        return cache.addAll(ESSENTIAL_URLS).catch((err) => {
          console.warn('[ServiceWorker] Precache failed, continuing anyway:', err);
          // Don't fail installation if precache fails
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old cache versions
            if (cacheName.startsWith('g1cure-') && cacheName !== RUNTIME_CACHE && cacheName !== PRECACHE_ASSETS) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - Network first, cache fallback strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Different strategies for different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests: Network first, then cache
    event.respondWith(networkFirst(request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/)) {
    // Static assets: Cache first, then network
    event.respondWith(cacheFirst(request));
  } else {
    // HTML and other requests: Network first with cache fallback
    event.respondWith(networkFirst(request));
  }
});

// Network first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[ServiceWorker] Serving from cache:', request.url);
      return cachedResponse;
    }

    // No cache available
    if (request.url.includes('/api/')) {
      // Return offline JSON response for API calls
      return new Response(
        JSON.stringify({
          error: 'Offline',
          message: 'This data is not available offline',
          offline: true
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // For pages, try to serve the root page
    const rootCache = await caches.match('/');
    return rootCache || new Response('Offline - No cached content available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Fetch failed for:', request.url);
    return new Response('Asset not available', { status: 404 });
  }
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'New notification from G1Cure',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'G1Cure Healthcare', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

console.log('[ServiceWorker] Loaded successfully');
