import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const modules=[...readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['app.js','music.js'].includes(n));
for(const name of modules)await import('../dist/'+name);
const E=TouhouEngine,A=TouhouAfterlife,R=TouhouRelationships;
const faith=TouhouDivineLives.contacts.characters,all=[...faith,TouhouMisfortuneContact];
function god(partnerId=null,seed=0){
 const s=E.createLife({character:null,stats:{health:5,insight:5,bond:5,fortune:5},seed});
 s.age=30;s.turn=30;s.phase=2;
 if(partnerId){
  E.meet(s,partnerId,()=>.5);R.begin(s,TouhouRelationshipData.find(r=>r.id===partnerId),true);
  Object.assign(s.relations[partnerId],{status:'lover',next:null,loveAt:30});R.bindPartner(s,partnerId);
  E.record(s,'relation:'+partnerId+':intro','生前曾经相识。');
  E.record(s,'relation:'+partnerId+':fixture-love','三十岁时彼此相许。',{}, {relationship:{id:partnerId,from:'friend',to:'lover'}});
 }
 s.age=s.turn=s.bodyAge=68;s.phase=3;s.stats={health:24,insight:24,bond:24,fortune:24};s.xp=30;
 s.development={kind:'kami',ready:true,faith:20,devotees:4};assert(A.beforeDeath(s,'age',()=>0,E.record));return s;
}
function apply(s,e){
 assert(e);assert(E.eligible(s,e));
 for(const id of e.with||[]){E.meet(s,id,()=>.5);s.people[id].close++;}
 e.apply?.(s);s.xp+=e.xp||0;
 E.record(s,e.id,typeof e.text==='function'?e.text(s):e.text,e.effects,{sharedWith:e.sharedWith,with:e.with});
 s.history.push(e.id);s.seen[e.id]=(s.seen[e.id]||0)+1;s.flags.add('event:'+e.id);
}
function focused(entry,kind,known=false){
 const s=god(kind==='partner'?entry.id:null,Math.max(0,faith.indexOf(entry))),d=s.afterlife.divinity;
 d.lastAt=Infinity;d.recovery={done:true};
 if(kind==='partner'){d.company.faith.done=d.company.misfortune.done=true;return s;}
 const group=entry.id==='hina'?'misfortune':'faith';d.company[group==='faith'?'misfortune':'faith'].done=true;
 if(known)E.meet(s,entry.id,()=>.5);
 s.age+=group==='faith'?4:8;
 const e=A.continuation(s);assert.equal(e.id,'development:kami-divine-company-'+entry.id+'-opening');assert.equal(e.text,entry.opening[known?'known':'new']);apply(s,e);
 return s;
}
function progress(s,entry,kind){return kind==='partner'?s.afterlife.divinity.partnerCompany:s.afterlife.divinity.company[entry.id==='hina'?'misfortune':'faith'];}

test('all five companies have reachable, finite peer and partner branches with real prior agreements',()=>{
 assert.deepEqual(faith.map(c=>c.id),['kanako','suwako','minoriko','shizuha']);assert.equal(TouhouMisfortuneContact.id,'hina');
 const report=[];
 for(const entry of all)for(const kind of ['peer','partner'])for(const high of [true,false]){
  const s=focused(entry,kind,!high),p=progress(s,entry,kind),before={faith:s.afterlife.faith,devotees:s.afterlife.devotees,merit:s.afterlife.divinity.merit,xp:s.xp,stats:{...s.stats}};
  if(!high){s.stats.insight=0;s.stats.bond=0;before.stats={...s.stats};}
  const events=[];
  for(const stage of entry[kind]){
   s.age=p.lastAt+stage.delay-.01;assert.equal(A.continuation(s),null,'cooldown '+entry.id+' '+stage.key);
   s.age=p.lastAt+stage.delay;const e=A.continuation(s);assert.equal(e.text,stage[high?'pass':'fail'].text);apply(s,e);
   events.push({id:e.id,age:s.age,text:e.text,passed:p.history.at(-1).passed});
  }
  assert.equal(p.next,4);assert(p.done);assert.equal(p.history.filter(h=>Number.isInteger(h.stage)).length,4);
  s.age+=20;assert.equal(A.continuation(s),null);assert.equal(s.afterlife.faith,before.faith);assert.equal(s.afterlife.devotees,before.devotees);assert.equal(s.afterlife.divinity.merit,before.merit);assert.equal(s.xp,before.xp);assert.deepEqual(s.stats,before.stats);
  if(kind==='peer'){assert.equal(s.partnerId,null);assert.equal(s.firstPartnerId,null);assert.equal(s.relations[entry.id],undefined);}
  else{const account=TouhouCompanionSummary.compose(s);assert.equal(account.years,38);assert(account.moments.some(e=>e.id.startsWith('development:kami-divine-shared-'+entry.id+'-')));}
  report.push({id:entry.id,kind,high,events,flags:p.flags});
 }
 const dir=new URL('../reports/v23/',import.meta.url);mkdirSync(dir,{recursive:true});writeFileSync(new URL('forced-company-branches.json',dir),JSON.stringify({method:'20 directed isolated chains; no natural seed search or population sampling.',results:report},null,2)+'\n');
});

