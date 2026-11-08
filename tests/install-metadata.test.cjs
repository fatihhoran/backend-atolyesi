const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const read = file => readFileSync(path.join(__dirname, '..', file));
const worker = read('sw.js').toString();
const assets = JSON.parse(worker.match(/const ASSETS=(\[[^;]+\]);/)[1]);

test('both manifests retain the installed identity and use the new mobile icon set', () => {
  for (const file of ['manifest.json', 'manifest.en.json']) {
    const manifest = JSON.parse(read(file));
    assert.equal(manifest.id, './');
    assert.equal(manifest.start_url, './?source=pwa');
    assert.equal(manifest.scope, './');
    assert.equal(manifest.background_color, '#101827');
    assert.equal(manifest.name, 'Atölye');
    assert.deepEqual(manifest.icons.map(icon => icon.purpose), ['any', 'any', 'maskable']);
    for (const icon of manifest.icons) {
      assert.match(icon.src, /\.v9\.png$/);
      assert.ok(assets.includes(icon.src));
      const file = read(icon.src);
      assert.equal(`${file.readUInt32BE(16)}x${file.readUInt32BE(20)}`, icon.sizes);
    }
  }
  const html = read('index.html').toString();
  for (const file of ['./launch.v9.css', './brand/launch-mark.svg', './brand/install-apple-180.v9.png']) {
    assert.ok(assets.includes(file) && html.includes(file), file);
  }
  assert.deepEqual(read('icons/icon-192.png'), read('brand/install-192.v9.png'));
  assert.deepEqual(read('icons/icon-512.png'), read('brand/install-512.v9.png'));
  assert.deepEqual(read('icons/maskable-512.png'), read('brand/install-maskable-512.v9.png'));
});

test('installation metadata is revalidated online and remains available offline', async () => {
  const scope = 'https://example.test/backend-atolyesi/';
  const handlers = new Map();
  const cacheData = new Map();
  let network = 'online';
  const json = name => new Response(JSON.stringify({ name }), { headers: { 'Content-Type': 'application/json' } });
  const context = vm.createContext({
    URL, Set, Response,
    self: { location: { href: scope + 'sw.js' }, addEventListener: (type, handler) => handlers.set(type, handler) },
    caches: { open: async () => ({
      put: async (request, response) => cacheData.set(request.url, response),
      match: async request => cacheData.get(request.url)?.clone()
    }) },
    fetch: async (request, options) => {
      assert.equal(options.cache, 'no-cache');
      if (network === 'offline') throw Error('offline');
      if (network === 'invalid') return new Response('<html>Unexpected page</html>', { headers: { 'Content-Type': 'text/html' } });
      return json('Atölye');
    }
  });
  vm.runInContext(worker, context);
  for (const name of ['manifest.json', 'manifest.en.json']) {
    const request = { url: scope + name, method: 'GET' };
    cacheData.set(request.url, json('Backend Atölyesi'));
    const fetchManifest = () => {
      let response;
      handlers.get('fetch')({ request, respondWith: promise => { response = promise; } });
      return response;
    };
    network = 'online';
    assert.equal((await (await fetchManifest()).json()).name, 'Atölye');
    for (const state of ['offline', 'invalid']) {
      network = state;
      assert.equal((await (await fetchManifest()).json()).name, 'Atölye');
    }
  }
});
