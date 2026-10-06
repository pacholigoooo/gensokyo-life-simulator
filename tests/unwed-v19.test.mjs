import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const name of ['config','talents','content-data','relationship-data','events','health','opportunities','encounters','spiritual','afterlife','careers','contacts','memoir','relationships','talent-stories','partner-learning','companionship','guidance','akyuu','long-years-data','long-years','engine','companion-summary','memoir-image'])await import('../dist/'+name+'.js');
const E=TouhouEngine,R=TouhouRelationships,C=TouhouCompanionship,Summary=TouhouCompanionSummary,d=TouhouRelationshipData.find(d=>d.id==='reimu');
const event=id=>TouhouEvents.events.find(e=>e.id==='common:'+id);
function age(s,n){s.age=s.turn=s.bodyAge=n;s.phase=n<9?0:n<20?1:n<40?2:n<65?3:4;return s;}
function life(n=20){return age(E.createLife({character:null,seed:42,stats:{health:6,insight:7,bond:6,fortune:1}}),n);}
// Ages/resources are explicit component boundaries. E.step applies each actual
// factory event and writes its actual relationship, effects and life log.
function fire(s,e){
 assert(e&&E.eligible(s,e),e?.id+' eligible');const at=s.age,select=R.select;age(s,at-1);R.select=()=>e;
 try{E.step(s,()=>.999);}finally{R.select=select;}
 assert.equal(s.age,at);const entry=s.log.findLast(e2=>e2.id===e.id);assert(entry,e.id+' applied by the engine');assert(!entry.developer);return entry;
}
function draw(...values){return()=>{assert(values.length,'unexpected additional choice draw');return values.shift();};}
function namedReady(){
 const s=life();assert(TouhouContacts.entryReady(s,d));fire(s,R.introduction(d,s));
 for(let n=0;n<6;n++){const r=s.relations.reimu,key=r.next;age(s,Math.max(s.age+1,R.nodeDueAt(s,d,r)));const b=d.nodes[key].branches.find(b=>R.matches(s,r,b.when)&&(b.status!=='lover'||R.canLove(s,d,r)));assert(b);fire(s,R.branchEvent(d,key,b));}
 const r=s.relations.reimu;assert.equal(r.next,null);assert.equal(r.status,'lover');assert.equal(r.visits,7);assert.equal(s.firstLoveAt,26);assert(s.log.some(e=>e.relationship?.to==='lover'&&e.relationship.from!=='lover'));
 // Isolate the wedding discussion: the optional health-five guidance would
 // otherwise be an older, legitimately preferred candidate at the same age.
 s.stats.health=4;
 age(s,R.marriageDueAt(s,r,'proposal'));assert.equal(R.marriageStage(s,d),'proposal');return s;
}
function localReady(){
 const s=life(18);
 for(const [n,id]of [[18,'local-meet'],[19,'local-familiar'],[20,'courtship'],[21,'local-date-talk'],[22,'local-date-walk']]){age(s,n);fire(s,event(id));}
 age(s,23);assert(E.eligible(s,event('marry')));assert.equal(s.firstLoveAt,20);return s;
}
function namedUnwed(){const s=namedReady();fire(s,R.select(s,draw(0,0)));assert.equal(s.unwedAt,s.age);return s;}
function localUnwed(){const s=localReady();fire(s,TouhouEvents.localRomance(s,draw(0,0)));assert.equal(s.unwedAt,s.age);return s;}
const marriageWords=/婚礼|喜饭|婚后|夫妻|婚约|红纸/;

