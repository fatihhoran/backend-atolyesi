/* Offline bilingual startup. Language preference contains no account identity. */
(() => {
'use strict';
const key='backend-atolyesi-language';
let saved;try{saved=localStorage.getItem(key);}catch{}
const requested=new URLSearchParams(location.search).get('lang');
const lang=['tr','en'].includes(requested)?requested:saved==='en'?'en':'tr';
try{localStorage.setItem(key,lang);}catch{}
document.documentElement.lang=lang;
if(lang==='en')document.querySelector('link[rel="manifest"]')?.setAttribute('href','./manifest.en.json');
const en=lang==='en';
const select=document.getElementById('language-select');
if(select){select.value=lang;select.addEventListener('change',()=>{try{localStorage.setItem(key,select.value);}catch{}const u=new URL(location.href);u.searchParams.set('lang',select.value);location.replace(u.href);});}
function shareURL(){const u=new URL('./',location.href);if(en)u.searchParams.set('lang','en');return u.href;}
function applyCourse(C){if(!en)return;const E=window.ATOLYE_EN;if(!E)throw Error('English content could not be loaded.');C.lessons=E.lessons;C.glossary=E.glossary;C.questions=E.questions;C.modules=E.meta.modules;C.refs=E.meta.refs;C.projectSteps=E.meta.projectSteps;C.resources=C.resources.map(r=>({...r,...E.meta.resources.find(x=>x.id===r.id),code:r.code}));}
function applyTools(features,publicFeatures){if(!en)return;const E=window.ATOLYE_EN;features.exercises.forEach(x=>{const t=E.sql.find(s=>s.id===x.id);if(t)Object.assign(x,t);});for(const [id,value] of Object.entries(E.ai))Object.assign(publicFeatures.cases[id],value);}
window.AtolyeLocale={lang,applyCourse,applyTools,shareURL};
function staticEnglish(){if(!en)return;const set=(sel,text)=>{const el=document.querySelector(sel);if(el)el.textContent=text;};set('.skip-link','Skip to content');document.querySelector('.brand')?.setAttribute('aria-label','Backend Atölyesi home');document.querySelector('.online-dot')?.setAttribute('title','Local learning profile');set('.workspace-label','YOUR WORKSPACE');set('.mini-path .eyebrow','YOUR LEARNING FOCUS');set('.mini-path>span:last-child','From foundations to your first project');set('.profile strong','Visitor');set('.profile .avatar','V');set('.profile small','One step every day');set('.breadcrumb','Workspace / Overview');set('.connection','Online');set('[data-install-label]','Phone setup');set('.page-footer>span','Learn. Try it. Make it stick.');set('.page-footer>a','Sources & setup ↗');const button=document.querySelector('[data-action="install"]');button?.setAttribute('aria-label','Install on your phone');const theme=document.querySelector('[data-action="theme"]');theme?.setAttribute('aria-label','Change colour theme');theme?.setAttribute('title','Colour theme');document.querySelector('.sidebar')?.setAttribute('aria-label','Main navigation');document.querySelector('#mobile-nav')?.setAttribute('aria-label','Mobile navigation');set('.loading-message','Loading Atölye…');document.querySelector('[data-action=nav-toggle]')?.setAttribute('aria-label','Toggle navigation');document.title='Backend Atölyesi — Learn, practise, improve';}
staticEnglish();
const script=name=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./'+name;s.onload=resolve;s.onerror=()=>reject(Error('A learning file could not be loaded.'));document.head.appendChild(s);});
(async()=>{
 try{
  for(const name of ['content','expansion','questions-extra','share-content','resources-data'])await script(name+'.v5.js');
  if(en)await script('english.v5.js');
  await script('curriculum.v6.js');
  for(const name of ['academy-content','academy-practice','academy'])await script(name+'.v7.js');
  await script('brand.v8.js');
  for(const name of ['features','install','public-features','app'])await script(name+(en?'.en':'')+(name==='public-features'?'.v6.js':'.v8.js'));
  document.querySelector('#main')?.removeAttribute('aria-busy');
  if(en){const note=document.createElement('p');note.className='locale-code-note';note.textContent='Example identifiers and sample database values stay in Turkish so both languages use the same code and SQL exercises.';document.querySelector('.page-footer')?.prepend(note);}
 }catch(error){const main=document.querySelector('#main');if(main){main.textContent=en?'The workshop could not load. Connect to the internet and reload the page.':'Atölye açılamadı. İnternete bağlanıp sayfayı yenile.';main.removeAttribute('aria-busy');}console.error(error);}
})();
})();
