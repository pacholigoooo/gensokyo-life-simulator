import {readFile,writeFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {addRomances} from './build-romances.mjs';
import {addCircles} from './build-circles.mjs';
import {addGuidance} from './build-guidance.mjs';
import {addMarriages} from './build-marriages.mjs';
import '../dist/talents.js';
import '../dist/contacts.js';
const root=new URL('../',import.meta.url),stats=['health','insight','bond','fortune'];
const states=['acquaintance','friend','confidant','mentor','rival','enemy','estranged','reconciled','lover'];
const conditionKeys=['min','max','minAge','maxAge','habitats','species','careers','talentsAny','training','flags','missingFlags','relationFlags','missingRelationFlags','minTrust','maxTrust','minVisits','minYears','freePartner'];
const relationOnly=['relationFlags','missingRelationFlags','minTrust','maxTrust','minVisits','minYears'];
const text=(v,label,max=65)=>assert(typeof v==='string'&&v.length>=2&&v.length<=max,label+': text');
function effects(fx,label){assert(fx&&typeof fx==='object',label+': effects');for(const [k,v]of Object.entries(fx))assert(stats.includes(k)&&Number.isInteger(v)&&Math.abs(v)<=5,label+': effect '+k);}
function conditions(c,label,entry=false){
 assert(c&&typeof c==='object'&&!Array.isArray(c),label+': conditions');
 for(const k of Object.keys(c))assert(conditionKeys.includes(k)&&(!entry||!relationOnly.includes(k)),label+': condition '+k);
 for(const key of ['min','max'])for(const [k,v]of Object.entries(c[key]||{}))assert(stats.includes(k)&&Number.isInteger(v)&&v>=0&&v<=30,label+': threshold');
 for(const key of ['minAge','maxAge','minVisits','minYears'])if(c[key]!==undefined)assert(Number.isFinite(c[key])&&c[key]>=0,label+': '+key);
 for(const key of ['minTrust','maxTrust'])if(c[key]!==undefined)assert(Number.isInteger(c[key])&&Math.abs(c[key])<=10,label+': trust');
 for(const key of ['habitats','species','careers','talentsAny','flags','missingFlags','relationFlags','missingRelationFlags'])if(c[key])assert(Array.isArray(c[key])&&c[key].length&&c[key].every(x=>typeof x==='string'),label+': '+key);
 for(const id of c.careers||[])assert(['scholar','garden','trade','craft','magic'].includes(id),label+': ordinary career '+id);
 for(const id of c.habitats||[])assert(['village','outskirts','forest','mountain','mansion'].includes(id),label+': ordinary habitat '+id);
 for(const id of c.species||[])assert(['human','youkai','hermit','magician','vampire'].includes(id),label+': ordinary species '+id);
 for(const id of c.talentsAny||[])assert(TouhouTalents.list.some(t=>t.id===id),label+': talent '+id);
 if(c.training)for(const [key,flag]of Object.entries(c.training)){assert(['career','talent'].includes(key),label+': training key');assert(c[key==='career'?'careers':'talentsAny'],label+': training alternative');assert(['practice:craft','practice:garden','practice:moon','practice:promise'].includes(flag),label+': training flag');}
 if(c.freePartner!==undefined)assert.equal(c.freePartner,true,label+': freePartner');
 if(c.minAge!==undefined&&c.maxAge!==undefined)assert(c.minAge<=c.maxAge,label+': age order');
}
export async function buildRelationships(characters){
 const files=(await readdir(new URL('data/relationships/',root))).filter(f=>f.endsWith('.json')).sort();
 const routes=(await Promise.all(files.map(async f=>JSON.parse(await readFile(new URL('data/relationships/'+f,root),'utf8'))))).flat();
 const romances=await addRomances(routes);
 const practice=JSON.parse(await readFile(new URL('data/meeting-practice.json',root),'utf8'));
 for(const [id,nodes]of Object.entries(practice)){const route=routes.find(r=>r.id===id);assert(route?.romance,id+': practice route');route.meetingPractice=nodes;for(const [key,p]of Object.entries(nodes)){assert(route.nodes[key],id+': practice node');conditions({min:p.min},id+'/'+key+' practice');assert(p.texts.length>=1&&p.texts.length<=4);if(p.gains)assert(p.gains.length===4&&p.gains.every(n=>Number.isInteger(n)&&n>=1&&n<=2),id+': practice gains');for(const t of p.texts)text(t,id+'/'+key+' practice',100);}}
 await addMarriages(routes);
 await addCircles(routes,characters);
 await addGuidance(routes);
 assert.equal(routes.length,characters.length,'Every starting identity needs an ordinary-life relationship');
 const gates=JSON.parse(await readFile(new URL('data/romance-gates.json',root),'utf8'));
 assert.equal(new Set(gates.map(g=>g.id)).size,gates.length,'duplicate romance gate');
 assert.deepEqual(gates.map(g=>g.id).sort(),routes.filter(r=>r.romance).map(r=>r.id).sort(),'romance gate coverage');
 for(const gate of gates){assert(['main','pc98','hifuu'].includes(gate.category));assert.equal(typeof gate.transition,'boolean');text(gate.text,gate.id+' transition',110);routes.find(r=>r.id===gate.id).romanceGate=gate;}
 const young=JSON.parse(await readFile(new URL('data/young-romances.json',root),'utf8'));
 assert.deepEqual(young.map(y=>y.id).sort(),['akyuu','kosuzu','marisa','reimu'],'reviewed youth routes');
 for(const y of young){
  const d=routes.find(r=>r.id===y.id),original=Object.keys(d.nodes).filter(k=>k.startsWith('love:'));
  assert.equal(y.canonAge,'unknown',y.id+': do not invent a canon age');
  conditions(y.entry,y.id+' youth entry',true);assert(y.entry.minAge===10&&y.entry.maxAge===11,y.id+': youth meeting years');
  for(const [k,v]of Object.entries(d.entry))if(!['minAge','maxAge','min'].includes(k))assert.deepEqual(y.entry[k],v,y.id+': retain entry '+k);
  for(const [k,v]of Object.entries(d.entry.min||{}))assert(y.entry.min[k]>=v,y.id+': retain entry stat '+k);
  text(y.intro.text,y.id+' youth introduction',110);text(y.intro.label,y.id);effects(y.intro.effects,y.id);
  assert(y.sources.length&&y.sources.every(s=>/^https:\/\//.test(s.url)&&s.claim),y.id+': youth evidence');
  assert.deepEqual(Object.keys(y.texts).sort(),original.sort(),y.id+': complete youth story text');
  const key=k=>k===null?null:k.replace(/^love:/,'young:');
  for(const oldKey of original){
   const n=structuredClone(d.nodes[oldKey]);
   assert.deepEqual(Object.keys(y.texts[oldKey]).sort(),n.branches.map(b=>b.key).sort(),y.id+': youth branch coverage');
   for(const b of n.branches){b.text=y.texts[oldKey][b.key];b.next=key(b.next);if(b.status==='lover')b.when.minAge=16;}
   d.nodes[key(oldKey)]=n;
  }
  const {texts,...metadata}=y;d.young={...metadata,start:key(d.romanceStart)};
  if(y.id==='marisa'){assert(y.entry.min.health>=5,'real forest approach');d.young.contactFlag='contact:forest';}
  assert.equal(y.scenes.length,2,y.id+': two young couple scenes');for(const e of y.scenes){text(e.key,y.id);text(e.text,y.id,85);}
 }
 const ids=new Set(),texts=new Set(),coverage=[];
 for(const d of routes){
  assert(characters.some(c=>c.id===d.id)&&!ids.has(d.id),'Relationship id '+d.id);ids.add(d.id);
  text(d.title,d.id);assert(/^https:\/\//.test(d.source),d.id+': source');assert.equal(typeof d.romance,'boolean');
  assert(d.contact&&Object.hasOwn(TouhouContacts.domains,d.contact.domain),d.id+': contact domain');
  text(d.contact.place,d.id+' contact place',30);
  if(d.contact.domain.includes('dream')||d.contact.premise!==undefined)text(d.contact.premise,d.id+' contact premise',100);
  if(d.romance)assert(romances.some(r=>r.id===d.id),d.id+': romance coverage');
  if(d.romanceContact){assert(Object.hasOwn(TouhouContacts.domains,d.romanceContact.domain),d.id+': romantic domain');text(d.romanceContact.place,d.id+' romantic place',30);text(d.romanceContact.premise,d.id+' romantic premise',100);text(d.romanceIntro.text,d.id+' romantic intro');text(d.romanceIntro.label,d.id+' romantic intro label');effects(d.romanceIntro.effects,d.id);}
  conditions(d.entry,d.id+' entry',true);assert(d.entry.minAge>=18,d.id+': adult entry');
  if(d.preparedEntry){conditions(d.preparedEntry,d.id+' prepared entry',true);assert(d.preparedEntry.minAge>=18&&d.preparedEntry.flags.includes('visit:'+d.id),d.id+': narrated visitor entry');}
  if(d.preparedIntro){text(d.preparedIntro.text,d.id+' visitor intro');text(d.preparedIntro.label,d.id+' visitor label');effects(d.preparedIntro.effects,d.id);assert.equal(d.preparedIntro.next,d.intro.next,d.id+': same personal story');}
  assert.equal(new Set(d.talents).size,d.talents.length,d.id+': repeated affinity talent');
  for(const id of d.talents)assert(TouhouTalents.list.some(t=>t.id===id),d.id+': talent '+id);assert(Array.isArray(d.careers));
  text(d.intro.text,d.id);text(d.intro.label,d.id);effects(d.intro.effects,d.id);
  assert(Object.keys(d.nodes).length>=8&&d.nodes[d.intro.next],d.id+': nodes');
  const keys=new Set(),flags=new Set(),needed=new Set();let count=0;
  for(const [node,n]of Object.entries(d.nodes)){
   assert(Number.isInteger(n.delay)&&n.delay>=1&&n.delay<=8,d.id+'/'+node+': delay');
   assert(n.branches.length>=1&&Object.keys(n.branches.at(-1).when).length===0,d.id+'/'+node+': default branch');
   for(const b of n.branches){
    const id=d.id+'/'+node+'/'+b.key;assert(!keys.has(id),id);keys.add(id);count++;
    conditions(b.when,id);text(b.text,id,b.status==='lover'?85:65);assert(!texts.has(b.text),id+': repeated text');texts.add(b.text);text(b.label,id);effects(b.effects,id);
    assert(b.next===null||d.nodes[b.next],id+': next');if(b.status)assert(states.includes(b.status),id+': status');
    if(b.status==='lover')assert(d.romance&&b.when.freePartner&&b.when.minAge>=(node.startsWith('young:')&&d.young?16:20)&&b.when.minVisits>=4&&b.when.minYears>=6&&b.when.minTrust>=4,id+': romance conditions');
    if(b.trust!==undefined)assert(Number.isInteger(b.trust)&&Math.abs(b.trust)<=5,id+': trust');
    if(b.wear!==undefined)assert(Number.isFinite(b.wear),id+': wear');
    if(b.xp!==undefined)assert(Number.isInteger(b.xp)&&b.xp>=0,id+': xp');
    if(b.injury!==undefined)assert.equal(typeof b.injury,'boolean',id+': injury');
    for(const key of ['set','clear'])for(const f of b[key]||[]){text(f,id);if(key==='set')flags.add(f);}
    for(const f of [...b.when.relationFlags||[],...b.when.missingRelationFlags||[]])needed.add(f);
   }
  }
  assert(count>=16,d.id+': branch count');for(const f of needed)assert(flags.has(f),d.id+': unproduced flag '+f);
  const visited=new Set(),stack=new Set();function visit(key){if(key===null)return;assert(!stack.has(key),d.id+': cyclic graph');if(visited.has(key))return;stack.add(key);for(const b of d.nodes[key].branches)visit(b.next);stack.delete(key);visited.add(key);}visit(d.intro.next);if(d.romanceStart)visit(d.romanceStart);if(d.young)visit(d.young.start);
  assert.equal(visited.size,Object.keys(d.nodes).length,d.id+': unreachable nodes');
  function shortest(key){return key===null?0:1+Math.min(...d.nodes[key].branches.map(b=>shortest(b.next)));}
  if(!['alice','aya','eirin','keine','kosuzu','mokou','nitori','yuuka'].includes(d.id)){assert(shortest(d.intro.next)>=5,d.id+': short relationship');assert(Object.values(d.nodes).some(n=>n.branches.some(b=>b.next!==null&&b.status)),d.id+': missing intermediate relationship state');}
  assert(d.echoes.length>=4,d.id+': echoes');const echoes=new Set();for(const e of d.echoes){assert(!echoes.has(e.key),d.id+': duplicate echo');echoes.add(e.key);assert(e.states.length&&e.states.every(x=>states.includes(x)),d.id+': echo states');if(e.interval!==undefined)assert(Number.isInteger(e.interval)&&e.interval>=2&&e.interval<=6,d.id+': echo interval');text(e.text,d.id,85);effects(e.effects,d.id);if(e.when)conditions(e.when,d.id);}
  assert(d.farewell&&typeof d.farewell==='object',d.id+': farewell');for(const [status,value]of Object.entries(d.farewell)){assert(states.includes(status),d.id+': farewell status');text(value,d.id+' farewell');}
  function endings(key,status){for(const b of d.nodes[key].branches){const nextStatus=b.status||status;if(b.next===null){if(nextStatus!=='acquaintance')assert(d.farewell[nextStatus],d.id+': missing farewell '+nextStatus);}else endings(b.next,nextStatus);}}endings(d.intro.next,'acquaintance');if(d.romanceStart){assert(shortest(d.romanceStart)>=5,d.id+': romantic development too short');endings(d.romanceStart,'acquaintance');}
  coverage.push({id:d.id,name:characters.find(c=>c.id===d.id).name,title:d.title,romanceTitle:d.romanceTitle,contact:d.contact,nodes:visited.size,branches:count,echoes:d.echoes.length,middleStates:[...new Set(Object.values(d.nodes).flatMap(n=>n.branches.filter(b=>b.next!==null&&b.status).map(b=>b.status)))],states:[...new Set(Object.values(d.nodes).flatMap(n=>n.branches.map(b=>b.status).filter(Boolean)))],romance:d.romance,circle:d.circle,shortest:shortest(d.intro.next),source:d.source});
 }
 await writeFile(new URL('dist/relationship-data.js',root),'// Generated from data/relationships/*.json by npm run build.\nglobalThis.TouhouRelationshipData = '+JSON.stringify(routes)+';\n');
 await writeFile(new URL('reports/relationship-coverage.json',root),JSON.stringify({routes:routes.length,coverage,remaining:characters.filter(c=>!ids.has(c.id)).map(c=>({id:c.id,name:c.name}))},null,2)+'\n');
 return coverage;
}
