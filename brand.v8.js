(() => {
'use strict';

const brandArt = (name, className = '') => {
  const week = name.startsWith('week-');
  return `<svg class="brand-art ${className}" viewBox="${week ? '0 0 320 208' : '0 0 112 88'}" aria-hidden="true" focusable="false"><use href="./brand/illustrations.svg#${name}" width="100%" height="100%"></use></svg>`;
};

const navSections = [
  ['Akademi', 'Academy', ['home', 'today', 'roadmap', 'academy-projects']],
  ['Çalışma araçları', 'Study tools', ['quiz', 'lab', 'sql-lab', 'dictionary', 'cards', 'examples']],
  ['Çalışma kaydım', 'Study record', ['progress', 'notes', 'settings']]
];

function navigation({ items, active, icon, english }) {
  const routes = new Map(items.map(([id, label, symbol]) => [id, { label, symbol }]));
  routes.set('settings', { label: english ? 'Settings' : 'Ayarlar', symbol: 'settings' });
  const current = active === 'project' ? 'academy-projects' : active;
  return navSections.map(([tr, en, ids]) => `<div class="brand-nav-group">
    <p class="brand-nav-caption">${english ? en : tr}</p>
    ${ids.map(id => {
      const { label, symbol } = routes.get(id);
      const selected = current === id;
      return `<a class="nav-link ${selected ? 'active' : ''}" href="#${id}" ${selected ? 'aria-current="page"' : ''} aria-label="${label}" title="${label}">${icon(symbol)}<span>${label}</span></a>`;
    }).join('')}
  </div>`).join('');
}

const progress = (value, total, label, esc) => `<div class="progress-track" role="progressbar" aria-label="${esc(label)}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${total}"><span style="width:${value / total * 100}%"></span></div>`;
const quizPass = result => result && result.score / result.total >= 0.8;

function weekInfo(C, state, week) {
  const lessons = C.lessons.filter(lesson => lesson.module === week.id);
  const read = lessons.filter(lesson => state.completed.includes(lesson.id)).length;
  const quiz = lessons.filter(lesson => quizPass(state.academy.quiz[lesson.id])).length;
  const review = lessons.some(lesson => state.academy.quiz[lesson.id] && !quizPass(state.academy.quiz[lesson.id]));
  const started = read || lessons.some(lesson => state.academy.quiz[lesson.id]);
  return { lessons, read, quiz, status: review ? 'review' : quiz === lessons.length && read === lessons.length ? 'done' : started ? 'started' : 'new' };
}

const statusNames = {
  tr: { review: 'Tekrar gerekli', done: 'Tamamlandı', started: 'Devam ediyor', new: 'Başlanmadı' },
  en: { review: 'Review needed', done: 'Complete', started: 'In progress', new: 'Not started' }
};

function statusPill(status, english) {
  return `<span class="brand-status status-${status}"><span aria-hidden="true"></span>${statusNames[english ? 'en' : 'tr'][status]}</span>`;
}

function home({ C, state, esc, icon, english }) {
  const info = window.Academy.overview(C, state);
  const weekIndex = C.modules.findIndex(week => week.id === info.next.module);
  const week = C.modules[weekIndex];
  const firstWeek = info.next.order === 1;
  const currentWeek = weekInfo(C, state, week);
  const plannedDay = Math.min(4, Math.floor(currentWeek.lessons.findIndex(l => l.id === info.next.id) * 5 / currentWeek.lessons.length));
  const focus = week.schedule[Math.max(0, plannedDay)];
  const greeting = state.displayName ? `${english ? 'Welcome back' : 'Hoş geldin'}, ${esc(state.displayName)}` : (english ? 'Welcome to Atölye' : 'Atölye’ye hoş geldin');
  const nextProject = window.Academy.projects.indexOf(info.project) + 1;
  const metrics = [
    [info.assessed, C.lessons.length, english ? 'Topics mastered' : 'Eşiği geçen konu', 'check'],
    [info.verified, 6, english ? 'Verified projects' : 'Doğrulanan proje', 'rocket'],
    [info.review.length, null, english ? 'Topics to revisit' : 'Tekrar bekleyen konu', 'refresh']
  ];
  return `<div class="brand-dashboard">
    <div class="brand-page-heading">
      <span class="brand-kicker">${english ? 'PERSONAL STUDY SPACE' : 'KİŞİSEL ÇALIŞMA ALANI'}</span>
      <h1>${greeting}</h1>
      <p>${english ? 'Six weeks of practical backend study, from C# to TaskFlow.' : 'C#’tan TaskFlow’a uzanan 6 haftalık uygulamalı backend programın.'}</p>
    </div>
    <div class="brand-home-top">
      <section class="brand-hero">
        <div class="brand-hero-copy">
          <span class="brand-hero-label"><span aria-hidden="true"></span>${english ? 'CONTINUE LEARNING' : 'SIRADAKİ DERS'} · ${String(weekIndex + 1).padStart(2, '0')}</span>
          <h2>${esc(info.next.title)}</h2>
          <p>${esc(week.title)} <span aria-hidden="true">·</span> ${info.next.minutes} ${english ? 'min reading' : 'dk okuma'}</p>
          <a class="button brand-primary" href="#lesson/${info.next.id}">${english ? (firstWeek ? 'Start the lesson' : 'Continue lesson') : (firstWeek ? 'Derse başla' : 'Derse devam et')} ${icon('arrow')}</a>
        </div>
        ${brandArt('week-' + (weekIndex + 1), 'hero-art')}
      </section>
      <section class="brand-focus">
        <div class="brand-focus-top"><span class="brand-kicker">${english ? 'TODAY’S FOCUS' : 'BUGÜNÜN HEDEFİ'}</span><span class="brand-chip">${icon('clock')} 5–6 ${english ? 'h' : 'saat'}</span></div>
        <h2>${english ? 'Make time to practise' : 'Bugünkü çalışma'}</h2>
        <p>${english ? 'Read, practise and review the next lesson at your own pace.' : esc(focus)}</p>
        <a class="text-link" href="#today">${english ? 'Open today’s plan' : 'Bugünkü planı aç'} ${icon('arrow')}</a>
        <div class="brand-focus-project"><span>${english ? 'UPCOMING PRACTICE' : 'YAKLAŞAN PRATİK'}</span>
          <a href="#academy-projects?hafta=${nextProject}">${esc(english ? info.project.en : info.project.title)} ${icon('chevron')}</a></div>
      </section>
    </div>
    <section class="brand-metrics" aria-label="${english ? 'Study progress' : 'Çalışma ilerlemesi'}">
      ${metrics.map(([value, total, label, symbol], i) => `<a href="${i === 2 ? '#today' : '#progress'}" class="brand-metric">
        <span class="brand-metric-icon tone-${i}">${icon(symbol)}</span><span><strong>${value}${total === null ? '' : `<small> / ${total}</small>`}</strong><span>${label}</span></span></a>`).join('')}
    </section>
    <section class="brand-journey">
      <div class="brand-section-head"><div><span class="brand-kicker">${english ? 'YOUR CURRICULUM' : 'MÜFREDAT'}</span><h2>${english ? 'Six weeks, six projects' : '6 hafta, 6 proje'}</h2></div><a class="text-link" href="#roadmap">${english ? 'View learning path' : 'Öğrenme haritası'} ${icon('arrow')}</a></div>
      <div class="brand-week-tiles">${C.modules.map((module, index) => {
        const stats = weekInfo(C, state, module);
        return `<a href="#roadmap/${module.id}" class="brand-week-tile">
          ${brandArt('week-' + (index + 1))}<span class="brand-kicker">${english ? 'WEEK' : 'HAFTA'} ${module.no}</span>
          <strong>${esc(module.title.split(' · ')[1])}</strong>
          ${progress(stats.read, stats.lessons.length, module.title, esc)}
        </a>`;
      }).join('')}</div>
      <p><a class="text-link" href="#quiz?diagnostic=1">${english ? 'Take the placement quiz' : 'Başlangıç seviye testi'} ${icon('arrow')}</a></p>
    </section>
  </div>`;
}

function roadmap({ C, state, heading, icon, esc, english }, id) {
  const current = C.legacyModules[id] || id || window.Academy.overview(C, state).next.module;
  const read = C.lessons.filter(lesson => state.completed.includes(lesson.id)).length;
  const intro = english ? 'Follow the weeks at your own pace. Open any lesson or project when you are ready.' : 'Haftaları kendi hızında takip et. Dersi çalış, quiz eşiğini geç ve haftalık projenle pekiştir.';
  return `${heading(english ? 'Learning map' : 'Öğrenme haritası', intro, `<span class="brand-chip">${C.lessons.length} ${english ? 'lessons' : 'ders'}</span>`)}
  <div class="brand-map-summary">${read ? '' : brandArt('roadmap-empty')}<div><strong>${read} / ${C.lessons.length} ${english ? 'lessons studied' : 'ders çalışıldı'}</strong>
    ${progress(read, C.lessons.length, english ? 'Studied lessons' : 'Çalışılan dersler', esc)}</div>
    <a class="text-link" href="#today">${english ? 'Daily study' : 'Günlük çalışma'} ${icon('arrow')}</a></div>
  <div class="brand-map">${C.modules.map((week, index) => {
    const stats = weekInfo(C, state, week);
    return `<details class="brand-map-week" id="module-${week.id}" ${week.id === current ? 'open' : ''}>
      <summary>
        ${brandArt('week-' + (index + 1))}
        <div class="brand-map-copy">
          <span class="brand-kicker">${english ? 'WEEK' : 'HAFTA'} ${week.no}</span>
          <h2>${esc(week.title.split(' · ')[1])}</h2><p>${esc(week.desc)}</p>
          ${progress(stats.read, stats.lessons.length, week.title, esc)}
          <small>${stats.read}/${stats.lessons.length} ${english ? 'studied' : 'çalışıldı'} · ${stats.quiz}/${stats.lessons.length} ${english ? 'mastered' : 'quiz eşiği'}</small>
        </div>
        <div class="brand-map-status">${statusPill(stats.status, english)}<span class="brand-chevron">${icon('chevron')}</span></div>
      </summary>
      <div class="brand-map-content">${stats.lessons.map(lesson => {
        const isRead = state.completed.includes(lesson.id);
        const passed = quizPass(state.academy.quiz[lesson.id]);
        return `<a class="lesson-row ${isRead ? 'done' : ''}" href="#lesson/${lesson.id}"><span class="lesson-number">${isRead ? icon('check') : String(lesson.order).padStart(2, '0')}</span>
          <div><h3>${esc(lesson.title)}${english && lesson.language === 'tr' ? ' · TR' : ''}</h3><small>${esc(lesson.terms.slice(0, 3).join(' · '))}</small></div>
          <span class="lesson-time">${lesson.minutes} ${english ? 'min' : 'dk'}${passed ? ' · ✓' : ''}</span>${icon('chevron')}</a>`;
      }).join('')}
      <a class="brand-map-project text-link" href="#academy-projects?hafta=${index + 1}">${icon('rocket')} ${esc(english ? window.Academy.projects[index].en : window.Academy.projects[index].title)} ${icon('arrow')}</a></div>
    </details>`;
  }).join('')}</div>`;
}

const tech = [
  'C# · .NET · Git', 'ASP.NET Core · REST · OpenAPI', 'SQL Server · EF Core · LINQ',
  'Identity · JWT · SQL Server', 'xUnit · Docker · GitHub Actions', 'ASP.NET Core · SQL Server · Docker'
];

function projects(api, params) {
  const { state, heading, icon, esc, english } = api;
  const selected = params.get('hafta');
  if (/^[1-6]$/.test(selected || '')) {
    const id = window.Academy.projects[Number(selected) - 1].id;
    const repository = state.academy.links[id] || '';
    const details = window.Academy.projectPage(api, params).replace('<p>Henüz rapor yüklenmedi.</p>',
      `<div class="brand-empty-state">${brandArt('project-empty')}<p>İlk kontrol raporunu yüklediğinde burada görünecek.</p></div>`);
    return `<a class="back-link" href="#academy-projects">${icon('back')} ${english ? 'All projects' : 'Tüm projeler'}</a>${details}
      <form class="panel brand-project-link" data-project-link="${id}">
        <label class="field-label" for="project-repository">${english ? 'Your GitHub repository' : 'GitHub depon'}</label>
        <div class="inline-buttons"><input id="project-repository" name="repository" type="url" maxlength="200" placeholder="https://github.com/hesap/proje" value="${esc(repository)}">
        <button class="button button-outline">${english ? 'Save link' : 'Bağlantıyı kaydet'}</button></div>
        ${repository ? `<a class="text-link" href="${esc(repository)}" target="_blank" rel="noopener noreferrer">${english ? 'View repository' : 'GitHub deposunu aç'} ${icon('external')}</a>` : ''}
      </form>`;
  }
  return `${heading(english ? 'My projects' : 'Projelerim', english ? 'Put each week into practice and track your latest checks.' : 'Her hafta çalışan bir parça geliştir. Son kontrollerini ve sıradaki projeyi burada gör.')}
  <div class="brand-projects">${window.Academy.projects.map((project, index) => {
    const attempts = state.academy.practice[project.id] || [];
    const last = attempts.at(-1);
    const status = last ? (last.score === last.total ? 'done' : 'review') : 'new';
    const final = index === 5;
    return `<article class="brand-project-card ${final ? 'brand-final-project' : ''}">
      <div class="brand-project-top"><span class="brand-kicker">${final ? (english ? 'CAPSTONE' : 'FİNAL PROJESİ') : (english ? 'WEEK' : 'HAFTA') + ' ' + String(index + 1).padStart(2, '0')}</span>${statusPill(status, english)}</div>
      ${brandArt(final && status === 'done' ? 'final-done' : final ? 'week-6' : 'week-' + (index + 1))}
      <h2>${esc(english ? project.en : project.title)}</h2><p>${esc(english ? api.C.modules[index].desc : project.task)}</p>
      <span class="brand-project-tech">${tech[index]}</span>
      <div class="brand-project-progress"><span>${english ? 'Latest checks' : 'Son kontroller'}</span><strong>${last?.score ?? 0}/${project.checks.length}</strong></div>
      ${progress(last?.score ?? 0, project.checks.length, project.title, esc)}
      <div class="inline-buttons"><a class="button button-outline" href="#academy-projects?hafta=${index + 1}">${english ? (last ? 'Continue' : 'Open project') : (last ? 'Devam et' : 'Projeyi aç')} ${icon('arrow')}</a>
      ${state.academy.links[project.id] ? `<a class="text-link" href="${esc(state.academy.links[project.id])}" target="_blank" rel="noopener noreferrer">GitHub ${icon('external')}</a>` : ''}</div>
    </article>`;
  }).join('')}</div>`;
}

function lessonLinks({ icon, english }) {
  const labels = english ? ['Concept', 'Code', 'Practise', 'Quiz'] : ['Kavram', 'Kod', 'Pratik', 'Quiz'];
  return `<div class="brand-lesson-shortcuts" aria-label="${english ? 'Lesson sections' : 'Ders bölümleri'}">
    ${['concept', 'code', 'practice', 'quiz'].map((id, index) => `<button class="filter-btn" data-action="lesson-jump" data-id="lesson-${id}">${icon(['book', 'code', 'target', 'quiz'][index])} ${labels[index]}</button>`).join('')}</div>`;
}

function editor(textarea, value, esc, english) {
  const lines = value.split('\n').map((_, index) => index + 1).join('\n');
  return `<div class="workbench-editor">
    <div class="workbench-bar"><span aria-hidden="true"><i></i><i></i><i></i></span><strong>calisma.sql</strong><small>SQLite</small></div>
    <div class="workbench-area"><pre class="workbench-gutter" aria-hidden="true">${lines}</pre>
      <div class="workbench-code"><pre aria-hidden="true"><code class="workbench-syntax">${window.Academy.highlight(value, esc)}\n</code></pre>${textarea}</div>
    </div>
    <div class="workbench-footer"><span>${english ? 'Local SQL workspace' : 'Yerel SQL çalışma alanı'}</span><kbd>Ctrl + Enter</kbd></div>
  </div>`;
}

function syncEditor(target, esc) {
  const box = target.closest('.workbench-area');
  if (!box) return;
  box.querySelector('.workbench-gutter').textContent = target.value.split('\n').map((_, i) => i + 1).join('\n');
  const syntax = box.querySelector('.workbench-syntax');
  syntax.innerHTML = window.Academy.highlight(target.value, esc) + '\n';
  scrollEditor(target);
}

function scrollEditor(target) {
  const box = target.closest('.workbench-area');
  if (!box) return;
  box.querySelector('.workbench-gutter').scrollTop = target.scrollTop;
  const paint = box.querySelector('.workbench-code > pre');
  paint.scrollLeft = target.scrollLeft;
  paint.scrollTop = target.scrollTop;
}

window.AtolyeBrand = { art: brandArt, navigation, home, roadmap, projects, lessonLinks, editor, syncEditor, scrollEditor };
})();
