const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const read = filename => readFileSync(path.join(__dirname, '..', filename), 'utf8');

function load(lang, intensive = false) {
  const context = vm.createContext({ window: {}, URL });
  const run = filename => vm.runInContext(read(filename), context, { filename });
  for (const name of ['content', 'expansion', 'questions-extra', 'share-content', 'resources-data', 'english']) {
    run(name + '.v5.js');
  }
  const { COURSE: course, ATOLYE_EN: english } = context.window;
  if (lang === 'en') {
    for (const key of ['lessons', 'glossary', 'questions']) course[key] = english[key];
    Object.assign(course, english.meta);
  }
  const legacy = JSON.parse(JSON.stringify(course));
  run('curriculum.v6.js');
  context.window.AtolyeCurriculum.apply(course, lang);
  if (intensive) {
    for (const name of ['academy-content', 'academy-practice', 'academy']) run(name + '.v7.js');
    context.window.Academy.apply(course, lang);
  }
  return { course, context, run, legacy };
}

for (const lang of ['tr', 'en']) {
  test(`the ${lang} route has 16 ordered weeks and usable lessons`, () => {
    const { course, legacy } = load(lang);
    assert.equal(course.modules.length, 16);
    assert.equal(new Set(course.lessons.map(lesson => lesson.id)).size, course.lessons.length);
    const activeIds = new Set(course.lessons.map(lesson => lesson.id));
    const archivedIds = new Set(course.archiveLessons.map(lesson => lesson.id));
    for (const lesson of legacy.lessons) {
      assert.equal(lesson.module === 'ai' ? archivedIds.has(lesson.id) : activeIds.has(lesson.id), true);
    }
    for (const [index, week] of course.modules.entries()) {
      assert.equal(week.id, 'hafta-' + (index + 1));
      assert.ok(course.lessons.some(lesson => lesson.module === week.id));
    }
    for (const [index, lesson] of course.lessons.entries()) {
      assert.equal(lesson.order, index + 1);
      for (const field of ['definition', 'purpose', 'usage', 'code', 'exercise', 'solution']) {
        assert.ok(lesson[field], `${lesson.id}: missing ${field}`);
      }
      assert.ok(course.refs[lesson.ref]);
      assert.ok(course.activeQuestions.filter(question => question.lesson === lesson.id).length >= 2);
    }
    for (const [index, question] of course.questions.entries()) {
      assert.equal(question.id, index);
      assert.ok(question.options[question.answer]);
      if (index < legacy.questions.length) assert.equal(question.lesson, legacy.questions[index].lesson);
    }
    for (const [index, term] of course.glossary.entries()) {
      assert.equal(term.id, index);
      if (index < legacy.glossary.length) assert.equal(term.term, legacy.glossary[index].term);
    }
    assert.ok(course.activeQuestions.every(question => !archivedIds.has(question.lesson)));
    assert.ok(course.activeGlossary.every(term => !['AI', 'Yapay zekâ'].includes(term.category)));
    assert.ok(course.resources.every(resource => !/ollama|onnx/.test(resource.id)));
    assert.match(course.lessons.find(lesson => lesson.id === 'migration').code, /UseSqlServer/);
    assert.doesNotMatch(course.lessons.find(lesson => lesson.id === 'migration').code, /UseSqlite/);
    assert.equal(course.legacyProjectLength, legacy.projectSteps.length);
    assert.deepEqual(Array.from(course.projectSteps.slice(0, course.legacyProjectLength)), legacy.projectSteps);
  });

  test(`the ${lang} app retains earlier study data and excludes archive completions from course totals`, () => {
    const { course, context, run } = load(lang, true);
    const suffix = lang === 'en' ? '.en' : '';
    run(`public-features${suffix}.v6.js`);
    context.C = course;
    context.Academy = context.window.Academy;
    context.sqlIds = ['join'];
    context.allLessons = [...course.lessons, ...course.archiveLessons];
    const source = read(`app${suffix}.v10.js`);
    const validateState = vm.runInContext(
      source.slice(source.indexOf('const defaults='), source.indexOf('try{const raw=')) + '\nvalidateState;',
      context
    );
    const aiTerm = course.glossary.find(term => !course.activeGlossary.includes(term)).id;
    const archiveQuestion = course.questions.find(question => question.lesson === 'llm-backend').id;
    const old = {
      schemaVersion: 1, displayName: 'Deniz', profileAcknowledged: true, theme: 'dark', lastLesson: 'llm-backend',
      completed: ['backend', 'llm-backend'], bookmarks: ['rag'],
      notes: { backend: 'önceki not', 'llm-backend': 'arşiv notu' },
      favorites: [aiTerm], review: { [aiTerm]: { due: 123, level: 2 } },
      project: [2], wrong: [archiveQuestion], history: [{ at: 123, total: 2, score: 1 }]
    };
    const restored = validateState(old);
    for (const key of Object.keys(old)) assert.deepEqual(JSON.parse(JSON.stringify(restored[key])), old[key], key);
    assert.deepEqual(JSON.parse(JSON.stringify(restored.academy)), { quiz: {}, practice: {}, links: {}, diagnostic: null });
    const metrics = context.window.PublicFeatures.metrics(restored, course);
    assert.equal(metrics.done, 1);
    assert.equal(metrics.accuracy, 50);
    assert.ok(metrics.modules.every(week => week.total > 0));
  });
}

