const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const read = filename => readFileSync(path.join(__dirname, '..', filename), 'utf8');

function load(lang) {
  const context = vm.createContext({ window: {} });
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
    const { course, context, run } = load(lang);
    const suffix = lang === 'en' ? '.en' : '';
    run(`public-features${suffix}.v6.js`);
    context.C = course;
    context.allLessons = [...course.lessons, ...course.archiveLessons];
    const source = read(`app${suffix}.v6.js`);
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
    const metrics = context.window.PublicFeatures.metrics(restored, course);
    assert.equal(metrics.done, 1);
    assert.equal(metrics.accuracy, 50);
    assert.ok(metrics.modules.every(week => week.total > 0));
  });
}

test('the new boot script and both language bundles are available offline', () => {
  const sw = read('sw.js');
  const assets = JSON.parse(sw.match(/const ASSETS=(\[[^;]+\]);/)[1]);
  assert.ok(assets.includes('./curriculum.v6.js'));
  assert.ok(assets.includes('./app.v6.js'));
  assert.ok(assets.includes('./app.en.v6.js'));
  assert.ok(assets.includes('./boot.v6.js'));
  assert.ok(read('index.html').includes('./boot.v6.js'));
  for (const asset of assets) assert.ok(existsSync(path.join(__dirname, '..', asset)), asset);
});
