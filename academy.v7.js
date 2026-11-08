(() => {
'use strict';

const { weeks, additions, references, moreQuestions } = window.AcademyContent;
const { projects } = window.AcademyPractice;
const threshold = 0.8;
const diagnostics = {
  'C#': ['degisken', 'kontrol', 'oop'],
  HTTP: ['http', 'https-json', 'crud-akisi'],
  SQL: ['iliskisel', 'sql', 'transaction']
};

const englishNames = {
  backend: 'Backend and request flow', kurulum: 'C#, .NET and the development environment', degisken: 'Variables and data types',
  kontrol: 'Conditionals and loops', metot: 'Methods and collections', oop: 'Classes and objects', 'oop-tasarim': 'Encapsulation, interfaces and composition',
  git: 'Git, commits and README', internet: 'DNS, IP, TCP and the request lifecycle', http: 'HTTP, REST and status codes',
  'https-json': 'HTTPS, REST and JSON contracts', minimal: 'Your first ASP.NET Core API', 'crud-akisi': 'Create, read, update and delete',
  controller: 'Controller-based ASP.NET Core API', openapi: 'OpenAPI and the API contract', iliskisel: 'Relational databases',
  sql: 'SELECT, filtering and JOIN', aggregate: 'GROUP BY, COUNT and HAVING', transaction: 'Transactions and consistency',
  sqlserver: 'Connecting a C# API to SQL Server', 'nuget-linq': '.NET SDK, NuGet and LINQ', async: 'Async, await and error handling',
  cancellation: 'CancellationToken and async flow', ef: 'EF Core and DbContext', relations: 'EF Core relationships and Include',
  migration: 'Migrations and persistent CRUD', dto: 'Data transfer objects and validation', di: 'Interfaces and dependency injection',
  mimari: 'Separating responsibilities', problem: 'ProblemDetails and error responses', middleware: 'Middleware and logging',
  auth: 'Authentication and authorization', jwt: 'JWT Bearer and resource ownership', config: 'Configuration and secrets',
  test: 'Unit and integration tests', 'test-matrisi': 'A test matrix for TaskFlow', paging: 'Filtering, ordering and pagination',
  cache: 'Caching, TTL and invalidation', docker: 'Docker images, containers and ports', cicd: 'CI/CD, builds and deployment',
  deploy: 'Deployment and verification', proje: 'Build your TaskFlow portfolio API', mulakat: 'Interview preparation'
};

const expansions = {
  backend: 'API: Application Programming Interface. HTTP: Hypertext Transfer Protocol.',
  kurulum: 'SDK: Software Development Kit. IDE: Integrated Development Environment.',
  oop: 'OOP: Object-Oriented Programming.',
  'oop-tasarim': 'OOP: Object-Oriented Programming.',
  git: 'Git bir sürüm kontrol sistemidir. GitHub, Git depolarını barındıran bir hizmettir.',
  internet: 'DNS: Domain Name System. IP: Internet Protocol. TCP: Transmission Control Protocol. TLS: Transport Layer Security.',
  http: 'HTTP: Hypertext Transfer Protocol. REST: Representational State Transfer.',
  'https-json': 'HTTPS: Hypertext Transfer Protocol Secure. JSON: JavaScript Object Notation. REST: Representational State Transfer.',
  minimal: 'API: Application Programming Interface.',
  'crud-akisi': 'CRUD: Create, Read, Update, Delete.',
  controller: 'DI: Dependency Injection. API: Application Programming Interface.',
  iliskisel: 'PK: Primary Key. FK: Foreign Key.',
  sql: 'SQL: Structured Query Language.',
  transaction: 'ACID: Atomicity, Consistency, Isolation, Durability.',
  sqlserver: 'SQL: Structured Query Language. T-SQL: Transact-SQL.',
  'nuget-linq': 'LINQ: Language Integrated Query. SDK: Software Development Kit.',
  ef: 'EF Core: Entity Framework Core. ORM: Object-Relational Mapping.',
  relations: 'EF Core: Entity Framework Core.',
  migration: 'CRUD: Create, Read, Update, Delete.',
  dto: 'DTO: Data Transfer Object.',
  di: 'DI: Dependency Injection.',
  auth: 'JWT: JSON Web Token.',
  jwt: 'JWT: JSON Web Token.',
  cache: 'TTL: Time To Live.',
  cicd: 'CI: Continuous Integration. CD: Continuous Delivery veya Continuous Deployment.',
  openapi: 'API: Application Programming Interface.'
};

const analogies = {
  backend: 'Restoranda siparişi alan garson API, hazırlık kurallarını uygulayan mutfak backend, stok defteri veritabanı gibidir.',
  kurulum: 'SDK bir takım çantası, IDE o araçları düzenleyen çalışma tezgâhı gibidir.',
  degisken: 'Etiketli kutular gibi düşün. Kutunun türü hangi değeri koyabileceğini belirler.',
  kontrol: 'Bir turnike kart geçerliyse açılır. Bir kasiyer de sıra boşalana kadar aynı işlemi tekrarlar.',
  metot: 'Bir tarif, aynı adımları her seferinde baştan yazmadan tekrar kullanmanı sağlar.',
  oop: 'Bir form şablonu sınıf, ayrı ayrı doldurulmuş formlar nesnedir.',
  'oop-tasarim': 'Bir banka hesabında bakiyeyi doğrudan yazmak yerine para yatırma ve çekme işlemleri kullanılır.',
  git: 'Git, projenin gerekçeli ve adlandırılmış fotoğraflarını tutan bir albüm gibidir.',
  internet: 'Rehber adresi bulur, port aynı binadaki doğru kapıyı seçer.',
  http: 'Bir kargo fişinde gönderim adresi, işlem ve teslim sonucu ayrı alanlardır.',
  'https-json': 'Mühürlü zarf aktarımı korur. Zarfın içindeki ortak form ise JSON sözleşmesine benzer.',
  minimal: 'Bir danışma masasında her işlem, doğru kişi ve yöntemle eşleştirilir.',
  'crud-akisi': 'Deftere kayıt eklemek, okumak, düzeltmek ve çıkarmak dört ayrı eylemdir.',
  controller: 'Ürün işlemleri aynı danışma masasındadır ama stok ve fiyat kuralları servis tarafında yürütülür.',
  openapi: 'Restoran menüsü hangi siparişleri verebileceğini söyler, mutfak ise siparişi gerçekten hazırlar.',
  iliskisel: 'Bir müşteri kartına sipariş numarasıyla bağlanmak, müşteri adını her siparişe yazmaktan daha düzenlidir.',
  sql: 'Dosya dolabında önce doğru klasörü seçer, sonra aradığın alanı alırsın.',
  aggregate: 'Oyları sandığa göre gruplandırıp her grubun toplamını saymaya benzer.',
  transaction: 'Bir banka aktarımında iki hesap güncellemesi birlikte başarıya ulaşmalıdır.',
  sqlserver: 'Sağlayıcı, C# ile seçtiğin veritabanı motoru arasında bir tercüman gibidir.',
  'nuget-linq': 'Hazır bir araç kütüphaneden alınır, bir elek ise koleksiyondan yalnızca istenen parçaları geçirir.',
  async: 'Fırına yemeği koyup beklerken salatayı hazırlayabilirsin.',
  cancellation: 'Sipariş iptal edilince kuryeye kadar iptal haberini iletmek gerekir.',
  ef: 'Bir çalışma defterinde değiştirdiğin satırlar işaretlenir ve kaydet dediğinde kalıcı hale gelir.',
  relations: 'Bir sipariş dosyasını açarken ilgili satır listesini de özellikle isteyebilirsin.',
  migration: 'Bina planını genişletirken tadilat adımlarını sırayla kaydedersin.',
  dto: 'Bir teslim formunda alıcının ihtiyacı olan alanlar vardır. Şirketin tüm arşivi forma eklenmez.',
  di: 'Bir cihaz pili kendisi üretmek yerine uygun bağlantıya sahip bir pil alır.',
  mimari: 'Sipariş masası, mutfak ve depo farklı görevler üstlenir.',
  problem: 'Standart hata formu, farklı servislerin aynı alanları anlayabilmesini sağlar.',
  middleware: 'İstek, güvenlik ve kayıt noktalarından geçerek doğru masaya ulaşır.',
  auth: 'Bilet kimliğini doğrulayabilir. Biletteki yetki hangi bölüme gireceğini belirler.',
  jwt: 'İmzalı giriş kartı, kimden geldiği ve hangi kapı için düzenlendiği denetlenerek kabul edilir.',
  config: 'Aynı cihaz farklı yerlerde farklı ayarlar kullanır. Ayarları değiştirirken cihazı yeniden üretmezsin.',
  test: 'Bir motor parçasını tezgâhta ayrı, motorun tamamını araçta birlikte denersin.',
  'test-matrisi': 'Bir teslim kontrol listesi hem doğru siparişi hem yanlış adrese teslim riskini kapsar.',
  paging: 'Kalın bir kitabı düzenli sırayla birkaç sayfa halinde okumaya benzer.',
  cache: 'Sık başvurduğun bilgiyi masanda tutarsın ve eskiyince ana dosyadan yenilersin.',
  docker: 'İmaj paketlenmiş tarif ve malzemeler, container bu paketin çalışan mutfağı gibidir.',
  cicd: 'Ürün rafa ulaşmadan önce montaj hattındaki aynı kontrol noktalarından geçer.',
  deploy: 'Bir mağazayı açmadan önce deneme müşterisiyle kasa ve teslimatı sınamaya benzer.',
  proje: 'Bir evin önce odalarını çizer, sonra kapı ve bağlantıların birlikte çalıştığını doğrularsın.',
  mulakat: 'Bir tamirci yaptığı işi parça isimleriyle birlikte sorunun nedenini göstererek anlatır.'
};

function appendQuestions(course, lesson, questions, lang) {
  for (const [question, options, answer, explanation] of questions) {
    course.questions.push({
      id: course.questions.length, lesson, question, options, answer, explanation, code: '',
      kind: lang === 'en' ? 'TR' : 'Mini quiz', language: 'tr'
    });
  }
}

function apply(course, lang) {
  const english = lang === 'en';
  const lessons = new Map(course.lessons.map(lesson => [lesson.id, lesson]));
  const oldWeeks = course.modules;
  for (const { quiz, ...lesson } of additions) {
    lessons.set(lesson.id, { ...lesson, language: 'tr', minutes: 25, examples: [] });
    appendQuestions(course, lesson.id, quiz, lang);
  }
  for (const [lesson, questions] of Object.entries(moreQuestions)) appendQuestions(course, lesson, questions, lang);
  if (!english) {
    lessons.get('backend').usage += ' Full-stack geliştirici hem kullanıcı arayüzü hem sunucu tarafında çalışır. Bu akademide tarayıcıdan başlayan isteği backend tarafında izliyoruz.';
    lessons.get('kontrol').usage += ' Aritmetik operatörler toplam ve farkı, karşılaştırma operatörleri koşulu, && ve || birden fazla koşulu ifade eder. switch bir komutu seçer. for sayaçla, while koşul doğru kaldığı sürece tekrar eder.';
    lessons.get('kontrol').examples.push({
      id: 'kontrol-donguler', title: 'Konsol komutlarını seç ve say',
      narrative: 'Bir görev yöneticisi komutları switch ile ayırabilir. for indeks gerektiğinde, while bitiş koşulu değişken olduğunda kullanılır.',
      code: 'string[] komutlar = ["ekle", "liste"];\nfor (int i = 0; i < komutlar.Length; i++)\n{\n    string sonuc = komutlar[i] switch\n    {\n        "ekle" => "Ekleme seçildi",\n        "liste" => "Listeleme seçildi",\n        _ => "Bilinmeyen komut"\n    };\n    Console.WriteLine(sonuc);\n}\n// Konsol oturumunda alternatif: while (Console.ReadLine() is { } satir && satir != "cik")',
      expected: 'Önce Ekleme seçildi, sonra Listeleme seçildi yazılır.',
      language: 'csharp', kind: 'Konsol örneği'
    });
    lessons.get('metot').usage += ' Eleman sayısı sabitse dizi kullanabilirsin. Görev eklendikçe büyüyen koleksiyon için List<T> uygundur.';
    lessons.get('git').usage += ' git switch -c ozellik/gorevler ile dal aç. GitHub’da bu daldan ana dala bir Pull Request (PR) açıp değişiklikleri ve test sonucunu incele.';
  }
  Object.assign(course.refs, references);
  course.lessons = [];
  course.modules = weeks.map(([tr, en, goal, ids, days], index) => {
    const number = index + 1;
    // Use a new module namespace so older saved roadmap hashes can be redirected.
    const id = 'yogun-' + number;
    for (const lessonId of ids.split(' ')) {
      const lesson = lessons.get(lessonId);
      course.lessons.push({
        ...lesson, module: id, order: course.lessons.length + 1,
        english: lesson.english || englishNames[lessonId],
        expansion: lesson.expansion || expansions[lessonId],
        analogy: lesson.analogy || analogies[lessonId]
      });
    }
    return { id, no: String(number).padStart(2, '0'), title: english ? `Week ${number} · ${en}` : `${number}. hafta · ${tr}`,
      desc: english ? projects[index].en : goal, icon: ['code', 'route', 'database', 'target', 'quiz', 'rocket'][index],
      color: ['teal', 'blue', 'purple', 'green', 'teal', 'blue'][index], days: english ? `Week ${number}` : `${number}. hafta`, schedule: days };
  });
  const lessonModules = new Map(course.lessons.map(lesson => [lesson.id, lesson.module]));
  const oldToNew = Object.fromEntries(oldWeeks.map(week => {
    const first = [...lessons.values()].find(lesson => lesson.module === week.id);
    return [week.id, lessonModules.get(first.id)];
  }));
  course.legacyModules = {
    ...Object.fromEntries(Object.entries(course.legacyModules).map(([old, middle]) => [old, oldToNew[middle]])),
    ...oldToNew
  };
  course.activeQuestions = course.questions.filter(question => lessonModules.has(question.lesson));
}

const fresh = () => ({ quiz: {}, practice: {}, links: {}, diagnostic: null });

function projectLink(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim());
    if (url.origin !== 'https://github.com' || url.username || url.password || url.search || url.hash ||
      !/^\/[a-z0-9-]+\/[a-z0-9_.-]+\/?$/i.test(url.pathname)) return null;
    return url.origin + url.pathname.replace(/\/$/, '');
  } catch {
    return null;
  }
}

