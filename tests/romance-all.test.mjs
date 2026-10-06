import {writeTestReport} from './helpers/report-output.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const name of ['config','talents','content-data','relationship-data','events','health','opportunities','encounters','spiritual','afterlife','careers','contacts','memoir','relationships','talent-stories','partner-learning','companionship','guidance','akyuu','long-years-data','long-years','engine','dev'])await import('../dist/'+name+'.js');
const E=TouhouEngine,R=TouhouRelationships,D=TouhouDev,C=TouhouContacts,routes=TouhouRelationshipData;
const scope=JSON.parse(readFileSync(new URL('../docs/romance-scope-v8.json',import.meta.url)));
const report={method:'All romantic graphs use actual introduction, ordered branch selection, developer queue and engine event application. Fixture age, attributes, experience and profession are controlled; relationship flags/trust/visits are earned by authored events. This is forced rare-route coverage, not a natural-frequency claim.',routes:[]};
const fixtures=new Map();
function at(s,age){s.age=s.turn=s.bodyAge=age;s.phase=2;}
function fire(s,id){assert(D.inspect(s,id).ready,id+': '+D.inspect(s,id).reasons.join('/'));D.queue(s,id);E.step(s,()=>.99);return s.log.at(-1);}
function prepare(route){
 const talents=route.id==='yuuka'?['herbal','promise','careful']:route.entry.talentsAny?['stargaze','promise','careful']:['reader','promise','careful'];
 const s=E.createLife({seed:818,character:null,stats:{health:6,insight:6,bond:6,fortune:2},talents,goal:'romance',romanceWish:route.id});
 at(s,Math.max(20,route.entry.minAge));s.stats={health:12,insight:12,bond:12,fortune:12};s.xp=12;
 for(const [k,v]of Object.entries(route.entry.max||{}))s.stats[k]=v;
 s.career=route.entry.careers?.[0]||'scholar';s.habitat=route.entry.habitats?.[0]||'village';D.enable(s,true);
 const view=R.romanceView(route),domain=view.contact.domain;
 if(!C.canMeet(s,view))fire(s,'contact:'+domain);
 if(route.romanceGate.transition)fire(s,'contact-person:'+route.id);
 assert(C.gateReady(s,route),'actual domain and personal introduction precede romance');
 assert(R.matches(s,null,route.entry));fire(s,'relation:'+route.id+':intro');
 assert.equal(s.relations[route.id].next,route.romanceStart||route.intro.next);
 assert.equal(s.relations[route.id].medium,C.mode(view));
 if(route.romanceContact)assert.equal(s.log.at(-1).premise,route.romanceContact.premise);
 return s;
}
function values(s,node){
 const axes={};for(const b of node.branches)for(const bound of ['min','max'])for(const [key,n]of Object.entries(b.when[bound]||{})){axes[key]??=new Set([s.stats[key]]);for(const v of [n-1,n,n+1])if(v>=(key==='health'?1:0)&&v<=30)axes[key].add(v);}
 let list=[{...s.stats}];for(const [key,set]of Object.entries(axes))list=list.flatMap(o=>[...set].map(v=>({...o,[key]:v})));return list;
}
function walk(route){
 const queue=[prepare(route)],seen=new Set(),branches=new Set(),lovers=[];
 for(let q=0;q<queue.length;q++){
  const current=queue[q],r=current.relations[route.id];
  const sig=JSON.stringify([r.next,r.status,r.trust,r.flags.slice().sort(),r.visits,current.age]);if(seen.has(sig))continue;seen.add(sig);
  const node=route.nodes[r.next],picked=new Set();
  for(const stats of values(current,node)){
   const s=structuredClone(current);s.stats=stats;at(s,s.age+node.delay);
   // Component boundary: complete the scheduler's bounded preparation first,
   // using the same factories and effects; then inspect the authored branch.
   for(let n=0;C.waitingPractice(s,route);n++){
    assert(n<8,'bounded node preparation');const p=C.practiceEvent(s,route);
    p.apply(s);E.record(s,p.id,p.text,p.effects);s.history.push(p.id);s.seen[p.id]=1;at(s,s.age+1);
   }
   const event=R.select(s,()=>0);assert(event,event?.id);assert(event.id.startsWith('relation:'+route.id+':'));
   if(picked.has(event.id))continue;picked.add(event.id);branches.add(event.id);
   const before=s.partnerId;fire(s,event.id);const after=s.relations[route.id];
   assert.equal(after.visits,after.history.length);
   if(after.status==='lover'){
    assert.equal(s.partnerId,route.id);assert(E.goalStatus(s).achieved);
    if(before===null)assert.equal(s.log.at(-1).relationshipMoment.kind,'courtship');
   }
   if(after.next!==null)queue.push(s);else if(after.status==='lover')lovers.push(s);else if(after.romancePath&&after.status==='friend'){R.finish(s,'age');assert.equal(after.summary,after.history.at(-1).text,'friend ending must preserve the actual outcome');}
  }
 }
 assert(lovers.length,route.id+' must reach lover through actual first-match events: '+[...branches].join(', '));
 const echoes=route.echoes.filter(e=>e.romanceEcho),echoWitness=[];
 for(const echo of echoes){
  const base=lovers.find(s=>!echo.when||R.matches(s,s.relations[route.id],echo.when));assert(base,route.id+'/'+echo.key+' needs a reachable prior history');
  const s=structuredClone(base),r=s.relations[route.id];at(s,R.echoDueAt(s,route,echo));
  fire(s,'relation:'+route.id+':echo:'+echo.key);assert.equal(r.echoes[echo.key],1);
  for(const mutate of [s=>s.partnerId=null,s=>s.relations[route.id].status='friend',s=>s.people[route.id].alive=false,s=>s.afterlife={kind:'ghost'},s=>s.dormant={wakeAt:100}]){const bad=structuredClone(base);at(bad,bad.age+8);mutate(bad);assert(!D.inspect(bad,'relation:'+route.id+':echo:'+echo.key).ready,route.id+' intimacy state');}
  echoWitness.push({key:echo.key,text:echo.text,age:s.age});
 }
 const s=lovers[0];R.finish(s,'age');assert.equal(s.relations[route.id].summary,route.marriage?route.marriage.surviving:route.farewell.lover);
 const nodes=new Set([...branches].map(id=>id.slice(('relation:'+route.id+':').length).split(':').slice(0,-1).join(':')));
 report.routes.push({id:route.id,name:s.people[route.id].name,romancePath:!!route.romanceStart,selectedBranches:branches.size,nodesReached:nodes.size,firstLove:s.log.find(e=>e.relationshipMoment?.kind==='courtship').age,contact:s.relations[route.id].scene,events:s.log.filter(e=>e.id.startsWith('relation:')),echoes:echoWitness,ending:s.relations[route.id].summary});
 fixtures.set(route.id,lovers[0]);
}

