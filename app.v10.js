/* Backend Atölyesi: dependency-free, device-local learning application. */
'use strict';
(() => {
const C = window.COURSE;
const L=window.AtolyeLocale;
if(L)L.applyCourse(C);
window.AtolyeCurriculum.apply(C, L?.lang ?? 'tr');
const Academy=window.Academy;
const Brand=window.AtolyeBrand;
const Reminders=window.AtolyeReminders;
Academy.apply(C, L?.lang ?? 'tr');
const sqlIds=window.AtolyeFeatures.exercises.map(exercise=>exercise.id);
const allLessons = [...C.lessons, ...C.archiveLessons];
const findLesson = id => allLessons.find(lesson => lesson.id === id);
const $ = (q, root=document) => root.querySelector(q);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold = value => String(value).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
const paths = {
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
 route:'<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 5h7a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h6"/>',
 book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15"/>',
 cards:'<rect x="6" y="5" width="14" height="16" rx="2"/><path d="M16 2H5a3 3 0 0 0-3 3v11m8-6h6m-6 4h4"/>',
 quiz:'<path d="M9 3h6v4H9zM8 5H5v16h14V5h-3M8 12l2 2 5-4M8 18h7"/>',
 code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8zm-9 9 9 5 9-5m-18 5 9 5 9-5"/>',
 network:'<rect x="8" y="2" width="8" height="5" rx="1"/><rect x="2" y="17" width="7" height="5" rx="1"/><rect x="15" y="17" width="7" height="5" rx="1"/><path d="M12 7v5M5 17v-5h14v5"/>',
 database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/>',
 shield:'<path d="m12 2 9 4v6c0 5-6 9-9 10-3-1-9-5-9-10V6zM8 12l3 3 5-6"/>',
 rocket:'<path d="M8 15c-2-5 4-12 13-12 0 9-7 15-12 13M14 4l6 6M8 9H4l-2 6 6-1m7 2-1 6 6-2v-5M6 18l-3 3"/><circle cx="15" cy="9" r="1.5"/>',
 notes:'<path d="M14 3H4v18h16V9m-6-6 6 6h-6zM8 12h7m-7 4h7"/>',
 settings:'<path d="m10 3-1 3-3-1-2 3 2 3-2 3 2 3 3-1 1 3h4l1-3 3 1 2-3-2-3 2-3-2-3-3 1-1-3z"/><circle cx="12" cy="11" r="3"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
 moon:'<path d="M20 14A9 9 0 0 1 10 4 9 9 0 1 0 20 14z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
 flame:'<path d="M12 2c1 6 7 7 7 13a7 7 0 1 1-14 0c0-4 3-6 4-9 0 4 1 5 3 6 2-3 1-6 0-10z"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1z"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 external:'<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
 refresh:'<path d="M20 7a9 9 0 1 0 1 9M20 2v6h-6"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 play:'<path d="m8 4 12 8-12 8z"/>',
 upload:'<path d="M12 16V3m-4 4 4-4 4 4M4 16v5h16v-5"/>'
};
const icon=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.code}</svg>`;
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.outerHTML=icon(el.dataset.icon));}
const KEY='backend-atolyesi-v1';
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const defaults=()=>({schemaVersion:1,displayName:'',profileAcknowledged:false,completed:[],bookmarks:[],favorites:[],notes:{},review:{},activity:{},history:[],wrong:[],project:[],goal:20,theme:'light',lastLesson:null,academy:Academy.fresh()});
let storageOK=true;
let blockedWrite=false;
let state;
function validateState(data){
 if(!data||typeof data!=='object'||Array.isArray(data)||data.schemaVersion!==1)throw Error('Geçerli bir Atölye yedeği değil.');
 const s=defaults(), lids=new Set(allLessons.map(l=>l.id));
 s.displayName=window.PublicFeatures.normalizeName(typeof data.displayName==='string'?data.displayName:'');
 s.profileAcknowledged=data.profileAcknowledged===true;
 for(const key of ['completed','bookmarks'])s[key]=[...new Set((Array.isArray(data[key])?data[key]:[]).filter(v=>lids.has(v)))];
 s.favorites=[...new Set((Array.isArray(data.favorites)?data.favorites:[]).filter(v=>Number.isInteger(v)&&v>=0&&v<C.glossary.length))];
 if(data.notes&&typeof data.notes==='object')for(const [id,note] of Object.entries(data.notes)){if(lids.has(id)&&typeof note==='string')s.notes[id]=note.slice(0,12000);}
 if(data.review&&typeof data.review==='object')for(const [id,r] of Object.entries(data.review)){if(/^\d+$/.test(id)&&+id<C.glossary.length&&r&&Number.isFinite(r.due)&&Number.isInteger(r.level))s.review[id]={due:Math.max(0,r.due),level:Math.max(0,Math.min(5,r.level))};}
 if(data.activity&&typeof data.activity==='object')for(const [date,a] of Object.entries(data.activity)){if(/^\d{4}-\d{2}-\d{2}$/.test(date)&&a&&typeof a==='object')s.activity[date]={lessons:Math.max(0,Math.min(100,Number(a.lessons)||0)),terms:Math.max(0,Math.min(1000,Number(a.terms)||0)),quizzes:Math.max(0,Math.min(100,Number(a.quizzes)||0))};}
 s.wrong=[...new Set((Array.isArray(data.wrong)?data.wrong:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<C.questions.length))];
 s.history=(Array.isArray(data.history)?data.history:[]).filter(h=>h&&Number.isFinite(h.at)&&Number.isInteger(h.total)&&h.total>0&&Number.isInteger(h.score)&&h.score>=0&&h.score<=h.total).slice(-100).map(h=>({at:h.at,total:h.total,score:h.score}));
 s.project=[...new Set((Array.isArray(data.project)?data.project:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<C.projectSteps.length))];
 s.goal=[15,20,30].includes(data.goal)?data.goal:20;
 s.theme=['light','dark'].includes(data.theme)?data.theme:'light';
 s.lastLesson=lids.has(data.lastLesson)?data.lastLesson:null;
 s.academy=Academy.validate(data.academy,C,sqlIds);
 return s;
}
try{const raw=localStorage.getItem(KEY);state=raw?validateState(JSON.parse(raw)):defaults();}catch(e){state=defaults();storageOK=false;blockedWrite=true;}
function save(){if(blockedWrite)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){if(storageOK)toast('Tarayıcı kaydı kullanılamıyor. Yedeğini dışa aktar.');storageOK=false;}}
function activity(type){const d=today();if(!state.activity[d])state.activity[d]={lessons:0,terms:0,quizzes:0};state.activity[d][type]++;save();}
function streak(){let n=0;const d=new Date();d.setHours(12,0,0,0);if(!state.activity[today()])d.setDate(d.getDate()-1);for(let i=0;i<3660;i++){const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;if(!state.activity[key])break;n++;d.setDate(d.getDate()-1);}return n;}
let toastTimer;
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
function applyTheme(){document.body.classList.toggle('dark',state.theme==='dark');document.querySelector('meta[name=theme-color]')?.setAttribute('content',state.theme==='dark'?'#0b1120':'#101827');const b=$('[data-action="theme"]');if(b)b.innerHTML=icon(state.theme==='dark'?'sun':'moon');}
const navItems=[["today","Bugünkü çalışma","target"],["academy-projects","Haftalık projeler","rocket"],['home','Genel bakış','home'],['roadmap','Öğrenme yolu','route'],['dictionary','Terimler sözlüğü','book'],['cards','Tekrar kartları','cards'],['quiz','Kendini test et','quiz'],['lab','API laboratuvarı','code'],['sql-lab','SQL laboratuvarı','database'],['examples','Örnek kütüphanesi','layers'],['project','TaskFlow final projesi','rocket'],['progress','Gelişim grafikleri','target'],['notes','Not defterim','notes']];
const main=$('#main');let currentPage='home',lessonId=null;
let dictionaryCategory='Tümü',dictionarySearch='',dictionaryFavorites=false;
let flash=null,quiz=null;
let swReady=false;
let apiRows=[{id:1,baslik:'İlk API dersini tamamla',tamamlandi:false}],apiNext=2,labResponse=null,labBusy=false;
let labForm={method:'GET',path:'/api/gorevler',body:'{\n  "baslik": "SQL çalış",\n  "tamamlandi": false\n}'};
const moduleLessons=m=>C.lessons.filter(l=>l.module===m);
const nextLesson=()=>C.lessons.find(l=>!state.completed.includes(l.id))||C.lessons[0];
const completedCount=()=>C.lessons.filter(l=>state.completed.includes(l.id)).length;
const moduleDone=m=>moduleLessons(m).filter(l=>state.completed.includes(l.id)).length;
const remembered=()=>C.activeGlossary.filter(t=>state.review[t.id]?.level>0&&state.review[t.id].due>Date.now()).length;
function heading(title,description,extra=''){return `<div class="page-heading"><div><h1>${title}</h1>${description?`<p>${description}</p>`:''}</div>${extra}</div>`;}
function sourceLink(key){const r=C.refs[key];return r?`<a class="source-link" href="${r[1]}" target="_blank" rel="noopener noreferrer">${r[0]} ${icon('external')}</a>`:'';}
function codeBlock(code,label='C# / açıklamalı örnek',id=''){return `<div class="code-block"><div class="code-header"><span>${label}</span><button data-action="copy-code" ${id?`data-lesson="${id}"`:''}>Kopyala</button></div><pre tabindex="0" aria-label="Kaydırılabilir kod örneği"><code>${Academy.highlight(String(code),esc)}</code></pre></div>`;}
const academyApi=()=>({C,state,heading,esc,icon,codeBlock,english:false,sqlCount:sqlIds.length});
function home(){return Brand.home(academyApi());}
function roadmap(id){return Brand.roadmap(academyApi(),id);}
function reader(id){const l=findLesson(id);if(!l)return empty('Ders bulunamadı','Öğrenme yolundan bir ders seç.');const m=[...C.modules,...C.archiveModules].find(m=>m.id===l.module),done=state.completed.includes(id),archived=l.module==='ai',next=archived?null:C.lessons[l.order];state.lastLesson=id;save();return `<article class="reader"><a class="back-link" href="${archived?'#archive':'#roadmap/'+m.id}">${icon('back')} ${archived?'Ders arşivi':m.title}</a><header class="reader-heading"><span class="eyebrow">${archived?'Ders arşivi':m.title}</span><h1>${l.title}</h1><div class="reader-meta"><span>${icon('clock')} ${l.minutes} dakika</span><span>·</span><span>Başlangıç</span>${done?'<span class="pill green">Tamamlandı</span>':''}<button class="icon-button" data-action="bookmark" data-id="${id}" aria-pressed="${state.bookmarks.includes(id)}" aria-label="Dersi kaydet" style="${state.bookmarks.includes(id)?'color:#b39156':''}">${icon('star')}</button></div></header>${archived?'':Brand.lessonLinks(academyApi())}${archived?'':`<details class="academy-lesson-nav"><summary>Bu haftanın dersleri</summary><ol>${moduleLessons(m.id).map(item=>`<li><a class="text-link" href="#lesson/${item.id}" ${item.id===l.id?'aria-current="page"':''}>${esc(item.title)}</a></li>`).join('')}</ol></details>`}<div class="term-chips">${l.terms.map(t=>`<button class="chip" data-action="term-name" data-name="${esc(t)}">${esc(t)} ${icon('external')}</button>`).join('')}</div><div class="reader-content"><section class="reader-section" id="lesson-concept" tabindex="-1"><h2><span class="step-label">01</span> Nedir?</h2><p>${esc(l.definition)}</p></section>${Academy.lessonIntro(l,esc,false)}<section class="reader-section"><h2><span class="step-label">02</span> Ne işe yarar?</h2><p>${esc(l.purpose)}</p></section><section class="reader-section" id="lesson-code" tabindex="-1"><h2><span class="step-label">03</span> Nasıl kullanılır?</h2><p>${esc(l.usage)}</p>${codeBlock(l.code,l.language==='tr'?'Açıklamalı örnek':['sql','iliskisel'].includes(id)?'SQL / açıklamalı örnek':id==='backend'||id==='mimari'||id==='proje'||id==='mulakat'?'Kavramsal akış / örnek':'C# ve terminal / bağlamı oku',id)}<details><summary>Örneği adım adım incele</summary><ul class="walkthrough">${l.walkthrough.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></details></section>${l.examples?.length?`<details class="reader-section"><summary>Daha fazla çözümlü örnek</summary>${window.AtolyeFeatures.relatedExamples(l)}</details>`:''}<div class="warning"><strong>Sık yapılan hata</strong>${esc(l.mistake)}</div><section class="exercise" id="lesson-practice" tabindex="-1"><h2>Şimdi sen dene</h2><p>${esc(l.exercise)}</p>${l.practiceRoute?`<p><a class="text-link" href="#${l.practiceRoute}">${({"lab":"API laboratuvarını aç","sql-lab":"SQL laboratuvarını aç","project":"TaskFlow kontrol listesini aç"})[l.practiceRoute]} ${icon('arrow')}</a></p>`:''}<details><summary>Örnek çözümü göster</summary><div class="solution">${esc(l.solution)}</div></details></section><section class="reader-section"><label class="field-label" for="lesson-note">Bu dersten kendi notun</label><textarea id="lesson-note" data-note="${id}" maxlength="12000" placeholder="Kendi cümlelerinle bir açıklama veya aklına takılan bir soru…">${esc(state.notes[id]||'')}</textarea><div class="note-status" id="note-status">${state.notes[id]?'Bu cihazda kayıtlı.':'Yazdıkların bu tarayıcıda otomatik saklanır.'}</div></section><div>${sourceLink(l.ref)}<p class="external-note">Resmî kaynak · Yeni sekmede açılır, internet gerektirir.</p></div>${Academy.lessonSummary(l,next,state.academy.quiz[id],esc,false)}${done?`<div class="brand-lesson-finish">${Brand.art('lesson-done')}<p>Ders çalışma kaydına eklendi. Quiz ve pratik sonuçlarını ayrı takip edebilirsin.</p></div>`:''}<div class="lesson-bottom" id="lesson-quiz" tabindex="-1"><button class="button ${done?'button-outline':''}" data-action="complete" data-id="${id}">${icon(done?'refresh':'check')}${done?"Çalıştım işaretini kaldır":"Dersi çalıştım"}</button><a class="button button-outline" href="#quiz?lesson=${id}">Bu dersi test et ${icon('arrow')}</a>${next?`<a class="text-link" href="#lesson/${next.id}">Sonraki ders ${icon('arrow')}</a>`:archived?'':'<a class="text-link" href="#project">TaskFlow final projesi →</a>'}</div></div></article>`;}
function empty(title,desc){return `<div class="empty-state">${Brand.art('project-empty','quiz-result-art')}<h2>${title}</h2><p>${desc}</p><a class="button button-outline" href="#roadmap">Derslere git</a></div>`;}
function dictionary(){return `${heading('Terimler sözlüğü','Terimi ezberleme. Neyi çözdüğünü ve nerede kullanıldığını anla.',`<span class="pill">${C.activeGlossary.length} kavram</span>`)}<div class="search-box">${icon('search')}<input id="dictionary-search" type="search" placeholder="Terim veya açıklama ara…" aria-label="Terim veya açıklama ara" value="${esc(dictionarySearch)}" autocomplete="off"></div><div class="filter-row">${['Tümü','Temel','C#','Web','Veri','Güvenlik','Araçlar'].map(v=>`<button class="filter-btn ${dictionaryCategory===v?'active':''}" data-action="filter" data-category="${v}" aria-pressed="${dictionaryCategory===v}">${v}</button>`).join('')}<button class="filter-btn ${dictionaryFavorites?'active':''}" data-action="favorites-filter" aria-pressed="${dictionaryFavorites}">☆ Kaydettiklerim</button></div><div id="dictionary-results-count" class="count-note" role="status"></div><div class="dictionary-grid" id="dictionary-results"></div>`;}
function renderDictionary(){const search=fold(dictionarySearch),items=C.activeGlossary.filter(t=>(dictionaryCategory==='Tümü'||t.category===dictionaryCategory)&&(!dictionaryFavorites||state.favorites.includes(t.id))&&(!search||fold(`${t.term} ${t.definition} ${t.purpose}`).includes(search)));$('#dictionary-results-count').textContent=`${items.length} kavram gösteriliyor`;$('#dictionary-results').innerHTML=items.length?items.map(t=>`<button class="term-card" data-action="term" data-id="${t.id}"><span class="category">${t.category}</span>${state.favorites.includes(t.id)?'<span class="star-label" aria-label="Kaydedildi">★</span>':''}<h2>${esc(t.term)}</h2><p>${esc(t.definition)}</p><span class="term-open">Açıklama ve örnek ${icon('arrow')}</span></button>`).join(''):'<div class="empty-state">Bu aramada kavram bulunamadı. Farklı bir kelime veya kategori dene.</div>';}
function showDialog(html){$('#dialog-content').innerHTML=html;const dialog=$('#dialog');if(!dialog.open)dialog.showModal();}
function showTerm(id){const t=C.glossary[id];if(!t)return;showDialog(`<div class="dialog-header"><div><span class="eyebrow">${t.category}</span><h2 id="dialog-title">${esc(t.term)}</h2></div><button class="icon-button" data-action="close-dialog" aria-label="Pencereyi kapat">${icon('close')}</button></div><div class="dialog-section"><strong>NEDİR?</strong><p>${esc(t.definition)}</p></div><div class="dialog-section"><strong>NE İŞE YARAR?</strong><p>${esc(t.purpose)}</p></div><div class="dialog-section"><strong>KULLANIM ÖRNEĞİ</strong><div class="example-text">${esc(t.example)}</div></div><div class="warning"><strong>Aklında kalsın</strong>${esc(t.warning)}</div><div class="dialog-actions"><button class="button button-outline" data-action="favorite" data-id="${id}">${icon('star')} ${state.favorites.includes(id)?'Kaydı kaldır':'Tekrara kaydet'}</button><button class="button" data-action="close-dialog">Anladım ${icon('check')}</button></div>`);}
function startFlash(favorites=false,all=false){const now=Date.now();let pool=C.activeGlossary.filter(t=>(!favorites||state.favorites.includes(t.id))&&(all||!state.review[t.id]||state.review[t.id].due<=now));pool.sort((a,b)=>(state.review[a.id]?.due||0)-(state.review[b.id]?.due||0));flash={ids:pool.slice(0,10).map(t=>t.id),index:0,revealed:false,known:0,favorites};render(false);}
function cards(){const due=C.activeGlossary.filter(t=>!state.review[t.id]||state.review[t.id].due<=Date.now()).length;return `${heading('Tekrar kartları','Önce kendi açıklamanı düşün. Sonra çevir ve kendini değerlendir.',`<span class="pill">${due} kart hazır</span>`)}<div class="flash-wrap"><div class="filter-row"><button class="filter-btn" data-action="flash-start">Sıradaki 10 kart</button><button class="filter-btn" data-action="flash-favorites">☆ Kaydettiklerim</button><button class="filter-btn" data-action="flash-all">Tümünden çalış</button></div>${flashHTML()}</div>`;}
function flashHTML(){if(!flash)return `<div class="panel"><span class="module-icon purple">${icon('cards')}</span><h2 style="margin-top:18px">Kavramları kendi cümlenle anlat.</h2><p class="muted" style="font-size:13px">Her oturumda en fazla 10 kart. Bildiklerin daha ileri bir tarihe, tekrar gerekenler 15 dakika sonrasına planlanır. Bu bir öz değerlendirme; sınav sonucu değildir.</p><button class="button" data-action="flash-start">Tekrara başla ${icon('arrow')}</button></div>`;
 if(flash.index>=flash.ids.length)return `<div class="panel flash-empty">${icon('check')}<h2>${flash.ids.length?'Tekrar oturumu tamamlandı':'Şu an bu grupta kart yok'}</h2><p class="muted">${flash.ids.length?`${flash.ids.length} kart çalıştın, ${flash.known} kartta “biliyorum” dedin.`:flash.favorites?'Sözlükten kavramları yıldızlayarak bu gruba ekleyebilirsin.':'Planlı tekrar zamanı gelince kartlar yeniden görünür. İstersen tüm kartlardan çalış.'}</p><div class="inline-buttons" style="justify-content:center"><button class="button" data-action="flash-start">Sıradaki kartlar</button><a class="button button-outline" href="#dictionary">Sözlüğe git</a></div></div>`;
 const t=C.glossary[flash.ids[flash.index]];return `<div class="flash-progress"><span>${flash.index+1} / ${flash.ids.length} kart</span><span>${flash.favorites?'Kaydedilen kavramlar':'Karışık tekrar'}</span></div><button class="flash-card ${flash.revealed?'revealed':''}" data-action="flash-flip" aria-label="${flash.revealed?'Kartın ön yüzüne dön':'Cevabı görmek için kartı çevir'}"><span class="eyebrow">${t.category}</span><h2>${esc(t.term)}</h2>${flash.revealed?`<p>${esc(t.definition)}</p><small>${esc(t.example)}</small>`:`<p>Bu kavram ne demek?<br>Hangi durumda kullanırsın?</p><small>Yanıtı görmek için karta dokun ${icon('refresh')}</small>`}</button><div class="flash-controls"><button class="button button-outline" data-action="flash-again" ${!flash.revealed?'disabled':''}>${icon('refresh')} Tekrar gerekli</button><button class="button" data-action="flash-known" ${!flash.revealed?'disabled':''}>${icon('check')} Biliyorum</button></div><p class="tiny-note">Kartı çevirdikten sonra kendini değerlendir. Biliyorum: 1, 3, 7, 14, 30 gün sonra tekrar. Tekrar gerekli: 15 dakika sonra.</p>`;
}
function gradeFlash(known){if(!flash||!flash.revealed||flash.index>=flash.ids.length)return;const id=flash.ids[flash.index],old=state.review[id]||{level:0,due:0};const level=known?Math.min(old.level+1,5):0;state.review[id]={level,due:Date.now()+(known?[1,3,7,14,30][level-1]*86400000:15*60000)};if(known)flash.known++;flash.index++;flash.revealed=false;activity('terms');render(false);}
function quizPage(params){
 if(params.get('diagnostic')==='1')return `${heading("Başlangıç seviye testi","C#, HTTP ve SQL için dokuz soru. Sonuç, hangi konuları tekrar edeceğini gösterir.")}<div class="quiz-shell">${quiz?quizHTML():`<div class="quiz-start"><button class="button" data-action="diagnostic-start">Seviye testine başla ${icon('arrow')}</button></div>`}</div>`;
 const lesson=params.get('lesson');if(lesson&&!quiz){const l=findLesson(lesson);if(l)return `${heading('Ders testi',l.title)}<div class="quiz-shell"><div class="quiz-start"><h2>Bu dersten ${C.questions.filter(q=>q.lesson===l.id).length} soru</h2><p>Yanıt verdikten sonra açıklamayı oku. Sonuç, ders ilerlemesinden ayrı tutulur.</p><button class="button" data-action="quiz-start" data-lesson="${l.id}">Teste başla ${icon('arrow')}</button></div></div>`;}
 return `${heading('Kendini test et','Kısa sorular, anında açıklama ve yanlışlarına özel tekrar.',`<span class="pill">${C.activeQuestions.length} soru</span>`)}<div class="quiz-shell">${quiz?quizHTML():`<section class="quiz-start"><span class="module-icon green">${icon('quiz')}</span><h2 style="margin-top:20px">Ne kadarını anladığını gör.</h2><p>Sorular hem kavramı hem de kullanımını yoklar. Yanlış yapmak çalışmanın parçası: her yanıtın gerekçesi var.</p><div class="form-row"><div><label class="field-label" for="quiz-scope">Çalışma alanı</label><select id="quiz-scope"><option value="all">Tüm konular</option><option value="completed">Tamamladığım dersler</option><option value="wrong">Yanlış yaptığım sorular (${C.activeQuestions.filter(q=>state.wrong.includes(q.id)).length})</option>${C.modules.map(m=>`<option value="${m.id}">${m.title}</option>`).join('')}</select></div><div><label class="field-label" for="quiz-count">Soru sayısı</label><select id="quiz-count"><option value="5">5 soru · kısa tekrar</option><option value="10">10 soru · genel tekrar</option><option value="20">20 soru · kapsamlı tekrar</option><option value="40">40 soru · uzun tekrar</option></select></div></div><button class="button" data-action="quiz-start">Teste başla ${icon('arrow')}</button>${state.history.length?`<p class="session-complete">Son testin: ${state.history.at(-1).score} / ${state.history.at(-1).total} doğru. ${C.activeQuestions.filter(q=>state.wrong.includes(q.id)).length} soru tekrar bekliyor.</p>`:''}</section>`}</div>`;}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startQuiz(lesson){let pool=lesson?C.questions:C.activeQuestions;const scope=$('#quiz-scope')?.value||'all',count=Number($('#quiz-count')?.value)||5;if(lesson)pool=pool.filter(q=>q.lesson===lesson);else if(scope==='completed')pool=pool.filter(q=>state.completed.includes(q.lesson));else if(scope==='wrong')pool=pool.filter(q=>state.wrong.includes(q.id));else if(scope!=='all')pool=pool.filter(q=>findLesson(q.lesson)?.module===scope);if(!pool.length){toast(scope==='completed'?'Önce bir dersi tamamla.':scope==='wrong'?'Henüz tekrar bekleyen yanlışın yok.':'Bu alanda soru yok.');return;}quiz={lesson,ids:shuffle(pool).slice(0,lesson?pool.length:count).map(q=>q.id),index:0,answers:[],selected:null,finished:false};render(false);}
function startDiagnostic(){
 const pool=Academy.diagnosticPool(C);
 quiz={ids:pool.map(q=>q.id),diagnostic:Object.fromEntries(pool.map(q=>[q.id,q.topic])),index:0,answers:[],selected:null,finished:false};
 render(false);
}
function quizHTML(){
 if(!quiz.optionOrders)quiz.optionOrders=Object.fromEntries(quiz.ids.map(id=>[id,shuffle(C.questions[id].options.map((_,index)=>index))]));
 if(quiz.finished){const score=quiz.answers.filter(a=>a.correct).length;return `<div class="panel">${Brand.art(score/quiz.ids.length>=.8?'quiz-pass':'quiz-retry','quiz-result-art')}<span class="eyebrow">TEST TAMAMLANDI</span><div class="result-score">${score}<span> / ${quiz.ids.length}</span></div><h2>${score===quiz.ids.length?'Bu turdaki tüm sorular doğru.':'Yanlışlarını inceleyerek pekiştir.'}</h2><p class="muted" style="font-size:12px">Bu sonuç bir tekrar göstergesi. Kavramları kendi projen üzerinde uygulamaya devam et.</p>${quiz.diagnostic?`<h3>Konu bazında sonuç</h3><ul>${Object.entries(state.academy.diagnostic).map(([topic,result])=>`<li>${esc(topic)} · ${result.score}/${result.total}</li>`).join('')}</ul>`:''}<div class="result-list">${quiz.answers.map(a=>{const q=C.questions[a.id],l=findLesson(q.lesson);return `<div class="result-item"><strong>${a.correct?'✓':'↻'} ${esc(q.question)}</strong><p>Doğru yanıt: ${esc(q.options[q.answer])}<br>${esc(q.explanation)}</p>${!a.correct?`<a class="text-link" href="#lesson/${l.id}">${l.title} dersine dön ${icon('arrow')}</a>`:''}</div>`}).join('')}</div><button class="button" data-action="quiz-reset">Yeni test hazırla ${icon('refresh')}</button></div>`;}
 const q=C.questions[quiz.ids[quiz.index]],answered=quiz.selected!==null;return `<div class="flash-progress"><span>Soru ${quiz.index+1} / ${quiz.ids.length}</span><button class="filter-btn" data-action="quiz-cancel">Testi bırak</button></div><div class="progress-track"><span style="width:${quiz.index/quiz.ids.length*100}%"></span></div><h2 class="quiz-question">${esc(q.question)}</h2>${q.code?codeBlock(q.code,'Sorudaki kod'):''}<span class="pill">${q.kind||'Kavram'}</span>${(quiz.optionOrders?.[q.id]||q.options.map((_,i)=>i)).map((i,position)=>`<button class="quiz-option ${answered&&i===q.answer?'correct':answered&&i===quiz.selected?'wrong':''}" data-action="quiz-answer" data-index="${i}" ${answered?'disabled':''}><span>${'ABCD'[position]}</span>${esc(q.options[i])}</button>`).join('')}${answered?`<div class="feedback ${quiz.selected===q.answer?'':'feedback-retry'}" role="status" tabindex="-1">${Brand.art(quiz.selected===q.answer?'quiz-pass':'quiz-retry')}<div><strong>${quiz.selected===q.answer?'Doğru yanıt.':'Doğru yanıt: '+esc(q.options[q.answer])}</strong>${esc(q.explanation)}${quiz.selected===q.answer?'':`<br><a class="text-link" href="#lesson/${q.lesson}">İlgili dersi aç ${icon('arrow')}</a>`}</div></div><button class="button button-full" data-action="quiz-next">${quiz.index+1===quiz.ids.length?'Sonucu gör':'Sonraki soru'} ${icon('arrow')}</button>`:'<p class="tiny-note">Bir yanıt seç. Ardından nedenini birlikte inceleyelim.</p>'}`;
}
function answerQuiz(index){if(!quiz||quiz.finished||quiz.selected!==null)return;const q=C.questions[quiz.ids[quiz.index]];if(index<0||index>=q.options.length)return;quiz.selected=index;quiz.answers.push({id:q.id,selected:index,correct:index===q.answer});render(false);$('.feedback')?.focus({preventScroll:true});}
function nextQuiz(){if(!quiz||quiz.selected===null||quiz.finished)return;quiz.index++;quiz.selected=null;if(quiz.index===quiz.ids.length){quiz.finished=true;Academy.recordQuiz(state.academy,quiz,C);state.history.push({at:Date.now(),score:quiz.answers.filter(a=>a.correct).length,total:quiz.ids.length});state.history=state.history.slice(-100);for(const a of quiz.answers){if(a.correct)state.wrong=state.wrong.filter(i=>i!==a.id);else if(!state.wrong.includes(a.id))state.wrong.push(a.id);}activity('quizzes');}render(false);}
function lab(){return `${heading('API laboratuvarı','İsteği gönder, akışı izle, durum kodunun nedenini anla.',`<span class="pill">Etkileşimli simülasyon</span>`)}<p class="intro-note">Bu laboratuvar tarayıcı içinde çalışır; gerçek bir .NET sunucusuna istek göndermez. Kayıtlar bu oturumun belleğindedir. Gerçek C# geliştirmesi için derslerdeki bilgisayar adımlarını uygula.</p><div class="lab-grid"><section class="panel"><h2>İsteğin</h2><div class="lab-presets">${[['list','Listele'],['create','Ekle'],['update','Güncelle'],['delete','Sil'],['invalid','Boş başlık'],['missing','Olmayan kayıt']].map(([p,l])=>`<button class="filter-btn" data-action="lab-preset" data-preset="${p}">${l}</button>`).join('')}</div><div class="lab-row"><div><label class="field-label" for="lab-method">Metot</label><select id="lab-method">${['GET','POST','PUT','DELETE'].map(m=>`<option ${labForm.method===m?'selected':''}>${m}</option>`).join('')}</select></div><div><label class="field-label" for="lab-path">Endpoint</label><input class="input" id="lab-path" value="${esc(labForm.path)}" spellcheck="false"></div></div><label class="field-label" for="lab-body">JSON gövdesi <span class="muted">· POST ve PUT için</span></label><textarea id="lab-body" spellcheck="false">${esc(labForm.body)}</textarea><button class="button button-full" style="margin-top:15px" data-action="lab-send" ${labBusy?'disabled':''}>${icon('play')} ${labBusy?'İşleniyor…':'İsteği gönder'}</button><p class="tiny-note">POST: başlık gerekli. PUT: başlık ve tamamlandi (bool) gerekli. Başlık en fazla 100 karakter.</p></section><section class="panel"><h2>Yanıt</h2>${labResponse?.code===201?`<div class="brand-success-state">${Brand.art('api-first')}<p>İstek başarılı. Yeni görev kaydedildi.</p></div>`:''}<div class="flow" aria-label="Simüle edilen istek akışı">${[['İstemci','1'],['Routing','2'],['Doğrulama','3'],['Bellek','4']].map(([n,v])=>`<div class="flow-step ${labResponse&&+v<=labResponse.step?'active':''}"><span class="flow-circle">${v}</span>${n}</div>`).join('')}</div>${labResponse?`<span class="lab-status ${labResponse.code>=400?'error':''}">${labResponse.code} ${labResponse.status}</span>${codeBlock(labResponse.code===204?'(204 yanıtında gövde yok)':JSON.stringify(labResponse.body,null,2),'JSON / simüle edilen yanıt')}<p class="lab-explain" role="status">${esc(labResponse.explain)}</p>${labResponse.location?`<div class="example-text">Location: ${esc(labResponse.location)}</div>`:''}`:'<div class="empty-state" style="margin-top:15px">Henüz bir istek göndermedin.<br>“Listele” ile başlayabilirsin.</div>'}</section></div><section class="panel"><div class="section-header" style="margin-top:0"><div><h2>Oturumdaki kayıtlar</h2><p>${apiRows.length} kayıt · Sayfa yeniden yüklenince başlangıca döner</p></div><button class="filter-btn" data-action="lab-reset">Sıfırla</button></div><div class="project-preview">${esc(JSON.stringify(apiRows,null,2))}</div><div class="inline-buttons" style="margin-top:16px"><a class="text-link" href="#lesson/http">HTTP dersini aç ${icon('arrow')}</a><a class="text-link" href="#lesson/dto">DTO ve doğrulama ${icon('arrow')}</a></div></section>`;}
function runLab(method,path,body){
 let url;try{url=new URL(path,'https://local.invalid');}catch{return {code:400,status:'Bad Request',body:{hata:'Geçerli bir endpoint yaz.'},step:1,explain:'Adres çözümlenemedi.'};}
 const match=url.pathname.match(/^\/api\/gorevler(?:\/([1-9]\d*))?\/?$/);
 if(!match||url.origin!=='https://local.invalid')return {code:404,status:'Not Found',body:{hata:'Endpoint bulunamadı.'},step:2,explain:'Bu simülasyon yalnızca /api/gorevler ve /api/gorevler/{id} adreslerini destekler.'};
 const id=match[1]?Number(match[1]):null;
 const unsupported=(method==='POST'&&id!==null)||(['PUT','DELETE'].includes(method)&&id===null);
 if(unsupported)return {code:405,status:'Method Not Allowed',body:{hata:'Bu metot bu adreste desteklenmiyor.'},step:2,explain:'POST koleksiyon adresine, PUT ve DELETE ise Id içeren kaynağa gönderilir.'};
 if(method==='GET'){
  if(id===null){let items=[...apiRows];const done=url.searchParams.get('tamamlandi');if(done!==null&&!['true','false'].includes(done))return {code:400,status:'Bad Request',body:{hata:'tamamlandi true veya false olmalı.'},step:3,explain:'Query string değeri beklenen türde olmalı.'};if(done!==null)items=items.filter(r=>r.tamamlandi===(done==='true'));return {code:200,status:'OK',body:items,step:4,explain:'GET kayıtları okudu. Boş liste de başarılı bir 200 yanıtıdır; kayıt oluşturulmadı.'};}
  const row=apiRows.find(r=>r.id===id);return row?{code:200,status:'OK',body:{...row},step:4,explain:'İstenen Id bulundu ve JSON olarak döndürüldü.'}:notFound();
 }
 if(['POST','PUT'].includes(method)){
  let dto;try{dto=JSON.parse(body);}catch{return {code:400,status:'Bad Request',body:{hata:'JSON geçerli değil.'},step:3,explain:'JSON ayrıştırılamadı. Çift tırnak ve virgülleri kontrol et. Kayıt değişmedi.'};}
  if(!dto||Array.isArray(dto)||typeof dto!=='object')return {code:400,status:'Bad Request',body:{hata:'JSON nesnesi gerekli.'},step:3,explain:'Gövde bir nesne olmalı; null, dizi veya basit değer kabul edilmez.'};
  if(typeof dto.baslik!=='string'||!dto.baslik.trim()||dto.baslik.trim().length>100)return {code:400,status:'Bad Request',body:{hata:'Başlık 1-100 karakter olmalı.'},step:3,explain:'Sunucu tarafı doğrulamasını simüle ettik. Boş veya uzun başlık kaydedilmedi.'};
  if(method==='PUT'&&typeof dto.tamamlandi!=='boolean')return {code:400,status:'Bad Request',body:{hata:'tamamlandi bir bool olmalı.'},step:3,explain:'Bu laboratuvarın PUT sözleşmesi başlık ve tamamlanma durumunu birlikte ister. "true" metni bool değildir.'};
  if(method==='POST'){const row={id:apiNext++,baslik:dto.baslik.trim(),tamamlandi:false};apiRows.push(row);return {code:201,status:'Created',body:{...row},step:4,location:'/api/gorevler/'+row.id,explain:'Yeni kaynak oluşturuldu. Kimliği sunucu belirledi; POST isteğindeki ek tamamlandi alanı dikkate alınmadı. Location yeni kaynağın adresidir.'};}
  const row=apiRows.find(r=>r.id===id);if(!row)return notFound();row.baslik=dto.baslik.trim();row.tamamlandi=dto.tamamlandi;return {code:200,status:'OK',body:{...row},step:4,explain:'Kaydın güncellenebilir alanları değiştirildi. Güncel kaynak gövdesiyle 200 döndürüldü.'};
 }
 if(method==='DELETE'){const i=apiRows.findIndex(r=>r.id===id);if(i<0)return notFound();apiRows.splice(i,1);return {code:204,status:'No Content',body:null,step:4,explain:'Kayıt silindi. 204 başarı bildirir ve gövde taşımaz. Aynı Id yeniden istenirse 404 döner.'};}
 return {code:405,status:'Method Not Allowed',body:{hata:'Desteklenmeyen metot.'},step:2,explain:'GET, POST, PUT ve DELETE desteklenir.'};
}
function notFound(){return {code:404,status:'Not Found',body:{hata:'Görev bulunamadı.'},step:4,explain:'Endpoint eşleşti fakat bu Id ile kayıt yok. Routing hatası ile kayıt bulunamaması farklı aşamalardır.'};}
function captureLab(){if($('#lab-method'))labForm={method:$('#lab-method').value,path:$('#lab-path').value,body:$('#lab-body').value};}
function labPreset(p){captureLab();const presets={list:['GET','/api/gorevler',labForm.body],create:['POST','/api/gorevler','{\n  "baslik": "SQL çalış"\n}'],update:['PUT','/api/gorevler/1','{\n  "baslik": "İlk API dersini tamamla",\n  "tamamlandi": true\n}'],delete:['DELETE','/api/gorevler/1',labForm.body],invalid:['POST','/api/gorevler','{\n  "baslik": "   "\n}'],missing:['GET','/api/gorevler/999',labForm.body]};const v=presets[p];if(v){labForm={method:v[0],path:v[1],body:v[2]};render(false);}}
function project(){
 const start=C.legacyProjectLength;
 const total=C.projectSteps.length-start;
 const done=state.project.filter(index=>index>=start).length;
 const check=(step,index)=>`<label class="project-check"><input type="checkbox" data-project="${index}" ${state.project.includes(index)?'checked':''}><span>${esc(step)}</span></label>`;
 return `${heading('TaskFlow final projesi','Öğrendiklerini küçük, çalışan ve açıklayabildiğin bir projede birleştir.',`<span class="pill">${done} / ${total} adım</span>`)}<div class="project-columns"><section class="panel"><h2>Uygulama kontrol listen</h2><p class="intro-note">Kutuları ancak bilgisayarında gerçekten denediğinde işaretle. Bu liste projeyi senin yerine oluşturmaz.</p><div class="progress-track" style="margin:20px 0"><span style="width:${done/total*100}%"></span></div>${C.projectSteps.slice(start).map((step,index)=>check(step,index+start)).join('')}<details><summary>Önceki SQLite alıştırmasının kontrol listesi</summary>${C.projectSteps.slice(0,start).map(check).join('')}</details></section><aside><section class="panel"><span class="module-icon teal">${icon('rocket')}</span><h2 style="margin-top:17px">Küçük kapsam. Gerçek uygulama.</h2><p class="muted" style="font-size:12px">C# · ASP.NET Core · EF Core · SQL Server<br>Yerelde geliştir ve hazırlık ortamında doğrula.</p><div class="project-preview">GET    /api/gorevler\nGET    /api/gorevler/{id}\nPOST   /api/gorevler\nPUT    /api/gorevler/{id}\nDELETE /api/gorevler/{id}</div><p class="tiny-note">İstersen HTTP akışını SQLite alıştırmasıyla dene. Final projesi için SQL Server ve güvenlik derslerini takip edip kontrol listesini uygula.</p></section><section class="panel"><h2>Bitmiş sayılması için</h2><ul style="font-size:12px;padding-left:18px;color:var(--muted)"><li>Yeniden başlatınca veri duruyor.</li><li>Geçersiz istekler kayıt oluşturmuyor.</li><li>Olmayan kayıt doğru yanıtı veriyor.</li><li>Test ve README ile tekrar çalıştırılabiliyor.</li></ul><a class="button button-outline button-full" href="./downloads/GorevApi_Calisma_Paketi.zip" download>SQLite başlangıç alıştırmasını indir</a><a class="button button-outline button-full" style="margin-top:10px" href="#lesson/proje">Proje dersini oku ${icon('arrow')}</a></section><section class="panel"><h2>CV’ye ne zaman eklenir?</h2><p class="muted" style="font-size:12px">Proje çalıştığında, katkını açıklayabildiğinde ve özelliklerini doğruladığında. Tamamlamadığın bir özelliği yapılmış gibi yazma.</p></section></aside></div>`;}
function notes(){const noted=allLessons.filter(l=>state.notes[l.id]?.trim()),bookmarked=allLessons.filter(l=>state.bookmarks.includes(l.id));return `${heading('Not defterim','Derslerden çıkardığın notlar ve tekrar dönmek istediğin başlıklar.')}<div class="section-header"><h2>Kaydettiğin dersler</h2><span class="count-note">${bookmarked.length} ders</span></div>${bookmarked.length?`<div class="term-chips">${bookmarked.map(l=>`<a class="chip" href="#lesson/${l.id}">☆ ${l.title} ${icon('arrow')}</a>`).join('')}</div>`:'<p class="intro-note">Dersin üstündeki yıldızla buraya ekleyebilirsin.</p>'}<div class="section-header"><h2>Ders notların</h2><button class="text-link" data-action="export" style="border:0;background:none">Yedeği dışa aktar ${icon('download')}</button></div><div class="notes-list">${noted.length?noted.map(l=>`<article class="panel"><span class="eyebrow">DERS ${String(l.order).padStart(2,'0')}</span><h2>${l.title}</h2><p>${esc(state.notes[l.id])}</p><a class="text-link" href="#lesson/${l.id}">Notu düzenle ${icon('arrow')}</a></article>`).join(''):empty('Henüz not eklemedin','Bir dersin altındaki not alanına kendi açıklamanı yaz. Notların otomatik kaydedilir.')}</div>`;}
function practice(){return `${heading('Pekiştirme alanın','Okuduğunu hatırla, nedenini açıkla ve akışı dene.')}<div class="practice-grid">${[['quiz','quiz',"Quiz ve seviye testi"],['dictionary','book',"Terimler sözlüğü"],['cards','cards','Tekrar kartları','Kavramları kendi cümlenle açıklamayı dene. Sonra kartı çevir ve kendini değerlendir.'],['quiz','quiz','Kısa testler','Her yanıtın gerekçesini gör. Yanlış yaptığın konulara geri dön.'],['lab','code','API laboratuvarı','GET, POST, PUT ve DELETE işlemlerinin sonuçlarını tarayıcıda simüle et.'],['sql-lab','database','SQL laboratuvarı','Gerçek SQLite motorunda sorgu yaz, JOIN ve GROUP BY çalıştır, sonuçları karşılaştır.'],['examples','layers','Örnek kütüphanesi','Çözümlü örnekler, açık lisanslı GitHub dosyaları ve indirilebilir çalışma paketi.']].map(([url,ic,t,d])=>`<section class="panel"><span class="module-icon teal">${icon(ic)}</span><h2>${t}</h2><p>${d}</p><a href="#${url}" class="button button-outline">Başla ${icon('arrow')}</a></section>`).join('')}</div>`;}
function settings(){return `${heading('Ayarlar ve kurulum','Atölyeni telefonuna ekle, çalışma verini koru ve kaynakları keşfet.')}${window.PublicFeatures.profileForm()}${Reminders.panel(false)}<div class="settings-grid">${window.InstallManager.panel()}<section class="panel"><h2>Çalışma tercihlerin</h2><label class="field-label" for="daily-goal">Önerilen günlük süre</label><select id="daily-goal">${[15,20,30].map(n=>`<option value="${n}" ${state.goal===n?'selected':''}>${n} dakika</option>`).join('')}</select><p style="margin-top:12px">Bu süre bir plan önerisi; uygulama kapalıyken süre ölçmez veya bildirim göndermez.</p><div class="status-line"><span>Görünüm</span><button class="filter-btn" data-action="theme">${state.theme==='dark'?'Açık temaya geç':'Koyu temaya geç'}</button></div><h3>Notların ve ilerlemen</h3><p>Kayıtlar bu cihazdaki bu tarayıcıda tutulur. Telefon ve bilgisayar arasında otomatik eşitleme yapılmaz. Tarayıcı verileri temizlenirse kayıtlar silinebilir; başka cihaza taşımak için yedek kullan.</p><div class="settings-actions"><button class="button button-outline" data-action="export">${icon('download')} Yedeği dışa aktar</button><button class="button button-outline" data-action="import">${icon('upload')} Yedekten yükle</button></div><p class="tiny-note">İçe aktarma mevcut ilerleme ve notların yerini alır; işlemden önce onay istenir.</p><h3>Yeni başlangıç</h3><p>Notlar, test geçmişi ve tamamlanan dersler dahil bu tarayıcıdaki çalışma kaydını sıfırlar.</p><button class="filter-btn" data-action="reset-confirm">Çalışma kaydını sıfırla</button></section><section class="panel" style="grid-column:1/-1"><h2>Kaynaklar ve öğrenme yaklaşımı</h2><p><a class="text-link" href="#examples">GitHub örnekleri ve lisanslı dosyaları aç →</a></p><p><a class="text-link" href="#archive">Ders arşivi →</a></p><p>Dersler başlangıç seviyesine göre Türkçe hazırlanmıştır. Kavramları uygulamayla pekiştirmen için aşağıdaki resmî kaynaklara başvurabilirsin. Örnekler öğretim amaçlıdır; tamamı üretime hazır bir sistem değildir.</p><div class="ref-list">${Object.entries(C.refs).filter(([key])=>!['llm','ichat','rag','tools'].includes(key)).map(([,value])=>value).map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${t} ${icon('external')}</a>`).join('')}<a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing" target="_blank" rel="noopener noreferrer">Telefon kurulum rehberi (MDN) ${icon('external')}</a></div><p style="margin-top:20px">Öğrenme rotası: .NET 10 / ASP.NET Core 10 / EF Core 10. Örnek paket sürümleri taban sürümdür; gerçek projede desteklenen güncel yamaları kullan. Dersleri tamamlamak bir iş deneyimi veya yeterlilik belgesi anlamına gelmez.</p></section></div>`;}
function archive(){
 const saved=C.glossary.filter(t=>!C.activeGlossary.includes(t)&&state.favorites.includes(t.id));
 return `${heading("Ders arşivi","Önceki yapay zekâ derslerine, notlarına ve yer işaretlerine buradan ulaşabilirsin. Bu dersler 6 haftalık öğrenme yolunun dışında.")}<div class="menu-list">
   ${C.archiveLessons.map(l=>`<a href="#lesson/${l.id}">${esc(l.title)} ${icon('chevron')}</a>`).join('')}
   <a href="#ai-lab">Arşivdeki LLM laboratuvarı ${icon('chevron')}</a>
 </div>${saved.length?`<h2>Arşivde kaydettiğin terimler</h2><div class="term-chips">${saved.map(t=>`<button class="chip" data-action="term" data-id="${t.id}">${esc(t.term)}</button>`).join('')}</div>`:''}`;
}
function more(){return `${heading('Çalışma araçların','Tekrar, uygulama ve notlarını bir arada tut.')}<div class="menu-list">${[['quiz','quiz',"Quiz ve seviye testi"],['dictionary','book',"Terimler sözlüğü"],['cards','cards','Tekrar kartları'],['lab','code','API laboratuvarı'],['sql-lab','database','SQL laboratuvarı'],['examples','layers','Örnek kütüphanesi'],['progress','target','Gelişim grafikleri'],['project','rocket','TaskFlow final projesi'],['notes','notes','Not defterim'],['settings','settings','Ayarlar ve telefon kurulumu']].map(([p,i,t])=>`<a href="#${p}">${icon(i)} ${t} ${icon('chevron')}</a>`).join('')}</div>`;}
function nav(){
 const active=currentPage==='lesson'?'roadmap':currentPage;
 $('#desktop-nav').innerHTML=Brand.navigation({items:navItems,active,icon,english:false});
 const mobile=[["home","Ana sayfa","home"],["roadmap","Dersler","route"],["today","Bugün","target"],["academy-projects","Projeler","rocket"],["more","Araçlar","more"]];
 $('#mobile-nav').innerHTML=mobile.map(([route,label,symbol])=>{
  const on=active===route||(route==='academy-projects'&&active==='project')||
   (route==='more'&&['practice','quiz','lab','sql-lab','dictionary','cards','examples','settings','progress','notes','install','archive','ai-lab'].includes(active));
  return `<a class="bottom-link ${on?'active':''}" href="#${route}" ${on?'aria-current="page"':''}>${icon(symbol)}${label}</a>`;
 }).join('');
 const activeLabel=navItems.find(item=>item[0]===active)?.[1];
 $('#breadcrumb').textContent=activeLabel||"Çalışma alanı";
}
function render(scroll=true){
 const raw=location.hash.slice(1)||'home', [route,query='']=raw.split('?'),[page,id]=route.split('/');currentPage=page;lessonId=page==='lesson'?id:null;const params=new URLSearchParams(query);
 if(page==='roadmap'&&id==='ai'){location.replace('#archive');return;}
 const knownPages=['archive','home','today','academy-projects','roadmap','lesson','dictionary','cards','quiz','lab','project','notes','settings','install','examples','sql-lab','more','practice','progress','ai-lab'];if(!knownPages.includes(page)){location.hash='home';return;}
 let html=({archive,today:()=>Academy.today(academyApi(),params),'academy-projects':()=>Brand.projects(academyApi(),params),progress:()=>window.PublicFeatures.progress()+Academy.analytics(academyApi()),'ai-lab':window.PublicFeatures.aiLab,home,roadmap:()=>roadmap(id),dictionary,cards,lab,project,notes,settings,more,practice,install:installPage,examples:window.AtolyeFeatures.examples,'sql-lab':window.AtolyeFeatures.sqlPage}[page]||(()=>page==='lesson'?reader(id):quizPage(params)))();
 if(!storageOK)html='<div class="storage-warning" role="alert">Tarayıcı kaydı kullanılamıyor veya eski kayıt okunamadı. İlerlemeni korumak için Ayarlar’dan düzenli yedek al.</div>'+html;
 main.innerHTML=html;window.PublicFeatures.refreshProfile();nav();applyTheme();window.InstallManager.notify();document.title=(page==='home'?'Çalışma alanın':page==='lesson'?findLesson(id)?.title||'Ders':$('#main h1')?.textContent||'Atölye')+' · Backend Atölyesi';
 if(page==='dictionary'){renderDictionary();const term=params.get('term');if(term){const t=C.glossary.find(t=>fold(t.term)===fold(term));if(t)showTerm(t.id);}}
 if(scroll){window.scrollTo({top:0,behavior:'instant'});if(page==='roadmap'&&id)setTimeout(()=>document.getElementById('module-'+(C.legacyModules[id]||id))?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}),50);}
}
function installPage(){return heading('Android ve iPhone kurulumu','Uygulamayı ana ekranına ekle ve kendi öğrenme alanından devam et.')+window.InstallManager.panel();}
async function install(){
 const result=await window.InstallManager.install();
 if(result.status==='installed'){toast('Uygulama zaten ana ekranından çalışıyor.');return;}
 if(result.status==='accepted'){toast('Kurulum isteği onaylandı. Ana ekranını kontrol et.');return;}
 if(result.status==='dismissed'){toast('Kurulum penceresi kapatıldı. Chrome menüsünden tekrar deneyebilirsin.');return;}
 if(location.hash!=='#install')location.hash='install';
 else {await window.InstallManager.check();render(false);}
}
function exportData(){const data=JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2),url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='backend-atolyesi-yedek-'+today()+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Çalışma yedeğin indirildi.');}
let pendingImport=null;
function confirmReset(){showDialog(`<div class="dialog-header"><h2 id="dialog-title">Çalışma kaydını sıfırla?</h2><button class="icon-button" data-action="close-dialog" aria-label="Kapat">${icon('close')}</button></div><p>Notların, tamamlanan derslerin, kart ve test geçmişin bu tarayıcıdan silinecek. Önce yedek alabilirsin.</p><div class="settings-actions"><button class="button button-outline" data-action="export">Önce yedek al</button><button class="button button-danger" data-action="reset">Kaydı sıfırla</button><button class="button button-outline" data-action="close-dialog">Vazgeç</button></div>`);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Kopyalandı.');}catch{toast('Tarayıcı panoya erişemedi. Metni seçerek kopyalayabilirsin.');}}
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,id=b.dataset.id;
 if(a==='nav-toggle'){
  const compact=document.body.classList.toggle('nav-compact');
  b.setAttribute('aria-expanded',String(!compact));
  try{localStorage.setItem('backend-atolyesi-nav',compact?'compact':'expanded');}catch{}
  return;
 }
 if(a==='lesson-jump'){
  const target=document.getElementById(id);
  target?.focus({preventScroll:true});
  target?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  return;
 }
 if(a==='reminder-calendar'||a==='reminder-browser')return Reminders.action(a,false,toast,render);
 if(a==='skip'){e.preventDefault();main.focus();main.scrollIntoView({block:'start'});return;}
 if(a==='install')return install();
 if(a==='install-native')return install();
 if(a==='install-check'){b.disabled=true;await window.InstallManager.check();render(false);return;}
 if(await window.PublicFeatures.action(a,b))return;
 if(await window.AtolyeFeatures.action(a,b))return;
 if(a==='theme'){state.theme=state.theme==='light'?'dark':'light';save();applyTheme();if(currentPage==='settings')render(false);return;}
 if(a==='close-dialog'){$('#dialog').close();return;}
 if(a==='copy-link')return copy(L?L.shareURL():location.origin+location.pathname);
 if(a==='copy-code'){const block=b.closest('.code-block');return copy(block.querySelector('code').textContent);}
 if(a==='term')return showTerm(+id);
 if(a==='term-name'){const t=C.glossary.find(t=>fold(t.term)===fold(b.dataset.name));if(t)showTerm(t.id);else{dictionarySearch=b.dataset.name;location.hash='dictionary';}return;}
 if(a==='favorite'){const n=+id;state.favorites=state.favorites.includes(n)?state.favorites.filter(i=>i!==n):[...state.favorites,n];save();showTerm(n);if(currentPage==='dictionary')renderDictionary();return;}
 if(a==='bookmark'){state.bookmarks=state.bookmarks.includes(id)?state.bookmarks.filter(i=>i!==id):[...state.bookmarks,id];save();render(false);return;}
 if(a==='complete'){if(state.completed.includes(id))state.completed=state.completed.filter(i=>i!==id);else{state.completed.push(id);activity('lessons');toast('Ders tamamlandı. Örneği uygulayarak pekiştir.');}save();render(false);return;}
 if(a==='filter'){dictionaryCategory=b.dataset.category;render(false);return;}
 if(a==='favorites-filter'){dictionaryFavorites=!dictionaryFavorites;render(false);return;}
 if(a==='flash-start')return startFlash();if(a==='flash-favorites')return startFlash(true);if(a==='flash-all')return startFlash(false,true);
 if(a==='flash-flip'&&flash){flash.revealed=!flash.revealed;render(false);return;}
 if(a==='flash-again')return gradeFlash(false);if(a==='flash-known')return gradeFlash(true);
 if(a==='diagnostic-start')return startDiagnostic();
 if(a==='quiz-start')return startQuiz(b.dataset.lesson);if(a==='quiz-answer')return answerQuiz(+b.dataset.index);if(a==='quiz-next')return nextQuiz();
 if(a==='quiz-reset'||a==='quiz-cancel'){quiz=null;render(false);return;}
 if(a==='lab-preset')return labPreset(b.dataset.preset);
 if(a==='lab-send'){if(labBusy)return;captureLab();labBusy=true;b.disabled=true;b.textContent='İşleniyor…';await new Promise(r=>setTimeout(r,280));labResponse=runLab(labForm.method,labForm.path,labForm.body);labBusy=false;if(currentPage==='lab')render(false);return;}
 if(a==='lab-reset'){captureLab();apiRows=[{id:1,baslik:'İlk API dersini tamamla',tamamlandi:false}];apiNext=2;labResponse=null;render(false);toast('Simülasyon kayıtları başlangıca döndü.');return;}
 if(a==='export')return exportData();if(a==='import')return $('#import-file').click();if(a==='reset-confirm')return confirmReset();
 if(a==='reset'){blockedWrite=false;storageOK=true;const theme=state.theme;state=defaults();state.theme=theme;flash=null;quiz=null;save();$('#dialog').close();render(false);toast('Çalışma kaydı sıfırlandı.');return;}
 if(a==='import-confirm'&&pendingImport){blockedWrite=false;storageOK=true;state=pendingImport;pendingImport=null;flash=null;quiz=null;save();$('#dialog').close();render(false);toast('Yedek yüklendi.');return;}
});
document.addEventListener('input',e=>{window.AtolyeFeatures.input(e);const el=e.target;if(el.id==='dictionary-search'){dictionarySearch=el.value;renderDictionary();}if(el.dataset.note){state.notes[el.dataset.note]=el.value;save();$('#note-status').textContent=storageOK?'Kaydedildi · Bu cihazda':'Kayıt başarısız · Yedek al';}});
document.addEventListener('submit',e=>{
 const id=e.target.dataset.projectLink;
 if(!id){window.PublicFeatures.submit(e);return;}
 e.preventDefault();
 if(!Academy.projects.some(project=>project.id===id))return;
 const link=Academy.projectLink(new FormData(e.target).get('repository'));
 if(link===null){toast("Bir GitHub depo adresi gir.");return;}
 if(link)state.academy.links[id]=link;else delete state.academy.links[id];
 save();
 render(false);
 $('#project-repository')?.focus({preventScroll:true});
 toast("Proje bağlantısı güncellendi.");
});
document.addEventListener('change',e=>{if(window.PublicFeatures.change(e))return;window.AtolyeFeatures.change(e);const el=e.target;if(el.id==='atolye-reminder-count'){Reminders.select(el.value);return;}if(el.dataset.project!==undefined){const i=+el.dataset.project;if(el.checked&&!state.project.includes(i))state.project.push(i);else if(!el.checked)state.project=state.project.filter(v=>v!==i);save();render(false);}if(el.id==='daily-goal'){state.goal=Number(el.value);save();toast('Günlük süre önerin güncellendi.');}});
document.addEventListener('change',async e=>{
 if(e.target.id!=='academy-report')return;
 const file=e.target.files[0];
 e.target.value='';
 if(!file)return;
 const startingState=state;
 try{
  if(file.size>32000)throw Error('Dosya çok büyük.');
  const result=Academy.readReport(JSON.parse(await file.text()));
  if(startingState!==state)return;
  Academy.recordPractice(state.academy,result.id,result.score,result.total);
  save();
  if(currentPage==='academy-projects')render(false);
  toast("Pratik raporu kaydedildi"+' · '+result.score+'/'+result.total);
 }catch{toast("Yerel pratik raporu okunamadı.");}
});
$('#import-file').addEventListener('change',async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>2000000)throw Error('Dosya çok büyük.');pendingImport=validateState(JSON.parse(await file.text()));showDialog(`<div class="dialog-header"><h2 id="dialog-title">Yedeği yükle?</h2><button class="icon-button" data-action="close-dialog" aria-label="Kapat">${icon('close')}</button></div><p>Yedekte ${pendingImport.completed.length} tamamlanan ders ve ${Object.values(pendingImport.notes).filter(n=>n.trim()).length} ders notu var. Bu tarayıcıdaki mevcut çalışma kaydının yerini alacak.</p><div class="settings-actions"><button class="button" data-action="import-confirm">Yedeği yükle</button><button class="button button-outline" data-action="close-dialog">Vazgeç</button></div>`);}catch{pendingImport=null;toast('Yedek okunamadı. Atölyeden dışa aktarılan JSON dosyasını seç.');}});
$('#dialog').addEventListener('click',e=>{if(e.target===$('#dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
window.addEventListener('hashchange',()=>{if(currentPage==='lab')captureLab();if($('#dialog').open)$('#dialog').close();quiz=null;render();});
function online(){const el=$('#connection');el.classList.toggle('offline',!navigator.onLine);el.innerHTML=`<span></span> ${navigator.onLine?'Çevrimiçi':'Çevrimdışı'}`;}
window.addEventListener('online',online);window.addEventListener('offline',online);
window.AtolyeFeatures.configure({C,heading,icon,esc,fold,codeBlock,render,toast,
 getPractice:id=>state.academy.practice[id]||[],
 recordSql:(id,pass)=>{Academy.recordPractice(state.academy,'sql-'+id,pass?1:0,1);save();}
});
if(L)L.applyTools(window.AtolyeFeatures,window.PublicFeatures);
window.PublicFeatures.configure({C,heading,icon,esc,fold,codeBlock,render,toast,getState:()=>state,save});
try{if(localStorage.getItem('backend-atolyesi-nav')==='compact'){
 document.body.classList.add('nav-compact');
 $('[data-action="nav-toggle"]')?.setAttribute('aria-expanded','false');
}}catch{}
hydrateIcons();render();online();
window.InstallManager.setup();
Reminders.start();
// Pure learning-data and simulation hooks for deterministic local verification.
window.AtolyeChecks={validateState,runLab,course:C};
})();
