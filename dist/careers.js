/* Ordinary careers advance through paid work, years of practice and teaching. */
(() => {
 const jobs={scholar:'抄书人',garden:'农人',trade:'行商',craft:'手艺人',medicine:'药师',magic:'魔法修习'};
 const roles={
  scholar:{labels:['学徒','独立谋生','校书','传承'],
   work:[["你抄完一页旧书，跟着师傅逐字校对。", "你照师傅留下的圈点重抄错行，逐处记好缘由。"], ["你按约抄好一册书，收下纸墨钱与工钱。", "你替书铺誊清一份目录，领回说好的报酬。"], ["你比对几种旧本，校清错字，书铺添了一份酬金。", "你补齐残页间的异文，书铺照工计酬。"], ["你带后辈校完一册书，留下自己常用的批注。", "你看后辈说出校字的理由，把这次心得写在页边。"]],
   promotion:['你已能独自抄清书稿，书铺开始按册付钱。','多年抄校后，书铺把残本校订交给你负责。','你把校书笔记交给后辈，带着他们接起书铺的活。'],
   effects:[{insight:1},{fortune:1},{fortune:2,insight:1},{fortune:1,bond:1}]},
  garden:{labels:['学徒','独立谋生','管田','传承'],
   work:[["你跟着老农认种、理沟，记下这一季的做法。", "你随老农查看土墒，学着分清该留的苗。"], ["你照料好自己接手的田地，卖出一批收成。", "你赶早收好熟菜，挑到集市换回用度。"], ["你带人疏通水渠，调整播种，收成多留下一份。", "你替几户排好轮水时辰，秋后分得额外的收成。"], ["你把种子分给后辈，一起看过他们新理的田。", "你陪后辈沿田埂认苗，听他们说明这一季的打算。"]],
   promotion:['你学会安排一季农事，独自接下一小片田。','几季收成稳下来，邻人托你统筹水渠与播种。','你把多年记下的农时教给后辈，田间杂务渐渐交出去。'],
   effects:[{insight:1},{fortune:1},{fortune:2,insight:1},{fortune:1,bond:1}]},
  trade:{labels:['学徒','独立谋生','领货','传承'],
   work:[["你随行核过货单与账目，学会估量路费。", "你帮同伴点清包裹，核出一笔漏记的运费。"], ["你送妥一批日用品，扣去路费后存下一点钱。", "你按约把杂货送到邻村，结清这一趟账。"], ["你替几家铺子排好供货，收到约定的分成。", "你协调几家铺子的收货时辰，领回这批货的酬劳。"], ["你带后辈核过账目，把熟悉的供货人介绍给他们。", "你陪后辈与旧主顾核价，让他们自己说清交货约定。"]],
   promotion:['你算清进货与路费，开始独自做小本买卖。','几家铺子认可你的守信，请你统筹定期供货。','你把老账本与货路交给后辈，陪他们做成第一单。'],
   effects:[{insight:1},{fortune:1},{fortune:2,bond:1},{fortune:1,bond:1}]},
  craft:{labels:['学徒','独立谋生','熟匠','传承'],
   work:[["你跟着师傅修平榫口，再试过一遍松紧。", "你照师傅的示范磨齐木边，摸清顺纹下手的方向。"], ["你修好送来的旧物，按约收下手工钱。", "你补妥一张摇晃的木凳，交给客人试稳后结账。"], ["你改好一套耐用的结构，工房接来更讲究的订单。", "你校正一件细木活的接缝，工房按精工添了酬劳。"], ["你教后辈辨清木料与榫口，一起交妥工房的活。", "你看后辈试合木件，指明松紧处，让他们亲手修好。"]],
   promotion:['你已能独自修补旧物，攒下材料钱后开始接活。','多年修补练出手感，工房把精细活交给你负责。','你把常用工具与图样交给后辈，带着他们做完一件成品。'],
   effects:[{insight:1},{fortune:1},{fortune:2,insight:1},{fortune:1,bond:1}]},
  medicine:{labels:['见习','独立谋生','配药','传承'],
   work:[["你核对药草名目，跟着药师称好一份常用药。", "你在药师指点下分好待用药材，逐包核对标签。"], ["你辨清药材，配妥常用的药草，收下酬金。", "你替邻人备妥约好的常用药，记清账后收下工钱。"], ["你整理几季用药记录，改好一份常用配方。", "你复核旧方的用药记录，给新一季的药材补齐标签。"], ["你教后辈辨草、称药，把用药记录留给他们。", "你与后辈核完药材名目，让他们复述每一处易混之处。"]],
   promotion:['你学会常用药的分量，开始独自接些配药差事。','多年配药留下记录，邻里把常用药的准备交给你。','你把配药记录交给后辈，陪他们核过每一味药。'],
   effects:[{insight:1},{fortune:1},{fortune:1,insight:1},{fortune:1,bond:1}]},
  magic:{labels:['修习','独立谋生','术式研究','传承'],
   work:[["你照着笔记练习小术式，记下耗材与错处。", "你反复试过书中的小术式，将成功的手法抄在页边。"], ["你用练熟的小魔法换来纸墨，留下余钱。", "你替来客修好一件小魔法用具，换回下一回试验的用度。"], ["你改好一段稳定的术式，受托修妥几件魔法器物。", "你核过术式的每处变化，交妥受托修理的器物。"], ["你带求学者练过小术式，把试错笔记留给对方。", "你看求学者独自试完术式，再一起对照笔记找出错处。"]],
   promotion:['你练熟几样实用术式，开始靠小魔法接活。','多年试验积下记录，你开始独自改写常用术式。','你把最初的魔导书与笔记交给求学者，陪他们练成小术式。'],
   effects:[{insight:1},{fortune:1},{fortune:1,insight:1},{fortune:1,bond:1}]}
 };
 const living=s=>!s.ended&&!s.afterlife&&!s.dormant&&s.body==='humanoid'&&s.life!=='spirit'&&!s.character;
 const environment=s=>s.afterlife||s.body==='spirit'?'spirit':s.species==='vampire'?'night':['hermit','shikaisen'].includes(s.species)||s.habitat==='mountain'?'mountain':s.species==='youkai'?'outskirts':s.species==='magician'?'forest':'village';
 function init(s){
  if(s.ended||s.character||!roles[s.career])return s.careerDevelopment||null;
  const previous=s.careerDevelopment;
  if(previous?.id===s.career)return previous;
  const learnedMagic=s.career==='magic'&&s.flags.has('human-magic');
  const stage=learnedMagic?1:0;
  const entry={id:s.career,stage,age:s.age,event:learnedMagic?'chance:magician-1-pass':'entry'};
  s.careerDevelopment={id:s.career,stage,since:s.age,stageSince:s.age,practice:0,stagePractice:0,projects:0,apprentices:0,
   history:[...(previous?.history||[]),entry],previous:previous?[...(previous.previous||[]),{id:previous.id,stage:previous.stage,practice:previous.practice,since:previous.since,until:s.age}]:[],
   transition:null,environment:environment(s),adaptationPending:false,suspended:!living(s),lastAt:null,lastTurn:null,lastWorkedAt:null,serial:s.log.reduce((max,e)=>e.id.startsWith('career:'+s.career+':')?Math.max(max,Number(e.id.split(':').at(-1))):max,0)};
  return s.careerDevelopment;
 }
 // 退休仍可完成已经开始的教学实践；普通营生继续遵守原退休规则。
 const studying=s=>globalThis.TouhouPartnerLearning.needsWork(s)||globalThis.TouhouGuidance.needsWork(s);
 function event(s,key,text,effects,apply,rules={}){
  const d=s.careerDevelopment,id=`career:${d.id}:${key}:${d.serial+1}`;
  return {id,text,effects,weight:1,repeat:1,needsFreedom:true,bodies:['humanoid'],
   when:state=>living(state)&&!state.injured&&state.stats.health>0&&state.career===d.id&&state.careerDevelopment===d&&d.serial+1===Number(id.split(':').at(-1))&&(!state.retired||d.stage>=2||studying(state)),
   apply:(state,rng)=>{d.serial++;d.lastAt=state.age;d.lastTurn=state.turn;apply(state,d,rng);},...rules};
 }
 function practice(s,d,n=1){d.practice+=n;d.stagePractice+=n;d.lastWorkedAt=s.age;}
 function promote(s,d){
  const next=d.stage+1,role=roles[d.id];
  const effects=next===3?{bond:2}:{fortune:1,insight:1};
  return event(s,'stage-'+next,s.retired&&next===1?'积累的练习已经做稳，你能独立完成'+jobs[d.id]+'的差事。':role.promotion[next-1],effects,(state,current)=>{
   current.stage=next;current.stageSince=state.age;current.stagePractice=0;
   if(next===3)current.apprentices++;
   current.history.push({id:current.id,stage:next,age:state.age,event:'promotion'});
   state.flags.add(`career:${current.id}:stage:${next}`);
  },{xp:2});
 }
 function medicine(s,d,rng){
  if(!['garden','scholar'].includes(d.id)||d.stage<1||s.opportunity||s.development)return null;
  // 伴侣课程保留原职业与新工作基线；中途转训会换职业并重置 practice，使后续课程失配。
  // 只暂停当前伴侣的未完课程期间的转训，已完成或离世后的历史课程不阻止医学转训。
  if(globalThis.TouhouPartnerLearning.inProgress(s))return null;
  const t=d.transition;
  if(!t){
   const knowsHerbs=s.remedy||s.talents.some(id=>['herbal','healing'].includes(id))||(s.seen['common:herbs-pick']||0)>0;
   if(!knowsHerbs||s.stats.insight<7||rng()>=.12)return null;
   return event(s,'medicine-observe','你把辨过的药草带给药师，开始随他认药、核对分量。',{fortune:-1,insight:1},(state,current)=>{
    current.transition={kind:'medicine',stage:1,since:state.age,startedAge:state.age,practiceAt:current.practice};
    current.history.push({id:current.id,stage:current.stage,age:state.age,event:'medicine-observe'});
   },{xp:1});
  }
  if(t.kind!=='medicine'||s.age-t.since<3||d.practice-t.practiceAt<2)return null;
  if(t.stage===1)return event(s,'medicine-assist','你跟着药师配过几季常用药，逐一记下药材与分量。',{insight:1},(state,current)=>{
   current.transition.stage=2;current.transition.since=state.age;current.transition.practiceAt=current.practice;
   current.history.push({id:current.id,stage:current.stage,age:state.age,event:'medicine-assist'});
  },{xp:2});
  if(s.stats.insight<9)return null;
  return event(s,'medicine-enter','多年见习后，你独自接起常用药的配制，把原先的营生交妥。',{fortune:1,insight:1},(state,current)=>{
   current.previous.push({id:current.id,stage:current.stage,practice:current.practice,since:current.since,until:state.age});
   current.id=state.career='medicine';current.stage=1;current.since=current.stageSince=state.age;
   current.practice=4;current.stagePractice=0;current.projects=0;current.transition=null;
   current.history.push({id:'medicine',stage:1,age:state.age,event:'medicine-enter'});
   state.flags.add('career:medicine:trained');
   state.remedy=true;state.remedyAt=state.age;
  },{xp:2});
 }
 function adapt(s,d){
  const text={
   night:'你把交货与接活改到入夜，重新安排旧营生的时辰。',
   mountain:'你在山中收拾工具与旧账，托熟人往返送货，续上原先的营生。',
   outskirts:'你与旧主顾约好在村外交货，原先的手艺仍能换来用度。',
   forest:'你在林间安顿好旧书与用具，把谋生的差事排进修习日程。',
   village:'你重新核过附近的差事，接续自己熟悉的营生。'
  }[d.environment];
  return event(s,'adapt',text,{fortune:-1,insight:1},(state,current)=>{current.adaptationPending=false;current.history.push({id:current.id,stage:current.stage,age:state.age,event:'adapt-'+current.environment});},{xp:1});
 }
 function select(s,rng){
  if(!living(s)||s.age<16||s.injured||s.stats.health<=0)return null;
  const d=init(s);if(!d)return null;
  const study=s.retired&&d.stage<2&&studying(s);if(s.retired&&d.stage<2&&!study)return null;
  if(d.lastTurn===s.turn||d.lastAt!==null&&s.age-d.lastAt<1)return null;
  if(d.adaptationPending)return adapt(s,d);
  const years=s.age-d.stageSince;
  // 长生步幅可能一跃数年，年资不能代替实际练习；两项都达成才晋升一个阶段。
  const ready=d.stage===0?s.age>=20&&years>=3&&d.stagePractice>=4:d.stage===1?s.age>=28&&years>=7&&d.stagePractice>=5:d.stage===2?s.age>=50&&years>=12&&d.stagePractice>=5:false;
  if(ready)return promote(s,d);
  const chance=Math.min(.8,[.5,.4,.32,.24][d.stage]*(s.flags.has('legend:insight')?1.5:1));
  if(rng()>=chance)return null;
  const retrain=s.retired?null:medicine(s,d,rng);if(retrain)return retrain;
  if(d.id==='craft'&&!s.tools&&(!s.retired||study)){
   const buy=s.stats.fortune>=2;
   return event(s,'tools',buy?'你买齐修补用的小工具，试好后收进工房。':'你向师傅借来一套工具，修好旧物后仔细收存。',buy?{fortune:-1}:{},(state,current)=>{state.tools=true;current.borrowedTools=!buy;},{xp:1});
  }
  const stage=s.retired&&!study?3:d.stage,role=roles[d.id];
  let text=role.work[stage][d.stagePractice%2];
  if(d.environment==='night')text=d.id==='garden'?(d.stagePractice%2?'你在月下核过药圃的收成，装好送货人明早要取的篮子。':'你入夜后照料背阴的药圃，把收成留给约好的送货人。'):'入夜后，'+text.slice(1);
  else if(d.environment==='outskirts')text+='约好的主顾在村外取货。';
  else if(d.environment==='mountain')text+='主顾托熟人往返山间。';
  else if(d.environment==='forest'&&d.id!=='magic')text+='访客来林间取走成品。';
  const effects={...role.effects[stage]},wear=d.id==='garden'&&!s.retired?(stage<2?.3:.1):0;
  return event(s,'work-'+stage,text,effects,(state,current)=>{
   practice(state,current);
   if(stage>=2)current.projects++;
   if(stage===3&&current.projects%3===0)current.apprentices++;
   if(current.id==='medicine'){state.remedy=true;state.remedyAt=state.age;}
   if(current.id==='magic')state.flags.add('career:magic:practiced');
  },{xp:stage===2?2:1,wear});
 }
 function onTransform(s,kind){
  if(s.ended)return;
  const d=init(s);if(!d)return;
  d.environment=environment(s);d.suspended=!living(s);
  d.adaptationPending=!d.suspended;
  d.transition=null;
  d.history.push({id:d.id,stage:d.stage,age:s.age,event:'transform-'+kind});
 }
 function description(s){
  if(!s.career)return '';
  if(s.character||!roles[s.career])return globalThis.TouhouEvents.jobs[s.career];
  const d=s.careerDevelopment;
  if(!d||d.id!==s.career)return jobs[s.career];
  const label=roles[d.id].labels[d.stage];
  return (s.afterlife||s.body==='spirit'?'生前':'')+jobs[d.id]+' · '+(s.retired&&d.stage<2?(studying(s)?'继续课业':'歇业'):label);
 }
 globalThis.TouhouCareers={init,select,onTransform,description};
})();