test('the new boot script, academy and both language bundles are available offline', () => {
  const sw = read('sw.js');
  const assets = JSON.parse(sw.match(/const ASSETS=(\[[^;]+\]);/)[1]);
  assert.ok(assets.includes('./curriculum.v6.js'));
  for (const name of ['app', 'app.en', 'boot', 'brand', 'install', 'install.en', 'reminders']) assert.ok(assets.includes('./' + name + '.v10.js'));
  for (const name of ['features', 'features.en']) assert.ok(assets.includes('./' + name + '.v8.js'));
  for (const name of ['academy', 'academy-content', 'academy-practice', 'sql-worker']) assert.ok(assets.includes('./' + name + '.v7.js'));
  assert.ok(assets.includes('./downloads/Atolye_Yerel_Pratik.zip'));
  assert.ok(assets.includes('./brand/illustrations.svg'));
  assert.ok(read('index.html').includes('./boot.v10.js'));
  for (const asset of assets) assert.ok(existsSync(path.join(__dirname, '..', asset)), asset);
});

test('the intensive route covers every prior backend lesson, with at least five distinct questions per lesson', () => {
  for (const lang of ['tr', 'en']) {
    const previous = load(lang).course;
    const { course, context } = load(lang, true);
    assert.equal(course.modules.length, 6);
    assert.equal(course.lessons.length, 52);
    assert.equal(course.activeQuestions.length, 356);
    assert.equal(new Set(course.lessons.map(lesson => lesson.id)).size, 52);
    for (const oldLesson of previous.lessons) assert.ok(course.lessons.some(lesson => lesson.id === oldLesson.id));
    for (const week of course.modules) assert.equal(week.schedule.length, 5);
    for (const lesson of course.lessons) {
      for (const field of ['title', 'english', 'analogy', 'definition', 'purpose', 'usage', 'code', 'exercise', 'solution']) {
        assert.ok(lesson[field], `${lesson.id}: ${field}`);
      }
      const quiz = course.activeQuestions.filter(question => question.lesson === lesson.id);
      assert.ok(quiz.length >= 5, lesson.id);
      assert.equal(new Set(quiz.map(question => question.question)).size, quiz.length);
    }
    for (const old of previous.questions) assert.equal(course.questions[old.id].question, old.question);
    assert.equal(context.window.Academy.diagnosticPool(course).length, 9);
    assert.equal(context.window.Academy.projects.length, 6);
  }
});

test('placement, quiz mastery and practice history persist independently', () => {
  const { course, context } = load('tr', true);
  const academy = context.window.Academy;
  const data = academy.fresh();
  const pool = academy.diagnosticPool(course);
  academy.recordQuiz(data, {
    diagnostic: Object.fromEntries(pool.map(item => [item.id, item.topic])),
    answers: pool.map(item => ({ id: item.id, correct: item.topic === 'SQL' }))
  }, course, 10);
  assert.equal(data.diagnostic.SQL.score, 3);
  assert.equal(data.diagnostic.HTTP.score, 0);
  academy.recordQuiz(data, { lesson: 'backend', answers: [{ correct: true }, { correct: false }] }, course, 11);
  const state = { completed: ['backend'], academy: data };
  assert.equal(academy.overview(course, state).review[0].id, 'backend');
  academy.recordQuiz(data, { lesson: 'backend', answers: Array.from({ length: 5 }, () => ({ correct: true })) }, course, 12);
  assert.equal(academy.overview(course, state).review.length, 0);
  assert.equal(academy.overview(course, state).assessed, 1);
  const report = { version: 1, project: 'hafta-1', checks: [
    { id: 'ekleme-liste', passed: true }, { id: 'tamamlama', passed: true }, { id: 'gecersiz-girdi', passed: true }
  ] };
  const result = academy.readReport(report);
  academy.recordPractice(data, result.id, result.score, result.total, 13);
  assert.equal(academy.overview(course, state).verified, 1);
  assert.throws(() => academy.readReport({ ...report, checks: [report.checks[0], report.checks[0], report.checks[1]] }));
  academy.recordPractice(data, 'sql-join', 1, 1, 14);
  data.links['hafta-1'] = academy.projectLink('https://github.com/example/taskflow/');
  assert.equal(data.links['hafta-1'], 'https://github.com/example/taskflow');
  assert.equal(academy.projectLink('https://github.com.evil.test/example/taskflow'), null);
  assert.equal(academy.projectLink('https://person@github.com/example/taskflow'), null);
  assert.deepEqual(JSON.parse(JSON.stringify(academy.validate(data, course, ['join']))), JSON.parse(JSON.stringify(data)));
});

test('SQL grading requires the expected rows and safe syntax rendering escapes HTML', () => {
  const { context } = load('tr', true);
  const academy = context.window.Academy;
  const fixture = { columns: ['Tamamlandi'], values: [[0]] };
  const exercise = { id: 'update', ...fixture };
  assert.equal(academy.gradeSql({ results: [fixture], changed: 1 }, exercise), true);
  assert.equal(academy.gradeSql({ results: [fixture], changed: 0 }, exercise), false);
  assert.equal(academy.gradeSql({ results: [fixture], changed: 1, truncated: true }, exercise), false);
  const esc = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const highlighted = academy.highlight('SELECT "<img src=x>"', esc);
  assert.match(highlighted, /syntax-keyword/);
  assert.match(highlighted, /&lt;img/);
  assert.doesNotMatch(highlighted, /<img/);
});
