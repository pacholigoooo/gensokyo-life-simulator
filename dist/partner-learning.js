/* Optional, staged partner teaching. Canon and simulation policy: docs/partner-learning-v11.md. */
(() => {
 const teachers={alice:'magician',byakuren:'magician',patchouli:'magician',seiga:'hermit',miko:'hermit',futo:'hermit',kasen:'hermit',eirin:'care',marisa:'magician',remilia:'vampire',flandre:'vampire',yukari:'boundary',okina:'vitality',keine:'scholar'};
 const pupils={reimu:['hermit','care'],sanae:['hermit','care'],marisa:['magician','care'],sakuya:['care'],kosuzu:['scholar','care'],akyuu:['care']};
 const mageSource='https://thbwiki.cc/东方求闻史纪/魔法使/中日对照';
 const hermitSource='https://thbwiki.cc/东方求闻史纪/仙人';
 // span is a remaining lifespan, never a time limit for observing the story.
 // Unknown canon lifespans stay unbounded here; ageless does not grant damage immunity.
 function personProfile(id){
  const c=globalThis.TouhouContent?.find(c=>c.id===id);if(!c)return null;
  const profile={species:c.life,life:c.life,body:c.body,career:c.career,ageless:!['human','beast'].includes(c.life),span:null,source:c.source,policy:'既有同伴寿程；非人默认不排自然老死，不表示伤害免疫。'};
  if(['alice','patchouli'].includes(id))Object.assign(profile,{species:'magician',life:'long',ageless:true,span:Infinity,magicOrigin:id==='alice'?'learned':'born',source:mageSource,policy:'以既有具名长寿魔法使展开来往，不编造剩余自然寿限；个人舍虫日期未知，不表示伤害免疫。'});
  if(id==='byakuren')Object.assign(profile,{species:'magician',ageless:true,span:Infinity,source:'https://thbwiki.cc/附带文档:东方星莲船/角色设定%26ExStory',policy:'个人返老还童设定支持不排自然老死；不表示免伤或蓬莱再生。'});
  if(id==='seiga')Object.assign(profile,{species:'hermit',ageless:false,span:Infinity,source:hermitSource,policy:'已知长期修持的邪仙没有已知剩余寿限；同伴不凭观察年限离世，扮演时仍有修持与追索风险。'});
  if(['miko','futo'].includes(id))Object.assign(profile,{species:'shikaisen',ageless:true,span:Infinity,source:'https://thbwiki.cc/东方求闻口授/物部布都/中日对照',policy:'沿本作尸解仙复苏后停止老化机制，不宣称原作永久免死或伤害免疫。'});
  if(id==='kasen')Object.assign(profile,{species:'oni',source:'https://thbwiki.cc/东方茨歌仙/最终话',policy:'保留鬼的原身份与仙道修行；不套用普通人修成仙人的寿程。非人默认不排自然老死是本作政策，不表示免伤。'});
  if(['remilia','flandre'].includes(id))Object.assign(profile,{species:'vampire',source:`https://thbwiki.cc/东方求闻史纪/${id==='remilia'?'蕾米莉亚':'芙兰朵露'}·斯卡蕾特/中日对照`,policy:'保留吸血鬼原身份；非人默认不排自然老死是本作政策，仍有日光、流水等弱点，不表示绝对不死。'});
  if(id==='yukari')Object.assign(profile,{species:'youkai',source:'https://thbwiki.cc/东方求闻史纪/八云紫/中日对照',policy:'保留边界妖怪身份；伴侣跨界转化是本作新编，不表示原作既有授永生方法。'});
  if(id==='okina')Object.assign(profile,{species:'kami',source:'https://thbwiki.cc/附带文档:东方天空璋/Omake#摩多罗隐岐奈',policy:'保留秘神身份；生命力恩惠在本作仅有限调养，不复制神格或停止老化。'});
  return profile;
 }
 function pair(s){
  if(!s||s.character||s.ended||s.afterlife||s.dormant||s.body!=='humanoid'||s.realm!=='gensokyo'||s.life==='spirit'||s.age<20||s.stats.health<=0||s.injured||s.pendingCause||!s.partnerId||s.firstPartnerId!==s.partnerId)return null;
  const id=s.partnerId,r=s.relations?.[id],p=s.people?.[id],c=globalThis.TouhouContent?.find(c=>c.id===id),route=globalThis.TouhouRelationshipData?.find(r=>r.id===id);
  if(!r||r.status!=='lover'||r.next!==null||!Number.isFinite(r.loveAt)||s.age-r.loveAt<3||!p?.alive||!(p.leaveAt>s.age)||p.afterlife||p.dormant||!c||!route||c.body!=='humanoid')return null;
  if(Object.values(s.relations).filter(r=>r.status==='lover').length!==1)return null;
  const view=r.romancePath&&route.romanceContact?{...route,contact:route.romanceContact}:route;
  if(r.medium!=='visit'||p.medium==='dream'||view.contact.domain.includes('dream'))return null;
  return {id,r,p,c,route:view};
 }
 function careerSkill(s,id){
  const d=s.careerDevelopment;
  return s.career===id&&d?.id===id&&d.stage>=2&&d.practice>=9&&d.projects>=1;
 }
 function teacherAbility(s,kind){
  if(s.xp<12||s.stats.insight<10)return false;
  if(kind==='magician')return s.species==='magician'&&s.magic?.ageless===true&&s.magic.stage==='complete'&&s.stats.insight>=14;
  if(kind==='hermit')return ['hermit','shikaisen'].includes(s.species)&&!!s.hermit&&s.stats.health>=8&&s.stats.insight>=12;
  if(!['care','scholar'].includes(kind))return false;
  return careerSkill(s,kind==='care'?'medicine':'scholar');
 }
 // 课程开始后先完成当前实践；新修行或转训不能中途换掉它所依赖的身体、职业。
 function inProgress(s){return Object.values(s.partnerStudy?.[s.partnerId]||{}).some(p=>p.stage>0&&p.stage<p.maxStages);}
 function ordinaryHuman(s){return s.species==='human'&&!s.transformation;}
 function maxStages(kind){return ['boundary','vitality'].includes(kind)?4:3;}
 function availableKind(s,q,direction,progress){
  if(s.opportunity||s.development||s.careerDevelopment?.transition)return null;
  if(direction==='receive'){
   const kind=teachers[q.id];
   if(!kind||!ordinaryHuman(s)||s.stats.insight<(kind==='scholar'?7:8)||s.xp<4)return null;
   if(!progress&&kind==='scholar'&&s.career==='scholar')return null;
   return kind;
  }
  if(q.c.life!=='human'||!pupils[q.id])return null;
  const species=q.p.species??q.c.life;
  if(progress){
   const kind=progress.kind;
   if(species!=='human'&&!(kind==='magician'&&progress.stage===2&&species==='magician'))return null;
   return pupils[q.id].includes(kind)&&teacherAbility(s,kind)?kind:null;
  }
  if(species!=='human')return null;
  return pupils[q.id].find(kind=>teacherAbility(s,kind))||null;
 }
 function thresholds(s,q,direction,kind,stage,progress){
  // 已等待足够年数仍不能跳级：练习次数和历史必须共同证明上一阶段确实发生。
  if(stage>1&&(progress?.stage!==stage-1||progress.practice!==stage-1||progress.history?.length!==stage-1))return false;
  if(direction==='receive'&&kind==='boundary'){
   if(stage===1)return s.age>=24&&s.age-q.r.loveAt>=6&&s.stats.insight>=10&&s.xp>=8&&s.stats.bond>=9&&s.stats.fortune>=4;
   if(s.stats.insight<(stage===4?14:stage===3?13:11)||s.xp<(stage===4?12:stage===3?10:9)||s.stats.health<(stage>=3?7:5)||s.stats.bond<(stage===4?10:9))return false;
   if(stage===2)return s.stats.fortune>=4;
   if(!progress.anchor||!progress.history.some(h=>h.eventId===progress.anchor.eventId&&h.stage===2))return false;
   return stage===3?s.stats.fortune>=2:progress.trialEvent===progress.history.at(-1).eventId;
  }
  if(direction==='receive'&&kind==='vitality'){
   if(stage===1)return s.age>=24&&s.stats.insight>=9&&s.xp>=6&&['scholar','garden','trade','craft','medicine','magic'].includes(s.career);
   if(s.stats.insight<(stage===4?12:stage===3?11:10)||s.xp<(stage===4?12:stage===3?10:8)||s.stats.health<(stage===3?6:5))return false;
   if(stage===2)return s.career===progress.workCareer&&s.careerDevelopment?.id===progress.workCareer&&Number.isFinite(progress.workAt)&&s.careerDevelopment.practice-progress.workAt>=2;
   if(!progress.seasons||progress.seasons.length!==4)return false;
   return stage===3?true:progress.trialEvent===progress.history.at(-1).eventId;
  }
  if(stage===1)return true;
  if(direction==='teach')return s.xp>=(stage===3?18:14)&&s.stats.insight>=(kind==='magician'&&stage===3?16:12);
  const insight=kind==='scholar'?stage===3?10:8:kind==='care'?stage===3?11:9:stage===3?13:10;
  if(s.stats.insight<insight||s.xp<(stage===3?10:6)||s.stats.health<(['hermit','vampire'].includes(kind)&&stage===3?8:5))return false;
  if(kind==='vampire'&&(s.stats.bond<(stage===3?9:8)||stage===2&&s.stats.fortune<3))return false;
  if(stage===3&&['magician','care','scholar'].includes(kind)){
   const job=kind==='care'?'medicine':kind==='scholar'?'scholar':'magic',d=s.careerDevelopment;
   if(s.career!==job||d?.id!==job||!Number.isFinite(progress.workAt)||d.practice-progress.workAt<(kind==='care'||kind==='scholar'?4:2))return false;
   if(['care','scholar'].includes(kind)&&d.stage<1)return false;
  }
  return true;
 }
 function options(s){
  const q=pair(s);if(!q)return [];
  const options=[],active=Object.entries(s.partnerStudy?.[q.id]||{}).find(([,p])=>p.stage>0&&p.stage<p.maxStages)?.[0];
  for(const direction of ['teach','receive']){
   if(active&&active!==direction)continue;
   const progress=s.partnerStudy?.[q.id]?.[direction];if(progress&&(progress.maxStages!==maxStages(progress.kind)||progress.stage>=progress.maxStages))continue;
   const kind=availableKind(s,q,direction,progress);if(!kind||progress&&progress.kind!==kind)continue;
   const stage=(progress?.stage||0)+1,due=progress?progress.lastAt+3:q.r.loveAt+(kind==='boundary'?6:3);
   if(!thresholds(s,q,direction,kind,stage,progress))continue;
   options.push({q,direction,kind,stage,due,progress});
  }
  return options.sort((a,b)=>a.due-b.due);
 }
 function needsWork(s){
  // 教学所需的营生实践必须来自真正发生的工作事件，不能用等待年数补齐。
  const q=pair(s);if(!q)return false;
  const p=s.partnerStudy?.[q.id]?.receive;
  if(!p||s.age<p.lastAt+3||availableKind(s,q,'receive',p)!==p.kind)return false;
  if(p.kind==='vitality'&&p.stage===1)return s.career===p.workCareer&&s.careerDevelopment.practice-p.workAt<2;
  if(p.stage!==2||!['magician','care','scholar'].includes(p.kind))return false;
  const job=p.kind==='care'?'medicine':p.kind==='scholar'?'scholar':'magic';
  return s.career===job&&(s.careerDevelopment.practice-p.workAt<(p.kind==='magician'?2:4)||p.kind!=='magician'&&s.careerDevelopment.stage<1);
 }
 const receiving={
  alice:[
   '爱丽丝问你愿不愿学些魔法，你应下后，她从细小的魔力控制讲起；你亲手反复练习，把失手的地方记清。',
   '几年练习后，你在爱丽丝指导下稳住实用的小术式，开始以人类之身做魔法差事，逐次记下耗力与错处。',
   '爱丽丝陪你核过多年练习的记录，你亲自维持住舍食之术，成为仍会衰老的魔法使，再与她商量继续自修。'],
  patchouli:[
   '帕秋莉选出适合入门的一页，问你是否愿意学。你认真应下，亲手练习一小段术式，她等你说清每一步。',
   '你在帕秋莉指导下练熟几种小魔法，开始接些魔法差事。她让你自己记下每次用力的变化，你逐项照做。',
   '反复核对术式以后，你在帕秋莉指导下亲自完成舍食，成为魔法使。身体仍会老去，你把后续修习另列成页。'],
  byakuren:[
   '白莲问你是否愿意学着驾驭魔力，你答应后随她练最稳妥的一段。她请你如实说出疲倦，陪你调好节奏。',
   '几年练习让你能稳定施展实用魔法，你接起人类魔法修习的差事。白莲陪你核对进度，仍认真给休息留空。',
   '你将自己的魔力调到稳定，亲自完成舍食之术，踏入魔法使的岁月。白莲握手祝贺，也提醒你继续修习与调养。'],
  seiga:[
   '青娥问你想不想学行气，你愿意后，她讲解入门的节律。你依着方法亲自练过，把自己的感受一处处告诉她。',
   '青娥与你核对几年来的行气记录，你又独自练过一段，渐能调匀呼吸。她讲起长生后的修持与追索，你认真记下。',
   '积年行气终于稳住身体，你在青娥指点下修成仙人。你亲自收好修习记录，继续精进，也开始提防地狱的追索。'],
  miko:[
   '听诉休歇后，神子问你是否愿意学修持。你应下，照她讲的次序自行调息，再将每处不解慢慢问清。',
   '神子听你说明多年调息的心得，请你独自练完一段。你做得稳妥，她继续讲解仙人须面对的劳苦与寿命追索。',
   '你将所学反复用于自身修持，终于成为仙人。神子与你核好往后的练习，提醒长寿仍须维持，也有地狱追索的危险。'],
  futo:[
   '布都问你可愿学些调息修持，你认真答应。她先讲气息的收放，你亲手记下次序，再慢慢练给她看。',
   '你向布都说明几年的练习，她看你调匀气息，认真讲起修持的代价。你把仍需练熟的地方圈好，继续独自用功。',
   '持续的修持令你跨过凡人的寿程，成为仙人。布都欣喜地核看你的进境，你仍日日练习，准备面对往后的追索。'],
  kasen:[
   '华扇问你愿不愿学调息，你认真应下。她等你放稳心神，再讲一段行气的次序；你亲自练过，把不解的地方记清。',
   '山中仙邸旁，你向华扇说明几年自修的感受。她陪你调好节律，也把延寿后须持续修持、面对地狱追索的代价讲清。',
   '积年的自修让你成为仙人，姓名与来处仍记得清楚。华扇看过你的进境，欣慰地笑了；你们坐下来安排往后的功课，也商量如何避开追索。'],
  eirin:[
   '永琳问你愿不愿学着辨药调养，你应下后亲手核一份药材。她逐处指出易混的地方，请你记住自己的身体反应。',
   '多年见习后，你在永琳指导下接起药师学徒的活，继续称药、记录与复核。她让你先把常用的做法练得稳妥。',
   '实际配药与休养的记录渐稳，永琳与你调整日常调养。你的身体耗损缓和，多得一段有限时日，仍按原样饮食歇息。'],
  marisa:[
   '魔理沙问你要不要学点小魔法，你笑着应下。她示范后把材料交给你，让你亲手试过，再一同找出失手的地方。',
   '你把魔理沙教的小术式练熟，开始以人类之身接魔法差事，照常吃饭歇息。她与你对照舍食的书页，约好由你自己练习，她帮忙核记录。',
   '多年自修与实际差事积下记录，你终于维持住舍食，成为仍会衰老的魔法使。魔理沙高兴地拍了拍你的肩；她仍是人类，两人另开一页，商量你接下来的舍虫自修。'],
  remilia:[
   '蕾米莉亚问你愿不愿认真考虑长夜里的生活，你应下后，与她逐项谈清日光与流水的弱点。你们先记好约定，没有急着改变身体。',
   '几年准备后，你与蕾米莉亚核好遮光的住处和约定的夜间食源，亲自练习夜间出行的安排。你仍是人类，愿意准备妥当后再尝试转化。',
   '你与蕾米莉亚按共同的意愿完成多年筹备的转化，成为吸血鬼。她陪你检查住处的厚帘，找出漏光的一角；你用旧名记下夜行安排，留心日光与流水的危险。'],
  flandre:[
   '芙兰问你想不想与她一同过长夜，你认真应下，陪她把吸血鬼怕日光与流水的地方逐项记清。你们说好先学会照顾日常，再考虑身体的改变。',
   '几年间，你与芙兰核好遮光的住处与约定的夜间食源，反复检查入夜出门、天亮前返回的安排。你仍是人类，准备齐全后才继续商量转化。',
   '你与芙兰按共同的意愿完成多年筹备的转化，成为吸血鬼。她开心地帮你收拾旧物，一起摆进厚帘后的住处；说到天亮前回家，你们又重温了日光与流水的危险。'],
  yukari:[
   '紫在神社界线旁问你愿不愿认真学会辨认归路。你应下后，与她观察远近景物怎样在隙间相接，先记清自己从哪里来，也谈清改变身体可能失去什么。',
   '几年观察以后，你写下旧名与人类村落的来处，做成跨界时随身保留的记事。紫陪你核好村外住处，你花去用度备妥旧物与退路，决定先亲自试行。',
   '你依着记事中的归路进入紫开启的隙间，亲自辨过两侧景物，再稳住气息返回。试行耗去体力，也留下身体的疲倦；你仍是人类，和她核清这一回的感受。',
   '你带着旧名记事，按自己的意愿完成跨界修习，成为妖怪。村外的归路仍认得清；紫听你喊出做人时的姓名，含笑迎上来，你走近握住她伸来的手。'],
  okina:[
   '隐岐奈问你愿不愿接受生命力的调养，你应下，也说清想保留自己的记忆与营生。她与你先记好劳作后的疲倦，约定把日常过稳，再考虑后户里的练习。',
   '几年里，你照常做过真实的营生，把春夏秋冬怎样劳作与歇息都记下。隐岐奈陪你核过四季记录，选好后户往返时要记住的节律，原来的职业照旧。',
   '隐岐奈亲自开好背门，你按记过的节律进入后户，又自行辨清返程。门内的季节气息令你疲倦，你先回来歇稳，再把身体的感受逐处告诉她。',
   '多年记录与后户试行渐有成效，隐岐奈按商定的分寸稳固了你有限的生命力。你仍是会老去的人类，记忆与营生照旧；两人翻开作息册，定下下一季复查的日子。'],
  keine:[
   '慧音问你是否愿意认真学抄校，你答应后亲手比对一页旧书。她请你把每处修改的缘由说清，再一起查回原文。',
   '几年练习后，你跟着慧音核完抄稿，接起抄书学徒的差事。她让你逐次记好异文，把不确定的地方留下待查。',
   '真实的抄校差事积累起来，你已能独立核清常见异文。慧音听你说明依据，笑着与你整理心得，留作往后谋生的本事。']
 };
 const pupilWords={
  reimu:['灵梦收完符纸，听你讲调息的基础，点头说想试一试。她按自己的节律练过一段，与你核对哪里还不稳。','神社廊下，灵梦讲起几年来亲自修习的心得，又独自调匀气息。你指出遗漏，她记清后继续练过。','灵梦凭自己持续的修持踏入仙人之途，多得有限的长岁月。你们商量继续练习，也谈清地狱追索仍可能来临。'],
  sanae:['早苗忙完祭事，听你讲仙道修持，认真答应先学基础。她亲自练习调息，将自己的疑问逐条记下与你讨论。','早苗把几年练习的记录摊在外庭，自己调息给你看。你指出仍需留心的地方，她认真核过，再继续独自修习。','积年的自修让早苗成为仍须精进的仙人，寿程延长但仍有限。她与你核好祭务和修持，也记着地狱追索的风险。'],
  marisa:['魔理沙听你说明舍食的修习，认真表示愿意自己试学。你讲解自己练熟的部分，她亲手练过，将错处记入笔记。','多年自修后，魔理沙亲自维持住舍食，成为仍会衰老的魔法使。你陪她核对记录，她决定继续研究自身的舍虫之术。','魔理沙在多年练习后，亲自完成并维持住舍虫，身体停止老化。你陪她收好记录，她笑着说往后的研究仍要靠自己做。'],
  kosuzu:['小铃听你讲抄校的方法，答应一起试一试。她选一页普通旧书亲自比对，将疑问留在边栏，请你帮忙核清。','小铃拿来几年来亲自校过的书页，逐条说清异文依据。你们核完难处，她继续练习普通书稿的抄校。','小铃将抄校练得稳妥，给原本的书店差事添了学问本领。她亲自收好校书笔记，与你约定继续互相核问。']
 };
 const careWords={
  reimu:['灵梦愿意跟你学日常调养，先把休息与饭量认真记下。你讲自己配药的经验，她亲自辨过一份常用药材。','灵梦带来几年的调养记录，与你核对身体的变化。她亲手分好一份药材，也把忙过头时该歇息的时辰记清。','调养与歇息渐成习惯，灵梦的寿程得到有限延长。她自己核过该留心的地方，与你说定继续照顾日常起居。'],
  sanae:['早苗愿意学你熟悉的调养方法，亲手记下祭务后的疲倦。你陪她核一份药材，她逐项说清用途，再自行复习。','早苗把几年起居与调养的记录带来，与你一处处核过。她亲自练熟辨药的次序，也给繁忙祭事留出歇息的空。','持续调养让早苗的寿程有限延长。她自己收好记录，继续侍奉神社，也记得忙完之后照顾饮食与休息。'],
  marisa:['魔理沙愿意学些稳妥的调养，先把熬夜后的疲倦记给你看。你讲配药的经验，她亲手核过常用药材，再自行复习。','魔理沙摊开几年的起居记录，与你核对容易过度劳累的日子。她自己练熟辨药，也认真安排试验后的休息。','调养缓和了魔理沙的耗损，寿程得到有限延长。她仍是照常吃饭的人类，把多得的时日分给生活与魔法研究。'],
  sakuya:['咲夜收好托盘，愿意跟你学起居调养。她亲手记录忙碌与休息的时辰，核过你讲的药材，再逐一说出自己的理解。','咲夜拿来几年调养的记录，与你核对哪里太过疲累。她亲自辨过常用药材，将歇息时辰排进自己的安排。','持续调养让咲夜的寿程有限延长。她自己整理用得上的方法，照旧处理馆务，也把安稳吃饭与休息留给自己。'],
  kosuzu:['小铃听你讲常用药材，愿意亲手辨一回。她把看书后的疲倦与起居记下，与你核清容易混淆的地方，再自行练习。','小铃把几年的调养笔记摊在普通书旁，说明自己怎样调整作息。你陪她核好药材，她亲手复习，遇到不解便问清。','日常调养渐稳，小铃的寿程得到有限延长。她亲自将心得收好，继续整理借书与生活，也在疲倦时认真歇息。'],
  akyuu:['阿求愿意学你熟悉的温和调养，亲手记下身体的疲倦。你们从日常饮食与休息谈起，核清能照顾好眼前生活的做法。','阿求讲起几年调养的身体感受，与你逐项复核。她亲自整理可用的做法，仍按自己的身体节奏写作与歇息。','温和调养让阿求多得短短一段有限时日，她仍沿着御阿礼之子的寿程前行。你陪她收好记录，珍惜眼前能相伴的日子。']
 };
 function enterCareer(s,kind,eventId){
  const job=kind==='care'?'medicine':kind==='scholar'?'scholar':'magic';
  if(job==='magic')s.flags.add('human-magic');
  const previous=s.careerDevelopment;
  s.career=job;const d=globalThis.TouhouCareers.init(s);
  if(d!==previous)d.history.at(-1).event=eventId;
  return d.practice;
 }
 function applyResult(s,o,eventId,progress){
  const {q,direction,kind,stage}=o;
  if(direction==='receive'){
   if(kind==='boundary'){
    if(stage===2){progress.anchor={eventId,origin:s.log.find(e=>e.id==='origin').text};s.flags.add('partner-learning:boundary-anchor');}
    if(stage===3){progress.trialEvent=eventId;globalThis.TouhouHealth.strain(s,3,'伴侣引导的边界试行');}
    if(stage===4)globalThis.TouhouEngine.transform(s,'youkai',{eventId});
    return;
   }
   if(kind==='vitality'){
    if(stage===1){progress.workCareer=s.career;progress.workAt=globalThis.TouhouCareers.init(s).practice;}
    if(stage===2)progress.seasons=['春','夏','秋','冬'];
    if(stage===3){progress.trialEvent=eventId;globalThis.TouhouHealth.strain(s,2,'伴侣引导的后户试行');}
    if(stage===4){s.vitality+=24;s.horizon+=18;globalThis.TouhouHealth.strain(s,-6,'后户调养的有限生命力');s.flags.add('partner-learning:vitality-complete');}
    return;
   }
   if(stage===2&&['magician','care','scholar'].includes(kind))progress.workAt=enterCareer(s,kind,eventId);
   if(stage!==3)return;
   if(['magician','hermit','vampire'].includes(kind))globalThis.TouhouEngine.transform(s,kind,{eventId});
   if(kind==='care'){
    s.vitality+=8;s.horizon+=6;globalThis.TouhouHealth.strain(s,-5,'伴侣指导后的长期调养');
    s.flags.add('partner-learning:care-complete');
   }
   if(kind==='scholar')s.flags.add('partner-learning:scholar-complete');
  }else{
   const p=s.people[q.id];
   p.learning={kind,stage,practice:progress.practice,since:progress.startedAt,lastAt:s.age,teacher:'protagonist',history:progress.history.map(h=>({...h}))};
   if(kind==='magician'&&stage===2){p.species='magician';p.life='long';p.ageless=false;p.career='magic';p.leaveAt+=36;p.learning.result='self-fasting';}
   if(stage!==3)return;
   if(kind==='magician'){p.species='magician';p.life='long';p.ageless=true;p.career='magic';p.leaveAt=Infinity;p.learning.result='self-shachu';}
   if(kind==='hermit'){p.species='hermit';p.life='long';p.ageless=false;p.leaveAt+=120;p.learning.result='maintained-hermit';p.learning.risk='持续修持、地狱追索；有限观察寿程';}
   if(kind==='care'){p.leaveAt+=q.id==='akyuu'?3:8;p.learning.result='limited-care';}
   if(kind==='scholar'){p.learning.previousCareer=p.career??q.c.career;p.career='scholar';p.learning.result='scholar-practice';}
  }
 }
 function buildEvent(s,o){
  const {q,direction,kind,stage}=o,id=`partner-learning:${q.id}:${direction}:${stage}`;
  const text=(direction==='receive'?receiving[q.id]:kind==='care'?careWords[q.id]:pupilWords[q.id])[stage-1];
  const effects={insight:1};if(kind==='boundary'&&stage===2)effects.fortune=-2;if(['boundary','vitality'].includes(kind)&&stage===3)effects.health=-1;
  return {id,text,effects,xp:1,weight:1,repeat:1,with:[q.id],needsFreedom:true,bodies:['humanoid'],
   scene:globalThis.TouhouContacts.scene(q.route),contactMedium:'visit',
   when:state=>options(state).some(n=>n.q.id===q.id&&n.direction===direction&&n.kind===kind&&n.stage===stage&&state.age>=n.due),
   apply:state=>{
    const fresh=options(state).find(n=>n.q.id===q.id&&n.direction===direction&&n.kind===kind&&n.stage===stage&&state.age>=n.due);
    if(!fresh)throw Error('伴侣传授的前置或练习阶段已改变：'+id);
    state.partnerStudy??={};state.partnerStudy[q.id]??={};
    const progress=state.partnerStudy[q.id][direction]??={kind,maxStages:maxStages(kind),stage:0,practice:0,startedAt:state.age,lastAt:null,history:[],followupAt:null};
    progress.stage=stage;progress.practice++;progress.lastAt=state.age;
    progress.history.push({eventId:id,age:state.age,kind,stage});
    applyResult(state,fresh,id,progress);
   }};
 }
 function candidate(s){
  const option=options(s)[0];
  if(option)return {due:option.due,chance:.3,get:()=>buildEvent(s,option)};
  const q=pair(s);if(!q||!['yukari','okina'].includes(q.id)||s.opportunity||s.development||s.careerDevelopment?.transition)return null;
  const p=s.partnerStudy?.[q.id]?.receive;
  if(!p||p.kind!==teachers[q.id]||p.maxStages!==4||p.stage!==4||p.followupAt!==null||q.id==='okina'&&!ordinaryHuman(s)||q.id==='yukari'&&s.species!=='youkai')return null;
  const due=p.lastAt+3,id=`partner-revisit:${q.id}:${p.kind}`;
  const valid=state=>pair(state)?.id===q.id&&state.partnerStudy?.[q.id]?.receive===p&&p.kind===teachers[q.id]&&p.maxStages===4&&p.stage===4&&p.followupAt===null&&(q.id==='okina'?ordinaryHuman(state):state.species==='youkai')&&state.age>=due&&!state.opportunity&&!state.development&&!state.careerDevelopment?.transition;
  return {due,chance:.3,get:()=>({id,text:q.id==='yukari'?'界线旁，紫听你说明旧名记事，又看你独自认出回到村外住处的路。你收稳改变后的力量，笑着约她同行；两人沿熟悉的小径，慢慢说起做人时的旧事。':'换过几轮时令，隐岐奈陪你重读四季作息，问清劳作后的疲倦。你仍按人的节律吃饭歇息，和她核好下一季的安排，多得的时日也仍须珍惜。',effects:{insight:1},weight:1,repeat:1,with:[q.id],needsFreedom:true,bodies:['humanoid'],scene:globalThis.TouhouContacts.scene(q.route),contactMedium:'visit',when:valid,apply:state=>{if(!valid(state))throw Error('伴侣复查的前置已经改变：'+id);p.followupAt=state.age;}})};
 }
 globalThis.TouhouPartnerLearning={inProgress,candidate,personProfile,teacherAbility,needsWork};
})();