function validateResult(value) {
  if (!value || !Number.isSafeInteger(value.score) || !Number.isSafeInteger(value.total) ||
      value.total < 1 || value.total > 100 || value.score < 0 || value.score > value.total ||
      !Number.isSafeInteger(value.at) || value.at < 1) return null;
  return { score: value.score, total: value.total, at: value.at };
}

function validate(raw, course, sqlIds) {
  const data = fresh();
  if (!raw || typeof raw !== 'object') return data;
  for (const lesson of course.lessons) {
    const result = validateResult(raw.quiz?.[lesson.id]);
    if (result) data.quiz[lesson.id] = result;
  }
  const taskIds = [...projects.map(project => project.id), ...sqlIds.map(id => 'sql-' + id)];
  for (const id of taskIds) {
    const attempts = raw.practice?.[id];
    if (Array.isArray(attempts)) data.practice[id] = attempts.map(validateResult).filter(Boolean).slice(-10);
  }
  for (const project of projects) {
    const link = projectLink(raw.links?.[project.id]);
    if (link) data.links[project.id] = link;
  }
  if (raw.diagnostic) {
    const result = Object.fromEntries(Object.keys(diagnostics).map(key => [key, validateResult(raw.diagnostic[key])]));
    if (Object.values(result).every(Boolean)) data.diagnostic = result;
  }
  return data;
}

