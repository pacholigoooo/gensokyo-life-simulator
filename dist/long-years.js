/* Finite projects in the later years of an ordinary person's transformed life. */
(() => {
 const chains=()=>globalThis.TouhouLongYearsData;
 const kinds=['magician','hermit','shikaisen','youkai','vampire','ghost','vengeful','kami'];
 function init(s){s.longYears={chains:{},lastAt:null,lastTurn:-2,history:[]};}
 function mature(s){return !s.character&&!!s.transformation&&kinds.includes(s.species)&&s.age>=80&&s.age-s.transformation.age>=12;}
 function livingPartner(s,id=s.partnerId){
  if(!id||s.partnerId!==id||s.firstPartnerId!==id)return false;
  const p=s.people[id],r=s.relations[id];
  return !!p&&p.alive&&p.leaveAt>s.age&&p.medium!=='dream'&&(id==='local:spouse'?s.married||s.unwedAt!==null:r?.status==='lover'&&r.medium!=='dream'&&r.next===null);
 }
 function matches(s,rule={}){
  return !Object.entries(rule.min||{}).some(([k,v])=>s.stats[k]<v)&&!Object.entries(rule.max||{}).some(([k,v])=>s.stats[k]>v)&&!(rule.flags||[]).some(f=>!s.flags.has(f))&&!(rule.without||[]).some(f=>s.flags.has(f));
 }
 function available(s,c){
  if(s.age-s.transformation.age<(c.minYears||0)||s.age<(c.minAge||0))return false;
  if(c.species&&!c.species.includes(s.species)||c.careers&&!c.careers.includes(s.career)||c.habitats&&!c.habitats.includes(s.habitat))return false;
  if(c.requires?.some(f=>!s.flags.has(f)))return false;
  if(c.group==='career'&&(!s.careerDevelopment||s.careerDevelopment.stage<2||s.afterlife))return false;
  // Each afterlife has its own physical limits. Shared bodily scenes never cross this boundary.
  if(s.afterlife&&!c.species?.includes(s.species))return false;
  if(c.group==='partner'){
   if(s.afterlife||s.body!=='humanoid'||s.realm!=='gensokyo')return false;
   if(c.bereaved){
    const id=s.firstPartnerId,person=id&&s.people[id],loss=id&&s.log.find(e=>e.id==='farewell-'+id);
    return !!person&&!s.partnerId&&!person.alive&&person.medium!=='dream'&&!!loss&&s.age-loss.age>=6&&loss.age-s.firstLoveAt>=(c.minSharedYears||24);
   }
   if(!livingPartner(s)||s.age-s.firstLoveAt<(c.minSharedYears||24)||c.partnerIds&&!c.partnerIds.includes(s.partnerId))return false;
   const person=globalThis.TouhouContent.find(p=>p.id===s.partnerId);
   if(person&&(person.body!=='humanoid'||person.animalMind||c.needsFreedom&&person.confined))return false;
  }
  return true;
 }
 function replaceable(s,event){
  if(!event)return !!s.afterlife;
  if(s.afterlife)return false;
  // Ongoing courtship, wedding, learning and dangerous checks retain their original slots.
  // Only familiar daily scenes can make room for a new later-life project.
  const routine=event.id.startsWith('common:')&&event.repeat>1&&!event.localRomance||event.id.startsWith('changed:')||/:marriage:daily:|:echo:/.test(event.id)||/^career:[^:]+:work-\d+:/.test(event.id)||event.id.startsWith('circle:');
  if(!routine)return false;
  // New wording belongs to the same familiar routine for project scheduling.
  const text=event.freshText??event.text,body=typeof text==='function'?text(s):text;
  return s.log.some(e=>e.text===body);
 }
 function resources(s,values){
  for(const [key,value]of Object.entries(values||{})){
   if(['faith','cohesion','resentment'].includes(key)){
    const a=s.afterlife,limit=key==='faith'?30:24;
    a[key]=Math.max(0,Math.min(limit,a[key]+value));
   }else if(key==='practice'){s.careerDevelopment.practice+=value;s.careerDevelopment.stagePractice+=value;}
   else s.careerDevelopment[key]+=value;
  }
 }
 function scene(s,c,progress){
  const index=progress?.next||0,stage=c.stages[index],choice=stage.branches?.find(b=>matches(s,b.when))||stage;
  const partnerId=progress?.partnerId||(c.group==='partner'?(c.bereaved?s.firstPartnerId:s.partnerId):null);
  const body=choice.text.replaceAll('{partner}',partnerId?s.people[partnerId].name:'');
  return {id:'development:long-'+c.id+'-'+index,text:body,effects:choice.effects||{},xp:choice.xp||0,wear:choice.wear||0,weight:1,repeat:1,scene:'积年续事 · '+c.title,
   set:choice.set,clear:choice.clear,sharedWith:c.group==='partner'&&!c.bereaved?partnerId:undefined,
   developmentMoment:index===c.stages.length-1?{kind:'long-years',major:true,status:'积年新篇',title:c.title,impact:body}:undefined,
   apply:state=>{
    const current=state.longYears.chains[c.id]||{next:0,startedAt:state.age,lastAt:state.age,partnerId,done:false};
    resources(state,choice.resources);current.next++;current.lastAt=state.age;current.done=current.next===c.stages.length;
    state.longYears.chains[c.id]=current;state.longYears.lastAt=state.age;state.longYears.lastTurn=state.turn;
    state.longYears.history.push({chain:c.id,stage:index,age:state.age,partnerId,done:current.done});
   }};
 }
 function interrupted(s,c,progress){
  return {id:'development:long-'+c.id+'-interrupted',text:c.interruptedText||'营生与住处有了变化，你收好这段未完的记录，暂时停下'+c.title+'的打算。',effects:{},weight:1,repeat:1,scene:'积年续事 · '+c.title,
   apply:state=>{progress.done=true;progress.interrupted=true;progress.lastAt=state.age;state.longYears.lastAt=state.age;state.longYears.lastTurn=state.turn;state.longYears.history.push({chain:c.id,stage:'interrupted',age:state.age,partnerId:progress.partnerId,done:true});}};
 }
 function select(s,event){
  if(!mature(s)||s.ended||s.dormant||s.injured||s.pendingCause||s.stats.health<=4||globalThis.TouhouAfterlife.ending(s)||!replaceable(s,event))return null;
  const state=s.longYears;
  if(s.turn-state.lastTurn<2||state.lastAt!==null&&s.age-state.lastAt<4)return null;
  const active=chains().filter(c=>state.chains[c.id]&&!state.chains[c.id].done);
  for(const c of active){const progress=state.chains[c.id];if(c.group==='partner'&&!c.bereaved&&!livingPartner(s,progress.partnerId)||c.careers&&!c.careers.includes(s.career)||c.habitats&&!c.habitats.includes(s.habitat))return interrupted(s,c,progress);}
  const continuing=active.filter(c=>available(s,c)&&s.age-state.chains[c.id].lastAt>=c.stages[state.chains[c.id].next].delay);
  if(continuing.length){continuing.sort((a,b)=>state.chains[a.id].lastAt-state.chains[b.id].lastAt);return scene(s,continuing[0],state.chains[continuing[0].id]);}
  if(active.length>=2)return null;
  const pool=chains().filter(c=>!state.chains[c.id]&&available(s,c)&&!active.some(a=>(a.group==='partner')===(c.group==='partner')));
  if(!pool.length)return null;
  // The project draw does not consume the relationship selector's random stream.
  const rng=globalThis.TouhouEngine.random(s.seed^Math.imul(s.turn,0x45d9f3b));
  const personal=pool.filter(c=>c.partnerIds||c.requires?.some(f=>f.startsWith('talent-story:')));
  const choices=personal.length&&rng()<.65?personal:pool;
  return scene(s,choices[Math.floor(rng()*choices.length)]);
 }
 globalThis.TouhouLongYears={init,mature,livingPartner,matches,available,replaceable,select};
})();
