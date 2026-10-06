/* Four mutually exclusive, original chance stories. Canon boundaries: docs/species-research.md. */
(() => {
  const forms = {
    youkai:{label:'妖怪',habitat:'outskirts',location:'人里外的旧庵',stride:5,chapter:76,endTitle:'旧名未改',endText:'岁月改了你的形貌。你收敛妖气，在村外安顿下来，仍记得做人的旧名与故人。'},
    hermit:{label:'仙人（人类）',habitat:'mountain',location:'山中小庵',stride:4,chapter:70,endTitle:'山中长年',endText:'山中又过许多春秋。你暂收远游之念，继续修持，也照看故人留下的坟与旧屋。'},
    magician:{label:'魔法使',habitat:'forest',location:'林间魔法小屋',stride:5,chapter:80,endTitle:'灯火未熄',endText:'不再为饥饿奔忙以后，你把漫长岁月花在魔法与旧书上。此番远游已尽，窗里的灯还亮着。'},
    vampire:{label:'吸血鬼',habitat:'mansion',location:'旧洋馆厢房',stride:5,chapter:74,endTitle:'长夜归处',endText:'许多熟悉面孔已留在往年。你守着夜间的约定，在厚帘后收好旧物，等待下一次暮色。'}
  };
  const starts=[], events=[], after=[];
  // One shared discovery roll for all eligible ordinary-life paths; no extra RNG call.
  function discoveryChance(s,eligibleStarts,config=globalThis.TouhouLifeConfig) {
    if(!eligibleStarts.length)return 0;
    const affinity=new Set(eligibleStarts.flatMap(e=>e.talentBoost||[]).filter(t=>s.talents.includes(t))).size;
    const clue=s.flags.has('talent-clue:youkai')&&eligibleStarts.some(e=>e.id==='chance:youkai-found');
    return Math.min(1,(config.opportunityChance*(1+.6*Math.min(2,affinity))+(clue?.018:0))*(config.opportunityMultiplier??1));
  }
  const human = s => !s.character && s.species === 'human' && !s.transformation;
  const canBegin = s => human(s) && !s.opportunity && !s.development && !globalThis.TouhouPartnerLearning.inProgress(s) && s.opportunityAttempts < 2;
  function begin(s,kind) {if(kind==='youkai')s.flags.delete('talent-clue:youkai');s.opportunity={kind,stage:1,since:s.age,startedAge:s.age};s.opportunityAttempts++;}
  function pass(s) {s.opportunity.stage=2;s.opportunity.since=s.age;}
  function fail(s,kind) {s.pathHistory.push({kind,result:'failed',age:s.age});s.failedPaths.push(kind);s.opportunity=null;}
  function start(kind,text,rule) {
    starts.push({id:'chance:'+kind+'-found',text,effects:{},weight:globalThis.TouhouLifeConfig.livingOpportunityWeight,repeat:1,
      ...rule,dev:{kind,start:true},when:s=>canBegin(s)&&!s.failedPaths.includes(kind),apply:s=>begin(s,kind)});
  }
  function trial(kind,stage,delay,thresholds,success,failure) {
    const ready=s=>human(s)&&s.opportunity?.kind===kind&&s.opportunity.stage===stage&&s.age-s.opportunity.since>=delay;
    for(const [passed,definition] of [[true,success],[false,failure]]) {
      const apply=definition.apply;
      events.push({id:`chance:${kind}-${stage}-${passed?'pass':'fail'}`,weight:1,repeat:1,effects:{},...definition,
        dev:{kind,stage,delay,thresholds,passed},when:s=>ready(s)&&Object.entries(thresholds).every(([key,value])=>(key==='xp'?s.xp:s.stats[key])>=value)===passed,
        apply:s=>{if(apply)apply(s);if(passed){if(stage===1)pass(s);else globalThis.TouhouEngine.transform(s,kind);}else fail(s,kind);}
      });
    }
  }
  start('youkai','行旅归来，你带回一卷残缺妖术，纸边还留着冷雾。',
    {minAge:22,maxAge:60,min:{insight:7},talentBoost:['spirit-eye','boundary','wander'],habitats:['village','outskirts','forest']});
  trial('youkai',1,3,{insight:9,fortune:3},
    {text:'你搬离人里，在旧庵试读妖术，先舍下原先的安稳。',effects:{fortune:-2,bond:-1},xp:2,apply:s=>{s.habitat='outskirts';s.location='人里外的旧庵';s.home=false;}},
    {text:'残卷中的术式超出所学，你把它封起，放下妖化的念头。',effects:{insight:1,fortune:-1}});
  trial('youkai',2,5,{health:7,insight:11,xp:8},
    {text:'积年的妖术终于改变肉身，你压下妖气，记牢做人的旧名。',effects:{health:2,bond:-2},wear:3},
    {text:'妖术反噬了身体，你熄掉旧庵的灯，带伤停下修习。',effects:{health:-3},wear:6,apply:s=>s.injured=true});

  start('hermit','山路上有人留下一页行气法，你带回家反复读过。',
    {minAge:24,maxAge:62,min:{health:5,insight:6},talentBoost:['patient','forest','stargaze'],habitats:['village','outskirts','mountain']});
  trial('hermit',1,3,{health:6,insight:8},
    {text:'多年行气渐有章法，你在山间结庵，减少俗务牵挂。',effects:{fortune:-2,health:1},xp:3,apply:s=>{s.habitat='mountain';s.location='山中小庵';s.home=false;}},
    {text:'行气始终难以调匀，你先停下苦修，养回寻常气力。',effects:{health:1,fortune:-1}});
  trial('hermit',2,5,{health:8,insight:10,xp:10},
    {text:'积年修持让身体渐离衰朽，你成为仙人，仍须日日精进。',effects:{health:3,insight:1},wear:-3},
    {text:'杂念与病痛打断修持，你收好行气法，回到平常作息。',effects:{health:-1,insight:1},wear:2});

  start('magician','旧书摊的一册魔导书吸引了你，几页小术式尚能辨清。',
    {minAge:18,maxAge:60,min:{insight:8,fortune:3},talentBoost:['scroll','reader','curious'],habitats:['village','outskirts','forest']});
  trial('magician',1,3,{insight:10,fortune:2},
    {text:'你学会几样实用魔法，开始靠它谋生，每日照常吃饭歇息。',effects:{fortune:-2,insight:1},xp:3,apply:s=>{s.career='magic';s.flags.add('human-magic');globalThis.TouhouCareers.init(s);}},
    {text:'耗材渐尽，术式仍无法维持，你暂把魔导书收回柜中。',effects:{fortune:-2,insight:1}});
  trial('magician',2,5,{insight:13,health:5,xp:10},
    {text:'你完成舍食之术，成为魔法使，搬到林间继续研究。',effects:{health:2,fortune:-2},wear:2},
    {text:'舍食之术未能完成，你仍以人类之身练习小魔法。',effects:{health:-2,insight:1},wear:3});

  start('vampire','一位夜行客看中了你的守信，邀你谈一桩漫长的约定。',
    {minAge:20,maxAge:58,min:{bond:8,fortune:4},talentBoost:['invited','promise','fortune'],habitats:['village','outskirts','mansion']});
  trial('vampire',1,2,{bond:9,insight:7,fortune:3},
    {text:'你备下厚帘与夜间食源，答应离开原先的白昼生活。',effects:{fortune:-3,bond:-1},xp:1},
    {text:'夜行客看出准备不足，收回邀约，你带着疲惫归家。',effects:{health:-1,bond:-1}});
  trial('vampire',2,3,{health:8,bond:9,insight:9},
    {text:'你成了吸血鬼，仍记得旧名，搬进厚帘遮光的厢房。',effects:{health:2,bond:-2},wear:4},
    {text:'那夜只留下贫血与虚弱，夜行客停止尝试，你仍是人类。',effects:{health:-3},wear:6,apply:s=>s.injured=true});

  const abandoned={id:'chance:abandoned',text:'多年未能继续这条路，你收好留下的物件，把心力放回生活。',effects:{insight:1},weight:1,repeat:2,
    when:s=>human(s)&&!!s.opportunity&&s.age-s.opportunity.startedAge>=18,
    apply:s=>fail(s,s.opportunity.kind)};

  function later(kind,id,text,effects={},rules={}) {
    after.push({id:`changed:${kind}-${id}`,text,effects,weight:2,repeat:5,...rules,when:s=>!s.character&&s.species===kind&&!!s.transformation&&(!rules.when||rules.when(s))});
  }
  later('youkai','name','你在旧纸上写下原来的名字，笔迹已有些陌生。',{bond:1});
  later('youkai','border','你在村外停步，等送货人把日用品放在约好的石边。',{fortune:-1});
  later('youkai','aura','妖气险些惊动山路行人，你退入暗处慢慢收拢。',{insight:1},{wear:1});
  later('youkai','practice','你学着控制新得的力量，折断的树枝越来越少。',{insight:1},{xp:2});
  later('youkai','old-house','途经旧居外的小路，你想起当年清晨的叫卖声。',{bond:1});
  later('youkai','guest','陌生妖怪在庵外避雨，你们各自说起山里的近况。',{bond:1});
  later('youkai','mist','夜雾覆过窗台，你静静调匀新生的气息。',{health:1},{wear:-.5});
  later('hermit','breath','晨起行气已成习惯，你听着松涛慢慢收息。',{health:1},{wear:-.6});
  later('hermit','hunger','你减少口腹之欲，把多出的粮食送下山。',{bond:1,fortune:-1});
  later('hermit','visitor','山下有人来问修持，你只教了自己练熟的一段。',{insight:1,bond:1},{xp:1});
  later('hermit','quiet','尘世旧愿忽然涌上心头，你坐了许久才重新入定。',{insight:1});
  later('hermit','medicine','你辨认山间药草，留下一份应付修行中的病痛。',{}, {apply:s=>s.remedy=true});
  later('hermit','paths','昔日上山的小路已被草木盖住，你慢慢重新认路。',{insight:1});
  later('hermit','balance','一段稳妥修持让你更能驾驭气息，身体轻松了些。',{health:1},{xp:2,wear:-.5});
  later('magician','meal','炉边煮了一餐旧日饭食，你为了熟悉的味道慢慢吃完。',{bond:1});
  later('magician','spell','舍食后的空余时日，被你分给一本迟迟读不通的旧书。',{insight:1},{xp:2});
  later('magician','growth','你再习停止衰老的法术，窗外又换过一轮新叶。',{health:1},{xp:1,wear:-.5,when:s=>!s.magic.ageless});
  later('magician','reagent','一次试验烧坏容器，你带着灼伤停下手里的术式。',{health:-2,fortune:-1},{wear:3,apply:s=>s.injured=true});
  later('magician','trade','你用实用的小魔法换来纸墨，继续手边的研究。',{fortune:1},{xp:1});
  later('magician','visitors','陌生的求学者叩门，你让对方先学会照看炉火。',{bond:1});
  later('magician','shelf','书架已经换过几回，你仍找得到最初那册魔导书。',{insight:1});
  later('magician','lamp','夜里不觉饥饿，你还是按旧习停下来望了会儿窗外。',{health:1});
  later('vampire','curtain','日光移到窗沿，你拉严厚帘，安静等到暮色。',{health:1},{wear:-.5});
  later('vampire','supply','约好的夜间食源如期送来，你留足报酬，守住分寸。',{health:1,fortune:-1});
  later('vampire','shortage','夜间食源中断，你带着饥饿另寻可靠的供给。',{health:-2,fortune:-1},{wear:2});
  later('vampire','dawn','误了归程，晨光灼伤皮肤，你躲进近旁的阴影。',{health:-3},{wear:5,bias:{insight:-1},apply:s=>s.injured=true});
  later('vampire','parasol','你撑伞走过短短一段日照路，始终留意脚边阴影。',{insight:1},{min:{insight:10}});
  later('vampire','rain','雨势截断归路，你躲进檐下，等雨停后再绕行。',{});
  later('vampire','night','夜色让感官渐渐清晰，你记住远处轻轻的脚步。',{insight:1},{xp:1});
  later('vampire','memory','厚帘后留着人类时代的小物件，你取出擦了擦。',{bond:1});
  for(const kind of ['youkai','magician','vampire']){
    later(kind,'warning','你听见追查村民妖化的消息，收敛气息，减少露面。',{bond:-1},{wear:2,repeat:2});
    later(kind,'pursuit','退治的术光逼近，你带伤暂避山林，等追索远去才返回。',{health:-4,fortune:-2},{wear:8,repeat:2,apply:s=>s.injured=true});
  }
  after.push({id:'changed:human-magic',text:'清晨吃过饭，你照常练习让纸片轻轻飞起。',effects:{insight:1},weight:2,repeat:4,xp:1,when:s=>human(s)&&s.flags.has('human-magic')});
  globalThis.TouhouOpportunities={forms,starts,events,after,abandoned,discoveryChance};
})();
