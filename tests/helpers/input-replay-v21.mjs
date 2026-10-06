import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {archivedV21Sources} from './versioned-replay.mjs';

const sha=value=>createHash('sha256').update(value).digest('hex');
export function assertArchivedV21Source(file,expected){
 assert.equal(expected,archivedV21Sources[file],file+' original V21 source fingerprint (historical provenance)');
}
const inputOf=w=>({seed:w.seed,stats:w.stats,talents:w.talents,draft:w.draft,goal:w.goal??'none',romanceWish:w.romanceWish??null});
export function assertInputMigration(row,original){
 const actual=inputOf(row.input??row),prior=inputOf(original.input??original),m=row.migration;assert(m,'explicit input migration');
 assert.deepEqual(m.original,prior,'migration retains the exact archived input');
 for(const key of ['seed','stats','goal','romanceWish'])assert.deepEqual(actual[key],prior[key],'fixed archived '+key);
 const T=globalThis.TouhouTalents,draft=T.draw(globalThis.TouhouEngine.random(actual.seed^0x35dab));assert.deepEqual(actual.draft,draft);
 const retained=prior.talents.filter(id=>draft.includes(id)),removed=prior.talents.filter(id=>!draft.includes(id)),selected=retained.slice(),added=[];
 for(const id of draft){if(selected.length===3)break;if(!selected.includes(id)&&!T.conflict(id,selected)){selected.push(id);added.push(id);}}
 let slot=0;assert.deepEqual(actual.talents,prior.talents.map(id=>draft.includes(id)?id:added[slot++]),'earliest lawful completion retains every available old talent');
 assert.deepEqual(m.retainedTalents,retained);assert.deepEqual(m.removedTalents,removed);assert.deepEqual(m.addedTalents,added);
 assert.equal(m.draftChanged,JSON.stringify(prior.draft)!==JSON.stringify(draft));assert.equal(m.talentsChanged,removed.length>0);
 assert.equal(m.sameGameplayInput,JSON.stringify(prior.talents)===JSON.stringify(actual.talents));
 T.validate(actual.talents);assert(actual.talents.every(id=>draft.includes(id)));assert.equal(draft.length,10);
}
export function assertMigrationOrigin(row){
 const [file,pointer]=row.migration.origin.split('#');assert(file&&pointer,'archived file and record pointer');
 const archive=JSON.parse(readFileSync(new URL('../../'+file,import.meta.url)));
 const original=pointer.split('.').reduce((value,key)=>value[key],archive);
 assert(original,'migration origin exists');assertInputMigration(row,original);
}
let historicalTalents;
export function assertHistoricalDraft(row,expectedSourceHash){
 if(!historicalTalents){
  const proof=JSON.parse(readFileSync(new URL('../fixtures/natural-replay-v21-audit.json',import.meta.url))).historicalTalents;
  assert.equal(proof.path,'dist/talents.js');assert.equal(sha(proof.source),proof.sha256);
  const context={};runInNewContext(proof.source,context);historicalTalents={proof,talents:context.TouhouTalents};
 }
 assert.equal(historicalTalents.proof.sha256,expectedSourceHash,'original archived talent module');
 let x=(row.seed^0x35dab)>>>0;
 const rng=()=>{x+=0x6D2B79F5;let t=Math.imul(x^x>>>15,1|x);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};
 assert.deepEqual(Array.from(historicalTalents.talents.draw(rng)),row.draft,'actual archived first draft uses its original module');
 historicalTalents.talents.validate(row.talents);
}
