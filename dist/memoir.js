/* A short account assembled from recorded events, never from unplayed routes. */
(() => {
 const at=age=>Number(age.toFixed(1));
 function compose(s){
  if(s.named){
   const entries=[s.log.find(e=>e.id==='origin'),s.log.find(e=>e.id==='history:anchor'),s.log.find(e=>e.id==='future:opening'),...s.log.filter(e=>e.check),s.log.find(e=>e.ending)];
   const facts=entries.map(e=>({kind:e.ending?'ending':e.chronicle?'canon':'future',text:e.text,evidence:[e.id]}));
   return {paragraphs:[s.character.name+' · 原作回顾',...facts.slice(0,2).map(f=>f.text),'此后岁月 · '+globalThis.TouhouEngine.futureLabel(s),...facts.slice(2).map(f=>f.text)],facts};
  }
  const facts=[],paragraphs=[];
  const happened=id=>s.log.find(e=>e.id===id);
  function fact(kind,text,evidence){facts.push({kind,text,evidence});return text;}
  const opening=[fact('origin',(s.character?`这一生，你是${s.character.name}。`:'')+s.log.find(e=>e.id==='origin').text,['origin'])];
  if(s.character){
   const turning=s.log.filter(e=>e.check).at(-1);
   if(turning)opening.push(fact('personal',turning.text,[turning.id]));
  }else if(s.careerHistory.length){
   const first=s.careerHistory[0];
   opening.push(fact('career',`${at(first.age)}岁起，你做起了${globalThis.TouhouEvents.jobs[first.id]}的营生。`,[first.event]));
   const magic=s.careerHistory.find(c=>c.id==='magic'&&c!==first);
   if(magic)opening.push(fact('career-change',`后来学成的小魔法，成了另一门营生。`,[magic.event]));
  }
  if(happened('common:migrate'))opening.push(fact('move','搬到人里东街以后，你重新认熟了邻里的门。',['common:migrate']));
  if(s.debugUsed)opening.unshift(fact('debug','这是一段调试人生。',s.log.filter(e=>e.developer).map(e=>e.id)));
  paragraphs.push(opening.join(''));
  const ties=[];
  // A surviving friend's recent visit must not displace the lifetime partner's older farewell.
  for(const r of Object.values(s.relations).sort((a,b)=>(Number(b.id===s.firstPartnerId)-Number(a.id===s.firstPartnerId))||(Number(b.status==='lover')-Number(a.status==='lover'))||b.lastAt-a.lastAt).slice(0,3)){
   const p=s.people[r.id],dream=r.medium==='dream',past=r.history.map(h=>h.status),status=['bereaved','parted'].includes(r.status)?r.previousStatus:r.status;
   const core=r.history.filter(h=>!h.key.startsWith('echo:')&&!h.key.startsWith('marriage:')&&!['intro','farewell','remembrance'].includes(h.key)&&(r.marriage?.stage!==3||h.age<r.marriage.marriedAt)).at(-1);
   const firstDream=happened('relation:'+r.id+':intro').contactMedium==='dream';
   let line=`${firstDream?'梦中，你':'你'}与${p.name}在${at(r.startedAt)}岁时相识。`;
   if(core)line+=core.text;
   if(r.marriage?.stage===3)line+=`${dream?'梦里':'后来'}，你们在${at(r.marriage.marriedAt)}岁那年结为夫妻。`;
   if(happened('relation:'+r.id+':marriage:unwed'))line+='两人商量好以恋人身份长久相伴。';
   if(!p.alive)line+=dream?'后来梦路渐远，这段来往留在醒后的记事里。':'后来对方离世，来往成了旧事。';
   else if(status==='reconciled')line+='旧日的隔阂有了缓和。';
   else if(status==='lover'&&(!s.ended||s.deathCause==='chapter'))line+=s.afterlife?'生前相许的心意，随旧名一同留下。':'彼此相许的心意，伴你走到此卷末尾。';
   else if(status==='enemy'&&past.some(x=>['friend','confidant','mentor'].includes(x)))line+='曾经的亲近，终究化作了旧怨。';
   else if(status==='enemy')line+='你们结下了怨。';
   else if(status==='estranged')line+='往后的来往渐渐疏远。';
   ties.push(fact('relationship',line,s.log.filter(e=>e.id.startsWith('relation:'+r.id+':')||e.id==='farewell-'+r.id).map(e=>e.id)));
  }
  if(happened('common:marry')){
   let line='你与一位村民结伴过日子。';
   if(happened('common:child-born'))line+=happened('child-grown')?'孩子渐渐长大，有了自己的生活。':'家中添了孩子，灯下多了一份牵挂。';
   if(s.people['local:spouse'].alive===false)line+='伴侣已经离世，旧日家常留在记忆里。';
   ties.push(fact('family',line,['common:marry',...(happened('common:child-born')?['common:child-born']:[]),...(happened('child-grown')?['child-grown']:[]),...(s.people['local:spouse'].alive===false?['farewell-local:spouse']:[])]));
  }else if(happened('common:courtship')||happened('common:local-young-confession'))ties.push(fact('courtship',s.people['local:spouse'].alive?'你与一位村民互明心意，约好此后常常相见。':'你曾与一位村民相恋，后来对方离世。',[happened('common:local-young-confession')?'common:local-young-confession':'common:courtship',...(s.people['local:spouse'].alive===false?['farewell-local:spouse']:[])]));
  if(!ties.length&&happened('parents-farewell'))ties.push(fact('family-memory','长辈相继离世之后，熟悉的屋里还留着他们的旧物。',['parents-farewell']));
  if(happened('common:unwed-promise'))ties.push(fact('companionship','你们商量好以恋人身份长久相伴。',['common:unwed-promise']));
  if(ties.length)paragraphs.push(ties.join(''));
  const later=[];
  for(const r of Object.values(s.relations))if(r.guidance?.result){
   const result=happened(r.guidance.result.eventId);
   later.push(fact('guidance',result.text,[result.id]));
   const rescue=happened('guidance:'+r.id+':protection-used');
   if(rescue)later.push(fact('protection',rescue.text,[rescue.id]));
  }
  if(s.transformation){
   const t=s.transformation;
   later.push(fact('transformation',`${at(t.age)}岁那年，你成为${({...globalThis.TouhouOpportunities.forms,...globalThis.TouhouAfterlife.forms})[t.kind].label}。`,[t.eventId]));
  }
  for(const failure of s.log.filter(e=>/^chance:.*-(?:1|2)-fail$/.test(e.id)||e.id==='chance:abandoned'))later.push(fact('failed-path',failure.text,[failure.id]));
  if(s.pathHistory.some(p=>p.result==='unfinished'))later.push(fact('unfinished-path','这门修习尚未做完。',s.log.filter(e=>e.id.startsWith('chance:')&&e.id.endsWith('-found')).map(e=>e.id)));
  const stopped=s.log.find(e=>/^magic:shachu:.*:pass$/.test(e.id));
  if(stopped)later.push(fact('ageless','你学成舍虫之术，身体停止成长与老化。',[stopped.id]));
  else if(s.transformation?.kind==='magician')later.push(fact('aging-magic','舍食已经学成，身体仍随着年岁改变。',[s.transformation.eventId]));
  if(s.hermit?.raids.length){
   const survived=s.hermit.raids.filter(r=>r.result!=='lost'&&(r.age<s.age||s.deathCause==='chapter')).length;
   if(survived)later.push(fact('pursuit',`你从${survived}次鬼神追索中生还，此后的修持仍须时时提防。`,s.log.filter(e=>e.id.startsWith('hermit:attack:')||e.id.startsWith('hermit:rescued:')).map(e=>e.id)));
  }
  for(const id of ['legendary:pinnacle','legendary:outside-return','legendary:hifuu-meeting','legendary:faith-offering','akyuu-return:returned','akyuu-return:failed']){const e=happened(id);if(e)later.push(fact('legendary',e.text,[id]));}
  if(later.length)paragraphs.push(later.join(''));
  const closing=[];
  if(happened('common:repay'))closing.push(fact('debt','借下的债终于还清，手头轻了一桩牵挂。',['common:debt','common:repay']));
  else if(s.flags.has('debt'))closing.push(fact('debt','那笔旧债仍未还清。',['common:debt']));
  else if(happened('common:house'))closing.push(fact('home','用积蓄换来的住处，曾替你挡过风雨。',['common:house']));
  else if(happened('common:tools-lost'))closing.push(fact('loss','旧工具曾在途中遗失。',['common:tools-lost']));
  if(s.deathCause==='chapter')closing.push(fact('ending',`这一卷在${globalThis.TouhouEngine.time(s)}暂时合上。${s.endingText}`,['ending']));
  else closing.push(fact('ending',s.character||s.transformation?`${globalThis.TouhouEngine.time(s)}，${s.endingText}`:s.endingText,['ending']));
  paragraphs.push(closing.join(''));
  return {paragraphs,facts};
 }
 globalThis.TouhouMemoir={compose};
})();