function diagnosticPool(course) {
  return Object.entries(diagnostics).flatMap(([topic, lessonIds]) =>
    lessonIds.map(id => ({ topic, id: course.activeQuestions.find(question => question.lesson === id).id })));
}

function recordQuiz(data, session, course, now = Date.now()) {
  if (session.diagnostic) {
    data.diagnostic = Object.fromEntries(Object.keys(diagnostics).map(topic => {
      const answers = session.answers.filter(answer => session.diagnostic[answer.id] === topic);
      return [topic, { score: answers.filter(answer => answer.correct).length, total: answers.length, at: now }];
    }));
  } else if (course.lessons.some(lesson => lesson.id === session.lesson)) {
    data.quiz[session.lesson] = { score: session.answers.filter(answer => answer.correct).length, total: session.answers.length, at: now };
  }
}

function recordPractice(data, id, score, total, now = Date.now()) {
  const attempts = data.practice[id] || [];
  data.practice[id] = [...attempts, { score, total, at: now }].slice(-10);
}

function readReport(report) {
  if (!report || report.version !== 1 || !Array.isArray(report.checks)) throw Error('Rapor biçimi geçersiz.');
  const project = projects.find(item => item.id === report.project);
  if (!project || report.checks.length !== project.checks.length) throw Error('Görev veya kontrol listesi tanınmadı.');
  const seen = new Set();
  for (const check of report.checks) {
    if (!check || !project.checks.includes(check.id) || seen.has(check.id) || typeof check.passed !== 'boolean') {
      throw Error('Kontrol sonucu geçersiz.');
    }
    seen.add(check.id);
  }
  return { id: project.id, score: report.checks.filter(check => check.passed).length, total: project.checks.length };
}

