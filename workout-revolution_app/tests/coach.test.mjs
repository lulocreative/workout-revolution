import test from 'node:test';import assert from 'node:assert/strict';
import {recommend,readinessDecision,comparableHistory,actualSets,buildSummary,osloToday,sessionsInDays} from '../lib/coach.js';
import {HISTORY,PROGRAM} from '../data/seed.js';
const exercise={id:'test',machineId:'machine-a',increment:2.5,sets:[{weight:20,repMin:8,repMax:10,rir:2,rest:90},{weight:20,repMin:8,repMax:10,rir:2,rest:90}]};
const session=(sets,machineId='machine-a',source='recorded')=>[{id:'test-log',date:'2026-11-19',source,exercises:[{exerciseId:'test',machineId,plannedSets:2,sets}]}];
test('no actual baseline does not invent progress',()=>{assert.equal(recommend(exercise,[]).action,'baseline')});
test('same machine full top-of-range enables smallest increment',()=>{const r=recommend(exercise,session([{weight:20,reps:10,rir:2},{weight:20,reps:10,rir:1}]));assert.equal(r.action,'increase');assert.equal(r.sets[0].weight,22.5)});
test('just one top set is insufficient evidence',()=>{const r=recommend(exercise,session([{weight:20,reps:10,rir:2}], 'machine-a','historical-partial'));assert.equal(r.action,'reps');assert.equal(r.sets[0].weight,20)});
test('different machine is not compared',()=>{assert.equal(recommend(exercise,session([{weight:30,reps:10,rir:2},{weight:30,reps:10,rir:2}], 'machine-b')).action,'baseline')});
test('symptom overrides progression',()=>{const history=session([{weight:20,reps:10,rir:2,dizziness:true},{weight:20,reps:10,rir:1}]);assert.equal(recommend(exercise,history).action,'review');assert.equal(recommend(exercise,history,{readiness:{dizzy:true}}).action,'stop')});
test('missing RIR does not count as confirmed readiness to increase',()=>{const r=recommend(exercise,session([{weight:20,reps:10,rir:null},{weight:20,reps:10,rir:null}]));assert.equal(r.action,'reps')});
test('unknown sleep does not force modified plan',()=>{assert.equal(readinessDecision({energy:7,sleepHours:null,dizzy:false,pain:false,faint:false}).level,'ready')});
test('low sleep reduces readiness',()=>{assert.equal(readinessDecision({energy:8,sleepHours:4}).level,'modified')});
test('active dizziness blocks session',()=>{assert.equal(readinessDecision({energy:8,sleepHours:8,dizzy:true}).level,'stop')});
test('historical leg press 250 by 5 is two confirmed sets not a six-rep performance',()=>{const hist=HISTORY.find(x=>x.date==='2026-11-18');const p=hist.exercises.find(x=>x.exerciseId==='leg-press');assert.equal(actualSets(p.sets).length,2);assert.deepEqual(p.sets.map(x=>x.reps),[5,5])});
test('lying curl and seated extension are distinct IDs',()=>{const p=PROGRAM.legs.exercises;const a=p.find(x=>x.id==='lying-curl');const b=p.find(x=>x.id==='leg-extension');assert.notEqual(a.machineId,b.machineId)});
test('confirmed session summary counts actual only',()=>{const x=buildSummary({exercises:[{exerciseId:'test',sets:[{weight:20,reps:10},{weight:20,reps:null}]}]});assert.equal(x.sets,1);assert.equal(x.volume,200)});
test('Oslo date reflects local time rather than UTC date',()=>{assert.equal(osloToday(new Date('2026-11-22T23:30:00Z')),'2026-11-23')});
test('three complete comparable stalled sessions trigger review, not a novelty swap',()=>{
 const h=['2026-11-09','2026-11-13','2026-11-17'].map((date,i)=>({id:String(i),date,source:'recorded',exercises:[{exerciseId:'test',machineId:'machine-a',plannedSets:2,sets:[{weight:20,reps:8,rir:2},{weight:20,reps:8,rir:2}]}]}));
 const r=recommend(exercise,h);assert.equal(r.action,'plateau');assert.equal(r.sets[0].weight,20)
});
