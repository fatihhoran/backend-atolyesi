import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, rmdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const runner = fileURLToPath(new URL('../pratik/kontrol.mjs', import.meta.url));

// Local HTTP test fixture for the runner's contracts and negative paths.
async function fixture(t, { protectedTasks = true, allowOtherOwner = false } = {}) {
  const products = new Map();
  const tasks = new Map();
  const categories = new Map();
  const users = new Map();
  let next = 1;
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const [, api, resource, id, extra] = url.pathname.split('/');
    const method = req.method;
    const send = (status, json, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
      res.end(json === undefined ? undefined : JSON.stringify(json));
    };
    const buffers = [];
    for await (const buffer of req) buffers.push(buffer);
    const data = buffers.length ? JSON.parse(Buffer.concat(buffers).toString()) : {};
    if (api === 'health') return send(200, {});
    if (api === 'openapi') return send(200, { paths: { '/api/urunler': { get: {} }, '/api/gorevler': { get: {} } } });
    if (api === 'auth' && resource === 'register') {
      users.set(data.email, data.password);
      return send(200);
    }
    if (api === 'auth' && resource === 'login') {
      return users.get(data.email) === data.password ? send(200, { accessToken: data.email }) : send(401);
    }
    const table = { urunler: products, gorevler: tasks, kategoriler: categories }[resource];
    if (!table) return send(404);
    const owner = req.headers.authorization?.slice('Bearer '.length);
    const needsAuth = resource !== 'urunler' && protectedTasks;
    if (needsAuth && !users.has(owner)) return send(401);
    if (resource === 'urunler' && ['POST', 'PUT', 'PATCH'].includes(method) && !(data.fiyat > 0)) return send(400);
    if (method === 'POST') {
      if (resource === 'gorevler' && !data.baslik?.trim()) return send(400);
      if (resource === 'gorevler' && data.kategoriId && categories.get(data.kategoriId)?.owner !== owner) return send(404);
      const row = { ...data, owner, id: next++ };
      table.set(row.id, row);
      return send(201, row, { Location: '/api/' + resource + '/' + row.id });
    }
    if (method === 'GET' && !id) {
      let rows = [...table.values()].filter(row => !needsAuth || row.owner === owner);
      if (resource === 'urunler') return send(200, rows);
      if (url.searchParams.has('durum')) rows = rows.filter(row => row.durum === url.searchParams.get('durum'));
      rows.sort((a, b) => (b.oncelik ?? 0) - (a.oncelik ?? 0) || a.id - b.id);
      const size = Number(url.searchParams.get('boyut')) || 10;
      const page = Number(url.searchParams.get('sayfa')) || 1;
      return send(200, { toplam: rows.length, kayitlar: rows.slice((page - 1) * size, page * size) });
    }
    const row = table.get(Number(id));
    if (!row || (needsAuth && row.owner !== owner && !allowOtherOwner)) return send(404);
    if (method === 'GET') return send(200, row);
    if (method === 'PUT' || (method === 'PATCH' && extra === 'fiyat')) return send(200, Object.assign(row, data));
    if (method === 'DELETE') {
      table.delete(row.id);
      return send(204);
    }
    return send(405);
  });
  const directory = await mkdtemp(join(tmpdir(), 'atolye-practice-'));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    for (const name of ['atolye-sonuc.json', 'atolye-kalicilik.json']) await rm(join(directory, name), { force: true });
    await rmdir(directory);
  });
  const base = 'http://127.0.0.1:' + server.address().port;
  const execute = (week, ...extra) => run(process.execPath, [runner, week, base, ...extra], { cwd: directory });
  const report = async () => JSON.parse(await readFile(join(directory, 'atolye-sonuc.json'), 'utf8'));
  return { execute, report };
}

test('local practice runner produces passing reports for product, identity, deployment HTTP and final contracts', async t => {
  const { execute, report } = await fixture(t);
  for (const week of ['hafta-2', 'hafta-4', 'hafta-5', 'hafta-6']) {
    await execute(week);
    const result = await report();
    assert.equal(result.project, week);
    assert.ok(result.checks.every(check => check.passed), JSON.stringify(result));
  }
});

test('persistence check uses the same locally generated task and resets its checkpoint', async t => {
  const { execute, report } = await fixture(t, { protectedTasks: false });
  await execute('hafta-3', 'hazirla');
  await assert.rejects(execute('hafta-3', 'hazirla'), /kalıcılık kontrolünü/);
  await execute('hafta-3', 'dogrula');
  assert.ok((await report()).checks.every(check => check.passed));
  await execute('hafta-3', 'hazirla');
});

test('the runner records a failed ownership check and rejects a non-local API', async t => {
  const { execute, report } = await fixture(t, { allowOtherOwner: true });
  await assert.rejects(execute('hafta-4'), error => error.code === 1);
  const checks = (await report()).checks;
  assert.equal(checks.find(check => check.id === 'gorev-sahipligi').passed, false);
  await assert.rejects(run(process.execPath, [runner, 'hafta-2', 'https://example.test']), /yalnızca yerel/);
});
