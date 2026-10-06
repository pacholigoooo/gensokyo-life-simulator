import {readFile,readdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
export async function addGuidance(routes){
 const files=(await readdir(new URL('data/guidance/',root))).filter(f=>f.endsWith('.json')).sort();
 const rows=(await Promise.all(files.map(async f=>JSON.parse(await readFile(new URL('data/guidance/'+f,root),'utf8'))))).flat(),seen=new Set();
 const expected='reimu sakuya ran yuyuko kaguya mokou eiki komachi toyohime yorihime sagume junko hecatia reisen tewi hina shinki sariel mima yumemi gengetsu mugetsu konngara kikuri yuugenmagan singyoku kanako suwako tenshi utsuho keiki zanmu yuma yuuka suika narumi aunn mai_teireida satono kutaka ariya'.split(' ');
 assert.deepEqual(rows.map(g=>g.id).sort(),expected.sort(),'all approved personal guidance routes must be authored');
 const text=(t,label)=>assert(typeof t==='string'&&t.length>=35&&t.length<=90,label);
 for(const g of rows){
  const route=routes.find(r=>r.id===g.id);assert(route?.romance&&!seen.has(g.id),g.id+': approved unique guide');seen.add(g.id);
  assert(g.title.length>=2&&/^https:\/\//.test(g.source)&&g.canon.length>=10&&g.fiction.length>=10,g.id+': evidence');
  assert(['longevity','protection','training','transformation'].includes(g.resultKind)&&g.grant.kind===g.resultKind,g.id+': result');
  if(g.species)assert(g.species.length&&g.species.every(s=>['human','magician','hermit','youkai','vampire','shikaisen'].includes(s)),g.id+': species');
  assert(g.stages.length>=2&&g.stages.length<=4,g.id+': stages');
  const keys=new Set(),bodies=new Set();
  for(const e of [...g.stages,g.followup]){
   assert(/^[a-z0-9_-]+$/.test(e.key)&&!keys.has(e.key),g.id+': stage key');keys.add(e.key);text(e.text,g.id+'/'+e.key);assert(!bodies.has(e.text));bodies.add(e.text);
   assert(Number.isInteger(e.delay)&&e.delay>=1&&e.delay<=12,g.id+': delay');
  }
  for(const e of g.stages){
   assert(e.when&&e.effects,g.id+': conditions and effects');
   for(const [k,v]of Object.entries(e.when.min||{}))assert(['health','insight','bond','fortune'].includes(k)&&Number.isInteger(v)&&v>=0&&v<=20,g.id+': threshold');
   for(const k of ['xp','trust','work'])if(e.when[k]!==undefined)assert(Number.isInteger(e.when[k])&&e.when[k]>=0&&e.when[k]<=20,g.id+': '+k);
   if(e.when.trust!==undefined)assert(e.when.trust<=4,g.id+': reachable earned lover trust');
   for(const [k,v]of Object.entries(e.effects))assert(['health','insight','bond','fortune'].includes(k)&&Number.isInteger(v)&&Math.abs(v)<=3,g.id+': effect');
   if(e.xp!==undefined)assert(Number.isInteger(e.xp)&&e.xp>=0&&e.xp<=3);
   if(e.wear!==undefined)assert(Number.isFinite(e.wear)&&Math.abs(e.wear)<=4);
   if(e.operation)assert(e.operation==='human-magic'&&g.grant.kind==='transformation'&&g.stages.indexOf(e)===1,g.id+': operation');
  }
  const gift=g.grant;
  if(gift.kind==='longevity')assert(Number.isInteger(gift.vitality)&&gift.vitality>=8&&gift.vitality<=24&&Number.isInteger(gift.years)&&gift.years>=4&&gift.years<=18&&gift.wear>=-6&&gift.wear<=-2,g.id+': finite longevity');
  if(gift.kind==='training')for(const[k,max]of Object.entries({insight:3,xp:8,practice:4}))assert(Number.isInteger(gift[k])&&gift[k]>=1&&gift[k]<=max,g.id+': training '+k);
  if(gift.kind==='protection'){assert(['health','pursuit'].includes(gift.cause)&&Number.isInteger(gift.health)&&gift.health>=3&&gift.health<=8&&typeof gift.selfMade==='boolean',g.id+': protection');text(gift.text,g.id+': rescue');if((route.romanceContact||route.contact).domain.includes('dream'))assert(gift.selfMade,g.id+': dream preparations must be self-made');}
  if(gift.kind==='transformation'){
   const last=g.stages.at(-1).when;
   assert(gift.species==='magician'&&g.stages.length===4&&g.stages[1].operation==='human-magic'&&last.work>=2&&last.min.health>=5&&last.min.insight>=13&&last.xp>=10,g.id+': personal fasting preparation');
  }
  route.guidance=g;
 }
 await writeFile(new URL('reports/guidance-coverage-v11.json',root),JSON.stringify({guides:rows.length,byKind:Object.fromEntries(['longevity','protection','training','transformation'].map(k=>[k,rows.filter(r=>r.resultKind===k).length])),coverage:rows},null,2)+'\n');
 return rows;
}