function loverFixture(id){
 if(!fixtures.has(id)){
  const route=routes.find(r=>r.id===id);assert(route?.romance,id+' declared romance fixture');
  walk(route);
 }
 return fixtures.get(id);
}

test('every declared romantic person earns love, a personal ending and all authored intimate echoes',()=>{
 for(const route of routes.filter(r=>r.romance))loverFixture(route.id);
 assert.deepEqual(routes.filter(r=>r.romance).map(r=>r.id).sort(),scope.plannedRomanceIds.slice().sort());
 assert.equal(report.routes.length,scope.counts.plannedRomance);
 writeTestReport('romance-forced-v11.json',JSON.stringify(report,null,2)+'\n');
});

test('occupied, dead, nonphysical and named identities cannot start or sustain a second romance',()=>{
 for(const route of routes.filter(r=>r.romance)){
  const s=prepare(route),r=s.relations[route.id];at(s,s.age+8);
  // Occupancy is the controlled guard here; do not pretend that unplayed local scenes occurred.
  E.meet(s,'local:spouse',()=>.5);R.bindPartner(s,'local:spouse');s.courtshipAt=s.age;
  assert(!R.canLove(s,route,r));
  if(route.romanceStart){const event=R.select(s,()=>0);assert(event.id.endsWith(':interrupted'));event.apply(s);assert.equal(r.status,'friend');assert.equal(r.next,null);assert.equal(s.partnerId,'local:spouse');assert.equal(R.romanceClosure(s,route.id).kind,'closed');}
  for(const mutate of [s=>s.afterlife={kind:'ghost'},s=>s.dormant={wakeAt:200},s=>s.character=TouhouContent.find(c=>c.id===route.id)]){
   const invalid=prepare(route);at(invalid,invalid.age+8);mutate(invalid);assert.equal(R.select(invalid,()=>0),null);assert(!R.canLove(invalid,route,invalid.relations[route.id]));
  }
 }
 for(const entry of scope.entries.filter(e=>!e.includeRomance))assert.equal(routes.find(r=>r.id===entry.id).romance,false,entry.id);
});

