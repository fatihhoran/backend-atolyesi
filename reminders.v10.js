(() => {
'use strict';

const KEY = 'backend-atolyesi-reminders-v1';
const studyUrl = 'https://fatihhoran.github.io/backend-atolyesi/#today';
const slots = [10, 14, 19];
const labels = {
  tr: ['Sabah çalışması', 'Öğleden sonra pratiği', 'Akşam tekrarı'],
  en: ['Morning study', 'Afternoon practice', 'Evening review']
};
let timer;

const hours = count => count === 2 ? [10, 19] : slots;
const twoDigits = value => String(value).padStart(2, '0');
const localDate = value => value.getFullYear() + twoDigits(value.getMonth() + 1) + twoDigits(value.getDate());
const textField = value => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([;,])/g, '\\$1');

function foldLine(line) {
  const encoder = new TextEncoder();
  const rows = [];
  let row = '';
  let bytes = 0;
  for (const char of line) {
    const length = encoder.encode(char).length;
    if (bytes + length > 75) {
      rows.push(row);
      row = ' ';
      bytes = 1;
    }
    row += char;
    bytes += length;
  }
  return [...rows, row].join('\r\n');
}

function calendar(count, lang, now = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Atolye//Study reminders//TR', 'CALSCALE:GREGORIAN'];
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  for (const hour of hours(count)) {
    const start = new Date(now);
    start.setHours(hour, 0, 0, 0);
    if (start <= now) start.setDate(start.getDate() + 1);
    const summary = textField('Atölye · ' + labels[lang][slots.indexOf(hour)]);
    const description = textField((lang === 'en' ? 'Open your study plan: ' : 'Bugünkü planını aç: ') + studyUrl);
    lines.push('BEGIN:VEVENT', 'UID:study-' + hour + '@fatihhoran.github.io', 'DTSTAMP:' + stamp,
      'DTSTART:' + localDate(start) + 'T' + twoDigits(hour) + '0000', 'DURATION:PT15M', 'RRULE:FREQ=DAILY',
      'SUMMARY:' + summary, 'DESCRIPTION:' + description, 'URL:' + studyUrl, 'TRANSP:TRANSPARENT',
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:' + summary, 'END:VALARM', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

function read() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return { count: data?.count === 2 ? 2 : 3, enabled: data?.enabled === true, sent: data?.sent || '' };
  } catch {
    return { count: 3, enabled: false, sent: '' };
  }
}

function write(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
  catch { return false; }
}

function due(now, count, sent) {
  const hour = now.getHours();
  if (!hours(count).includes(hour) || now.getMinutes() > 15) return null;
  const key = localDate(now) + '-' + hour;
  return key === sent ? null : { hour, key };
}

async function check() {
  const data = read();
  if (!data.enabled || window.Notification?.permission !== 'granted') return;
  const slot = due(new Date(), data.count, data.sent);
  if (!slot) return;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration?.active || read().sent === slot.key) return;
  const latest = read();
  if (!latest.enabled || !hours(latest.count).includes(slot.hour)) return;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'tr';
  await registration.showNotification('Atölye · ' + labels[lang][slots.indexOf(slot.hour)], {
    body: lang === 'en' ? 'Your study plan is ready.' : 'Bugünkü çalışma planın hazır.',
    icon: new URL('./brand/install-192.v9.png', registration.scope).href,
    tag: 'atolye-study-' + slot.key
  });
  write({ ...read(), sent: slot.key });
}

function start() {
  clearInterval(timer);
  if (!read().enabled || window.Notification?.permission !== 'granted') return;
  const tick = () => check().catch(() => {});
  tick();
  timer = setInterval(tick, 60000);
}

function panel(en) {
  const settings = read();
  const active = settings.enabled && window.Notification?.permission === 'granted';
  return `<section class="panel" style="margin-bottom:16px">
    <h2>${en ? 'Study reminders' : 'Çalışma hatırlatmaları'}</h2>
    <label class="field-label" for="atolye-reminder-count">${en ? 'Reminders each day' : 'Günlük hatırlatma sayısı'}</label>
    <select id="atolye-reminder-count"><option value="2" ${settings.count === 2 ? 'selected' : ''}>2 · 10:00 / 19:00</option>
      <option value="3" ${settings.count === 3 ? 'selected' : ''}>3 · 10:00 / 14:00 / 19:00</option></select>
    <p>${en ? 'For alerts when Atölye is closed, import the calendar file and check that each repeat has an alert.' : 'Atölye kapalıyken uyarı almak için dosyayı takvimine aktar ve tekrar eden etkinliklerin uyarı ayarını kontrol et.'}</p>
    <div class="settings-actions"><button class="button" data-action="reminder-calendar">${en ? 'Download calendar file' : 'Takvim dosyasını indir'}</button>
      <button class="button button-outline" data-action="reminder-browser" aria-pressed="${active}">${en ? (active ? 'Turn off browser alerts' : 'Enable alerts while Atölye is open') : (active ? 'Tarayıcı bildirimlerini kapat' : 'Atölye açıkken bildirimleri etkinleştir')}</button></div>
  </section>`;
}

function download(count, lang) {
  const blob = new Blob([calendar(count, lang)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'atolye-hatirlatmalar.ics';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function action(name, en, toast, render) {
  const data = read();
  const count = Number(document.querySelector('#atolye-reminder-count')?.value) === 2 ? 2 : 3;
  if (name === 'reminder-calendar') {
    write({ ...data, count });
    download(count, en ? 'en' : 'tr');
    return;
  }
  if (data.enabled && window.Notification?.permission === 'granted') {
    if (!write({ ...data, count, enabled: false })) return toast(en ? 'Settings could not be saved.' : 'Ayarlar kaydedilemedi.');
  } else {
    if (!window.Notification || !navigator.serviceWorker) return toast(en ? 'Use the calendar file on this device.' : 'Bu cihazda takvim dosyasını kullan.');
    const permission = await Notification.requestPermission().catch(() => 'denied');
    if (permission !== 'granted') return toast(en ? 'Notification permission is off. You can use the calendar file.' : 'Bildirim izni kapalı. Takvim dosyasını kullanabilirsin.');
    if (!write({ ...data, count, enabled: true })) return toast(en ? 'Settings could not be saved.' : 'Ayarlar kaydedilemedi.');
  }
  start();
  if (location.hash.startsWith('#settings')) render(false);
}

if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
  if (!document.hidden) start();
});
window.AtolyeReminders = { calendar, due, panel, action, start, select: value => write({ ...read(), count: value === '2' ? 2 : 3 }) };
})();