function gradeSql(result, exercise) {
  const rows = result.results?.at(-1);
  return Boolean(rows && !result.error && !result.truncated &&
    result.changed === (exercise.id === 'update' ? 1 : 0) &&
    JSON.stringify(rows.columns) === JSON.stringify(exercise.columns) &&
    JSON.stringify(rows.values) === JSON.stringify(exercise.values));
}

const passed = result => result && result.score / result.total >= threshold;
const projectPassed = attempts => attempts?.some(result => result.score === result.total) === true;

function overview(course, state) {
  const { quiz, practice } = state.academy;
  const review = course.lessons.filter(lesson => quiz[lesson.id] && !passed(quiz[lesson.id]));
  const assessed = course.lessons.filter(lesson => passed(quiz[lesson.id])).length;
  const next = course.lessons.find(lesson => !state.completed.includes(lesson.id)) || review[0] || course.lessons[0];
  const project = projects.find(item => !projectPassed(practice[item.id])) || projects.at(-1);
  return { review, assessed, next, project, verified: projects.filter(item => projectPassed(practice[item.id])).length };
}

function links(ids, course, esc) {
  return ids.map(id => course.lessons.find(lesson => lesson.id === id)).filter(Boolean)
    .map(lesson => `<li><a class="text-link" href="#lesson/${lesson.id}">${esc(lesson.title)}</a></li>`).join('');
}

