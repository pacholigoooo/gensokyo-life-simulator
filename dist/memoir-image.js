/* Paper memoirs use only the settled game's own text and local canvas drawing. */
(() => {
  const WIDTH=1120,MAX_HEIGHT=4096,LEFT=80,CONTENT_WIDTH=WIDTH-LEFT*2,CONTENT_TOP=246,FOOTER=116;
  const PAPER='#f8f4ec',INK='#282824',RED='#992e27',MUTED='#676158',LINE='#c9beb0';
  const FONT='"Noto Serif CJK SC", "Songti SC", "SimSun", serif';
  // These are names actually used by the game's prose, not arbitrary surname suffixes.
  const aliases=Object.fromEntries(('reimu:灵梦 marisa:魔理沙 meiling:美铃 patchouli:帕秋莉 sakuya:咲夜 remilia:蕾米莉亚 flandre:芙兰朵露 letty:蕾蒂 alice:爱丽丝 lily_white:莉莉 lunasa:露娜萨 merlin:梅露兰 lyrica:莉莉卡 youmu:妖梦 yuyuko:幽幽子 ran:蓝 yukari:紫 suika:萃香 wriggle:莉格露 mystia:米斯蒂娅 keine:慧音 tewi:天为 reisen:铃仙 eirin:永琳 kaguya:辉夜 mokou:妹红 aya:文 medicine:梅蒂欣 yuuka:幽香 komachi:小町 eiki:映姬 kagerou:影狼 benben:弁弁 yatsuhashi:八桥 seija:正邪 shinmyoumaru:针妙丸 raiko:雷鼓 sumireko:堇子 doremy:哆来咪 sagume:探女 hecatia:赫卡提亚 joon:女苑 shion:紫苑 eternity:拉尔瓦 nemuno:合欢 aunn:阿吽 narumi:成美 satono:里乃 mai_teireida:舞 okina:隐岐奈 eika:璎花 urumi:润美 kutaka:久侘歌 yachie:八千慧 mayumi:磨弓 keiki:袿姬 saki:早鬼 yuma:尤魔 shizuha:静叶 minoriko:穰子 hina:雏 nitori:荷取 momiji:椛 sanae:早苗 kanako:神奈子 suwako:诹访子 iku:衣玖 tenshi:天子 yamame:山女 parsee:帕露西 yuugi:勇仪 satori:觉 rin:阿燐 utsuho:阿空 koishi:恋 nazrin:娜兹玲 kogasa:小伞 ichirin:一轮 murasa:水蜜 shou:星 byakuren:白莲 nue:鵺 hatate:果 sunny:桑尼 luna:露娜 star:斯塔 kyouko:响子 yoshika:芳香 seiga:青娥 tojiko:屠自古 futo:布都 miko:神子 mamizou:猯藏 kana:卡娜 rikako:理香子 chiyuri:千百合 yumemi:梦美 renko:莲子 maribel:梅莉 mike:三花 takane:高岭 sannyo:山如 misumaru:魅须丸 tsukasa:典 megumu:龙 chimata:千亦 momoyo:百百世 biten:美天 enoko:慧之子 chiyari:血枪 hisami:日狭美 zanmu:残无 ubame:姥芽 chimi:魑魅 nareko:驯子 yuiman:维缦 ariya:阿梨夜 nina:贝子 rinnosuke:霖之助 akyuu:阿求 toyohime:丰姬 yorihime:依姬 reisen2:二号铃仙 kasen:华扇 kosuzu:小铃 miyoi:美宵 mizuchi:瑞灵 youki:妖忌 layla:蕾拉').split(' ').map(pair=>pair.split(':')));
  function createNames(characters,extra=[]){
    const names=[];
    for(const c of characters){names.push(c.name);if(aliases[c.id])names.push(aliases[c.id]);}
    names.push(...extra);
    return [...new Set(names.filter(name=>typeof name==='string'&&name))].sort((a,b)=>b.length-a.length);
  }
  function singleName(text,index,name){
    // 雪、舞、橙等单字也有普通词义；仅在人物动作或明确来往语境里强调。
    const before=text.slice(0,index),after=text.slice(index+name.length);
    if(/^(色|红|白|花|地|台|蹈|会|落|飘|季|夜|天)/.test(after))return false;
    return /^(与你|和你|邀你|请你|向你|对你|问你|为你|替你|带你|笑着|说道|说起|点头|摇头|离去|离世|的心愿|的经历|的旧物|的来信|的手|的脸)/.test(after)||
      /(?:与|和|向|问|陪|拜访|遇见|看见|听见|想起|记得|认识|寻到|一位名叫)$/.test(before)&&/^(?:[，。；、：？！「」·\s]|$|你|她|他|在|把|将|的)/.test(after)||
      (index===0||/[「『（(]/.test(text[index-1]))&&/^(?:[」』）)·\s]|$)/.test(after);
  }
  function splitNames(value,names){
    const text=String(value),runs=[];let plain='',i=0;
    while(i<text.length){
      const match=names.find(name=>text.startsWith(name,i)&&(name.length>1||singleName(text,i,name)));
      if(match){if(plain){runs.push({text:plain,bold:false});plain='';}runs.push({text:match,bold:true});i+=match.length;}
      else{plain+=text[i];i++;}
    }
    if(plain)runs.push({text:plain,bold:false});return runs;
  }
  function appendText(parent,value,names){
    for(const run of splitNames(value,names)){
      if(run.bold){const strong=document.createElement('strong');strong.textContent=run.text;parent.append(strong);}
      else parent.append(document.createTextNode(run.text));
    }
    return parent;
  }
  function font(size,bold){return (bold?'600 ':'400 ')+size+'px '+FONT;}
  function wrap(ctx,text,names,size,width=CONTENT_WIDTH,allBold=false){
    const glyphs=splitNames(text,names).flatMap(run=>Array.from(run.text,char=>({text:char,bold:allBold||run.bold}))),lines=[];
    const widths=new Map();
    const measure=glyph=>{const key=(glyph.bold?'b':'n')+glyph.text;if(!widths.has(key)){ctx.font=font(size,glyph.bold);widths.set(key,ctx.measureText(glyph.text).width);}return widths.get(key);};
    let current=[],length=0;
    const flush=()=>{lines.push(current);current=[];length=0;};
    for(const glyph of glyphs){
      if(glyph.text==='\r')continue;
      if(glyph.text==='\n'){flush();continue;}
      const w=measure(glyph);
      if(current.length&&length+w>width){
        // Keep closing punctuation with a preceding character, and move opening
        // brackets with the following text; no glyph is thrown away at a break.
        const carry=[];
        if(/[，。！？；：、）】》」』…,.!?;:)]/.test(glyph.text)&&current.length>1)carry.unshift(current.pop());
        while(current.length>1&&/[（【《「『(]/.test(current[current.length-1].text))carry.unshift(current.pop());
        flush();current=carry;length=carry.reduce((sum,g)=>sum+measure(g),0);
      }
      current.push(glyph);length+=w;
    }
    if(current.length||!lines.length)flush();return lines;
  }
  function plan(ctx,data){
    const names=data.names||[],rows=[];
    const paragraph=(text,options={})=>{
      const size=options.size||34,height=options.height||58;
      for(const glyphs of wrap(ctx,String(text),names,size,CONTENT_WIDTH,!!options.bold))rows.push({glyphs,size,height,color:options.color||INK,kind:options.kind||'text'});
      rows.push({height:options.gap??16,kind:'gap'});
    };
    const section=text=>paragraph(text,{size:26,height:44,bold:true,color:RED,kind:'section',gap:8});
    paragraph(data.subject,{size:35,height:54,bold:true,gap:4});
    paragraph(data.ending,{size:48,height:72,bold:true,color:RED,gap:16});
    paragraph(data.endingText,{size:32,height:54,gap:20});
    paragraph(data.identity,{size:26,height:43,color:MUTED,gap:5});
    paragraph(data.metrics,{size:26,height:43,color:MUTED,gap:22});
    if(data.companion){
      const partner=data.companion;
      section(partner.title);
      paragraph(partner.name,{size:48,height:72,bold:true,color:RED,kind:'section',gap:8});
      if(partner.yearsText){paragraph(partner.yearsText,{size:34,height:56,bold:true,gap:5});paragraph(partner.periodText,{size:27,height:46,color:MUTED,gap:14});}
      if(partner.outcomeTitle)paragraph(partner.outcomeTitle,{size:32,height:52,bold:true,gap:4});
      paragraph(partner.outcomeText,{size:32,height:54,gap:18});
      if(partner.moments.length){
        section('相伴拾记');
        for(const moment of partner.moments){
          paragraph(moment.time,{size:26,height:44,color:RED,kind:'section',gap:2});
          paragraph(moment.text,{size:32,height:54,gap:18});
        }
      }
    }
    section('四属性');
    paragraph('落笔 → 结算 · 属性上限30',{size:24,height:39,color:MUTED,gap:4});
    paragraph(data.stats.map(stat=>`${stat.label} ${stat.initial} → ${stat.final}`).join('　'),{size:30,height:50,gap:18});
    section('随身天赋');paragraph(data.talents.join(' · ')||'无',{size:30,height:50,gap:18});
    section('这一生的心愿');paragraph(data.goal,{size:30,height:50,gap:4});
    paragraph(data.goalDescription,{size:27,height:46,color:MUTED,gap:24});
    section('一生总结');
    for(const text of data.paragraphs)paragraph(text);
    const pages=[];let page={rows:[],used:CONTENT_TOP};
    function finish(){page.height=Math.min(MAX_HEIGHT,Math.max(1100,Math.ceil(page.used+FOOTER)));pages.push(page);page={rows:[],used:CONTENT_TOP};}
    for(let i=0;i<rows.length;i++){
      const row=rows[i];
      if(row.kind==='gap'&&!page.rows.length)continue;
      let reserve=0;
      if(row.kind==='section')for(let j=i+1;j<rows.length;j++){reserve+=rows[j].height;if(rows[j].kind!=='gap')break;}
      if(page.rows.length&&page.used+row.height+reserve>MAX_HEIGHT-FOOTER)finish();
      if(row.kind==='gap'&&!page.rows.length)continue;
      page.rows.push({...row,y:page.used});page.used+=row.height;
    }
    if(page.rows.length)finish();return pages;
  }
  function line(ctx,x1,y1,x2,y2,color=LINE,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function draw(ctx,page,index,total){
    const height=page.height;ctx.fillStyle=PAPER;ctx.fillRect(0,0,WIDTH,height);
    ctx.strokeStyle=LINE;ctx.lineWidth=1;ctx.strokeRect(35.5,35.5,WIDTH-71,height-71);
    // A torii is drawn as a few straight strokes, without remote artwork.
    line(ctx,916,91,1038,91,RED,6);line(ctx,929,112,1025,112,RED,4);
    line(ctx,947,91,941,165,RED,5);line(ctx,1007,91,1013,165,RED,5);line(ctx,977,94,977,112,RED,3);
    ctx.fillStyle=RED;ctx.fillRect(LEFT,76,62,111);ctx.fillStyle=PAPER;ctx.font=font(34,true);ctx.textBaseline='top';ctx.fillText('一',94,84);ctx.fillText('生',94,135);
    ctx.fillStyle=INK;ctx.font=font(46,true);ctx.fillText('幻想乡 · 一生纪',168,78);
    ctx.fillStyle=MUTED;ctx.font=font(25,false);ctx.fillText(index===0?'春去秋来，故事留在纸上。':'一生总结 · 续卷',170,151);
    line(ctx,LEFT,214,WIDTH-LEFT,214,RED,2);
    for(const row of page.rows){
      if(!row.glyphs)continue;
      let x=LEFT;ctx.fillStyle=row.color;
      for(const glyph of row.glyphs){ctx.font=font(row.size,glyph.bold);ctx.fillText(glyph.text,x,row.y);x+=ctx.measureText(glyph.text).width;}
    }
    line(ctx,LEFT,height-88,WIDTH-LEFT,height-88);
    ctx.fillStyle=MUTED;ctx.font=font(21,false);ctx.fillText('东方Project同人 · 角色原作：上海爱丽丝幻乐团 / ZUN',LEFT,height-65);
    ctx.fillStyle=RED;ctx.font=font(22,true);ctx.textAlign='right';ctx.fillText(`${index+1} / ${total}`,WIDTH-LEFT,height-65);ctx.textAlign='left';
  }
  function cancelled(){const error=new Error('此卷已重开，图片生成已取消。');error.name='AbortError';return error;}
  function png(canvas){
    return new Promise((resolve,reject)=>{
      let done=false;
      const timer=setTimeout(()=>finish(null,new Error('图片编码超时，请重试。')),15000);
      function finish(blob,error){if(done)return;done=true;clearTimeout(timer);if(error)reject(error);else if(!blob||!blob.size||blob.type!=='image/png')reject(new Error('浏览器未能生成 PNG 图片，请重试。'));else resolve(blob);}
      try{
        if(typeof canvas.toBlob==='function')canvas.toBlob(blob=>finish(blob),'image/png');
        else{
          const url=canvas.toDataURL('image/png');if(!url.startsWith('data:image/png;base64,'))throw new Error('此浏览器无法编码 PNG 图片。');
          const binary=atob(url.slice(url.indexOf(',')+1)),bytes=new Uint8Array(binary.length);
          for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
          finish(new Blob([bytes],{type:'image/png'}));
        }
      }catch(error){finish(null,error);}
    });
  }
  async function create(data,isCurrent=()=>true,onProgress=()=>{}){
    if(!isCurrent())throw cancelled();
    if(!globalThis.URL?.createObjectURL||!globalThis.URL?.revokeObjectURL)throw new Error('此浏览器无法预览本地图片，请换用支持图片文件的浏览器。');
    const canvas=document.createElement('canvas');canvas.width=WIDTH;canvas.height=1;
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('此浏览器未提供画布，无法生成图片。');
    const pages=plan(ctx,data),results=[];
    try{
      for(let i=0;i<pages.length;i++){
        // Yield between pages, so reopening a life can cancel this old snapshot.
        await new Promise(resolve=>setTimeout(resolve,0));if(!isCurrent())throw cancelled();
        onProgress(i+1,pages.length);canvas.width=WIDTH;canvas.height=pages[i].height;draw(ctx,pages[i],i,pages.length);
        const blob=await png(canvas);if(!isCurrent())throw cancelled();
        results.push({blob,width:WIDTH,height:pages[i].height});
      }
      return results;
    }finally{canvas.width=1;canvas.height=1;}
  }
  globalThis.TouhouMemoirImage={createNames,splitNames,appendText,create,plan,width:WIDTH,maxHeight:MAX_HEIGHT};
})();
