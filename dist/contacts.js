/* An ordinary visitor needs a narrated route before meeting distant people. */
(() => {
 // Shared places and teachers include people of other species. Entry permits still apply.
 const affinities={youkai:['reimu','keine','mamizou','yukari','kasen'],hermit:['miko','futo','seiga','kasen','yoshika'],magician:['alice','marisa','patchouli','byakuren','narumi'],vampire:['remilia','flandre','sakuya','meiling','patchouli'],shikaisen:['miko','futo','seiga','tojiko','yoshika'],ghost:['yuyuko','youmu','komachi','eiki'],vengeful:['murasa','tojiko','rin','satori'],kami:['kanako','suwako','sanae','kutaka','shizuha','minoriko']};
 function relatedWeight(s,route){const kinds=[s.species,s.opportunity?.kind,s.development?.kind];return kinds.some(k=>affinities[k]?.includes(route.id))?2.2:1;}
 const local=new Set(['village','shrine','temple']);
 const domains={
  village:{label:'人里'},shrine:{label:'神社'},temple:{label:'寺院'},
  forest:{label:'林间往返',min:{health:5},text:'你跟随采集队辨认林中路标，记下了能平安往返的小径。'},
  lake:{label:'湖畔往返',min:{health:5},text:'一次运送湖边货物的差事，让你认熟了可以往返的岸边道路。'},
  mansion:{label:'红魔馆访客',min:{bond:6},text:'你接下一份送往红魔馆的委托，门卫核过来意，约定了以后的访客时段。'},
  mountain:{label:'山间通行',min:{health:6,insight:6},text:'山路向导领你走过可供访客通行的岔口，你记下禁入地带，学着依规往返。'},
  graveyard:{label:'墓地往返',min:{insight:6},text:'你帮人整理墓地旁的旧物，认熟了归路，也学会避开封闭的入口。'},
  underground:{label:'地底访客',min:{health:6,insight:8},xp:3,text:'受托运货时，一位向导领你穿过地底岔路；此后有事下行，都依约请人接应。'},
  netherworld:{label:'冥界访客',min:{insight:9,bond:6},xp:4,text:'一次祭祀差事带来冥界的访客许可，你循指定通路赴约，每回都在约定时辰返家。'},
  sanzu:{label:'三途河岸来往',min:{insight:8,bond:6},xp:4,text:'你随祭祀递送队抵达三途河畔，获准留在指定岸边办事，每次都随引路者原路返回。'},
  hell:{label:'彼岸与地狱访客',min:{health:7,insight:10},xp:6,text:'跨境递送的凭札写明了彼岸官署与地狱的接应处，你依约随引路者往返，沿途不敢离队。'},
  'animal-realm':{label:'畜生界访客',min:{health:7,insight:10},xp:6,text:'一封跨境委托注明了畜生界的接应处，你核好退路，才跟着引路者往返。'},
  backdoor:{label:'后户来往',min:{insight:10,bond:6},xp:5,text:'一扇只在约定时刻打开的门邀你入内；你记牢回程暗号，从此按约出入后户。'},
  dream:{label:'相续之梦',min:{insight:7},xp:2,text:'你开始记下反复出现的梦，几条道路渐渐连成一处能再次抵达的梦境。'},
  'outside-dream':{label:'外界之梦',min:{insight:8},xp:3,text:'梦中出现外界的街灯与校舍；你记下醒来的时刻，后来又循同一段梦路走了回去。'},
  'hifuu-dream':{label:'未来外界之梦',min:{insight:9},xp:4,text:'一幅星图伴你入梦，远方城市显出另一个时代的模样；往后的夜里，这段未来外界之梦渐渐相续。'},
  'pc98-dream':{label:'旧作之梦',min:{insight:8},xp:3,text:'旧书中的景象接连入梦，展开一段自有前后的旧作故事；你醒来记下，再入梦时便沿旧路探访。'},
  'makai-dream':{label:'旧作魔界之梦',min:{insight:9},xp:4,text:'旧书扉页化作梦里的入口，另一段旧作魔界故事由此展开；醒来之后，故乡仍在窗外。'},
  'history-dream':{label:'往昔之梦',min:{insight:8},xp:3,text:'你读过的一段往事在梦中展开，陌生的人仍活在他们的年月里；此后几夜，旧梦接续着讲下去。'},
  'moon-dream':{label:'月面之梦',min:{insight:10},xp:4,text:'月光照着手边的记事，一条梦路通向遥远月面；醒来仍在人间，后来相见也只能循梦而去。'}
 };
 function mode(route){return route.contact.domain.includes('dream')?'dream':'visit';}
 function scene(route){return domains[route.contact.domain].label+' · '+route.contact.place;}
 function canMeet(s,route){return local.has(route.contact.domain)||s.flags.has('contact:'+route.contact.domain);}
 function entryReady(s,route){const R=globalThis.TouhouRelationships;return s.relations[route.id]?R.oldFriend(s,route,false):R.matches(s,null,route.entry)||!!route.preparedEntry&&R.matches(s,null,route.preparedEntry);}
 const lessons={
  craft:['你下工后到工坊学修旧物，先练着认木纹、磨好手边的工具。','师傅验过你修好的木框，又让你独自补好一件旧器；往后你也能接简单修补。'],
  garden:['你在住处辟出一小块花畦，向花农请教怎样辨认活芽、松土排水。','你照料的幼苗熬过一季，花农验过根须，教你把修枝的活独自做完。'],
  moon:['你开始逐夜记下月相和入梦时刻，醒来再核对梦里认出的道路。','月相簿记满一轮，你依照记录重访梦中的岔口，终于认清哪条路能够返回。'],
  promise:['你按约照料与幽香看过的花，遇上下雨也先收好花具，再去赴约。','又到约好的花期，你带着这一季的照料记录赴约，幽香认出你一直记着旧日的约定。']
 };
 const travelWords={
  health:['你跟向导练习往返的步程，重物分开搬，每回都走到约定的歇脚处。','你按上回记下的路分段练脚力，走稳险处，再把余下的行程接起来。'],
  insight:['你借来沿途的记录逐页研读，认不准的地方另抄下来，请熟悉道路的人核对。','你把前次记错的路标重新核过，又在纸上练着还原来回的次序。'],
  bond:['你随递送队帮忙交接，学着把来意、时辰和回程约定一项项讲清。','你试着独自交接一份委托，等对方把疑处问完，再核清彼此的约定。'],
  fortune:['你接了一份工余的短差，把挣来的钱留作出行用度。','你修整手边的旧物，卖掉用不上的零件，添了一点路费。']
 };
 function leadWeight(s,route){return (route.romanceGate.category==='pc98'?globalThis.TouhouLifeConfig.pc98RomanceWeight:1)*(s.romanceWish===route.id?globalThis.TouhouLifeConfig.romanceWishWeight:1);}
 function leadCandidates(s){
  return globalThis.TouhouRelationshipData.filter(r=>r.romance&&!s.relations[r.id]&&!s.meetingPlan.history.some(h=>h.id===r.id)&&s.people[r.id]?.alive!==false&&(r.entry.maxAge===undefined||s.age<=r.entry.maxAge)&&!s.relations[r.id]?.romanceClosed).map(route=>({id:route.id,weight:leadWeight(s,route)}));
 }
 function finishLead(s,result){const lead=s.meetingPlan.current;lead.result=result;lead.finishedAt=s.age;s.meetingPlan.current=null;}
 function leadEvent(s,key,text,effects={},extra={},lead=s.meetingPlan.current){
  return {id:'meeting:'+lead.id+':'+key,text,effects,weight:1,repeat:1,minAge:18,scene:'访行准备',...extra};
 }
 function courseNeeded(s,route,r){
  if(!r){const c=route.entry;if(c.careers&&!c.careers.includes(s.career)&&c.training?.career&&!s.flags.has(c.training.career))return c.training.career.slice(9);if(c.talentsAny&&!c.talentsAny.some(t=>s.talents.includes(t))&&c.training?.talent&&!s.flags.has(c.training.talent))return c.training.talent.slice(9);}
  if(route.id==='yuuka'&&r&&!r.romanceClosed&&r.romanceAllowed){
   if(r.next==='cutting'&&!route.nodes.cutting.branches.slice(0,-1).some(b=>globalThis.TouhouRelationships.matches(s,r,b.when))&&!s.flags.has('practice:garden'))return 'garden';
   if(r.next==='voice'&&r.flags.includes('shared_bloom')&&r.flags.includes('kept_boundary')&&!r.flags.includes('pride')&&!r.flags.includes('barred')&&!s.talents.some(t=>['promise','patient'].includes(t))&&!s.flags.has('practice:promise'))return 'promise';
  }
  return null;
 }
 function neededStat(s,min){return Object.entries(min).filter(([k,v])=>s.stats[k]<v).sort((a,b)=>(b[1]-s.stats[b[0]])-(a[1]-s.stats[a[0]]))[0]?.[0];}
 function waitingPractice(s,route){
  const r=s.relations[route.id];
  if(!r||!globalThis.TouhouRelationships.freePartner(s)||r.romanceClosed||!r.romanceAllowed||r.next===null||route.romanceStart&&!r.romancePath)return false;
  if(courseNeeded(s,route,r))return true;
  if(route.nodes[r.next].branches.slice(0,-1).some(b=>globalThis.TouhouRelationships.matches(s,r,b.when)))return false;
  const p=route.meetingPractice?.[r.next];return !!p&&!!neededStat(s,p.min)&&(r.practice[r.next]||0)<globalThis.TouhouLifeConfig.meetingPracticeLimit;
 }
 function courseEvent(s,kind,owner=s.meetingPlan.current){
  const n=owner.courses[kind]||0;
  return leadEvent(s,'course:'+kind+':'+n,lessons[kind][n],{}, {apply:x=>{owner.courses[kind]=n+1;if(n===1)x.flags.add('practice:'+kind);}},owner);
 }
 // Practice belongs to an actual relationship, even after another trip begins.
 function practiceEvent(s,route){
  const r=s.relations[route.id],course=courseNeeded(s,route,r);
  if(course)return courseEvent(s,course,r);
  const p=route.meetingPractice[r.next],key=r.next,n=r.practice[key]||0,stat=neededStat(s,p.min);
  const gain=Math.min(p.gains?.[n]||1,p.min[stat]-s.stats[stat]);
  return leadEvent(s,'practice:'+key+':'+n,p.texts[n%p.texts.length],{[stat]:gain},{scene:scene(globalThis.TouhouRelationships.romanceView(route)),apply:()=>{r.practice[key]=n+1;}},r);
 }
 // The draw chooses a possible visit before checking present-day access. Travel,
 // entry, individual introductions and the original relationship graph still happen.
 function prospect(s,rng){
  if(s.character||s.ended||s.afterlife||s.dormant||s.realm!=='gensokyo'||s.body!=='humanoid'||s.age<18)return null;
  const R=globalThis.TouhouRelationships,plan=s.meetingPlan,config=globalThis.TouhouLifeConfig;
  plan.enabled=true;
  if(!R.freePartner(s)){if(plan.current)finishLead(s,s.firstPartnerId===plan.current.id?'lover':'other-partner');return null;}
  let lead=plan.current;
  if(lead){
   const r=s.relations[lead.id],route=globalThis.TouhouRelationshipData.find(d=>d.id===lead.id);
   if(r||lead.id==='local:spouse'&&s.people[lead.id]){finishLead(s,'introduced');lead=null;}
   else if(s.people[lead.id]?.alive===false||lead.id==='local:spouse'&&s.species!=='human'){finishLead(s,'closed');lead=null;}
   else if(!r&&(s.age-lead.startedAt>=config.meetingLeadYears||route?.entry.maxAge!==undefined&&s.age>route.entry.maxAge)){const e=leadEvent(s,'unfinished','几番往返未能接续，你把这一段约定留在旧记事里，日子仍照常过下去。',{}, {apply:x=>finishLead(x,'unfinished')});return e;}
  }
  if(!lead){
   const last=plan.history[plan.history.length-1];
   if(last&&s.age<last.finishedAt+config.meetingVisitGap||R.activeCount(s)>=R.maxActive||rng()>=config.meetingLeadChance*R.romanticTiming(s))return null;
   const candidates=leadCandidates(s);
   if(s.species==='human'&&s.age<=38&&!s.people['local:spouse']&&!plan.history.some(h=>h.id==='local:spouse'))candidates.push({id:'local:spouse',weight:config.localLeadWeight});
   if(!candidates.length)return null;
   let n=rng()*candidates.reduce((sum,c)=>sum+c.weight,0),index=0;while(index<candidates.length-1&&n>=candidates[index].weight)n-=candidates[index++].weight;
   const id=candidates[index].id;lead={id,startedAt:s.age,result:'visiting',courses:{},practice:{},preparations:0};plan.current=lead;plan.history.push(lead);
   if(id==='local:spouse')return leadEvent(s,'lead','街坊请你在闲时帮一回工，你记下日子，打算去与同龄人一道做事。');
   const route=globalThis.TouhouRelationshipData.find(r=>r.id===id),view=R.romanceView(route),dream=mode(view)==='dream';
   return leadEvent(s,'lead',dream?'你在旧记事里读到「'+view.contact.place+'」，几夜梦里都见到相似景象，便开始记下醒来前的路。':'一份去往「'+view.contact.place+'」的探访差事传到你手中，你记下引路人的约定，着手准备。');
  }
  if(lead.id==='local:spouse')return null;
  const route=globalThis.TouhouRelationshipData.find(r=>r.id===lead.id),r=s.relations[lead.id],view=R.romanceView(route),domain=domains[view.contact.domain];
  if(rng()>=.8)return null;
  if(lead.preparations>=config.meetingPreparationLimit&&!entryReady(s,route)){return leadEvent(s,'preparation-ended','准备做了几回，仍有难以办妥的事，你回信谢过引路人，把这趟探访留待以后。',{}, {apply:x=>finishLead(x,'unprepared')});}
  const course=courseNeeded(s,route,null);if(course)return courseEvent(s,course);
  const needs={...route.entry.min};for(const [k,v]of Object.entries(domain.min||{}))needs[k]=Math.max(needs[k]||0,v);
  const stat=neededStat(s,needs),xp=Math.max(0,(domain.xp||0)-s.xp),n=lead.preparations;
  if((stat||xp)&&n<config.meetingPreparationLimit)return leadEvent(s,'preparation:'+n,stat?travelWords[stat][n%2]:'你跟着递送队走完一次练习行程，回来把接应的时辰和归路重新核了一遍。',stat?{[stat]:1}:{},{xp:xp?1:0,apply:()=>{lead.preparations++;}});
  if(!canMeet(s,view)){
   if(stat||xp)return null;
   return eventFor(view.contact.domain);
  }
  if(!R.matches(s,null,route.entry)&&route.preparedEntry&&!s.flags.has('visit:'+route.id))return leadEvent(s,'visitor',route.id==='eirin'?'你托送药人向永远亭递去一份起居记录，约好上门核对身体近况。':'你安排好住处的事务，托人核清「'+view.contact.place+'」的访客时段，答应按约往返。',{}, {set:['visit:'+route.id]});
  if(s.age<route.entry.minAge||!entryReady(s,route))return null;
  if(gateAvailable(s,route))return gateEvent(route);
  if(!gateReady(s,route)||R.activeCount(s)>=R.maxActive||s.age<R.introductionDueAt(s))return null;
  const allowed=s.romanceWish===route.id||rng()<config.mutualRomanceChance;
  if(!allowed&&!canMeet(s,route))return leadEvent(s,'dream-farewell','梦里的来往停在几句问候。你醒来记下旧路，此后也只偶尔梦见那处灯火。',{}, {apply:x=>finishLead(x,'dream-acquaintance')});
  const e=R.introduction(route,s,allowed,true,'visit'),apply=e.apply;
  e.apply=state=>{apply(state);finishLead(state,'introduced');};return e;
 }
 function available(s){
  if(s.character||s.realm!=='gensokyo'||s.age<18)return [];
  return Object.entries(domains).filter(([id,d])=>!local.has(id)&&!s.flags.has('contact:'+id)&&s.xp>=(d.xp||0)&&Object.entries(d.min).every(([k,v])=>s.stats[k]>=v)&&globalThis.TouhouRelationshipData.some(route=>(route.contact.domain===id||route.romanceContact?.domain===id&&globalThis.TouhouRelationships.freePartner(s))&&(!s.relations[route.id]||route.romanceContact?.domain===id&&globalThis.TouhouRelationships.oldFriend(s,route,false))&&s.people[route.id]?.alive!==false&&entryReady(s,route)));
 }
 function eventFor(id){const d=domains[id];return {id:'contact:'+id,text:d.text,effects:{},weight:1,repeat:1,set:['contact:'+id],scene:d.label};}
 function gateReady(s,route){
  if(!route.romance)return false;
  const view=globalThis.TouhouRelationships.romanceView(route);
  return canMeet(s,view)&&(!route.romanceGate.transition||s.flags.has('contact-person:'+route.id));
 }
 function gateAvailable(s,route){
  return route.romance&&route.romanceGate.transition&&!s.flags.has('contact-person:'+route.id)&&!s.character&&!s.ended&&!s.afterlife&&!s.dormant&&s.realm==='gensokyo'&&s.body==='humanoid'&&s.age>=18&&s.people[route.id]?.alive!==false&&(!s.people[route.id]||s.people[route.id].leaveAt>s.age)&&!s.relations[route.id]?.romanceClosed&&globalThis.TouhouRelationships.freePartner(s)&&canMeet(s,globalThis.TouhouRelationships.romanceView(route))&&entryReady(s,route);
 }
 function gateEvent(route){
  const view=globalThis.TouhouRelationships.romanceView(route);
  return {id:'contact-person:'+route.id,text:route.romanceGate.text,effects:{},weight:1,repeat:1,minAge:18,with:[route.id],set:['contact-person:'+route.id],scene:route.romanceGate.label+' · '+view.contact.place,contactMedium:mode(view),when:s=>gateAvailable(s,route),apply:s=>{if(!s.relations[route.id])s.people[route.id].medium=mode(view);}};
 }
 function select(s,rng){
  if(s.character||s.ended||s.afterlife||s.dormant||s.realm!=='gensokyo'||s.body!=='humanoid'||s.age<18)return null;
  const R=globalThis.TouhouRelationships,open=new Set(available(s).map(([id])=>id));
  // Draw people directly. Shared destinations do not divide a person's weight by
  // the number of other visitors; a single completed trip can open several routes.
  const candidates=globalThis.TouhouRelationshipData.flatMap(route=>{
   if(s.people[route.id]?.alive===false||s.people[route.id]?.leaveAt<=s.age||!entryReady(s,route))return [];
   const romantic=route.romance&&R.freePartner(s),view=romantic?R.romanceView(route):route,domain=view.contact.domain;
   const missing=!canMeet(s,view)&&open.has(domain),bridge=romantic&&gateAvailable(s,route);
   if(!missing&&!bridge)return [];
   const weight=(route.romanceGate?.category==='pc98'?globalThis.TouhouLifeConfig.pc98RomanceWeight:1)*(s.romanceWish===route.id?globalThis.TouhouLifeConfig.contactWishWeight:1);
   return [{route,domain,bridge:!missing&&bridge,weight}];
  });
  if(!candidates.length||rng()>=globalThis.TouhouLifeConfig.contactChance*(s.species==='human'?globalThis.TouhouLifeConfig.humanContactMultiplier:1))return null;
  let pick=rng()*candidates.reduce((sum,c)=>sum+c.weight,0),index=0;
  while(index<candidates.length-1&&pick>=candidates[index].weight)pick-=candidates[index++].weight;
  const chosen=candidates[index];return chosen.bridge?gateEvent(chosen.route):eventFor(chosen.domain);
 }
 // These short visits are memories, not relationship-graph nodes: no trust, romance,
 // adult access permit or skill points are granted. A seed-local draw keeps this
 // extra narration from consuming the main life's random stream.
 const childhoodVisits=[
  ['keine','寺子屋','慧音扶住你总是歪斜的纸，教你把自己的名字写完整。','你把旧字帖带回寺子屋，慧音圈出进步的一笔，让你自己找另一笔。','慧音还记得你小时候写名字的样子。'],
  ['alice','人里的小戏台','家人领你看人偶戏。爱丽丝让一只小偶向你行礼，你认真回了一礼。','你又在集市看见那座小戏台，爱丽丝让你帮忙挑一块布景的颜色。','爱丽丝认出了当年给人偶回礼的小观众。'],
  ['rinnosuke','香霖堂','随家人去香霖堂时，你指着一件怪器物发问，霖之助拿纸画出它的用法。','你又随家人送旧物来，霖之助听完你的猜测，取出另一件让你比一比。','霖之助记起你小时候对那件怪器物的追问。'],
  ['mamizou','人里街头','集市散场，猯藏看你数铜钱数乱了，教你分成几小堆，再叫家人来核。','你在摊边认出猯藏，她让你先看清秤，再听摊主报数。','猯藏笑着问，你如今数账还会不会弄乱。'],
  ['byakuren','命莲寺','家人带你避雨，白莲递来干布，让你坐在檐下等衣角晾干。','再去寺里时，你帮着叠好干布；白莲道谢，又听你讲近来的功课。','白莲记得那个在寺檐下等雨停的孩子。'],
  ['meiling','红魔馆门前','你随家人送货到馆前，美铃替你扶稳篮子，笑着指给你回程的路。','再次随家人送货，美铃看你站得不稳，教你换个省力的提篮姿势。','美铃认出你，问起当年总提歪的那只篮子。'],
  ['kyouko','命莲寺门口','寺前忽然传来响亮的问候，你吓得躲到家人身后；响子蹲低些，笑着再问一声。','你到寺前帮忙扫落叶，响子与你轮流招呼来客，这次你答得很响。','响子还记得你后来终于响亮的那声问候。'],
  ['ichirin','命莲寺院里','一轮领你和家人穿过寺院。你抬头看云山，她提醒你先看脚下的台阶。','你在寺院搬小凳，一轮让你只拿稳当的一张，余下的交给她。','一轮记得你小时候抱着小凳走得格外认真。'],
  ['shou','命莲寺','星看你迟迟不敢进门，便替你和家人挪开门边的杂物，请你慢慢走。','你随家人送来供花，星与你找了个稳妥的位置，让花枝避开过路的人。','星还记得你来寺里摆供花的那一天。'],
  ['kogasa','人里雨巷','雨点落下来，小伞把你送到家人身边，等你道谢才忽然做了个鬼脸。','你在雨巷认出小伞，这回没被吓住；她不服气，换了个怪声逗你笑。','小伞一眼认出你，提起从前没吓成功的那次。'],
  ['wakasagihime','湖边浅岸','你随大人走到浅岸，若鹭姬从水中唱起一小段歌；你隔着岸石听到末尾。','再到浅岸时，你认出了那段歌，若鹭姬慢慢唱，让你跟上最后一句。','若鹭姬记得你在岸边跟唱过的那段歌。'],
  ['kagerou','人里外的路口','你随家人走岔了路，影狼站在路口指向村子，等你们看清路牌才离开。','你又随家人经过路口，把认得的路牌念给影狼听，她点头让你带路。','影狼还记得你学着辨认路牌的样子。'],
  ['nazrin','寺院石阶','你在石阶旁找丢失的木纽扣，娜兹玲问清你走过哪里，领你沿原路找回。','你拾到别人掉的布袋，先去问娜兹玲；她陪你找到失主，听你说清经过。','娜兹玲认出了当年找木纽扣的孩子。'],
  ['aunn','博丽神社','家人上香时，阿吽陪你数石阶，走到最上面又一起核了一遍。','再随家人上山，你记得石阶数目，阿吽笑着让你领大家慢慢走。','阿吽还记着与你数过的那段石阶。'],
  ['miyoi','鲵吞亭门前','你随家人送菜到店里，美宵倒来一碗温水，让你先把一路的汗擦干。','你在店门口归还菜篮，美宵问你近来学了什么，听你念完一首短诗。','美宵认出了从前帮家人送菜的你。'],
  ['suika','神社祭日','祭日人多，萃香举起一块写路的木牌，让你和家人从空处走过去。','你帮家人收祭日的垫子，萃香卷起大的一张，留给你轻便的那张。','萃香记起你在祭日认真卷垫子的样子。'],
  ['aya','人里街头','文要给街头拍照，先请你和家人站稳；你看着镜头，努力忍住眨眼。','再见到文，你指认报纸上熟悉的街角。她听你说完，记下新开的小铺。','文记得你曾指着报纸认出自家附近的街角。'],
  ['hatate','集市','果在集市看你画摊位，指出漏掉的一张招牌；你补好后，把画举给她看。','你又拿画来给果看，她让你换个角度观察，你发现屋檐挡住了一角。','果还记得你画过的集市和那张漏掉的招牌。'],
  ['sekibanki','人里小巷','你抱着书在巷口等家人，赤蛮奇站远些替你指路，等熟悉的声音到了才走。','你又在巷口遇见赤蛮奇，先说清要去哪里；她听完，指给你较近的路。','赤蛮奇认出了从前在巷口等家人的你。']
 ];
 function childhood(s,record,meet){
  if(s.character||s.life!=='human'||s.realm!=='gensokyo'||s.afterlife||s.dormant||s.age<4||s.age>=18)return;
  const E=globalThis.TouhouEngine,rng=E.random(s.seed^0x613a4);
  const peers={4:'邻家的孩子陪你在门前摆石子，家人坐在一旁，看你们争着数哪一排更长。',9:'你与旧日玩伴赶集，各记一半要买的东西，回来时一项项核对。',15:'你与旧日玩伴帮街坊搬节日的灯，分好轻重，忙完坐在门槛上讲各自的打算。'};
  if(peers[s.age]&&s.people['local:childhood']?.alive!==false){meet(s,'local:childhood',E.random(s.seed^41));record(s,'childhood:local:'+s.age,peers[s.age],{}, {with:['local:childhood'],scene:'少时来往 · 人里'});}
  const first=Math.floor(rng()*childhoodVisits.length);
  const second=(first+1+Math.floor(rng()*(childhoodVisits.length-1)))%childhoodVisits.length;
  const ages=[6+Math.floor(rng()*3),10+Math.floor(rng()*3),14+Math.floor(rng()*3)],stage=ages.indexOf(s.age);
  if(stage<0)return;
  const visit=childhoodVisits[stage===2?second:first],id=visit[0];
  if(s.people[id]?.alive===false)return;
  meet(s,id,rng);
  const repeated=stage===1,text=visit[repeated?3:2],key='childhood:'+id+':'+(repeated?'return':'meet');
  s.childhood.push({id,age:s.age,key});
  record(s,key,text,{}, {with:[id],scene:'少时来往 · '+visit[1]});
 }
 function reunion(s,id){return s.childhood.some(m=>m.id===id)?childhoodVisits.find(v=>v[0]===id)[4]:'';}
 globalThis.TouhouContacts={childhood,reunion,childhoodVisits,domains,canMeet,entryReady,gateReady,gateAvailable,gateEvent,scene,mode,select,available,eventFor,affinities,relatedWeight,prospect,leadCandidates,leadWeight,waitingPractice,practiceEvent};
})();