test('a named pair makes the actual 3.5% proposal choice, blocks all later wedding stages, and remains a loyal interacting pair',()=>{
 assert.equal(TouhouLifeConfig.unwedCompanionshipChance,.035);const s=namedReady(),r=s.relations.reimu,original={firstLoveAt:s.firstLoveAt,startedAt:r.startedAt,loveAt:r.loveAt,visits:r.visits,flags:[...r.flags],person:structuredClone(s.people.reimu)};
 const early=structuredClone(s);age(early,s.age-1);assert.throws(()=>R.unwedEvent(early,d).apply(early),/相伴约定前置/);
 const unwed=R.select(s,draw(0,.035-Number.EPSILON));assert.equal(unwed.id,'relation:reimu:marriage:unwed');assert.match(unwed.text,/两人都愿意/);
 const married=structuredClone(s),proposal=R.select(married,draw(0,.035));assert.equal(proposal.id,'relation:reimu:marriage:proposal');
 const record=fire(s,unwed);assert.equal(record.relationship.from,'lover');assert.equal(record.relationship.to,'lover');assert.equal(record.relationshipMoment,undefined);assert.equal(s.unwedAt,28);assert(!s.married);assert.equal(r.marriage,null);assert.equal(R.partner(s).status,'相恋');
 assert.deepEqual({firstLoveAt:s.firstLoveAt,startedAt:r.startedAt,loveAt:r.loveAt,visits:r.visits,flags:r.flags},{firstLoveAt:original.firstLoveAt,startedAt:original.startedAt,loveAt:original.loveAt,visits:original.visits,flags:original.flags});
 assert.equal(s.people.reimu.metAt,original.person.metAt);assert.equal(s.people.reimu.leaveAt,original.person.leaveAt);assert.equal(r.history.at(-1).text,record.text);
 assert.equal(s.log.filter(e=>e.id.startsWith('relation:reimu:courtship:')).length,1,'the first date occurred through E.step');
 age(s,29);assert.equal(C.courtship(s,()=>{throw Error('a second date invented a marriage agreement');}),null);
 for(const key of ['proposal','planning','wedding']){assert.equal(R.marriageStage(s,d),null);assert.throws(()=>R.marriageEvent(s,d,key).apply(s),/婚事前置/);}
 age(s,30);const echo=d.echoes.find(e=>e.romanceEcho&&R.canEcho(s,d,e));assert(echo,'adult lover echoes remain available after their original two-year gap');age(s,Math.max(s.age,R.echoDueAt(s,d,echo)));const shared=fire(s,R.echoEvent(s,d,echo));assert.equal(shared.relationship.to,'lover');assert.equal(s.unwedAt,28);assert(!s.married);assert(!marriageWords.test(shared.text));
 const before=structuredClone(s);assert.throws(()=>R.bindPartner(s,'marisa'),/已经确立过恋人/);assert.deepEqual(s,before);
 const firstLoveAt=s.firstLoveAt,unwedAt=s.unwedAt;s.people.reimu.leaveAt=s.age+.5;E.step(s,()=>.999);assert(!s.people.reimu.alive);assert(s.log.some(e=>e.id==='farewell-reimu'));assert.equal(s.partnerId,null);assert.equal(s.firstPartnerId,'reimu');assert.equal(s.firstLoveAt,firstLoveAt);assert.equal(s.unwedAt,unwedAt);assert(!R.freePartner(s));assert.throws(()=>R.bindPartner(s,'marisa'),/已经确立过恋人/);
 fire(married,proposal);age(married,R.marriageDueAt(married,married.relations.reimu,'planning'));fire(married,R.marriageEvent(married,d,'planning'));age(married,R.marriageDueAt(married,married.relations.reimu,'wedding'));fire(married,R.marriageEvent(married,d,'wedding'));
 assert(married.married);assert.equal(married.unwedAt,null);assert.equal(married.relations.reimu.marriage.stage,3);assert.equal(R.partner(married).status,'已婚');
});

