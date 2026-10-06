import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {assertInputMigration,assertArchivedV21Source} from './helpers/input-replay-v21.mjs';
import {assertArchivedV21Fixture,replayAgainstV23} from './helpers/versioned-replay.mjs';
import {writeTestReport} from './helpers/report-output.mjs';
for(const name of ['config','talents','content-data','relationship-data','events','health','opportunities','encounters','spiritual','afterlife','careers','contacts','memoir','relationships','talent-stories','partner-learning','companionship','guidance','akyuu','long-years-data','long-years','engine','companion-summary','memoir-image'])await import('../dist/'+name+'.js');
const E=TouhouEngine,C=TouhouCompanionSummary;
const entry=(id,age,text,extra={})=>({id,age,time:age+'岁',text,...extra});
function fixture(id='akyuu',dream=false){
 const local=id==='local:spouse';
 return {firstPartnerId:id,firstLoveAt:25,partnerId:id,age:60,deathCause:'chapter',people:{[id]:{name:local?'伴侣':'稗田阿求',alive:true}},relations:local?{}:{[id]:{medium:dream?'dream':'physical'}},log:[
  entry(local?'common:local-meet':'relation:'+id+':intro',20,'初次来往。'),
  entry(local?'common:courtship':'relation:'+id+':love',25,'互明心意。',{relationship:{id,from:'friend',to:'lover'}}),
  entry(local?'common:marry':'relation:'+id+':marriage:wedding',28,'请来熟识的人，一起吃了喜饭。')
 ]};
}
test('recorded partner death stops shared and married years; local spouse keeps the same facts',()=>{
 for(const id of ['akyuu','local:spouse']){
  const s=fixture(id);s.age=140;s.people[id].alive=false;s.people[id].deadAt=42;s.partnerId=null;s.log.push(entry('farewell-'+id,42,'伴侣离世，留下旧事。'));
  const a=C.compose(s);assert.equal(a.years,17);assert.equal(a.marriedYears,14);assert.equal(a.outcomeTitle,'伴侣先行离世');assert.equal(a.outcomeText,'伴侣离世，留下旧事。');assert(!a.periodText.includes('140'));assert(a.moments.some(e=>e.id.includes('marry')||e.id.includes('wedding')));
  if(id==='local:spouse')assert.equal(a.name,'村民伴侣');
 }
});
test('a real return resumes shared time without counting the absence or afterlife years',()=>{
 const s=fixture();s.akyuuReturn={deathAt:35};s.log.push(entry('farewell-akyuu',35,'第一次离别。'),entry('akyuu-return:returned',39,'归来重逢。'),entry('akyuu-return:aftercare',40,'一同照顾续来的身体。'));
 let a=C.compose(s);assert.equal(a.years,31);assert.equal(a.marriedYears,28);assert.equal(a.outcomeTitle,'仍在相守');assert(a.moments.some(e=>e.id==='akyuu-return:returned'));
 s.afterlife={since:48};s.age=240;s.people.akyuu.alive=false;s.people.akyuu.deadAt=51;s.partnerId=null;s.log.push(entry('farewell-akyuu',51,'第二次离别。'));
 a=C.compose(s);assert.equal(a.years,19);assert.equal(a.marriedYears,16);assert.equal(a.outcomeTitle,'生死相隔 · 伴侣已故');assert(a.outcomeText.includes('第二次离别。'));assert(!a.moments.some(e=>e.age>48));
});
test('dream parting, actual breakup, protagonist death and no romance stay distinct',()=>{
 const dream=fixture('akyuu',true);dream.log.push(entry('farewell-akyuu',40,'梦路渐远。'));dream.people.akyuu.alive=false;dream.people.akyuu.deadAt=40;
 assert.equal(C.compose(dream).outcomeTitle,'梦路渐远');assert(C.compose(dream).yearsText.startsWith('梦中'));
 const breakup=fixture();breakup.log.push(entry('relation:akyuu:parting',34,'各自道别。',{relationship:{id:'akyuu',from:'lover',to:'estranged'}}));
 assert.equal(C.compose(breakup).years,9);assert.equal(C.compose(breakup).outcomeTitle,'相恋止于往年');
 const s=fixture();s.deathCause='age';assert.equal(C.compose(s).outcomeTitle,'相伴至此生终点');
 assert.deepEqual(C.compose({firstPartnerId:null}).moments,[]);assert.equal(C.compose({firstPartnerId:null}).name,'未曾结缘');assert.equal(C.compose({firstPartnerId:null,named:{}}).name,'本卷未记情缘');
});
test('Akyuu fractional death deadlines exclude both absences even when departure and return share a year',()=>{
 const s=fixture();s.akyuuReturn={deathAt:32.4};s.people.akyuu.deadAt=45;s.people.akyuu.alive=false;
 s.log.push(entry('farewell-akyuu',33,'初次离别。'),entry('akyuu-return:returned',33,'当年归来。'),entry('farewell-akyuu',45,'再度离别。'));
 const a=C.compose(s);assert.equal(a.years,19.4);assert.equal(a.marriedYears,16.4);assert(a.periodText.includes('45岁'));assert.equal(a.outcomeText,'再度离别。');
});
test('saved ordinary UI inputs retain V21 provenance and match V23 mechanics while current memories remain read-only',t=>{
 const fixture=assertArchivedV21Fixture('companion-ui-v21.json');
 const oldBytes=readFileSync(new URL('./fixtures/companion-ui-v20.json',import.meta.url)),old=JSON.parse(oldBytes);
 assert.deepEqual(fixture.origin,{path:'tests/fixtures/companion-ui-v20.json',sha256:createHash('sha256').update(oldBytes).digest('hex')});
 assert.equal(fixture.version,21);assert.equal(fixture.status,'verified');
 assert.deepEqual(fixture.cases.map(c=>c.kind),['named','local','none']);
 for(const [file,hash]of Object.entries(fixture.sources))assertArchivedV21Source(file,hash);
 const cases=fixture.cases,currentCases=[];
 for(const c of cases){
  assertInputMigration(c,old.cases.find(prior=>prior.kind===c.kind));
  assert.deepEqual(TouhouTalents.draw(E.random(c.input.seed^0x35dab)),c.input.draft);TouhouTalents.validate(c.input.talents);E.validateAllocation(c.input.stats);
  assert(c.input.talents.every(id=>c.input.draft.includes(id)));assert.equal(c.input.goal,'none');assert.equal(c.input.romanceWish,null);
  const {state:s,reference,referenceCompanion,rngCalls}=replayAgainstV23(c.input);
  const actualKind=s.firstPartnerId===null?'none':s.firstPartnerId==='local:spouse'?'local':'named';
  const referenceKind=reference.firstPartnerId===null?'none':reference.firstPartnerId==='local:spouse'?'local':'named';
  assert.equal(actualKind,referenceKind,'current UI role agrees with V23 under the unchanged input');
  const targetAchieved=actualKind===c.kind&&(c.kind==='none'||s.log.some(e=>e.id===(c.kind==='local'?'common:marry':'relation:'+s.firstPartnerId+':marriage:wedding')));
  const referenceAchieved=referenceKind===c.kind&&(c.kind==='none'||reference.log.some(e=>e.id===(c.kind==='local'?'common:marry':'relation:'+reference.firstPartnerId+':marriage:wedding')));
  assert.equal(targetAchieved,referenceAchieved,'current role and wedding coverage agree with V23');
  if(!targetAchieved)t.diagnostic(c.kind+' seed '+c.input.seed+' now records '+actualKind+'; directed summary tests retain named, local and unpartnered component coverage.');
  currentCases.push({kind:c.kind,seed:c.input.seed,actualKind,targetAchieved,firstPartnerId:s.firstPartnerId,historicalV21:{actualKind:c.actualKind,targetAchieved:c.targetAchieved},rngCalls});
  const before=structuredClone(s),engineRandom=E.random,unseededRandom=Math.random;let a;
  E.random=()=>{throw Error('presentation requested gameplay RNG');};Math.random=()=>{throw Error('presentation requested unseeded RNG');};
  try{a=C.compose(s);}finally{E.random=engineRandom;Math.random=unseededRandom;}
  assert.deepEqual(s,before,'compose leaves all state, including sets and flags, intact');assert.equal(a.id,reference.firstPartnerId);
  for(const key of ['id','name','years','marriedYears'])assert.equal(a[key],referenceCompanion[key],key+' settlement fact matches V23');
  if(a.id===null)assert.equal(a.moments.length,0);else assert(a.moments.length>=3&&a.moments.length<=7);
  for(const m of a.moments){assert.equal(m.text,s.log[m.index].text);assert.equal(m.age,s.log[m.index].age);assert.equal(m.time,s.log[m.index].time);}
  if(s.outsideJourney?.partnerId===a.id&&s.log.some(e=>e.id==='legendary:outside-return'))assert(a.moments.some(m=>m.id==='legendary:outside-return'));
  if(a.id==='local:spouse'){
   const farewell=s.log.find(e=>e.id==='farewell-local:spouse');
   if(farewell){const until=s.afterlife?Math.min(s.afterlife.since,farewell.age):farewell.age;assert.equal(a.years,Number((until-s.firstLoveAt).toFixed(1)));}
   assert(a.moments.some(m=>m.id.startsWith('local:marriage:')||m.id.startsWith('common:spouse-')),'local shared scenes remain actual selected memories');
  }
 }
 const unmet=cases.filter(c=>!c.targetAchieved).map(c=>({kind:c.kind,actualKind:c.actualKind,seed:c.input.seed,firstPartnerId:c.firstPartnerId}));
 assert.deepEqual(fixture.coverage,{requested:3,achieved:3-unmet.length,unmet},'V21 coverage remains historical');
 const currentUnmet=currentCases.filter(c=>!c.targetAchieved);
 writeTestReport('companion-ui-current-v23.1.json',JSON.stringify({version:'23.1.0',baseline:'V23',inputs:'unchanged approved V21 UI cases',historicalCoverage:fixture.coverage,currentCoverage:{requested:3,achieved:3-currentUnmet.length,unmet:currentUnmet},cases:currentCases},null,2)+'\n');
});
test('long names and many memories wrap into bounded image pages without dropping text',()=>{
 const partner=C.compose(fixture());partner.name='很长的伴侣姓名·'.repeat(10);partner.moments=Array.from({length:7},(_,i)=>({time:(30+i)+'岁',text:'共同经历，记下这段实际往事。'.repeat(15)}));
 const ctx={font:'',measureText(text){return {width:Array.from(text).length*(parseFloat(this.font.match(/([\d.]+)px/)[1]))};}};
 const data={subject:'你的一生',ending:'此卷暂歇',endingText:'卷中旧事。',identity:'普通人',metrics:'此卷记录',stats:[],talents:[],goal:'随遇而安',goalDescription:'写过这一生。',paragraphs:['其余人生总结。'],names:[partner.name],companion:partner};
 const pages=TouhouMemoirImage.plan(ctx,data);assert(pages.length>1);
 const lines=pages.flatMap(p=>p.rows.filter(r=>r.glyphs).map(r=>r.glyphs.map(g=>g.text).join(''))).join('');
 assert(lines.includes(partner.name));assert(lines.includes(partner.yearsText));assert(lines.includes(partner.outcomeText));assert(lines.includes('其余人生总结。'));
 for(const m of partner.moments)assert(lines.includes(m.time+m.text));
 for(const p of pages){assert(p.height<=4096);for(const r of p.rows){assert(r.y+r.height<=p.height-116);if(r.glyphs)assert(r.glyphs.reduce((n,g)=>n+r.size,0)<=960);}}
});
