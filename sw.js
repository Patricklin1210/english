// network first: new versions arrive whenever you are online; the cached copy keeps it working offline
const C="daily-english-v3";
const OK=[location.origin,"https://www.gstatic.com","https://fonts.googleapis.com","https://fonts.gstatic.com"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","firebase-config.js","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"])))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||!OK.includes(u.origin)||u.pathname.startsWith("/__/"))return;
  e.respondWith(fetch(e.request,u.origin===location.origin?{cache:"no-cache"}:{}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match("index.html"))));
});
