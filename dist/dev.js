/* A single queued event uses the same event factories and effects as normal play. */
(() => {
 const E=globalThis.TouhouEngine,R=globalThis.TouhouRelationships,O=globalThis.TouhouOpportunities,S=globalThis.TouhouSpiritual,C=globalThis.TouhouContacts;
 const names=Object.fromEntries(globalThis.TouhouContent.map(c=>[c.id,c.name]));
 const categories={contact:'场景通路',gate:'人物引见',intro:'关系初识',branch:'关系节点与转折',echo:'关系回响',marriage:'婚事与婚后',chance:'种族机遇',hermit:'仙人追索',magic:'魔法成长',talent:'稀有与传说天赋'};
 const species={human:'人类',youkai:'妖怪',hermit:'仙人',magician:'魔法使',vampire:'吸血鬼'};
 const habitats={village:'人里',outskirts:'村外',forest:'森林',mountain:'山间',mansion:'洋馆'};
 const labels={...E.LABELS,xp:'历练'};
 const catalogue=[];
 for(const [domain,d]of Object.entries(C.domains))if(d.text)catalogue.push({id:'contact:'+domain,type:'contact',domain,title:d.label,chain:'场景通路',text:d.text});
 for(const route of globalThis.TouhouRelationshipData){
  const common={route,character:route.id,chain:names[route.id]+' · '+route.title};
  if(route.romanceGate?.transition)catalogue.push({...common,id:'contact-person:'+route.id,type:'gate',title:route.romanceGate.label,text:route.romanceGate.text});
  catalogue.push({...common,id:'relation:'+route.id+':intro',type:'intro',title:route.intro.label,text:route.intro.text});
  for(const [node,n]of Object.entries(route.nodes))for(const branch of n.branches)catalogue.push({...common,id:'relation:'+route.id+':'+node+':'+branch.key,type:'branch',node,branch,title:branch.label,text:branch.text});
  if(route.marriage){
   for(const stage of ['proposal','planning','wedding'])catalogue.push({...common,id:'relation:'+route.id+':marriage:'+stage,type:'marriage',stage,title:{proposal:'商议婚事',planning:'筹备婚礼',wedding:'结为夫妻'}[stage],text:route.marriage[stage]});
   for(const daily of route.marriage.daily)catalogue.push({...common,id:'relation:'+route.id+':marriage:daily:'+daily.key,type:'marriage',stage:'daily',daily,title:'婚后 · '+daily.text.slice(0,14),text:daily.text});
  }
  for(const echo of route.echoes)catalogue.push({...common,id:'relation:'+route.id+':echo:'+echo.key,type:'echo',echo,title:'回响 · '+echo.text.slice(0,16),text:echo.text});
 }
 for(const event of [...O.starts,...O.events]){const d=event.dev;catalogue.push({id:event.id,type:'chance',event,title:d.start?'发现机遇':`第${d.stage}次修习 · ${d.passed?'成功':'失败'}`,chain:O.forms[d.kind].label+'之路',text:event.text});}
 for(const event of TouhouTalentStories.list){const t=TouhouTalents.list.find(t=>t.id===event.talent);catalogue.push({id:event.id,type:'talent',event,title:event.label,chain:t.name,text:typeof event.text==='string'?event.text:'依当前身份展开的天赋经历。'});}
 const spiritual=[['hermit:attained','hermit','修持延寿'],['hermit:warning','hermit','追索预警'],['hermit:prepare','hermit','准备应战与退路'],['hermit:attack:repelled','hermit','追索 · 击退','repelled'],['hermit:attack:escaped','hermit','追索 · 脱身','escaped'],['hermit:attack:wounded','hermit','追索 · 重伤','wounded'],['hermit:attack:lost','hermit','追索 · 致命伤','lost'],['magic:learned-species','magic','学成舍食'],['magic:shachu:pass','magic','舍虫 · 成功',true],['magic:shachu:fail','magic','舍虫 · 失败',false]];
 for(const [id,type,title,outcome]of spiritual)catalogue.push({id,type,title,outcome,chain:categories[type],text:type==='hermit'?'修持、预警、准备与追索按当前人生阶段展开。':'人类魔法、舍食与停止老化分别记录。'});
 const byId=new Map(catalogue.map(item=>[item.id,item]));
 function previewText(s,item){
  if(item.type==='intro')return R.introduction(item.route,s).text;
  const r=item.character&&s.relations[item.character],scene=item.daily||(item.echo?.romanceEcho?item.echo:null);
  return r&&r.loveAt!==null&&scene?globalThis.TouhouCompanionship.text(s,r,scene):item.text;
 }
 function get(id){const item=byId.get(id);if(!item)throw Error('找不到这个开发者事件。');return item;}
 function values(s,key){return key==='xp'?s.xp:s.stats[key];}
 function conditionLines(c){
  const a=[];
  for(const [k,v]of Object.entries(c.min||{}))a.push(`${labels[k]}≥${v}`);
  for(const [k,v]of Object.entries(c.max||{}))a.push(`${labels[k]}≤${v}`);
  if(c.minAge!==undefined)a.push(`至少${c.minAge}岁`);if(c.maxAge!==undefined)a.push(`至多${c.maxAge}岁`);
  if(c.habitats)a.push('居处：'+c.habitats.map(k=>habitats[k]).join('/'));
  if(c.species)a.push('种族：'+c.species.map(k=>species[k]).join('/'));
  if(c.careers)a.push('营生：'+c.careers.map(k=>TouhouEvents.jobs[k]).join('/')+(c.training?.career?'，或已完成对应工余练习':''));
  if(c.talentsAny)a.push('天赋其一：'+c.talentsAny.map(k=>TouhouTalents.list.find(t=>t.id===k).name).join('/')+(c.training?.talent?'，或已完成对应后天修习':''));
  if(c.minTrust!==undefined)a.push('信任≥'+c.minTrust);if(c.maxTrust!==undefined)a.push('信任≤'+c.maxTrust);
  if(c.minVisits!==undefined)a.push('往来≥'+c.minVisits+'次');if(c.minYears!==undefined)a.push('相识≥'+c.minYears+'年');
  if(c.freePartner)a.push('这一生尚未确立恋人');
  return a;
 }
 function flagName(route,flag){for(const n of Object.values(route.nodes))for(const b of n.branches)if(b.set?.includes(flag))return b.label;return flag;}
 function conditions(s,r,c,route){
  const a=[];for(const [key,value]of Object.entries(c.min||{}))if(s.stats[key]<value)a.push(`${labels[key]}需≥${value}，当前${s.stats[key]}`);
  for(const [key,value]of Object.entries(c.max||{}))if(s.stats[key]>value)a.push(`${labels[key]}需≤${value}，当前${s.stats[key]}`);
  if(c.minAge!==undefined&&s.age<c.minAge)a.push(`需成长至${c.minAge}岁，当前${E.time(s)}`);
  if(c.maxAge!==undefined&&s.age>c.maxAge)a.push(`已过${c.maxAge}岁的相遇时段`);
  for(const [key,current]of [['habitats',s.habitat],['species',s.species],['careers',s.career]])if(c[key]&&!c[key].includes(current)&&!(key==='careers'&&s.flags.has(c.training?.career)))a.push(conditionLines({[key]:c[key],training:c.training})[0]);
  if(c.talentsAny&&!c.talentsAny.some(k=>s.talents.includes(k))&&!s.flags.has(c.training?.talent))a.push(conditionLines({talentsAny:c.talentsAny,training:c.training})[0]);
  for(const f of c.flags||[])if(!s.flags.has(f))a.push('需经历：'+f);
  for(const f of c.missingFlags||[])if(s.flags.has(f))a.push('已有经历与此分支冲突：'+f);
  for(const f of c.relationFlags||[])if(!r.flags.includes(f))a.push('需先经历：'+flagName(route,f));
  for(const f of c.missingRelationFlags||[])if(r.flags.includes(f))a.push('前史已走向：'+flagName(route,f));
  if(c.minTrust!==undefined&&r.trust<c.minTrust)a.push(`信任需≥${c.minTrust}，当前${r.trust}`);
  if(c.maxTrust!==undefined&&r.trust>c.maxTrust)a.push(`信任需≤${c.maxTrust}，当前${r.trust}`);
  if(c.minVisits!==undefined&&r.visits<c.minVisits)a.push(`需往来${c.minVisits}次，当前${r.visits}次`);
  if(c.minYears!==undefined&&s.age-r.startedAt<c.minYears)a.push(`需相识满${c.minYears}年`);
  if(c.freePartner&&!R.freePartner(s))a.push('这一生已经确立过恋人');
  return a;
 }
 function spiritualEvent(s,item,rng){const forced=item.type==='hermit'?{attack:item.outcome}:{study:item.outcome};return S.select(s,rng,forced);}
 function spiritualMatch(event,item){return !!event&&(item.id===event.id||event.id.startsWith(item.id+':')||item.id.startsWith('hermit:attack:')&&event.id.startsWith('hermit:attack:')&&event.id.endsWith(':'+item.outcome)||item.id.startsWith('magic:shachu:')&&event.id.startsWith('magic:shachu:')&&event.id.endsWith(item.outcome?':pass':':fail'));}
 function inspect(s,id){
  const item=get(id),reasons=[],rules=[];
  if(s.named)return {ready:false,reasons:['具名人物按前史与个人续篇推进。'],rules:[]};
  if(globalThis.TouhouAkyuu.pending(s))reasons.push('先自然推进阿求的归途');
  if(s.ended)reasons.push('这一生已结算，请重开一生');
  if(s.afterlife||s.dormant)reasons.push('当前处于身后生活或寄物沉眠，请自然推进本阶段');
  if(s.dev?.waitingSpiritual&&!['hermit','magic'].includes(item.type))reasons.push('先处理当前的修持或追索阶段');
  if(item.route){
   const route=item.route,r=s.relations[route.id],person=s.people[route.id];
   if(s.character||s.realm!=='gensokyo')reasons.push('关系篇从幻想乡普通出身的人生展开');
   if(person&&(person.alive===false||person.leaveAt<=s.age))reasons.push(route.contact.domain.includes('dream')?'这段梦路已到告别时刻':'对方的本局生命已经结束');
   if(item.type==='gate'){
    rules.push('已取得对应地点通路，尚未完成这次引见',...conditionLines(route.entry));
    if(!C.gateAvailable(s,route))reasons.push('需满足人物通路、成年、在世及尚未确立伴侣的条件');
   }else if(item.type==='intro'){
    rules.push(...conditionLines(route.entry),'同时推进至多'+R.maxActive+'段人物主线');
    if(r)reasons.push('已经相识');
    if(route.romance&&!route.romanceStart&&!C.gateReady(s,route))reasons.push('先完成人物引见：'+route.romanceGate.label);
    if(s.age<R.introductionDueAt(s))reasons.push('下一次新相识需自然推进至'+R.introductionDueAt(s)+'岁');
    if(R.activeCount(s)>=R.maxActive)reasons.push('已有'+R.maxActive+'段人物主线正在推进');
    if(!C.canMeet(s,route)&&!R.canStartRomance(s,route))reasons.push('先触发通路：'+C.domains[route.contact.domain].label+(route.romanceContact?'或'+C.domains[route.romanceContact.domain].label:''));
    if(!C.entryReady(s,route))reasons.push(...conditions(s,null,route.entry,route));
   }else if(!r)reasons.push('先与'+names[route.id]+'相识');
   else if(item.type==='branch'){
    if(r.romancePath&&r.status!=='lover'&&!R.freePartner(s))reasons.push('这一生已确立过恋人，下一次来往会继续以朋友相处');
    const n=route.nodes[item.node];if(item.branch.status==='lover'&&!R.canLove(s,route,r))reasons.push('恋爱需满20岁、相识6年、往来4次、信任4且这一生尚未确立恋人，并属于已开放的恋爱人物');rules.push('当前节点：'+item.node,`距上次往来${n.delay}年`,...conditionLines(item.branch.when));
    for(const f of item.branch.when.relationFlags||[])rules.push('前史：'+flagName(route,f));
    if(r.next!==item.node)reasons.push(r.next===null?'这条关系主线已结束':'当前节点为'+r.next+'，需沿前史推进');
    if(s.age-r.lastAt<n.delay)reasons.push(`还需自然推进${Number((n.delay-s.age+r.lastAt).toFixed(1))}年`);
    reasons.push(...conditions(s,r,item.branch.when,route));
    if(item.branch.status==='lover'&&route.id==='akyuu'&&globalThis.TouhouAkyuu.age(s)<18)reasons.push('阿求自身需满18岁');
    if(R.matches(s,r,item.branch.when)){const first=n.branches.find(b=>R.matches(s,r,b.when)&&(b.status!=='lover'||R.canLove(s,route,r)));if(first!==item.branch)reasons.push('当前条件优先走向：'+first.label);}
   }else if(item.type==='marriage'){
    const stage=R.marriageStage(s,route);rules.push('当前唯一恋人','本人主线完成','成年且双方仍可相见','信任≥4',item.stage==='proposal'?(stage?'相恋至少'+Math.max(r.loveDelay,R.pace(s,r).courtship)+'年':'满足婚事前置后依寿程安排'):item.stage==='daily'?'婚礼已完成，日常轮流出现':(stage?'上段婚事至少过去'+R.pace(s,r).ceremony+'年':'满足婚事前置后依寿程安排'));
    if(stage!==item.stage)reasons.push(stage?'当前婚事阶段：'+{proposal:'商议婚事',planning:'筹备婚礼',wedding:'举行婚礼',daily:'婚后相伴'}[stage]:'尚未满足婚事前置');
    if(stage===item.stage){const due=stage==='daily'?R.dailyDueAt(s,r,item.daily):R.marriageDueAt(s,r,stage);if(s.age<due)reasons.push('需自然推进至'+due+'岁');if(stage==='daily'&&s.age-r.lastAt<2)reasons.push('距上次相伴需满2年');if(stage==='daily'&&r.marriage.lastDaily===item.daily.key)reasons.push('先经历另一段婚后日常');if(stage==='daily'&&!globalThis.TouhouCompanionship.fresh(s,r,globalThis.TouhouCompanionship.text(s,r,item.daily)))reasons.push('这段日常尚在冷却');}
   }else{
    if(r.romancePath&&!item.echo.romanceEcho)reasons.push('这条回响属于另一段共同经历');
    if(r.status==='lover'&&s.partnerId!==route.id)reasons.push('当前恋人已改变');
    const ongoing=r.status==='lover'&&route.marriage,interval=R.echoDelay(r,item.echo);rules.push('关系主线结束',ongoing?'伴侣日常轮流出现':'距上次往来'+interval+'年',ongoing?'同一段日常依双方寿程安排':'每条回响至多两次','关系：'+item.echo.states.map(k=>R.labels[k]).join('/'),...conditionLines(item.echo.when||{}));
    if(r.next!==null)reasons.push('先走完这条关系的主线');
    if(!item.echo.states.includes(r.status))reasons.push('需关系状态：'+item.echo.states.map(k=>R.labels[k]).join('/'));
    if(s.body==='humanoid'&&!s.afterlife&&!s.dormant&&s.age<R.echoDueAt(s,route,item.echo))reasons.push('需自然推进至'+R.echoDueAt(s,route,item.echo)+'岁');
    if(ongoing&&s.age-r.lastAt<2)reasons.push('距上次相伴需满2年');
    if(ongoing?r.lastEchoKey===item.echo.key:(r.echoes[item.echo.key]||0)>=2)reasons.push(ongoing?'先经历另一段伴侣日常':'这条回响已出现两次');
    if(s.body!=='humanoid')reasons.push('当前形态不适合这段相处');
    reasons.push(...conditions(s,r,item.echo.when||{},route));
    if(ongoing&&!globalThis.TouhouCompanionship.fresh(s,r,globalThis.TouhouCompanionship.text(s,r,item.echo)))reasons.push('这段日常尚在冷却');
   }
  }else if(item.type==='contact'){
   const d=C.domains[item.domain];rules.push('成年普通出身',...conditionLines(d),'历练≥'+(d.xp||0));
   if(s.character||s.realm!=='gensokyo')reasons.push('通路从幻想乡普通出身的人生展开');
   if(s.age<18)reasons.push('需成长至18岁');
   if(s.flags.has(item.id))reasons.push('已经获得这条通路');
   reasons.push(...conditions(s,null,d,null));if(s.xp<(d.xp||0))reasons.push('历练需≥'+d.xp);
   if(!TouhouRelationshipData.some(r=>(r.contact.domain===item.domain||r.romanceContact?.domain===item.domain&&R.freePartner(s))&&!s.relations[r.id]&&s.people[r.id]?.alive!==false&&C.entryReady(s,r)))reasons.push('当前属性、天赋或种族尚不符合该处人物的相遇条件');
  }else if(item.type==='chance'){
   const e=item.event,d=e.dev;rules.push('普通出身的人类',...conditionLines(e));
   if(s.character||s.species!=='human'||s.transformation)reasons.push('需普通出身、尚待转化的人类');
   if(d.start){
    if(s.opportunity)reasons.push('正在经历'+O.forms[s.opportunity.kind].label+'之路');
    if(s.development)reasons.push('正在经历'+E.forms[s.development.kind].label+'之路');
    if(s.opportunityAttempts>=2)reasons.push('本局的两次机遇尝试已用完');
    if(s.failedPaths.includes(d.kind))reasons.push('这条机遇已失败收束');
   }else{
    rules.push(`先到第${d.stage}次修习`, `修习间隔${d.delay}年`, ...Object.entries(d.thresholds).map(([k,v])=>labels[k]+'≥'+v),d.passed?'全部门槛达成':'至少一项门槛未达成');
    if(s.opportunity?.kind!==d.kind||s.opportunity?.stage!==d.stage)reasons.push('先推进'+O.forms[d.kind].label+'之路至第'+d.stage+'次修习');
    else if(s.age-s.opportunity.since<d.delay)reasons.push('修习还需自然推进'+Number((d.delay-s.age+s.opportunity.since).toFixed(1))+'年');
    const failed=Object.entries(d.thresholds).filter(([k,v])=>values(s,k)<v);
    if(d.passed)for(const[k,v]of failed)reasons.push(labels[k]+'需≥'+v+'，当前'+values(s,k));
    else if(!failed.length)reasons.push('当前全部门槛达成，会走成功分支');
   }
   reasons.push(...conditions(s,null,e,null));
   if((s.seen[e.id]||0)>=(e.repeat||1))reasons.push('这项经历已经发生');
   if(s.history.slice(-10).includes(e.id))reasons.push('这项经历刚刚发生过');
  }else if(item.type==='talent'){
   const e=item.event;rules.push(...e.conditions,...conditionLines(e));if(e.phases){rules.push('人生阶段：'+E.PHASES.slice(e.phases[0],e.phases[1]+1).join('/'));if(s.phase<e.phases[0]||s.phase>e.phases[1])reasons.push('需先到适合的成长阶段，当前为'+E.PHASES[s.phase]);}if(e.devMinXp!==undefined){rules.push('历练≥'+e.devMinXp);if(s.xp<e.devMinXp)reasons.push('历练需≥'+e.devMinXp+'，当前'+s.xp);}if(!s.talents.includes(e.talent))reasons.push('需天赋：'+TouhouTalents.list.find(t=>t.id===e.talent).name);reasons.push(...conditions(s,null,e,null));for(const f of e.requires||[])if(!s.flags.has(f))reasons.push('需先经历：'+(byId.get(f.replace(/^event:/,''))?.title||f));for(const f of e.excludes||[])if(s.flags.has(f))reasons.push('前史已走向另一分支');if((s.seen[e.id]||0)>=(e.repeat||1))reasons.push('本局已经经历过这项事件');if(s.history.slice(-10).includes(e.id))reasons.push('这项经历刚刚发生过');if(!E.eligible(s,e)&&!reasons.length)reasons.push(...e.conditions);
  }else{
   const candidate=spiritualEvent(s,item,()=>.5),h=s.hermit,m=s.magic;
   if(item.type==='hermit'){
    rules.push(item.id==='hermit:attained'?'青娥、神子或布都到第18步':'已有仙人修持');
    if(item.id==='hermit:attained'){if(!['seiga','miko','futo'].includes(s.character?.id))reasons.push('此事件属于青娥、神子或布都的原有修持');if(h)reasons.push('已经开始仙人修持');if(s.turn<18)reasons.push('需自然推进至第18步');}
    else if(!h)reasons.push('先通过仙人机遇或人物修持成为仙人');
    else if(item.id==='hermit:warning'){rules.push('距追索至多12年');if(h.warned)reasons.push('本次预警已发生');if(s.age<h.nextAttackAt-12)reasons.push('预警尚需'+Number((h.nextAttackAt-12-s.age).toFixed(1))+'年');}
    else if(item.id==='hermit:prepare'){rules.push('已预警且尚待准备');if(!h.warned)reasons.push('先触发追索预警');if(h.preparationTried)reasons.push('本次准备已经尝试');if(s.age>=h.nextAttackAt)reasons.push('追索已经到来');}
    else{if(item.outcome==='repelled'){rules.push('未受伤、体魄≥8、悟性≥8、历练≥8');if(s.injured||s.stats.health<8||s.stats.insight<8||s.xp<8)reasons.push('当前修为或伤势不足以击退追索者');}rules.push('已到追索时刻');if(!h.warned)reasons.push('先触发追索预警');if(s.age<h.nextAttackAt)reasons.push('追索尚需'+Number((h.nextAttackAt-s.age).toFixed(1))+'年');}
   }else{
    rules.push(item.id==='magic:learned-species'?'白莲原有的人类修习阶段':'天生或后天魔法使，身体仍在老化');
    if(item.id==='magic:learned-species'){if(m?.origin!=='learned'||m.stage!=='human')reasons.push('需白莲原有的人类修习阶段');if(s.turn<18)reasons.push('需自然推进至第18步');}
    else{
     if(!m||!['born','learned'].includes(m.origin))reasons.push('先学成舍食，或从天生魔法使人生进入');
     else if(m.ageless)reasons.push('已经学成舍虫');
     else if(m.nextStudyAt===null)reasons.push('先完成当前魔法修习阶段');
     else if(s.age<m.nextStudyAt)reasons.push('下次研习尚需'+Number((m.nextStudyAt-s.age).toFixed(1))+'年');
     if(item.outcome===true){rules.push('悟性≥10','历练≥7');if(s.stats.insight<10)reasons.push('悟性需≥10');if(s.xp<7)reasons.push('历练需≥7');}
    }
   }
   if(!reasons.length&&!spiritualMatch(candidate,item))reasons.push('需先处理当前的'+(candidate?.id.startsWith('hermit:')?'追索阶段':'修习阶段'));
  }
  return {ready:reasons.length===0,reasons:[...new Set(reasons)],rules:[...new Set(rules)]};
 }
 function enable(s,value){if(value&&s.ended)throw Error('这一生已结算，请重开一生。');if(!s.dev)s.dev={enabled:false,pending:null,message:'',pauseRequested:false};s.dev.enabled=value;s.dev.pending=null;s.dev.message='';s.dev.pauseRequested=false;}
 function active(s){if(!s.dev?.enabled)throw Error('请先启用开发者模式。');if(s.ended)throw Error('这一生已结算，请重开一生。');}
 function queue(s,id){active(s);const state=inspect(s,id);if(!state.ready)throw Error(state.reasons.join('；'));s.dev.pending=id;s.dev.message='下一步：'+get(id).title;}
 function cancel(s){if(s.dev){s.dev.pending=null;s.dev.message='已取消待触发事件。';}}
 function consume(s,rng){
  const id=s.dev.pending;s.dev.pending=null;s.dev.pauseRequested=true;
  const state=inspect(s,id);if(!state.ready){s.dev.message='本次触发已停止：'+state.reasons.join('；');return null;}
  const item=get(id);s.debugUsed=true;s.dev.message='已触发：'+item.chain+' · '+item.title;
  if(item.type==='gate')return C.gateEvent(item.route);
  if(item.type==='intro')return R.introduction(item.route,s);
  if(item.type==='branch')return R.branchEvent(item.route,item.node,item.branch);
  if(item.type==='echo')return R.echoEvent(s,item.route,item.echo);
  if(item.type==='marriage')return item.stage==='daily'?R.marriageDailyEvent(s,item.route,item.daily):R.marriageEvent(s,item.route,item.stage);
  if(item.type==='contact')return C.eventFor(item.domain);
  if(['chance','talent'].includes(item.type))return item.event;
  return spiritualEvent(s,item,rng);
 }
 function plan(s,id){
  active(s);const item=get(id),initial=inspect(s,id);if(initial.ready)return {id,changes:[],ready:true,reasons:[]};
  const thresholds=item.type==='marriage'?[]:item.type==='branch'?item.route.nodes[item.node].branches.map(b=>b.when):['intro','gate'].includes(item.type)?[item.route.entry]:item.type==='echo'?[item.echo.when||{}]:item.type==='contact'?[C.domains[item.domain],{min:{xp:C.domains[item.domain].xp||0}},...TouhouRelationshipData.filter(r=>r.contact.domain===item.domain||r.romanceContact?.domain===item.domain).map(r=>r.entry)]:item.type==='talent'?[item.event,{min:{xp:item.event.devMinXp||0}}]:item.type==='chance'?[item.event,{min:item.event.dev.thresholds||{}}]:[{min:{insight:10,xp:7}}];
  const keys=[...E.STATS,'xp'],options=keys.map(k=>{const set=new Set([values(s,k)]);for(const c of thresholds)for(const bound of ['min','max'])if(c[bound]?.[k]!==undefined){const v=c[bound][k];for(const n of [v-1,v,v+1])if(n>=(k==='health'?1:0)&&(k==='xp'||n<=30))set.add(n);}return [...set].sort((a,b)=>Math.abs(a-values(s,k))-Math.abs(b-values(s,k)));});
  const copy={...s,stats:{...s.stats}},chosen={};let best=null,bestCost=Infinity;
  function search(index,cost){if(cost>=bestCost)return;if(index===keys.length){if(inspect(copy,id).ready){best={...chosen};bestCost=cost;}return;}const k=keys[index];for(const v of options[index]){chosen[k]=v;if(k==='xp')copy.xp=v;else copy.stats[k]=v;search(index+1,cost+Math.abs(v-values(s,k)));}}
  search(0,0);
  const changes=best?keys.filter(k=>best[k]!==values(s,k)).map(key=>({key,label:labels[key],from:values(s,key),to:best[key]})):[];
  return {id,changes,ready:!!best,reasons:best?[]:initial.reasons};
 }
 function prepare(s,preview){
  active(s);const current=plan(s,preview.id);if(!current.ready||JSON.stringify(current.changes)!==JSON.stringify(preview.changes))throw Error('当前状态已变化，请重新预览前置调整。');
  if(!current.changes.length)return;
  s.debugUsed=true;const effects={};for(const c of current.changes)if(c.key==='xp')s.xp=c.to;else effects[c.key]=c.to-c.from;
  E.record(s,'developer:prepare:'+s.log.length,'开发者准备：'+current.changes.map(c=>c.label+' '+c.from+'→'+c.to).join('，')+'。',effects,{developer:true});
  for(const k of E.STATS)s.lastChanges[k]=effects[k]||0;s.dev.pending=null;s.dev.message='前置数值已调整，可安排下一步。';
 }
 globalThis.TouhouDev={previewText,catalogue,categories,get,inspect,enable,queue,cancel,consume,plan,prepare};
})();