function today(api, params = new URLSearchParams()) {
  const { C, state, heading, esc, english } = api;
  const info = overview(C, state);
  const suggested = Math.max(0, C.modules.findIndex(module => module.id === info.next.module));
  const week = /^[1-6]$/.test(params.get('hafta') || '') ? Number(params.get('hafta')) - 1 : suggested;
  const module = C.modules[week];
  const ids = weeks[week][3].split(' ');
  const nextIndex = Math.max(0, ids.indexOf(info.next.id));
  const suggestedDay = Math.min(4, Math.floor(nextIndex * 5 / ids.length));
  const day = /^[1-5]$/.test(params.get('gun') || '') ? Number(params.get('gun')) - 1 : suggestedDay;
  const first = Math.ceil(day * ids.length / 5);
  const end = Math.ceil((day + 1) * ids.length / 5);
  const plan = ids.slice(first, end);
  return `${heading(english ? 'Today in the academy' : 'Bugünkü çalışma', english ? 'Choose any week and study day. Daily guidance is in Turkish.' : 'Kendi hızında ilerle. Bir çalışma günü için yaklaşık 5–6 saat ayır.')}
  <div class="academy-grid">
    <section class="panel"><h2>${english ? 'Study day' : 'Günlük hedef'}</h2>
      <div class="filter-row">${C.modules.map((m, i) => `<a class="filter-btn ${i === week ? 'active' : ''}" href="#today?hafta=${i + 1}" ${i === week ? 'aria-current="true"' : ''}>${i + 1}. ${english ? 'week' : 'hafta'}</a>`).join('')}</div>
      <div class="filter-row">${module.schedule.map((_, i) => `<a class="filter-btn ${i === day ? 'active' : ''}" href="#today?hafta=${week + 1}&gun=${i + 1}" ${i === day ? 'aria-current="true"' : ''}>${i + 1}. ${english ? 'day' : 'gün'}</a>`).join('')}</div>
      <p>${esc(module.schedule[day])}</p>
      ${plan.length ? `<ul>${links(plan, C, esc)}</ul>` : `<p>${english ? 'Practise and review the week’s lessons.' : 'Bu oturumu projeye ve haftalık tekrara ayır.'}</p>`}
      <p class="tiny-note" lang="tr">Öneri: 90 dk ders ve örnek, 180 dk kodlama, 45 dk quiz ve tekrar. Uzun oturumlara ara ver.</p>
      <a class="button button-outline" href="#academy-projects?hafta=${week + 1}">${esc(english ? projects[week].en : projects[week].title)}</a>
    </section>
    <section class="panel"><h2>${english ? 'Review queue' : 'Tekrar sıran'}</h2>
      ${info.review.length ? `<ul>${links(info.review.map(lesson => lesson.id), C, esc)}</ul>` : `<p>${english ? 'Lessons below 80% will appear after a lesson quiz.' : 'Ders quizinde %80’in altında kalan konular burada görünür.'}</p>`}
      <p><a class="text-link" href="#quiz?diagnostic=1">${english ? 'Placement quiz' : 'Başlangıç seviye testi'} →</a></p>
    </section>
  </div>`;
}

