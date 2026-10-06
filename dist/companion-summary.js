/* Both settlement outputs read this account; it never changes a life's state. */
(() => {
  const number=value=>Number(value.toFixed(1));
  function compose(s){
    const id=s.firstPartnerId;
    if(!id)return {id:null,title:'此生情缘',name:s.named?'本卷未记情缘':'未曾结缘',yearsText:'',periodText:'',outcomeTitle:'',outcomeText:s.named?'本卷没有相恋或婚姻的记录。':'这一生没有确立恋人。',moments:[]};
    const p=s.people[id],r=s.relations[id],local=id==='local:spouse',dream=r?.medium==='dream';
    const name=local?'村民伴侣':p.name,begin=s.firstLoveAt;
    const log=s.log.map((e,index)=>({...e,index}));
    const intro=log.find(e=>local?['common:local-meet','common:local-young-meet'].includes(e.id):e.id==='relation:'+id+':intro');
    const love=log.find(e=>e.age===begin&&(local?['common:courtship','common:local-young-confession'].includes(e.id):e.relationship?.id===id&&e.relationship.to==='lover'&&e.relationship.from!=='lover'));
    const wedding=log.find(e=>e.id===(local?'common:marry':'relation:'+id+':marriage:wedding'));
    const unwed=log.find(e=>e.id===(local?'common:unwed-promise':'relation:'+id+':marriage:unwed'));
    if(!love)throw Error('伴侣回顾缺少实际相许记录：'+id);
    // Stop at recorded separation, not the later age at which this life ends.
    // Akyuu's return starts a new interval; time apart never becomes shared years.
    const limit=s.afterlife?s.afterlife.since:s.age,intervals=[];
    const farewells=log.filter(e=>e.id==='farewell-'+id);
    let since=begin,lastStop=null;
    for(const e of log){
      if(e.age<begin||e.age>limit)continue;
      if(e.id==='farewell-'+id||e.relationship?.id===id&&e.relationship.from==='lover'&&e.relationship.to!=='lover'){
        if(since!==null){
          // Akyuu can die between yearly entries. Her recorded deadline survives
          // the first return separately from the final death, so neither gap is lost.
          const at=id==='akyuu'&&e.id==='farewell-'+id?(e===farewells[0]?s.akyuuReturn?.deathAt??p.deadAt:p.deadAt):e.age;
          if(!Number.isFinite(at)||at<since)throw Error('伴侣回顾的告别时点不完整：'+id);
          intervals.push([since,at]);since=null;lastStop=e;
        }
      }else if(id==='akyuu'&&e.id==='akyuu-return:returned'&&since===null){since=e.age;lastStop=null;}
    }
    if(since!==null)intervals.push([since,limit]);
    const years=number(intervals.reduce((sum,[a,b])=>sum+b-a,0));
    const marriedYears=wedding?number(intervals.reduce((sum,[a,b])=>sum+Math.max(0,b-Math.max(a,wedding.age)),0)):null;
    const until=intervals[intervals.length-1][1];
    const yearsText=(dream?'梦中相伴 ':'相伴 ')+years+' 年'+(wedding?' · '+(dream?'梦中结缘 ':'婚后 ')+marriedYears+' 年':'');
    const periodText=number(begin)+'岁相许，记至'+number(until)+'岁'+(intervals.length>1?'；重逢前的离别时日未计入相伴。':'。');
    let outcomeTitle,outcomeText;
    if(lastStop){
      const farewell=lastStop.id==='farewell-'+id;
      outcomeTitle=farewell?(dream?'梦路渐远':'伴侣先行离世'):'相恋止于往年';
      outcomeText=lastStop.text;
    }else if(s.afterlife){
      const laterFarewell=log.filter(e=>e.id==='farewell-'+id&&e.age>limit).at(-1);
      outcomeTitle=laterFarewell?(dream?'生死相隔 · 梦路渐远':'生死相隔 · 伴侣已故'):'生死相隔';
      outcomeText='你在'+number(limit)+'岁告别生前的生活。'+(laterFarewell?laterFarewell.time+'，'+laterFarewell.text:'这段相伴留在旧日记忆里。');
    }
    else if(s.deathCause==='chapter'){outcomeTitle=wedding?'仍在相守':'相恋未终';outcomeText='此卷暂时合上，你们的'+(dream?'梦中相伴':'相伴')+'仍在继续。';}
    else{outcomeTitle='相伴至此生终点';outcomeText=dream?'你的人生走到终点，这段梦中相恋随此卷收束。':'你先走到了人生终点，此卷结束时，'+name+'仍然在世。';}
    const selected=[],texts=new Set();
    function keep(e){if(e&&!texts.has(e.text)){selected.push(e);texts.add(e.text);}}
    keep(intro);keep(love);keep(wedding);keep(unwed);
    const reunion=id==='akyuu'?log.find(e=>e.id==='akyuu-return:returned'&&e.age<=limit):null;
    keep(reunion);
    const shared=log.filter(e=>{
      if(!intervals.some(([a,b])=>e.age>=a&&e.age<=b)||e.id==='ending'||e.id==='farewell-'+id||e.id.startsWith('remembrance:'))return false;
      return local?/^common:(?:local-date-|spouse-)/.test(e.id)||e.id.startsWith('local:marriage:'):
        e.id.startsWith('relation:'+id+':')||e.circleOf===id||e.with?.includes(id)||e.id.startsWith('guidance:'+id+':')||id==='akyuu'&&e.id==='akyuu-return:aftercare';
    });
    const outside=log.find(e=>e.id==='legendary:outside-return'&&s.outsideJourney?.partnerId===id);
    keep(outside);
    for(const e of shared.reverse()){if(selected.length>=7)break;keep(e);}
    const moments=selected.sort((a,b)=>a.index-b.index).map(e=>({id:e.id,index:e.index,age:e.age,time:e.time,text:e.text}));
    return {id,title:'与你相伴',name,years,marriedYears,yearsText,periodText,outcomeTitle,outcomeText,moments};
  }
  globalThis.TouhouCompanionSummary={compose};
})();
