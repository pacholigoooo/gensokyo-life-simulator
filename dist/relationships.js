/* Ordinary lives retain each named relationship through its own authored graph. */
(() => {
 const labels={acquaintance:'相识',friend:'友人',confidant:'挚友',mentor:'师友',rival:'对手',enemy:'仇敌',estranged:'疏远',reconciled:'缓和',lover:'相恋',bereaved:'故人',parted:'梦别'};
 const friendly=new Set(['friend','confidant','mentor','reconciled','lover']);
 const data=()=>globalThis.TouhouRelationshipData,C=globalThis.TouhouContacts;
 const maxActive=2;
 function init(s){s.relations={};s.partnerId=null;s.firstPartnerId=null;s.firstLoveAt=null;s.unwedAt=null;s.meetingPlan={enabled:false,current:null,history:[]};}
 function activeCount(s){return Object.values(s.relations).filter(r=>r.next!==null&&s.people[r.id].alive).length;}
 // firstPartnerId 是终身唯一约定；partnerId 是当前相伴。离世或分离只能清当前状态。
 function freePartner(s){return s.firstPartnerId===null&&s.partnerId===null&&!s.married&&s.courtshipAt===null;}
 function bindPartner(s,id){
  if(!freePartner(s))throw Error('这一生已经确立过恋人。');
  s.firstPartnerId=id;s.firstLoveAt=s.age;s.partnerId=id;
 }
 function introductionDueAt(s){const years=Object.values(s.relations).map(r=>r.startedAt);return years.length?Math.max(...years)+globalThis.TouhouLifeConfig.introductionGap:18;}
 function partner(s){return s.partnerId?{id:s.partnerId,name:s.partnerId==='local:spouse'?'村民伴侣':s.people[s.partnerId].name,status:s.married?'已婚':'相恋'}:null;}
 function partnerChange(s,before){
  const after=partner(s);
  if(before?.id===after?.id&&before?.status===after?.status)return;
  if(after)return {kind:after.status==='已婚'?'marriage':'courtship',title:after.status==='已婚'?'结婚':'确立恋人',person:after.name,status:after.status,impact:after.status==='已婚'?'婚礼过后，日常有了新的约定。':'彼此说定心意，往后的日子一起走。'};
  const died=!s.people[before.id].alive;
  if(died&&s.relations[before.id]?.medium==='dream')return {kind:'dream-parting',title:'梦中别离',person:before.name,status:'梦路渐远',impact:'相见的梦淡去了，旧事留在记忆里。'};
  return {kind:died?'bereaved':'breakup',title:died?'伴侣离世':'分手',person:before.name,status:'旧日相伴',impact:'这段心意留在往后的记忆里。'};
 }
 function romanceClosure(s,id){
  const route=data().find(d=>d.id===id),r=s.relations[id];
  if(!route.romance||r.romanceClosed||r.status==='lover'||route.romanceStart&&!r.romancePath)return;
  // Attributes can grow; only completed choices and immutable talents close a path.
  function possible(node,flags,trust){return node!==null&&route.nodes[node].branches.some(b=>{
   const c=b.when;if(c.relationFlags?.some(f=>!flags.includes(f))||c.missingRelationFlags?.some(f=>flags.includes(f))||c.talentsAny&&!c.training?.talent&&!c.talentsAny.some(t=>s.talents.includes(t))||c.minTrust!==undefined&&trust<c.minTrust||c.maxTrust!==undefined&&trust>c.maxTrust)return false;
   const nextFlags=[...flags.filter(f=>!b.clear?.includes(f)),...(b.set||[])];
   return b.status==='lover'||possible(b.next,nextFlags,Math.max(-10,Math.min(10,trust+(b.trust||0))));
  });}
  if(possible(r.next,r.flags,r.trust))return;
  r.romanceClosed=true;
  return {kind:'closed',title:'恋爱分支结束',person:s.people[id].name,status:labels[r.status],impact:'这段来往此后不再进入恋爱。'};
 }
 function romanceView(route){return route.romanceContact?{...route,contact:route.romanceContact}:route;}
 function canStartRomance(s,route){return !!route.romanceStart&&freePartner(s)&&C.gateReady(s,route);}
 function extendedHuman(s){return s.flags.has('partner-learning:care-complete')||s.flags.has('partner-learning:vitality-complete')||Object.values(s.relations).some(r=>r.guidance?.result?.kind==='longevity');}
 function realStudy(s){return s.opportunity?.stage>=2||s.development?.kind==='shikaisen'&&s.development.progress>=2||Object.values(s.partnerStudy||{}).some(p=>p.receive?.stage>=2&&p.receive.stage<p.receive.maxStages&&['magician','hermit','vampire','boundary'].includes(p.receive.kind));}
 function romanticTiming(s){
  if(s.species!=='human'||extendedHuman(s))return 1;
  // A first clue is not extra lifespan. Late starts remain possible, but become less common.
  return s.bodyAge>=55?.15:s.bodyAge>=45?.4:1;
 }
 function oldFriend(s,route,checkContact=true){
  const r=s.relations[route.id];
  // Yoshika's respectful gate-side acquaintance can lead only to her separately authored past-life dream.
  const remembered=route.id==='yoshika'&&r?.status==='rival'&&r.trust>=3&&r.flags.includes('steps-recorded')&&!r.flags.includes('command-pressed');
  return !s.character&&!s.ended&&!s.afterlife&&!s.dormant&&!!r&&!!route.romanceStart&&r.romanceAllowed&&!r.romancePath&&!r.romanceClosed&&(friendly.has(r.status)||remembered)&&r.status!=='lover'&&s.people[r.id].alive&&s.people[r.id].leaveAt>s.age&&freePartner(s)&&s.body==='humanoid'&&s.age>=24&&s.age-r.startedAt>=globalThis.TouhouLifeConfig.oldFriendRomanceYears&&(!checkContact||C.gateReady(s,route));
 }
 function oldFriendEvent(s,route){
  const r=s.relations[route.id],node=route.nodes[route.romanceStart],b=node.branches.find(b=>matches(s,r,b.when));
  if(!b)throw Error('旧友恋爱入口没有可达分支：'+route.id);
  const e=branchEvent(route,route.romanceStart,b),apply=e.apply;
  e.apply=state=>{
   if(!oldFriend(state,route))throw Error('旧友恋爱前置已改变：'+route.id);
   // Keep the lived friendship. Only the route and its contact medium change (Yoshika uses a historical dream).
   r.romancePath=true;r.romanceFromFriend=true;r.romanceOrigin='old-friend';r.next=route.romanceStart;r.medium=C.mode(romanceView(route));r.scene=C.scene(romanceView(route));state.people[r.id].medium=r.medium;
   apply(state);
  };
  return e;
 }
 function introWeight(s,route){
  if(route.romance&&freePartner(s))return (route.romanceGate.category==='pc98'?globalThis.TouhouLifeConfig.pc98RomanceWeight:1)*globalThis.TouhouLifeConfig.romanceIntroWeight*(s.romanceWish===route.id?globalThis.TouhouLifeConfig.romanceWishWeight:1);
  return C.relatedWeight(s,route)*(1+s.talents.filter(t=>route.talents.includes(t)).length*.8+(route.careers.includes(s.career)?1:0));
 }
 function youngAgeReady(s,route,r){
  const p=s.people[route.id];
  return !!route.young&&r.young&&r.youngOrigin==='fictional-youth'&&r.startedAt>=10&&r.startedAt<=11&&(route.id==='akyuu'?globalThis.TouhouAkyuu.age(s)>=18:p.ageBasis==='fictional-same-age'&&p.ageAtMeet+s.age-p.metAt>=16);
 }
 function canLove(s,route,r){return !s.character&&!s.afterlife&&!s.dormant&&s.body==='humanoid'&&r.romanceAllowed&&data().some(d=>d.id===route.id&&d.romance)&&route.romance&&C.gateReady(s,route)&&s.age>=(r.young?16:20)&&(!r.young||youngAgeReady(s,route,r))&&(route.id!=='akyuu'||globalThis.TouhouAkyuu.age(s)>=18)&&r.visits>=4&&s.age-r.startedAt>=6&&r.trust>=4&&freePartner(s);}
 function echoDelay(r,e){return e.interval||6;}
 function matches(s,r,c){
  if(c.minAge!==undefined&&s.age<c.minAge||c.maxAge!==undefined&&s.age>c.maxAge)return false;
  if(c.min&&Object.entries(c.min).some(([k,v])=>s.stats[k]<v)||c.max&&Object.entries(c.max).some(([k,v])=>s.stats[k]>v))return false;
  if(c.habitats&&!c.habitats.includes(s.habitat)||c.species&&!c.species.includes(s.species)||c.careers&&!c.careers.includes(s.career)&&!s.flags.has(c.training?.career))return false;
  if(c.talentsAny&&!c.talentsAny.some(id=>s.talents.includes(id))&&!s.flags.has(c.training?.talent))return false;
  if(c.flags?.some(f=>!s.flags.has(f))||c.missingFlags?.some(f=>s.flags.has(f)))return false;
  if(c.relationFlags?.some(f=>!r.flags.includes(f))||c.missingRelationFlags?.some(f=>r.flags.includes(f)))return false;
  if(c.minTrust!==undefined&&r.trust<c.minTrust||c.maxTrust!==undefined&&r.trust>c.maxTrust)return false;
  if(c.minVisits!==undefined&&r.visits<c.minVisits||c.minYears!==undefined&&s.age-r.startedAt<c.minYears)return false;
  return !c.freePartner||freePartner(s);
 }
 function remember(s,r,key,text){r.history.push({key,age:s.age,text,status:r.status,label:r.label});r.lastAt=s.age;}
 function begin(s,route,romantic,intro=romantic&&route.romanceIntro?route.romanceIntro:route.intro,romanceAllowed=true,origin='ambient'){
  const view=romantic?romanceView(route):route;
  // 初识是否走恋爱图只决定当下的来往；未相恋的旧友仍可凭真实经历发展。
  const r={id:route.id,status:'acquaintance',previousStatus:null,next:romantic?route.romanceStart:route.intro.next,label:intro.label,romancePath:romantic,romanceAllowed,courses:{},practice:{},startedAt:s.age,lastAt:s.age,trust:0,visits:1,flags:[],history:[],echoes:{},activityAt:{},lastEchoKey:null,loveAt:null,loveDelay:null,marriage:null,circleAt:null,circleKey:null,remembranceAt:null,summary:''};
  s.relations[route.id]=r;r.romanceOrigin=origin;r.medium=C.mode(view);r.scene=C.scene(view);s.people[route.id].medium=r.medium;remember(s,r,'intro',intro.text);
 }
 function advance(s,route,node,key,b){
  const r=s.relations[route.id];
  if(b.status==='lover'){
   if(!canLove(s,route,r))throw Error('恋爱节点违反成年或伴侣契约：'+route.id);
   bindPartner(s,route.id);r.loveAt=s.age;r.loveDelay=pace(s,r).courtship;
  }else if(b.status&&r.status==='lover'&&b.status!=='lover'&&s.partnerId===route.id)s.partnerId=null;
  if(b.status)r.status=b.status;
  r.trust=Math.max(-10,Math.min(10,r.trust+(b.trust||0)));r.visits++;r.next=b.next;r.label=b.label;
  // 友人身份来自已经发生的往来与信任；原图的 next 保留，未发生的友情节点不能算作经历。
  if(!r.romancePath&&r.status==='acquaintance'&&r.visits>=3&&r.trust>=2)r.status='friend';
  for(const f of b.clear||[])r.flags=r.flags.filter(x=>x!==f);
  for(const f of b.set||[])if(!r.flags.includes(f))r.flags.push(f);
  if(b.injury)s.injured=true;
  s.people[route.id].close=friendly.has(r.status)?Math.max(2,r.trust):['enemy','estranged'].includes(r.status)?0:1;
  remember(s,r,node+':'+key,b.text);
 }
 function event(route,id,text,effects,apply,extra={}){return {id:'relation:'+route.id+':'+id,text,effects,weight:1,repeat:1,with:[route.id],apply,scene:C.scene(route),contactMedium:C.mode(route),premise:id==='intro'?route.contact.premise:undefined,...extra};}
 function introduction(route,s,tryRomance=true,romanceAllowed=true,origin='ambient'){
  const romantic=tryRomance&&!!s&&canStartRomance(s,route),view=romantic?romanceView(route):route,original=romantic&&route.romanceIntro?route.romanceIntro:route.preparedIntro&&s&&!matches(s,null,route.entry)?route.preparedIntro:route.intro;
  // Childhood recognition changes the meeting text, not adult trust or courtship prerequisites.
  const intro={...original,text:(s?C.reunion(s,route.id):'')+original.text};
  return event(view,'intro',intro.text,intro.effects,state=>begin(state,route,romantic,intro,romanceAllowed,origin),{talentBoost:route.talents});
 }
 function youngEntry(s,route){return !!route.young&&!s.character&&!s.ended&&!s.afterlife&&!s.dormant&&s.realm==='gensokyo'&&s.body==='humanoid'&&s.species==='human'&&freePartner(s)&&!s.people[route.id]&&!s.relations[route.id]&&matches(s,null,route.young.entry);}
 function youngIntroduction(route,s){
  if(!youngEntry(s,route))throw Error('少年初识前置未完成：'+route.id);
  const y=route.young,view=romanceView(route);
  return event(view,'intro',y.intro.text,y.intro.effects,state=>{
   begin(state,route,true,y.intro,true,'young');
   const r=state.relations[route.id],p=state.people[route.id];
   r.next=y.start;r.young=true;r.youngOrigin='fictional-youth';r.canonAge='unknown';r.youngScenes={};r.scene='少年篇（二创） · '+view.contact.place;
   if(route.id!=='akyuu'){p.ageAtMeet=state.age;p.ageBasis='fictional-same-age';}
  },{scene:'少年篇（二创） · '+view.contact.place,youngScene:true,set:y.contactFlag?[y.contactFlag]:[]});
 }
 function youngMeeting(s,rng){
  const plan=s.meetingPlan;
  if(s.age<10||s.age>11||plan.youngChecked||!freePartner(s)||s.species!=='human'||s.body!=='humanoid')return null;
  if(plan.youngAt===undefined)plan.youngAt=10+Math.floor(rng()*2);
  if(s.age<plan.youngAt)return null;
  plan.youngChecked=true;
  if(rng()>=globalThis.TouhouLifeConfig.youngNamedChance)return null;
  // Draw from the full roster, not a four-person pool. Childhood access grants
  // no second high-probability draw to people who already live nearby.
  const choices=data().filter(d=>d.romance&&s.people[d.id]?.alive!==false);
  if(!choices.length)return null;
  const weights=choices.map(d=>C.leadWeight(s,d));let n=rng()*weights.reduce((a,b)=>a+b,0),i=0;
  while(i<weights.length-1&&n>=weights[i])n-=weights[i++];
  const route=choices[i];return youngEntry(s,route)?youngIntroduction(route,s):null;
 }
 function youngScene(s,route,item){
  const r=s.relations[route.id];return event(romanceView(route),'young-scene:'+item.key,item.text,{},state=>{r.youngScenes[item.key]=state.age;remember(state,r,'young-scene:'+item.key,item.text);},{scene:'少年篇（二创） · '+route.contact.place,youngScene:true});
 }
 function branchEvent(route,nodeId,b){const young=nodeId.startsWith('young:');return event(nodeId.startsWith('love:')||young?romanceView(route):route,nodeId+':'+b.key,b.text,b.effects,state=>advance(state,route,nodeId,b.key,b),{xp:b.xp||0,wear:b.wear||0,...(young?{scene:'少年篇（二创） · '+route.contact.place,youngScene:true}:{})});}
 function echoEvent(s,route,e){const r=s.relations[route.id],text=e.romanceEcho?globalThis.TouhouCompanionship.text(s,r,e):e.text;return event(r.romancePath?romanceView(route):route,'echo:'+e.key+':'+(r.echoes[e.key]||0),text,e.effects,state=>{r.echoes[e.key]=(r.echoes[e.key]||0)+1;r.lastEchoKey=e.key;r.activityAt['echo:'+e.key]=state.age;remember(state,r,'echo:'+e.key,text);state.people[r.id].close=friendly.has(r.status)?Math.max(2,r.trust):0;});}
 function echoDueAt(s,route,e){const r=s.relations[route.id];return r.status==='lover'&&route.marriage?(r.activityAt['echo:'+e.key]??r.loveAt)+Math.max(echoDelay(r,e),pace(s,r).echo):r.lastAt+echoDelay(r,e);}
 function canEcho(s,route,e){
  const r=s.relations[route.id];return !s.ended&&!s.afterlife&&!s.dormant&&s.body==='humanoid'&&!!r&&!(r.young&&s.age<20)&&r.next===null&&s.people[r.id].alive&&s.people[r.id].leaveAt>s.age&&(!r.romancePath||e.romanceEcho)&&e.states.includes(r.status)&&(r.status!=='lover'||s.partnerId===r.id)&&(!(r.status==='lover'&&route.marriage)?(r.echoes[e.key]||0)<2:r.lastEchoKey!==e.key&&s.age-r.lastAt>=2&&globalThis.TouhouCompanionship.fresh(s,r,globalThis.TouhouCompanionship.text(s,r,e)))&&(!e.when||matches(s,r,e.when));
 }
 function marriageStage(s,route){
  const r=s.relations[route.id];if(!route.marriage||!r||r.status!=='lover'||r.next!==null||s.partnerId!==route.id||!s.people[route.id].alive||s.people[route.id].leaveAt<=s.age||s.character||s.ended||s.afterlife||s.dormant||s.body!=='humanoid'||s.realm!=='gensokyo'||s.age<20||r.trust<4||s.unwedAt!==null)return null;
  if(r.marriage?.stage===3)return s.married?'daily':null;
  if(s.married)return null;
  return ['proposal','planning','wedding'][r.marriage?.stage||0];
 }
 // Lifespans of both partners matter: an aging partner keeps the human calendar.
 function pace(s,r){
  const p=s.people[r.id],finitePartner=p.life==='human'&&!p.ageless||p.species==='magician'&&!p.ageless;
  if(s.species==='human'||s.species==='magician'&&!s.magic.ageless||finitePartner){
   const base=globalThis.TouhouLifeConfig.humanMarriageYears;
   const courtship=s.species==='human'&&s.bodyAge<45&&s.wear<s.vitality*.7&&s.stats.health>3&&!s.injured&&realStudy(s)?base+3:s.species==='human'&&s.wear<s.vitality*.7&&s.stats.health>3&&!s.injured&&extendedHuman(s)?base+1:base;
   return {courtship,ceremony:1,daily:3,echo:6};
  }
  const schedules={hermit:[4,2,4,8],shikaisen:[5,2,4,8],magician:[5,2,4,10],youkai:[6,3,5,10],vampire:[8,3,5,12]};
  const [courtship,ceremony,daily,echo]=schedules[s.species];
  return {courtship,ceremony,daily,echo};
 }
 function marriageDueAt(s,r,key){const cadence=pace(s,r);return key==='proposal'?Math.max(r.lastAt+1,r.loveAt+Math.max(r.loveDelay,cadence.courtship)):Math.max(r.lastAt+1,r.marriage.lastAt+cadence.ceremony);}
 function marriageEvent(s,route,key){
  const r=s.relations[route.id],text=route.marriage[key];
  return event(r.romancePath?romanceView(route):route,'marriage:'+key,text,{bond:1},state=>{
   if(marriageStage(state,route)!==key||state.age<marriageDueAt(state,r,key))throw Error('婚事前置未完成：'+route.id+'/'+key);
   if(key==='proposal')r.marriage={stage:1,lastAt:state.age,marriedAt:null,daily:{},lastDaily:null};
   else{r.marriage.stage++;r.marriage.lastAt=state.age;}
   if(key==='wedding'){state.married=true;r.marriage.marriedAt=state.age;}
   r.label={proposal:'许下婚约',planning:'一起筹备婚事',wedding:r.medium==='dream'?'梦中结为夫妻':'结为夫妻'}[key];
   remember(state,r,'marriage:'+key,text);
  });
 }
 function unwedEvent(s,route){
  const r=s.relations[route.id],text='谈起往后的安排，你与'+s.people[route.id].name+'商量好继续以恋人身份相伴。两人都愿意，便把这份约定记在共同的日子里。';
  return event(romanceView(route),'marriage:unwed',text,{bond:1},state=>{
   if(marriageStage(state,route)!=='proposal'||state.age<marriageDueAt(state,r,'proposal'))throw Error('相伴约定前置未完成：'+route.id);
   state.unwedAt=state.age;r.label='约定以恋人相伴';remember(state,r,'marriage:unwed',text);
  });
 }
 function dailyDueAt(s,r,d){return (r.activityAt['marriage:'+d.key]??r.marriage.marriedAt)+pace(s,r).daily;}
 function marriageDailyEvent(s,route,d){
  const r=s.relations[route.id],text=globalThis.TouhouCompanionship.text(s,r,d);return event(r.romancePath?romanceView(route):route,'marriage:daily:'+d.key+':'+(r.marriage.daily[d.key]||0),text,{},state=>{
   if(marriageStage(state,route)!=='daily'||state.age<dailyDueAt(state,r,d)||state.age-r.lastAt<2||r.marriage.lastDaily===d.key||!globalThis.TouhouCompanionship.fresh(state,r,text))throw Error('婚后日常前置未完成：'+route.id+'/'+d.key);
   r.marriage.daily[d.key]=(r.marriage.daily[d.key]||0)+1;r.marriage.lastDaily=d.key;r.activityAt['marriage:'+d.key]=state.age;r.label='婚后相伴';remember(state,r,'marriage:daily:'+d.key,text);
  });
 }
 // Human years are scarce: keep every scene, while placing the confession after its authored minimum acquaintance.
 function nodeDueAt(s,route,r){
  const node=route.nodes[r.next],short=s.species==='human'&&!extendedHuman(s)&&!realStudy(s)&&r.romancePath;
  const delay=short?Math.min(node.delay,1):node.delay;
  const love=node.branches.find(b=>b.status==='lover');
  const ownAgeDue=love&&r.young&&route.id==='akyuu'?s.age+Math.max(0,18-globalThis.TouhouAkyuu.age(s)):0;
  return Math.max(r.lastAt+delay,love?Math.max(love.when.minAge,r.startedAt+love.when.minYears,ownAgeDue):0);
 }
 function select(s,rng){
  if(s.character||s.ended||s.afterlife||s.dormant||s.realm!=='gensokyo')return null;
  const young=youngMeeting(s,rng);if(young)return young;
  // A selected first visit keeps its visitor through the neutral introduction.
  // Drawing another person next year would dilute people who need an extra scene.
  if(s.plannedIntroduction){
   const visit=s.plannedIntroduction,route=data().find(r=>r.id===visit.id);
   if(s.relations[visit.id]||!freePartner(s)||s.people[visit.id].alive===false||s.people[visit.id].leaveAt<=s.age||s.body!=='humanoid')s.plannedIntroduction=null;
   else if(s.age>visit.age&&s.age>=introductionDueAt(s)&&activeCount(s)<maxActive){
    const e=introduction(route,s,visit.allowed),apply=e.apply;
    e.apply=state=>{state.plannedIntroduction=null;apply(state);};return e;
   }
  }
  const candidates=[globalThis.TouhouPartnerLearning.candidate(s),globalThis.TouhouAkyuu.candidate(s),globalThis.TouhouCompanionship.candidate(s),globalThis.TouhouGuidance.candidate(s)].filter(Boolean);
  for(const r of Object.values(s.relations))if(s.people[r.id].alive&&s.people[r.id].leaveAt>s.age){
   const route=data().find(d=>d.id===r.id);
   if(C.waitingPractice(s,route))candidates.push({due:r.lastAt+1,chance:.8,get:()=>C.practiceEvent(s,route)});
   else if(r.next!==null){
    // 按数据顺序选择首条满足条件的分支，末尾空条件承接其余情况；不能随机抽取。
    const node=route.nodes[r.next];candidates.push({due:nodeDueAt(s,route,r),chance:s.species==='human'?globalThis.TouhouLifeConfig.humanBranchChance:.4,get:()=>{
     if(r.romancePath&&r.status!=='lover'&&!freePartner(s))return branchEvent(route,r.next,{key:'interrupted',text:route.romanceInterrupted,effects:{},next:null,status:'friend',label:'心意止于朋友'});
     const b=node.branches.find(b=>matches(s,r,b.when)&&(b.status!=='lover'||canLove(s,route,r)));if(!b)throw Error('关系节点没有可达分支：'+r.id+'/'+r.next);
     return branchEvent(route,r.next,b);
    }});
   }else if(r.next===null){
    if(r.young&&r.status==='lover'&&s.partnerId===r.id&&s.age<20){
     const scene=route.young.scenes.find(e=>r.youngScenes[e.key]===undefined);
     if(scene)candidates.push({due:r.lastAt+1,chance:.6,get:()=>youngScene(s,route,scene)});
    }
    const stage=marriageStage(s,route);
    if(stage&&stage!=='daily')candidates.push({due:marriageDueAt(s,r,stage),chance:s.species==='human'?globalThis.TouhouLifeConfig.humanMarriageChance:.3,get:()=>stage==='proposal'&&rng()<globalThis.TouhouLifeConfig.unwedCompanionshipChance?unwedEvent(s,route):marriageEvent(s,route,stage)});
    if(stage==='daily'&&s.age-r.lastAt>=2)for(const d of route.marriage.daily)if(r.marriage.lastDaily!==d.key&&globalThis.TouhouCompanionship.fresh(s,r,globalThis.TouhouCompanionship.text(s,r,d)))candidates.push({due:dailyDueAt(s,r,d),chance:.25,get:()=>marriageDailyEvent(s,route,d)});
    if(!stage||stage==='daily')for(const e of route.echoes)if(canEcho(s,route,e))candidates.push({due:echoDueAt(s,route,e),chance:.18,get:()=>echoEvent(s,route,e)});
   }
  }
  const ready=candidates.filter(c=>s.age>=c.due).sort((a,b)=>a.due-b.due),oldest=ready[0];
  // A waiting line has a finite priority deadline; newer people cannot replace it.
  if(oldest&&(s.age>=oldest.due+(s.species==='human'?globalThis.TouhouLifeConfig.humanWaitLimit:6)||rng()<oldest.chance))return oldest.get();
  // Eligible people share a base weight; a chosen wish and the PC-98 category are explicit exceptions.
  const friends=freePartner(s)?data().filter(route=>oldFriend(s,route)&&(s.relations[route.id].next!==null||activeCount(s)<maxActive)):[];
  if(friends.length&&rng()<globalThis.TouhouLifeConfig.oldFriendRomanceChance*romanticTiming(s)){
   const weights=friends.map(route=>introWeight(s,route));let pick=rng()*weights.reduce((a,b)=>a+b,0),index=0;
   while(index<weights.length-1&&pick>=weights[index])pick-=weights[index++];
   return oldFriendEvent(s,friends[index]);
  }
  if(activeCount(s)<maxActive&&s.age>=introductionDueAt(s)){
   // First romantic acquaintances all use the broad visit draw. A second draw
   // from only reachable places would give nearby people an extra early chance.
   // Existing friends still develop above; later visits can choose other people.
   const routes=data().filter(d=>!(freePartner(s)&&d.romance)&&!s.relations[d.id]&&s.people[d.id]?.alive!==false&&C.canMeet(s,d)&&C.entryReady(s,d));
   if(routes.length){
    const weights=routes.map(d=>introWeight(s,d));
    // Completed friendships do not permanently reduce a single person's chance of a new meeting.
    const affinity=Math.max(...weights),chance=globalThis.TouhouLifeConfig.relationshipChance*(s.species==='human'?globalThis.TouhouLifeConfig.humanIntroMultiplier*(s.age>=globalThis.TouhouLifeConfig.humanEstablishedIntroAge?globalThis.TouhouLifeConfig.humanEstablishedIntroMultiplier:1):1)*Math.min(2,affinity)/(1+(freePartner(s)?activeCount(s):Object.keys(s.relations).length));
    if(chance>0&&rng()<chance){let n=rng()*weights.reduce((a,b)=>a+b,0),index=0;while(index<weights.length-1&&n>=weights[index])n-=weights[index++];const route=routes[index],allowed=s.romanceWish===route.id||rng()<globalThis.TouhouLifeConfig.mutualRomanceChance;
     if(!allowed&&!C.canMeet(s,route))return null;
     const romantic=allowed&&(!C.canMeet(s,route)||s.romanceWish===route.id||rng()<globalThis.TouhouLifeConfig.firstMeetingRomanceChance*romanticTiming(s));if((romantic||route.romance&&!route.romanceStart)&&C.gateAvailable(s,route)){const e=C.gateEvent(route),apply=e.apply;e.apply=state=>{apply(state);state.plannedIntroduction={id:route.id,age:state.age,allowed};};return e;}
     return introduction(route,s,romantic);}
   }
  }
  return null;
 }
 function farewellText(s,id){
  const r=s.relations[id],p=s.people[id],route=data().find(d=>d.id===id);
  if((r?.status==='lover'||r?.previousStatus==='lover')&&route?.marriage){
   if(s.afterlife&&r.medium==='dream')return '与'+p.name+'相见的旧梦渐渐淡去，身后的岁月里，你仍记得那时的问候。';
   if(s.afterlife&&r.medium!=='dream')return p.name+'走到了生命尽头；身后的岁月里，你仍记着初见时的那句问候。';
   return route.marriage.bereaved;
  }
  return p.medium==='dream'?(s.afterlife?`与${p.name}相见的梦已经远去，最后一次往返仍留在旧日记忆里。`:`与${p.name}相见的梦渐渐淡去，你醒来记下最后一次往返。`):`${p.name}走到了生命尽头，你想起了旧日往来。`;
 }
 function departure(s,cause){
  if(cause==='chapter'||!s.partnerId)return null;
  const r=s.relations[s.partnerId],route=data().find(d=>d.id===s.partnerId);
  return r?.status==='lover'&&s.people[r.id].alive&&route?.marriage?route.marriage.surviving:null;
 }
 function upkeep(s){
  if(s.partnerId&&s.people[s.partnerId]?.alive===false){s.partnerId=null;s.married=false;s.courtshipAt=null;}
  for(const r of Object.values(s.relations))if(!s.people[r.id].alive&&!['bereaved','parted'].includes(r.status)){
   r.previousStatus=r.status;r.status=r.medium==='dream'?'parted':'bereaved';r.next=null;r.label=r.medium==='dream'?'梦路渐远':['enemy','estranged'].includes(r.previousStatus)?'旧怨留存':'故人已逝';
   remember(s,r,'farewell',r.previousStatus==='lover'&&data().find(d=>d.id===r.id).marriage?farewellText(s,r.id):s.people[r.id].name+(r.medium==='dream'?'渐渐离开这段梦，往来的旧事仍在记忆里。':'已离世，往事停留在记忆里。'));
  }
 }
 function finish(s,cause){
  for(const r of Object.values(s.relations)){
   const route=data().find(d=>d.id===r.id),name=s.people[r.id].name;
   if(!s.people[r.id].alive&&(r.status==='lover'||r.previousStatus==='lover')&&route.marriage)r.summary=farewellText(s,r.id);
   else if(!s.people[r.id].alive)r.summary=r.medium==='dream'?'与'+name+'相见的梦路渐远，年表里仍记着这段来往。':name+'已经离世，你留下的年表仍记着这段往来。';
   else if(cause!=='chapter'&&r.status==='lover'&&route.marriage)r.summary=route.marriage.surviving;
   else if(s.afterlife)r.summary=`生前与${name}的来往，留在了旧日的记忆里。`;
   else if(cause==='chapter')r.summary=r.marriage?.stage===3&&r.status==='lover'?route.marriage.farewell+' 这一卷暂时合上，你们的相伴仍在继续。':['enemy','estranged'].includes(r.status)?`这一卷已尽，你与${name}的隔阂仍在。`:`这一卷已尽，你与${name}的来往还在继续。`;
   else if(r.next!==null||r.status==='acquaintance')r.summary=`你与${name}的故事，停在了「${r.label}」。`;
   else if(r.marriage?.stage===3)r.summary=route.marriage.farewell;
   else r.summary=r.romancePath&&r.status==='friend'?r.history.at(-1).text:route.farewell[r.status];
  }
 }
 function describe(s){return Object.values(s.relations).map(r=>({id:r.id,name:s.people[r.id].name,status:r.status==='lover'&&r.marriage?.stage===3?'已婚':labels[r.status],stage:(s.afterlife?'生前 · '+r.label:r.label)+(r.id==='akyuu'?' · 阿求'+Math.floor(globalThis.TouhouAkyuu.age(s))+'岁':''),learning:s.people[r.id].learning?'修习 · '+({magician:'魔法',hermit:'仙道',care:'调养',scholar:'抄校'})[s.people[r.id].learning.kind]+' '+s.people[r.id].learning.stage+'/3':'',romanceClosed:!!r.romanceClosed,scene:r.scene,medium:r.medium,departure:r.medium==='dream'?'梦中别离':'已故',alive:s.people[r.id].alive,summary:r.summary}));}
 globalThis.TouhouRelationships={unwedEvent,youngEntry,youngIntroduction,youngAgeReady,youngScene,nodeDueAt,extendedHuman,realStudy,romanticTiming,oldFriend,oldFriendEvent,labels,init,begin,matches,select,upkeep,finish,describe,freePartner,bindPartner,partner,partnerChange,romanceClosure,introWeight,canLove,echoDelay,introduction,branchEvent,echoEvent,romanceView,canStartRomance,activeCount,maxActive,introductionDueAt,echoDueAt,canEcho,pace,marriageStage,marriageDueAt,marriageEvent,dailyDueAt,marriageDailyEvent,farewellText,departure};
})();