test('faith visits and Hina use separate admissions, ledgers and local prerequisites',()=>{
 const s=god(),d=s.afterlife.divinity;d.lastAt=Infinity;d.recovery={done:true};s.age+=8;
 s.afterlife.faith=3;s.afterlife.devotees=0;
 const e=A.continuation(s);assert.equal(e.with[0],'hina');apply(s,e);assert.equal(d.company.faith.id,null);assert.equal(d.company.misfortune.id,'hina');
 s.age+=1;assert.equal(A.continuation(s),null,'shared company cooldown');
 s.afterlife.faith=0;assert.equal(A.continuation(s),null);assert.equal(A.ending(s),'forgotten');
 for(const entry of all)for(const kind of ['peer','partner']){
  const q=focused(entry,kind),p=progress(q,entry,kind);p.next=3;p.flags=[];q.age=p.lastAt+entry[kind][3].delay;
  const miss=A.continuation(q);assert.equal(miss.text,entry[kind][3].fail.text);apply(q,miss);assert(p.done);assert.equal(p.history.at(-1).passed,false);
 }
 const known=god();known.afterlife.divinity.lastAt=Infinity;known.afterlife.divinity.recovery={done:true};known.age+=4;E.meet(known,'minoriko',()=>.5);
 assert.equal(A.continuation(known).text,faith.find(c=>c.id==='minoriko').opening.known);
});

test('death, departure, breakup, dreams and confinement close existing visits without restoring anyone',()=>{
 const mutations=[
  s=>s.people.T.alive=false,s=>s.people.T.leaveAt=s.age,s=>s.people.T.afterlife=true,s=>s.people.T.dormant=true,
  s=>s.people.T.medium='dream',s=>s.relations.T={...(s.relations.T||{}),medium:'dream'},
  s=>s.relations.T={...(s.relations.T||{}),status:'estranged'}
 ];
 for(const entry of all)for(const kind of ['peer','partner'])for(const mutate of mutations){
  const s=focused(entry,kind),p=progress(s,entry,kind);
  if(kind==='partner'){s.age=p.lastAt+entry.partner[0].delay;apply(s,A.continuation(s));}
  // Aliases make the same boundary mutation apply to each named participant.
  s.people.T=s.people[entry.id];s.relations.T=s.relations[entry.id];mutate(s);if(s.relations.T)s.relations[entry.id]=s.relations.T;delete s.people.T;delete s.relations.T;
  s.age+=12;const e=A.continuation(s);assert(e.id.endsWith('-closed'));assert(!e.with&&!e.sharedWith);apply(s,e);assert(p.done&&p.closed);
  s.people[entry.id].alive=true;s.people[entry.id].leaveAt=Infinity;s.people[entry.id].medium='visit';s.people[entry.id].afterlife=false;s.people[entry.id].dormant=false;
  s.age+=30;assert.equal(A.continuation(s),null,'closed correspondence never reopens');
 }
 for(const entry of all){
  const s=focused(entry,'partner'),p=progress(s,entry,'partner');s.age=p.lastAt+entry.partner[0].delay;apply(s,A.continuation(s));
  const c=TouhouContent.find(c=>c.id===entry.id),old=c.confined;c.confined=true;
  try{s.age+=12;const e=A.continuation(s);assert(e.id.endsWith('-closed'));apply(s,e);assert(p.closed);}finally{if(old===undefined)delete c.confined;else c.confined=old;}
  const broken=focused(entry,'partner');broken.partnerId=null;broken.age+=10;assert.equal(A.continuation(broken),null);
  const departed=god();departed.afterlife.divinity.lastAt=Infinity;departed.afterlife.divinity.recovery={done:true};departed.age+=8;E.meet(departed,entry.id,()=>.5);departed.people[entry.id].alive=false;
  assert(!A.continuation(departed)?.with?.includes(entry.id));
 }
});

