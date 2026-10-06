/* Historical files prove provenance. V23 runtime bytes define the current mechanics baseline. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';

const sha=value=>createHash('sha256').update(value).digest('hex');
const historicalHashes={
 'natural-replay-v21-audit.json':'e2dc32024283f3294eabdf3ec52a5b01be144f581bd5d06e9b0634f820b331c3',
 'career-v21.json':'9002808e26dab55907b111a3d8a63445792263ccea497cca9d281da61fafb2c7',
 'development-v21.json':'db5f3109f20d2beefc032337661bd0ef5b2c41c656d400467a17a43a1a546fa4',
 'goal-v21.json':'2dd0da567d4a5d343400817ae9d4361827bf90b6d6241e48b27c696750dbd613',
 'romance-followup-v21.json':'e363c2f3235014544918a3eb6bac380c6969f77910b1d44c435c05dcbcbf7551',
 'companion-ui-v21.json':'4f48b36cf8d273c84be841c62139bf3d3dff1591e060ea828ff39ed5970c8241'
};
const historical=new Map();
export function assertArchivedV21Fixture(name){
 assert(Object.hasOwn(historicalHashes,name),'known historical fixture: '+name);
 if(!historical.has(name)){
  const bytes=readFileSync(new URL('../fixtures/'+name,import.meta.url));
  assert.equal(sha(bytes),historicalHashes[name],name+' retains its historical bytes, outputs and source hashes');
  historical.set(name,JSON.parse(bytes));
 }
 return historical.get(name);
}
export const archivedV21Sources=assertArchivedV21Fixture('companion-ui-v21.json').sources;
const packed=readFileSync(new URL('../fixtures/prose-v23-baseline.json.gz',import.meta.url));
assert.equal(sha(packed),'c72f3570b16e8fd4222939a0957b64a9d5b0c156bb7a4c213b41ca18f182601a','unchanged archived V23 runtime');
const baseline=JSON.parse(gunzipSync(packed));
assert.equal(baseline.baselineCommit,'a6a84e4557e3b7c1d6d7c532ec5d8ed183fcffe2');
export const archivedV23Modules=baseline.modules;
let referenceRuntime;
function context(){
 if(!referenceRuntime){
  referenceRuntime=vm.createContext({});
  for(const [name,source]of Object.entries(baseline.modules))vm.runInContext(source,referenceRuntime,{filename:'V23/'+name});
 }
 return referenceRuntime;
}
// Only authored wording and derived prose are omitted. IDs, timing, resources,
// flags, relationship histories and numeric settlement values remain compared.
function mechanicalState(s){
 return JSON.parse(JSON.stringify(s,(key,value)=>{
  if(['text','freshText','endingText'].includes(key))return undefined;
  if(key==='summary')return {years:value.years,events:value.events,xp:value.xp,companions:value.companions,species:value.species,cause:value.cause,relationships:value.relationships};
  if(value instanceof Set)return {set:[...value]};
  if(value===Infinity)return {number:'Infinity'};
  if(value===-Infinity)return {number:'-Infinity'};
  return value;
 }));
}
export function replayAgainstV23(row,{stepCheck}={}){
 const input={seed:row.seed,stats:row.stats,talents:row.talents,goal:row.goal??'none',romanceWish:row.romanceWish??null};
 const ctx=context(),E=globalThis.TouhouEngine;
 const expected=vm.runInContext(`(()=>{
  const E=TouhouEngine,input=${JSON.stringify(input)},s=E.createLife(input),random=E.random(input.seed^0x9e3779b9);
  let calls=0,steps=0;while(!s.ended&&steps++<3000)E.step(s,()=>{calls++;return random();});
  if(!s.ended)throw Error('Archived V23 input did not settle');
  return {state:JSON.stringify(s,(k,v)=>v instanceof Set?[...v]:v),mechanics:JSON.stringify((${mechanicalState.toString()})(s)),calls,
   identity:JSON.stringify(TouhouConfig),probabilities:JSON.stringify(TouhouLifeConfig),goal:JSON.stringify(E.goalStatus(s)),companion:JSON.stringify(TouhouCompanionSummary.compose(s))};
 })()`,ctx);
 assert.deepEqual(globalThis.TouhouConfig,JSON.parse(expected.identity),'current identity probabilities match V23');
 assert.deepEqual(globalThis.TouhouLifeConfig,JSON.parse(expected.probabilities),'current mechanics configuration matches V23');
 const state=E.createLife(input),random=E.random(input.seed^0x9e3779b9);let rngCalls=0,steps=0;
 while(!state.ended&&steps++<3000){const from=state.log.length;E.step(state,()=>{rngCalls++;return random();});stepCheck?.(state,from);}
 assert(state.ended,'current fixed input settles');
 assert.equal(rngCalls,expected.calls,'RNG consumption matches V23 for seed '+input.seed);
 assert.deepEqual(mechanicalState(state),JSON.parse(expected.mechanics),'non-prose state matches V23 for seed '+input.seed);
 return {state,reference:JSON.parse(expected.state),referenceGoal:JSON.parse(expected.goal),referenceCompanion:JSON.parse(expected.companion),rngCalls,referenceRngCalls:expected.calls};
}
