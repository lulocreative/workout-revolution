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
import {TECHNIQUE,isSafeVideoUrl} from '../data/technique.js';
test('every programmed exercise has a technique guide',()=>{for(const p of Object.values(PROGRAM))for(const e of [...p.exercises,...(p.bonus||[])]){const t=TECHNIQUE[e.id];assert.ok(t,`missing guide: ${e.id}`);for(const k of ['setup','steps','mistakes'])assert.ok(t[k].length>0,`${e.id}.${k}`);assert.ok(t.breathing&&t.video,e.id)}});
test('only https video links are accepted',()=>{assert.equal(isSafeVideoUrl('https://youtu.be/x'),true);assert.equal(isSafeVideoUrl('javascript:alert(1)'),false);assert.equal(isSafeVideoUrl('http://x.com'),false)});
import {parseProposal,validateProposal,buildSystemPrompt} from '../lib/ai.js';
test('coach proposal is parsed out of the reply text',()=>{const r=parseProposal('Add a set.\n```proposal\n{"workout":"push","exerciseId":"flat-db","sets":3,"reason":"Top of range for 3 sessions"}\n```');assert.equal(r.text,'Add a set.');assert.equal(r.proposal.exerciseId,'flat-db')});
test('reply without proposal or with broken JSON yields no proposal',()=>{assert.equal(parseProposal('Just advice').proposal,null);assert.equal(parseProposal('x ```proposal\n{bad json}\n```').proposal,null)});
test('coach proposals are validated against the real program',()=>{const ok=validateProposal({workout:'push',exerciseId:'flat-db',sets:3,reason:'Cleared the rep range twice'},PROGRAM);assert.equal(ok.ok,true);assert.equal(ok.oldCount,2);assert.equal(ok.newCount,3);
 assert.equal(validateProposal({workout:'push',exerciseId:'lat-pd',sets:3,reason:'wrong day for this lift'},PROGRAM).ok,false);
 assert.equal(validateProposal({workout:'push',exerciseId:'flat-db',sets:9,reason:'way too many sets here'},PROGRAM).ok,false);
 assert.equal(validateProposal({workout:'push',exerciseId:'flat-db',sets:3,reason:'meh'},PROGRAM).ok,false);
 assert.equal(validateProposal({workout:'push',exerciseId:'flat-db',sets:2,reason:'same as current count'},PROGRAM).ok,false)});