test('all approved lovers have two distinct premarital dates without changing the marriage clock',()=>{
 const coverage=[];
 for(const route of routes.filter(r=>r.romance)){
  const s=structuredClone(loverFixture(route.id)),r=s.relations[route.id],prefix='relation:'+route.id+':courtship:';
  const instant=structuredClone(s);at(instant,r.loveAt);
  assert.equal(TouhouCompanionship.courtship(instant,E.record),null,'no date at the instant of confession');
  for(let index=0;index<2;index++){
   at(s,s.age+1);const before=structuredClone(s),due=R.marriageDueAt(s,r,index?'planning':'proposal');
   const e=TouhouCompanionship.courtship(s,E.record);assert(e,route.id+' date '+index);
   assert.equal(e.id,prefix+route.marriage.courtship[index].key);assert.equal(e.text,route.marriage.courtship[index].text);assert.deepEqual(e.effects,{});assert(!e.relationshipMoment);
   assert.deepEqual({...s,log:[]},{...before,log:[]},'date changes only visible chronicle');
   assert.equal(R.marriageDueAt(s,r,index?'planning':'proposal'),due);
   assert.equal(TouhouCompanionship.courtship(s,E.record),null,'one date per year');
   const stage=index?'planning':'proposal';at(s,Math.max(s.age,R.marriageDueAt(s,r,stage)));fire(s,'relation:'+route.id+':marriage:'+stage);
  }
  at(s,Math.max(s.age+1,R.marriageDueAt(s,r,'wedding')));fire(s,'relation:'+route.id+':marriage:wedding');
  assert.equal(TouhouCompanionship.courtship(s,E.record),null,'courtship stops at wedding');
  coverage.push({id:route.id,dates:s.log.filter(e=>e.id.startsWith(prefix)).map(e=>({id:e.id,age:e.age,text:e.text})),marriedAt:r.marriage.marriedAt});
  for(const mutate of [x=>x.people[route.id].alive=false,x=>x.people[route.id].leaveAt=x.age,x=>x.partnerId=null,x=>x.afterlife={kind:'ghost'},x=>x.dormant={wakeAt:200},x=>x.injured=true,x=>x.pendingCause='accident',x=>x.body='beast']){
   const invalid=structuredClone(loverFixture(route.id));at(invalid,invalid.age+1);mutate(invalid);assert.equal(TouhouCompanionship.courtship(invalid,E.record),null,route.id+' invalid date');
  }
 }
 writeTestReport('courtship-forced-v11.json',JSON.stringify({method:'All lovers earned through their real ordered branches. Two annual dates interleave with actual proposal/planning/wedding; exact state comparison proves zero clock, relationship, RNG, attribute, or prerequisite changes beyond the log.',coverage},null,2)+'\n');
});

test('goals have concrete success and failure, and wishing changes only encounter weights',()=>{
 const s=E.createLife({seed:17,stats:{health:5,insight:5,bond:5,fortune:5},character:null,goal:'longlife'});
 assert.equal(E.goalStatus(s).status,'进行中');s.age=80;assert(E.goalStatus(s).achieved);s.age=79;s.ended=true;assert.equal(E.goalStatus(s).status,'未达成');
 assert.throws(()=>E.createLife({seed:1,stats:s.allocated,goal:'unknown'}));assert.throws(()=>E.createLife({seed:1,stats:s.allocated,goal:'romance',romanceWish:'renko'}));
 for(const route of routes.filter(r=>r.romance)){
  const base=E.createLife({seed:73,stats:s.allocated,goal:'romance'}),wished=E.createLife({seed:73,stats:s.allocated,goal:'romance',romanceWish:route.id});
  assert.equal(base.character?.id,wished.character?.id);assert.deepEqual(base.stats,wished.stats);assert.equal(base.horizon,wished.horizon);
  assert.equal(R.introWeight(wished,route)/R.introWeight(base,route),TouhouLifeConfig.romanceWishWeight);
 }
});

