import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const reportName = 'atolye-sonuc.json';
const checkpointName = 'atolye-kalicilik.json';
const taskPath = '/api/gorevler';
const productPath = '/api/urunler';
const label = prefix => `${prefix}-${randomUUID().slice(0, 10)}`;

function localHttp(target) {
  const url = new URL(target);
  if (!['http:', 'https:'].includes(url.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw Error('Kontroller için yalnızca yerel API adresini kullan. Örnek: http://127.0.0.1:5088');
  }
  return url.origin;
}

function client(base) {
  return async (method, path, expected, { body, token } = {}) => {
    const response = await fetch(base + path, {
      method, redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
    assert.ok([].concat(expected).includes(response.status), `${method} ${path} → ${response.status}, beklenen ${expected}`);
    const content = response.headers.get('Content-Type') || '';
    const text = content.includes('json') && response.status !== 204 ? await response.text() : '';
    const data = text.trim() ? JSON.parse(text) : null;
    return { status: response.status, data, location: response.headers.get('Location') };
  };
}

function taskOptions(token, body) {
  return { token, body };
}

async function createTask(http, token, details = {}) {
  const baslik = label('atolye');
  const created = await http('POST', taskPath, 201, taskOptions(token, { baslik, ...details }));
  assert.ok(Number.isSafeInteger(created.data?.id) && created.data.id > 0, 'Görev yanıtı pozitif sayısal id içermeli.');
  assert.equal(created.data.baslik, baslik);
  return { id: created.data.id, baslik };
}

async function loginPair(http) {
  const createUser = async () => {
    const email = label('atolye') + '@example.test';
    const password = 'T!' + randomUUID() + 'z7';
    await http('POST', '/auth/register', 200, { body: { email, password } });
    const response = await http('POST', '/auth/login?useCookies=false', 200, { body: { email, password } });
    assert.ok(typeof response.data?.accessToken === 'string' && response.data.accessToken.length > 10, 'Giriş accessToken dönmeli.');
    return response.data.accessToken;
  };
  return { a: await createUser(), b: await createUser() };
}

async function assertOwnership(http, { a, b }) {
  const task = await createTask(http, a);
  const path = taskPath + '/' + task.id;
  try {
    await http('GET', path, 200, { token: a });
    await http('GET', path, [403, 404], { token: b });
    await http('PUT', path, [403, 404], taskOptions(b, { baslik: 'Ele geçirilmiş görev', tamamlandi: true, durum: 'kapali', oncelik: 1 }));
    await http('DELETE', path, [403, 404], { token: b });
    const own = await http('GET', path, 200, { token: a });
    assert.equal(own.data?.baslik, task.baslik);
    const otherList = await http('GET', taskPath, 200, { token: b });
    const rows = Array.isArray(otherList.data) ? otherList.data : otherList.data?.kayitlar;
    assert.ok(Array.isArray(rows), 'Liste bir dizi veya kayitlar alanı döndürmeli.');
    assert.ok(!rows.some(row => row.id === task.id), 'Başkasının görevi listelenmemeli.');
  } finally {
    await http('DELETE', path, [204, 404], { token: a });
  }
}

function consoleChecks(dll) {
  const run = (input, expected) => {
    const output = execFileSync('dotnet', [resolve(dll)], { input, timeout: 5000, maxBuffer: 65536, encoding: 'utf8', windowsHide: true });
    assert.deepEqual(output.trim().split(/\r?\n/).filter(Boolean), expected);
  };
  return {
    'ekleme-liste': () => run('ekle API çalış\nekle SQL çalış\nliste\ncik\n', ['OK 1', 'OK 2', '1|API çalış|acik', '2|SQL çalış|acik']),
    tamamlama: () => run('ekle Git çalış\ntamamla 1\nliste\ncik\n', ['OK 1', 'OK', '1|Git çalış|tamam']),
    'gecersiz-girdi': () => run('ekle   \ntamamla x\ntamamla 77\nyanlis\nliste\ncik\n',
      ['HATA baslik', 'HATA kimlik', 'HATA bulunamadi', 'HATA komut', 'BOS'])
  };
}

async function openApi(http, route) {
  const { data } = await http('GET', '/openapi/v1.json', 200);
  assert.ok(data?.paths?.[route]?.get, 'OpenAPI belgesinde GET ' + route + ' bulunmalı.');
}

function productChecks(http) {
  const create = async () => {
    const ad = label('urun');
    const { data, location } = await http('POST', productPath, 201, { body: { ad, fiyat: 30 } });
    assert.ok(Number.isSafeInteger(data?.id) && data.id > 0, 'Ürün yanıtında sayısal id olmalı.');
    const path = productPath + '/' + data.id;
    assert.ok(location?.endsWith(path), '201 yanıtı oluşturulan ürünün Location başlığını içermeli.');
    return { ad, path, id: data.id };
  };
  return {
    'urun-crud': async () => {
      const product = await create();
      try {
        const list = await http('GET', productPath, 200);
        assert.ok(list.data?.some(row => row.id === product.id), 'Yeni ürün listede yer almalı.');
        await http('GET', product.path, 200);
        await http('PUT', product.path, 200, { body: { ad: product.ad + '-2', fiyat: 42 } });
        const updated = await http('GET', product.path, 200);
        assert.equal(updated.data?.ad, product.ad + '-2');
        assert.equal(updated.data?.fiyat, 42);
      } finally {
        await http('DELETE', product.path, 204);
      }
      await http('GET', product.path, 404);
    },
    'patch-ve-dogrulama': async () => {
      await http('POST', productPath, 400, { body: { ad: 'Geçersiz', fiyat: -1 } });
      const product = await create();
      try {
        await http('PATCH', product.path + '/fiyat', 400, { body: { fiyat: -5 } });
        await http('PATCH', product.path + '/fiyat', 200, { body: { fiyat: 39.90 } });
        const updated = await http('GET', product.path, 200);
        assert.equal(updated.data?.ad, product.ad);
        assert.equal(updated.data?.fiyat, 39.90);
      } finally {
        await http('DELETE', product.path, 204);
      }
    },
    openapi: () => openApi(http, productPath)
  };
}

function identityChecks(http) {
  let users;
  return {
    'kayit-ve-giris': async () => { users = await loginPair(http); },
    'kimlik-zorunlu': async () => {
      await http('GET', taskPath, 401);
      await http('GET', taskPath, 401, { token: 'invalid-atolye-token' });
    },
    'gorev-sahipligi': async () => assertOwnership(http, users ?? await loginPair(http))
  };
}

function deployChecks(http) {
  return {
    saglik: () => http('GET', '/health', 200),
    openapi: () => openApi(http, taskPath),
    'container-http': async () => {
      await http('GET', taskPath, 401);
      const users = await loginPair(http);
      await assertOwnership(http, users);
    }
  };
}

function finalChecks(http) {
  let users;
  return {
    'gorev-sahipligi': async () => {
      users = await loginPair(http);
      await assertOwnership(http, users);
    },
    'kategori-ve-oncelik': async () => {
      const { a, b } = users ?? await loginPair(http);
      const response = await http('POST', '/api/kategoriler', 201, taskOptions(a, { ad: label('kategori') }));
      const id = response.data?.id;
      assert.ok(Number.isSafeInteger(id) && id > 0, 'Kategori pozitif sayısal id dönmeli.');
      try {
        const own = await createTask(http, a, { kategoriId: id, oncelik: 3, durum: 'acik' });
        try {
          const task = await http('GET', taskPath + '/' + own.id, 200, { token: a });
          assert.equal(task.data?.kategoriId, id);
          assert.equal(task.data?.oncelik, 3);
          await http('POST', taskPath, [403, 404], taskOptions(b, { baslik: label('gecersiz'), kategoriId: id, durum: 'acik', oncelik: 2 }));
        } finally {
          await http('DELETE', taskPath + '/' + own.id, 204, { token: a });
        }
      } finally {
        await http('DELETE', '/api/kategoriler/' + id, 204, { token: a });
      }
    },
    'filtre-ve-sayfa': async () => {
      const { a } = await loginPair(http);
      const created = [];
      try {
        created.push(await createTask(http, a, { oncelik: 1, durum: 'acik' }));
        created.push(await createTask(http, a, { oncelik: 3, durum: 'acik' }));
        created.push(await createTask(http, a, { oncelik: 2, durum: 'kapali' }));
        const path = taskPath + '?durum=acik&boyut=1&sayfa=';
        const first = await http('GET', path + '1', 200, { token: a });
        const second = await http('GET', path + '2', 200, { token: a });
        assert.deepEqual(first.data?.kayitlar?.map(task => task.id), [created[1].id]);
        assert.deepEqual(second.data?.kayitlar?.map(task => task.id), [created[0].id]);
        assert.equal(first.data?.toplam, 2);
      } finally {
        for (const task of created) await http('DELETE', taskPath + '/' + task.id, 204, { token: a });
      }
    },
    openapi: () => openApi(http, taskPath)
  };
}

async function persistenceChecks(http, base, phase) {
  if (phase === 'hazirla') {
    if (existsSync(checkpointName)) throw Error('Önce mevcut kalıcılık kontrolünü tamamla veya eski kontrol dosyasını taşı.');
    const task = await createTask(http);
    writeFileSync(checkpointName, JSON.stringify({ ...task, base }), { flag: 'wx' });
    console.log(`Deneme görevi ${task.id} oluşturuldu. API’yi yeniden başlat ve dogrula komutunu çalıştır.`);
    return null;
  }
  if (phase !== 'dogrula') throw Error('Bu görev için önce hazirla, yeniden başlattıktan sonra dogrula kullan.');
  const checkpoint = JSON.parse(readFileSync(checkpointName, 'utf8'));
  assert.equal(checkpoint.base, base, 'İlk adımın API adresini kullan.');
  assert.ok(Number.isSafeInteger(checkpoint.id) && checkpoint.id > 0 && /^atolye-[0-9a-f-]+$/.test(checkpoint.baslik), 'Kontrol kaydı geçersiz.');
  return {
    'gorev-yazma': () => http('POST', taskPath, 400, { body: { baslik: ' ' } }),
    kalicilik: async () => {
      const url = taskPath + '/' + checkpoint.id;
      const read = await http('GET', url, 200);
      assert.equal(read.data?.baslik, checkpoint.baslik);
      // Delete only the positively identified temporary exercise record.
      await http('DELETE', url, 204);
      unlinkSync(checkpointName);
    }
  };
}

async function evaluate(project, checks) {
  const results = [];
  for (const [id, check] of Object.entries(checks)) {
    try {
      await check();
      results.push({ id, passed: true });
      console.log('✓ ' + id);
    } catch (error) {
      results.push({ id, passed: false });
      console.log('✗ ' + id + ' · ' + error.message);
    }
  }
  writeFileSync(reportName, JSON.stringify({ version: 1, project, checks: results }, null, 2) + '\n');
  console.log('Rapor: ' + reportName);
  return results.every(item => item.passed);
}

export async function main([project, target, phase]) {
  const handlers = { 'hafta-2': productChecks, 'hafta-4': identityChecks, 'hafta-5': deployChecks, 'hafta-6': finalChecks };
  if (!target || !/^hafta-[1-6]$/.test(project || '')) throw Error('Kullanım: node kontrol.mjs hafta-N HEDEF [hazirla|dogrula]');
  if (project === 'hafta-1') return evaluate(project, consoleChecks(target));
  const base = localHttp(target);
  const http = client(base);
  if (project === 'hafta-3') {
    const checks = await persistenceChecks(http, base, phase);
    return checks ? evaluate(project, checks) : true;
  }
  return evaluate(project, handlers[project](http));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).then(pass => { if (!pass) process.exitCode = 1; }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