test('authored daily memories share partner eligibility and keep dream and confined channels separate',()=>{
 for(const entry of all){
  const s=god(entry.id);s.age+=9;const a=s.afterlife;
  for(let i=0;i<3;i++){s.turn++;a.lastMemoryAt=s.age-9;const e=A.select(s,()=>0);assert.equal(e.text,entry.memories[i]);apply(s,e);s.age+=9;}
  s.relations[entry.id].medium='dream';a.lastMemoryAt=s.age-9;const dream=A.select(s,()=>0);assert(dream.id.includes('-beloved-'));assert.match(dream.text,/梦/);assert(!entry.memories.includes(dream.text));assert(!A.continuation(s)?.sharedWith);
  s.relations[entry.id].medium='visit';const c=TouhouContent.find(c=>c.id===entry.id),old=c.confined;c.confined=true;
  try{a.lastMemoryAt=s.age-9;const distant=A.select(s,()=>0);assert.match(distant.text,/托人|捎来|转达/);assert(!entry.memories.includes(distant.text));assert(!A.continuation(s)?.sharedWith);}finally{if(old===undefined)delete c.confined;else c.confined=old;}
  s.partnerId=null;a.lastMemoryAt=s.age-9;assert(!A.select(s,()=>0).id.includes('-beloved-'));
 }
 const local=god();local.partnerId=local.firstPartnerId='local:spouse';local.married=true;local.people['local:spouse']={name:'村民伴侣',alive:true,leaveAt:200};local.age+=9;
 assert(A.select(local,()=>0).id.includes('-beloved-'));local.people['local:spouse'].alive=false;assert(!A.select(local,()=>0).id.includes('-beloved-'));
});

test('real engine steps complete the five authored partner routes and retain finite divine endings',()=>{
 const outcomes=[];
 for(const [index,entry]of all.entries()){
  const s=god(entry.id,index);while(!s.ended&&s.turn<350)E.step(s,()=>.12);
  assert(s.ended);assert.equal(s.log.filter(e=>e.id==='ending').length,1);assert(s.afterlife.divinity.partnerCompany.done,entry.id+' partner completion');
  assert.equal(s.afterlife.divinity.partnerCompany.history.filter(h=>Number.isInteger(h.stage)).length,4);
  const account=TouhouCompanionSummary.compose(s);assert.equal(account.years,38);
  assert(s.log.every(e=>!e.id.startsWith('relation:')||e.age<=68));
  const frozen=JSON.stringify(s);E.step(s,()=>0);assert.equal(JSON.stringify(s),frozen);
  outcomes.push({id:entry.id,seed:index,years:s.age-68,cause:s.deathCause,endingId:s.divineEndingId,partnerStages:s.afterlife.divinity.partnerCompany.history,faithPeer:s.afterlife.divinity.company.faith,misfortunePeer:s.afterlife.divinity.company.misfortune});
 }
 writeFileSync(new URL('../reports/v23/forced-company-lives.json',import.meta.url),JSON.stringify({method:'Five already-transformed high-condition lives, fixed RNG; not natural sampling.',outcomes},null,2)+'\n');
});
