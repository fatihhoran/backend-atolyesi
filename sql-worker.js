'use strict';
importScripts('./vendor/sqljs/sql-wasm.js');
let db;
const ready=initSqlJs({locateFile:file=>'./vendor/sqljs/'+file}).then(SQL=>{
 db=new SQL.Database();
 db.run(`PRAGMA foreign_keys=ON;
 CREATE TABLE Kullanicilar (Id INTEGER PRIMARY KEY, Ad TEXT NOT NULL);
 CREATE TABLE Gorevler (Id INTEGER PRIMARY KEY, Baslik TEXT NOT NULL, Tamamlandi INTEGER NOT NULL CHECK(Tamamlandi IN (0,1)), Oncelik INTEGER NOT NULL, KullaniciId INTEGER NOT NULL REFERENCES Kullanicilar(Id));
 INSERT INTO Kullanicilar VALUES (1,'Fatih'),(2,'Ece'),(3,'Deniz'),(4,'Can');
 INSERT INTO Gorevler VALUES
 (1,'C# temelleri',0,2,1),(2,'SQL JOIN çalış',1,1,1),
 (3,'API geliştir',0,3,2),(4,'EF Core tekrarı',1,2,2),
 (5,'Test yaz',0,1,3),(6,'Git commit',1,2,3),
 (7,'LINQ pratiği',0,1,1),(8,'README hazırla',0,1,2);`);
 self.postMessage({type:'ready'});
});
self.onmessage=async event=>{
 const {id,sql,locale}=event.data;if(typeof sql!=='string'||sql.length>15000){self.postMessage({id,error:locale==='en'?'A query can contain at most 15000 characters.':'Sorgu en fazla 15000 karakter olabilir.'});return;}
 try{await ready;const start=performance.now();const before=db.exec('SELECT total_changes()')[0].values[0][0];const results=[];let truncated=false,total=0;
 // Streaming statements cap transferred rows, so a normal large SELECT cannot flood the UI.
 for(const stmt of db.iterateStatements(sql)){
  const columns=stmt.getColumnNames(),values=[];
  while(stmt.step()){if(columns.length){if(total<200){values.push(stmt.get());total++;}else{truncated=true;break;}}}
  if(columns.length)results.push({columns,values});
 }
 const after=db.exec('SELECT total_changes()')[0].values[0][0];
 self.postMessage({id,results,truncated,changed:after-before,elapsed:Math.round(performance.now()-start)});
 }catch(error){self.postMessage({id,error:String(error.message||error)});}
};
