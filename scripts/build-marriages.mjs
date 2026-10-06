import {readFile,readdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
export async function addMarriages(routes){
 const files=(await readdir(new URL('data/marriages/',root))).filter(f=>f.endsWith('.json')).sort();
 const rows=(await Promise.all(files.map(async f=>JSON.parse(await readFile(new URL('data/marriages/'+f,root),'utf8'))))).flat();
 const expected=routes.filter(r=>r.romance).map(r=>r.id).sort();
 assert.deepEqual(rows.map(r=>r.id).sort(),expected,'Each approved romance has one marriage');
 const texts=new Set();
 const check=(text,label)=>{assert(typeof text==='string'&&text.length>=15&&text.length<=85,label);assert(!texts.has(text),'Repeated marriage text: '+label);texts.add(text);};
 for(const row of rows){
  for(const key of ['proposal','planning','wedding','farewell','surviving','bereaved','memory'])check(row[key],row.id+'/'+key);
  assert.equal(row.courtship.length,2,row.id+': two premarital dates');
  assert.equal(new Set(row.courtship.map(d=>d.key)).size,2,row.id+': courtship keys');
  for(const d of row.courtship){assert(/^[a-z0-9_-]+$/.test(d.key));assert(d.text.length>=35,row.id+': courtship text');check(d.text,row.id+'/courtship/'+d.key);}
  assert.equal(row.daily.length,6,row.id+': six daily scenes');assert.equal(new Set(row.daily.map(d=>d.key)).size,6);
  for(const d of row.daily){assert(/^[a-z0-9_-]+$/.test(d.key));check(d.text,row.id+'/'+d.key);check(d.settledText,row.id+'/'+d.key+'/settled');}
  for(const d of row.daily)if(d.settledVariants){assert(Array.isArray(d.settledVariants)&&d.settledVariants.length===4,row.id+': four later scenes');for(const t of d.settledVariants)check(t,row.id+'/'+d.key+'/later');}
  routes.find(r=>r.id===row.id).marriage=row;
 }
 await writeFile(new URL('reports/marriage-coverage-v11.json',root),JSON.stringify({routes:rows.length,texts:texts.size,coverage:rows.map(r=>({id:r.id,courtship:r.courtship.length,stages:3,daily:r.daily.length,farewell:true}))},null,2)+'\n');
 return rows;
}
