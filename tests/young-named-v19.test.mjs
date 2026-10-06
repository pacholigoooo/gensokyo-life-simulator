import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
for(const name of ['config','talents','content-data','relationship-data','events','health','opportunities','encounters','spiritual','afterlife','careers','contacts','memoir','relationships','talent-stories','partner-learning','companionship','guidance','akyuu','engine','companion-summary','memoir-image'])await import('../dist/'+name+'.js');
const E=TouhouEngine,R=TouhouRelationships,C=TouhouContacts,Summary=TouhouCompanionSummary;
const ids=['reimu','marisa','kosuzu','akyuu'],routes=TouhouRelationshipData,route=id=>routes.find(r=>r.id===id);
const romances=readdirSync(new URL('../data/romances/',import.meta.url)).filter(f=>f.endsWith('.json')).flatMap(f=>JSON.parse(readFileSync(new URL('../data/romances/'+f,import.meta.url))));
const common=id=>TouhouEvents.events.find(e=>e.id==='common:'+id);
function age(s,n){s.age=s.turn=s.bodyAge=n;s.phase=n<9?0:n<20?1:n<40?2:n<65?3:4;return s;}
function life(n=10){return age(E.createLife({character:null,seed:42,stats:{health:6,insight:7,bond:6,fortune:1}}),n);}
// Directed components: resources and boundary ages are explicit. Each person's
// trust, visits, flags and memories come only from an applied authored event.
function fire(s,e){
 assert(e&&E.eligible(s,e),e?.id+' eligible');
 for(const id of e.with||[]){E.meet(s,id,()=>.5);s.people[id].close++;}
 for(const flag of e.set||[])s.flags.add(flag);for(const flag of e.clear||[])s.flags.delete(flag);
 e.apply?.(s,()=>.5);s.xp+=e.xp||0;
 E.record(s,e.id,e.text,e.effects,{with:e.with,scene:e.scene,contactMedium:e.contactMedium});TouhouHealth.event(s,e);
 s.history.push(e.id);s.seen[e.id]=(s.seen[e.id]||0)+1;s.flags.add('event:'+e.id);return e;
}
function introduce(s,id){assert(R.youngEntry(s,route(id)));fire(s,R.youngIntroduction(route(id),s));return s.relations[id];}
function next(s,id){
 const d=route(id),r=s.relations[id],key=r.next;assert(key,id+' unfinished node');age(s,Math.max(s.age+1,R.nodeDueAt(s,d,r)));
 const b=d.nodes[key].branches.find(b=>R.matches(s,r,b.when)&&(b.status!=='lover'||R.canLove(s,d,r)));assert(b,id+'/'+key+' reachable branch');
 return fire(s,R.branchEvent(d,key,b));
}
function beforeLove(id='reimu',metAt=10){const s=life(metAt);introduce(s,id);for(let n=0;n<4;n++)next(s,id);return s;}
function completed(id='reimu',metAt=10){const s=beforeLove(id,metAt);next(s,id);next(s,id);assert.equal(s.relations[id].next,null);return s;}
function expectedAdult(node){
 const prefix=f=>'love:'+f,c=structuredClone(node);
 for(const b of c.branches){b.next=b.next===null?null:prefix(b.next);for(const k of ['set','clear'])if(b[k])b[k]=b[k].map(prefix);for(const k of ['relationFlags','missingRelationFlags'])if(b.when[k])b.when[k]=b.when[k].map(prefix);}
 return c;
}

test('V19 keeps all six original adult nodes and copies their actual conditions into the four youth graphs',()=>{
 assert.deepEqual(routes.filter(d=>d.young).map(d=>d.id).sort(),ids.slice().sort());
 for(const id of ids){
  const d=route(id),source=romances.find(d=>d.id===id);assert.equal(d.young.canonAge,'unknown');assert.equal(d.young.start,d.romanceStart.replace(/^love:/,'young:'));
  assert.equal(Object.keys(source.nodes).length,6);assert.equal(d.young.scenes.length,2);
  assert.deepEqual(d.young.entry.minAge,10);assert.equal(d.young.entry.maxAge,11);
  for(const [stat,value]of Object.entries(d.entry.min||{}))assert(d.young.entry.min[stat]>=value,id+' retains entry stat '+stat);
  for(const [key,value]of Object.entries(d.entry))if(!['minAge','maxAge','min'].includes(key))assert.deepEqual(d.young.entry[key],value,id+' retains entry '+key);
  for(const [key,node]of Object.entries(source.nodes)){
   const original=expectedAdult(node);assert.deepEqual(d.nodes['love:'+key],original,id+' adult '+key);
   const young=structuredClone(d.nodes['young:'+key]);assert.equal(young.delay,original.delay);
   assert.equal(young.branches.length,original.branches.length);
   for(const [i,b]of young.branches.entries()){
    assert.notEqual(b.text,original.branches[i].text,id+' independently narrated '+key);
    b.text=original.branches[i].text;b.next=b.next===null?null:b.next.replace(/^young:/,'love:');
    if(b.status==='lover'){assert.equal(b.when.minAge,16);assert.equal(b.when.minYears,6);assert.equal(b.when.minVisits,4);assert.equal(b.when.minTrust,4);b.when.minAge=20;}
   }
   assert.deepEqual(young,original,id+' preserves conditions, trust, flags, effects and transitions '+key);
  }
 }
 assert.equal(route('marisa').young.entry.min.health,5);
});

