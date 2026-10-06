import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const modules=[...readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['app.js','music.js'].includes(n));
for(const name of modules)await import('../dist/'+name);
const E=TouhouEngine,O=TouhouOpportunities;
const variants=['youkai','hermit','magician','vampire','miko'];
function student(variant,stage=2){
 const s=E.createLife({character:null,stats:{health:5,insight:5,bond:5,fortune:5},seed:1});
 s.age=s.turn=s.bodyAge=40;s.phase=2;s.stats={health:20,insight:20,bond:20,fortune:20};s.xp=20;
 s.opportunity={kind:variant==='miko'?'hermit':variant,stage,since:35,startedAge:30};s.opportunityAttempts=1;
 if(variant==='miko'){s.opportunity.mentorId='miko';E.meet(s,'miko',()=>.5);s.people.miko.close=3;}
 return s;
}
const trial=(s,passed)=>O.events.find(e=>e.dev.kind===s.opportunity.kind&&e.dev.stage===s.opportunity.stage&&e.dev.passed===passed&&!!e.mentorId===!!s.opportunity.mentorId);
test('final living trials allow exactly two extra years to meet unchanged requirements, with finite failure',()=>{
 assert.equal(TouhouLifeConfig.livingFinalGraceYears,2);
 for(const variant of variants){
  const s=student(variant),pass=trial(s,true),fail=trial(s,false),due=s.opportunity.since+pass.dev.delay;
  s.age=due-1;assert(!E.eligible(s,pass));
  s.age=due;assert(E.eligible(s,pass));assert(!E.eligible(s,fail));
  for(const key of Object.keys(pass.dev.thresholds)){
   const q=structuredClone(s),value=pass.dev.thresholds[key];
   if(key==='xp')q.xp=value-1;else q.stats[key]=value-1;
   for(const elapsed of [0,1]){q.age=due+elapsed;assert(!E.eligible(q,pass),variant+': '+key);assert(!E.eligible(q,fail));}
   q.age=due+2;assert(!E.eligible(q,pass));assert(E.eligible(q,fail));
   fail.apply(q);assert.equal(q.species,'human');assert.equal(q.transformation,null);assert.equal(q.opportunity,null);assert.equal(q.opportunityAttempts,1);assert(q.failedPaths.includes(s.opportunity.kind));
  }
  const regained=structuredClone(s);regained.age=due+1;assert(E.eligible(regained,pass));assert(!E.eligible(regained,fail));
  pass.apply(regained);assert.equal(regained.species,s.opportunity.kind);assert.equal(regained.opportunity,null);assert.equal(regained.transformation.source,variant==='miko'?'mentor-guidance':'independent');
 }
});
test('first trials, original attempt and expiry limits, and spirit discovery remain unchanged',()=>{
 for(const variant of variants){
  const s=student(variant,1),pass=trial(s,true),fail=trial(s,false);s.age=s.opportunity.since+pass.dev.delay;s.stats.insight=0;
  assert(E.eligible(s,fail));assert(!E.eligible(s,pass));
  const late=student(variant);late.age=late.opportunity.startedAge+18;assert(E.eligible(late,O.abandoned));
  O.abandoned.apply(late);assert.equal(late.opportunity,null);assert(late.failedPaths.includes(variant==='miko'?'hermit':variant));
 }
 const s=student('hermit');s.opportunity=null;s.opportunityAttempts=2;
 assert([...O.starts,...TouhouAfterlife.starts].every(e=>!E.eligible(s,e)));
 assert.equal(TouhouLifeConfig.ghostOpportunityWeight,.88);assert.equal(TouhouLifeConfig.vengefulOpportunityWeight,.82);assert.equal(TouhouLifeConfig.faithOpportunityMultiplier,6);
 assert.equal(TouhouLifeConfig.opportunityChance,.002);assert.equal(TouhouLifeConfig.opportunityMultiplier,55);assert.equal(TouhouLifeConfig.livingOpportunityWeight,3);
 const defaults=TouhouLifeConfig;
 globalThis.TouhouLifeConfig={...defaults,livingFinalGraceYears:0};
 try{const old=student('hermit');old.stats.insight=0;assert(E.eligible(old,trial(old,false)));}finally{globalThis.TouhouLifeConfig=defaults;}
});
