import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const modules=[...readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['app.js','music.js'].includes(n));
for(const name of modules)await import('../dist/'+name);
const E=TouhouEngine,A=TouhouAfterlife,O=TouhouOpportunities,R=TouhouRelationships;
const base={health:5,insight:5,bond:5,fortune:5};
function adult(seed=0){
 const s=E.createLife({stats:base,character:null,seed});s.age=s.turn=s.bodyAge=68;s.phase=3;s.stats={health:24,insight:24,bond:24,fortune:24};s.xp=30;
 return s;
}
function god(seed=0){
 const s=adult(seed);s.development={kind:'kami',ready:true,faith:14,devotees:4};
 assert(A.beforeDeath(s,'age',()=>0,E.record));return s;
}
function apply(s,e){assert(e);assert(E.eligible(s,e));e.apply?.(s);s.xp+=e.xp||0;E.record(s,e.id,typeof e.text==='function'?e.text(s):e.text,e.effects,{sharedWith:e.sharedWith});s.history.push(e.id);s.seen[e.id]=1;s.flags.add('event:'+e.id);}
function partner(s,id='alice'){
 const now=s.age;s.age=30;
 E.meet(s,id,()=>.5);const route=TouhouRelationshipData.find(r=>r.id===id);R.begin(s,route,true);
 E.record(s,'relation:'+id+':intro','早年已有的实际相识。',{}, {contactMedium:s.relations[id].medium});
 Object.assign(s.relations[id],{status:'lover',next:null,loveAt:30});R.bindPartner(s,id);s.people[id].leaveAt=Infinity;
 E.record(s,'relation:'+id+':fixture-love','生前已经相许。',{}, {relationship:{id,from:'friend',to:'lover'}});
 s.age=now;s.log.sort((a,b)=>a.age-b.age);
 s.afterlife.divinity.partnerId=id;return s.people[id];
}

test('V22 changes discovery weights without changing mortality trials or the shared discovery roll',()=>{
 const s=adult(),config=TouhouLifeConfig;
 assert.equal(config.ghostOpportunityWeight,.88);assert.equal(config.vengefulOpportunityWeight,.82);assert.equal(config.faithOpportunityMultiplier,6);
 assert.equal(config.opportunityChance,.002);assert.equal(config.opportunityMultiplier,55);assert.equal(config.livingOpportunityWeight,3);
 for(const [kind,weight]of [['ghost',.88],['vengeful',.82],['kami',1],['shikaisen',1]])assert.equal(A.starts.find(e=>e.id===`chance:${kind}-found`).weight,weight);
 const e=A.starts.find(e=>e.id==='chance:kami-found'),w=E.weight(s,e);s.flags.add('legend:faith');assert.equal(E.weight(s,e),6*w);
 for(const [kind,limit]of [['ghost',.78],['vengeful',.68],['kami',.76]])for(const success of [true,false]){
  const q=adult();q.development={kind,ready:true,faith:8,devotees:3,anchor:3,resentment:6};
  assert.equal(A.beforeDeath(q,'health',()=>limit-(success?.000001:0),E.record),success);
 }
 for(const success of [true,false]){const q=adult();q.flags.add('legend:faith');q.development={kind:'kami',ready:true,faith:8,devotees:3};assert.equal(A.beforeDeath(q,'age',()=>.96-(success?.000001:0),E.record),success);}
});

test('three divine routes finish through real steps; low thresholds retain actual faith failure',()=>{
 const results=[];
 for(const seed of [0,1,2])for(const high of [true,false]){
  const s=god(seed);if(!high){s.stats.insight=0;s.stats.bond=0;}
  const origin=s.transformation.eventId;
  while(!s.ended&&s.turn<600)E.step(s,()=>.12);
  assert(s.ended);assert.equal(s.log.filter(e=>e.id==='ending').length,1);assert.equal(s.transformation.eventId,origin);assert.equal(s.transformation.source,'independent');
  const d=s.afterlife.divinity;
  assert.equal(new Set(d.history.map(h=>h.stage)).size,d.history.length);assert(d.history.length<=5);
  if(high){assert.equal(s.deathCause,'chapter');assert.equal(s.divineEndingId,'divine-'+d.route);assert.equal(d.stage,5);assert(d.merit>=3&&s.afterlife.faith>=6&&s.afterlife.devotees>=4);assert(s.age-s.mortalDeath.age>=52);}
  else{assert.equal(s.deathCause,'forgotten');assert(!s.divineEndingId);}
  const frozen=JSON.stringify(s);E.step(s,()=>0);assert.equal(JSON.stringify(s),frozen);
  results.push({seed,high,route:d.route,years:s.age-s.mortalDeath.age,cause:s.deathCause,ending:s.ending,endingId:s.divineEndingId,faith:s.afterlife.faith,stages:d.history,events:s.log.filter(e=>e.id.includes('divine-')).map(e=>({id:e.id,text:e.text,age:e.age}))});
 }
 const root=new URL('../reports/v22/',import.meta.url);mkdirSync(root,{recursive:true});writeFileSync(new URL('targeted-playouts.json',root),JSON.stringify({method:'Six directed post-transformation states; fixed RNG; no natural sampling or seed search.',results},null,2)+'\n');
});

