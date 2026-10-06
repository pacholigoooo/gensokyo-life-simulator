/* Original, finite talent encounters use the lifecycle's ordinary event rules. */
(() => {
 const list=[];
 const animal=s=>s.body==='beast'||s.character?.animalMind===true;
 const words=(human,beast,machine)=>s=>animal(s)?beast:s.body==='machine'?machine:human;
 const companion=s=>Object.entries(s.people).find(([id,p])=>id.startsWith('local:')&&id!=='local:spouse'&&id!=='local:child'&&p.alive&&p.leaveAt>s.age);
 const drawNear=s=>{const p=companion(s);if(p)p[1].close++;};
 const fired=(s,id)=>s.talentSeen[id+':0']!==undefined;
 const canClue=s=>!s.flags.has('talent-clue:youkai')&&globalThis.TouhouEngine.eligible(s,globalThis.TouhouOpportunities.starts.find(e=>e.id==='chance:youkai-found'));
 const labels={find:'偶得余裕',share:'分出一份',chase:'再追一次',keep:'留作日用',notice:'察觉差别',solve:'验证新法',misjudge:'遗漏细节',ease:'缓息备药',company:'陪旧识调养',rest:'继续休息',trace:'辨认灵气',clue:'留下妖术线索',learn:'认清旧痕',blur:'气息混杂',corner:'安静一角',welcome:'留客歇脚',settle:'原处安顿',repeat:'多年反复',master:'做稳难处',pause:'收住练习',revise:'重整舍虫术式',try:'试探分量',balanced:'留出余力',overreach:'多做一程',recover:'改稳作息',dream:'梦路错位',orient:'认回归路',lost:'追梦疲乏',embers:'余火渐稳',shelter:'护住旧识',quiet:'缓慢日常',adapt:'应时调整',miss:'起居失宜',alone:'沿用新作息'};
 const done=id=>'talent-story:'+id+':done';
 const mark=(id,step)=>'talent-story:'+id+':'+step;
 function event(talent,key,text,effects={},rules={}){
  const grade=globalThis.TouhouTalents.list.find(t=>t.id===talent).grade;
  list.push({id:'talent-story:'+talent+':'+key,talent,grade,label:labels[key],text,effects,weight:1,repeat:1,phases:[2,4],talentBoost:[talent],conditions:[],...rules,
   requires:['talent:'+talent,...(rules.requires||[])],excludes:[done(talent),...(rules.excludes||[])]});
 }
 const f='fortune';
 event(f,'find',words('收拾旧物时，你发现一份还能用的余料，正好省下这回开销。','你循着熟悉的气味找到新食源，记住了回去的路。','检修时留下的余件正好合用，你的维护用料宽裕了一些。'),{fortune:1},{min:{fortune:5},set:[mark(f,'found')],conditions:['家底足以留意并利用零散物资。']});
 event(f,'share',words('你把多出的余料送给旧识，两人又一起做完一件小活。','你让熟悉的同伴靠近新食源，等它吃过才一同离开。','旧识用上你留下的余件，检修时也多照看了你一会儿。'),{fortune:-1,bond:2},{requires:[mark(f,'found')],min:{bond:7},when:s=>!!companion(s),apply:drawNear,set:[done(f)],conditions:['已有仍在世的邻伴或同道，愿意分享偶得物资。']});
 event(f,'chase',words('你想沿旧线索再多赚一回，花去路费，却扑了个空。','你追着相似气味走远，回程疲乏，仍只找回原来的食源。','你反复尝试一件相似余件，接口始终不合，只好停下。'),{fortune:-2,health:-1},{requires:[mark(f,'found')],max:{bond:6},wear:2,set:[done(f)],conditions:['继续追逐偶得好处，需承担耗费与疲劳。']});
 event(f,'keep',words('你把余料留给自己的日用，下一回修补时少花了一笔。','你记住食源，下一回饿了便循原路返回。','那件余件留在检修处，下一回维护时便用上了。'),{fortune:1},{requires:[mark(f,'found')],min:{bond:7},when:s=>!companion(s),xp:1,set:[done(f)],conditions:['没有可一同分享的在世邻伴，将余裕用于自己。']});
 const i='insight';
 const insightNotice=words('反复做过的事忽然接上了，你停下来试了一种新做法。','几次转向的气味忽然相连，你试着换了一条近路。','旧动作中的卡顿有了规律，你开始逐段试过。');
 event(i,'notice',x=>x.flags.has(mark(i,'tool-setback'))?(x.body==='machine'?'试运转时，检修工具断了一角。你停在原处，等它重新修好。':'试新做法时，旧工具断了一角。你找出它卡住的位置，暂时把它放下。'):insightNotice(x),{}, {phases:[1,4],min:{insight:9},apply:x=>{if(!animal(x)&&x.tools){x.flags.add(mark(i,'tool-setback'));x.tools=false;}},xp:1,set:[mark(i,'question')],conditions:['悟性让熟悉动作显出新的联系；若已有工具，试验会使它暂时停用。']});
 const insightSolve=words('你用积下的经验验证新做法，终于解开难处，往后做事省了些力。','你循记住的气味试过新路，绕开阻挡，安稳到了熟悉的角落。','几轮试运转后，错位被找出，重复卡顿终于停了。');
 event(i,'solve',x=>x.flags.has(mark(i,'tool-setback'))?(x.body==='machine'?'断裂的检修工具修好后，你试过机身动作，卡顿终于缓和。':'你找到旧工具断裂的缘由，花掉少许用料，将它修好，重新放回手边。'):insightSolve(x),{fortune:-1,insight:1},{requires:[mark(i,'question')],min:{insight:12,fortune:1},devMinXp:6,when:s=>s.xp>=6,apply:x=>{if(x.flags.has(mark(i,'tool-setback')))x.tools=true;},xp:3,wear:-2,set:[done(i)],conditions:['已产生新想法，历练至少6，尚有试验用料；此前试坏的旧工具可修好；没有旧工具则验证做法并减耗。']});
 event(i,'misjudge',words('新做法漏了一处细节，你费力返工，把出错的地方重新记牢。','新路的气味断在岔处，你费力绕回，记住那处转向。','试运行仍在同一处停住，你逐段重试，留下了这回偏差。'),{health:-1},{requires:[mark(i,'question')],when:s=>s.stats.insight<12||s.xp<6||s.stats.fortune<1,xp:1,wear:1,set:[done(i)],conditions:['悟性、历练或试验用料不足，尝试会留下疲劳。']});
 const h='healing';
 event(h,'ease',words('熬过最难的一阵后，你重排作息，将一份调养药草备在身边。','气力回来的日子，药草留在熟悉暖处，你闻着气味伏下歇息。','机件的动作恢复平稳，备用件留在检修处，等下回维护用。'),{}, {when:s=>fired(s,h),apply:s=>{s.remedy=true;s.remedyAt=s.age;},xp:1,wear:-1,set:[mark(h,'paced')],conditions:['春风再至的首次濒弱恢复已经触发；备一份药草，机身备替换件，沿用原有消耗与保存规则。']});
 event(h,'company',words('你把调养时摸出的办法讲给旧识，坐着陪对方慢慢试过。','熟悉的同伴靠近，你让出安静的位置，陪它歇过一阵。','旧识照着这回检修经验调整旧件，你停在旁边试过动作。'),{health:-1,bond:1},{requires:[mark(h,'paced')],min:{health:6},when:s=>!!companion(s),apply:drawNear,set:[done(h)],conditions:['已经放缓作息，气力足够陪伴仍在世的旧识。']});
 event(h,'rest',words('你将调养留给自己，少做一件杂务，睡醒时气力又稳了一点。','你继续留在安静的暖处，等周围声响渐远，气力慢慢稳住。','你留在检修处歇息，动作重新试稳后才恢复日常运行。'),{health:1},{requires:[mark(h,'paced')],when:s=>s.stats.health<6||!companion(s),wear:-1,set:[done(h)],conditions:['气力尚弱，或身旁暂无在世旧识，先继续休息。']});
 const s='spirit-eye';
 event(s,'trace',words('微弱灵气停在一处旧痕上，你循着它辨认了很久。','陌生气息藏在熟悉声响之间，你停在原处，认清它消散的方向。','旧痕旁有微光反复起落，你转向那里，记住亮暗之间的停顿。'),{}, {phases:[1,4],min:{insight:9},xp:1,set:[mark(s,'trace')],conditions:['能辨出微弱灵气，并已积下一点观察。']});
 event(s,'clue', '你辨清旧痕中灵气的走向，记下一处可以继续寻访的妖术线索。',{}, {requires:[mark(s,'trace')],min:{insight:11},devMinXp:7,when:x=>x.xp>=7&&canClue(x),set:['talent-clue:youkai',done(s)],conditions:['普通出身人类，历练至少7；当前符合妖术发现的年龄、居处与尝试限制。','未持有未用的妖术线索；线索在下一次真实发现时消耗。']});
 event(s,'learn',words('旧痕的来由渐渐清楚，你把观察留作经验，沿熟悉的路继续生活。','你记住陌生气息的边缘，下一回经过便停在熟悉的一侧。','亮暗的停顿渐渐清楚，你按记住的间隔调整了下一回动作。'),{insight:1},{requires:[mark(s,'trace')],min:{insight:11},devMinXp:7,when:x=>x.xp>=7&&!canClue(x),xp:2,set:[done(s)],conditions:['历练至少7；当前无法继续普通人的妖术发现，或已持有线索。']});
 event(s,'blur',words('两处灵气混在一起，你追看得头昏，回去歇下才渐渐分清。','陌生气息混进岔处，你绕回熟悉角落，歇下后才认清来路。','微光与旧痕重叠，你反复转向试过，运行一阵便停下。'),{health:-1},{requires:[mark(s,'trace')],when:x=>x.stats.insight<11||x.xp<7,xp:1,wear:1,set:[done(s)],conditions:['观察或历练尚不足以分清旧痕，反复尝试会疲劳。']});
 const a='home';
 event(a,'corner',words('你在久居处找到最安静的一角，整理好了歇息用的东西。','你在熟悉栖处找到安静的一角，挪近那里伏下。','检修处空出一角，你停稳在旁，等动作与声响慢慢平缓。'),{}, {when:x=>x.home,set:[mark(a,'corner')],conditions:['已经拥有稳定居处，能在原处安排歇息。']});
 event(a,'welcome','旧识来时，你留出一张座位和一份茶点。闲话说完，对方才慢慢起身。',{fortune:-1,bond:2},{requires:[mark(a,'corner')],bodies:['humanoid','spirit'],min:{bond:6,fortune:2},needsFreedom:true,when:x=>!animal(x)&&!!companion(x),apply:drawNear,wear:-1,set:[done(a)],conditions:['有仍在世的邻伴或同道，可接待来客，并留有茶点用度。']});
 event(a,'settle',words('你把杂务放到一旁，在熟悉角落歇了一阵，醒来又听见日常声响。','你在熟悉的安静角落伏了一阵，周围气味与声响都渐渐平稳。','你在固定的检修角落停下，积灰被擦去，动作又平稳了一些。'),{health:1},{requires:[mark(a,'corner')],when:x=>!['humanoid','spirit'].includes(x.body)||animal(x)||x.character?.confined||!companion(x)||x.stats.bond<6||x.stats.fortune<2,wear:-2,set:[done(a)],conditions:['身体、幽闭处境或来往用度不适合接待，留在原处休息。']});
 const p='patient';
 event(p,'repeat',words('你反复哼一段熟悉曲调，终于听出换气时漏了同一拍。','同一段路往返了许多回，你渐渐认清每处声响与停步的差别。','同一组动作试过许多回，你逐渐辨清每处停顿的差别。'),{}, {min:{insight:8},devMinXp:4,when:x=>x.xp>=4,xp:1,set:[mark(p,'repeat')],conditions:['历练至少4，反复实践已经留下可比较的经验。']});
 event(p,'master',words('你换了停顿，把漏掉的拍子慢慢接好，哼完曲调时还留着气力。','你沿记熟的路平稳绕过阻挡，往返时终于留得住气力。','反复试过的停顿被调匀，你稳稳做完最费力的一组动作。'),{insight:1,fortune:-1},{requires:[mark(p,'repeat')],min:{insight:10,fortune:1},devMinXp:10,when:x=>x.xp>=10,xp:3,wear:-1,set:[done(p)],conditions:['历练至少10，悟性和用度足以改稳实际难处。']});
 event(p,'pause',words('那一拍仍接得费力，你收住曲调，养足气力才恢复日常。','那一段路仍走得吃力，你停在熟悉角落，歇够才恢复往返。','这一组动作仍有偏差，你停下试运转，等检修后恢复日常。'),{health:1},{requires:[mark(p,'repeat')],when:x=>x.stats.insight<10||x.xp<10||x.stats.fortune<1,xp:1,wear:-1,set:[done(p)],conditions:['经验或用度未足，收住高难尝试；原有定期成长照常生效。']});
 event(p,'revise','你重整多年试过的舍虫术式，花去一份耗材，将下次研习提早了一点。',{fortune:-1},{requires:[mark(p,'repeat')],bodies:['humanoid'],min:{insight:10,fortune:1},devMinXp:10,when:x=>x.xp>=10&&!!x.magic&&!x.magic.ageless&&['born','learned'].includes(x.magic.origin)&&x.magic.attempts>=1&&x.magic.nextStudyAt!==null&&x.magic.nextStudyAt>=x.age+3,apply:x=>x.magic.nextStudyAt=Math.max(x.age+1,x.magic.nextStudyAt-2),xp:2,wear:1,set:[done(p)],conditions:['历练至少10；已是仍会老化的天生或后天魔法使，已至少尝试一次舍虫，下次研习至少还有3年。','只将原定研习提前2年，仍须等待与真实成功判定，魔理沙的人类魔法使用不适用。']});
 const v='healthful';
 event(v,'try',words('气力渐足，你试着连做几件费劲的日常，留心身体怎样回应。','你连着在熟悉范围活动几回，停下时仍留意身体的力气。','机身平稳，你连续试过几组动作，留意运转怎样变化。'),{health:-1},{min:{health:9},xp:1,wear:1,set:[mark(v,'tested')],conditions:['体魄足以主动试探自己的活动分量，全程留在熟悉范围。']});
 event(v,'balanced',words('你在疲劳前停住，留出了日用的余力，往后的作息更从容。','你在疲乏前回到熟悉角落，歇过这一阵，身体仍有余力。','运行的分量被调稳，机身停下检修时仍保有顺畅的动作。'),{health:1},{requires:[mark(v,'tested')],excludes:[mark(v,'rest')],min:{health:11},when:x=>x.wear<=x.vitality*.55,wear:-2,xp:2,set:[done(v)],conditions:['体魄至少11，累计耗损不超过生涯余力的55%。']});
 event(v,'overreach',words('你凭着气力多做了一程，疲劳却迟迟不退，只好把手边事放下。','你又多活动了几回，回来时气力明显弱了，伏下后迟迟没动。','你接着试过更多动作，机身渐渐卡顿，只好停在检修处。'),{health:-2},{requires:[mark(v,'tested')],excludes:[mark(v,'rest')],when:x=>x.stats.health<11||x.wear>x.vitality*.55,wear:2,set:[mark(v,'rest')],conditions:['体魄或耗损未能支撑继续活动，需经历一次休养。']});
 event(v,'recover',words('你缩减这一阵的杂务，睡醒后先做轻活，慢慢稳住新的作息。','你多伏了一阵，只在熟悉角落缓缓活动，气力渐渐稳住。','运行时间缩短后，机件经过检修，日常动作渐渐稳定。'),{health:1},{requires:[mark(v,'rest')],wear:-2,set:[done(v)],conditions:['已因逞力疲劳，结束这回尝试并调整作息。']});
 const b='boundary';
 event(b,'dream',words('梦里出现一条熟悉又错位的路，醒来时你还认得那处转角。','歇息中浮现熟悉又陌生的角落，你醒后循气味认了一遍。','停歇时浮现错位的熟悉景象，动作恢复后，那处差别仍留着。'),{}, {phases:[1,4],xp:1,set:[mark(b,'dream')],conditions:['隙间一梦留下了可再辨认的错位见闻。']});
 event(b,'clue','你辨出梦路与醒后旧道的接点，记下一处气息异常的转角，准备寻访。',{}, {requires:[mark(b,'dream')],min:{insight:12},devMinXp:8,when:x=>x.xp>=8&&canClue(x),set:['talent-clue:youkai',done(b)],conditions:['普通出身人类，历练至少8；当前符合妖术发现的年龄、居处与尝试限制。','未持有未用的妖术线索；线索在下一次真实发现时消耗。']});
 event(b,'orient',words('你在熟悉的转角辨出梦路差别，收住脚步，醒后仍沿自己认得的路走。','你醒后认清熟悉气味，留在原来的活动范围，梦里的错位渐渐消散。','动作恢复后，你核对熟悉的转向，错位的景象渐渐散去。'),{insight:1},{requires:[mark(b,'dream')],min:{insight:12},devMinXp:8,when:x=>x.xp>=8&&!canClue(x),xp:2,set:[done(b)],conditions:['历练至少8；当前无法继续普通人的妖术发现，或已有线索。']});
 event(b,'lost',words('你追着错位的梦路越走越深，醒来时神思疲乏，歇下才认清四周。','你在错位景象中来回转向，醒来时伏了很久，才认出熟悉气味。','错位景象让动作接连偏转，你停下运行，重试后才找回熟悉方向。'),{health:-1,bond:-1},{requires:[mark(b,'dream')],when:x=>x.stats.insight<12||x.xp<8,wear:2,set:[done(b)],conditions:['悟性或历练不足以辨清梦路，追寻会疲惫；梦不会直接改变种族。']});
 const z='phoenix';
 event(z,'embers',words('那口气缓回来以后，你花时间养稳身体，指间的余温慢慢散去。','气力缓回来后，你安静伏在熟悉角落，等身体慢慢稳住。','机身稳住以后，你留在检修处，等部件与运转重新平稳。'),{}, {when:x=>fired(x,z),wear:-2,set:[mark(z,'settled')],conditions:['余火不灭的唯一一次濒危恢复已触发，随后仍需休养。']});
 event(z,'shelter',words('旧识遇险时，你用剩下的气力挡开落物，回去以后才坐下喘息。','落下的东西逼近同伴，你挡住它的来路，退回熟悉角落歇下。','落物逼近旧识，你撑住松动的边角，停稳后才等来检修。'),{health:-2,bond:1},{requires:[mark(z,'settled')],min:{health:7},when:x=>!!companion(x)&&!x.character?.confined,needsFreedom:true,apply:drawNear,xp:1,wear:2,set:[done(z)],conditions:['气力至少7，能行动，身旁有仍在世的邻伴或同道；护人仍会耗损。']});
 event(z,'quiet',words('你将余下气力留给日常，慢慢做完轻活，入夜便安稳歇下。','你只在熟悉角落短暂活动，周围安静下来时便伏着歇息。','你只恢复轻缓动作，停稳后留在检修处，等磨损慢慢修好。'),{health:1},{requires:[mark(z,'settled')],when:x=>x.stats.health<7||!companion(x)||x.character?.confined,wear:-1,set:[done(z)],conditions:['气力或行动、陪伴条件不足，继续缓息；濒危恢复不会再次充能。']});
 const q='blessing';
 event(q,'notice',words('熟悉角落的寒暖变了，你歇下后总觉不适，打算换换垫物。','熟悉角落的气息有些变化，你换了歇息的位置，慢慢适应。','周围冷暖改变时，动作略有差别，你反复试过才停稳。'),{}, {phases:[1,4],xp:1,set:[mark(q,'noticed')],conditions:['能察觉居处气息的变化，月牢和地下也只描写身旁冷暖。']});
 event(q,'adapt',words('你换下轻薄垫物，添好一层软垫，歇下时身旁冷暖正合适。','你换到合适的歇处，随气息变化调整活动，身体安稳下来。','检修用料换好后，动作重新调匀，机件适应了周围冷暖。'),{fortune:-1,health:1},{requires:[mark(q,'noticed')],min:{insight:8,fortune:2},devMinXp:5,when:x=>x.xp>=5,xp:2,wear:-1,set:[mark(q,'adapted')],conditions:['历练至少5，悟性与用度足以调整身边起居。']});
 event(q,'miss',words('旧习惯赶不上这一回变化，你费力添减用物，疲劳散得慢了一些。','熟悉歇处变得不适，你来回找了几处，疲乏后才伏稳。','周围变化让动作迟滞，你停下试运转，等待下一回检修。'),{health:-1},{requires:[mark(q,'noticed')],when:x=>x.stats.insight<8||x.stats.fortune<2||x.xp<5,wear:2,set:[done(q)],conditions:['悟性、用度或历练不足，这回适应会留下疲劳。']});
 event(q,'share',words('你向旧识讲起换垫物时的小差别，两人一同收拾，再坐着闲话。','旧识靠近时，你让出合适的歇处，一同等周围气息安稳下来。','旧识依照这回调整维护旧件，你在旁试过熟悉动作。'),{bond:1},{requires:[mark(q,'adapted')],when:x=>!!companion(x),apply:drawNear,set:[done(q)],conditions:['已有仍在世的邻伴或同道，可一起应对身旁变化。']});
 event(q,'alone',words('你收好换下的垫物，在新铺的软垫上歇了一阵，醒来仍觉得暖和。','你照着认清的气息活动歇息，熟悉角落又安稳起来。','你按调整后的间隔运行，动作平稳，检修处渐渐安静。'),{health:1},{requires:[mark(q,'adapted')],when:x=>!companion(x),wear:-1,set:[done(q)],conditions:['暂无仍在世的邻伴，独自沿用这回调整。']});
 const archive='archive';
 event(archive,'fragments',words('几册旧记把同一场雪写成不同年份。你留下能互相对照的段落，准备考订这处异文。','旧栖处几次雪后的气味与记忆里的时序不合。你记住差别，留意熟悉气息怎样更替。','旧记录把同一次停机记在两个年份。你保留两处记载，准备核对前后的运行次序。'),{}, {label:'旧记异文',phases:[1,4],min:{insight:8},xp:1,set:[mark(archive,'fragments')],conditions:['悟性至少8，能发现旧记或自身记忆中的时序差异。']});
 event(archive,'collate',words('你花一份用度补齐缺页，对照雪期与收成，认出其中一册把后来的补记当成了旧事。','你等过几回熟悉气息的更替，把先后发生的变化重新分清，认出了记错的一段。','你调出相邻几次检修记录，核对耗材与停机间隔，认出一段后来补入的旧编号。'),{fortune:-1,insight:1},{label:'逐条考订',requires:[mark(archive,'fragments')],min:{insight:10,fortune:1},devMinXp:6,when:x=>x.xp>=6,xp:2,set:[mark(archive,'collated')],conditions:['已有异文，悟性至少10、历练至少6、家底至少1；核对证据需要一份用度。']});
 event(archive,'verified',words('你将考实的年月与仍待查的传闻分开记好。下一回重读，旧事的先后终于不再混在一起。','你把已分清的气息更替记牢，不再把那段模糊的记忆当成可靠的来路。','你将校正的编号与尚未核实的记录分别留存，往后的检修能辨清那次停机的先后。'),{insight:1},{label:'旧记定序',requires:[mark(archive,'collated')],xp:2,set:[mark(archive,'verified'),done(archive)],conditions:['已经逐条考订，保留可核实的结论，不将传闻补作事实。']});
 event(archive,'unresolved',words('能对照的旧记还不够，你在疑处留下待考，暂时收好缺页，没有替旧事编出一个年份。','气息的更替仍对不上记忆，你留在认得的范围，把那段模糊的来路暂且放下。','记录与耗材的编号仍有缺口，你标出未定的时段，没有让猜测覆盖原来的记载。'),{}, {label:'疑处待考',requires:[mark(archive,'fragments')],excludes:[mark(archive,'collated')],when:x=>x.stats.insight<10||x.stats.fortune<1||x.xp<6,xp:1,set:[mark(archive,'unresolved'),done(archive)],conditions:['尚未考订完成，悟性、历练或核对用度不足，保留疑处并结束这回考订。']});
 const artisan='artisan';
 event(artisan,'worn',words('一件旧物总在同一处松动。你先看清受力与磨损的方向，留住尚能用的部分，准备试修。','熟悉栖处的遮风物歪了，你留意松动处怎样漏风，认清还能抵稳的边角。','一件备用件总在同一处松动，你核对接口和磨损，保留尚能配合的部分，准备试修。'),{}, {label:'旧物受损',min:{insight:8},xp:1,set:[mark(artisan,'worn')],conditions:['悟性至少8，先认清身边旧物或栖处遮风物的实际损坏。']});
 event(artisan,'fitted',words('你花去一份用料，先试修松动的连接处。几次受力都稳住以后，旧物终于恢复了原来的用途。','你反复贴近松动的遮风物，把歪斜处抵稳。熟悉栖处渐渐安静，你试过几回才停下。','你花去一份维护用料，试修备用件的连接处。接口经过几次试运转，终于不再自行松开。'),{fortune:-1,insight:1},{label:'试修接缝',requires:[mark(artisan,'worn')],min:{insight:10,fortune:1},devMinXp:6,when:x=>x.xp>=6,xp:2,set:[mark(artisan,'fitted')],conditions:['已认清损坏，悟性至少10、历练至少6、家底至少1；消耗用料试修，不凭空添置工具。']});
 event(artisan,'verified',words('修过的旧物又经住一阵日用，你记下合适的分量。这回省下了换新的开销，也留下了可再用的修法。','抵稳的遮风物经住一阵风，原来的栖处又能安稳歇息，你省下了另寻落脚处的气力与用度。','修过的备用件经住一阵运行，你保存合用的参数，省下了换件开销，也留下一份实际检修经验。'),{fortune:2},{label:'旧物复用',requires:[mark(artisan,'fitted')],xp:1,set:[mark(artisan,'verified'),done(artisan)],conditions:['试修已经完成，确认实际耐用后才收回节省的用度。']});
 event(artisan,'deferred',words('试修的办法还不稳，你将可用部分留好，收住这次尝试，免得把整件旧物一并试坏。','松动处仍抵得费力，你退到原有的安静位置，没有为了遮风再挤进不稳的边角。','接口与用料还无法配合，你留下可用的部分，停止试修，避免连同完好的部件一起损坏。'),{}, {label:'留材收手',requires:[mark(artisan,'worn')],excludes:[mark(artisan,'fitted')],when:x=>x.stats.insight<10||x.stats.fortune<1||x.xp<6,xp:1,set:[mark(artisan,'deferred'),done(artisan)],conditions:['尚未试修完成，悟性、历练或用料不足，保留旧物可用部分并结束尝试。']});
 const vein='earth-vein';
 event(vein,'heard',words('静处传来一阵细响，水声和地面轻震错开了半拍。你留意它们的先后，准备察清近处地脉。','熟悉角落的地面微微震动，水气却晚些才到。你安静停留，记住两种变化的先后。','底座传来轻震，近处的水声却慢了半拍。你留住两段间隔，准备分辨震动从何处传来。'),{}, {label:'地脉初闻',min:{insight:9},xp:1,set:[mark(vein,'heard')],conditions:['悟性至少9，只察觉居处近旁的水声与地面震动，不要求远行或新肢体。']});
 event(vein,'tested',words('你花去一份用度，在近处反复比较水声与轻震。费力察验之后，认出一处回响是空隙所致，并非地脉改道。','你在熟悉角落反复辨认轻震与水气，耗去一点气力与余粮，终于认出一处空隙传来的回响。','你花去一份校验用料，反复比较底座轻震与水声。几次试运转之后，认出偏差来自附近的空隙。'),{health:-1,fortune:-1},{label:'实察回响',requires:[mark(vein,'heard')],min:{health:7,insight:12,fortune:1},devMinXp:8,when:x=>x.xp>=8,xp:2,set:[mark(vein,'tested')],conditions:['已记住回响，体魄至少7、悟性至少12、历练至少8、家底至少1；实察消耗气力与用度。']});
 event(vein,'verified',words('你将空隙的回响与真正稳定的震动分清，不再被每次细响牵着耗神。歇过一阵，积下的疲劳缓了一些。','你认清熟悉角落的稳定轻震，不再追着空隙的回响来回活动，歇下后气力渐渐平稳。','你分清底座的稳定轻震与空隙回响，减少无用的反复校验，停稳后渐渐缓和了磨损。'),{insight:1},{label:'辨脉留力',requires:[mark(vein,'tested')],wear:-2,xp:2,set:[mark(vein,'verified'),done(vein)],conditions:['已实察近处回响，减去2点累计耗损，不改变寿命、种族或居处。']});
 event(vein,'deferred',words('回响仍听得混杂，你察看一阵便觉疲乏，收住这回追辨，留下未能核实的差别。','轻震与水气仍混在一起，你停留得疲乏，退回熟悉位置，暂时不再追辨那处差别。','轻震的来源仍无法分清，反复校验开始增加负担，你停下运行，留下尚未核实的间隔。'),{health:-1},{label:'听脉止步',requires:[mark(vein,'heard')],excludes:[mark(vein,'tested')],when:x=>x.stats.health<7||x.stats.insight<12||x.stats.fortune<1||x.xp<8,wear:1,xp:1,set:[mark(vein,'deferred'),done(vein)],conditions:['尚未实察完成，气力、悟性、历练或察验用度不足，反复追辨仍会疲劳，随后结束这回察验。']});
 const chart='star-chart';
 event(chart,'mismatch',words('一幅旧星图的时辰与记忆不合，你留下那处差异，准备核对星位与那次见闻的先后。','记忆中两次夜间活动的星光方向并不一样。你记住熟悉暗处的差别，留意星光与时刻的关系。','旧星位记录与计时出现偏差，你保留两组读数，准备核对星位与运行时刻的先后。'),{}, {label:'旧图错时',phases:[1,4],min:{insight:10},xp:1,set:[mark(chart,'mismatch')],conditions:['悟性至少10，从旧图、既有记忆或记录中发现差异，不要求当前能看见夜空。']});
 event(chart,'calibrated',words('你花一份用度补来对照记录，逐项比较星位与时辰，认出旧图漏记了一段计时的偏差。','你等过几回熟悉的明暗变化，把记住的星光方向与先后重新对上，认出漏掉的一段时刻。','你花去一份校准用料，对照旧星位与计时记录，认出偏差来自一次遗漏的计时修正。'),{fortune:-1,insight:1},{label:'星位校时',requires:[mark(chart,'mismatch')],min:{insight:13,fortune:2},devMinXp:8,when:x=>x.xp>=8,xp:2,set:[mark(chart,'calibrated')],conditions:['已有错时记录，悟性至少13、历练至少8、家底至少2；只校验旧见闻，不打开外界或梦境通路。']});
 event(chart,'verified',words('你将校过的星位与时辰列在同一页，那次见闻的先后终于排定。仍无依据的图角留白，旧星图有了可复查的次序。','你记牢星光与明暗变化的先后，不再把不同夜里的见闻混成同一次活动，模糊的方向仍暂且放下。','你将校正的星位与时刻一同留存，能复查的记录按次序排好，缺失的读数仍保留空处。'),{insight:1},{label:'星图定稿',requires:[mark(chart,'calibrated')],xp:2,set:[mark(chart,'verified'),done(chart)],conditions:['已经校时，只保留可核实的星位与次序，不生成路签或直接授予秘封相遇。']});
 event(chart,'unresolved',words('一处星位仍对不上时辰，你标好待考，把旧图收回原处，没有据此定下新的行期。','星光与明暗的先后仍对不上，你留在熟悉范围，没有把模糊的方向当成新的去路。','星位与时刻仍有缺口，你保留未定的读数，没有用猜测重新安排运行次序。'),{}, {label:'星位待考',requires:[mark(chart,'mismatch')],excludes:[mark(chart,'calibrated')],when:x=>x.stats.insight<13||x.stats.fortune<2||x.xp<8,xp:1,set:[mark(chart,'unresolved'),done(chart)],conditions:['尚未校时完成，悟性、历练或校验用度不足，留下待考星位并结束这回校订。']});
 // Gold encounters belong to an ordinary adult's lived journey. Each token has a
 // producer and a consumer; none of these events silently change species or revive a person.
 const legendary=[],gold=s=>s.talents.some(id=>globalThis.TouhouTalents.list.find(t=>t.id===id)?.grade===3);
 const living=s=>!s.character&&!s.afterlife&&!s.dormant&&!s.pendingCause&&!s.injured&&s.body==='humanoid'&&s.realm==='gensokyo'&&s.age>=18&&s.stats.health>=4;
 function legend(key,text,effects={},rules={}){
  const condition=rules.when;
  legendary.push({id:'legendary:'+key,label:rules.label||key,text,effects,weight:1,repeat:1,minAge:18,bodies:['humanoid'],realms:['gensokyo'],...rules,when:s=>gold(s)&&living(s)&&(!condition||condition(s))});
 }
 const flag=key=>'legend:'+key;
 const since=(s,key,years=1)=>s.age-s.log.find(e=>e.id==='legendary:'+key).age>=years;
 function traveller(s){
  const id=s.partnerId,p=id&&s.people[id];
  if(!p?.alive||p.leaveAt<=s.age||p.medium==='dream'||s.relations[id]?.medium==='dream')return null;
  const c=globalThis.TouhouContent.find(c=>c.id===id);
  return id==='local:spouse'||c&&!c.confined&&c.body==='humanoid'&&!c.animalMind?id:null;
 }
 function mastery(s){
  if(s.legendaryMastery||!s.flags.has(flag('insight')))return null;
  const d=s.careerDevelopment;
  if(s.species==='magician'&&s.magic?.ageless&&s.stats.insight>=20&&s.xp>=40&&d?.id==='magic'&&d.practice>=10)return {title:'大魔法使',path:'magician',text:'你把多年试过的术式编成一册，逐一演算到天明。来求教的人渐多，屋里的灯火有了大魔法使的气象。'};
  if(['hermit','shikaisen'].includes(s.species)&&s.hermit?.raids.some(r=>['repelled','escaped'].includes(r.result))&&s.stats.insight>=18&&s.xp>=40)return {title:'仙道大成',path:s.species,text:'追索留下的旧痕渐渐淡去。你将应敌与养气的法门融会贯通，开庵授徒，也为下一次来袭备好了术式。'};
  if(['youkai','vampire'].includes(s.species)&&s.transformation&&s.age-s.transformation.age>=30&&s.stats.health>=20&&s.stats.insight>=16&&s.xp>=40)return {title:s.species==='vampire'?'长夜宗师':'妖术宗师',path:s.species,text:s.species==='vampire'?'你在长夜里反复练习力量的收放，终于能护住灯芯而不折断花枝。旧日难驯的本能，如今听从你的心意。':'积年试过的妖术终于接成一体。你收住四散的气息，将最难的一式演给求教者看，山风吹过仍不乱分毫。'};
  if(d?.stage===3&&d.projects>=3&&d.apprentices>=1&&s.xp>=25){const titles={scholar:'一代名师',garden:'药圃名家',trade:'商行耆宿',craft:'工艺宗师',medicine:'杏林名家',magic:'术学宗师'};return {title:titles[d.id],path:d.id,text:'你将一生反复做成的本事交给后学。对方独自办妥了一桩难事，带着成果来见你，这门营生从此有了接续。'};}
  return null;
 }
 legend('blank-book','暮色里，旧书摊多了一册无字书。你付下书钱，翻页时，纸上竟映出自己多年未解的疑问。',{fortune:-1},{label:'无字之书',min:{insight:8,fortune:2},set:[flag('book')],xp:1});
 legend('read-book','你用做过的事一页页校对无字书，字迹终于浮现。许多零散经验接在一起，往后的研习有了可反复验证的门径。',{insight:3},{label:'书中见道',requires:[flag('book')],min:{insight:10},when:s=>s.xp>=8&&since(s,'blank-book'),set:[flag('insight')],xp:4});
 legend('pinnacle',s=>s.legendaryMastery.text,{insight:2,bond:2},{label:'积年大成',requires:[flag('insight')],when:s=>!!mastery(s),apply:s=>{s.legendaryMastery={...mastery(s),age:s.age,eventId:'legendary:pinnacle'};},xp:3});
 legend('star-token',s=>s.talents.includes('boundary')?'梦醒时，一枚星纹路签压在枕边。窗外的山路仍旧，你记下梦里教过的归返次序。':'夜里有流星划过，你在旧物匣中发现一枚泛光的路签。背面的细字记着通往外界又折返的时刻。',{insight:1},{label:'星纹路签',min:{insight:10},when:s=>s.xp>=5,set:[flag('star-token')]});
 legend('outside-map','你核过路签上的星位，把开门与归返的时刻抄在同一张纸上，又在家中留下了行期。',{fortune:-1},{label:'外界行期',requires:[flag('star-token')],min:{insight:12,fortune:2},when:s=>s.xp>=10&&since(s,'star-token'),set:[flag('outside-ready')],xp:2});
 legend('outside-return',s=>s.outsideJourney.partnerName?`你与${s.outsideJourney.partnerName}循路签来到外界，沿亮着电灯的街道散步，在旧书店各挑了一张书签。入夜前，两人按约回到幻想乡，星纹路签在门后化作微光。`:'你循路签来到外界，看街车穿过灯火，在旧书店挑了一张书签。入夜前，你按约回到幻想乡，星纹路签在门后化作微光。',{health:-1,insight:2,bond:1},{label:'外界一日',requires:[flag('star-token'),flag('outside-ready')],min:{health:8,fortune:2},when:s=>since(s,'outside-map'),clear:[flag('star-token')],set:[flag('outside-visited')],apply:s=>{const id=traveller(s);s.outsideJourney={age:s.age,partnerId:id,partnerName:id?s.people[id].name:null,returned:true};if(id)s.people[id].close++;},xp:3,scene:'外界街巷 · 当日归返'});
 legend('hifuu-meeting','外界带回的书签夹在星图里，你睡着后，走进另一时代的城市。莲子仰头校对星位，梅莉望见你身旁的梦隙，邀你一起核对归路；天亮时，你又醒在家中。',{insight:2,bond:1},{label:'秘封夜谈',requires:[flag('outside-visited')],min:{insight:14},when:s=>s.xp>=14&&since(s,'outside-return')&&['renko','maribel'].every(id=>!s.relations[id]||s.relations[id].medium==='dream'),with:['renko','maribel'],set:[flag('hifuu-met'),'contact:hifuu-dream'],apply:s=>{for(const id of ['renko','maribel'])s.people[id].medium='dream';},xp:3,scene:'未来外界 · 相续之梦',contactMedium:'dream'});
 legend('hifuu-stars','又一个梦夜，莲子摊开两份星图，梅莉指出图边细小的错位。你们在咖啡凉透前认出各自的归路，约好把今夜的发现写在页角。',{insight:1,bond:2},{label:'星图重逢',requires:[flag('hifuu-met')],when:s=>since(s,'hifuu-meeting',2),with:['renko','maribel'],xp:2,scene:'未来外界 · 秘封夜谈',contactMedium:'dream'});
 legend('soul-ember','纸灯将灭时，指间的余火落成一枚红色符印。你把它包入净纸，印面留着一条似水流动的细纹。',{insight:1},{label:'归魂余印',requires:['talent:phoenix'],min:{insight:8},when:s=>s.xp>=6,set:[flag('raw-seal')]});
 legend('soul-seal','你循红印的水纹找到三途河递送队，随队往返岸边。守路人教你封住印中的余火：若有人亲笔许下归愿，它能替生者护住一程魂路。',{fortune:-2},{label:'护魂之契',requires:[flag('raw-seal')],min:{health:10,insight:10,fortune:2},when:s=>s.xp>=12&&since(s,'soul-ember'),clear:[flag('raw-seal')],set:[flag('soul-seal'),'contact:sanzu'],xp:3,scene:'三途河 · 岸边递送'});
 legend('festival-lamps','祭日忽起急雨，你护住沿街的纸灯，带人把供物移入檐下。雨停时，四季的花影一齐映在灯纸上。',{health:-1,bond:2},{label:'四时灯影',weight:2,requires:['talent:blessing'],min:{bond:8},when:s=>s.xp>=5,set:[flag('festival')],xp:2});
 legend('festival-faith','你将灯纸修好，和街坊约定轮流照看小祠。有人谈起受祭的旧人，你把自己的姓名写进值守簿，答应年年来赴约。',{bond:2,insight:1},{label:'四时之约',weight:2,requires:[flag('festival')],min:{bond:10,insight:8},when:s=>since(s,'festival-lamps'),set:[flag('faith')],xp:2});
 legend('faith-offering','先前守灯的街坊带着新供物来访。你们念过旧愿，重整祭日的轮值，冷清的小祠又有人认真照料。',{bond:1},{label:'旧愿成祀',requires:[flag('faith')],when:s=>s.development?.kind==='kami'&&s.development.ready,apply:s=>{s.development.faith+=2;s.development.devotees+=1;},xp:1});
 legend('storm-refuge','暴雨冲塌山边的小桥，你循梦里记过的岔路，带几位行人绕回有灯的人家。大家在屋檐下分干布，天明再一起修好路牌。',{health:-1,bond:3},{label:'风雨归人',requires:['talent:boundary'],min:{health:10,insight:12},when:s=>s.xp>=12,xp:3});
 function select(state,rng){
  const E=globalThis.TouhouEngine,extra=legendary.filter(e=>E.eligible(state,e)),pool=[...extra,...list.filter(e=>E.eligible(state,e))];
  if(!pool.length||rng()>=(extra.length?.24:.14))return null;
  let ticket=rng()*pool.reduce((sum,e)=>sum+E.weight(state,e),0);
  for(const e of pool){ticket-=E.weight(state,e);if(ticket<0)return e;}
  return pool.at(-1);
 }
 globalThis.TouhouTalentStories={list,legendary,mastery,traveller,select};
})();
