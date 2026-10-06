import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';

const baseline='a6a84e4557e3b7c1d6d7c532ec5d8ed183fcffe2';
const baselineData=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/prose-v23-baseline.json.gz',import.meta.url))));
assert.equal(baselineData.baselineCommit,baseline);
const modules=[...readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['app.js','music.js'].includes(n));
for(const name of modules)await import('../dist/'+name);
const E=TouhouEngine,R=TouhouRelationships,C=TouhouCompanionship,A=TouhouAfterlife;
const out=new URL('../reports/v23.1/',import.meta.url);mkdirSync(out,{recursive:true});
function couple(id,seed=1){
 const s=E.createLife({seed,character:null,stats:{health:5,insight:5,bond:5,fortune:5}});
 s.age=s.turn=s.bodyAge=30;s.phase=2;s.stats={health:24,insight:24,bond:24,fortune:24};s.xp=30;
 E.meet(s,id,()=>.5);const route=TouhouRelationshipData.find(c=>c.id===id);R.begin(s,route,true);
 const r=s.relations[id];Object.assign(r,{status:'lover',next:null,loveAt:30,visits:10,trust:8});R.bindPartner(s,id);
 r.marriage={stage:3,lastAt:35,marriedAt:35,daily:{},lastDaily:null};s.married=true;
 E.record(s,'relation:'+id+':intro','三十岁时初识。',{}, {contactMedium:r.medium});
 E.record(s,'relation:'+id+':fixture-love','三十岁时相许。',{}, {relationship:{id,from:'friend',to:'lover'}});
 s.age=s.turn=s.bodyAge=35;E.record(s,'relation:'+id+':marriage:wedding','三十五岁时成婚。');
 return s;
}
function apply(s,e){
 assert(E.eligible(s,e));e.apply?.(s);E.record(s,e.id,e.text,e.effects,{with:e.with,sharedWith:e.sharedWith});s.history.push(e.id);s.seen[e.id]=(s.seen[e.id]||0)+1;
}

test('later wording rotates by actual occurrences while the original freshness gate stays intact',()=>{
 const results=[];
 for(const id of ['yumeko','mystia','hecatia']){
  const route=TouhouRelationshipData.find(c=>c.id===id);
  for(const [kind,items]of [['echo',route.echoes],['daily',route.marriage.daily]])for(const item of items.filter(i=>i.settledVariants)){
   const s=couple(id),r=s.relations[id],key=kind==='echo'?'echo:'+item.key:'marriage:daily:'+item.key;
   E.transform(s,'youkai');s.age=62;
   const texts=[];
   for(let i=0;i<7;i++){
    s.age+=50;s.turn++;r.lastEchoKey=r.marriage.lastDaily=null;
    // Six other established scenes release the old six-scene gate; no new eligibility rule is bypassed.
    for(let n=0;n<6;n++)r.history.push({key:'circle:fixture:'+n,age:s.age-40,text:'其他场景'+n});
    const base=C.text(s,r,item);assert(C.fresh(s,r,base));
    const before=JSON.stringify(s),expected=i===0?base:item.settledVariants[(i-1)%4];
    assert.equal(C.variedText(s,r,item,key,base),expected);assert.equal(JSON.stringify(s),before,'wording selection must be read-only');
    const event=kind==='echo'?R.echoEvent(s,route,item):R.marriageDailyEvent(s,route,item);assert.equal(event.text,expected);
    assert.equal(TouhouLongYears.replaceable(s,event),i>0,'later wording retains the original project replacement slot');
    assert.equal(C.variedText(s,r,item,key,base),expected,'building an unused candidate does not advance the wording');
    apply(s,event);texts.push(event.text);
    assert.equal(r.history.at(-1).text,event.text);assert.equal(r.history.at(-1).freshText??r.history.at(-1).text,base);
    assert(!C.fresh(s,r,base),'new wording must not immediately reopen the scene');
    for(let n=0;n<6;n++)r.history.push({key:'circle:gap:'+n,age:s.age,text:'间隔场景'+n});
    s.age+=35;assert(!C.fresh(s,r,base),'the existing mature 36-year limit remains');s.age++;
    assert(C.fresh(s,r,base));
   }
   assert.equal(new Set(texts.slice(0,5)).size,5);assert.notEqual(texts[5],texts[4]);
   if(id==='yumeko')assert(texts.every(t=>t.includes('梦')));
   if(kind==='echo'){
    r.lastEchoKey=null;assert(R.canEcho(s,route,item));const healthy=structuredClone(s);s.people[id].alive=false;assert(!R.canEcho(s,route,item));
    const young=structuredClone(healthy);young.life=young.species='human';young.age=35;young.bodyAge=35;young.relations[id].loveAt=30;
    assert.equal(C.variedText(young,young.relations[id],item,key,C.text(young,young.relations[id],item)),item.text);
   }
   results.push({id,key,firstFive:texts.slice(0,5),nextTwo:texts.slice(5)});
  }
 }
 assert.equal(results.length,18);
 writeFileSync(new URL('later-scenes.json',out),JSON.stringify({method:'18 directed recurring scenes; seven actual occurrences each. No natural sampling.',results},null,2)+'\n');
});

