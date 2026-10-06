/* Ordinary-life developments. Canon distinctions and original rules: docs/development-research.md. */
(() => {
  const forms={
    shikaisen:{label:'尸解仙',habitat:'mountain',location:'山中寄身庵',stride:4,chapter:78,endTitle:'寄身长年',endText:'寄身之器依旧完好。你在山中继续修持，听见追索的风声便备好术式与退路。'},
    ghost:{label:'幽灵',habitat:'outskirts',location:'村外墓地',stride:3,chapter:62,endTitle:'夜风留声',endText:'旧事随夜风散开，你在安静的墓地歇下，仍偶尔随远处的歌声浮起。'},
    vengeful:{label:'怨灵',habitat:'outskirts',location:'封住的荒径',stride:3,chapter:64,endTitle:'荒径余怨',endText:'荒径又添了新草。你收束逸出的怨气，守着那桩仍待说清的往事。'},
    kami:{label:'神灵（受祭的人神）',habitat:'shrine',location:'村外小祠',stride:4,chapter:84,endTitle:'小祠香火',endText:'新一代守祠人记住了你的神名。祭日的灯继续亮着，你守望着这片受托照看的地方。'}
  };
  const mortal=s=>!s.ended&&!s.character&&s.species==='human'&&!s.transformation;
  const starts=[];
  const mark=(kind,status,title,impact)=>({kind,major:['transformed','dormant'].includes(status),status:({started:'开始准备',prepared:'准备已成',transformed:'转变完成',failed:'因缘已尽',dormant:'寄物沉眠'})[status]||status,title,impact});
  function event(kind,key,text,effects={},apply,extra={}){return {id:`development:${kind}-${key}`,text,effects,apply,weight:1,repeat:1,...extra};}
  function init(s){s.development=null;s.afterlife=null;s.dormant=null;}
  function fail(s,reason='failed'){
    const d=s.development;if(!d)return;
    s.pathHistory.push({kind:d.kind,result:reason,age:s.age});
    if(!s.failedPaths.includes(d.kind))s.failedPaths.push(d.kind);
    s.development=null;s.dormant=null;
  }
  function discover(kind,text,rules,extra={}){
    starts.push({id:`chance:${kind}-found`,text,effects:{},weight:1,repeat:1,...rules,
      when:s=>mortal(s)&&!s.opportunity&&!s.development&&!globalThis.TouhouPartnerLearning.inProgress(s)&&s.opportunityAttempts<2&&!s.failedPaths.includes(kind),
      apply:s=>{s.opportunityAttempts++;s.development={kind,stage:'practice',startedAge:s.age,since:s.age,progress:0,ready:false,...extra};},
      developmentMoment:mark(kind,'started',forms[kind].label+'的机缘','开始积累准备，仍按人类寿命生活。')});
  }
  discover('shikaisen','山中道人讲起寄物复苏的修法，你求来一份入门功课。',{minAge:24,maxAge:62,min:{health:5,insight:7},talentBoost:['patient','scroll','stargaze'],habitats:['village','outskirts','mountain']});
  discover('ghost','墓祭上，一团幽灵随歌声起伏，你开始留心气息与记忆的联系。',{minAge:28,maxAge:70,min:{insight:6,bond:5},talentBoost:['spirit-eye','promise','reader'],habitats:['village','outskirts']},{anchor:0});
  discover('vengeful','一桩欺辱被草草掩过，你留下证物，心里始终咽不下这口气。',{minAge:24,maxAge:68,min:{insight:5},talentBoost:['promise','tough','spirit-eye'],habitats:['village','outskirts','forest']},{resentment:2});
  discover('kami','几户受过你照应的人，在村口给你留了一盏谢愿的灯。',{minAge:30,maxAge:68,min:{bond:8,insight:6},talentBoost:['friendly','promise','invited'],habitats:['village','outskirts']},{faith:1,devotees:1});
  const practice={
    shikaisen:['你按抄来的功课调息，几年后才稳住最初的一段。','你反复试验寄神的法门，挑出一只烧结牢固的陶器。','你请道人核验寄身之器，又补上容易中断的几处功课。'],
    ghost:['你记下幽灵随情绪变换的形状，也写下自己最牵挂的往事。','你把家书交给可信的人，约好今后在墓祭上念起旧名。','你辨熟墓地夜间的气息，将牵挂的一件心愿写进家书。'],
    vengeful:['你寻访当年的见证人，把被压下的细节一件件写清。','证物始终无人受理，那股怨气渐渐凝在旧物四周。','你把证物藏在荒径边，立誓等这桩旧事得到回应。'],
    kami:['你照看村口水渠，受过帮助的人年年回来还愿。','几户人家合力修起小祠，把照看水源的愿望托付给你。','你把守祠与祭日交给后辈，祠中开始有人以神名称呼你。']
  };
  const requirements={shikaisen:{health:6,insight:10,xp:8,fortune:2},ghost:{insight:9,bond:6,xp:6},vengeful:{insight:8,xp:6},kami:{bond:10,insight:9,xp:8}};
  const sleepingYears=[
    '静室刚刚封好，守庵人把灯留在门边，按约等候复苏之期。',
    '静室封起后的第一个春天，守庵人在窗外扫净落花，陶器依旧无声。',
    '雨水连下多日，守庵人补好屋瓦，把寄身之器移到干燥处。',
    '山中又过一年，庵里的灯添过几回油，寄身之器仍没有动静。',
    '冬雪压住庵门，守庵人清开一条窄路，照旧按约看守静室。',
    '陶器外积了一层薄尘，守庵人轻轻拭去，在门边记下守候的年数。',
    '山风吹动门外的帘子，静室仍旧紧闭，未到约定开封的时候。',
    '约定的复苏之年将近，守庵人备好清水，在静室外候着消息。'
  ];
  const meets=(s,req)=>Object.entries(req).every(([k,v])=>(k==='xp'?s.xp:s.stats[k])>=v);
  function prepare(s){
    const d=s.development;if(!d||!mortal(s))return null;
    const kind=d.kind;
    if(d.stage==='sleep'){
      if(s.age<s.dormant.wakeAt)return event(kind,'sleep-'+s.turn,sleepingYears[s.age-s.dormant.since]);
      return null; // Awakening uses the supplied RNG in select.
    }
    if(d.ready){
      if(s.age-d.since<6)return null;
      const text={ghost:'你重读留下的家书，替后来人补清了旧事的来由。',vengeful:'你再次核对藏好的证物，心中的不平仍未消解。',kami:'守祠人带后辈学会祭日的礼数，几户人家又来还愿。'}[kind];
      return event(kind,'keep-'+s.turn,text,{},()=>{d.since=s.age;if(kind==='kami'){d.faith=Math.min(14,d.faith+2);d.devotees=Math.max(3,d.devotees);}});
    }
    if(d.stage==='practice'){
      if(s.age-d.since<2)return null;
      const n=d.progress;
      return event(kind,'practice-'+(n+1),practice[kind][n],{insight:1,...(kind==='kami'?{bond:1,fortune:-1}:{})},()=>{
        d.progress++;d.since=s.age;
        if(kind==='ghost')d.anchor++;
        if(kind==='vengeful')d.resentment+=2;
        if(kind==='kami'){d.faith+=2;d.devotees++;}
        if(d.progress===3)d.stage='test';
      },{xp:2});
    }
    if(d.stage==='test'&&s.age-d.since>=2){
      if(!meets(s,requirements[kind]))return event(kind,'unready','准备终究难以维持，你收好旧物，让余下的日子回到寻常。',{insight:1},()=>fail(s),{developmentMoment:mark(kind,'failed','这条路暂告终','准备不足，保留已经积累的经历。')});
      if(kind==='shikaisen')return event(kind,'vessel','寄身之器经住了反复核验，你请可信的人代为守庵。',{fortune:-2},()=>{d.vessel=true;d.stage='ritual';d.since=s.age;},{xp:2});
      return event(kind,'ready',{ghost:'家书与墓祭都有了托付，你仍照常生活，等待未定的归途。',vengeful:'怨念已缠住留下的证物，你仍活在人间，等着旧事的回音。',kami:'小祠有了固定的祭日与守祠人，众人的敬意逐渐积成信仰。'}[kind],{},()=>{d.ready=true;d.stage='ready';d.since=s.age;},{developmentMoment:mark(kind,'prepared','留下后续的可能','生前准备完成，死亡时仍须检查能否延续。')});
    }
    if(kind==='shikaisen'&&d.stage==='ritual'&&s.age-d.since>=3){
      if(!meets(s,{health:7,insight:12,xp:12}))return event(kind,'ritual-fail','行功至紧要处，气息忽然散乱，你停下仪式，回庵休养。',{health:-2},()=>fail(s),{wear:3});
      return event(kind,'dormant','你将心神寄入备好的陶器，气息沉寂，守庵人按约封好静室。',{},()=>{d.stage='sleep';d.since=s.age;s.dormant={since:s.age,wakeAt:s.age+8};s.injured=false;s.illness=null;s.remedy=false;},{developmentMoment:mark(kind,'dormant','尸解沉眠','多年修持后的寄物仪式完成，复苏仍有风险。')});
    }
    return null;
  }
  function canTransform(s,kind,context={}){
    const d=s.development;if(!mortal(s)||s.opportunity||d?.kind!==kind)return false;
    if(kind==='shikaisen')return d.stage==='sleep'&&d.vessel&&s.dormant&&s.age>=s.dormant.wakeAt;
    return d.ready&&['health','age'].includes(context.deathCause);
  }
  function onTransform(s,kind,context={}){
    if(!forms[kind])return;
    const d=s.development;
    if(kind!=='shikaisen'){
      s.mortalDeath={age:s.age,cause:context.deathCause};
      s.afterlife={kind,since:s.age,lastAt:s.age,scenes:0,cohesion:18,resentment:d.resentment||0,faith:d.faith||0,devotees:d.devotees||0,appeasement:0,lastMemoryAt:s.age,recentScenes:[],abilities:[]};
      s.life='spirit';s.body='spirit';s.stats.health=Math.max(8,s.stats.health);
      s.injured=false;s.illness=null;s.remedy=false;s.retired=false;s.pendingCause=null;
      s.flags.delete('human-magic');
    }
    s.development=null;s.dormant=null;
  }
  function recordKey(s,id,text,extra,record){
    record(s,id,text,{},extra);s.history.push(id);s.seen[id]=(s.seen[id]||0)+1;s.flags.add('event:'+id);
  }
  function beforeDeath(s,cause,rng,record){
    // 身后路线只承接已准备的人类死亡。成功会继续同一人生，失败才由引擎正式结算。
    const d=s.development;
    if(!mortal(s)||!d||d.kind==='shikaisen'||!d.ready||!['health','age'].includes(cause))return false;
    const kind=d.kind;
    const sound=kind==='ghost'?d.anchor>=3:kind==='vengeful'?d.resentment>=6:d.faith>=4&&d.devotees>=3;
    const chance={ghost:.78,vengeful:.68,kami:.76}[kind]+(kind==='kami'&&s.flags.has('legend:faith')?.16:0);
    if(!sound||rng()>=chance){
      recordKey(s,`development:${kind}-departure`,{ghost:'最后的气息散入夜色，留下的家书由后来人继续传阅。',vengeful:'生前积下的怨气随气息散去，旧案留给仍在世的人。',kami:'祠中仍有人念起你的旧名，供奉终究未能凝成神灵。'}[kind],{developmentMoment:mark(kind,'failed','余生落幕','生前准备未能承接此次死亡。')},record);
      fail(s);return false;
    }
    globalThis.TouhouEngine.transform(s,kind,{deathCause:cause,eventId:`development:${kind}-transformed`});
    recordKey(s,`development:${kind}-transformed`,{ghost:'呼吸止息后，一团带着旧日气质的幽灵浮起，你循家书中的歌声认回旧名。',vengeful:'肉身的气息断了，缠在证物上的怨念却聚成形，将你留在荒径旁。',kami:'肉身走到尽头，祭日的呼声却将你留在小祠，众人开始向神灵祈愿。'}[kind],{developmentMoment:mark(kind,'transformed',forms[kind].label+'之身',{ghost:'肉身已逝，靠凝聚的气质延续；记忆会渐渐淡去。',vengeful:'怨念维系魂形，须承受镇伏与供养。',kami:'受祭成神，神力随祭祀与信仰起伏。'}[kind])},record);
    return true;
  }
  function year(s,elapsed){
    if(s.development?.ready&&s.development.kind==='kami')s.development.faith=Math.max(0,s.development.faith-elapsed*.03);
    const a=s.afterlife;if(!a)return;
    if(a.kind==='ghost')a.cohesion=Math.max(0,a.cohesion-elapsed*.24);
    if(a.kind==='vengeful'){a.cohesion=Math.max(0,a.cohesion-elapsed*.12);a.resentment=Math.max(0,a.resentment-elapsed*.06);}
    if(a.kind==='kami')a.faith=Math.max(0,a.faith-elapsed*(a.devotees>=3?.12:.45));
    a.lastAt=s.age;
  }
  function ending(s){
    const a=s.afterlife;if(!a)return null;
    if(a.kind==='ghost'&&(a.cohesion<=0||s.stats.health<=0))return 'spirit-faded';
    if(a.kind==='vengeful'&&(a.cohesion<=0||s.stats.health<=0))return 'exorcised';
    if(a.kind==='vengeful'&&a.resentment<=0)return 'appeased';
    if(a.kind==='kami'&&(a.faith<=0||s.stats.health<=0))return 'forgotten';
    return null;
  }
  const scenes={
    ghost:[
      ['drift','你穿过墓地的石隙，慢慢学会让散开的气息重新聚拢。',{insight:1},a=>{a.cohesion=Math.min(24,a.cohesion+1.8);a.abilities.push('穿隙与聚形');}],
      ['song','远处传来旧曲，你随歌声起伏，想起当年院中的一片树影。',{bond:1},a=>a.cohesion=Math.min(24,a.cohesion+.6)],
      ['cold','过路人被寒意惊得退开，你停在墓树后，等他们走远。',{},a=>a.cohesion-=.8],
      ['dawn','晨光照进墓园，你缩入碑阴，魂形仍散去了一小片。',{},a=>a.cohesion-=1.4],
      ['mood','你收拢低落的气息，让歇脚的人带着平静离开墓道。',{insight:1},a=>a.abilities.push('气质影响')],
      ['memory','一个熟悉的称呼渐渐模糊，你还记得念起它时的心情。',{},a=>a.cohesion-=.4]
    ],
    vengeful:[
      ['shape','你把逸出的怨气收回旧物边，终于能稳住自己的轮廓。',{insight:1},a=>{a.cohesion=Math.min(24,a.cohesion+1);a.abilities.push('聚怨显形');}],
      ['haunt','怨气让路人的心神不宁，你退回荒径，听见远处关门的声音。',{bond:-1},a=>{a.resentment+=1;a.cohesion-=.8;a.abilities.push('怨气侵扰');}],
      ['ward','镇伏的符阵封住小径，你挣开一角，魂形被削去了一片。',{},a=>a.cohesion-=3],
      ['offering','有人为当年受害者供养，你听完那段念诵，怨意稍稍松动。',{bond:1},a=>{a.resentment=Math.max(0,a.resentment-2);a.appeasement++;}],
      ['testimony','旧案被重新提起，证物终于有人照料，你静静守到天明。',{insight:1},a=>{a.resentment=Math.max(0,a.resentment-1);a.appeasement++;}],
      ['restraint','你忍住追随活人的冲动，把怨火收回荒径深处。',{insight:1},a=>a.cohesion=Math.min(24,a.cohesion+.5)]
    ],
    kami:[
      ['festival','祭日的灯绕过小祠，众人抬着神轿走过你照看过的水渠。',{bond:1},a=>{a.faith=Math.min(30,a.faith+2.5);a.devotees=Math.min(12,a.devotees+1);}],
      ['blessing','你应着祈愿，让一道清水顺利流入干涸的田沟。',{insight:1},a=>{a.faith=Math.max(0,a.faith-1);a.abilities.push('水源小福');}],
      ['oracle','听得见神声的人在祠前停步，把你的叮嘱带给守渠的后辈。',{bond:1},a=>a.abilities.push('托祭传言')],
      ['neglect','这一回祭日少了几户人家，你的声音也变得缥缈了些。',{},a=>{a.faith=Math.max(0,a.faith-2);a.devotees=Math.max(0,a.devotees-1);}],
      ['roof','守祠人换好漏雨的瓦，按旧礼重新摆上供物。',{},a=>a.faith=Math.min(30,a.faith+1.5)],
      ['request','远处也传来求助，你守住眼前的水源，把微薄神力留给近旁。',{insight:1},a=>a.faith=Math.max(0,a.faith-.5)]
    ]
  };
  function afterlifeEvent(s,rng){
    const a=s.afterlife,kind=a.kind;
    // These echoes acknowledge surviving relationships without physical domestic scenes.
    const loved=s.partnerId?s.people[s.partnerId]:null;
    if(loved?.alive&&s.age-a.lastMemoryAt>=9)return event(kind,'beloved-'+s.turn,loved.medium==='dream'?'生前相恋的梦境浮上心头，你循着旧日记忆，念起那位梦中人的名字。':kind==='kami'?'生前的伴侣来到祠前，说起这些年的家事。你听着熟悉的声音，灯焰轻轻一动。':kind==='ghost'?'生前的伴侣在墓前念起家书，你停在远处，随熟悉的语调轻轻浮动。':'生前的伴侣托人送来供物，你留在荒径深处，收住了向外散去的怨气。',{bond:1},()=>{a.lastMemoryAt=s.age;if(kind==='ghost')a.cohesion+=.5;if(kind==='vengeful')a.resentment=Math.max(0,a.resentment-1);});
    const pool=scenes[kind].filter(scene=>!a.recentScenes.includes(scene[0]));
    const [key,text,effects,apply]=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
    const index=scenes[kind].findIndex(scene=>scene[0]===key);
    return event(kind,key+'-'+s.turn,text,effects,()=>{apply(a);a.recentScenes=[...a.recentScenes,key].slice(-3);a.abilities=[...new Set(a.abilities)];a.scenes++;},{xp:index===0||index===4?1:0});
  }
  function select(s,rng){
    if(s.ended)return null;
    if(s.afterlife)return afterlifeEvent(s,rng);
    if(s.dormant&&s.age>=s.dormant.wakeAt){
      const passed=!!s.development?.vessel&&rng()<.82;
      if(passed)return event('shikaisen','transformed','寄身之器化回熟悉的人形，你推开静室，山路已换过多轮草木。',{health:3,insight:1},()=>globalThis.TouhouEngine.transform(s,'shikaisen',{eventId:'development:shikaisen-transformed'}),{developmentMoment:mark('shikaisen','transformed','尸解复苏','寄物复苏后停止老化，仍须应对地狱追索。')});
      return event('shikaisen','wake-failed','复苏时寄身之器裂开，未能聚成的气息散在静室里。',{},()=>{fail(s);s.pendingCause='shikaisen-failed';},{developmentMoment:mark('shikaisen','failed','复苏未成','寄身之器失去承载，修行在此终止。')});
    }
    return prepare(s);
  }
  const endings={
    'shikaisen-failed':['寄身术尽','寄身之器未能完成复苏，守庵人按生前约定收起遗物，这一生止在静室里。'],
    'spirit-faded':['气质归风','旧名与记忆渐渐散开，最后一缕魂形归入夜风，墓道恢复了安静。'],
    exorcised:['怨影散尽','镇伏与岁月耗尽了魂形，荒径边的怨影终于散去，旧事仍留在证物里。'],
    appeased:['旧怨得安','供养与迟来的回应松开最后一缕怨念，你放下证物，接受了此番送别。'],
    forgotten:['祠灯渐寂','来祈愿的人渐渐散去，微薄神力已难以回应，小祠的灯也安静下来。']
  };
  function description(s){
    const a=s.afterlife,d=s.development;
    if(a){const amount=a.kind==='kami'?`信仰${Math.max(0,Math.round(a.faith))} · 供奉${a.devotees}户`:a.kind==='ghost'?`魂形${Math.max(0,Math.round(a.cohesion))} · 记忆渐淡`:`魂形${Math.max(0,Math.round(a.cohesion))} · 怨念${Math.max(0,Math.round(a.resentment))}`;return amount+(s.partnerId?' · 生死相隔':'');}
    if(d)return s.dormant?'寄物沉眠':d.ready?`${forms[d.kind].label}因缘已备`:`${forms[d.kind].label}准备 ${d.progress}/3`;
    if(s.species==='shikaisen')return '寄物复苏 · 停止老化';
    return null;
  }
  globalThis.TouhouAfterlife={forms,starts,init,select,canTransform,onTransform,beforeDeath,year,ending,endings,description,fail};
})();