function home(api) {
  const { C, state, esc, english } = api;
  const info = overview(C, state);
  return `<section class="panel academy-home">
    <h2>${english ? 'Your six-week academy' : '6 haftalık akademin'}</h2>
    <div class="academy-grid">
      <div><p><strong>${english ? 'Up next' : 'Sıradaki ders'}</strong></p><a class="text-link" href="#lesson/${info.next.id}">${esc(info.next.title)} →</a></div>
      <div><p><strong>${english ? 'Practice project' : 'Sıradaki pratik'}</strong></p><a class="text-link" href="#academy-projects?hafta=${projects.indexOf(info.project) + 1}">${esc(english ? info.project.en : info.project.title)} →</a></div>
      <div><p><strong>${info.review.length} ${english ? 'topics to review' : 'konu tekrar bekliyor'}</strong></p><a class="text-link" href="#today">${english ? 'Daily study and review' : 'Bugünkü çalışma ve tekrar'} →</a></div>
    </div>
    <div class="inline-buttons"><a class="button" href="#today">${english ? 'Open today’s plan' : 'Bugünkü planı aç'}</a>
    <a class="button button-outline" href="#quiz?diagnostic=1">${english ? 'Placement quiz' : 'Başlangıç seviye testi'}</a></div>
  </section>`;
}

