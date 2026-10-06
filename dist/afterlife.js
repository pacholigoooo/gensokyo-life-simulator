/* Ordinary-life developments. Canon distinctions and original rules: docs/development-research.md. */
(() => {
  const forms={
    shikaisen:{label:'尸解仙',habitat:'mountain',location:'山中寄身庵',stride:4,chapter:78,endTitle:'寄身长年',endText:'寄身之器依旧完好。你在山中继续修持，听见追索的风声便备好术式与退路。'},
    ghost:{label:'幽灵',habitat:'outskirts',location:'村外墓地',stride:3,chapter:62,endTitle:'夜风留声',endText:'旧事随夜风散开，你在安静的墓地歇下，仍偶尔随远处的歌声浮起。'},
    vengeful:{label:'怨灵',habitat:'outskirts',location:'封住的荒径',stride:3,chapter:64,endTitle:'荒径余怨',endText:'荒径又添了新草。你收束逸出的怨气，守着那桩仍待说清的往事。'},
    kami:{label:'神灵（受祭的人神）',habitat:'shrine',location:'村外小祠',stride:4,chapter:84,endTitle:'小祠香火',endText:'新一代守祠人记住了你的神名。祭日的灯继续亮着，你守望着这片受托照看的地方。'}
  };
  const mortal=s=>!s.ended&&!s.character&&s.species==='human'&&!s.transformation;
  const companyState=(age,id=null)=>({id,next:0,lastAt:age,flags:[],history:[],done:false});
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
    starts.push({id:`chance:${kind}-found`,text,effects:{},weight:({ghost:globalThis.TouhouLifeConfig.ghostOpportunityWeight,vengeful:globalThis.TouhouLifeConfig.vengefulOpportunityWeight})[kind]??1,repeat:1,...rules,
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
      s.afterlife={kind,since:s.age,lastAt:s.age,scenes:0,cohesion:18,resentment:d.resentment||0,faith:d.faith||0,devotees:d.devotees||0,appeasement:0,lastMemoryAt:s.age,belovedScenes:0,sceneCounts:{},recentScenes:[],abilities:[]};
      if(kind==='kami')s.afterlife.divinity={route:['water','pilgrimage','renewal'][(s.seed>>>0)%3],stage:0,lastAt:s.age,merit:0,history:[],reserve:0,recovery:null,partnerId:s.partnerId,partnerStage:0,partnerAt:s.age,
        partnerCompany:companyState(s.age,s.partnerId),company:{faith:companyState(s.age),misfortune:companyState(s.age)},companyAt:s.age};
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
    const chance={ghost:.78,vengeful:.68,kami:.76}[kind]+(kind==='kami'&&s.flags.has('legend:faith')?.20:0);
    if(!sound||rng()>=chance){
      recordKey(s,`development:${kind}-departure`,{ghost:'最后的气息散入夜色，留下的家书由后来人继续传阅。',vengeful:'生前积下的怨气随气息散去，旧案留给仍在世的人。',kami:'祠中仍有人念起你的旧名，供奉终究未能凝成神灵。'}[kind],{developmentMoment:mark(kind,'failed','余生落幕','生前准备未能承接此次死亡。')},record);
      fail(s);return false;
    }
    globalThis.TouhouEngine.transform(s,kind,{deathCause:cause,eventId:`development:${kind}-transformed`});
    recordKey(s,`development:${kind}-transformed`,{ghost:'呼吸止息后，一团带着旧日气质的幽灵浮起，你循家书中的歌声认回旧名。',vengeful:'肉身的气息断了，缠在证物上的怨念却聚成形，将你留在荒径旁。',kami:'肉身走到尽头，祭日的呼声将你留作小祠的神灵。你以生前熟悉的人形现身，回应众人的祈愿。'}[kind],{developmentMoment:mark(kind,'transformed',forms[kind].label+'之身',{ghost:'肉身已逝，靠凝聚的气质延续；记忆会渐渐淡去。',vengeful:'怨念维系魂形，须承受镇伏与供养。',kami:'受祭成神，神力随祭祀与信仰起伏。'}[kind])},record);
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
    if(a.kind==='kami'&&a.divinity.stage===5&&a.divinity.history[4].passed&&a.divinity.merit>=3&&a.faith>=6&&a.devotees>=4)return divineRoute(s).ending.id;
    return null;
  }
  const divineRoute=s=>globalThis.TouhouDivineLives.routes.find(r=>r.id===s.afterlife.divinity.route);
  function divineEnding(s,cause){
    if(s.afterlife?.kind!=='kami')return null;
    const e=divineRoute(s).ending;
    return cause===e.id?[e.title,e.text]:null;
  }
  function divineEvent(s,key,text,apply,extra={}){
    return event('kami','divine-'+key,text,{},apply,{scene:'神灵岁月',...extra});
  }
  // Both daily recollections and authored afterlife visits use the same surviving relationship.
  function afterlifePartner(s,id=s.partnerId){
    const p=id&&s.people[id],r=id&&s.relations[id];
    if(!id||s.partnerId!==id||s.firstPartnerId!==id||!p?.alive||p.leaveAt<=s.age||p.afterlife||p.dormant)return null;
    if(id!=='local:spouse'&&(r?.status!=='lover'||r.next!==null))return null;
    return {id,p,dream:p.medium==='dream'||r?.medium==='dream',confined:globalThis.TouhouContent.find(c=>c.id===id)?.confined};
  }
  function divinePartner(s){
    const partner=afterlifePartner(s,s.afterlife.divinity.partnerId);
    return partner&&!partner.dream?partner:null;
  }
  const faithCompany=()=>globalThis.TouhouDivineLives.contacts.characters;
  const authoredCompany=id=>id==='hina'?globalThis.TouhouMisfortuneContact:faithCompany().find(c=>c.id===id);
  function peerAvailable(s,id){
    const p=s.people[id],r=s.relations[id],c=globalThis.TouhouContent.find(c=>c.id===id);
    return s.realm==='gensokyo'&&id!==s.partnerId&&id!==s.firstPartnerId&&!c.confined&&
      (!p||p.alive&&p.leaveAt>s.age&&!p.afterlife&&!p.dormant&&p.medium!=='dream')&&
      r?.medium!=='dream'&&!['lover','enemy','estranged','parted','bereaved'].includes(r?.status);
  }
  function closeCompany(s,entry,progress,partner=false){
    return divineEvent(s,(partner?'shared-':'company-')+entry.id+'-closed',partner?entry.partnerInterrupted:entry.interrupted,()=>{
      progress.done=true;progress.closed=true;progress.lastAt=s.age;progress.history.push({stage:'closed',age:s.age});
      if(!partner)s.afterlife.divinity.companyAt=s.age;
    },{scene:(entry.id==='hina'?'厄神来往':'神明往来')+' · '+entry.title});
  }
  function companyStep(s,entry,progress,partner=false){
    const stage=entry[partner?'partner':'peer'][progress.next];
    if(!stage||s.age-progress.lastAt<stage.delay)return null;
    const passed=meets(s,stage.min)&&!(stage.requires||[]).some(f=>!progress.flags.includes(f));
    const choice=passed?stage.pass:stage.fail,index=progress.next;
    return divineEvent(s,(partner?'shared-':'company-')+entry.id+'-'+stage.key,choice.text,()=>{
      for(const f of choice.set||[])if(!progress.flags.includes(f))progress.flags.push(f);
      progress.next++;progress.lastAt=s.age;progress.done=progress.next===4;
      progress.history.push({stage:index,key:stage.key,age:s.age,passed});
      if(!partner)s.afterlife.divinity.companyAt=s.age;
    },{with:[entry.id],sharedWith:partner?entry.id:undefined,scene:(entry.id==='hina'?'厄神来往':'神明往来')+' · '+entry.title,
      developmentMoment:{kind:entry.id==='hina'?'misfortune-company':'divine-company',major:index===3,status:passed?'约定落实':'分歧留存',title:entry.title,impact:choice.text}});
  }
  function peerCompany(s,group){
    const a=s.afterlife,d=a.divinity,progress=d.company[group];
    if(progress.done)return null;
    if(progress.id){
      const entry=authoredCompany(progress.id);
      if(!peerAvailable(s,progress.id))return closeCompany(s,entry,progress);
      return companyStep(s,entry,progress);
    }
    // Hina handles misfortune independently; her invitation has no worshipper or faith threshold.
    if(s.age-a.since<(group==='faith'?4:8)||group==='faith'&&(a.faith<4||a.devotees<3))return null;
    const pool=(group==='faith'?faithCompany():[globalThis.TouhouMisfortuneContact]).filter(c=>peerAvailable(s,c.id));
    if(!pool.length)return null;
    const known=pool.filter(c=>s.people[c.id]),candidates=known.length?known:pool;
    const entry=candidates[(s.seed>>>0)%candidates.length],old=!!s.people[entry.id];
    return divineEvent(s,'company-'+entry.id+'-opening',entry.opening[old?'known':'new'],()=>{
      progress.id=entry.id;progress.lastAt=s.age;progress.known=old;progress.history.push({stage:'opening',age:s.age,known:old});d.companyAt=s.age;
    },{with:[entry.id],scene:(group==='misfortune'?'厄神来往':'神明往来')+' · '+entry.title});
  }
  function companyContinuation(s){
    const d=s.afterlife.divinity;
    if(s.age-d.companyAt<2)return null;
    // Older unfinished correspondence goes first; the two finite ledgers do not share flags.
    const groups=['faith','misfortune'].sort((a,b)=>d.company[a].lastAt-d.company[b].lastAt);
    for(const group of groups){const e=peerCompany(s,group);if(e)return e;}
    return null;
  }
  // 每段只推进一次；神职、复兴和伴侣往事共用一个附加位置，不取代原香火消耗。
  function continuation(s){
    const a=s.afterlife;
    if(s.ended||s.character||a?.kind!=='kami'||a.faith<=0||s.stats.health<=0)return null;
    const d=a.divinity,partner=divinePartner(s),authored=authoredCompany(d.partnerId);
    if(authored&&!d.partnerCompany.done){
      if(!partner||partner.confined){if(d.partnerCompany.next>0)return closeCompany(s,authored,d.partnerCompany,true);}
      else{const e=companyStep(s,authored,d.partnerCompany,true);if(e)return e;}
    }
    if(!authored&&d.partnerStage<2&&s.age-d.partnerAt>=(d.partnerStage===0?6:12)){
      if(!partner){
        if(d.partnerStage===1)return divineEvent(s,'shared-closed','旧约上的那个人已不能再来祠前。你请守祠人收好合写的两页，往后的祈愿另起一册。',()=>{d.partnerStage=2;});
        d.partnerStage=2;
      }
      else{
        const n=d.partnerStage,name=partner.p.name;
        const body=partner.confined
          ?[`${name}托旧日来往的人捎来一页近况，也问起祭日的新规矩。你请守祠人记下回音，把最难安排的一件事说清。`,`${name}又托人送来修改过的安排，特意留出双方叙旧的时辰。祭日过后，你借祠灯回应那句熟悉的问候。`][n]
          :[`${name}来到祠前，读起自己记下的这些年。你以熟悉的人形坐到身旁，讲起如今的打算，两人把各自想做的事写在旧约的另一页。`,`${name}带来做成之事的消息，又问你如今守护着什么。你与伴侣坐在祠前，讲起新接下的祈愿，两页旧约添上了不同的后续。`][n];
        return divineEvent(s,'shared-'+n,body,()=>{d.partnerStage++;d.partnerAt=s.age;},{sharedWith:partner.id,effects:{bond:1}});
      }
    }
    if(!d.recovery&&d.stage>=2&&d.merit>=1&&a.faith<=4){
      return divineEvent(s,'recovery-plan','祭日的席位空了许多。你请仍在的守祠人逐户问清缘由，暂缓一项赐福，把剩下的神力留给回信。',()=>{a.faith=Math.max(0,a.faith-.5);d.recovery={since:s.age,done:false};});
    }
    if(d.recovery&&!d.recovery.done&&s.age-d.recovery.since>=4){
      const restored=d.merit>=2&&s.stats.bond>=12;
      return divineEvent(s,'recovery-result',restored?'守祠人把祭日改到众人能来的时候，几户旧信众再次还愿。你听清了迟来的请求，只应下如今能照看的范围。':'逐户问过以后，仍只有少数人愿意回来。你记下这些人的心愿，将祭事缩到小祠前，留待来年的回应。',()=>{a.faith=Math.min(30,a.faith+(restored?4:1));a.devotees=Math.min(12,a.devotees+(restored?1:0));d.recovery.done=true;d.recovery.restored=restored;});
    }
    const route=divineRoute(s),stage=route.stages[d.stage];
    if(!stage||s.age-d.lastAt<stage.delay)return companyContinuation(s);
    const passed=d.merit>=(stage.meritRequired||0)&&meets(s,stage.min),choice=passed?stage.pass:stage.fail,index=d.stage;
    return divineEvent(s,route.id+'-'+stage.key,choice.text,()=>{
      a.faith=Math.max(0,Math.min(30,a.faith+choice.faith));a.devotees=Math.max(0,Math.min(12,a.devotees+choice.devotees));
      d.merit+=choice.merit;d.stage++;d.lastAt=s.age;d.history.push({stage:index,age:s.age,passed,merit:d.merit,faith:a.faith,devotees:a.devotees});
      if(choice.ability&&!a.abilities.includes(choice.ability)){a.abilities.push(choice.ability);d.reserve=Math.min(3,d.reserve+1);}
      if(route.id==='pilgrimage'&&index===1&&passed)s.location='村边新聚落的小祠';
    },{xp:passed?1:0,developmentMoment:{kind:'divinity',major:index===4,status:passed?'神职渐成':'祭事受挫',title:route.title,impact:choice.text}});
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
    // Kami may appear in human form; dreams and confined partners keep their own channels.
    const shared=afterlifePartner(s);
    const memories={
      kami:['伴侣来到祠前，你以熟悉的人形迎上去。两人在石阶上坐下，说起这些年的家事；听到一件好笑的小事，你们又笑到了一起。','伴侣说起自己的新打算，你听完，指着旧约问起一处还没想妥的安排。对方想了一会儿，又挪近些，与你商量该从哪件小事做起。','伴侣带来做成的东西，放到你面前，讲起途中吃过的苦。你细看了许久，认真夸起最喜欢的一处；对方笑了，又说起下一年的打算。'],
      ghost:['生前的伴侣在墓前念起家书，你停在远处，随熟悉的语调轻轻浮动。','伴侣带来一份自己的手记，读过你没能见到的新风景。你随念诵浮起，记住了从未同行过的那段路。','伴侣在墓边改念一首新曲，停在不熟的地方重新试。你随旋律轻轻起伏，原先写在家书里的曲调有了新的尾声。'],
      vengeful:['生前的伴侣托人送来供物，你留在荒径深处，收住了向外散去的怨气。','伴侣托人捎来旧案的新消息，也说自己重新拾起了搁置的事。你把追向来人的怨火压回旧物旁，让信使平安走远。','供物旁添了一页近况，伴侣说起一桩终于做成的心愿。你读到熟悉的笔迹，守过整夜，没让怨气越出荒径。'],
      dream:['生前相恋的梦境浮上心头，你循着旧日记忆，念起那位梦中人的名字。','旧梦里那处常相见的角落渐渐模糊，你记住对方说过的一句话，把记不清的细节留在原处。','你将还能记起的梦中约定默念了一遍，最后一次相见的余温散入夜色，此后的思念不再追着梦路走。'],
      distant:['生前伴侣托人带来近况，你留在原处听完，把熟悉的话记在心里。','一页捎来的记事说起伴侣最近的心愿，你听人念到末尾，默记住尚未说完的话。','转达近况的人已经离开，你回想纸上那些琐碎的小事，旧日相处的片段渐渐清晰。']
    };
    const partnerMemories=shared&&(shared.dream?memories.dream:shared.confined?memories.distant:(kind==='kami'&&authoredCompany(shared.id)?.memories)||memories[kind]);
    if(shared&&s.age-a.lastMemoryAt>=9)return event(kind,'beloved-'+s.turn,partnerMemories[a.belovedScenes%3],{bond:1},()=>{a.belovedScenes++;a.lastMemoryAt=s.age;if(kind==='ghost')a.cohesion+=.5;if(kind==='vengeful')a.resentment=Math.max(0,a.resentment-1);});
    const pool=scenes[kind].filter(scene=>!a.recentScenes.includes(scene[0]));
    const [key,text,effects,apply]=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
    const index=scenes[kind].findIndex(scene=>scene[0]===key),count=a.sceneCounts[key]||0;
    const variants=globalThis.TouhouAfterlifeYears[kind][key],body=count===0?text:variants[(count-1)%variants.length];
    const earned=kind==='kami'&&key==='blessing'&&a.divinity.reserve>0;
    const blessing=earned?'你依照多年应愿留下的办法，引一缕清水流入田沟。这回只耗去少许神力，守渠人照约接手后面的清淤。':body;
    return event(kind,key+'-'+s.turn,blessing,effects,()=>{a.sceneCounts[key]=count+1;const faith=a.faith;apply(a);if(earned){a.divinity.reserve--;a.faith=Math.max(0,faith-.5);}a.recentScenes=[...a.recentScenes,key].slice(-3);a.abilities=[...new Set(a.abilities)];a.scenes++;},{xp:index===0||index===4?1:0});
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
    if(a){const amount=a.kind==='kami'?`信仰${Math.max(0,Math.round(a.faith))} · 供奉${a.devotees}户 · ${divineRoute(s).title} ${a.divinity.stage}/5`:a.kind==='ghost'?`魂形${Math.max(0,Math.round(a.cohesion))} · 记忆渐淡`:`魂形${Math.max(0,Math.round(a.cohesion))} · 怨念${Math.max(0,Math.round(a.resentment))}`;return amount+(s.partnerId?(a.kind==='kami'?' · 神身续缘':' · 生死相隔'):'');}
    if(d)return s.dormant?'寄物沉眠':d.ready?`${forms[d.kind].label}因缘已备`:`${forms[d.kind].label}准备 ${d.progress}/3`;
    if(s.species==='shikaisen')return '寄物复苏 · 停止老化';
    return null;
  }
  globalThis.TouhouAfterlife={forms,starts,init,select,canTransform,onTransform,beforeDeath,year,ending,endings,description,fail,continuation,divineEnding};
})();
