import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stats=['health','insight','bond','fortune'];
const words=(v,label,max=140)=>assert(typeof v==='string'&&v.trim().length>0&&v.length<=max,label+': invalid text');
function effects(fx,label){assert(fx&&typeof fx==='object',label);for(const [k,v]of Object.entries(fx))assert(stats.includes(k)&&Number.isInteger(v)&&Math.abs(v)<=5,label+': invalid effect');}
export async function buildChronicles(characters){
 const files=(await readdir(new URL('data/chronicles/',root))).filter(f=>f.endsWith('.json')).sort();
 const records=(await Promise.all(files.map(f=>readFile(new URL('data/chronicles/'+f,root),'utf8').then(JSON.parse)))).flat();
 assert.equal(records.length,characters.length,'Every named identity needs a reviewed chronicle');
 const seen=new Set(),coverage=[];
 for(const c of records){
  const person=characters.find(p=>p.id===c.id);assert(person&&!seen.has(c.id),'Unknown or duplicate chronicle '+c.id);seen.add(c.id);
  assert(['windows','pc98','hifuu','historical'].includes(c.continuity),c.id+': continuity');
  const sourceIds=new Set();assert(c.sources.length,c.id+': sources');
  for(const q of c.sources){assert(!sourceIds.has(q.id)&&/^[\w:-]+$/.test(q.id),c.id+': source id');sourceIds.add(q.id);for(const key of ['title','url','locator'])words(q[key],c.id+': source '+key,1500);assert(new URL(q.url).protocol==='https:',c.id+': https source');assert(['official','primary-transcript','official-interview','secondary-index'].includes(q.type),c.id+': source type');}
  const refs=(ids,label,required=true)=>{assert(Array.isArray(ids)&&(!required||ids.length),label+': references');ids.forEach(id=>assert(sourceIds.has(id),label+': unknown reference '+id));};
  assert(c.sources.some(q=>q.type!=='secondary-index'),c.id+': primary material needed');
  const a=c.anchor;words(a.label,c.id+': anchor',100);words(a.text,c.id+': anchor text',180);
  assert(['exact','minimum','estimated','unknown','not-applicable'].includes(a.age.kind),c.id+': age kind');words(a.age.label,c.id+': age label',100);refs(a.age.sourceIds,c.id+': age',a.age.kind!=='unknown'&&a.age.kind!=='not-applicable');
  assert(a.age.years===null||Number.isFinite(a.age.years)&&a.age.years>=0,c.id+': age years');
  if(['unknown','not-applicable'].includes(a.age.kind))assert.equal(a.age.years,null,c.id+': unknown age must stay unknown');
  if(a.age.kind==='estimated')assert(/约|估/.test(a.age.label),c.id+': visibly estimated age');
  if(a.realm)assert(['gensokyo','pc98','outside','moon','makai','hell','past','dream'].includes(a.realm),c.id+': anchor realm');
  const historyIds=new Set();assert(c.history.length>=2,c.id+': background and appearance');
  for(const h of c.history){assert(/^[\w:-]+$/.test(h.id)&&!historyIds.has(h.id)&&h.id!=='anchor',c.id+': history id');historyIds.add(h.id);for(const key of ['label','work','text'])words(h[key],c.id+': history '+key,150);assert(['background','event','report'].includes(h.kind),c.id+': history kind');assert(['canon','route-dependent','reported','unknown'].includes(h.certainty),c.id+': certainty');refs(h.sourceIds,c.id+': '+h.id);}
  assert(c.reviewedWorks.length,c.id+': work coverage');
  for(const w of c.reviewedWorks){words(w.work,c.id+': work code',150);words(w.title,c.id+': work title',150);assert(['participant','cameo','mentioned','music-commentary'].includes(w.participation),c.id+': participation');refs(w.sourceIds,c.id+': work sources');assert(Array.isArray(w.historyIds),c.id+': work history');w.historyIds.forEach(id=>assert(historyIds.has(id),c.id+': work history reference'));if(!w.historyIds.length)words(w.note,c.id+': omitted cameo reason',500);}
  const f=c.future;assert(['continuation','legacy','hypothetical'].includes(f.mode),c.id+': future mode');assert(Number.isFinite(f.years)&&f.years>0&&f.years<=100,c.id+': future span');
  for(const k of ['intro','success','bittersweet','failure'])words(f[k],c.id+': future '+k,180);
  words(f.goal.name,c.id+': goal',30);words(f.goal.description,c.id+': goal description',100);
  assert.equal(f.milestones.length,4,c.id+': future milestones');
  for(const [i,m]of f.milestones.entries())if(i===1||i===2){assert(stats.includes(m.check?.stat)&&Number.isInteger(m.check.min)&&m.check.min>=1&&m.check.min<=30,c.id+': future check');for(const k of ['pass','fail']){words(m[k],c.id+': '+k);effects(m[k+'Effects'],c.id+': '+k);}}else{words(m.text,c.id+': milestone');effects(m.effects,c.id+': milestone');}
  const eventIds=new Set(person.events.map(e=>e.id)),overrides=new Set();
  assert.deepEqual([...f.reviewedEventIds].sort(),[...eventIds].sort(),c.id+': every legacy event must be reviewed');
  for(const e of f.eventOverrides){assert(eventIds.has(e.id)&&!overrides.has(e.id),c.id+': override id');overrides.add(e.id);assert(Object.keys(e).every(k=>['id','text','with','remember'].includes(k)),c.id+': only reviewed text and actors may change');words(e.text,c.id+': future event');for(const id of [...e.with||[],...e.remember||[]])assert(characters.some(p=>p.id===id),c.id+': future actor '+id);}
  const changed=new Map(f.eventOverrides.map(e=>[e.id,e]));
  const futureEvents=person.events.map(e=>({...e,...changed.get(e.id)}));
  const met=new Set(futureEvents.flatMap(e=>e.with||[]));
  for(const e of futureEvents)for(const id of e.remember||[])assert(met.has(id),e.id+': remembered person has no meeting in this continuation: '+id);
  person.chronicle=c;
  coverage.push({id:c.id,name:person.name,continuity:c.continuity,history:c.history.length,reviewedWorks:c.reviewedWorks.length,sources:c.sources.length,ageKind:a.age.kind,ageLabel:a.age.label,futureYears:f.years,reviewedEvents:f.reviewedEventIds.length,rewrittenEvents:f.eventOverrides.length,goal:f.goal.name,branches:2,endings:3});
 }
 const certainty={canon:'原作回顾','route-dependent':'原作路线分支',reported:'原作中的记述',unknown:'资料未明'};
 const sourceLinks=(c,ids)=>ids.map(id=>{const q=c.sources.find(q=>q.id===id);return `<a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">${esc(q.title)}</a>（${esc(q.locator)}）`;}).join('；');
 const page=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>人物前史 · 幻想乡一生纪</title><link rel="icon" href="icon.svg"><link rel="stylesheet" href="style.css"><style>main{padding-top:28px;padding-bottom:28px;overflow-wrap:anywhere}article{margin:40px 0;padding-top:18px;border-top:2px solid var(--red)}li{margin:16px 0}small{display:block;font-size:.85rem;line-height:1.7}details{margin:16px 0}summary{cursor:pointer}nav{line-height:2.2}h3{font-size:1.08rem}</style><main><a href="index.html">返回一生纪</a><h1>人物前史</h1><p>已知经历依各作品记录排列，路线结局与人物说法单独注明。年龄未知时保留未知；续篇年数、心愿与结局由本作创作。</p><nav>${characters.map(p=>`<a href="#${esc(p.id)}">${esc(p.name)}</a>`).join('　')}</nav>${characters.map(p=>{const c=p.chronicle;return `<article id="${esc(c.id)}"><h2>${esc(p.name)}</h2><p>${esc(c.continuity==='pc98'?'旧作连续性':c.continuity==='hifuu'?'秘封音乐故事':c.continuity==='historical'?'原作中的历史与记述':'Windows正作与官方出版物')} · ${esc(c.anchor.age.label)}</p><ol>${c.history.map(h=>`<li id="${esc(c.id+'-'+h.id)}"><h3>${esc(h.label)} · ${esc(h.work)}</h3><p>${esc(h.text)}</p><small>${esc(certainty[h.certainty])}${h.note?' · '+esc(h.note):''}<br>${sourceLinks(c,h.sourceIds)}</small></li>`).join('')}</ol><section id="${esc(c.id)}-anchor"><h3>${esc(c.anchor.label)}</h3><p>${esc(c.anchor.text)}</p><small>${esc(c.anchor.age.label)}${c.anchor.age.note?' · '+esc(c.anchor.age.note):''}<br>${sourceLinks(c,c.anchor.age.sourceIds)}</small></section><details><summary>逐作核对 · ${c.reviewedWorks.length}项</summary><ul>${c.reviewedWorks.map(w=>`<li>${esc(w.title)}<small>${esc(w.note||'')}${w.note?'<br>':''}${sourceLinks(c,w.sourceIds)}</small></li>`).join('')}</ul></details><h3>此后岁月 · ${{continuation:'二创续篇',legacy:'二创余响',hypothetical:'二创假设'}[c.future.mode]}</h3><p>${esc(c.future.intro)}</p><p>心愿「${esc(c.future.goal.name)}」：${esc(c.future.goal.description)}</p><small>续写${c.future.years}年，四个人物节点、两处条件分支、三种收束。</small></article>`;}).join('')}</main></html>`;
 await writeFile(new URL('dist/chronicles.html',root),page);
 await mkdir(new URL('reports/chronicles-v15/',root),{recursive:true});
 const report={characters:records.length,historyEvents:coverage.reduce((n,c)=>n+c.history,0),reviewedWorks:coverage.reduce((n,c)=>n+c.reviewedWorks,0),coverage};
 await writeFile(new URL('reports/chronicles-v15/coverage.json',root),JSON.stringify(report,null,2)+'\n');
 return report;
}