test('the local pair chooses at the real wedding event, keeps ordinary lover scenes without a fictitious wedding, and retains first-love loyalty',()=>{
 const s=localReady(),firstLoveAt=s.firstLoveAt,p=s.people['local:spouse'],original={metAt:p.metAt,leaveAt:p.leaveAt,ageAtMeet:p.ageAtMeet};
 const early=structuredClone(s);age(early,22);assert(!E.eligible(early,event('unwed-promise')),'an earlier annual walk cannot also decide marriage');
 const unwed=TouhouEvents.localRomance(s,draw(0,.035-Number.EPSILON));assert.equal(unwed.id,'common:unwed-promise');assert.match(unwed.text,/你们.*商量好/);
 const married=structuredClone(s),wedding=TouhouEvents.localRomance(married,draw(0,.035));assert.equal(wedding.id,'common:marry');
 const record=fire(s,unwed);assert.equal(record.relationshipMoment,undefined);assert.equal(s.unwedAt,23);assert(!s.married);assert.equal(s.firstLoveAt,firstLoveAt);assert.equal(R.partner(s).status,'相恋');assert.equal(s.people['local:spouse'],p);assert.deepEqual({metAt:p.metAt,leaveAt:p.leaveAt,ageAtMeet:p.ageAtMeet},original);
 for(const n of [24,40,60]){age(s,n);assert(!E.eligible(s,event('marry')));assert(!E.eligible(s,event('unwed-promise')));}
 const scenes=[];
 for(let n=0;n<8;n++){
  age(s,60+n*2);const entry=C.localMarriage(s,E.record);assert(entry,'the continuing pair has actual shared scene '+n);scenes.push(entry);assert.equal(entry.scene,'村里 · 恋人相伴');assert(!marriageWords.test(entry.text));
 }
 assert(scenes.at(-1).id.startsWith('local:marriage:plan:'));assert.match(scenes.at(-1).text,/恋人.*出门/);assert(!s.married);assert.equal(s.unwedAt,23);
 assert.throws(()=>R.bindPartner(s,'reimu'),/已经确立过恋人/);p.leaveAt=s.age+.5;E.step(s,()=>.999);assert(!p.alive);assert(s.log.some(e=>e.id==='farewell-local:spouse'));assert.equal(s.partnerId,null);assert.equal(s.firstPartnerId,'local:spouse');assert.equal(s.firstLoveAt,firstLoveAt);assert.equal(s.unwedAt,23);assert(!R.freePartner(s));assert(!E.eligible(s,event('courtship')));assert.throws(()=>R.bindPartner(s,'reimu'),/已经确立过恋人/);
 fire(married,wedding);assert(married.married);assert.equal(married.unwedAt,null);assert.equal(R.partner(married).status,'已婚');
});

test('named and local actual settlements retain the choice and factual lover years in the shared UI and PNG account',()=>{
 for(const s of [namedUnwed(),localUnwed()]){
  const id=s.firstPartnerId,key=id==='local:spouse'?'common:unwed-promise':'relation:'+id+':marriage:unwed',choice=s.log.find(e=>e.id===key);assert(choice);s.wear=s.vitality;E.step(s,()=>.999);assert(s.ended);assert(!s.married);
  const before=structuredClone(s),random=E.random,unseeded=Math.random;let account;
  E.random=()=>{throw Error('summary consumed gameplay RNG');};Math.random=()=>{throw Error('summary consumed unseeded RNG');};
  try{account=Summary.compose(s);}finally{E.random=random;Math.random=unseeded;}
  assert.deepEqual(s,before);assert.equal(account.id,id);assert.equal(account.years,s.age-s.firstLoveAt);assert.equal(account.marriedYears,null);assert(!/婚后|梦中结缘/.test(account.yearsText));
  assert(account.moments.some(m=>m.id===key&&m.age===choice.age&&m.text===choice.text));assert(!account.moments.some(m=>m.id==='common:marry'||m.id.endsWith(':marriage:wedding')));
  for(const m of account.moments){assert.equal(m.time,s.log[m.index].time);assert.equal(m.text,s.log[m.index].text);assert.equal(m.age,s.log[m.index].age);}
  const memoir=s.summary.memoir;assert(memoir.facts.some(f=>f.evidence.includes(key)&&f.text.includes('以恋人身份长久相伴')));assert(!memoir.paragraphs.some(t=>/结为夫妻|婚礼|婚后|喜饭/.test(t)));
  const ctx={font:'',measureText(text){return {width:Array.from(text).length*parseFloat(this.font.match(/([\d.]+)px/)[1])};}};
  const pages=TouhouMemoirImage.plan(ctx,{subject:'你的这一生',ending:s.ending,endingText:s.endingText,identity:'普通人',metrics:'定向组件结算',stats:[],talents:[],goal:'随遇而安',goalDescription:'',paragraphs:memoir.paragraphs,names:[account.name],companion:account});
  const lines=pages.flatMap(p=>p.rows.filter(r=>r.glyphs).map(r=>r.glyphs.map(g=>g.text).join(''))).join('');assert(lines.includes(account.yearsText));assert(lines.includes(choice.time+choice.text));assert(lines.includes(account.outcomeText));assert(lines.includes('以恋人身份长久相伴'));
 }
 const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');assert.match(app,/companionAccount=companionSummary\.compose\(life\);renderCompanion\(companionAccount\)/);assert.match(app,/companion:companionAccount,paragraphs:/,'UI and PNG use the same factual settled account');
});
