'use strict';
const CACHE='backend-atolyesi-shell-v14';
const ASSETS=["./","./app.en.v8.js","./app.v8.js","./boot.v8.js","./content.v5.js","./curriculum.v6.js","./academy-content.v7.js","./academy-practice.v7.js","./academy.v7.js","./academy.v7.css","./downloads/Atolye_Yerel_Pratik.zip","./downloads/GorevApi_Calisma_Paketi.zip","./english.v5.js","./expansion.v5.js","./features.en.v8.js","./features.v8.js","./install.en.v8.js","./install.v8.js","./manifest.en.json","./manifest.json","./public-features.en.v6.js","./public-features.v6.js","./public.v5.css","./questions-extra.v5.js","./resources-data.v5.js","./revision.v5.css","./share-content.v5.js","./sql-worker.v7.js","./styles.v5.css","./vendor/resources.json","./vendor/samples/aspnet-results/LICENSE","./vendor/samples/aspnet-results/Program.cs","./vendor/samples/cs-bank/BankAccount.cs","./vendor/samples/cs-bank/LICENSE","./vendor/samples/cs-list/LICENSE","./vendor/samples/cs-list/Program.cs","./vendor/samples/ef-model/LICENSE","./vendor/samples/ef-model/Model.cs","./vendor/samples/ef-program/LICENSE","./vendor/samples/ef-program/Program.cs","./vendor/samples/ollama-chat/Chat.cs","./vendor/samples/ollama-chat/LICENSE","./vendor/samples/ollama-tools/LICENSE","./vendor/samples/ollama-tools/ToolCalling.cs","./vendor/samples/onnx-rag/LICENSE","./vendor/samples/onnx-rag/Program.cs","./vendor/samples/sql-seed/CreateTestData.sql","./vendor/samples/sql-seed/LICENSE","./vendor/SOURCES.md","./vendor/sqljs/LICENSE","./vendor/sqljs/provenance.json","./vendor/sqljs/sql-wasm.js","./vendor/sqljs/sql-wasm.wasm","./brand.v8.js","./brand.v8.css","./brand/atolye-icon.svg","./brand/atolye-maskable.svg","./brand/atolye-logo.svg","./brand/atolye-logo-dark.svg","./brand/illustrations.svg","./brand/favicon.ico","./brand/favicon-16.png","./brand/favicon-32.png","./brand/favicon-48.png","./launch.v9.css","./brand/launch-mark.svg","./brand/install-192.v9.png","./brand/install-512.v9.png","./brand/install-maskable-512.v9.png","./brand/install-apple-180.v9.png"];
const root=new URL('./',self.location.href);
const allowed=new Set(ASSETS.map(a=>new URL(a,root).pathname));
const manifests=new Set(['manifest.json','manifest.en.json'].map(name=>new URL(name,root).pathname));
async function validShell(response){if(!response.ok||response.redirected)return false;const text=await response.clone().text();return text.includes('id="main"')&&text.includes('./boot.v8.js');}
async function freshManifest(request){
 const cache=await caches.open(CACHE);
 try{
  const response=await fetch(request,{cache:'no-cache'});
  const type=response.headers.get('Content-Type')||'';
  if(response.ok&&!response.redirected&&/^application\/(json|manifest\+json)\b/i.test(type)){
   await cache.put(request,response.clone());
   return response;
  }
 }catch{}
 return await cache.match(request,{ignoreSearch:true})||
  new Response('Installation metadata unavailable',{status:503});
}
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 for(const asset of ASSETS){const response=await fetch(new Request(new URL(asset,root),{cache:'reload',credentials:'include'}));
  if(!response.ok||response.redirected)throw Error('Ders paketi alınamadı');
  if(asset==='./'||asset==='./index.html'){if(!await validShell(response))throw Error('Giriş sayfası paketlenmedi');}
  else if((response.headers.get('Content-Type')||'').includes('text/html'))throw Error('Beklenmeyen giriş yanıtı');
  if(asset==='./')await cache.put(new URL('./index.html',root),response.clone());
  await cache.put(new URL(asset,root),response);
 }
 await cache.put(new URL('./offline-ready.json',root),new Response(JSON.stringify({build:'brand-v14',ready:true}),{headers:{'Content-Type':'application/json'}}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{await self.clients.claim();for(const c of await self.clients.matchAll())c.postMessage({type:'OFFLINE_READY'});})()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==root.origin||!allowed.has(u.pathname))return;
 // Chrome needs current install metadata even when the lesson shell is cached.
 if(manifests.has(u.pathname)){e.respondWith(freshManifest(e.request));return;}
 if(e.request.mode==='navigate'){e.respondWith((async()=>{try{const response=await fetch(e.request);if(await validShell(response)){const c=await caches.open(CACHE);await c.put(new URL('./index.html',root),response.clone());}return response;}catch{const c=await caches.open(CACHE);return await c.match(new URL('./index.html',root))||new Response('İlk açılış için internet bağlantısı gerekli.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}})());}
 else e.respondWith((async()=>{const c=await caches.open(CACHE);return await c.match(e.request,{ignoreSearch:true})||fetch(e.request);})());
});
