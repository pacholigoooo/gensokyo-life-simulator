import {readFile,readdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const root=new URL('../',import.meta.url);
const prefix=s=>'love:'+s;
const condition=c=>({...c,...(c.relationFlags?{relationFlags:c.relationFlags.map(prefix)}:{}),...(c.missingRelationFlags?{missingRelationFlags:c.missingRelationFlags.map(prefix)}:{})});

export async function addRomances(routes){
 const files=(await readdir(new URL('data/romances/',root))).filter(f=>f.endsWith('.json')).sort();
 const entries=(await Promise.all(files.map(async f=>JSON.parse(await readFile(new URL('data/romances/'+f,root),'utf8'))))).flat();
 const scope=JSON.parse(await readFile(new URL('docs/romance-scope-v8.json',root),'utf8'));
 assert.deepEqual(entries.map(d=>d.id).sort(),scope.plannedRomanceIds.slice().sort(),'Romance roster must be complete before building');
 const seen=new Set(),coverage=[];
 for(const d of entries){
  const route=routes.find(r=>r.id===d.id);
  assert(route&&!seen.has(d.id),'Unknown or repeated romance '+d.id);seen.add(d.id);
  assert(d.echoes.length>= (d.extension?2:3),d.id+': romantic echoes');
  for(const e of d.echoes){assert(typeof e.text==='string'&&e.text.length>=15&&e.text.length<=85,d.id+': active echo');assert(typeof e.settledText==='string'&&e.settledText.length>=15&&e.settledText.length<=85&&e.settledText!==e.text,d.id+': settled echo');assert.deepEqual(e.states,['lover'],d.id+': intimate echo state');assert(/亲|吻/.test(d.echoes.map(x=>x.text).join('')),d.id+': missing kiss');}
  for(const e of d.echoes)if(e.settledVariants){assert(Array.isArray(e.settledVariants)&&e.settledVariants.length===4,d.id+': four later scenes');assert.equal(new Set([e.settledText,...e.settledVariants]).size,5,d.id+': distinct later scenes');for(const t of e.settledVariants)assert(typeof t==='string'&&t.length>=15&&t.length<=85,d.id+': later scene text');}
  if(d.extension){assert(['keine','yuuka'].includes(d.id),d.id+': existing romance extension');}
  else{
   assert(typeof d.title==='string'&&d.title.length<=30,d.id+': title');
   assert(/^https:\/\//.test(d.source),d.id+': source');
   assert(Object.keys(d.nodes).length>=6&&d.nodes[d.start],d.id+': six-stage romance');
   assert(typeof d.interrupted==='string'&&d.interrupted.length>=10&&d.interrupted.length<=65,d.id+': interrupted text');
   assert(typeof d.farewell==='string'&&d.farewell.length>=10&&d.farewell.length<=65,d.id+': farewell text');
   route.romance=true;route.romanceStart=prefix(d.start);route.romanceTitle=d.title;route.romanceSource=d.source;
   route.romanceInterrupted=d.interrupted;route.farewell.lover=d.farewell;route.farewell.friend??=d.interrupted;
   if(d.romanceContact){assert(d.intro&&typeof d.intro.text==='string',d.id+': separate encounter');route.romanceContact=d.romanceContact;route.romanceIntro=d.intro;}
   for(const [id,node]of Object.entries(d.nodes)){
    assert(!route.nodes[prefix(id)],d.id+': romance node collision');
    route.nodes[prefix(id)]={...node,branches:node.branches.map(b=>({...b,when:condition(b.when),next:b.next===null?null:prefix(b.next),...(b.set?{set:b.set.map(prefix)}:{}),...(b.clear?{clear:b.clear.map(prefix)}:{})}))};
   }
  }
  route.echoes.push(...d.echoes.map(e=>({...e,key:prefix(e.key),romanceEcho:true,...(e.when?{when:condition(e.when)}:{})})));
  coverage.push({id:d.id,extension:!!d.extension,title:d.title||route.title,nodes:d.extension?Object.keys(route.nodes).length:Object.keys(d.nodes).length,echoes:d.echoes.length,source:d.source||route.source,contact:d.romanceContact||route.contact});
 }
 await writeFile(new URL('reports/romance-coverage-v8.json',root),JSON.stringify({routes:coverage.length,coverage},null,2)+'\n');
 return coverage;
}
