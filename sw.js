// network first: new versions arrive whenever you are online; the cached copy keeps it working offline
const C="daily-english-v6";
const OK=[location.origin,"https://www.gstatic.com","https://fonts.googleapis.com","https://fonts.gstatic.com"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","firebase-config.js","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"])).catch(()=>{}))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const req=e.request,u=new URL(req.url);
  if(req.method!=="GET"||!OK.includes(u.origin)||u.pathname.startsWith("/__/"))return;
  // opening the app: when online, let the phone load the page by itself exactly like a normal website
  // (no service-worker involvement at all); the saved copy is used only when there is no network
  if(req.mode==="navigate"){if(navigator.onLine!==false)return;e.respondWith(caches.match("index.html").then(m=>m||caches.match("./")).then(m=>m||fetch(req)));return}
  // other same-site files: skip the browser's short-term cache so a new upload shows up right away
  const net=u.origin===location.origin?fetch(u.href,{cache:"no-cache",credentials:"same-origin"}):fetch(req);
  e.respondWith(net.then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r})
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(m=>m||caches.match("index.html")).then(m=>m||fetch(req))));
});
