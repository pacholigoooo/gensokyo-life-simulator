import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';

export async function buildLongYears(characters){
 const root=new URL('../',import.meta.url),names=['long-years','long-partners','long-talents'];
 const divine=JSON.parse(await readFile(new URL('data/divine-lives.json',root),'utf8'));
 const contacts=JSON.parse(await readFile(new URL('data/divine-contacts.json',root),'utf8'));
 const misfortune=JSON.parse(await readFile(new URL('data/misfortune-contact.json',root),'utf8'));
 assert.deepEqual(contacts.characters.map(c=>c.id),['kanako','suwako','minoriko','shizuha']);assert.equal(misfortune.id,'hina');
 const companyTexts=new Set();let companyStages=0;
 function companyText(text,label){assert(typeof text==='string'&&text.length>=15&&text.length<=120&&!companyTexts.has(text),label+' distinct body');companyTexts.add(text);}
 for(const c of [...contacts.characters,misfortune]){
  assert(characters.some(p=>p.id===c.id),c.id+' known company');assert(c.title);
  for(const text of [c.opening.new,c.opening.known,c.interrupted,c.partnerInterrupted])companyText(text,c.id);
  assert.equal(c.memories.length,3);for(const text of c.memories)companyText(text,c.id+' memory');
  for(const kind of ['peer','partner']){
   assert.equal(c[kind].length,4);const flags=new Set(),keys=new Set();
   for(const [i,stage]of c[kind].entries()){
    companyStages++;assert(/^[a-z][a-z0-9-]+$/.test(stage.key)&&!keys.has(stage.key),c.id+' stage key');keys.add(stage.key);
    assert(Number.isInteger(stage.delay)&&stage.delay>=4&&stage.delay<=16,c.id+' cooldown');
    if(i===0)assert.equal(stage.delay,kind==='peer'?4:6);
    for(const [key,value]of Object.entries(stage.min))assert(['insight','bond'].includes(key)&&Number.isInteger(value)&&value>=10&&value<=18,c.id+' company threshold');
    for(const f of stage.requires||[])assert(flags.has(f),c.id+' reachable prior agreement');
    if(i===3)assert(stage.requires?.length,c.id+' actual follow-through');
    for(const choice of [stage.pass,stage.fail]){
     assert(Object.keys(choice).every(k=>['text','set'].includes(k)),c.id+' no numeric social reward');companyText(choice.text,c.id+' '+kind);
     for(const f of choice.set||[])assert(typeof f==='string'&&/^[a-z][a-z0-9-]+$/.test(f),c.id+' local flag');
    }
    for(const f of stage.pass.set||[])flags.add(f);
   }
  }
 }
 divine.contacts=contacts;
 assert.deepEqual(divine.routes.map(r=>r.id),['water','pilgrimage','renewal']);
 const divineTexts=new Set();
 for(const route of divine.routes){
  assert.equal(route.stages.length,5,route.id+' stages');
  assert.equal(route.ending.id,'divine-'+route.id);assert(route.title&&route.ending.title&&route.ending.text);
  assert.equal(new Set(route.stages.map(s=>s.key)).size,5,route.id+' distinct stages');
  const years=route.stages.reduce((n,s)=>n+s.delay,0);assert(years>=52&&years<=64,route.id+' duration');
  let earned=0;
  for(const [i,stage]of route.stages.entries()){
   assert(Number.isInteger(stage.delay)&&(i===0?stage.delay===4:stage.delay>=8&&stage.delay<=16),route.id+' delay');
   assert(Number.isInteger(stage.meritRequired||0)&&(stage.meritRequired||0)<=earned,route.id+' reachable merit');
   for(const [key,value]of Object.entries(stage.min))assert(['insight','bond'].includes(key)&&Number.isInteger(value)&&value>=10&&value<=18,route.id+' threshold');
   for(const choice of [stage.pass,stage.fail]){
    assert(typeof choice.text==='string'&&choice.text.length>=20&&choice.text.length<=110&&!divineTexts.has(choice.text),route.id+' body');divineTexts.add(choice.text);
    assert(Number.isFinite(choice.faith)&&Math.abs(choice.faith)<=2&&Number.isInteger(choice.devotees)&&Math.abs(choice.devotees)<=1,route.id+' finite faith');
    assert([0,1].includes(choice.merit),route.id+' merit');if(choice.ability)assert(typeof choice.ability==='string'&&choice.ability.length<=12);
   }
   assert.equal(stage.fail.merit,0);earned+=stage.pass.merit;
  }
  assert(earned>=3,route.id+' attainable ending');
 }
 const afterlife=JSON.parse(await readFile(new URL('data/afterlife-years.json',root),'utf8'));
 const afterlifeKeys={ghost:['drift','song','cold','dawn','mood','memory'],vengeful:['shape','haunt','ward','offering','testimony','restraint'],kami:['festival','blessing','oracle','neglect','roof','request']};
 const bodies=[];
 for(const [kind,keys]of Object.entries(afterlifeKeys)){
  assert.deepEqual(Object.keys(afterlife[kind]).sort(),[...keys].sort(),kind+' afterlife keys');
  for(const key of keys){const variants=afterlife[kind][key];assert.equal(variants.length,3,kind+'/'+key);for(const text of variants){assert(typeof text==='string'&&text.length>=20&&text.length<=100,kind+'/'+key+' text');bodies.push(text);}}
 }
 assert.equal(new Set(bodies).size,54,'Duplicate afterlife variants');
 const chains=(await Promise.all(names.map(async name=>JSON.parse(await readFile(new URL('data/'+name+'.json',root),'utf8'))))).flat();
 const ids=new Set(),texts=new Set(),stats=['health','insight','bond','fortune'];
 const species=['magician','hermit','shikaisen','youkai','vampire','ghost','vengeful','kami'];
 let stages=0,branches=0;
 for(const c of chains){
  assert(/^[a-z][a-z0-9_-]+$/.test(c.id)&&!ids.has(c.id),'Duplicate or invalid long-years chain: '+c.id);ids.add(c.id);
  assert(['species','career','place','experience','partner','talent'].includes(c.group),c.id+' group');
  assert(c.title&&c.stages.length>=3&&c.stages.length<=5,c.id+' stages');
  for(const kind of c.species||[])assert(species.includes(kind),c.id+' species');
  for(const id of c.partnerIds||[])assert(characters.some(p=>p.id===id&&p.body==='humanoid'&&!p.animalMind),c.id+' partner');
  if(c.group==='partner'&&!c.bereaved)assert(typeof c.interruptedText==='string'&&c.interruptedText.length>10,c.id+' interruption');
  const produced=new Set();
  for(const [index,stage]of c.stages.entries()){
   stages++;assert(Number.isInteger(stage.delay)&&(index===0?stage.delay===0:stage.delay>=4&&stage.delay<=30),c.id+' delay');
   if(stage.branches){assert(stage.branches.length>=2,c.id+' branches');assert.deepEqual(stage.branches.at(-1).when,{},c.id+' final branch');}
   const choices=stage.branches||[stage];branches+=choices.length;
   for(const b of choices){
    assert(typeof b.text==='string'&&b.text.length>=10&&b.text.length<=150,c.id+' text');
    assert(!texts.has(b.text),c.id+' duplicate body');texts.add(b.text);
    for(const [k,v]of Object.entries(b.effects||{}))assert(stats.includes(k)&&Number.isInteger(v)&&Math.abs(v)<=2,c.id+' effects');
    if(b.xp!==undefined)assert(Number.isInteger(b.xp)&&b.xp>=0&&b.xp<=2,c.id+' xp');
    if(b.wear!==undefined)assert(Number.isFinite(b.wear)&&Math.abs(b.wear)<=1,c.id+' wear');
    for(const [k,v]of Object.entries(b.resources||{})){
     assert(['faith','cohesion','resentment','practice','projects','apprentices'].includes(k)&&Number.isFinite(v)&&Math.abs(v)<=2,c.id+' resources');
     if(k==='faith')assert(c.species?.every(k=>k==='kami'),c.id+' faith requires kami');
     else if(['cohesion','resentment'].includes(k))assert(c.species?.every(s=>k==='resentment'?s==='vengeful':['ghost','vengeful'].includes(s)),c.id+' spiritual resource');
     else assert(c.group==='career'&&c.careers?.length,c.id+' career resource');
    }
    for(const k of Object.keys(b.when||{}))assert(['min','max','flags','without'].includes(k),c.id+' condition');
    for(const f of [...b.when?.flags||[],...b.when?.without||[]])assert(produced.has(f),c.id+' missing prior producer '+f);
    for(const key of ['min','max'])for(const [k,v]of Object.entries(b.when?.[key]||{}))assert(stats.includes(k)&&Number.isInteger(v)&&v>=0&&v<=30,c.id+' threshold');
    for(const f of [...b.set||[],...b.clear||[]])assert(f.startsWith('long:'+c.id+':'),c.id+' flag namespace');
   }
   for(const b of choices)for(const f of b.set||[])produced.add(f);
  }
 }
 await writeFile(new URL('dist/long-years-data.js',root),'// Generated from data/long-*.json, afterlife-years.json and divine*.json; Hina has a separate misfortune-contact.json.\nglobalThis.TouhouLongYearsData = '+JSON.stringify(chains)+';\nglobalThis.TouhouAfterlifeYears = '+JSON.stringify(afterlife)+';\nglobalThis.TouhouDivineLives = '+JSON.stringify(divine)+';\nglobalThis.TouhouMisfortuneContact = '+JSON.stringify(misfortune)+';\n');
 return {chains:chains.length,stages,branches,afterlifeVariants:bodies.length,partnerCharacters:new Set(chains.flatMap(c=>c.partnerIds||[])).size,divineRoutes:divine.routes.length,divineStages:15,divineBodies:divineTexts.size,faithCompany:contacts.characters.length,misfortuneCompany:1,companyStages,companyBodies:companyTexts.size};
}