test('divine resources, one recovery attempt and earned blessing stay finite and cannot rescue exhausted faith',()=>{
 const s=god(),a=s.afterlife,d=a.divinity;d.stage=2;d.merit=2;s.age+=20;a.faith=3;
 apply(s,A.continuation(s));assert.equal(a.faith,2.5);assert(d.recovery&&!d.recovery.done);
 assert(!A.continuation(s)?.id.includes('recovery-result'));s.age+=4;
 apply(s,A.continuation(s));assert(d.recovery.done);assert.equal(a.faith,6.5);assert.equal(a.devotees,5);
 a.faith=2;s.age+=4;assert(!A.continuation(s)?.id.includes('recovery'));
 a.faith=0;assert.equal(A.continuation(s),null);assert.equal(A.ending(s),'forgotten');
 const q=god();q.afterlife.faith=.25;q.afterlife.divinity.reserve=1;q.afterlife.recentScenes=['festival','oracle','neglect'];
 const e=A.select(q,()=>0);assert.match(e.id,/kami-blessing-/);apply(q,e);assert.equal(q.afterlife.faith,0);assert.equal(q.afterlife.divinity.reserve,0);assert.equal(A.ending(q),'forgotten');
 const low=god();low.afterlife.divinity.stage=2;low.afterlife.divinity.merit=1;low.stats.bond=0;low.age+=20;low.afterlife.faith=3;
 apply(low,A.continuation(low));low.age+=4;apply(low,A.continuation(low));assert.equal(low.afterlife.faith,3.5);assert.equal(low.afterlife.divinity.recovery.restored,false);
 const last=god();
 for(let i=0;i<5;i++){last.age+=TouhouDivineLives.routes[0].stages[i].delay;if(i===4)last.stats.bond=0;apply(last,A.continuation(last));}
 assert.equal(last.afterlife.divinity.merit,4);assert.equal(last.afterlife.divinity.history[4].passed,false);assert.equal(A.ending(last),null,'unfinished handover cannot earn a successful chapter');
});

test('divine companion events respect real partners, death, confinement and chapter closure',()=>{
 const s=god(),p=partner(s);s.age+=6;let e=A.continuation(s);assert.equal(e.sharedWith,'alice');apply(s,e);
 p.alive=false;s.partnerId=null;s.age+=12;e=A.continuation(s);assert(e.id.endsWith('shared-closed'));assert(!e.sharedWith);apply(s,e);assert.equal(s.afterlife.divinity.partnerStage,2);
 const dream=god();partner(dream,'sumireko').medium='dream';dream.age+=6;assert(!A.continuation(dream)?.sharedWith);
 const confined=god();partner(confined,'flandre');confined.age+=6;
 // A controlled confinement boundary, not a claim that modern Flandre's current roster is confined.
 const profile=TouhouContent.find(c=>c.id==='flandre'),original=profile.confined;profile.confined=true;
 try{e=A.continuation(confined);assert.match(e.text,/托旧日来往的人/);assert.equal(e.sharedWith,'flandre');}finally{if(original===undefined)delete profile.confined;else profile.confined=original;}
 const continuing=god();partner(continuing);while(!continuing.ended&&continuing.turn<600)E.step(continuing,()=>.12);
 assert.equal(continuing.deathCause,'chapter');assert.equal(continuing.partnerId,'alice');assert(continuing.people.alice.alive);assert.equal(continuing.relations.alice.status,'lover');
 const shared=continuing.log.filter(e=>e.sharedWith==='alice');assert.equal(shared.filter(e=>e.id.includes('divine-shared-')).length,2);
 const account=TouhouCompanionSummary.compose(continuing);assert(account.moments.some(e=>e.id.includes('divine-shared-')));assert.equal(account.years,38,'communication after mortal death does not extend physical shared years');
 assert(!continuing.endingText.includes(TouhouRelationshipData.find(r=>r.id==='alice').marriage.surviving));
});

test('only a known non-lover mentor replaces an already drawn hermit opening, with mutually exclusive trials',()=>{
 const s=adult();s.age=s.turn=30;const opening=O.starts.find(e=>e.id==='chance:hermit-found');
 assert.equal(O.discovered(s,opening),opening);E.meet(s,'miko',()=>.5);s.people.miko.close=3;
 assert.notEqual(O.discovered(s,opening).id,opening.id);
 for(const change of [q=>q.people.miko.alive=false,q=>q.people.miko.medium='dream',q=>q.people.miko.close=2,q=>q.partnerId='miko']){
  const q=structuredClone(s);change(q);assert.equal(O.discovered(q,opening),opening);
 }
 apply(s,O.discovered(s,opening));assert.equal(s.opportunity.mentorId,'miko');assert.equal(s.opportunityAttempts,1);
 s.age+=3;let events=O.events.filter(e=>E.eligible(s,e));assert.equal(events.length,1);apply(s,events[0]);
 s.people.miko.alive=false;s.age+=5;events=O.events.filter(e=>E.eligible(s,e));assert.equal(events.length,1);apply(s,events[0]);
 assert.equal(s.species,'hermit');assert.equal(s.transformation.source,'mentor-guidance');assert.equal(s.transformation.mentorId,'miko');assert(s.history.includes(s.transformation.eventId));
 assert.equal(s.firstPartnerId,null);assert(s.hermit.nextAttackAt>s.age);assert.notEqual(s.hermit.ageless,true);assert(!s.people.miko.alive);
 s.age+=12;const follow=O.after.find(e=>e.id.includes('mentorship')&&E.eligible(s,e));assert(follow);apply(s,follow);assert(!E.eligible(s,follow));
});