test('all approved lovers can discuss, prepare and marry, then sustain six personal married scenes',()=>{
 const coverage=[];
 for(const route of routes.filter(r=>r.romance)){
  const s=structuredClone(loverFixture(route.id)),r=s.relations[route.id];
  for(const stage of ['proposal','planning','wedding']){
   const id='relation:'+route.id+':marriage:'+stage,due=R.marriageDueAt(s,r,stage);
   at(s,due-1);assert(!D.inspect(s,id).ready,route.id+' marriage must wait');
   at(s,due);fire(s,id);assert.equal(s.married,stage==='wedding');
  }
  assert.equal(R.partner(s).status,'已婚');assert.equal(r.marriage.stage,3);
  assert.equal(s.log.at(-1).relationshipMoment.kind,'marriage');
  const dailyEvidence=[];for(const daily of route.marriage.daily){const day=structuredClone(s),dr=day.relations[route.id];at(day,Math.max(dr.lastAt+2,R.dailyDueAt(day,dr,daily)));const entry=fire(day,'relation:'+route.id+':marriage:daily:'+daily.key);assert.equal(dr.marriage.daily[daily.key],1);assert(!D.inspect(day,'relation:'+route.id+':marriage:daily:'+daily.key).ready);dailyEvidence.push({id:entry.id,age:entry.age,text:entry.text});}
  assert(!D.inspect(s,'relation:'+route.id+':marriage:wedding').ready);
  const id='relation:'+route.id+':marriage:daily:'+route.marriage.daily[0].key;
  for(const mutate of [s=>s.partnerId=null,s=>s.people[route.id].alive=false,s=>s.afterlife={kind:'ghost'},s=>s.dormant={wakeAt:200},s=>s.body='beast']){const bad=structuredClone(s);at(bad,bad.age+10);mutate(bad);assert(!D.inspect(bad,id).ready);}
  assert.equal(R.departure(s,'age'),route.marriage.surviving);assert.equal(R.departure(s,'chapter'),null);
  assert.equal(R.farewellText(s,route.id),route.marriage.bereaved);
  R.finish(s,'chapter');assert(r.summary.includes(route.marriage.farewell));
  R.finish(s,'age');assert.equal(r.summary,route.marriage.surviving);
  const memories=TouhouMemoir.compose(s);assert(memories.facts.some(f=>f.kind==='relationship'&&f.text.includes('结为夫妻')));
  coverage.push({id:route.id,marriedAt:r.marriage.marriedAt,events:s.log.filter(e=>e.id.startsWith('relation:'+route.id+':marriage:')).map(e=>({id:e.id,age:e.age,text:e.text})),dailyAlternatives:dailyEvidence,surviving:r.summary,bereaved:R.farewellText(s,route.id)});
 }
 assert.equal(coverage.length,scope.counts.plannedRomance);
 writeTestReport('marriage-forced-v11.json',JSON.stringify({method:'All relationship prerequisites earned through real branches; clock and allocation controlled for rare-route coverage. All three stages use developer queue and engine effects; each daily alternative is exercised from the earned wedding state, respecting finite partner lifespans.',coverage},null,2)+'\n');
});

test('old love survives newcomers, reaches marriage, and repeats affection beyond the old two-use limit',()=>{
 const s=structuredClone(loverFixture('byakuren')),r=s.relations.byakuren;
 E.transform(s,'youkai',{eventId:'test:long-life'});
 for(const id of ['cirno','mamizou']){
  const route=routes.find(r=>r.id===id);if(!C.canMeet(s,route))fire(s,'contact:'+route.contact.domain);
  at(s,Math.max(s.age,R.introductionDueAt(s)));fire(s,'relation:'+id+':intro');assert(!s.relations[id].romancePath);
 }
 const start=s.log.length;s.dev.enabled=false;
 for(let n=0;n<95&&!s.ended;n++)E.step(s,()=>.999);
 assert.equal(s.partnerId,'byakuren');assert(s.married);assert.equal(r.marriage.stage,3);
 assert(s.relations.cirno.visits>4);assert(s.relations.mamizou.visits>4);
 const continued=s.log.slice(start).filter(e=>e.relationship?.id==='byakuren');
 assert(continued.some(e=>e.id.includes(':marriage:wedding')));
 assert(continued.some(e=>e.id.includes(':marriage:daily:')));
 assert(Object.values(r.echoes).some(n=>n>2),'affection must not permanently exhaust');
 assert.equal(Object.values(s.relations).filter(r=>r.status==='lover').length,1);
 assert(!s.log.some(e=>e.relationshipMoment?.impact.includes('其他恋爱')));
 writeTestReport('parallel-marriage-v11.json',JSON.stringify({method:'Reached Byakuren lover via authored graph, controlled transformation and two ordinary introductions; subsequent years use engine scheduling with fixed RNG .999 to exercise bounded waiting.',events:s.log.slice(start).map(e=>({id:e.id,age:e.age,text:e.text})),relations:R.describe(s)},null,2)+'\n');
});

