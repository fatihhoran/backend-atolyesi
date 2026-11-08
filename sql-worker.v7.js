'use strict';
importScripts('./vendor/sqljs/sql-wasm.js');

const ready = initSqlJs({ locateFile: file => './vendor/sqljs/' + file });
let workspace;
ready.then(() => self.postMessage({ type: 'ready' }));

function seed(SQL) {
  const db = new SQL.Database();
  db.run(`PRAGMA foreign_keys=ON;
    CREATE TABLE Kullanicilar (Id INTEGER PRIMARY KEY, Ad TEXT NOT NULL);
    CREATE TABLE Gorevler (Id INTEGER PRIMARY KEY, Baslik TEXT NOT NULL, Tamamlandi INTEGER NOT NULL CHECK(Tamamlandi IN (0,1)), Oncelik INTEGER NOT NULL, KullaniciId INTEGER NOT NULL REFERENCES Kullanicilar(Id));
    INSERT INTO Kullanicilar VALUES (1,'Fatih'),(2,'Ece'),(3,'Deniz'),(4,'Can');
    INSERT INTO Gorevler VALUES
      (1,'C# temelleri',0,2,1),(2,'SQL JOIN çalış',1,1,1),
      (3,'API geliştir',0,3,2),(4,'EF Core tekrarı',1,2,2),
      (5,'Test yaz',0,1,3),(6,'Git commit',1,2,3),
      (7,'LINQ pratiği',0,1,1),(8,'README hazırla',0,1,2);`);
  return db;
}

self.onmessage = async event => {
  const { id, sql, locale, isolated } = event.data;
  if (typeof sql !== 'string' || sql.length > 15000) {
    self.postMessage({ id, error: locale === 'en' ? 'A query can contain at most 15000 characters.' : 'Sorgu en fazla 15000 karakter olabilir.' });
    return;
  }
  let db;
  try {
    const SQL = await ready;
    db = isolated ? seed(SQL) : (workspace ??= seed(SQL));
    const start = performance.now();
    const changes = () => db.exec('SELECT total_changes()')[0].values[0][0];
    const before = changes();
    const results = [];
    let truncated = false;
    let total = 0;
    for (const statement of db.iterateStatements(sql)) {
      const columns = statement.getColumnNames();
      const values = [];
      while (statement.step()) {
        if (columns.length === 0) continue;
        if (total >= 200) {
          truncated = true;
          break;
        }
        values.push(statement.get());
        total++;
      }
      if (columns.length) results.push({ columns, values });
      if (truncated || results.length >= 20) {
        truncated = true;
        break;
      }
    }
    self.postMessage({ id, results, truncated, changed: changes() - before, elapsed: Math.round(performance.now() - start) });
  } catch (error) {
    self.postMessage({ id, error: String(error.message || error) });
  } finally {
    if (isolated) db?.close();
  }
};
