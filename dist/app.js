(() => {
  const E=globalThis.TouhouEngine;
  const characters=globalThis.TouhouContent,T=globalThis.TouhouTalents,R=globalThis.TouhouRelationships;
  const memoirImage=globalThis.TouhouMemoirImage;
  const companionSummary=globalThis.TouhouCompanionSummary;
  const memoirNames=memoirImage?memoirImage.createNames(characters):[];
  const $=id=>document.getElementById(id);
  const categoryNames={main:'正作及官方出版物',hifuu:'秘封',pc98:'旧作'};
  const stats={health:5,insight:5,bond:5,fortune:5};
  let life=null,visible=null,rng=null,timer=null,paused=false,rendered=0,talentKey=null,relationKey=null,memoirText='';
  const replay=new URLSearchParams(location.search).get('seed');
  const fixedSeed=replay!==null&&/^\d{1,10}$/.test(replay)?Number(replay)>>>0:null;
  let runSeed=0,draft=[],selected=[],draftNumber=0;
  let exportSequence=0,imageURLs=[],companionAccount=null;
  // A gameplay seed needs no security guarantee; vendor WebViews may omit crypto.
  function newDraft(){runSeed=fixedSeed??(globalThis.crypto?.getRandomValues?crypto.getRandomValues(new Uint32Array(1))[0]:Math.floor(Math.random()*0x100000000)>>>0);draft=T.draw(E.random((runSeed^0x35dab)+draftNumber++));selected=[];renderTalents();}
  function renderTalents(){
    $('talent-count').textContent=selected.length;$('confirm-talents').disabled=selected.length!==3;
    $('talent-list').replaceChildren(...draft.map(id=>{const t=T.list.find(t=>t.id===id),chosen=selected.includes(id),conflict=T.conflict(id,selected),button=node('button',undefined,'talent grade-'+t.grade+(chosen?' selected':''));button.type='button';button.dataset.talent=id;button.setAttribute('aria-pressed',String(chosen));button.disabled=!chosen&&(selected.length===3||!!conflict);
      const heading=node('span',undefined,'talent-heading');heading.append(node('strong',t.name),node('small',T.grades[t.grade].name));button.append(heading,node('span',t.description,'talent-description'));if(conflict)button.append(node('span','与「'+T.list.find(t=>t.id===conflict).name+'」互斥','talent-conflict'));
      button.onclick=()=>{selected=chosen?selected.filter(x=>x!==id):[...selected,id];renderTalents();};return button;}));
  }
  function confirmTalents(){T.validate(selected);$('talent-setup').hidden=true;$('setup').hidden=false;$('chosen-talents').replaceChildren(...selected.map(id=>{const t=T.list.find(t=>t.id===id),p=node('p',undefined,'chosen-talent grade-'+t.grade);p.append(node('strong',t.name),node('span',t.description));return p;}));refreshAllocation();$('start').focus();}
  $('redraw-talents').onclick=newDraft;$('confirm-talents').onclick=confirmTalents;
  $('change-talents').onclick=()=>{$('setup').hidden=true;$('talent-setup').hidden=false;};
  E.validateWeights(globalThis.TouhouConfig);
  const hints={health:'身体与寿数',insight:'学识与手艺',bond:'来往与情分',fortune:'家计与机缘'};
  function node(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
  function memoirParagraph(text){const p=node('p');if(memoirImage)memoirImage.appendText(p,text,memoirNames);else p.textContent=text;return p;}
  function renderCompanion(account){
    const section=$('companion-memoir');section.replaceChildren();
    section.className='companion-memoir'+(account.id?'':' companion-empty');
    section.append(node('p',account.title,'eyebrow'),node('h4',account.name,'companion-name'));
    if(account.yearsText)section.append(node('p',account.yearsText,'companion-years'),node('p',account.periodText,'companion-period'));
    if(account.outcomeTitle)section.append(node('h5',account.outcomeTitle,'companion-outcome'));
    const ending=memoirParagraph(account.outcomeText);ending.className='companion-ending';section.append(ending);
    if(account.moments.length){
      section.append(node('h5','相伴拾记'));const list=node('ol',undefined,'companion-moments');
      for(const moment of account.moments){const item=node('li');item.append(node('span',moment.time,'companion-time'),memoirParagraph(moment.text));list.append(item);}
      section.append(list);
    }
  }
  function resetMemoirExport(){
    exportSequence++;
    for(const url of imageURLs)URL.revokeObjectURL(url);imageURLs=[];
    $('memoir-images').replaceChildren();$('memoir-images').hidden=true;
    $('export-status').textContent='';$('export-memoir').disabled=false;$('export-memoir').textContent='导出图片';
  }
  function setText(el,text){const value=String(text);if(el.textContent!==value)el.textContent=value;}
  function formatChange(value){return value===0?'0':value>0?'+'+value:value.toString().replace('-', '−');}
  const statFields=Object.fromEntries(E.STATS.map(k=>{
    const item=node('div',undefined,'live-stat'),values=node('dd');
    const current=node('strong'),change=node('small',undefined,'stat-change');
    current.id='live-value-'+k;change.id='live-change-'+k;
    values.append(current,change);item.append(node('dt',E.LABELS[k]),values);$('live-stats').append(item);
    return [k,{current,change}];
  }));
  function renderLifeTalents(){
    const key=visible.talents.join('|');if(key===talentKey)return;talentKey=key;
    const talents=visible.talents.map(id=>T.list.find(t=>t.id===id));
    $('live-talents').textContent='天赋 · '+talents.map(t=>t.name).join(' · ');
    $('live-talent-descriptions').replaceChildren(...talents.map(t=>{const p=node('p');p.append(node('strong',t.name),node('span',t.description));return p;}));
  }
  function renderRelationships(){
    const relations=visible.relationships;
    const key=JSON.stringify(relations.map(r=>[r.id,r.name,r.status,r.stage,r.learning,r.romanceClosed,r.alive,visible.ended?r.summary:'']));
    $('relationships').hidden=relations.length===0;
    if(key===relationKey)return;relationKey=key;
    $('relationship-list').replaceChildren(...relations.map(relation=>{
      const item=node('li',undefined,'relationship-item'),line=node('p',undefined,'relationship-line');
      line.append(node('strong',relation.name),node('span',relation.status,'relationship-status'));
      if(!relation.alive)line.append(node('span',relation.departure,'relationship-departed'));
      if(relation.stage)line.append(node('span','经历 · '+relation.stage,'relationship-stage'));
      if(relation.learning)line.append(node('span',relation.learning,'relationship-stage'));
      if(relation.romanceClosed)line.append(node('span','恋爱分支已结束','relationship-stage'));
      item.append(line,node('p',relation.scene,'relationship-scene'));
      if(visible.ended&&relation.summary)item.append(node('p',relation.summary,'relationship-summary'));
      return item;
    }));
  }
  function allocationTotal(){return E.STATS.reduce((sum,k)=>sum+stats[k],0);}
  function refreshAllocation(){
    E.STATS.forEach(k=>{ $('points-'+k).value=stats[k];$('value-'+k).textContent=stats[k];$('minus-'+k).disabled=stats[k]===0;$('plus-'+k).disabled=stats[k]===10||allocationTotal()===20; });
    $('remaining').textContent=20-allocationTotal();$('start').disabled=allocationTotal()!==20;
  }
  for(const k of E.STATS){
    const row=node('div',undefined,'allocation-row');
    const heading=node('div',undefined,'allocation-name');
    const label=node('label',E.LABELS[k]);label.htmlFor='points-'+k;heading.append(label,node('span',hints[k],'stat-hint'));
    const inputRow=node('div',undefined,'allocation-input');
    const minus=node('button','−');minus.type='button';minus.id='minus-'+k;minus.setAttribute('aria-label','减少'+E.LABELS[k]);
    const input=node('input');input.type='range';input.min=0;input.max=10;input.step=1;input.id='points-'+k;input.value=5;
    const output=node('output','5');output.id='value-'+k;output.htmlFor=input.id;
    const plus=node('button','+');plus.type='button';plus.id='plus-'+k;plus.setAttribute('aria-label','增加'+E.LABELS[k]);
    minus.onclick=()=>{stats[k]--;refreshAllocation();};plus.onclick=()=>{stats[k]++;refreshAllocation();};
    input.oninput=()=>{const available=20-allocationTotal()+stats[k];stats[k]=Math.min(Number(input.value),available);refreshAllocation();};
    inputRow.append(minus,input,output,plus);row.append(heading,inputRow);$('allocation').append(row);
  }
  $('random-points').onclick=()=>{E.STATS.forEach(k=>stats[k]=0);for(let i=0;i<20;i++){const choices=E.STATS.filter(k=>stats[k]<10);stats[choices[Math.floor(Math.random()*choices.length)]]++;}refreshAllocation();};
  const weights=globalThis.TouhouConfig;
  $('probability-note').textContent=`本作设定：普通人${+(weights.ordinary*100).toFixed(3)}% · 正作${+(weights.main*100).toFixed(3)}% · 秘封${+(weights.hifuu*100).toFixed(3)}% · 旧作${+(weights.pc98*100).toFixed(3)}%。`;
  $('talent-grade-note').textContent='初始等级抽取权重为'+T.grades.map(g=>`${g.name}${g.weight}%`).join('、')+'。';
  $('romance-scope').textContent=`普通人可与${characters.length}位人物来往，其中${TouhouRelationshipData.filter(r=>r.romance).length}位有专属情缘。莲子、梅莉与男性人物保留各自的友谊、同伴或竞争线路。`;
  $('life-goal').replaceChildren(...E.goals.map(g=>{const option=node('option',g.name);option.value=g.id;return option;}));
  for(const route of TouhouRelationshipData.filter(r=>r.romance)){const option=node('option',characters.find(c=>c.id===route.id).name);option.value=route.id;$('romance-wish').append(option);}
  function describeGoal(){setText($('goal-description'),E.goals.find(g=>g.id===$('life-goal').value).description);$('romance-wish-controls').hidden=$('life-goal').value!=='romance';}
  $('life-goal').onchange=describeGoal;describeGoal();
  function stopTimer(){if(timer!==null){clearTimeout(timer);timer=null;}}
  // Keep only derived display values: the engine remains authoritative and can finish
  // a whole step while its records wait. Publish that step after its last record.
  function captureVisible(s){
    const partner=R.partner(s);
    return {description:E.describeLife(s),phase:s.phase,goal:E.goalStatus(s),stats:{...s.stats},lastChanges:{...s.lastChanges},talents:[...s.talents],relationships:R.describe(s),ended:s.ended,
      partner:partner?(s.afterlife?`生前伴侣 · ${partner.name} · 生死相隔`:`情缘 · ${partner.name} · ${partner.status}`):s.firstPartnerId?'情缘 · '+(s.firstPartnerId==='local:spouse'?'村民伴侣':s.people[s.firstPartnerId].name)+' · 旧日相伴':'情缘 · 尚无伴侣'};
  }
  // The engine may have ended while its final records still await display.
  function playbackEnded(){return life.ended&&rendered===life.log.length;}
  // Replace the pending timeout so speed and pause changes keep one timer.
  function schedule(){stopTimer();if(life&&!playbackEnded()&&!paused)timer=setTimeout(tick,Number($('speed').value));}
  function tick(){
    timer=null;if(!life||playbackEnded())return;
    try{
      // A year may produce several records. Show them before advancing again.
      if(rendered===life.log.length)E.step(life,rng);
      render(rendered+1);schedule();
    }catch(error){stopTimer();paused=true;$('runtime-error').textContent='人生推进失败：'+error.message;$('runtime-error').hidden=false;$('running-status').textContent='发生错误';console.error(error);}
  }
  function start(){
    if(life)return;
    E.validateAllocation(stats);
    T.validate(selected);const seed=runSeed;rng=E.random(seed^0x9e3779b9);
    life=E.createLife({stats,talents:selected,seed,goal:$('life-goal').value,romanceWish:$('life-goal').value==='romance'?$('romance-wish').value||null:null});paused=false;rendered=0;talentKey=null;relationKey=null,memoirText='';
    // Opening talent effects also have queued records; show allocated values first.
    visible=captureVisible({...life,stats:life.allocated});
    $('setup').hidden=true;$('life').hidden=false;$('settlement').hidden=true;$('runtime-error').hidden=true;$('timeline').replaceChildren();
    memoirText='';resetMemoirExport();$('live-talent-details').open=false;render(1);$('life').scrollIntoView(true);$('pause').focus({preventScroll:true});schedule();
  }
  function restart(){stopTimer();resetMemoirExport();life=null;visible=null;rng=null;paused=false;rendered=0;talentKey=null;relationKey=null,memoirText='';$('life').hidden=true;$('setup').hidden=true;$('settlement').hidden=true;$('talent-setup').hidden=false;$('relationships').hidden=true;$('relationship-list').replaceChildren();E.STATS.forEach(k=>stats[k]=5);newDraft();$('talent-setup').scrollIntoView(true);$('talent-title').focus({preventScroll:true});}
  function togglePause(){if(!life||playbackEnded())return;paused=!paused;render();schedule();}
  function pauseInBackground(){if(!life||playbackEnded())return;paused=true;stopTimer();render();}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseInBackground();});
  addEventListener('pagehide',pauseInBackground);
  function render(revealTo=rendered){
    const end=Math.min(revealTo,life.log.length),finished=life.ended&&end===life.log.length;
    if(end===life.log.length)visible=captureVisible(life);
    const description=visible.description;
    setText($('identity'),life.character?categoryNames[life.character.category]+' · 开局身份':'寻常出身 · '+(description.career||'最初的岁月'));
    setText($('life-title'),life.character?life.character.name:'你的这一生');
    setText($('live-time'),description.time);setText($('time-kind'),life.named?'纪事':'行年');setText($('live-species'),description.species);setText($('live-body-status'),description.status);setText($('life-status-label'),life.character?'篇章':'身体');
    setText($('where'),`${description.location} · ${description.phaseLabel||E.PHASES[visible.phase]}`);
    const goal=visible.goal;setText($('goal-status'),`心愿 · ${goal.name} · ${goal.status}。${goal.description}`);
    setText($('running-status'),finished?'已结算':paused?'已暂停':'人生行进中');setText($('pause'),paused?'继续':'暂停');$('pause').disabled=finished;$('speed').disabled=finished;
    for(const k of E.STATS){
      const {current,change}=statFields[k],delta=visible.lastChanges[k],signed=formatChange(delta);
      setText(current,visible.stats[k]);current.setAttribute('aria-label','当前值'+visible.stats[k]);
      setText(change,signed);change.className='stat-change'+(delta>0?' gain':delta<0?' loss':'');change.setAttribute('aria-label','本步净变化'+signed);
    }
    renderLifeTalents();renderRelationships();
    $('partner-status').hidden=!!life.character;setText($('partner-status'),visible.partner);
    let firstNew=null;
    for(const entry of life.log.slice(rendered,end)){
      const li=node('li');if(life.named)li.classList.add('named-entry');if(entry.chronicle)li.classList.add('chronicle-entry');if(entry.ending)li.classList.add('ending-entry');li.append(node('span',entry.time,'when'));
      const body=node('div');if(entry.chronicle){const h=entry.chronicle,line=node('p',({canon:'原作回顾','route-dependent':'原作路线分支',reported:'原作中的记述',unknown:'资料未明'}[h.certainty])+' · '+h.work,'event-scene'),link=node('a','查看出处');link.href='chronicles.html#'+life.character.id+'-'+h.historyId;link.target='_blank';link.rel='noopener';line.append(document.createTextNode(' · '),link);body.append(line);}if(entry.futureOpening){li.classList.add('future-opening');body.append(node('strong','此后岁月 · '+E.futureLabel(life)));}if(entry.developmentMoment?.major){const m=entry.developmentMoment,notice=node('div',undefined,'development-moment');notice.dataset.kind=m.kind;notice.append(node('strong',m.title),node('p','当前：'+m.status+'。'+m.impact));body.append(notice);li.classList.add('major-development');}if(entry.relationshipMoment&&entry.relationshipMoment.kind!=='closed'){const m=entry.relationshipMoment,notice=node('div',undefined,'relationship-moment');notice.dataset.kind=m.kind;notice.append(node('strong',m.title+' · '+m.person));if(m.kind!=='bereaved')notice.append(node('p','当前：'+m.status+'。'+m.impact));body.append(notice);li.classList.add('major-relationship');}if(entry.relationship){const r=entry.relationship,line=node('p',r.name+' · '+(r.from!==r.to?(r.from?R.labels[r.from]+' → ':'')+R.labels[r.to]:R.labels[r.to]+' · '+r.stage),'relationship-progress');line.dataset.person=r.id;line.dataset.from=r.from||'';line.dataset.to=r.to;body.append(line);}if(entry.scene)body.append(node('p',entry.scene,'event-scene'));if(entry.premise)body.append(node('p',entry.premise,'event-premise'));body.append(node('p',entry.text,'event-text'));
      const changes=Object.entries(entry.effects).filter(([,v])=>v!==0).map(([k,v])=>`${E.LABELS[k]}${v>0?'+':''}${v}`);
      if(entry.check){const check=entry.check;const condition=`${E.LABELS[check.stat]}≥${check.min} · ${check.passed?'达成':'未达成'}`;const meta=node('div',undefined,'event-meta');meta.append(node('span',condition,check.passed?'pass':'fail'));if(changes.length)meta.append(document.createTextNode('　'+changes.join('　')));body.append(meta);}else if(changes.length||entry.reason)body.append(node('div',[entry.reason,changes.join('　')].filter(Boolean).join('　'),'event-meta'));
      li.append(body);$('timeline').append(li);firstNew??=li;
    }
    if(firstNew&&$('follow').checked){const timeline=$('timeline');timeline.scrollTop+=firstNew.getBoundingClientRect().top-timeline.getBoundingClientRect().top;}
    rendered=end;
    if(finished){const text=life.summary.memoir.paragraphs.join('\n\n');if(text!==memoirText){memoirText=text;companionAccount=companionSummary.compose(life);renderCompanion(companionAccount);$('memoir').replaceChildren(...life.summary.memoir.paragraphs.map(memoirParagraph));}$('settlement').hidden=false;setText($('ending-title'),life.ending);setText($('ending-text'),life.endingText);setText($('ending-summary'),`${description.time} · ${life.summary.events}件往事 · 历练${life.summary.xp} · 亲近同伴${life.summary.companions}位 · 心愿「${goal.name}」${goal.status}`); }
  }
  $('export-memoir').onclick=async()=>{
    const current=life;if(!current?.ended||!playbackEnded())return;
    resetMemoirExport();const sequence=exportSequence,isCurrent=()=>life===current&&exportSequence===sequence;
    const description=E.describeLife(current),goal=E.goalStatus(current);
    // Snapshot settled values before any asynchronous encoding. Never read a new
    // life's values or write into its controls after a restart.
    const data={subject:current.character?current.character.name:'你的这一生',ending:current.ending,endingText:current.endingText,
      identity:[description.time,description.species,description.location,description.status].filter(Boolean).join(' · '),
      metrics:`${current.summary.events}件往事 · 历练${current.summary.xp} · 亲近同伴${current.summary.companions}位`,
      stats:E.STATS.map(k=>({label:E.LABELS[k],initial:current.allocated[k],final:current.stats[k]})),
      talents:current.talents.map(id=>T.list.find(t=>t.id===id).name),goal:goal.name+' · '+goal.status,goalDescription:goal.description,
      companion:companionAccount,paragraphs:[...current.summary.memoir.paragraphs],names:[...memoirNames]};
    $('export-memoir').disabled=true;$('export-memoir').textContent='生成中…';$('export-status').textContent='正在把这一生写成图片…';
    try{
      if(!memoirImage)throw new Error('图片组件未能加载，请刷新后重试。');
      const pages=await memoirImage.create(data,isCurrent,(index,total)=>{if(isCurrent())$('export-status').textContent=`正在生成第${index} / ${total}张图片…`;});
      if(!isCurrent())return;
      const items=pages.map((page,index)=>{
        const url=URL.createObjectURL(page.blob);imageURLs.push(url);
        const item=node('figure',undefined,'memoir-image'),preview=node('a',undefined,'memoir-image-preview'),img=node('img');
        preview.href=url;preview.target='_blank';preview.rel='noopener noreferrer';preview.setAttribute('aria-label',`预览一生总结第${index+1}张原图，在新窗口打开`);
        img.src=url;img.alt=`一生总结第${index+1} / ${pages.length}张 · ${data.subject} · ${data.ending}`;img.width=page.width;img.height=page.height;img.loading='lazy';img.decoding='async';
        img.onerror=()=>{if(isCurrent())$('export-status').textContent=`第${index+1}张图片未能显示，请重新生成图片。`;};preview.append(img);
        const caption=node('figcaption'),actions=node('div',undefined,'memoir-image-actions');
        caption.append(node('span',`第${index+1} / ${pages.length}张 · ${page.width} × ${page.height}`));
        const open=node('a','查看原图'),save=node('a','保存 PNG');
        open.href=url;open.target='_blank';open.rel='noopener noreferrer';
        save.href=url;save.download=`幻想乡一生纪-${data.subject.replace(/[\\/:*?"<>|]/g,'')}-${current.seed}-${index+1}.png`;save.target='_blank';save.rel='noopener noreferrer';
        save.onclick=()=>{if(isCurrent())$('export-status').textContent=`已向浏览器请求保存第${index+1}张 PNG。若没有出现下载，可查看原图后长按或右键保存。`;};
        actions.append(open,save);caption.append(actions);item.append(preview,caption);return item;
      });
      $('memoir-images').replaceChildren(...items);$('memoir-images').hidden=false;
      $('export-status').textContent=`已生成${pages.length}张 PNG，完整收录本卷总结。点击图片可预览原图，选择「保存 PNG」下载；手机也可在原图上长按保存。`;
    }catch(error){
      if(isCurrent()){
        for(const url of imageURLs)URL.revokeObjectURL(url);imageURLs=[];
        $('memoir-images').replaceChildren();$('memoir-images').hidden=true;
        $('export-status').textContent='图片导出未成功：'+(error.message||'浏览器无法生成图片。')+' 可再次点击「导出图片」重试。';
      }
    }finally{if(isCurrent()){$('export-memoir').disabled=false;$('export-memoir').textContent='导出图片';}}
  };
  $('start').onclick=start;$('pause').onclick=togglePause;$('restart').onclick=restart;$('again').onclick=restart;$('speed').onchange=schedule;
  $('coverage-count').textContent=`${characters.length}种特殊身份`;
  $('scope-note').textContent='收录正作、旧作、秘封及官方出版物的具名角色；同一人物的形态合并。仅被历史故事提及的神明、无名群体及封面上身份不明的人物，列入来源页的范围说明。';
  function renderRoster(){const query=$('search').value.trim().toLowerCase();const list=characters.filter(c=>[c.name,c.chronicle.anchor.location||c.location].join(' ').toLowerCase().includes(query));$('roster-list').replaceChildren(...list.map(c=>{const row=node('div',undefined,'roster-row');const link=node('a',c.name);link.href='chronicles.html#'+c.id;row.append(link,node('small',`${categoryNames[c.category]} · ${c.chronicle.anchor.location||c.location}`));return row;}));}
  $('search').oninput=renderRoster;
  refreshAllocation();newDraft();renderRoster();
  if(document.modelContext?.registerTool&&typeof AbortController!=='undefined'){
    const lifecycle=new AbortController();
    for(const tool of [
      {name:'read_life',description:'查看已显示的人生、种族、身体、属性与本步净变化、天赋、来往及最近三条事件。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>life?{name:life.character?life.character.name:'你的这一生',...visible.description,ended:visible.ended,paused,stats:{...visible.stats},lastChanges:{...visible.lastChanges},talents:[...visible.talents],relationships:visible.relationships.map(r=>({...r})),events:life.log.slice(Math.max(0,rendered-3),rendered)}:{phase:'allocation',stats:{...stats}}},
      {name:'set_life_paused',description:'暂停或继续当前人生。',inputSchema:{type:'object',properties:{paused:{type:'boolean'}},required:['paused'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(typeof input.paused!=='boolean')throw new Error('paused必须为布尔值。');if(!life||playbackEnded())throw new Error('当前没有可推进的人生。');paused=input.paused;render();schedule();return {paused};}}
    ]) Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(error=>console.error('WebMCP注册失败',error));
    addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();
