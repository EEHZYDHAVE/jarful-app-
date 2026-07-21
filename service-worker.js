// Bump SW_VERSION on every deploy. This is what makes the browser notice
// there's an update at all — service worker updates are only detected when
// this file's bytes change, not when index.html or other assets change.
const SW_VERSION = "v2";
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

  var isNavigation = event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").indexOf("text/html") !== -1;

  if(isNavigation){
    // Network-first for the app shell itself: always try to get the latest
    // index.html when online. Cache is only a fallback for offline use.
    event.respondWith(
      fetch(event.request).then(function(response){
        if(response && response.status === 200){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){
        return caches.match(event.request).then(function(cached){
          return cached || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // Cache-first for everything else (icons, manifest) — these change rarely,
  // and it's fine for them to lag a request behind while the cache refreshes.
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