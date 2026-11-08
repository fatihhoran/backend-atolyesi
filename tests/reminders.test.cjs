const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const read = name => readFileSync(path.join(__dirname, '..', name), 'utf8');
const context = vm.createContext({ window: {}, TextEncoder });
vm.runInContext(read('reminders.v10.js'), context);
const { calendar, due } = context.window.AtolyeReminders;

test('calendar offers two or three daily alerts and starts each at its next local time', () => {
  const now = new Date(2026, 10, 8, 12, 30);
  const three = calendar(3, 'tr', now);
  assert.match(three, /DTSTART:20261109T100000/);
  assert.match(three, /DTSTART:20261108T140000/);
  assert.match(three, /DTSTART:20261108T190000/);
  assert.equal((three.match(/RRULE:FREQ=DAILY/g) || []).length, 3);
  assert.equal((three.match(/BEGIN:VALARM\r\nTRIGGER:PT0M\r\nACTION:DISPLAY/g) || []).length, 3);
  assert.ok(three.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  assert.match(three, /URL:https:\/\/fatihhoran\.github\.io\/backend-atolyesi\/#today/);
  const two = calendar(2, 'en', now);
  assert.equal((two.match(/BEGIN:VEVENT/g) || []).length, 2);
  assert.doesNotMatch(two, /T140000/);
});

test('browser reminders skip repeated slots, disabled afternoon slots, and late openings', () => {
  const morning = new Date(2026, 10, 8, 10, 4);
  assert.equal(due(morning, 3, '').key, '20261108-10');
  assert.equal(due(morning, 3, '20261108-10'), null);
  assert.equal(due(new Date(2026, 10, 8, 14, 0), 2, ''), null);
  assert.equal(due(new Date(2026, 10, 8, 19, 16), 3, ''), null);
});