test('youth entry respects 10–11, original resources and existing people without rewriting a meeting or age',()=>{
 for(const id of ids){
  const d=route(id);
  for(const n of [9,10,11,12])assert.equal(R.youngEntry(life(n),d),n===10||n===11,id+' age '+n);
  for(const [stat,min]of Object.entries(d.young.entry.min)){const s=life();s.stats[stat]=min-1;assert(!R.youngEntry(s,d),id+' insufficient '+stat);}
  for(const change of [s=>{s.character=TouhouContent[0];},s=>{s.species='hermit';},s=>{s.body='spirit';},s=>{s.realm='outside';},s=>{s.afterlife={since:9};},s=>{s.dormant=true;},s=>{s.ended=true;}]){const s=life();change(s);assert(!R.youngEntry(s,d),id+' ordinary human only');}
  const s=life();E.meet(s,id,()=>.5);const p=s.people[id],saved=structuredClone(p),before=structuredClone(s);
  assert(!R.youngEntry(s,d));assert.throws(()=>R.youngIntroduction(d,s),/少年初识前置/);assert.deepEqual(s,before);
  age(s,18);let draws=0;E.meet(s,id,()=>{draws++;return 0;});assert.equal(draws,0);assert.equal(s.people[id],p);assert.deepEqual(p,saved);
 }
 assert(!R.youngEntry(life(),route('alice')),'the youth exception is limited to the reviewed four');
});

test('all four actual 10→16 and 11→17 courses earn visits and flags, wait six years, then finish the sixth node',()=>{
 for(const id of ids)for(const metAt of [10,11]){
  const s=life(metAt),r=introduce(s,id),p=s.people[id],original={metAt:p.metAt,leaveAt:p.leaveAt,ageAtMeet:p.ageAtMeet};
  assert.equal(r.startedAt,metAt);assert.equal(p.metAt,metAt);assert.equal(r.trust,0);assert.equal(r.visits,1);assert.deepEqual(r.flags,[]);
  assert(r.young);assert.equal(r.youngOrigin,'fictional-youth');assert.equal(r.romanceOrigin,'young');assert.equal(r.canonAge,'unknown');
  if(id==='akyuu'){assert(p.ageAtMeet>=12&&p.ageAtMeet<=14);assert.equal(p.ageBasis,undefined);}else{assert.equal(p.ageBasis,'fictional-same-age');assert.equal(p.ageAtMeet,metAt);}
  if(id==='marisa')assert(s.flags.has('contact:forest'),'actual young introduction opens the familiar forest route');
  const expectedFlags=[];
  for(let n=0;n<4;n++){
   const key=r.next,b=route(id).nodes[key].branches.find(b=>R.matches(s,r,b.when));assert(b);
   next(s,id);for(const flag of b.set||[])if(!expectedFlags.includes(flag))expectedFlags.push(flag);
   assert.equal(r.trust,n+1);assert.equal(r.visits,n+2);assert.deepEqual(r.flags,expectedFlags);assert.equal(r.history.at(-1).text,b.text);
  }
  assert.equal(r.trust,4);assert.equal(r.visits,5);assert.equal(s.firstPartnerId,null);
  const underage=structuredClone(s);age(underage,15);assert(!R.canLove(underage,route(id),underage.relations[id]));
  const short=structuredClone(s);age(short,metAt+5);assert(!R.canLove(short,route(id),short.relations[id]),id+' five actual years');
  assert.equal(R.nodeDueAt(s,route(id),r),metAt+6);
  for(const [field,value]of [['trust',3],['visits',3],['romanceAllowed',false]]){const low=structuredClone(s);age(low,metAt+6);low.relations[id][field]=value;assert(!R.canLove(low,route(id),low.relations[id]),id+' retains '+field);}
  next(s,id);assert.equal(s.age,metAt+6);assert.equal(s.firstLoveAt,metAt+6);assert.equal(s.firstPartnerId,id);assert.equal(r.status,'lover');assert.equal(r.visits,6);
  assert(id==='akyuu'?TouhouAkyuu.age(s)>=18:p.ageAtMeet+s.age-p.metAt>=16);
  next(s,id);assert.equal(r.next,null);assert.equal(r.visits,7);assert.equal(r.history.length,7);
  assert.equal(s.people[id],p);assert.deepEqual({metAt:p.metAt,leaveAt:p.leaveAt,ageAtMeet:p.ageAtMeet},original);
  assert.equal(s.log.filter(e=>e.id==='relation:'+id+':intro').length,1);assert.equal(s.log.filter(e=>e.id.startsWith('relation:'+id+':young:')).length,6);
 }
});

