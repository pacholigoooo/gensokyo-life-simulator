/* Original Touhou-themed talents; ten candidates, choose three. */
(() => {
 const grades=[{name:'寻常',weight:70},{name:'难得',weight:23},{name:'稀有',weight:6},{name:'传说',weight:1}];
 const list=[
 {id:'strong',name:'山间健步',grade:0,description:'初始体魄+2。',initial:{health:2},exclude:['frail']},
 {id:'reader',name:'旧书常伴',grade:0,description:'初始悟性+2；寻常出身时更易发现魔法教材。',initial:{insight:2}},
 {id:'friendly',name:'祭日结缘',grade:0,description:'初始缘分+2。',initial:{bond:2},exclude:['quiet']},
 {id:'thrifty',name:'米缸有余',grade:0,description:'初始家底+2。',initial:{fortune:2},exclude:['empty']},
 {id:'frail',name:'病榻听书',grade:0,description:'初始体魄−1、悟性+3。',initial:{health:-1,insight:3},exclude:['strong']},
 {id:'quiet',name:'独坐听雨',grade:0,description:'初始缘分−1、悟性+3。',initial:{bond:-1,insight:3},exclude:['friendly']},
 {id:'empty',name:'两袖清风',grade:0,description:'初始家底−1、体魄+3。',initial:{fortune:-1,health:3},exclude:['thrifty']},
 {id:'tea',name:'粗茶暖身',grade:0,description:'第12、32、52步体魄+1。',triggers:[{at:[12,32,52],text:'一段安稳作息，让你养回一点气力。',effects:{health:1}}]},
 {id:'notes',name:'随手记事',grade:0,description:'第10、30、50步悟性+1。',triggers:[{at:[10,30,50],text:'你翻看过去留下的记号，明白了一件旧事。',effects:{insight:1}}]},
 {id:'gifts',name:'小礼常往',grade:0,description:'第15、35、55步缘分+1。',triggers:[{at:[15,35,55],text:'一份小小的心意，让彼此的来往更亲近。',effects:{bond:1}}]},
 {id:'coins',name:'零钱入匣',grade:0,description:'第18、38、58步家底+1。',triggers:[{at:[18,38,58],text:'你把零散用度留了下来，攒出一点余裕。',effects:{fortune:1}}]},
 {id:'restful',name:'早歇早起',grade:0,description:'休息与睡眠事件的权重翻倍。',boost:['common:sleep','common:rest','common:sun']},
 {id:'curious',name:'爱问缘由',grade:0,description:'读书、学习与练习权重翻倍，也有助于寻找魔法线索。',boost:['common:book','common:learn','common:practice','common:child-read']},
 {id:'neighborly',name:'檐下闲谈',grade:0,description:'结识与交谈权重翻倍，也更易留意附近异闻。',boost:['common:meet-neighbor','common:meet-friend','common:friend-chat']},
 {id:'careful',name:'慢工细活',grade:0,description:'手艺与储蓄事件的权重翻倍。',boost:['common:work-skill','common:savings','common:tools-use']},
 {id:'herbal',name:'辨草识叶',grade:0,description:'悟性+1，备有疗伤药草；机身改备替换件。',start:'remedy',initial:{insight:1}},
 {id:'handy',name:'旧物趁手',grade:0,description:'初始备有工具，悟性+1。不能用工具时改为家底+1。',start:'tools',initial:{insight:1}},
 {id:'steady',name:'不慌不忙',grade:0,description:'初始体魄+1、缘分+1。',initial:{health:1,bond:1}},
 {id:'scroll',name:'无名手札',grade:1,description:'悟性+2；能读字时可研读手札，也利于寻找魔法机缘。',initial:{insight:2},flag:'scroll'},
 {id:'charm',name:'平安小符',grade:1,description:'体魄首次降至2或以下时，恢复3点。',triggers:[{lowHealth:2,once:true,text:'护身的小符轻轻一颤，你熬过了最难的时刻。',effects:{health:3}}]},
 {id:'craft',name:'百物识心',grade:1,description:'初始悟性+2；第20、45步历练+2。',initial:{insight:2},triggers:[{at:[20,45],text:'熟悉的物件显露旧痕，你学会一种新做法。',effects:{},xp:2}]},
 {id:'forest',name:'林间识路',grade:1,description:'体魄+2；有山林时可寻路藏粮，也利于山间机遇。',initial:{health:2},flag:'forest'},
 {id:'moon',name:'月下清思',grade:1,description:'初始悟性+1；第16、36、56步悟性+1。',initial:{insight:1},triggers:[{at:[16,36,56],text:'月色落在心头，散乱思绪渐渐清明。',effects:{insight:1}}]},
 {id:'merchant',name:'市集熟面',grade:1,description:'初始家底+2；工作报酬与储蓄权重翻倍。',initial:{fortune:2},boost:['common:work','common:savings']},
 {id:'invited',name:'座上常客',grade:1,description:'缘分+3；相识交谈权重翻倍，更易收到夜访邀约。',initial:{bond:3},boost:['common:meet-neighbor','common:friend-chat']},
 {id:'tough',name:'风雪耐受',grade:1,description:'初始体魄+3；第45步再加1点。',initial:{health:3},triggers:[{at:[45],text:'挨过几番风雪，你比从前更能忍耐疲劳。',effects:{health:1}}]},
 {id:'wander',name:'远行心性',grade:1,description:'体魄+1、悟性+1；陌路见闻更多，也更易发现妖术线索。',initial:{health:1,insight:1},flag:'wander'},
 {id:'stargaze',name:'辨星知时',grade:1,description:'悟性+2；星夜见闻更多，也利于山间修行机遇。',initial:{insight:2},flag:'stargaze'},
 {id:'promise',name:'一诺长记',grade:1,description:'缘分+2；第25、55步缘分+1，更易收到夜访邀约。',initial:{bond:2},triggers:[{at:[25,55],text:'你记得旧约，认真回应了一次托付。',effects:{bond:1}}]},
 {id:'resources',name:'备物有方',grade:1,description:'初始家底+3；添置工具与安居权重翻倍。',initial:{fortune:3},boost:['common:tools-buy','common:house']},
 {id:'fortune',name:'福缘随身',grade:2,description:'家底+3、缘分+2；偶得物资可分享，贪多会耗费。',enhancement:{story:'fortune',finite:true},initial:{fortune:3,bond:2}},
 {id:'insight',name:'灵光一现',grade:2,description:'悟性+4，第30步历练+3；验证灵光需耗材，可修好试坏的旧工具。',enhancement:{story:'insight',finite:true},initial:{insight:4},triggers:[{at:[30],text:'许多旧日疑问忽然相连，你找到了自己的办法。',effects:{},xp:3}]},
 {id:'healing',name:'春风再至',grade:2,description:'首次体魄≤3时恢复5点；缓息备新药，机身备替换件。',enhancement:{story:'healing',finite:true},triggers:[{lowHealth:3,once:true,text:'春风拂过，你从长久的疲惫里缓了过来。',effects:{health:5}}]},
 {id:'spirit-eye',name:'灵气相亲',grade:2,description:'悟性与缘分+2；辨清灵气可留妖术线索，提高随后发现机会。',enhancement:{story:'spirit-eye',finite:true},initial:{insight:2,bond:2},flag:'spirit-eye'},
 {id:'home',name:'一隅安居',grade:2,description:'初始有安稳住处，家底+3；可留旧识歇脚，接待要花用度。',enhancement:{story:'home',finite:true},initial:{fortune:3},start:'home'},
 {id:'patient',name:'积年成器',grade:2,description:'第20、40、60步悟性+1、历练+2；积累足够可提早一次舍虫研习。',enhancement:{story:'patient',finite:true},triggers:[{at:[20,40,60],text:'多年反复积下的经验，终于显出用处。',effects:{insight:1},xp:2}]},
 {id:'healthful',name:'生机绵长',grade:2,description:'体魄+4、生涯余力增加；调整活动可减耗，逞力仍会累。',enhancement:{story:'healthful',finite:true},initial:{health:4},years:5},
 {id:'archive',name:'岁时藏书',grade:2,description:'悟性+3；可考订旧记，证据不够时保留疑处。',enhancement:{story:'archive',finite:true},initial:{insight:3}},
 {id:'artisan',name:'百年匠心',grade:2,description:'悟性+2、家底+2；试修旧物可省下用度，准备不足时收住尝试。',enhancement:{story:'artisan',finite:true},initial:{insight:2,fortune:2}},
 {id:'boundary',name:'隙间一梦',grade:3,description:'悟性+6、缘分+4；梦路中藏着外界的归途，也可能带来秘封夜谈。',enhancement:{story:'boundary',finite:true},initial:{insight:6,bond:4},flag:'boundary'},
 {id:'phoenix',name:'余火不灭',grade:3,description:'体魄+6、悟性+2，首次濒危恢复8点；余火有机会凝成护魂信物。',enhancement:{story:'phoenix',finite:true},initial:{health:6,insight:2},triggers:[{lowHealth:1,once:true,text:'一息余火仍在，你终于重新睁开了眼睛。',effects:{health:8}}]},
 {id:'blessing',name:'四季眷顾',grade:3,description:'四项+3；第20、40、60步体魄与家底+1；守灯结下的祭祀之缘可助成神。',enhancement:{story:'blessing',finite:true},initial:{health:3,insight:3,bond:3,fortune:3},triggers:[{at:[20,40,60],text:'四时流转，你的日子又多了一分余裕。',effects:{health:1,fortune:1}}]},
 {id:'earth-vein',name:'山川听脉',grade:3,description:'体魄+3、悟性+4；可实察近处地脉，分清水声与震动，气力不足时止步。',enhancement:{story:'earth-vein',finite:true},initial:{health:3,insight:4}},
 {id:'star-chart',name:'星河旧约',grade:3,description:'悟性+4、家底+3；可校订旧星图的时辰，未能核实的星位留下待考。',enhancement:{story:'star-chart',finite:true},initial:{insight:4,fortune:3}}
 ];
 function conflict(id,selected){const t=list.find(t=>t.id===id);return selected.find(x=>t.exclude?.includes(x)||list.find(t=>t.id===x).exclude?.includes(id));}
 function validate(ids){if(ids.length!==3||new Set(ids).size!==3||ids.some(id=>!list.some(t=>t.id===id)))throw new Error('请选择三个不同的天赋。');for(const id of ids)if(conflict(id,ids.filter(x=>x!==id)))throw new Error('所选天赋互斥。');}
 function draw(rng){const picked=[];for(let i=0;i<10;i++){const available=grades.map((g,grade)=>({grade,weight:g.weight,pool:list.filter(t=>t.grade===grade&&!picked.includes(t.id))})).filter(g=>g.pool.length);let n=rng()*available.reduce((sum,g)=>sum+g.weight,0);let choice=available[available.length-1];for(const g of available){n-=g.weight;if(n<0){choice=g;break;}}picked.push(choice.pool[Math.floor(rng()*choice.pool.length)].id);}return picked;}
 globalThis.TouhouTalents={grades,list,draw,validate,conflict};
})();
