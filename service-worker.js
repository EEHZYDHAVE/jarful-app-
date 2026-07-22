// Bump SW_VERSION on every deploy. This is what makes the browser notice
// there's an update at all — service worker updates are only detected when
// this file's bytes change, not when index.html or other assets change.
const SW_VERSION = "v3";
const CACHE_NAME = "jarful-cache-" + SW_VERSION;
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; })
             .map(function(n){ return caches.delete(n); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;
  if(new URL(event.request.url).origin !== self.location.origin) return;

  // Cache-first for everything, including the app shell itself — this is a
  // financial tracker, it needs to open instantly with no connection at all.
  // Freshness is handled separately: SW_VERSION bumps trigger a background
  // update + the in-app "new version available" banner, not per-request
  // network races that can stall the very first load when offline.
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var networkFetch = fetch(event.request).then(function(response){
        if(response && response.status === 200 && response.type === "basic"){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){
        return cached;
      });
      return cached || networkFetch;
    })
  );
});