function analytics(api) {
  const { C, state, esc, english } = api;
  const info = overview(C, state);
  const sqlCount = Object.entries(state.academy.practice).filter(([id, attempts]) => id.startsWith('sql-') && projectPassed(attempts)).length;
  const diagnostic = state.academy.diagnostic;
  return `<section class="panel academy-home"><h2>${english ? 'Learning evidence' : 'Öğrenme göstergelerin'}</h2>
    <div class="academy-grid">
      <div><strong>${info.assessed} / ${C.lessons.length}</strong><p>${english ? 'Lesson quizzes at 80% or higher' : '%80 ve üstü son ders quizi'}</p></div>
      <div><strong>${info.verified} / ${projects.length}</strong><p>${english ? 'Weekly projects with a passing report' : 'Yerel kontrolü geçen haftalık proje'}</p></div>
      <div><strong>${sqlCount} / ${api.sqlCount}</strong><p>${english ? 'SQL exercises with matching results' : 'Sonucu eşleşen SQL alıştırması'}</p></div>
    </div>
    <h3>${english ? 'Placement quiz' : 'Başlangıç seviye testi'}</h3>
    ${diagnostic ? `<ul>${Object.entries(diagnostic).map(([name, score]) => `<li>${esc(name)} · ${score.score}/${score.total}</li>`).join('')}</ul>` :
      `<p><a class="text-link" href="#quiz?diagnostic=1">${english ? 'Take the placement quiz' : 'Başlangıç seviye testini çöz'} →</a></p>`}
    <p><a class="text-link" href="#today">${english ? 'Return to the review queue' : 'Tekrar sırasına dön'} →</a></p>
  </section>`;
}

function projectPage(api, params) {
  const { state, heading, esc, english, codeBlock } = api;
  const week = /^[1-6]$/.test(params.get('hafta') || '') ? Number(params.get('hafta')) - 1 : projects.indexOf(overview(api.C, state).project);
  const project = projects[week];
  const attempts = state.academy.practice[project.id] || [];
  const label = english ? 'Weekly projects' : 'Haftalık projeler';
  const verdict = item => item.score === item.total ? 'Geçti' : 'Tekrar dene';
  return `${heading(label, english ? 'Each project has a local test contract. Project instructions are in Turkish.' : 'Kodunu kendi bilgisayarında çalıştır ve kontrol raporunu Atölye’ye yükle.')}
    <div class="filter-row">${projects.map((p, index) => `<a class="filter-btn ${index === week ? 'active' : ''}" href="#academy-projects?hafta=${index + 1}" ${index === week ? 'aria-current="true"' : ''}>${index + 1} · ${esc(english ? p.en : p.title)}${projectPassed(state.academy.practice[p.id]) ? ' ✓' : ''}</a>`).join('')}</div>
    <div class="academy-grid"><section class="panel" lang="tr"><h2>${esc(project.title)}</h2><p>${esc(project.task)}</p>
      <h3>Başlangıç</h3><p>${esc(project.starter)}</p>${codeBlock(project.code, 'Başlangıç kodu')}
      <h3>Beklenen davranış</h3><ul>${project.criteria.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
      <details><summary>İpucu</summary><p>${esc(project.hint)}</p></details>
      <details><summary>Çözüm yaklaşımını göster</summary><p>${esc(project.solution)}</p></details>
      <p><a class="text-link" href="#project">TaskFlow teslim kontrol listesi →</a></p>
    </section><section class="panel" lang="tr"><h2>Yerel kontrol</h2>
      <p>Paketi aç ve içindeki README’yi izle. Aşağıdaki komut, kendi bilgisayarında çalışır ve bir JSON sonuç dosyası üretir.</p>
      <a class="button button-outline" href="./downloads/Atolye_Yerel_Pratik.zip" download>Başlangıç ve kontrol paketini indir</a>
      ${codeBlock(project.command, 'Terminal')}
      <label class="field-label" for="academy-report">Yerel JSON raporunu seç</label>
      <input id="academy-report" type="file" accept="application/json,.json">
      <p class="tiny-note">Rapor tarayıcıda okunur. Kendi pratiğin için kayıt tutulur. Docker, test çalıştırma ve dağıtım gibi ortam adımları ayrıca kontrol listesinde doğrulanır.</p>
      <h3>Görev geçmişi</h3>${attempts.length ? `<ul>${attempts.slice().reverse().map(item => `<li>${esc(new Date(item.at).toLocaleString('tr-TR'))} · ${item.score}/${item.total} · ${verdict(item)}</li>`).join('')}</ul>` : '<p>Henüz rapor yüklenmedi.</p>'}
    </section></div>`;
}

