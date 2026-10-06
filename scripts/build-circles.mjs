import {readFile,readdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
export async function addCircles(routes,characters){
 const files=(await readdir(new URL('data/circles/',root))).filter(f=>f.endsWith('.json')).sort();
 const rows=(await Promise.all(files.map(async f=>JSON.parse(await readFile(new URL('data/circles/'+f,root),'utf8'))))).flat();
 assert.deepEqual(rows.map(r=>r.id).sort(),routes.filter(r=>r.romance).map(r=>r.id).sort(),'All approved romances need a checked circle record');
 for(const row of rows){
  assert(row.visits.length<=2&&typeof row.note==='string'&&row.note.length>10,row.id+': circle evidence');
  assert.equal(new Set(row.visits.map(v=>v.key)).size,row.visits.length,row.id+': circle keys');
  for(const v of row.visits){
   assert(characters.some(c=>c.id===v.person)&&v.person!==row.id,row.id+': related person');assert(/^https:\/\//.test(v.source)&&v.relation.length>1,row.id+': circle source');assert(v.text.length>=35&&v.text.length<=85,row.id+': circle text');if(v.memoryOnly!==undefined)assert.equal(v.memoryOnly,true);
   assert.equal(v.scenes.length,3,row.id+': three continuing circle scenes');
   assert.equal(new Set(v.scenes.map(d=>d.key)).size,3,row.id+': circle scene keys');
   const bodies=new Set([v.text]);for(const d of v.scenes){assert(/^[a-z0-9_-]+$/.test(d.key)&&d.key!=='first',row.id+': circle scene key');assert(d.text.length>=35&&d.text.length<=85,row.id+': circle scene text');assert(!bodies.has(d.text),row.id+': repeated circle body');bodies.add(d.text);}
  }
  routes.find(r=>r.id===row.id).circle=row;
 }
 await writeFile(new URL('reports/circle-coverage-v11.json',root),JSON.stringify({checked:rows.length,withVisits:rows.filter(r=>r.visits.length).length,gaps:rows.filter(r=>!r.visits.length),coverage:rows},null,2)+'\n');
}