test('Minoriko has distinct same-year topics and Hina explicitly refers to the protagonist’s mortal life',()=>{
 const s=couple('minoriko',203700499);s.age=s.turn=s.bodyAge=68;s.development={kind:'kami',ready:true,faith:20,devotees:4};assert(A.beforeDeath(s,'age',()=>0,E.record));
 const a=s.afterlife,d=a.divinity;s.age=101;s.turn=86;a.lastMemoryAt=92;a.belovedScenes=2;
 Object.assign(d.partnerCompany,{next:2,lastAt:91,flags:['minoriko-partner-rest-hour']});
 const memory=A.select(s,()=>0),before={faith:a.faith,devotees:a.devotees,merit:d.merit};assert.match(memory.text,/叫卖声/);apply(s,memory);
 const stage=A.continuation(s);assert(stage.id.endsWith('minoriko-partner-poor-harvest'));assert.match(stage.text,/收成不如所想/);assert.notEqual(memory.text,stage.text);apply(s,stage);
 assert.deepEqual({faith:a.faith,devotees:a.devotees,merit:d.merit},before);assert.equal(s.stats.bond,25);
 const minoriko=TouhouDivineLives.contacts.characters.find(c=>c.id==='minoriko');assert.match(minoriko.memories[1],/趁热慢慢吃/);
 assert.match(TouhouMisfortuneContact.memories[1],/你生前的一句玩笑/);
 writeFileSync(new URL('same-year-scenes.json',out),JSON.stringify({method:'Directed same-year state at the reported seed/age; not a reconstruction of the parent’s full input.',seed:203700499,age:101,events:[{id:memory.id,text:memory.text},{id:stage.id,text:stage.text}]},null,2)+'\n');
});

test('three fixed long-lived couples keep V23 event schedules, state and RNG consumption',()=>{
 const old=vm.createContext({console,setTimeout,clearTimeout});
 for(const name of modules)vm.runInContext(baselineData.modules[name],old,{filename:name});
 const setup=couple.toString(),results=[];
 function run(context,id,seed){
  const script=`(()=>{const E=TouhouEngine,R=TouhouRelationships;${setup};const s=couple(${JSON.stringify(id)},${seed});E.transform(s,'youkai');s.age=60;
   const random=E.random(${seed}^0x9e3779b9);let calls=0,steps=0;const rng=()=>{calls++;return random();};
   while(!s.ended&&steps++<600)E.step(s,rng);
   if(!s.ended)throw Error('Fixed couple did not settle');
   const omitted=new Set(['text','freshText','summary','endingText']);
   return {state:JSON.stringify(s,(k,v)=>omitted.has(k)?undefined:v instanceof Set?[...v]:v),calls,steps,age:s.age,events:s.log.length};})()`;
  return context?vm.runInContext(script,context):vm.runInThisContext(script);
 }
 for(const [id,seed]of [['yumeko',203700033],['mystia',203700016],['hecatia',203700008]]){
  const before=run(old,id,seed),after=run(null,id,seed);assert.equal(after.state,before.state,id+' all non-prose state');assert.equal(after.calls,before.calls,id+' RNG calls');
  results.push({id,seed,steps:after.steps,age:after.age,events:after.events,rngCalls:after.calls,nonProseStateEqual:true});
 }
 writeFileSync(new URL('paired-v23.json',out),JSON.stringify({baseline,method:'Three constructed established-couple inputs using the reported seeds; not parent natural replays or population sampling.',results},null,2)+'\n');
});