test('fallbacks never invent source success flags, and Akyuu below her own eighteen waits at the confession cursor',()=>{
 for(const id of ids){
  const s=life(),r=introduce(s,id),d=route(id);s.stats.insight=5;const key=r.next,first=d.nodes[key].branches[0];
  assert(!R.matches(s,r,first.when));const e=next(s,id);assert.equal(e.id,'relation:'+id+':'+key+':'+d.nodes[key].branches.at(-1).key);
  assert.equal(r.trust,1);assert.equal(r.visits,2);for(const flag of first.set||[])assert(!r.flags.includes(flag));
 }
 const s=beforeLove('akyuu'),d=route('akyuu');age(s,16);assert(TouhouAkyuu.age(s)>=18);assert(R.canLove(s,d,s.relations.akyuu));
 // A one-field negative boundary isolates her own-age guard from the otherwise
 // qualified six-year course. Real initPerson values remain 12–14 above.
 const younger=structuredClone(s);younger.people.akyuu.ageAtMeet=11;const r=younger.relations.akyuu,previous=structuredClone(r);
 assert.equal(TouhouAkyuu.age(younger),17);assert(!R.canLove(younger,d,r));assert.equal(R.nodeDueAt(younger,d,r),17);
 assert.equal(R.select(younger,()=>0),null);assert.deepEqual(r,previous,'an age wait cannot turn into a friendship refusal');
 age(younger,17);assert.equal(TouhouAkyuu.age(younger),18);const e=R.select(younger,()=>0);assert(e?.id.startsWith('relation:akyuu:young:this_life_vow:'));fire(younger,e);assert.equal(r.status,'lover');
 const declined=beforeLove('kosuzu'),dr=declined.relations.kosuzu;age(declined,16);const no=route('kosuzu').nodes[dr.next].branches.find(b=>b.status==='friend');fire(declined,R.branchEvent(route('kosuzu'),dr.next,no));R.romanceClosure(declined,'kosuzu');assert.equal(dr.next,null);assert(dr.romanceClosed);assert.equal(declined.firstPartnerId,null);
});