test('system prompt carries the safety rules and the data',()=>{const p=buildSystemPrompt({todayOslo:'2026-11-23'});assert.match(p,/Romanian deadlifts/);assert.match(p,/dizziness/);assert.match(p,/2026-11-23/)});
import {nextWorkout} from '../lib/coach.js';
test('rotation is pull -> legs -> push and starts with pull',()=>{const h=t=>[{date:'2026-11-20',type:t}];assert.equal(nextWorkout([]),'pull');assert.equal(nextWorkout(h('pull')),'legs');assert.equal(nextWorkout(h('legs')),'push');assert.equal(nextWorkout(h('push')),'pull')});
test('optional focus day does not reset the rotation',()=>{assert.equal(nextWorkout([{date:'2026-11-18',type:'pull'},{date:'2026-11-20',type:'focus'}]),'legs')});
import {youtubeId} from '../data/technique.js';
test('YouTube links of every common shape resolve to a video id',()=>{for(const u of ['https://www.youtube.com/watch?v=hChjZQhX1Ls','https://youtu.be/hChjZQhX1Ls?t=30','https://m.youtube.com/watch?v=hChjZQhX1Ls&list=x','https://www.youtube.com/shorts/hChjZQhX1Ls','https://www.youtube.com/embed/hChjZQhX1Ls'])assert.equal(youtubeId(u),'hChjZQhX1Ls',u);for(const u of ['https://vimeo.com/123','not a url','https://youtube.com/watch?v=bad"id'])assert.equal(youtubeId(u),null,u)});
test('every exercise has an embeddable default form video',()=>{for(const [id,t] of Object.entries(TECHNIQUE))assert.match(t.videoId||'',/^[A-Za-z0-9_-]{11}$/,id)});
import {sessionsThisWeek} from '../lib/coach.js';
test('"this week" counts Monday to Sunday, not the last 7 days',()=>{const h=['2026-11-17','2026-11-18','2026-11-20'].map(date=>({date}));const mon=new Date('2026-11-23T10:00:00Z');assert.equal(sessionsThisWeek(h,mon),0);assert.equal(sessionsThisWeek([...h,{date:'2026-11-23'}],mon),1);assert.equal(sessionsThisWeek(h,new Date('2026-11-22T10:00:00Z')),3)});
import {warmupSets,withWarmups} from '../lib/coach.js';
test('warm-ups ramp to ~50/70/85% rounded down to the machine step',()=>{assert.deepEqual(warmupSets(22.5,2.5),[{weight:10,reps:10},{weight:15,reps:5},{weight:17.5,reps:3}]);assert.deepEqual(warmupSets(220,10),[{weight:110,reps:10},{weight:150,reps:5},{weight:180,reps:3}]);assert.deepEqual(warmupSets(0,2.5),[])});
test('only the first big lift of each muscle group gets warm-ups',()=>{const ex=(id,groups,w)=>({id,groups,increment:2.5,targetSets:[{weight:w}]});const r=withWarmups([ex('incline-db','chest',20),ex('cable-fly','chest',10),ex('flat-db','chest',17.5),ex('lateral-cable','shoulders',4.5)]);assert.equal(r[0].warmups.length,3);assert.equal(r[1].warmups.length,0);assert.equal(r[2].warmups.length,0);assert.equal(r[3].warmups.length,0)});
test('warm-ups never count as working sets',()=>{const s={exercises:[{exerciseId:'x',warmups:[{weight:10,reps:10}],sets:[{weight:20,reps:8}]}]};assert.equal(buildSummary(s).sets,1)});
import {plannedWorkout} from '../lib/coach.js';
test('weekly plan: Mon Pull, Tue Push, Thu Legs, Sat Chest + Arms',()=>{const at=d=>new Date(`${d}T09:00:00Z`);
 assert.equal(plannedWorkout([],at('2026-11-23')).type,'pull');   // Monday
 assert.equal(plannedWorkout([],at('2026-11-24')).type,'push');   // Tuesday
 const wed=plannedWorkout([],at('2026-11-25'));assert.equal(wed.type,'legs');assert.equal(wed.restToday,true);assert.equal(wed.when,'tomorrow');
 assert.equal(plannedWorkout([],at('2026-11-28')).type,'focus');  // Saturday
 assert.equal(plannedWorkout([],at('2026-11-29')).type,'pull');   // Sunday -> Monday
 assert.equal(plannedWorkout([{date:'2026-11-24',type:'push'}],at('2026-11-24')).type,'legs')}); // Tuesday done -> Thursday
import {areaVolume} from '../lib/coach.js';
test('focus areas: planned weekly sets from the plan, done = sets logged since Monday',()=>{const v=areaVolume(PROGRAM,['pull','push','legs','focus'],[{date:'2026-11-23',exercises:[{exerciseId:'lat-pd',sets:[{weight:60,reps:10},{weight:60,reps:10}]},{exerciseId:'hammer-db',sets:[{weight:14,reps:10}]}]},{date:'2026-11-20',exercises:[{exerciseId:'incline-db',sets:[{weight:22.5,reps:8}]}]}],new Date('2026-11-25T10:00:00Z'));const by=Object.fromEntries(v.map(a=>[a.key,a]));
 assert.equal(by.chest.planned,10);assert.equal(by.arms.planned,12);assert.equal(by.back.planned,11);assert.equal(by.legs.planned,12);
 assert.equal(by.back.done,2);assert.equal(by.arms.done,1);assert.equal(by.chest.done,0);assert.equal(by.legs.role,'Priority')});

test('weights accept decimal comma and dot; junk is unknown, not zero', async () => {
  const { toNumber } = await import('../lib/coach.js');
  assert.equal(toNumber('22,5'), 22.5); assert.equal(toNumber('22.5'), 22.5); assert.equal(toNumber(' 47,25 '), 47.25);
  assert.equal(toNumber(''), null); assert.equal(toNumber('abc'), null); assert.equal(toNumber(0), 0);
});
