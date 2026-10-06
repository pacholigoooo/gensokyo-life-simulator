import {readFile,writeFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {buildChronicles} from './build-chronicles.mjs';
import {buildRelationships} from './build-relationships.mjs';
const root=new URL('../',import.meta.url);
const read=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const files=(await readdir(new URL('data/characters/',root))).filter(p=>p.endsWith('.json')).sort();
const characters=(await Promise.all(files.map(p=>read('data/characters/'+p)))).flat();
const roster=await read('docs/roster.json');
const romanceScope=await read('docs/romance-scope-v8.json');
const canon=await read('data/canon-events.json');
const stats=['health','insight','bond','fortune'],ids=new Set(),names=new Set(),eventIds=new Set();
function effects(fx,label){assert(fx&&typeof fx==='object',label+': effects');for(const [k,v]of Object.entries(fx)){assert(stats.includes(k),label+': unknown stat '+k);assert(Number.isInteger(v)&&Math.abs(v)<=5,label+': effect range');}}
function text(value,label,max=36){assert(typeof value==='string'&&value.length>=5&&value.length<=max,`${label}: text length ${value?.length}`);}
for(const c of characters){
 assert(!ids.has(c.id),'Duplicate id '+c.id);ids.add(c.id);assert(!names.has(c.name),'Duplicate name '+c.name);names.add(c.name);
 for(const field of ['id','name','category','work','location','identity','source'])assert.equal(typeof c[field],'string',c.id+'.'+field);
 assert(['main','hifuu','pc98'].includes(c.category),c.id);assert(['human','long','eternal','fairy','spirit','beast','construct'].includes(c.life),c.id+'.life');assert(['humanoid','spirit','beast','machine'].includes(c.body),c.id+'.body');assert(['gensokyo','pc98','outside','moon','makai','hell','past','dream'].includes(c.realm),c.id+'.realm');assert(['shrine','magic','scholar','craft','trade','medicine','music','garden','guard','travel','lead','animal'].includes(c.career),c.id+'.career');assert.equal(typeof c.family,'boolean',c.id+'.family');
 for(const key of ['animalMind','fixedHome'])if(c[key]!==undefined)assert.equal(typeof c[key],'boolean',c.id+'.'+key);
 if(c.regenerates!==undefined)assert.equal(typeof c.regenerates,'boolean',c.id+'.regenerates');
 if(c.confined!==undefined)assert.equal(typeof c.confined,'boolean',c.id+'.confined');
 if(c.originRealm)assert(['gensokyo','pc98','outside','moon','makai','hell','past','dream'].includes(c.originRealm),c.id+'.originRealm');
 for(const move of c.moves||[])assert([6,18,40,65].includes(move.turn)&&['gensokyo','pc98','outside','moon','makai','hell','past','dream'].includes(move.realm)&&typeof move.location==='string',c.id+'.moves');
 if(c.lifeYears)assert(c.lifeYears.length===2&&c.lifeYears.every(n=>Number.isFinite(n)&&n>0)&&c.lifeYears[0]<=c.lifeYears[1],c.id+'.lifeYears');
 text(c.origin,c.id+'.origin');for(const k of ['success','bittersweet','failure'])text(c[k],c.id+'.'+k,55);
 assert.equal(c.milestones.length,4,c.id+'.milestones');
 for(const [i,m]of c.milestones.entries()){if(i===1||i===2){assert(stats.includes(m.check?.stat)&&Number.isInteger(m.check.min)&&m.check.min>=0&&m.check.min<=30,c.id+'.check');text(m.pass,c.id+'.pass');text(m.fail,c.id+'.fail');effects(m.passEffects,c.id);effects(m.failEffects,c.id);}else{text(m.text,c.id+'.milestone');effects(m.effects,c.id);}}
 assert(c.events.length>=36,c.id+': needs 36 independent events');
 assert(c.events.filter(e=>e.phases[0]<=1).length>=6,c.id+': early coverage');assert(c.events.filter(e=>e.phases[1]>=3).length>=6,c.id+': late coverage');assert(c.events.filter(e=>e.min||e.max||e.bias).length>=12,c.id+': attribute coverage');
 const produced=new Set(c.events.flatMap(e=>e.set||[]));let chainEdges=0;
 for(const e of c.events){
  assert(e.id.startsWith(c.id),c.id+': event prefix '+e.id);assert(!eventIds.has(e.id),'Duplicate event '+e.id);eventIds.add(e.id);text(e.text,e.id);effects(e.effects,e.id);
  assert(e.phases.length===2&&e.phases.every(n=>Number.isInteger(n)&&n>=0&&n<=4)&&e.phases[0]<=e.phases[1],e.id+': phases');assert(Number.isInteger(e.weight)&&e.weight>=1&&e.weight<=5,e.id+': weight');
  for(const obj of [e.min,e.max])for(const [k,v]of Object.entries(obj||{}))assert(stats.includes(k)&&Number.isInteger(v)&&v>=0&&v<=30,e.id+': threshold');
  for(const [k,v]of Object.entries(e.bias||{}))assert(stats.includes(k)&&[1,-1].includes(v),e.id+': bias');
  for(const age of [e.minAge,e.maxAge])if(age!==undefined)assert(Number.isFinite(age)&&age>=0,e.id+': age');
  if(e.minAge!==undefined&&e.maxAge!==undefined)assert(e.minAge<=e.maxAge,e.id+': age order');
  if(e.xp!==undefined)assert(Number.isInteger(e.xp)&&e.xp>=0&&e.xp<=2,e.id+': xp');
  for(const field of ['requires','excludes','set','clear'])for(const f of e[field]||[])assert(f.startsWith(c.id+':'),e.id+': private flag '+f);
  for(const f of e.requires||[]){assert(produced.has(f),e.id+': orphan requirement '+f);chainEdges++;}
  for(const id of [...e.with||[],...e.remember||[]])assert(roster.some(r=>r.id===id),e.id+': unknown actor '+id);
 }
 assert(chainEdges>=2,c.id+': at least two causal links');
}
const coverage=roster.map(r=>{const c=characters.find(c=>c.id===r.id);if(c)for(const k of ['name','category','work'])assert.equal(c[k],r[k],r.id+': metadata '+k);return {id:r.id,name:r.name,category:r.category,work:r.work,covered:!!c,events:c?.events.length||0,milestones:c?.milestones.length||0,branches:c?2:0,endings:c?3:0,source:r.sources[0]};});
assert.equal(characters.length,roster.length,'Incomplete roster');assert(coverage.every(c=>c.covered),'Missing characters');
const relationships=await buildRelationships(characters);
const canonFlags=new Set(canon.flatMap(e=>e.set||[])),canonIds=new Set();
for(const e of canon){assert(e.id.startsWith('canon:')&&!canonIds.has(e.id),e.id+': canon id');canonIds.add(e.id);text(e.text,e.id,65);effects(e.effects,e.id);assert.equal(e.repeat,1);assert(e.minAge>=18);for(const f of e.requires||[])assert(canonFlags.has(f),e.id+': canon prerequisite');}
const chronicles=await buildChronicles(characters);
await writeFile(new URL('dist/content-data.js',root),'// Generated from data/characters/*.json, data/chronicles/*.json and data/canon-events.json by npm run build.\nglobalThis.TouhouContent = '+JSON.stringify(characters)+';\nglobalThis.TouhouCanonEvents = '+JSON.stringify(canon)+';\n');
await writeFile(new URL('reports/coverage.json',root),JSON.stringify({characters:characters.length,roster:roster.length,randomEvents:eventIds.size,missing:[],extras:[],coverage},null,2)+'\n');
await writeFile(new URL('docs/route-coverage.csv',root),'id,name,category,work,events,milestones,branches,endings,covered\n'+coverage.map(r=>[r.id,r.name,r.category,r.work,r.events,r.milestones,r.branches,r.endings,r.covered].join(',')).join('\n')+'\n');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const research=await readFile(new URL('docs/roster-research.md',root),'utf8');
const inline=s=>esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const sourceLines=research.split('\n');
let sourceBody='';
for(let i=0;i<sourceLines.length;i++){
  const line=sourceLines[i];
  if(line.startsWith('|')&&sourceLines[i+1]?.startsWith('|---')){
    const cells=line=>line.split('|').slice(1,-1).map(c=>c.trim());
    sourceBody+='<div class="table-scroll"><table><thead><tr>'+cells(line).map(c=>'<th>'+inline(c)+'</th>').join('')+'</tr></thead><tbody>';
    i+=2;
    while(i<sourceLines.length&&sourceLines[i].startsWith('|')){sourceBody+='<tr>'+cells(sourceLines[i]).map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>';i++;}
    sourceBody+='</tbody></table></div>';i--;continue;
  }
  if(line.startsWith('#')){const level=Math.min(4,line.match(/^#+/)[0].length+1);sourceBody+=`<h${level}>${inline(line.replace(/^#+\s*/,''))}</h${level}>`;}
  else if(line.trim()) sourceBody+='<p>'+inline(line)+'</p>';
}
await writeFile(new URL('dist/sources.html',root),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>作品与来源 · 幻想乡一生纪</title><link rel="icon" type="image/svg+xml" href="icon.svg"><link rel="stylesheet" href="style.css"><style>main{padding-top:28px;overflow-wrap:anywhere}p{font-size:.9rem}li{padding:9px 0;border-bottom:1px solid var(--line)}.source-record{font-size:.8rem}table{border-collapse:collapse;width:100%;font-size:.82rem}th,td{text-align:left;vertical-align:top;padding:10px;border:1px solid var(--line)}th{background:var(--faint)}.table-scroll{overflow-x:auto;margin:20px 0}</style><main><a href="index.html">返回一生纪</a><h1>作品与来源</h1><p>${characters.length}种特殊身份，共${characters.reduce((n,c)=>n+c.events.length,0)}条人物随机事件；人物前史按原作资料编写，后续人生节点、随机事件与结局为本作创作。<a href="chronicles.html">查看逐人前史、年龄依据与作品覆盖</a>。</p>${sourceBody}<h2>普通人的机遇</h2><p>36条偶遇与八条发展路线采用原创短句。仙人仍属人类，学习魔法与成为魔法使分开处理；具体历程、检定、代价与吸血鬼转化成功的结果为同人创作。核对资料：<a href="https://thbwiki.cc/东方求闻史纪/仙人">《求闻史纪》仙人</a>、<a href="https://thbwiki.cc/东方求闻史纪/魔法使/中日对照">魔法使</a>、<a href="https://thbwiki.cc/东方求闻史纪/吸血鬼/中日对照">吸血鬼</a>、<a href="https://thbwiki.cc/东方铃奈庵/第二十五话#P17">《铃奈庵》第25话</a>。完整研究与逐条遭遇条件随源码提供。</p><h2>尸解与身后生活</h2><p>尸解仙经历修炼、寄物、沉眠与复苏，随后在山中生活并应对地狱追索。幽灵靠气质聚形，怨灵受怨念与镇伏影响；受祭的人神回应祈愿，神力随信仰起伏。三条死后发展都须先有生前经历与准备，转变后继续自动推进并各有终局。具体步骤、年数和检定为本作二创。</p><p>核对资料：<a href="https://thbwiki.cc/东方求闻口授/物部布都">《求闻口授》物部布都</a>、<a href="https://thbwiki.cc/东方求闻史纪/幽灵">《求闻史纪》幽灵</a>、<a href="https://thbwiki.cc/东方求闻口授/苏我屠自古">《求闻口授》苏我屠自古</a>、<a href="https://thbwiki.cc/东方求闻史纪/神灵">《求闻史纪》神灵</a>及<a href="https://thbwiki.cc/东方求闻史纪/八百万之神">八百万之神</a>。本作的成神路线采用受祭的人神概念。</p><h2>职业发展</h2><p>抄书、农事、行商与手艺各有学徒、独立谋生、专精负责、传承四阶段，年资和实际工作共同推动晋升。药师先经过多年认药与配药见习；魔法修习衔接已有试炼。形态改变后，实体职业会调整营生地点与时辰；灵体保留生前职业经历。</p><h2 id="romance">普通人的具名关系</h2><p>收录${relationships.length}人的连续关系，共${relationships.reduce((n,r)=>n+r.nodes,0)}个节点、${relationships.reduce((n,r)=>n+r.branches,0)}种条件分支与${relationships.reduce((n,r)=>n+r.echoes,0)}条回响。童年与少年时会留下受照料、习字、看戏与探访的旧识；成年后再展开相识、共事、冲突与后续来往。其中${relationships.filter(r=>r.romance).length}位有专属情缘，通常主角至少20岁，尚未确立过恋人，并积累往来与信任。灵梦、魔理沙、阿求与小铃另有明确标注的本作少年篇：真实早年相识满六年后，符合条件可在16–17岁相许；这些相遇年份属于二创，原作确龄未公开的仍记为未知。阿求另须自身至少18岁。少年篇只写适龄来往，具名婚事与成年亲密仍至少20岁。每人沿自己的共同经历发展心意，相恋后有约会、关心与双方愿意的轻吻。人物主线同时推进至多两段，新人物初识至少相隔五年，旧友与伴侣持续来往。每位情缘有商议、筹备、婚礼、六条婚后日常与双方离别反应。每局一生只确立一位恋人，离别后仍保留共同经历。日常随身体年龄与相伴年数改变；长生者不会只因过了人类六十岁而进入晚年。异境访客先获引路或许可；秘封、旧作、历史与月面人物通过标明场景的二创梦篇来往，保留各自的时代与处境。梦中别离单列，不记成现实死亡。</p><ul>${relationships.map(r=>`<li>${esc(r.name)} · ${r.romance?'可发展恋爱':'友谊等来往'} · ${esc(r.romanceTitle||r.title)} · ${esc(r.contact.place)} · ${r.nodes}节点 / ${r.branches}分支 / ${r.echoes}回响 · <a href="${esc(r.source)}">设定来源</a></li>`).join('')}</ul><h3>恋人的亲友</h3><p>关系依据取自原作与官方出版物，三人相处片段为本作二创。亲友低频来往，梦中旧影留在原来的时代与梦境里。</p><ul>${relationships.filter(r=>r.circle).map(r=>`<li>${esc(r.name)}：${r.circle.visits.length?r.circle.visits.map(v=>`${esc(characters.find(c=>c.id===v.person).name)} · ${esc(v.relation)} · <a href="${esc(v.source)}">来源</a>`).join("；"):esc(r.circle.note)}</li>`).join('')}</ul><h3>阿求的归途</h3><p>阿求使用自己的年龄与有限寿程。深爱她、修为足够且共同备好归愿的人，可以亲赴彼岸，闯入地狱役所护送她回到原身。这段有限续寿有失败风险，记忆与关系沿用原来的阿求；情节、数值与胜负均为本作二创。原作短寿与转生记述见<a href="https://thwiki.cc/东方求闻史纪/独白">《求闻史纪·独白》</a>与<a href="https://thbwiki.cc/东方Project人妖名鉴_常世篇/第7部分">《人妖名鉴·常世篇》</a>。</p><h3>情缘范围</h3><p>名册${romanceScope.counts.total}项；男性与秘封类别共${romanceScope.counts.excluded}项保留情谊，另有${romanceScope.counts.identityExcludedByUser}项动物或特殊实体采用各自的陪伴互动。堇子按本项目正作分类纳入，莲子与梅莉归秘封音乐CD类别。神玉情缘采用女子形态；芳香情缘另有想象生前的旧梦，原有现世来往保持各自前史。</p><ul>${romanceScope.entries.filter(e=>e.status!=='eligible').map(e=>`<li>${esc(e.name)} · ${e.includeRomance?'纳入情缘':e.status==='excluded'?'情谊来往':'专属陪伴'}<br>${esc(e.basis)} ${esc(e.implementationNotes)}</li>`).join('')}</ul><h2>异变旧闻与日常</h2><p>十五条事件分成五段小故事：红雾旧记与送货路标、迟春旧闻与农事储备、长夜记录与夜路约定、寺院传闻与探访准备、能力卡流通与货账。玩家先听闻或读到旧事，再依职业与实际经历参与日常；原作异变不会按玩家岁数逐个重演。逐条来源与前置条件见源码中的docs/canon-events-v8.md。</p><h2>仙人与魔法使</h2><p>《求闻史纪》记述仙人大约每百年遭地狱刺客追袭；《茨歌仙》第12话区分渡船死神与追索延寿者的鬼神。本作安排预警、准备、脱身、重伤或失败，并可能多次来袭。80至120年的间隔、检定概率及具体故事都是模拟规则。</p><p>人类学习魔法仍是人类，舍食可使其成为种族魔法使；停止成长老化另由舍虫等魔术处理。天生出身与完成不老术分开处理；帕秋莉、爱丽丝从既有魔法使身份展开这一卷，不另编剩余寿限。成美单列石像赋生，白莲采用个人设定中的返老还童。学习间隔、成就时点和回顾年表不代表原作确切年龄。</p><p>核对：<a href="https://thbwiki.cc/东方茨歌仙/第十二话#P5">《茨歌仙》第12话</a>、<a href="https://thbwiki.cc/东方求闻史纪/魔法使/中日对照">《求闻史纪》魔法使</a>、<a href="https://thbwiki.cc/附带文档:东方天空璋/Omake#矢田寺成美">天空璋附带设定</a>。这些链接为原作转录；出处、说话者与事实边界详见源码docs/species-research-v5.md。</p><h2>伴侣修行与共同生活</h2><p>华扇可以引导主角修持仙道；她的原身份仍是鬼。魔理沙可以协助读解魔法教材，主角依次经历学习、作为人类从事魔法工作、自己完成舍食，再继续研究舍虫。蕾米莉亚与芙兰朵露的转化约定、双方意愿和夜间生活准备属于本作同人情节，原作没有确认本作采用的具体仪式。角色身份和魔法阶段依据《茨歌仙》最终话与《求闻史纪》对应条目，紫可以带领主角观察边界、保存旧名并逐步试行；隐岐奈通过四季实作与后户调养有限延长人类寿程。具体过程均为本作二创，详细定位见源码docs/partner-learning-v11.md。</p><p>${relationships.filter(r=>r.romance).length}位恋人各有两段婚前日常、六种双阶段婚后活动与个人回忆；有原作旧识依据的${relationships.filter(r=>r.circle?.visits.length).length}人另有四段亲友来往。自然机缘的发现率与伴侣教学分别设定。人类和仍会老化的魔法使保留原婚恋节奏，双方长寿的关系按实际种族分散婚事和活动。具体间隔与所有新增情节均为本作模拟规则。</p><h2>个人成长指引</h2><p>41位人物另有2至4段独立指引与后续来往：有限调养、一次护命、职业修习，或神绮梦篇中的本人魔法自修。每段有实际经历、年数与属性条件；完成效果记录在本局年表和人生回顾里。原166位情缘人物的能力核查及原作与二创边界见源码docs/guidance-capability-coverage-v11.md，各条原文链接见data/guidance。</p><h2>人物来源与线路</h2><ol>${characters.map(c=>`<li><b>${esc(c.name)}</b> · ${esc(c.chronicle.anchor.identity||c.identity)} · ${esc(c.chronicle.anchor.location||c.location)}<br><span class="source-record">${esc(c.work)} · ${c.events.length}条人物事件 · 4个人生节点 · 2处条件分歧 · 3种人生余韵 · <a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">角色资料</a></span></li>`).join('')}</ol></main></html>`);
console.log(JSON.stringify({characters:characters.length,files:files.length,randomEvents:eventIds.size,romanticRoutes:relationships.filter(r=>r.romance).length,plannedRomances:romanceScope.counts.plannedRomance,canonEvents:canon.length,historyEvents:chronicles.historyEvents,reviewedWorks:chronicles.reviewedWorks,missing:[]}));

// Ship the same validated content through the legacy-browser build.
const {buildCompatible}=await import('./build-compatible.mjs');
await buildCompatible();