test('teen companions cannot reach adult activities before twenty, or replace a real first love after interruption and death',()=>{
 for(const id of ids){
  const s=completed(id),d=route(id),r=s.relations[id],before={startedAt:r.startedAt,loveAt:r.loveAt,flags:[...r.flags]};
  for(const n of [17,18,19]){
   age(s,n);assert(d.echoes.every(e=>!R.canEcho(s,d,e)));assert.equal(R.marriageStage(s,d),null);
   assert.equal(TouhouCompanionship.courtship(s,()=>{throw Error('teen adult date');}),null);
   assert.equal(TouhouPartnerLearning.candidate(s),null);assert.equal(TouhouGuidance.candidate(s),null);
  }
  age(s,20);assert(d.echoes.filter(e=>e.romanceEcho).some(e=>R.canEcho(s,d,e)));assert.equal(R.marriageStage(s,d),'proposal');
  assert(TouhouCompanionship.courtship(s,E.record),'the original adult date is available at twenty');
  assert.deepEqual({startedAt:r.startedAt,loveAt:r.loveAt,flags:r.flags},before);assert.equal(s.log.filter(e=>e.relationship?.to==='lover'&&e.relationship.from!=='lover').length,0,'component helpers do not fabricate engine transition records');
  const original=beforeLove(id);original.relations[id].young=false;age(original,19);assert(!R.canLove(original,d,original.relations[id]));age(original,20);assert(R.canLove(original,d,original.relations[id]),'the adult canLove age remains twenty');
 }
 const interrupted=beforeLove();fire(interrupted,common('local-young-meet'));age(interrupted,15);fire(interrupted,common('local-young-familiar'));age(interrupted,16);fire(interrupted,common('local-young-confession'));
 assert.equal(interrupted.firstPartnerId,'local:spouse');const stop=R.select(interrupted,()=>0);assert(stop?.id.endsWith(':interrupted'));fire(interrupted,stop);R.romanceClosure(interrupted,'reimu');assert.equal(interrupted.relations.reimu.next,null);assert.equal(interrupted.relations.reimu.status,'friend');assert(interrupted.relations.reimu.romanceClosed);
 const widow=completed(),p=widow.people.reimu,firstLoveAt=widow.firstLoveAt;p.leaveAt=17.5;E.step(widow,()=>.999);
 assert(!p.alive);assert(widow.log.some(e=>e.id==='farewell-reimu'));assert.equal(widow.relations.reimu.status,'bereaved');assert.equal(widow.relations.reimu.next,null);assert.equal(widow.partnerId,null);assert.equal(widow.firstPartnerId,'reimu');assert.equal(widow.firstLoveAt,firstLoveAt);assert(!R.freePartner(widow));assert(!R.youngEntry(age(structuredClone(widow),11),route('marisa')));assert.throws(()=>R.bindPartner(widow,'marisa'),/已经确立过恋人/);
});

test('a true engine transition and seventeen-year settlement preserve the same factual account for UI and PNG',()=>{
 const s=beforeLove(),d=route('reimu'),r=s.relations.reimu;age(s,15);const key=r.next,branch=d.nodes[key].branches.find(b=>b.status==='lover'),select=R.select;
 // Choose an actual authored event at the ordinary scheduler seam; E.step still
 // performs the annual clock, with-person meeting, effects and transition log.
 R.select=()=>R.branchEvent(d,key,branch);
 try{E.step(s,()=>.999);}finally{R.select=select;}
 assert.equal(s.age,16);assert.equal(s.firstLoveAt,16);assert.equal(s.partnerId,'reimu');
 const love=s.log.find(e=>e.age===16&&e.relationship?.id==='reimu'&&e.relationship.to==='lover'&&e.relationship.from!=='lover');assert(love);assert.equal(love.relationshipMoment.kind,'courtship');assert(!love.developer);
 s.wear=s.vitality;E.step(s,()=>.999);assert(s.ended);assert.equal(s.age,17);assert(!s.married);assert(s.relations.reimu.summary);
 const before=structuredClone(s),engineRandom=E.random,unseeded=Math.random;let account;
 E.random=()=>{throw Error('summary consumed gameplay RNG');};Math.random=()=>{throw Error('summary consumed unseeded RNG');};
 try{account=Summary.compose(s);}finally{E.random=engineRandom;Math.random=unseeded;}
 assert.deepEqual(s,before);assert.equal(account.id,'reimu');assert.equal(account.years,1);assert.equal(account.marriedYears,null);
 assert(account.moments.some(m=>m.id==='relation:reimu:intro'&&m.age===10));assert(account.moments.some(m=>m.id===love.id&&m.age===16));assert(!account.moments.some(m=>/marriage:|courtship:|:echo:/.test(m.id)));
 for(const m of account.moments){assert.equal(m.text,s.log[m.index].text);assert.equal(m.time,s.log[m.index].time);assert.equal(m.age,s.log[m.index].age);}
 const ctx={font:'',measureText(text){return {width:Array.from(text).length*parseFloat(this.font.match(/([\d.]+)px/)[1])};}};
 const pages=TouhouMemoirImage.plan(ctx,{subject:'你的这一生',ending:s.ending,endingText:s.endingText,identity:'17岁 · 普通人',metrics:'定向组件结算',stats:[],talents:[],goal:'随遇而安',goalDescription:'',paragraphs:s.summary.memoir.paragraphs,names:[account.name],companion:account});
 const lines=pages.flatMap(p=>p.rows.filter(r=>r.glyphs).map(r=>r.glyphs.map(g=>g.text).join(''))).join('');assert(lines.includes(account.yearsText));assert(lines.includes(account.outcomeText));for(const m of account.moments)assert(lines.includes(m.time+m.text));
 const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');assert.match(app,/companionAccount=companionSummary\.compose\(life\);renderCompanion\(companionAccount\)/);assert.match(app,/companion:companionAccount,paragraphs:/,'PNG receives the same settlement account');
});