test('all approved partners have distinct active and settled scenes, an evidence-checked circle and a personal memory',()=>{
 const evidence=[];
 for(const route of routes.filter(r=>r.romance)){
  const s=structuredClone(loverFixture(route.id)),r=s.relations[route.id],p=s.people[route.id];
  const early=structuredClone(s);early.age=r.loveAt;early.bodyAge=25;early.life='long';early.species='youkai';early.people[r.id].leaveAt=Infinity;early.people[r.id].ageless=true;
  if(r.id==='akyuu')early.people.akyuu.ageAtMeet=18-(early.age-early.people.akyuu.metAt);
  const late=structuredClone(early);late.age+=31;
  for(const item of [...route.echoes.filter(e=>e.romanceEcho),...route.marriage.daily]){
   assert.notEqual(item.text,item.settledText);assert.equal(TouhouCompanionship.text(early,early.relations[r.id],item),item.text);assert.equal(TouhouCompanionship.text(late,late.relations[r.id],item),item.settledText);
  }
  assert.equal(route.circle.id,route.id);const checked=[];
  for(const visit of route.circle.visits){
   for(const domain of Object.keys(C.domains))s.flags.add('contact:'+domain);
   const dead=structuredClone(s);E.meet(dead,visit.person,()=>.5);dead.people[visit.person].alive=false;
   assert.equal(TouhouCompanionship.eligibleVisit(dead,r,visit),r.medium==='dream'||!!visit.memoryOnly);
   const live=structuredClone(s),lr=live.relations[route.id],target=routes.find(x=>x.id===visit.person);
   at(live,Math.max(live.age,lr.loveAt+6,lr.lastAt+3,R.introductionDueAt(live)));
   if(lr.medium!=='dream'&&!visit.memoryOnly){
    live.career=target.entry.careers?.[0]||live.career;live.habitat=target.entry.habitats?.[0]||live.habitat;
    if(target.entry.species)live.species=target.entry.species[0];
    for(const [k,n]of Object.entries(target.entry.min||{}))live.stats[k]=Math.max(live.stats[k],n);
    for(const [k,n]of Object.entries(target.entry.max||{}))live.stats[k]=Math.min(live.stats[k],n);
   }
   const scheduled=TouhouCompanionship.candidate(live);assert(scheduled&&scheduled.due<=live.age,route.id+' circle must be reachable');
   const event=scheduled.get();for(const id of event.with||[])E.meet(live,id,()=>.5);event.apply(live);
   assert.equal(live.firstPartnerId,route.id);assert.equal(lr.circleKey,visit.key);
   if(event.with)assert.equal(live.relations[visit.person].romancePath,false);
   checked.push({person:visit.person,memoryOnly:!!visit.memoryOnly,source:visit.source,event:event.id,age:live.age});
  }
  at(s,s.age+1);p.alive=false;R.upkeep(s);assert(!R.freePartner(s));assert.equal(s.firstPartnerId,route.id);
  at(s,s.age+3);const memory=TouhouCompanionship.candidate(s);assert(memory);const e=memory.get();assert.equal(e.id,'remembrance:'+route.id);assert.equal(e.text,route.marriage.memory);e.apply(s);assert.equal(TouhouCompanionship.candidate(s),null);assert.equal(p.alive,false);
  assert(!E.eligible(s,TouhouEvents.events.find(e=>e.id==='common:courtship')));
  evidence.push({id:route.id,variants:route.echoes.filter(e=>e.romanceEcho).length+6,circle:checked,memory:e.text});
 }
 writeTestReport('companionship-forced-v11.json',JSON.stringify({coverage:evidence},null,2)+'\n');
 const texts=routes.filter(r=>r.romance).flatMap(r=>[
  ...Object.values(r.nodes).flatMap(n=>n.branches.filter(b=>b.status==='lover').map(b=>b.text)),
  ...r.echoes.filter(e=>e.romanceEcho).flatMap(e=>[e.text,e.settledText]),
  ...r.marriage.courtship.map(d=>d.text),...r.marriage.daily.flatMap(d=>[d.text,d.settledText]),r.marriage.memory,...r.circle.visits.flatMap(v=>[v.text,...v.scenes.map(d=>d.text)])
 ]);
 assert.equal(texts.length,4286); // Four independently written youth confessions extend the existing approved pool.
 assert.equal(new Set(texts).size,texts.length,'cross-group authored text must be distinct');
 writeTestReport('content-text-v11.json',JSON.stringify({totalAuthoredTexts:texts.length,distinctTexts:new Set(texts).size,duplicates:0,minimumCharacters:Math.min(...texts.map(t=>t.length)),maximumCharacters:Math.max(...texts.map(t=>t.length))},null,2)+'\n');
});

