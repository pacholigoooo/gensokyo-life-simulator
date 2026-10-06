/* One lifecycle and event selector for ordinary and named lives. */
(() => {
  const STATS=['health','insight','bond','fortune'];
  const LABELS={health:'体魄',insight:'悟性',bond:'缘分',fortune:'家底'};
  const PHASES=['初始','成长','立足','盛年','晚期'];
  const H=globalThis.TouhouHealth,O=globalThis.TouhouOpportunities,R=globalThis.TouhouRelationships,S=globalThis.TouhouSpiritual,C=globalThis.TouhouContacts,TS=globalThis.TouhouTalentStories,A=globalThis.TouhouAfterlife,K=globalThis.TouhouCareers,L=globalThis.TouhouLongYears;
  const forms={...O.forms,...A.forms};
  const SPECIES={human:'人类',long:'长生者',eternal:'不死者',fairy:'妖精',spirit:'灵体',beast:'兽类',construct:'构造物'};
  function random(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=Math.imul(x^x>>>15,1|x);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
  function validateAllocation(stats){if(!stats||STATS.some(k=>!Number.isInteger(stats[k])||stats[k]<0||stats[k]>10)||STATS.reduce((sum,k)=>sum+stats[k],0)!==20)throw new Error('请分配20点，每项0至10点。');}
  function validateWeights(w){if(['ordinary','main','hifuu','pc98'].some(k=>!Number.isFinite(w[k])||w[k]<0)||Math.abs(w.ordinary+w.main+w.hifuu+w.pc98-1)>1e-10)throw new Error('身份概率之和必须为1。');}
  function drawCategory(rng,w=globalThis.TouhouConfig){let n=rng();for(const k of ['ordinary','main','hifuu','pc98']){n-=w[k];if(n<0)return k;}return 'pc98';}
  function drawIdentity(rng,characters=globalThis.TouhouContent,w=globalThis.TouhouConfig){const category=drawCategory(rng,w);if(category==='ordinary')return null;const pool=characters.filter(c=>c.category===category);if(!pool.length)throw new Error(`缺少${category}人物。`);return pool[Math.floor(rng()*pool.length)];}
  function isAnimal(s){return s.body==='beast'||s.character?.animalMind===true;}
  function phase(turn){return turn<9?0:turn<20?1:turn<40?2:turn<65?3:4;}
  function time(s){if(s.named)return s.named.time;if(s.mortalDeath)return `生前${Math.floor(s.mortalDeath.age)}岁 · 身后${Number((s.age-s.mortalDeath.age).toFixed(1))}年`;if(s.life==='beast'&&s.age>0&&s.age<1)return `${Math.round(s.age*24)/2}个月`;const age=Number(s.age.toFixed(1));return s.life==='construct'?`使用${age}年`:s.life==='human'||s.life==='beast'||s.transformation?`${age}岁`:`第${age}年`;}
  function change(s,effects){const applied={};for(const [k,v]of Object.entries(effects)){const before=s.stats[k];s.stats[k]=Math.max(0,Math.min(30,before+v));applied[k]=s.stats[k]-before;}return applied;}
  function add(s,id,text,effects={},extra={}){const entry={id,turn:s.turn,age:s.age,phase:s.phase,time:time(s),text,effects:change(s,effects),...extra};s.log.push(entry);return entry;}
  function advanceAge(s){
    // turn 计常规时间推进，age 是故事行年；身体老化另由健康模块维护 bodyAge。
    // 阿求来往与未完成舍虫的魔法使优先逐年推进，避免长生步幅跨过短寿或修习期限。
    if(globalThis.TouhouAkyuu.annual(s))return s.age+1;
    if(S.agingMagic(s))return s.age+1;
    if(s.transformation)return s.age+(s.turn-s.transformation.turn<=10?1:forms[s.species].stride);
    if(s.magic)return s.age+(s.turn<=12?1:s.turn<=50?5:1);
    if(s.character?.lifeYears)return s.targetYears*s.turn/s.horizon;
    if(s.life==='beast')return s.turn<=8?s.turn/24:1/3+(s.turn-8)/4;
    if(s.life==='human'||s.life==='construct')return s.turn;
    const stride={long:5,eternal:20,fairy:2,spirit:4}[s.life];
    return s.turn<=12?s.turn:s.turn<=50?12+(s.turn-12)*stride:12+38*stride+s.turn-50;
  }
  function meet(s,id,rng){
    if(s.people[id])return;
    const c=globalThis.TouhouContent.find(c=>c.id===id);
    const mortal=c?.life==='human'||c?.life==='beast'||id.startsWith('local:');
    const name=c?.name||{'local:childhood':'幼时相识','local:neighbor':'邻居','local:friend':'同道','local:student':'后辈','local:spouse':'相识的村民'}[id];
    if(!name)throw new Error(`未知同伴${id}`);
    const remaining=mortal?(c?.lifeYears?18:c?.life==='beast'?18+Math.floor(rng()*9):id==='local:student'?48+Math.floor(rng()*18):['human','beast'].includes(s.life)&&id.startsWith('local:')?Math.max(12,68-s.age)+Math.floor(rng()*18):36+Math.floor(rng()*20)):Infinity;
    const profile=globalThis.TouhouPartnerLearning.personProfile(id);
    s.people[id]={name,alive:true,close:1,metAt:s.age,leaveAt:s.age+(profile?.span??remaining),species:profile?.species||'human',life:profile?.life||'human',career:profile?.career||null,ageless:profile?.ageless||false};
    globalThis.TouhouAkyuu.initPerson(s,id,s.people[id],rng);
  }
  function early(s){
    if(s.turn===1){const good=s.initial.health>=6;s.flags.add(good?'sturdy':'fragile');add(s,'early-health',s.body==='machine'?(good?'机身运转平稳，很快能独自巡行。':'关节偶尔卡顿，你慢慢调匀步子。'):s.body==='beast'?(good?'你渐渐熟悉身体，很快便能自在活动。':'你安静待在暖处，慢慢积蓄气力。'):s.body==='spirit'?(good?'魂魄渐稳，你认清了最初的归处。':'影子时聚时散，你花时间稳住自己。'):(good?'你精力充足，总想看看门外的世界。':'你常在窗边歇息，留心屋外的声音。'),good?{health:1}:{},{reason:`初始体魄${s.initial.health}`});}
    if(s.turn===2){const good=s.initial.insight>=6;s.flags.add(good?'quick-learner':'patient-learner');if(good)s.xp++;add(s,'early-insight',s.life==='human'&&s.age<1?(good?'你很快认出熟悉的声音，循声转过头。':'你反复听熟悉的声音，慢慢认出身旁的人。'):isAnimal(s)?(good?'你记住了来往的声响，独自寻到熟悉的角落。':'你循着熟悉的动静，慢慢辨认回去的路。'):s.body==='machine'?(good?'你辨出旧记录中的错位，校准了动作。':'你逐条重做记录，慢慢认全指令。'):(good?'几个零散线索，让你忽然懂得一件事。':'你反复练习，终于记牢了一件小事。'),good?{insight:1}:{},{reason:`初始悟性${s.initial.insight}`});}
    if(s.turn===3){const good=s.initial.bond>=6;s.flags.add(good?'outgoing':'quiet');if(good)meet(s,'local:childhood',random(s.seed^41));add(s,'early-bond',good?(s.life==='human'&&s.age<2?'熟悉的面孔常在身旁，你渐渐认得来往的人。':s.character?.confined?'守候的身影记住了你，偶尔回应你的目光。':'常来往的邻伴记住了你，约好下回相见。'):'你独自待了一阵，慢慢习惯这片地方。',good?{bond:1}:{},{reason:`初始缘分${s.initial.bond}`});}
  }
  function createLife({stats,talents=[],character,seed=Date.now(),goal='none',romanceWish=null}){
    if(!goals.some(g=>g.id===goal))throw Error('请选择已有的人生目标。');
    if(romanceWish!==null&&(goal!=='romance'||!globalThis.TouhouRelationshipData.some(r=>r.id===romanceWish&&r.romance)))throw Error('请选择已有情缘人物。');
    validateAllocation(stats);if(talents.length)globalThis.TouhouTalents.validate(talents);talents=[...talents].sort((a,b)=>globalThis.TouhouTalents.list.findIndex(t=>t.id===a)-globalThis.TouhouTalents.list.findIndex(t=>t.id===b));
    if(character===undefined)character=drawIdentity(random(seed),globalThis.TouhouContent);
    const rng=random(seed^0x71ed),profile=character||{life:'human',body:'humanoid',realm:'gensokyo',family:true,career:null};
    const horizon=72+Math.floor(rng()*18)+stats.health;
    const s={seed,initial:{...stats},stats:{...stats},allocated:{...stats},talents:[...talents],talentSeen:{},character,life:profile.life,body:profile.body,realm:profile.originRealm||profile.realm,hasFamily:profile.family,turn:0,age:0,phase:0,horizon,targetYears:profile.lifeYears?profile.lifeYears[0]+rng()*(profile.lifeYears[1]-profile.lifeYears[0]):null,ended:false,score:0,log:[],history:[],seen:{},flags:new Set(),people:{},location:character?.originLocation||(character?.realm==='outside'?'外界的住处':character?.location||'人类村落'),career:profile.career,careerHistory:profile.career?[{id:profile.career,age:0,event:'origin'}]:[],xp:0,species:profile.life,habitat:character?'other':'village',transformation:null,opportunity:null,opportunityAttempts:0,failedPaths:[],pathHistory:[],lastChanges:Object.fromEntries(STATS.map(k=>[k,0])),home:profile.fixedHome===true,tools:false,remedy:false,injured:false,educated:false,retired:false,parentsAlive:profile.family,parentsLeaveAt:40+Math.floor(rng()*19),married:false,courtshipAt:null,childBorn:null,childIndependent:false};
    s.goal=goal;s.romanceWish=romanceWish;s.childhood=[];
    if(character&&!character.chronicle)throw Error('缺少人物前史：'+character.id);
    if(!character)add(s,'origin','你出生在人类村落，屋外响着清晨的叫卖声。');
    s.remedyAt=0;
    const initialEffects={};
    for(const id of talents){
      const t=globalThis.TouhouTalents.list.find(t=>t.id===id);s.flags.add('talent:'+id);if(t.flag)s.flags.add('talent:'+t.flag);
      const fx=t.id==='handy'&&isAnimal(s)?{fortune:1}:t.initial||{};
      for(const [stat,value]of Object.entries(fx))initialEffects[stat]=(initialEffects[stat]||0)+value;
      if(t.start==='tools'){if(!isAnimal(s))s.tools=true;}else if(t.start)s[t.start]=true;s.horizon+=t.years||0;
    }
    if(character)change(s,initialEffects);
    else if(Object.keys(initialEffects).length)add(s,'talent-start','随身天赋显出最初的影响。',initialEffects,{reason:talents.map(id=>globalThis.TouhouTalents.list.find(t=>t.id===id).name).join(' · ')});
    s.initial={...s.stats};s.horizon+=s.stats.health-stats.health;H.init(s,rng);R.init(s);S.init(s,rng);A.init(s);K.init(s);L.init(s);if(talents.includes('healthful'))s.vitality+=5;
    const rich=s.initial.fortune>=7,poor=s.initial.fortune<=3;
    s.flags.add(rich?'well-supplied':poor?'scarce':'modest');
    if(rich){s.tools=!isAnimal(s);s.home=true;}
    if(character){initNamed(s);return s;}
    add(s,'early-fortune',s.body==='beast'?(rich?'最初的栖处遮风避雨，食物也很充足。':poor?'栖处缺少食物，你学会留意周围。':'栖处不大，足够安静歇息。'):s.body==='machine'?(rich?'备用零件齐全，你有一处固定的工房。':poor?'可用零件不多，每次修整都得仔细。':'旧工具摆在身边，足够最初的维护。'):(rich?'起居用度宽裕，你有了安稳的落脚处。':poor?'你手边的用度不多，得把每件东西用妥。':'最初的日子平实，日常用度刚好够用。'),{},{reason:`初始家底${s.initial.fortune}`});
    return s;
  }
  function eligible(s,e){
    if(s.ended)return false;
    if((s.afterlife||s.dormant)&&!e.id.startsWith('development:'))return false;
    if(e.habitats&&!e.habitats.includes(s.habitat))return false;
    if(e.species&&!e.species.includes(s.species))return false;
    if(s.character?.confined&&e.needsFreedom)return false;
    if(e.phases&&(s.phase<e.phases[0]||s.phase>e.phases[1]))return false;
    // 人物续篇使用相对年数；旧事件的出生年龄门槛由已审读的成熟阶段正文取代。
    const continuedPersonal=s.named&&s.character.events.some(personal=>personal.id===e.id);
    if(!continuedPersonal&&(e.minAge!==undefined&&s.age<e.minAge||e.maxAge!==undefined&&s.age>e.maxAge))return false;
    if(e.bodies&&!e.bodies.includes(s.body)||e.realms&&!e.realms.includes(s.realm)||e.lives&&!e.lives.includes(s.life))return false;
    if(e.careers&&!e.careers.includes(s.career))return false;
    if(e.min&&Object.entries(e.min).some(([k,v])=>s.stats[k]<v)||e.max&&Object.entries(e.max).some(([k,v])=>s.stats[k]>v))return false;
    if(e.requires?.some(f=>!s.flags.has(f))||e.excludes?.some(f=>s.flags.has(f)))return false;
    if(e.with?.some(id=>s.people[id]?.alive===false))return false;
    if(e.with?.some(id=>['human','beast'].includes(globalThis.TouhouContent.find(c=>c.id===id).life))&&s.character&&!s.named&&!['human','beast','construct'].includes(s.life)&&s.turn<50)return false;
    if(e.remember?.some(id=>!s.people[id]))return false;
    if(e.when&&!e.when(s))return false;
    if((s.seen[e.id]||0)>=(e.repeat||1)||s.history.slice(-10).includes(e.id))return false;
    return true;
  }
  function weight(s,e){let value=e.weight;if(e.id==='chance:magician-found'&&s.flags.has('legend:insight'))value*=2.5;if(e.id==='chance:kami-found'&&s.flags.has('legend:faith'))value*=globalThis.TouhouLifeConfig.faithOpportunityMultiplier;if(e.id==='chance:youkai-found'&&s.flags.has('talent-clue:youkai'))value*=4;for(const [stat,direction]of Object.entries(e.bias||{}))value*=direction>0?(2+s.stats[stat])/7:14/(4+s.stats[stat]);for(const id of s.talents)if(globalThis.TouhouTalents.list.find(t=>t.id===id).boost?.includes(e.id))value*=2;if(e.talentBoost)value*=Math.min(3,1.8**s.talents.filter(id=>e.talentBoost.includes(id)).length);return value/(1+(s.seen[e.id]||0)*1.5);}
  function choose(s,pool,rng){let n=rng()*pool.reduce((sum,e)=>sum+weight(s,e),0);for(const e of pool){n-=weight(s,e);if(n<0)return e;}return pool[pool.length-1];}
  function applyEvent(s,e,rng,developer=false){
    const previousPartner=R.partner(s);
    const relationId=e.id.startsWith('relation:')?e.with[0]:null,previousStatus=relationId?s.relations[relationId]?.status:null;
    if(e.set)e.set.forEach(f=>s.flags.add(f));if(e.clear)e.clear.forEach(f=>s.flags.delete(f));
    for(const id of e.with||[]){meet(s,id,rng);s.people[id].close++;}
    const hadRemedy=s.remedy,oldCareer=s.career;
    if(e.apply)e.apply(s,rng);s.xp+=e.xp||0;
    if(!hadRemedy&&s.remedy)s.remedyAt=s.age;
    if(s.career!==oldCareer)s.careerHistory.push({id:s.career,age:s.age,event:e.id});
    const baseReason=e.min?Object.entries(e.min).map(([k,v])=>`${LABELS[k]}≥${v}`).join(' · '):e.max?Object.entries(e.max).map(([k,v])=>`${LABELS[k]}≤${v}`).join(' · '):e.bias?Object.entries(e.bias).map(([k,v])=>`${LABELS[k]}${v>0?'带来机会':'影响际遇'}`).join(' · '):undefined;
    const related=s.talents.filter(id=>e.talentBoost?.includes(id)).map(id=>globalThis.TouhouTalents.list.find(t=>t.id===id).name);
    const reason=[developer?'开发者触发':'',baseReason,related.length?related.join('、')+'带来机缘':''].filter(Boolean).join(' · ');
    const relation=relationId?s.relations[relationId]:null;
    const relationship=relation?{id:relationId,name:s.people[relationId].name,from:previousStatus,to:relation.status,stage:relation.label,visits:relation.visits}:undefined;
    const relationshipMoment=e.relationshipMoment||R.partnerChange(s,previousPartner)||(relationId?R.romanceClosure(s,relationId):undefined);
    add(s,e.id,typeof e.text==='function'?e.text(s):e.text,e.effects,{reason,with:e.with,remember:e.remember,scene:e.scene,premise:e.premise,contactMedium:e.contactMedium,relationship,relationshipMoment,developmentMoment:e.developmentMoment,sharedWith:e.sharedWith,...(e.circleOf?{circleOf:e.circleOf}:{}),...(developer?{developer:true}:{})});
    H.event(s,e);s.seen[e.id]=(s.seen[e.id]||0)+1;s.history.push(e.id);s.flags.add('event:'+e.id);
  }
  function recover(s){
    if(s.injured){s.injured=false;const remedy=s.remedy;s.remedy=false;H.strain(s,remedy?-1.5:-.5,'伤后调养');add(s,'recovery',s.body==='machine'?(remedy?'备好的替换件派上用场，机身恢复运作。':'受损的机件修好之后，你重新活动起来。'):s.body==='beast'?(remedy?'你伏回窝里，药草的气味伴着伤痛慢慢散去。':'你在熟悉的窝里休养，伤处慢慢愈合。'):(remedy?'先前备下的药草派上用场，伤势渐渐好了。':'你停下手边的事，养好了上次受的伤。'),{health:remedy?2:1});}
  }
  function upkeep(s){
    if(s.dormant)return;
    const previousPartner=R.partner(s);let partnerFarewell=null;
    if(s.remedy&&s.body!=='machine'&&s.age-s.remedyAt>=3){s.remedy=false;add(s,'remedy-expired','存下的药草已经受潮，没法再用了。');}
    if(s.parentsAlive&&s.age>=s.parentsLeaveAt){s.parentsAlive=false;add(s,'parents-farewell','长辈相继离世，旧物留在熟悉的屋里。',{bond:-1});}
    // leaveAt is a death deadline only for aging companions. Chapter limits belong
    // to the protagonist's ending and must never turn a long-lived friend into a death.
    // A finite dream contact ends the dream connection, even for an ageless actor.
    for(const [id,p]of Object.entries(s.people))if(p.alive&&s.age>=p.leaveAt&&(p.medium==='dream'||!p.ageless)){if(id==='akyuu')globalThis.TouhouAkyuu.onDeath(s,p);p.alive=false;const entry=add(s,'farewell-'+id,R.farewellText(s,id),{bond:-1});if(previousPartner?.id===id)partnerFarewell=entry;}
    if(s.childBorn!==null&&s.people['local:child']?.alive&&!s.childIndependent&&s.age-s.childBorn>=18){s.childIndependent=true;add(s,'child-grown',s.afterlife?'后辈在祭日说起，孩子已经有了自己的生活。':'孩子有了自己的生活，偶尔捎回一封家书。',{bond:1});}
    R.upkeep(s);
    if(partnerFarewell)partnerFarewell.relationshipMoment=R.partnerChange(s,previousPartner);
    if(!s.dormant&&(s.life==='human'||S.agingMagic(s))&&s.bodyAge>=60&&s.turn%5===0)add(s,'aging','这些年气力渐衰，你把日常节奏放慢了一点。',{health:-1});
    if(s.life==='beast'&&s.phase===4&&s.turn%6===0)change(s,{health:-1});
    if(s.phase===4&&!s.retired){s.retired=true;add(s,'late-life',s.body==='beast'?(s.life==='eternal'?'你更常静静伏着，留意周围细小的变化。':'活动渐少，你更常在熟悉的地方停留。'):s.body==='machine'?(s.character?.animalMind?'你减少远行，机件检修时便安静伏着。':'你减少远行，花更多时间照看旧部件。'):s.life==='human'?'你放慢了日常脚步，开始整理多年的旧物。':'许多旧事已经远去，你把心力放回日常。');}
  }
  function triggerTalents(s){
    for(const id of s.talents){const t=globalThis.TouhouTalents.list.find(t=>t.id===id);for(const [index,hook]of (t.triggers||[]).entries()){
      const key=id+':'+index;if((hook.once&&s.talentSeen[key])||s.talentSeen[key]===s.turn)continue;
      if(hook.at&&!hook.at.includes(s.turn)||hook.lowHealth!==undefined&&s.stats.health>hook.lowHealth)continue;
      s.talentSeen[key]=s.turn;s.xp+=hook.xp||0;add(s,'talent:'+key,hook.text,hook.effects,{talent:t.name,reason:t.name});
    }}
  }
  function transform(s,kind,context={}){
    if(s.ended||s.character||s.transformation||s.species!=='human'||!forms[kind]||(s.development&&!A.forms[kind])||(A.forms[kind]&&!A.canTransform(s,kind,context)))throw new Error('当前人生不能再次转变种族。');
    const form=forms[kind];
    s.transformation={kind,age:s.age,turn:s.turn,origin:'人类村落普通人',eventId:context.eventId||`chance:${kind}-2-pass`};
    s.transformation.source=context.source||(/^(partner-learning:|guidance:)/.test(s.transformation.eventId)?'partner-guidance':'independent');
    if(context.mentorId)s.transformation.mentorId=context.mentorId;
    s.pathHistory.push({kind,result:'transformed',age:s.age});s.opportunity=null;
    s.species=kind;s.life='long';s.habitat=form.habitat;s.location=form.location;
    s.horizon=s.turn+form.chapter+Math.min(24,Math.floor(s.stats.health/2)+Math.floor(s.xp/3));
    s.retired=false;s.phase=2;s.home=true;s.illness=null;
    if(kind==='magician'){H.strain(s,-Math.min(3,s.wear*.1),'舍食修习');s.vitality+=5;}
    else{s.bodyAge=Math.min(35,s.bodyAge);H.strain(s,-s.wear*.7,'蜕变后的身体');s.vitality+=kind==='hermit'?35:50;}
    S.onTransform(s,kind);A.onTransform(s,kind,context);K.onTransform(s,kind);
  }
  function futureLabel(s){return {continuation:'二创续篇',legacy:'二创余响',hypothetical:'二创假设'}[s.character.chronicle.future.mode];}
  function describeLife(s){
    if(s.named){const c=s.character.chronicle;return {species:c.anchor.identity||s.character.identity,status:s.named.stage==='future'?futureLabel(s):'原作回顾',time:time(s),location:s.location,career:globalThis.TouhouEvents.jobs[s.career],phaseLabel:s.named.stage==='future'?'续篇':c.anchor.age.label};}
    const status=[];
    if(s.illness)status.push('咳疾未愈');
    if(s.injured)status.push(s.body==='machine'?'机件受损':'有伤在身');
    if(s.stats.health<=3)status.push('气力虚弱');
    else if(H.spent(s)||s.wear>s.vitality*.8)status.push('衰弱渐重');
    if(A.description(s))status.push(A.description(s));
    if(s.opportunity)status.push({youkai:'研习妖术',hermit:'山中修持',magician:'魔法修习（人类）',vampire:'夜客之约'}[s.opportunity.kind]);
    if(s.retired)status.push('休居');
    if(s.legendaryMastery)status.push(s.legendaryMastery.title);
    if(s.hermit?.warned)status.push(s.hermit.prepared?'追索将近·已有准备':'追索将近');
    return {species:S.description(s)||(s.character?s.character.identity:s.transformation?forms[s.species].label:SPECIES[s.species]),status:status.join(' · ')||'起居平稳',time:time(s),location:s.location,career:K.description(s)};
  }
  function finish(s,cause){
    const divineEnding=A.divineEnding(s,cause);
    if(divineEnding){s.divineEndingId=cause;cause='chapter';}
    globalThis.TouhouAkyuu.finish(s);
    if(s.development)A.fail(s,'unfinished');
    if(s.opportunity){s.pathHistory.push({kind:s.opportunity.kind,result:'unfinished',age:s.age});s.opportunity=null;}
    s.ended=true;s.deathCause=cause;s.earlyDeath=cause==='health'||cause==='pursuit'||(cause==='age'&&s.turn<65);
    if(divineEnding){[s.ending,s.endingText]=divineEnding;}
    else if(A.endings[cause]){[s.ending,s.endingText]=A.endings[cause];}
    else if(cause==='pursuit'){s.ending='仙途止于此';s.endingText='追索中的重伤夺去了性命，庵里留下旧日的笔记与未尽的功课。';}
    else if(s.earlyDeath){
      s.ending=s.age<60?'未竟的春秋':'此生落幕';
      s.endingText=cause==='age'?'岁月留下的耗损渐渐积重，你的气力终于走到了尽头。':s.illness?'久病耗尽了气力，这一生停在病榻旁的灯下。':!s.injured?'身体渐渐衰弱，气力终于耗尽，这一生停在了灯下。':s.transformation?'伤势终于压过了新生的力量，你的旧名留在故人记忆里。':s.body==='beast'?'伤病让这一生提早停下，熟悉的巢穴渐渐安静。':'伤病耗尽了力气，还有些未做完的事，留在了这一年的末尾。';
    }else if(cause==='age'&&s.character&&s.life==='long'){s.ending='此生落幕';s.endingText=`岁月积下的耗损终于走到尽头，${s.location}留下了你的旧物与未竟的心愿。`;}
    else if(s.character){s.ending={human:'此生落幕',beast:cause==='chapter'?'归栖晚年':'此生归寂',construct:'旧物留声',fairy:'又一回新生',spirit:'尘缘渐远',eternal:'长路暂歇',long:'岁月留痕'}[s.life];s.endingText=s.character[s.score===2?'success':s.score===1?'bittersweet':'failure'];}
    else if(s.transformation&&cause==='age'){s.ending=['hermit','shikaisen'].includes(s.species)?'山中灯尽':'书页合拢';s.endingText=['hermit','shikaisen'].includes(s.species)?'修持曾让衰老迟来，肉身终究走到了尽头。山中旧庵留着你的笔迹，也留着做人的旧名。':'舍食让你踏入魔法使之列，尚未停下的老化却走到尽头。最初那册魔导书仍留在桌边。';}
    else if(s.transformation){s.ending=forms[s.species].endTitle;s.endingText=forms[s.species].endText;}
    else{s.ending='此生落幕';s.endingText=`你在${s.location}迎来此生的终点，享年${Math.floor(s.age)}岁。${s.childIndependent&&s.people['local:child']?.alive?'孩子收好了留下的家书。':s.home?'旧屋还留着生活的痕迹。':'走过的街巷，收藏了这一生。'}`;}
    R.finish(s,cause);const farewell=R.departure(s,cause);if(farewell)s.endingText+=' '+farewell;s.summary={years:Number(s.age.toFixed(1)),events:s.history.length,xp:s.xp,companions:Object.values(s.people).filter(p=>p.alive&&p.close>=2).length,species:describeLife(s).species,cause,relationships:R.describe(s)};add(s,'ending',s.endingText,{},{ending:true});s.summary.memoir=globalThis.TouhouMemoir.compose(s);
  }
  function completedStep(s,before){for(const k of STATS)s.lastChanges[k]=s.stats[k]-before[k];return s;}
  function selectOrdinary(s,rng,common){
    const rescue=globalThis.TouhouAkyuu.select(s,rng);if(rescue)return rescue;
    const development=A.select(s,rng);if(development)return development;
    const studyWork=globalThis.TouhouPartnerLearning.needsWork(s)||globalThis.TouhouGuidance.needsWork(s);
    if(studyWork){const career=K.select(s,rng);if(career)return career;}
    if(eligible(s,O.abandoned))return O.abandoned;
    // A prepared independent trial gets its own chance before social scheduling can postpone it.
    const progress=O.events.filter(e=>eligible(s,e));
    if(progress.length&&rng()<.38)return choose(s,progress,rng);
    const starts=[...O.starts,...A.starts].filter(e=>eligible(s,e));
    if(starts.length&&rng()<O.discoveryChance(s,starts))return O.discovered(s,choose(s,starts,rng));
    const prospect=C.prospect(s,rng);if(prospect)return prospect;
    const local=globalThis.TouhouEvents.localRomance(s,rng,s.meetingPlan.current?.id==='local:spouse');if(local)return local;
    const relation=R.select(s,rng);if(relation)return relation;
    const contact=C.select(s,rng);if(contact)return contact;
    const encounters=globalThis.TouhouEncounters.events.filter(e=>eligible(s,e));
    const affinityCount=s.talents.filter(t=>['wander','forest','spirit-eye','boundary','stargaze'].includes(t)).length;
    if(encounters.length&&rng()<Math.min(.3,globalThis.TouhouLifeConfig.encounterChance*(1+.2*affinityCount)))return choose(s,encounters,rng);
    const changed=O.after.filter(e=>eligible(s,e));
    if(changed.length&&rng()<.36)return choose(s,changed,rng);
    const career=studyWork?null:K.select(s,rng);if(career)return career;
    if(!common.length)throw new Error(`第${s.turn}步没有可用生活事件。`);
    return choose(s,common,rng);
  }
  function resolveEnd(s,cause,rng){
    if(globalThis.TouhouGuidance.protect(s,cause,add))return;
    if(!A.beforeDeath(s,cause,rng,add))finish(s,cause);
  }
  function completeEvent(s,event,rng,before,developer=false){
    applyEvent(s,event,rng,developer);
    // 身后续事与原有供养同年发生，保留魂形与香火原有的消耗、恢复节奏。
    if(s.afterlife){const continuation=L.select(s);if(continuation)applyEvent(s,continuation,rng,developer);const divine=A.continuation(s);if(divine)applyEvent(s,divine,rng,developer);}
    if(['development:shikaisen-transformed','development:shikaisen-wake-failed'].includes(event.id))upkeep(s);
    const vulnerable=['human','beast'].includes(s.life)||!!s.transformation||!!s.hermit||!!s.magic;
    if(s.injured&&(s.character?.regenerates||s.life==='fairy')){s.injured=false;add(s,'regrowth',s.life==='fairy'?'散开的灵气重新聚拢，你又活蹦乱跳起来。':'伤处很快复原，你歇息片刻便重新起身。',{health:2});}
    if(!s.afterlife&&!s.dormant)triggerTalents(s);
    S.resolve(s,add);
    // 死亡原因先于篇章期限结算。chapter 只表示收束观察篇章，不能写成角色自然老死。
    const chapterEnd=s.character?.lifeYears?s.horizon:Math.max(s.transformation?s.transformation.turn+40:65,s.horizon-Math.floor(s.wear*.25)+Math.min(6,Math.floor(s.xp/12)));
    const afterlifeEnd=A.ending(s);
    if(afterlifeEnd)finish(s,afterlifeEnd);
    else if(s.pendingCause)resolveEnd(s,s.pendingCause,rng);
    else if(!s.dormant&&s.stats.health<=0&&vulnerable&&s.phase>=2)resolveEnd(s,'health',rng);
    else if(H.spent(s))resolveEnd(s,'age',rng);
    else if(((s.life!=='human'&&!S.agingMagic(s))||s.character?.lifeYears)&&s.turn>=chapterEnd)resolveEnd(s,s.character?.lifeYears||s.character?.id==='socrates'?'age':'chapter',rng);
    return completedStep(s,before);
  }
  function step(s,rng){
    if(s.ended)return s;
    if(s.named)return stepNamed(s,rng);
    // 彼岸归途是同一年内的连续操作；先完成它，再恢复年度推进与同伴寿限检查。
    if(globalThis.TouhouAkyuu.pending(s))return completeEvent(s,globalThis.TouhouAkyuu.select(s,rng),rng,{...s.stats});
    if(s.dev?.enabled&&s.dev.pending){
      const before={...s.stats},event=globalThis.TouhouDev.consume(s,rng);
      if(!event)return completedStep(s,before);
      s.dev.waitingSpiritual=false;
      return completeEvent(s,event,rng,before,true);
    }
    if(s.dev?.waitingSpiritual){
      const before={...s.stats},event=S.select(s,rng);
      if(!event)throw Error('待处理的修持阶段已经丢失。');
      s.dev.waitingSpiritual=false;s.dev.message='本阶段已按原概率处理。';
      return completeEvent(s,event,rng,before);
    }
    const before={...s.stats},oldAge=s.age;
    if(!s.afterlife&&!s.dormant)recover(s);s.turn++;s.age=advanceAge(s);
    s.phase=s.transformation?(s.turn-s.transformation.turn<24?2:s.turn<s.horizon-18?3:4):phase(s.turn);
    if(s.character?.realm==='outside'&&s.age>=18)s.location=s.phase===4?'外界的住处':s.character.location;
    for(const move of s.character?.moves||[])if(move.turn===s.turn){s.realm=move.realm;s.location=move.location;}
    upkeep(s);early(s);C.childhood(s,add,meet);H.year(s,s.age-oldAge,rng,add);A.year(s,s.age-oldAge);if(!s.afterlife&&!s.dormant)triggerTalents(s);
    if(!s.character&&!s.afterlife&&!s.dormant&&s.age>=18&&!s.career){s.career=s.stats.insight>=7?'scholar':s.stats.health>=7?'garden':s.stats.bond>=7?'trade':'craft';s.careerHistory.push({id:s.career,age:s.age,event:'first-work'});K.init(s);s.xp++;add(s,'first-work','成年以后，你做起'+globalThis.TouhouEvents.jobs[s.career]+'，慢慢学会独立生活。',{fortune:1});}
    const vulnerable=['human','beast'].includes(s.life)||!!s.transformation||!!s.hermit||!!s.magic;
    const afterlifeEnd=A.ending(s);
    if(afterlifeEnd){finish(s,afterlifeEnd);return completedStep(s,before);}
    if(!s.dormant&&s.stats.health<=0){
      if(vulnerable&&s.phase>=2){resolveEnd(s,'health',rng);return completedStep(s,before);}
      add(s,'rest',s.body==='machine'?'机件停转了一阵，修整后才又活动起来。':s.life==='fairy'?'身体散入四周的自然，醒来时又是新的一天。':'你静养了一段时日，等气力重新聚拢。',{health:2});
    }
    if(H.spent(s)){resolveEnd(s,'age',rng);return completedStep(s,before);}
    const at=[6,18,40,65].indexOf(s.turn);
    if(s.character&&at>=0){const m=s.character.milestones[at];if(m.check){const passed=s.stats[m.check.stat]>=m.check.min;if(passed)s.score++;add(s,`milestone-${at}`,passed?m.pass:m.fail,passed?m.passEffects:m.failEffects,{check:{...m.check,passed}});}else add(s,`milestone-${at}`,m.text,m.effects);}
    const common=globalThis.TouhouEvents.events.filter(e=>!e.localRomance&&eligible(s,e));
    if(s.dev?.enabled&&S.select(s,()=>.5)){
      s.dev.waitingSpiritual=true;s.dev.pauseRequested=true;s.dev.message='已到修持或追索的关键时刻。可指定本阶段结果，或继续按原概率推进。';
      return completedStep(s,before);
    }
    const development=(s.afterlife||s.dormant)?A.select(s,rng):null;
    const spiritual=development?null:S.select(s,rng),talentStory=development||spiritual?null:TS.select(s,rng);
    let event;
    if(development)event=development;
    else if(talentStory)event=talentStory;
    else if(spiritual)event=spiritual;
    else if(s.character){
      const personal=s.character.events.filter(e=>eligible(s,e));
      const pool=personal.length&&(!common.length||rng()<.52)?personal:common;
      if(!pool.length)throw new Error(`第${s.turn}步没有可用事件：${s.character.id}`);
      event=choose(s,pool,rng);
    }else event=selectOrdinary(s,rng,common);
    if(!s.afterlife){const continuation=L.select(s,event);if(continuation)event=continuation;}
    globalThis.TouhouCompanionship.courtship(s,add);
    completeEvent(s,event,rng,before);
    globalThis.TouhouCompanionship.localMarriage(s,add);
    return s;
  }

  // 前史固定记录已核实的作品经历。玩家属性只参与标出的续篇，不能改写已发生的原作事实。
  function namedHistory(s,index){
    const h=s.character.chronicle.history[index];s.named.time=h.label;
    add(s,index===0?'origin':'history:'+h.id,h.text,{},
      {chronicle:{kind:h.kind,certainty:h.certainty,work:h.work,historyId:h.id,sourceIds:h.sourceIds,note:h.note}});
    s.named.index=index+1;
  }
  function initNamed(s){
    const c=s.character.chronicle;
    s.named={stage:'canon',index:0,turn:0,elapsed:0,time:'已知起点'};
    s.realm=c.anchor.realm||s.character.realm;s.location=c.anchor.location||s.character.location;
    s.parentsAlive=false;s.hasFamily=false;s.courtshipAt=null;
    namedHistory(s,0);
  }
  function finishNamed(s){
    const f=s.character.chronicle.future;
    s.ended=true;s.deathCause='chapter';s.earlyDeath=false;
    s.ending=s.score===2?'心愿已成':s.score===1?'留待来日':'此卷暂歇';
    s.endingText=f[s.score===2?'success':s.score===1?'bittersweet':'failure'];
    add(s,'ending',s.endingText,{},{ending:true});
    s.summary={years:s.named.elapsed,events:s.history.length,xp:s.xp,
      companions:Object.values(s.people).filter(p=>p.alive&&p.close>=2).length,
      species:describeLife(s).species,cause:'chapter',relationships:[],
      canonEvents:s.character.chronicle.history.length,ageLabel:s.character.chronicle.anchor.age.label};
    s.summary.memoir=globalThis.TouhouMemoir.compose(s);
  }
  function stepNamed(s,rng){
    const before={...s.stats},c=s.character.chronicle,n=s.named;s.turn++;
    if(n.stage==='canon'){
      if(n.index<c.history.length)namedHistory(s,n.index);
      else{n.stage='anchor';n.time=c.anchor.label;add(s,'history:anchor',c.anchor.text,{},
        {chronicle:{kind:'anchor',certainty:'canon',work:c.anchor.age.label,historyId:'anchor',sourceIds:[],note:c.anchor.age.note}});}
      return completedStep(s,before);
    }
    if(n.stage==='anchor'){
      n.stage='future';n.time='此后岁月';s.age=c.anchor.age.years??0;
      add(s,'future:opening',c.future.intro,{}, {futureOpening:true});
      return completedStep(s,before);
    }
    n.turn++;n.elapsed=Number((c.future.years*n.turn/20).toFixed(1));
    s.age=(c.anchor.age.years??0)+n.elapsed;n.time='此后第'+n.elapsed+'年';
    // 已有身份的续篇从立足前段开始；两次早段日常之后进入展开，避免重走空缺的幼年。
    s.phase=n.turn<=3?1:n.turn<=9?2:n.turn<=15?3:4;
    for(const [id,p]of Object.entries(s.people))if(p.alive&&!p.ageless&&s.age>=p.leaveAt){
      p.alive=false;add(s,'farewell-'+id,p.name+'年老离世，你将旧日来往记在卷中。',{bond:-1});
    }
    const at=[1,7,13,20].indexOf(n.turn);
    if(at>=0){
      const m=c.future.milestones[at];
      if(m.check){const passed=s.stats[m.check.stat]>=m.check.min;if(passed)s.score++;
        add(s,'milestone-'+at,passed?m.pass:m.fail,passed?m.passEffects:m.failEffects,{check:{...m.check,passed}});
      }else add(s,'milestone-'+at,m.text,m.effects);
    }else{
      const overrides=new Map(c.future.eventOverrides.map(e=>[e.id,e]));
      const pool=s.character.events.map(e=>({...e,...overrides.get(e.id)})).filter(e=>eligible(s,e));
      if(!pool.length)throw Error('人物续篇没有可用事件：'+s.character.id+'，第'+n.turn+'步');
      // 先选即将离开适用阶段的日常，给后段保留仍可发生的事。
      const lastPhase=Math.min(...pool.map(e=>e.phases[1]));
      applyEvent(s,choose(s,pool.filter(e=>e.phases[1]===lastPhase),rng),rng);
    }
    if(n.turn===20)finishNamed(s);
    return completedStep(s,before);
  }

  const goals=[
    {id:'none',name:'随遇而安',description:'写完这一卷人生。',check:s=>s.ended},
    {id:'romance',name:'两情相悦',description:'与一位具名人物确立恋人关系。',check:s=>s.log.some(e=>e.relationship?.to==='lover'&&(!s.romanceWish||e.relationship.id===s.romanceWish))},
    {id:'career',name:'薪火相传',description:'寻常出身的职业达到传承阶段。',check:s=>!!s.careerDevelopment?.history.some(h=>h.stage===3)},
    {id:'longlife',name:'八十春秋',description:'行年达到80岁。',check:s=>s.age>=80},
    {id:'transformation',name:'另一种人生',description:'寻常出身后完成一次种族或身后转变。',check:s=>!!s.transformation},
    {id:'experience',name:'见多识广',description:'历练达到40。',check:s=>s.xp>=40}
  ];
  function goalStatus(s){if(s.named){const goal=s.character.chronicle.future.goal,achieved=s.score===2;return {id:'personal',...goal,achieved,status:achieved?'已达成':s.ended?'未达成':'进行中'};}const goal=goals.find(g=>g.id===s.goal),achieved=goal.check(s),name=goal.name+(s.romanceWish?' · '+globalThis.TouhouContent.find(c=>c.id===s.romanceWish).name:'');return {id:goal.id,name,description:goal.description,achieved,status:achieved?'已达成':s.ended?'未达成':'进行中'};}
  globalThis.TouhouEngine={STATS,LABELS,PHASES,random,validateAllocation,validateWeights,drawCategory,drawIdentity,createLife,step,eligible,weight,meet,time,isAnimal,transform,describeLife,futureLabel,forms,record:add,goals,goalStatus};
})();
