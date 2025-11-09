// G1Cure Service Worker
// Version: 1.0.0

const CACHE_NAME = 'g1cure-v1.0.0';
const STATIC_CACHE = 'g1cure-static-v1.0.0';
const DYNAMIC_CACHE = 'g1cure-dynamic-v1.0.0';
const API_CACHE = 'g1cure-api-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/static/media/logo.svg',
  '/static/media/hero-bg.jpg',
  '/static/media/doctor-avatar.jpg',
  '/static/media/patient-avatar.jpg',
  '/static/media/hospital-icon.svg',
  '/static/media/telemedicine-icon.svg',
  '/static/media/analytics-icon.svg',
  '/static/media/billing-icon.svg'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/patients',
  '/api/appointments',
  '/api/doctors',
  '/api/medical-records',
  '/api/analytics',
  '/api/billing'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      
      // Cache API endpoints
      caches.open(API_CACHE).then((cache) => {
        console.log('Service Worker: Caching API endpoints');
        return cache.addAll(API_ENDPOINTS);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/static/')) {
    // Static assets
    event.respondWith(handleStaticRequest(request));
  } else {
    // HTML pages
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with offline fallback
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response for offline use
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', error);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for API requests
  return new Response(
    JSON.stringify({ 
      error: 'Offline mode', 
      message: 'This data is not available offline',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Handle static asset requests
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Static asset fetch failed:', error);
    return new Response('Asset not available', { status: 404 });
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Service Worker: Network failed for page:', error);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline page
  return caches.match('/offline.html');
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
  
  if (event.tag === 'appointment-reminders') {
    event.waitUntil(sendAppointmentReminders());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from G1Cure',
    icon: '/static/media/logo.svg',
    badge: '/static/media/notification-badge.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/static/media/action-icon.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/static/media/close-icon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('G1Cure Healthcare', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_DATA') {
    cacheOfflineData(event.data.data);
  }
  
  if (event.data.type === 'GET_CACHED_DATA') {
    getCachedData(event.data.key).then((data) => {
      event.ports[0].postMessage({ data });
    });
  }
});

// Sync offline data when back online
async function syncOfflineData() {
  try {
    console.log('Service Worker: Syncing offline data...');
    
    // Get cached offline data
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/')) {
        try {
          // Try to sync with server
          const response = await fetch(request, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              offline: true,
              timestamp: Date.now()
            })
          });
          
          if (response.ok) {
            // Remove from cache if sync successful
            await cache.delete(request);
          }
        } catch (error) {
          console.log('Service Worker: Sync failed for:', request.url, error);
        }
      }
    }
    
    // Notify main thread
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE'
        });
      });
    });
    
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Send appointment reminders
async function sendAppointmentReminders() {
  try {
    console.log('Service Worker: Sending appointment reminders...');
    
    // Get cached appointments
    const cache = await caches.open(DYNAMIC_CACHE);
    const appointmentsResponse = await cache.match('/api/appointments');
    
    if (appointmentsResponse) {
      const appointments = await appointmentsResponse.json();
      const now = new Date();
      
      appointments.forEach((appointment) => {
        const appointmentTime = new Date(appointment.scheduledTime);
        const timeDiff = appointmentTime - now;
        
        // Send reminder 1 hour before appointment
        if (timeDiff > 0 && timeDiff <= 3600000) {
          self.registration.showNotification('Appointment Reminder', {
            body: `You have an appointment in 1 hour with ${appointment.doctorName}`,
            icon: '/static/media/logo.svg',
            badge: '/static/media/notification-badge.svg',
            tag: `appointment-${appointment.id}`,
            data: {
              appointmentId: appointment.id,
              type: 'appointment-reminder'
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Service Worker: Failed to send reminders:', error);
  }
}

// Cache offline data
async function cacheOfflineData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Cache appointments
    if (data.appointments) {
      const appointmentsResponse = new Response(JSON.stringify(data.appointments), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/api/appointments', appointmentsResponse);
    }
    
    // Cache patients
    if (data.patients) {
      const patientsResponse = new Response(JSON.stringify(data.patients), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/api/patients', patientsResponse);
    }
    
    // Cache medical records
    if (data.medicalRecords) {
      const recordsResponse = new Response(JSON.stringify(data.medicalRecords), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/api/medical-records', recordsResponse);
    }
    
    console.log('Service Worker: Offline data cached successfully');
  } catch (error) {
    console.error('Service Worker: Failed to cache offline data:', error);
  }
}

// Get cached data
async function getCachedData(key) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match(`/api/${key}`);
    
    if (response) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Service Worker: Failed to get cached data:', error);
    return null;
  }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'appointment-sync') {
      event.waitUntil(syncOfflineData());
    }
  });
}

// Handle app updates
self.addEventListener('appinstalled', (event) => {
  console.log('Service Worker: App installed');
  
  // Clear old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

console.log('Service Worker: Loaded successfully');