test('a partner introduces a real acquaintance once, while old-dream guests stay in their own continuity',()=>{
 for(const id of ['reimu','satori','mima']){
  const s=structuredClone(loverFixture(id)),r=s.relations[id],route=routes.find(x=>x.id===id);
  at(s,s.age+12);for(const domain of Object.keys(C.domains))s.flags.add('contact:'+domain);
  const candidate=TouhouCompanionship.candidate(s);assert(candidate,id+' circle');assert(candidate.due<=s.age);
  const e=candidate.get(),visit=route.circle.visits.find(v=>e.text===v.text);assert(visit);
  const count=Object.keys(s.relations).length,history=r.history.length;
  for(const person of e.with||[])E.meet(s,person,()=>.5);e.apply(s);E.record(s,e.id,e.text,e.effects);
  assert.equal(r.history.length,history+1);assert.equal(s.partnerId,id);assert.equal(s.firstPartnerId,id);
  if(r.medium==='dream'||visit.memoryOnly){assert(!s.people[visit.person]);assert.equal(Object.keys(s.relations).length,count);}
  else{
   assert.equal(e.id,'relation:'+visit.person+':intro');assert.equal(s.relations[visit.person].romancePath,false);assert.equal(s.relations[visit.person].history[0].text,e.text);assert.equal(Object.keys(s.relations).length,count+1);
   assert.equal(R.introductionDueAt(s),s.age+TouhouLifeConfig.introductionGap);
  }
  const later=TouhouCompanionship.candidate(s);assert(!later||later.due>=s.age+12);
 }
});

test('all supported circles have four reachable ordered scenes, with no repeated introduction or body',()=>{
 const coverage=[];
 for(const route of routes.filter(r=>r.romance&&r.circle.visits.length)){
  const s=structuredClone(loverFixture(route.id)),r=s.relations[route.id],visit=route.circle.visits[0],target=routes.find(x=>x.id===visit.person);
  for(const domain of Object.keys(C.domains))s.flags.add('contact:'+domain);
  if(r.medium!=='dream'&&!visit.memoryOnly){
   s.career=target.entry.careers?.[0]||s.career;s.habitat=target.entry.habitats?.[0]||s.habitat;if(target.entry.species)s.species=target.entry.species[0];
   for(const[k,n]of Object.entries(target.entry.min||{}))s.stats[k]=Math.max(s.stats[k],n);
   for(const[k,n]of Object.entries(target.entry.max||{}))s.stats[k]=Math.min(s.stats[k],n);
  }
  // Long observation fixtures isolate all authored scenes; natural mortal departures are checked separately.
  s.people[r.id].leaveAt=Infinity;
  const events=[];
  for(let index=0;index<4;index++){
   at(s,index? r.circleAt+12:Math.max(s.age+6,R.introductionDueAt(s)));if(s.people[visit.person])s.people[visit.person].leaveAt=Infinity;
   const candidate=TouhouCompanionship.candidate(s);assert(candidate&&candidate.due<=s.age,route.id+' continuing circle '+index);
   const e=candidate.get();for(const id of e.with||[])E.meet(s,id,()=>.5);e.apply(s);E.record(s,e.id,e.text,e.effects);
   assert.equal(e.text,index?visit.scenes[index-1].text:visit.text);assert.equal(s.firstPartnerId,route.id);events.push({id:e.id,age:s.age,text:e.text});
  }
  assert.equal(new Set(events.map(e=>e.text)).size,4);assert(events.slice(1).every(e=>e.id.startsWith('circle:')));
  assert(!TouhouCompanionship.fresh(s,r,events.at(-1).text),'recent body remains on cooldown');
  coverage.push({id:route.id,person:visit.person,memoryOnly:!!visit.memoryOnly,events});
 }
 assert.equal(coverage.length,164);
 writeTestReport('circles-forced-v11.json',JSON.stringify({method:'Actual earned lover graphs, controlled long observation and legal contact prerequisites. Every initial and three continuing scenes executed in order, real visitor introduction occurs only once.',coverage},null,2)+'\n');
});

