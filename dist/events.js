/* Shared life events. Small stateful family/work rules stay in JavaScript. */
(() => {
 const humanoid=['humanoid'];
 const events=[];
 function event(id,text,effects={},rules={}){events.push({id:'common:'+id,text,effects,weight:2,repeat:2,...rules});}
 const animal=s=>globalThis.TouhouEngine.isAnimal(s);
 const adult=s=>!animal(s)&&s.phase>=2&&(s.life!=='human'||s.age>=18);
 const working=s=>adult(s)&&!s.retired&&!s.injured&&!s.afterlife&&!s.dormant&&s.body!=='spirit'&&s.life!=='spirit'&&!!s.career;
 const careerPractice=(s,n=1)=>{const d=s.careerDevelopment;if(d?.id===s.career&&!d.suspended){d.practice+=n;d.stagePractice+=n;d.lastWorkedAt=s.age;}};
 const humanChild=s=>s.life==='human'&&s.body==='humanoid'&&s.age>=6&&s.age<18;
 const family=s=>s.hasFamily&&s.parentsAlive;
 const ordinary=s=>!s.character;
 const ordinaryHuman=s=>ordinary(s)&&s.species==='human';
 const friend=(s,id)=>s.people[id]?.alive;
 const contact=(s,rng,id)=>{globalThis.TouhouEngine.meet(s,id,rng);s.people[id].close++;};
 const jobs={trade:'行商',craft:'手艺人',garden:'农人',medicine:'药师',scholar:'抄书人',shrine:'神社差事',magic:'魔法修习',music:'乐师',guard:'守卫',travel:'行旅',lead:'主事',animal:'寻食'};
 // Early life varies immediately with the allocated attributes.
 event('child-run','你与同伴跑过坡道，回家时鞋底沾满泥。',{health:1,bond:1},{when:humanChild,weight:5,min:{health:6},bias:{health:1}});
 event('child-sit','你坐在檐下听故事，记住了远方的地名。',{insight:1},{when:humanChild,weight:5,max:{health:5}});
 event('child-read','你读懂了借来的书，试着讲给邻伴听。',{insight:1},{when:humanChild,weight:5,min:{insight:6},xp:1});
 event('child-copy','你逐字临摹旧纸上的字，墨迹沾满手指。',{insight:1},{when:humanChild,weight:5,max:{insight:5}});
 event('child-lunch','邻伴分来一份午饭，你们约好一起回家。',{bond:1},{when:humanChild,weight:5,min:{bond:6},apply:(s,r)=>contact(s,r,'local:childhood')});
 event('child-alone','你独自在庭边拾石，排成只有自己懂的图案。',{}, {when:humanChild,weight:5,max:{bond:5}});
 event('child-tools','你从旧柜里翻出工具，学着修补一个小盒。',{insight:1},{when:s=>humanChild(s)&&s.tools,xp:1});
 event('child-errand','你替邻家跑一趟腿，换来一点零用。',{fortune:1},{when:humanChild,weight:5,max:{fortune:5}});
 event('child-lamp','灯油充足，你在夜里把一页书读完。',{insight:1,fortune:-1},{when:humanChild,weight:5,min:{fortune:6},xp:1});
 event('family-meal','家人围坐吃饭，说起今天遇见的小事。',{bond:1},{when:family,bodies:humanoid,repeat:3});
 event('family-mend','长辈教你缝补衣物，针脚起初歪歪扭扭。',{insight:1},{when:s=>family(s)&&s.age>=6&&s.age<20,bodies:humanoid});
 event('family-sick','长辈病了一场，你留下照料了几日。',{fortune:-1,bond:1},{when:s=>family(s)&&s.age>=18,bodies:humanoid});
 event('family-gift','你带回一件小礼物，长辈笑着收进柜里。',{fortune:-1,bond:1},{when:s=>family(s)&&s.age>=18,min:{fortune:4},bodies:humanoid});
 event('school','你跟着老师读书，慢慢养成温习的习惯。',{insight:1},{when:s=>humanChild(s)&&!s.educated,apply:s=>s.educated=true,xp:1,repeat:1});
 event('child-dream','你梦见一条走不到尽头的路，醒后还记得。',{}, {phases:[0,1],bodies:['humanoid','spirit'],repeat:2});
 // Living habits work for a species without inventing human parents or a job.
 const daily=[
 ['rain','雨落了一整天，你在住处听水声渐缓。',{},{}],
 ['morning','你在清晨醒来，慢慢熟悉周围的声响。',{},{}],
 ['wind','风掠过旧路，带来久未闻过的气味。',{},{}],
 ['sun','你找了一处向阳的角落，安静歇息。',{health:1},{bias:{health:-1}}],
 ['moon','夜色清明，你望了许久的月亮。',{},{}],
 ['snow',s=>s.life==='human'&&s.age<16?'寒意渐深，住处添了厚被，你睡得暖和。':'寒意渐深，你提前收拾好了过冬的地方。',{health:1},{min:{fortune:5}}],
 ['lean','日子有些拮据，你减少了不必要的消耗。',{fortune:1},{max:{fortune:4}}],
 ['sleep','昨夜睡得安稳，醒来时精神好了许多。',{health:1},{bias:{health:-1}}],
 ['detour','熟路被落物挡住，你绕了一段才回去。',{},{}],
 ['quiet','周围难得安静，你把拖延的小事做完。',{insight:1},{}],
 ['storm',s=>s.life==='human'&&s.age<16?'大风损坏了住处，你跟着大人帮忙收拾。':'一场大风损坏了住处，你花时间修整。',{fortune:-1},{phases:[1,4]}],
 ['season','季节又变了，旧日习惯也跟着慢慢改变。',{},{}],
 ['mist','晨雾散开，你认出了从前走过的路。',{},{}],
 ['rest','你留在熟悉的地方，缓过连日的疲倦。',{health:1},{max:{health:7}}],
 ['lost-way','你走错了岔路，到傍晚才回到原处。',{health:-1},{bias:{insight:-1}}],
 ['find-place','你发现一处僻静角落，留作往后歇脚。',{}, {set:['retreat']}],
 ['return-place','你重访那处歇脚地，四周仍旧安静。',{health:1},{requires:['retreat']}],
 ['old-path','你放慢脚步，沿着熟悉的路线走了一回。',{}, {phases:[3,4]}],
 ['memory','想起从前的一件小事，你独自笑了片刻。',{bond:1},{phases:[3,4]}],
 ['late-rain','雨声与记忆中相似，你没有急着出门。',{}, {phases:[4,4]}],
 ['late-sun','你在晴日晒了会儿太阳，等影子慢慢移开。',{health:1},{phases:[4,4]}],
 ['late-room','你整理久居的地方，为常用物留出空处。',{}, {phases:[4,4],bodies:['humanoid','spirit','machine']}],
 ['late-route','熟悉的路已经变了，你记下新的转弯处。',{insight:1},{phases:[4,4]}],
 ['late-give','你把用不上的旧物送给后来者。',{bond:1},{phases:[4,4],bodies:['humanoid','spirit','machine']}],
 ['late-watch','来往的面孔渐渐更替，你仍认得这里的四季。',{}, {phases:[4,4]}]
 ];
 for(const [id,text,fx,rules]of daily)event(id,text,fx,{repeat:4,...rules});
 // Body-specific daily pools remain available at every age.
 for(const [id,text,fx,rules]of [
 ['tea','你热了一壶茶，听门外的脚步渐渐远去。',{health:1},{}],
 ['meal','一餐吃得简单，倒也合口味。',{},{}],
 ['clothes','你补好磨破的衣角，又能穿一阵。',{fortune:1},{min:{insight:5}}],
 ['market','你在人来人往的集市停了片刻。',{}, {realms:['gensokyo','outside','pc98','past']}],
 ['book','旧书里的一行批注，让你想通了小疑问。',{insight:1},{min:{insight:6},xp:1}],
 ['chore','你收拾住处，找回早先遗落的小物件。',{fortune:1},{}],
 ['cook','你试着换了做饭的法子，味道还不错。',{health:1},{}],
 ['overspend','一时兴起买了闲物，回去才觉花得太多。',{fortune:-1},{bias:{fortune:-1}}],
 ['cold','换季时染了风寒，你卧床歇了几日。',{health:-1},{lives:['human'],bias:{health:-1}}],
 ['tired','你忙得忘了歇息，入夜才发觉浑身疲乏。',{health:-1},{phases:[2,3]}]
 ])event(id,text,fx,{bodies:humanoid,minAge:id==='cold'?0:id==='cook'?12:id==='book'?8:6,repeat:3,...rules});
 for(const [id,text,fx]of [
 ['beast-groom','你缓缓舒展身体，在安静的角落歇息。',{health:1}],
 ['beast-food','你寻到少见的食物，留下一点带回栖处。',{fortune:1}],
 ['beast-track','你循着气味走了一阵，认全一条新路。',{insight:1}],
 ['beast-hide','陌生动静传来，你躲进熟悉的隐蔽处。',{}],
 ['beast-leap','你穿过一道狭窄空隙，回到熟悉的地方。',{health:1}],
 ['beast-hungry','雨水盖住气味，你只好空着肚子返回。',{health:-1}],
 ['beast-nest','你选了遮蔽更好的地方，歇息时安稳不少。',{fortune:1}],
 ['beast-call','远处传来同伴的声音，你停下来回应。',{bond:1}]
 ])event(id,text,fx,{bodies:['beast'],repeat:5});
 for(const [id,text,fx]of [
 ['machine-clean','你清去机件间的积灰，活动又顺畅起来。',{health:1}],
 ['machine-noise','转动声有些不同，你检查了磨损之处。',{insight:1}],
 ['machine-fix','你更换旧部件，重新试过日常动作。',{health:1,fortune:-1}],
 ['machine-record','你整理过往记录，改好了一处重复。',{insight:1}],
 ['machine-work','你按熟悉的步骤，完成今天的巡查。',{fortune:1}],
 ['machine-fail','一处细小故障拖慢动作，你暂时停工。',{health:-1}],
 ['machine-charge','你留在工房积蓄能量，等下一次出行。',{health:1}],
 ['machine-watch','你观察来往的身影，学到一个新动作。',{bond:1}]
 ])event(id,text,fx,{bodies:['machine'],repeat:5});
 for(const [id,text,fx]of [
 ['spirit-gather','你在安静处凝住形体，听远处的声响。',{health:1}],
 ['spirit-light','灯影穿过衣袖，你想起往昔的一幕。',{insight:1}],
 ['spirit-drift','你随风走过旧地，在熟悉的角落停下。',{}],
 ['spirit-voice','别人的低语从身旁掠过，你没有惊动对方。',{bond:1}],
 ['spirit-clear','旧日执念淡了一点，你感到片刻轻松。',{health:1}],
 ['spirit-night','夜深后四周静下来，你慢慢收拢散乱思绪。',{insight:1}],
 ['spirit-fade','形体忽然变淡，你留在原处休养。',{health:-1}],
 ['spirit-home','你重新认出归处，沿着微光慢慢返回。',{fortune:1}]
 ])event(id,text,fx,{bodies:['spirit'],repeat:5});
 // Career, training and a few guarded two/three-step chains.
 event('choose-work','你挑了一门能糊口的营生，开始跟着做事。',{fortune:1},{when:s=>ordinary(s)&&s.body==='humanoid'&&!s.afterlife&&!s.dormant&&s.age>=16&&!s.career,repeat:1,apply:s=>{s.career=s.stats.insight>=7?'scholar':s.stats.health>=7?'garden':s.stats.bond>=7?'trade':'craft';s.xp++;globalThis.TouhouCareers.init(s);}});
 event('work','你照常做完手边的活计，收下一份报酬。',{fortune:1},{when:s=>working(s)&&!!s.career,repeat:6,xp:1,apply:s=>careerPractice(s)});
 event('work-skill','一件难活顺利完成，你摸到更熟练的做法。',{insight:1,fortune:1},{when:working,min:{insight:7},repeat:3,xp:2,bias:{insight:1},apply:s=>careerPractice(s,2)});
 event('work-hard','繁重的活计耗去体力，也带来一点积蓄。',{health:-1,fortune:2},{when:working,min:{health:6},repeat:3,xp:1,apply:s=>careerPractice(s)});
 event('work-fail','忙中出了差错，你花掉一笔钱重新做过。',{fortune:-2,insight:1},{when:working,max:{insight:7},repeat:3,xp:1,apply:s=>careerPractice(s)});
 event('work-contact','熟人托来一桩差事，你们渐渐来往频繁。',{fortune:1,bond:1},{when:s=>working(s)&&(!s.people['local:friend']||friend(s,'local:friend')),min:{bond:7},repeat:2,apply:(s,r)=>{contact(s,r,'local:friend');careerPractice(s);}});
 event('learn','你留出一段时间，把常用的本领练了一遍。',{insight:1},{when:adult,repeat:4,xp:1,bias:{insight:1}});
 event('practice','反复练习有些枯燥，你还是坚持做完。',{}, {when:adult,repeat:4,xp:2});
 event('teach','你把熟悉的本领教给后辈，也修正了旧习。',{bond:1},{when:s=>adult(s)&&(!s.people['local:student']||friend(s,'local:student')),min:{insight:10},phases:[3,4],repeat:3,xp:1,apply:(s,r)=>contact(s,r,'local:student')});
 event('tools-buy','你添置了合用的工具，收好待下回使用。',{fortune:-2},{when:s=>adult(s)&&!s.tools,min:{fortune:4},repeat:2,apply:s=>s.tools=true});
 event('tools-use','你取出收好的工具，修妥了积压的活计。',{fortune:2},{when:s=>working(s)&&s.tools,repeat:3,xp:1,apply:s=>careerPractice(s)});
 event('tools-lost','常用的工具遗失了，你只得另想办法。',{fortune:-1},{when:s=>adult(s)&&s.tools,repeat:1,apply:s=>s.tools=false});
 event('herbs-pick','你采好辨认过的药草，晾干后留在住处。',{}, {when:s=>adult(s)&&!s.remedy&&s.body!=='machine',realms:['gensokyo','pc98','makai','past'],min:{insight:5},repeat:2,apply:s=>s.remedy=true});
 event('injury',s=>s.body==='machine'?'你在湿滑路面失去平衡，机件受损，暂时停工。':'你在湿滑路面摔了一跤，只好先回去养伤。',{health:-2},{when:s=>adult(s)&&!s.injured&&s.life!=='spirit',repeat:2,bias:{health:-1},apply:s=>s.injured=true});
 event('house','积蓄终于够用，你安顿下一处长住之所。',{fortune:-4},{when:s=>adult(s)&&!s.home,min:{fortune:10},repeat:1,apply:s=>s.home=true});
 event('house-repair','住处漏了雨，你花了一笔钱修补。',{fortune:-2},{when:s=>s.home,repeat:2});
 event('savings','你把余下用度仔细留存，积蓄渐渐多了。',{fortune:2},{when:adult,min:{insight:6},repeat:3,bias:{fortune:1}});
 event('debt','手头周转不开，你向熟人借了一笔钱。',{fortune:2},{when:adult,max:{fortune:3},excludes:['debt'],set:['debt'],repeat:1});
 event('repay','你攒够了钱，亲手还清先前借下的债。',{fortune:-2,bond:1},{when:adult,min:{fortune:7},requires:['debt'],clear:['debt'],repeat:1});
 event('migrate','你搬到村落另一条街，重新熟悉邻里。',{fortune:-1,bond:1},{when:s=>ordinaryHuman(s)&&s.age>=20&&s.age<60&&!s.home,repeat:1,apply:s=>{s.location='人类村落东街';s.habitat='village';}});
 // Relationships are persistent people, not a boolean that can resurrect.
 event('meet-neighbor','你与邻居渐渐熟络，有时会互相捎点东西。',{bond:1},{when:s=>!s.people['local:neighbor']&&(s.life!=='human'||s.age>=6),min:{bond:4},repeat:1,apply:(s,r)=>contact(s,r,'local:neighbor')});
 event('meet-friend','一次偶遇之后，你多了一位时常往来的同道。',{bond:1},{when:s=>adult(s)&&!s.people['local:friend'],bias:{bond:1},repeat:1,apply:(s,r)=>contact(s,r,'local:friend')});
 event('friend-chat','你与熟悉的同道聊了半日，听见几桩新鲜事。',{bond:1},{when:s=>friend(s,'local:friend'),repeat:4,apply:(s,r)=>contact(s,r,'local:friend')});
 event('neighbor-help','邻居遇上麻烦，你腾出时间帮了个忙。',{bond:1,fortune:-1},{when:s=>friend(s,'local:neighbor')&&(s.life!=='human'||s.age>=8),repeat:3,apply:(s,r)=>contact(s,r,'local:neighbor')});
 event('childhood-meet','幼时相识又来探望，谈起彼此近来的生活。',{bond:1},{when:s=>friend(s,'local:childhood')&&s.phase>=2,repeat:3,apply:(s,r)=>contact(s,r,'local:childhood')});
 event('old-letter','你重读故人留下的旧信，想起当年的约定。',{bond:1},{when:s=>Object.values(s.people).some(p=>!p.alive&&p.medium!=='dream'),repeat:2,phases:[3,4]});
 const localFree=s=>ordinaryHuman(s)&&s.realm==='gensokyo'&&s.body==='humanoid'&&!s.afterlife&&!s.dormant&&globalThis.TouhouRelationships.freePartner(s);
 const localEvent=(id,text,effects,rules)=>event(id,text,effects,{localRomance:true,repeat:1,...rules});
 const afterLocal=(s,id)=>{const prior=s.log.find(e=>e.id==='common:'+id);return !!prior&&s.age>prior.age;};
 localEvent('local-young-meet','你在寺子屋帮忙整理书册，认识了一位同岁的村民。你们各挑一本喜欢的书，约好读完再交换。',{bond:1},{when:s=>localFree(s)&&s.age>=13&&s.age<=14&&!s.people['local:spouse'],apply:(s,r)=>{contact(s,r,'local:spouse');s.people['local:spouse'].ageAtMeet=s.age;}});
 localEvent('local-young-familiar','归还书册时，你们聊起各自读到的故事。散学后又一道走到路口，说定下次赶集还在这里等。',{bond:1},{when:s=>localFree(s)&&friend(s,'local:spouse')&&afterLocal(s,'local-young-meet')&&s.age<=17,apply:(s,r)=>contact(s,r,'local:spouse')});
 localEvent('local-young-confession','赶集回来，你忍不住向同岁的旧友说出喜欢。对方先愣住，随即笑着攥住你的手，说等这句话好久了。你们约好下回一起去看河边的花。',{bond:1},{when:s=>localFree(s)&&s.age>=16&&s.age<=17&&friend(s,'local:spouse')&&afterLocal(s,'local-young-familiar')&&s.age-s.people['local:spouse'].metAt>=2,min:{bond:6},apply:(s,r)=>{globalThis.TouhouRelationships.bindPartner(s,'local:spouse');s.courtshipAt=s.age;contact(s,r,'local:spouse');s.people['local:spouse'].name='相恋的村民';}});
 localEvent('local-meet','你在街坊的帮工席上认识一位村民，收工后一起走了一段归路。',{bond:1},{when:s=>localFree(s)&&s.age>=18&&s.age<=38&&!s.people['local:spouse'],apply:(s,r)=>contact(s,r,'local:spouse')});
 localEvent('local-familiar','集市上又碰见那位村民，你们替彼此留好摊位，闲时聊起各自的营生。',{bond:1},{when:s=>localFree(s)&&friend(s,'local:spouse')&&(afterLocal(s,'local-meet')||afterLocal(s,'local-young-meet')&&s.age>=18),apply:(s,r)=>contact(s,r,'local:spouse')});
 localEvent('courtship','来往渐多，你与这位村民互明心意，约好此后常常相见。',{bond:1},{when:s=>localFree(s)&&s.age>=20&&s.age<=45&&friend(s,'local:spouse')&&afterLocal(s,'local-familiar'),min:{bond:6},apply:(s,r)=>{globalThis.TouhouRelationships.bindPartner(s,'local:spouse');s.courtshipAt=s.age;contact(s,r,'local:spouse');s.people['local:spouse'].name='相恋的村民';}});
 const localLovers=s=>s.partnerId==='local:spouse'&&friend(s,'local:spouse')&&!s.married&&!s.afterlife&&!s.dormant;
 localEvent('local-date-young','沿河看花时，你们的手背碰了几回。恋人忽然握住你的手，你也攥紧，嘴上仍在说那丛花；两人笑着走远，谁也没记住花的名字。',{bond:1},{when:s=>localLovers(s)&&s.age>=16&&s.age<18&&s.age>s.courtshipAt});
 localEvent('local-date-talk','收工后，恋人挨着你坐在檐下，讲到趣事便笑着往你肩上靠。你低头亲了亲那张笑脸，对方转过来回亲一下，又揽住你的腰继续讲。',{bond:1},{when:s=>localLovers(s)&&s.age>=18&&s.age>=s.courtshipAt+1});
 localEvent('local-date-walk','夜市散去，你们在路口停下。你靠近吻住恋人，对方揽紧你的肩，接连吻回来。道别的话到了嘴边，两人却又笑着贴近。',{bond:1},{when:s=>localLovers(s)&&s.age>=18&&afterLocal(s,'local-date-talk')});
 const weddingReady=s=>localLovers(s)&&s.unwedAt===null&&s.age>=22&&afterLocal(s,'local-date-walk');
 localEvent('marry','相处多年，你们商量好日常的安排，请熟悉的街坊来吃一桌喜饭。',{bond:2,fortune:-1},{when:weddingReady,min:{bond:7},apply:(s,r)=>{s.married=true;contact(s,r,'local:spouse');s.people['local:spouse'].name='伴侣';}});
 localEvent('unwed-promise','晚饭后，你们聊起往后的安排，商量好继续以恋人身份相伴。对方说喜欢这样的日子，你也点头，约好下回休息时一起出门。',{bond:1},{when:weddingReady,min:{bond:7},apply:(s,r)=>{s.unwedAt=s.age;contact(s,r,'local:spouse');}});
 // Local visits share the social calendar; the large general-event pool must not hide an existing courtship.
 function localRomance(s,rng,invited=false){
  const e=events.find(e=>e.localRomance&&e.id!=='common:unwed-promise'&&globalThis.TouhouEngine.eligible(s,e));
  if(!e)return null;
  const chance=e.id==='common:local-young-meet'?globalThis.TouhouLifeConfig.youngMeetingChance:e.id==='common:local-meet'&&!invited?globalThis.TouhouLifeConfig.localMeetingChance:globalThis.TouhouLifeConfig.localProgressChance;
  if(rng()>=chance)return null;
  return e.id==='common:marry'&&rng()<globalThis.TouhouLifeConfig.unwedCompanionshipChance?events.find(e=>e.id==='common:unwed-promise'):e;
 }
 event('spouse-talk',s=>s.married?'你与伴侣商量日常开支，留出明年的用度。':'你与相恋的村民聊起集市价钱，各自留出一些日常用度。',{fortune:1,bond:1},{when:s=>s.partnerId==='local:spouse'&&friend(s,'local:spouse'),repeat:3,apply:(s,r)=>contact(s,r,'local:spouse')});
 const localPartner=s=>s.age>=20&&s.partnerId==='local:spouse'&&friend(s,'local:spouse');
 event('spouse-walk','夜里收了活，伴侣挽着你的胳膊出门。你顺势握住对方的手，两人绕住处慢慢走了一圈，回来时还在说笑。',{bond:1},{when:localPartner,apply:(s,r)=>contact(s,r,'local:spouse')});
 event('spouse-sleeve','对方替你缝好松开的袖口，末了握住你的手，贴在脸旁暖了一会儿。',{bond:1},{when:localPartner,apply:(s,r)=>contact(s,r,'local:spouse')});
 event('spouse-gift','你带回对方念叨过的小礼物。伴侣惊喜地扑入你怀中，你站稳了回抱住；对方抬起头笑着亲你一下，才忙着细看礼物。',{bond:1,fortune:-1},{when:localPartner,min:{fortune:2},apply:(s,r)=>contact(s,r,'local:spouse')});
 event('spouse-lean','忙完一天，你靠着对方坐在灯下。伴侣挪了挪肩，让你靠得舒服些，两人分着一杯热茶，听雨落过屋檐。',{health:1},{when:s=>localPartner(s)&&s.home,apply:(s,r)=>contact(s,r,'local:spouse')});
 event('spouse-care','你疲乏得早早躺下，对方端来温水，替你掖好被角才坐到床边。',{health:1,bond:1},{when:localPartner,max:{health:7},apply:(s,r)=>contact(s,r,'local:spouse')});
 event('spouse-cooking','你们一起做了一顿饭，对方尝过味道，笑着把最好的一口留给你。',{bond:1},{when:s=>localPartner(s)&&s.home,apply:(s,r)=>contact(s,r,'local:spouse')});
 // Talent chains also use the common selector and persistent prerequisites.
 event('talent-scroll','你翻读无名手札，摸清一种陌生的本领。',{insight:1},{requires:['talent:scroll'],bodies:['humanoid','spirit','machine'],phases:[1,4],xp:2,repeat:2,set:['scroll-read']});
 event('talent-scroll-use','手札里的办法派上用场，你顺利解开难题。',{fortune:1},{requires:['scroll-read'],phases:[2,4],xp:2,repeat:2});
 event('talent-forest','林间岔路没有难住你，你找到隐蔽的储粮处。',{fortune:1,health:1},{requires:['talent:forest'],realms:['gensokyo','outside','pc98','makai','past'],repeat:3});
 event('talent-wander','你走出熟悉的地方，在陌路听见一段新故事。',{insight:1,bond:1},{requires:['talent:wander'],phases:[2,4],repeat:3});
 event('talent-star','你认出夜空中熟悉的星位，辨明前行方向。',{insight:1},{requires:['talent:stargaze'],repeat:3,xp:1});
 event('talent-spirit','一缕微弱灵气引你停步，身边藏着旧日痕迹。',{insight:1,bond:1},{requires:['talent:spirit-eye'],repeat:3,xp:1});
 event('talent-boundary','梦里一线边界轻轻移开，你看见陌生的远方。',{insight:2},{requires:['talent:boundary'],repeat:3,xp:2});
 for(const e of events){if(['common:detour','common:quiet','common:storm','common:lost-way','common:find-place','common:return-place'].includes(e.id)){const prior=e.when;e.when=s=>(s.life!=='human'||s.age>=6)&&(!prior||prior(s));}}
 const beastWords={
   'common:meet-neighbor':'你与邻近的同伴渐渐熟悉，偶尔一同歇息。',
   'common:meet-friend':'一次偶遇之后，你多了一位时常同行的伙伴。',
   'common:friend-chat':'你与熟悉的同伴并肩歇息，听远处的动静。',
   'common:neighbor-help':'邻近的同伴觅食不顺，你让出一处食源。',
   'common:childhood-meet':'幼时的玩伴寻到这里，你们嗅认久违的气味。',
   'common:old-letter':'熟悉的气味渐渐淡去，你仍记得从前的玩伴。',
   'common:quiet':'四周安静下来，你在熟悉的角落待了一阵。',
   'common:talent-wander':'你遇见陌生同伴，记住新的路与气味。',
   'common:storm':'大风破坏了原先的遮蔽，你另找一处安稳歇下。',
   'common:memory':'一阵熟悉的气味飘来，你记起曾经同行的身影。',
   'common:house-repair':'栖处被水浸湿，原先积下的一点食物损失了。',
   'common:snow':'冷意逐渐加深，你待在更暖、更安静的地方。',
   'common:old-path':'你沿着熟悉的路线活动了一阵，又回到安静处。'
 };
 for(const e of events)if(beastWords[e.id]){const original=e.text;e.text=s=>animal(s)?beastWords[e.id]:typeof original==='function'?original(s):original;}
 event('beast-injury','你躲避陌生的追逐时擦伤了身体，蜷回熟悉的窝。',{health:-2},{bodies:['beast'],phases:[1,4],repeat:2,bias:{health:-1},apply:s=>s.injured=true});
 event('beast-cache','你找到一处隐蔽食源，仔细记住周围的气味。',{}, {bodies:['beast'],excludes:['food-cache'],set:['food-cache'],repeat:2});
 event('beast-cache-use','食物短缺时，你重访记熟的食源，寻到新鲜的一份。',{health:1,fortune:1},{bodies:['beast'],requires:['food-cache'],clear:['food-cache'],repeat:2});
 const confinedSafe=new Set(['rain','morning','wind','sun','moon','sleep','quiet','season','mist','rest','memory','late-rain','late-sun','late-room','late-watch','beast-groom','spirit-gather','spirit-light','spirit-clear','spirit-night','spirit-fade','old-letter','talent-star','talent-spirit','talent-boundary']);
 for(const e of events)e.needsFreedom=!confinedSafe.has(e.id.slice(7));
 for(const [id,text,fx]of [
  ['drop','一滴水悬了许久，你等它终于落进浅盆。',{}],
  ['light','微光慢慢移过石面，你辨出又一段时日。',{insight:1}],
  ['breath','你留心自己的呼吸，让杂乱念头渐渐沉下。',{health:1}],
  ['door','门外响过几声脚步，随后又归于安静。',{}],
  ['water','送来的清水微微晃动，你等水面重新平静。',{health:1}],
  ['shadow','一道窗影遮住旧痕，你挪到看得清的地方。',{}],
  ['stretch','你慢慢舒展开身体，缓过久伏的僵硬。',{health:1}],
  ['listen','远处声音忽然停了，你听见身边更细的响动。',{insight:1}],
  ['old-voice','想起往昔的一段声音，你静静听了很久。',{bond:1}],
  ['cool','石面有些凉，你换了一处适合歇息的角落。',{}],
  ['wait','你等过一阵漫长的寂静，终于听见门外回应。',{bond:1}],
  ['dust','微光里浮起细小的光点，你跟着看了一会儿。',{}],
  ['mark','你认出墙边一处旧痕，想起曾经留心过它。',{insight:1}],
  ['night','周围的声响逐渐稀落，你安静地睡了一阵。',{health:1}]
 ])event('confined-'+id,text,fx,{when:s=>s.character?.confined===true,repeat:8,needsFreedom:false});
 const confinedWords={
  'common:rain':'远处传来断续的滴水声，你听它慢慢停下。',
  'common:wind':'门边掠过细小动静，你留心听了片刻。',
  'common:mist':'窗光渐渐清晰，你重新看清身边的旧物。',
  'common:late-rain':'熟悉的滴水声又响起来，你在原处听了一阵。',
  'common:late-watch':'门外的声音几度更换，你仍认得这处窗影。'
 };
 const moonWords={'common:moon':'远处的微光没有变，你静静看了很久。'};
 for(const e of events)if(confinedWords[e.id]||moonWords[e.id]){const original=e.text;e.text=s=>s.character?.confined&&confinedWords[e.id]?confinedWords[e.id]:s.realm==='moon'&&moonWords[e.id]?moonWords[e.id]:typeof original==='function'?original(s):original;}
 const infantWords={
  'common:wind':'窗边掠过细细的风声，你循着声音望过去。',
  'common:mist':'晨光渐渐亮起来，你认出了身旁熟悉的面孔。',
  'common:season':'天气渐渐转凉，屋里铺上了更厚的被褥。',
  'common:sun':'暖光落在身边，你安静地睡了一阵。',
  'common:rest':'你多睡了一阵，醒来时舒服了许多。'
 };
 for(const e of events)if(infantWords[e.id]){const original=e.text;e.text=s=>s.life==='human'&&s.age<3?infantWords[e.id]:typeof original==='function'?original(s):original;}
 const undergroundResidents=new Set(['kisume','yamame','parsee','yuugi','satori','rin','utsuho']);
 const undergroundWords={
  'common:moon':'暗处亮着几缕微光，你静静望了许久。',
  'common:sun':'你找到一处温暖的角落，安静歇息。',
  'common:rain':'远处水声响了一阵，你听它渐渐平缓。',
  'common:late-rain':'水声与记忆中相似，你留在原处听了一阵。',
  'common:late-sun':'你在暖处歇息，等周围的声响渐渐稀落。',
  'common:snow':'寒气从远处渗来，你收拾好适合歇息的地方。',
  'common:season':'周围的气息又有了变化，你调整了日常习惯。',
  'common:mist':'昏暗处渐渐清晰，你认出了从前走过的路。',
  'common:morning':'你从歇息中醒来，慢慢熟悉周围的声响。'
 };
 for(const e of events)if(undergroundWords[e.id]){const original=e.text;e.text=s=>(s.realm==='hell'||undergroundResidents.has(s.character?.id))?undergroundWords[e.id]:typeof original==='function'?original(s):original;}
 const petMachineWords={
  'common:machine-clean':'积灰被细细擦去，你的转轴又灵活起来。',
  'common:machine-noise':'关节有些生涩，你慢慢试过几次转动。',
  'common:machine-fix':'磨损部件换成了新的，你又能灵活地活动。',
  'common:machine-record':'你认出一串熟悉声响，循声慢慢转过身。',
  'common:machine-work':'你沿熟悉路线走了一圈，回到常待的角落。',
  'common:machine-fail':'机身偶尔卡顿，你停下动作歇了一阵。',
  'common:machine-charge':'你留在检修处休息，等机身重新有了力气。',
  'common:machine-watch':'你观察来往的身影，学着回应熟悉的动作。',
  'common:late-room':'你停在久居的角落，听见熟悉的来往声响。',
  'common:late-give':'新来的身影从身旁经过，你安静地跟了一段。',
  'common:house-repair':'检修处修缮了一回，常用的零件少了一些。'
 };
 for(const e of events)if(petMachineWords[e.id]){const original=e.text;e.text=s=>s.character?.animalMind?petMachineWords[e.id]:typeof original==='function'?original(s):original;}
 const komachiWind=events.find(e=>e.id==='common:wind'),windText=komachiWind.text;
 komachiWind.text=s=>s.character?.id==='komachi'?'三途河上一丝风也没有，水面安静地映着远处。':typeof windText==='function'?windText(s):windText;
 const vampireWords={
  'common:sun':'日光移过窗沿，你在厚帘后安静歇息。',
  'common:late-sun':'外面天气晴好，你留在阴影里听远处的动静。',
  'common:morning':'晨光将近，你回到遮光的住处，慢慢安静下来。',
  'common:mist':'窗外晨雾渐散，你在厚帘缝隙间认出旧路。'
 };
 for(const e of events)if(vampireWords[e.id]){const original=e.text;e.text=s=>s.species==='vampire'||['remilia','flandre'].includes(s.character?.id)?vampireWords[e.id]:typeof original==='function'?original(s):original;}
 const marketEvent=events.find(e=>e.id==='common:market'),marketText=marketEvent.text;
 marketEvent.text=s=>['youkai','magician','vampire'].includes(s.species)?'你遮掩形貌，买齐所需便离开集市。':marketText;
 events.push(...globalThis.TouhouCanonEvents.map(e=>({...e,when:s=>ordinary(s)&&!s.afterlife&&!s.dormant&&s.body==='humanoid'})));
 globalThis.TouhouEvents={events,jobs,localRomance};
})();
