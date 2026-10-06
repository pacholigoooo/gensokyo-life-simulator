/* Personal guidance, finite gifts and one-use preparations. Canon boundaries live in each authored route. */
(() => {
 const data=()=>globalThis.TouhouRelationshipData;
 const workCount=(s,career)=>s.history.filter(id=>/^career:[^:]+:work-/.test(id)&&(!career||id.startsWith('career:'+career+':'))).length;
 function offer(s,ignoreWork=false){
  if(s.character||s.ended||s.afterlife||s.dormant||s.injured||s.pendingCause||s.stats.health<=0||s.body!=='humanoid'||s.realm!=='gensokyo'||!s.partnerId||s.partnerId==='local:spouse'||s.firstPartnerId!==s.partnerId)return null;
  const r=s.relations[s.partnerId],p=s.people[r.id],route=data().find(d=>d.id===r.id),g=route.guidance;
  if(!g||r.status!=='lover'||r.next!==null||!p.alive||p.leaveAt<=s.age||s.age<20)return null;
  const progress=r.guidance;
  if(progress?.completedAt!==undefined){
   return progress.followedUp?null:{r,g,step:g.followup,followup:true,due:progress.completedAt+g.followup.delay};
  }
  if(s.opportunity||s.development||s.careerDevelopment?.transition)return null;
  if(g.species&&!g.species.includes(s.species))return null;
  if(g.grant.kind==='longevity'&&s.species!=='human'&&!globalThis.TouhouSpiritual.agingMagic(s))return null;
  if(g.grant.kind==='training'&&!s.career)return null;
  if(g.grant.kind==='transformation'&&(s.species!=='human'||s.transformation))return null;
  const index=progress?.stage||0,step=g.stages[index],c=step.when;
  if(progress?.workCareer&&s.career!==progress.workCareer)return null;
  if(Object.entries(c.min||{}).some(([k,v])=>s.stats[k]<v)||c.xp!==undefined&&s.xp<c.xp||c.trust!==undefined&&r.trust<c.trust)return null;
  if(!ignoreWork&&c.work&&(!progress||workCount(s,progress.workCareer)-progress.workAt<c.work))return null;
  return {r,g,step,index,due:(progress?progress.lastAt:r.loveAt)+step.delay,followup:false};
 }
 function grant(s,r,g,eventId){
  const gift=g.grant,progress=r.guidance;
  progress.result={kind:gift.kind,age:s.age,eventId};
  if(gift.kind==='longevity'){
   s.vitality+=gift.vitality;s.horizon+=gift.years;
   globalThis.TouhouHealth.strain(s,gift.wear,g.title);
   Object.assign(progress.result,{vitality:gift.vitality,observationYears:gift.years,ageless:false});
  }else if(gift.kind==='training'){
   const d=globalThis.TouhouCareers.init(s);
   s.stats.insight=Math.min(30,s.stats.insight+gift.insight);s.xp+=gift.xp;
   d.practice+=gift.practice;d.stagePractice+=gift.practice;
   d.history.push({id:d.id,stage:d.stage,age:s.age,event:eventId});
   Object.assign(progress.result,{career:d.id,practice:gift.practice,xp:gift.xp});
  }else if(gift.kind==='transformation'){
   globalThis.TouhouEngine.transform(s,gift.species,{eventId});
   Object.assign(progress.result,{species:gift.species,ageless:false});
  }else if(gift.kind==='protection')progress.protection={...gift,usedAt:null};
 }
 function candidate(s){
  const o=offer(s);if(!o)return null;
  const id='guidance:'+o.r.id+':'+o.step.key;
  const eligible=state=>{const current=offer(state);return !!current&&current.r.id===o.r.id&&current.step.key===o.step.key&&state.age>=current.due;};
  return {due:o.due,chance:.3,get:()=>({id,text:o.step.text,effects:o.followup?{}:o.step.effects,xp:o.followup?0:o.step.xp,wear:o.followup?0:o.step.wear,weight:1,repeat:1,with:[o.r.id],scene:o.r.scene,contactMedium:o.r.medium,when:eligible,
   apply:state=>{
    const current=offer(state);
    if(!current||current.r.id!==o.r.id||current.step.key!==o.step.key||state.age<current.due)throw Error('伴侣指引的经历或条件已经改变：'+id);
    const r=current.r;
    if(current.followup){r.guidance.followedUp=true;r.guidance.history.push({id,age:state.age,text:o.step.text});return;}
    r.guidance??={stage:0,lastAt:null,workAt:workCount(state),history:[],followedUp:false};
    if(current.step.operation==='human-magic'){
     state.flags.add('human-magic');state.career='magic';
     const previous=state.careerDevelopment,d=globalThis.TouhouCareers.init(state);
     if(d!==previous)d.history.at(-1).event=id;
     r.guidance.workCareer='magic';r.guidance.workAt=workCount(state,'magic');
    }
    r.guidance.stage++;r.guidance.lastAt=state.age;r.guidance.history.push({id,age:state.age,text:o.step.text});
    if(r.guidance.stage===current.g.stages.length){r.guidance.completedAt=state.age;grant(state,r,current.g,id);}
   }})};
 }
 function protect(s,cause,record){
  if(s.ended||s.afterlife||s.dormant||s.body!=='humanoid'||!['health','pursuit'].includes(cause)||!s.firstPartnerId||s.firstPartnerId==='local:spouse')return false;
  const r=s.relations[s.firstPartnerId],guard=r.guidance?.protection;
  if(!guard||guard.usedAt!==null||guard.cause!==cause)return false;
  const p=s.people[r.id];
  // 自制准备留在主角手中；伴侣当场施救则必须仍相伴且存活，不能让故人继续出场救助。
  if(!guard.selfMade&&(s.partnerId!==r.id||r.status!=='lover'||!p.alive||p.leaveAt<=s.age))return false;
  guard.usedAt=s.age;s.pendingCause=null;
  if(cause==='pursuit')s.hermit.raids.at(-1).result='rescued';
  const id='guidance:'+r.id+':protection-used';
  record(s,id,guard.text,{health:Math.max(0,guard.health-s.stats.health)},{scene:r.scene,...(guard.selfMade?{remember:[r.id]}:{with:[r.id]})});
  s.history.push(id);s.seen[id]=1;s.flags.add('event:'+id);
  return true;
 }
 function needsWork(s){
  const o=offer(s,true),p=o?.r.guidance;
  return !!o&&!o.followup&&!!p&&s.age>=o.due&&!!o.step.when.work&&workCount(s,p.workCareer)-p.workAt<o.step.when.work;
 }
 globalThis.TouhouGuidance={candidate,protect,workCount,needsWork};
})();