test('frequent Yatsuhashi dates cannot postpone Benben’s independent circle clock',()=>{
 const s=structuredClone(loverFixture('yatsuhashi')),r=s.relations.yatsuhashi;
 at(s,Math.max(s.age,r.loveAt+6,R.introductionDueAt(s)));r.lastAt=s.age;
 const c=TouhouCompanionship.candidate(s);assert(c&&c.due<=s.age);
 assert.equal(c.get().id,'relation:benben:intro');
 const event=c.get();for(const id of event.with)E.meet(s,id,()=>.5);event.apply(s);
 at(s,s.age+12);r.lastAt=s.age;
 const next=TouhouCompanionship.candidate(s);assert(next&&next.due===r.circleAt+12);
 assert(next.get().id.startsWith('circle:yatsuhashi:'));assert.notEqual(next.get().text,event.text);
});

test('marriage cadence follows actual longevity and keeps finite couples on a human calendar',()=>{
 const original=loverFixture('reimu'),route=routes.find(r=>r.id==='reimu');
 const human=structuredClone(original),hr=human.relations.reimu;assert.deepEqual(R.pace(human,hr),{courtship:1,ceremony:1,daily:3,echo:6});
 const schedules={hermit:[4,2,4],youkai:[6,3,5],vampire:[8,3,5]};
 for(const [kind,expected]of Object.entries(schedules)){
  const s=structuredClone(original),r=s.relations.reimu;E.transform(s,kind,{eventId:'test:cadence'});
  assert.equal(R.pace(s,r).courtship,1,'human Reimu retains finite-life cadence');
  s.people.reimu.life='long';s.people.reimu.ageless=true;s.people.reimu.leaveAt=Infinity;
  const p=R.pace(s,r);assert.deepEqual([p.courtship,p.ceremony,p.daily],expected);
  assert.equal(R.marriageDueAt(s,r,'proposal'),r.loveAt+expected[0]);
  for(const stage of ['proposal','planning','wedding']){at(s,R.marriageDueAt(s,r,stage));fire(s,'relation:reimu:marriage:'+stage);}
  assert(s.married&&r.marriage.marriedAt<r.loveAt+25,'long-lived wedding stays reachable');
 }
 const mage=structuredClone(original),mr=mage.relations.reimu;E.transform(mage,'magician',{eventId:'test:cadence'});
 mage.people.reimu.life='long';mage.people.reimu.ageless=true;mage.people.reimu.leaveAt=Infinity;
 assert.equal(R.pace(mage,mr).courtship,1,'fasting alone does not stop aging');
 mage.magic.ageless=true;assert.equal(R.pace(mage,mr).courtship,5);
 const birthday=structuredClone(original),br=birthday.relations.reimu;at(birthday,br.loveAt+1);
 assert(TouhouCompanionship.courtship(birthday,E.record));at(birthday,birthday.age+1);
 assert.equal(TouhouCompanionship.courtship(birthday,E.record),null,'second date waits until an actual proposal');
 assert(route.marriage.courtship.length===2);
});