function lessonIntro(lesson, esc, english) {
  if (!lesson.english) return '';
  return `<section class="reader-section academy-lesson-meta"><dl>
    <dt>${english ? 'English name' : 'İngilizce adı'}</dt><dd lang="en">${esc(lesson.english)}</dd>
    ${lesson.expansion ? `<dt>${english ? 'Abbreviations' : 'Kısaltmalar'}</dt><dd>${esc(lesson.expansion)}</dd>` : ''}
    ${lesson.analogy ? `<dt>${english ? 'Analogy (TR)' : 'Günlük hayattan benzetme'}</dt><dd lang="tr">${esc(lesson.analogy)}</dd>` : ''}
  </dl></section>`;
}

function lessonSummary(lesson, next, result, esc, english) {
  if (!lesson.english) return '';
  return `<section class="reader-section"><h2>${english ? 'What to take away' : 'Bu dersten aklında kalsın'}</h2>
    <p>${esc(lesson.walkthrough.at(-1))}</p>
    ${next ? `<p>${english ? 'Next, apply it in' : 'Sırada bu bilgiyi geliştireceğin ders'} <a class="text-link" href="#lesson/${next.id}">${esc(next.title)} →</a></p>` : ''}
    ${result ? `<p>${english ? 'Latest quiz' : 'Son quiz'} · ${result.score}/${result.total} · ${passed(result) ? (english ? 'Mastery threshold reached' : 'Konu eşiği geçildi') : (english ? 'Review queued' : 'Tekrar sırasına eklendi')}</p>` : ''}
  </section>`;
}

function highlight(value, esc) {
  const tokens = /\/\/[^\n]*|--[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|\b(?:\d+(?:\.\d+)?|SELECT|WHERE|JOIN|GROUP|ORDER|BY|FROM|INSERT|UPDATE|DELETE|NULL|BEGIN|ROLLBACK|AS|var|int|string|bool|class|public|private|record|interface|return|await|async|new|if|else|foreach|while|true|false|using|static)\b/gi;
  let html = '';
  let cursor = 0;
  for (const match of value.matchAll(tokens)) {
    const [token] = match;
    const type = /^(?:\/\/|--)/.test(token) ? 'comment' : /^["']/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : 'keyword';
    html += esc(value.slice(cursor, match.index)) + `<span class="syntax-${type}">${esc(token)}</span>`;
    cursor = match.index + token.length;
  }
  return html + esc(value.slice(cursor));
}

window.Academy = { apply, fresh, validate, diagnostics, diagnosticPool, recordQuiz, recordPractice, readReport, gradeSql, projectLink,
  overview, today, home, analytics, projectPage, lessonIntro, lessonSummary, highlight, projects };
})();