test('kami human-form meetings preserve the spirit lifecycle and existing relationship boundaries',()=>{
 const old=vm.createContext({console,setTimeout,clearTimeout});
 for(const name of modules)vm.runInContext(baselineData.modules[name],old,{filename:name});
 const setup=couple.toString(),results=[];
 function run(context,kind){
  const script=`(()=>{const E=TouhouEngine,R=TouhouRelationships,A=TouhouAfterlife;${setup};const s=couple('suwako',203700499);
   s.age=s.turn=s.bodyAge=68;s.development={kind:${JSON.stringify(kind)},ready:true,faith:20,devotees:4,anchor:4};
   if(!A.beforeDeath(s,'age',()=>0,E.record))throw Error('Transformation fixture failed');
   const body=s.body,bodyAge=s.bodyAge,random=E.random(3300231);let calls=0,steps=0;const rng=()=>{calls++;return random();};
   while(!s.ended&&steps++<600)E.step(s,rng);
   if(!s.ended||s.body!==body||s.bodyAge!==bodyAge)throw Error('Spirit lifecycle changed');
   const omitted=new Set(['text','freshText','summary','endingText']);
   return {state:JSON.stringify(s,(k,v)=>omitted.has(k)?undefined:v instanceof Set?[...v]:v),calls,steps,age:s.age,body,account:TouhouCompanionSummary.compose(s),transformation:s.log.find(e=>e.id==='development:'+${JSON.stringify(kind)}+'-transformed').text};})()`;
  return context?vm.runInContext(script,context):vm.runInThisContext(script);
 }
 for(const kind of ['kami','ghost']){
  const before=run(old,kind),after=run(null,kind);assert.equal(after.state,before.state,kind+' lifecycle and non-prose state');assert.equal(after.calls,before.calls);assert.equal(after.body,'spirit');
  assert.equal(after.account.years,before.account.years);assert.equal(after.account.marriedYears,before.account.marriedYears);
  if(kind==='kami'){assert.match(after.transformation,/人形现身/);assert.match(after.account.yearsText,/生前相伴/);assert.match(after.account.outcomeTitle,/成神以后/);}
  else{assert.equal(after.transformation,before.transformation);assert.deepEqual(after.account,JSON.parse(JSON.stringify(before.account)));}
  results.push({kind,steps:after.steps,age:after.age,rngCalls:after.calls,nonProseStateEqual:true,body:after.body,transformation:after.transformation,account:after.account});
 }
 const s=couple('suwako');s.age=68;s.development={kind:'kami',ready:true,faith:20,devotees:4};assert(A.beforeDeath(s,'age',()=>0,E.record));s.age+=9;
 const r=s.relations.suwako,a=s.afterlife;
 r.medium='dream';assert.match(A.select(s,()=>0).text,/梦/);assert.match(TouhouCompanionSummary.compose(s).yearsText,/生前梦中相伴/);
 r.medium='visit';s.people.suwako.alive=false;assert(!A.select(s,()=>0).id.includes('-beloved-'));
 a.faith=0;assert.equal(A.ending(s),'forgotten');assert.equal(A.continuation(s),null);
 writeFileSync(new URL('kami-form.json',out),JSON.stringify({method:'Two fixed already-paired spirit lives compared with V23, plus dream/deceased/faith boundaries; no natural sampling.',results},null,2)+'\n');
});