test('all authored personal guidance earns its actual finite result and a single followup',()=>{
 const guides=routes.filter(r=>r.guidance),coverage=[];assert.equal(guides.length,41);
 // Reuse genuinely earned lovers. Only clock, health/attributes and partner observation
 // horizon are controlled; stages and paid work run through the engine's event pipeline.
 function apply(s,event){
  assert(E.eligible(s,event),event.id);const consume=D.consume;
  D.consume=state=>{state.dev.pending=null;return event;};s.dev.pending=event.id;
  try{E.step(s,()=>.5);}finally{D.consume=consume;}
  assert(s.log.some(e=>e.id===event.id));assert(!s.ended,event.id);
 }
 for(const route of guides){
  const s=structuredClone(loverFixture(route.id)),r=s.relations[route.id],g=route.guidance;
  s.stats={health:20,insight:20,bond:20,fortune:20};s.xp=30;s.people[route.id].leaveAt=Infinity;
  TouhouCareers.init(s);const origin=s.log[0].text,evidence=[];
  for(const [index,step]of g.stages.entries()){
   const required=step.when.work||0;
   if(required){
    assert(r.guidance);
    const blocked=structuredClone(s);blocked.history=blocked.history.filter(id=>!/^career:[^:]+:work-/.test(id));
    assert.equal(TouhouGuidance.candidate(blocked),null,'authored work cannot be replaced by awarded practice');
    for(let n=0;TouhouGuidance.workCount(s,r.guidance.workCareer)-r.guidance.workAt<required&&n<16;n++){
     at(s,s.age+1);let draws=0;const work=TouhouCareers.select(s,()=>++draws===1?0:.99);assert(work,route.id+' actual work');apply(s,work);
    }
    assert(TouhouGuidance.workCount(s,r.guidance.workCareer)-r.guidance.workAt>=required);
   }
   const c=TouhouGuidance.candidate(s);assert(c,route.id+'/'+step.key+' reachable');at(s,Math.max(s.age,c.due));const event=c.get();
   assert.equal(event.id,'guidance:'+route.id+':'+step.key);
   for(const mutate of [x=>x.partnerId=null,x=>x.people[route.id].alive=false,x=>x.body='spirit',x=>x.injured=true,x=>x.opportunity={kind:'hermit'},x=>x.afterlife={kind:'ghost'}]){
    const invalid=structuredClone(s);mutate(invalid);assert(!E.eligible(invalid,event),route.id+' cached guidance guard');
   }
   const before={vitality:s.vitality,horizon:s.horizon,practice:s.careerDevelopment.practice,projects:s.careerDevelopment.projects};
   apply(s,event);assert.equal(r.guidance.stage,index+1);assert.equal(s.firstPartnerId,route.id);assert.equal(s.log[0].text,origin);
   if(index<g.stages.length-1)assert.equal(r.guidance.result,undefined);
   else{
    assert.equal(r.guidance.result.eventId,event.id);assert.equal(r.guidance.result.kind,g.grant.kind);
    if(g.grant.kind==='longevity'){assert.equal(s.vitality,before.vitality+g.grant.vitality);assert.equal(s.horizon,before.horizon+g.grant.years);assert.equal(s.species,'human');assert.equal(r.guidance.result.ageless,false);}
    if(g.grant.kind==='training'){assert.equal(s.careerDevelopment.practice,before.practice+g.grant.practice);assert.equal(s.careerDevelopment.projects,before.projects);}
    if(g.grant.kind==='transformation'){assert.equal(s.species,'magician');assert(!s.magic.ageless);assert.equal(s.transformation.eventId,event.id);assert(TouhouGuidance.workCount(s,'magic')-r.guidance.workAt>=2);}
    if(g.grant.kind==='protection')assert.equal(r.guidance.protection.usedAt,null);
   }
   evidence.push({id:event.id,age:s.age,career:s.career,species:s.species,text:step.text});
  }
  const vitality=s.vitality,horizon=s.horizon,follow=TouhouGuidance.candidate(s);at(s,follow.due);apply(s,follow.get());
  assert.equal(s.vitality,vitality);assert.equal(s.horizon,horizon);assert.equal(TouhouGuidance.candidate(s),null);
  const memory=TouhouMemoir.compose(s).facts.find(f=>f.kind==='guidance');assert(memory);assert.equal(memory.evidence[0],r.guidance.result.eventId);
  if(g.grant.kind==='protection'){
   const guard=g.grant,bad=structuredClone(s);bad.people[route.id].alive=false;bad.partnerId=null;
   assert.equal(TouhouGuidance.protect(bad,guard.cause,E.record),guard.selfMade,'only self-made preparations survive the giver');
   assert(!TouhouGuidance.protect(s,'age',E.record));
   if(guard.cause==='pursuit'){E.transform(s,'hermit',{eventId:'test:prepared-hermit'});s.hermit.raids.push({result:'lost'});}
   if(guard.cause==='pursuit')apply(s,{id:'test:pursuit-hit',text:'追索造成重伤。',effects:{health:-30},weight:1,apply:x=>{x.pendingCause='pursuit';}});
   else{s.stats.health=0;s.dev.enabled=false;E.step(s,()=>.99);}
   assert(!s.ended,route.id+' prepared protection: '+s.deathCause);assert.equal(r.guidance.protection.usedAt,s.age);assert(s.log.some(e=>e.id==='guidance:'+route.id+':protection-used'));
   assert(!TouhouGuidance.protect(s,guard.cause,E.record));
  }
  coverage.push({id:route.id,name:s.people[route.id].name,stages:evidence,result:r.guidance.result,followup:r.guidance.history.at(-1),protection:r.guidance.protection||null});
 }
 writeTestReport('guidance-forced-v11.json',JSON.stringify({method:'All 41 guides reuse actual earned love graphs; controlled clock, attributes and partner observation horizon isolate rare-route reachability. Real career events and guidance events traverse Engine.step using a test-only developer event hook. Final gifts, one-use protection, changed-state rejection and nonrenewing followups are asserted. This is not a population-frequency or natural-survival estimate.',coverage},null,2)+'\n');
});
