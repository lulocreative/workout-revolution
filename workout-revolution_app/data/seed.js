// Current program is a carefully labelled PROPOSAL, updated from newer reports.
// Historical imports include only confirmed actuals; missing values remain null.
const set=(weight,repMin,repMax,rir=2,rest=90)=>({weight,repMin,repMax,rir,rest});
const ex=(id,name,machineId,machine,unit,increment,sets,cue,why,groups,flags={})=>({id,name,machineId,machine,unit,increment,sets,cue,why,groups,...flags});
export const PROGRAM = {
  push: {label:'Push',short:'Chest / delts / triceps',duration:'60–75 min',accent:'CHEST PRIORITY',exercises:[
    ex('incline-db','Incline dumbbell press','db-bench-30','Adjustable bench · 25–30°','per hand',2.5,[set(20,8,10,2,150),set(22.5,8,10,2,150),set(22.5,8,10,1,180)],'Brace shoulders, wrists stacked; controlled lowering. Exhale on press.','22.5 kg × 8 confirmed twice on 20 Nov. Target 9 reps before adding load.','chest'),
    ex('cable-fly','High-to-low cable fly','dual-cable-high','Dual adjustable cables · high-to-low','per side',2,[set(10,12,15,3,90),set(10,12,15,2,90),set(10,12,15,2,90)],'Hands meet near lower chest. Avoid shrugging or dragging to thighs.','Front-shoulder fatigue reported 20 Nov; use lighter load and stop for pain.','chest',{caution:'Front shoulder fatigue reported during this exercise.'}),
    ex('flat-db','Flat dumbbell press','db-bench-flat','Flat bench · dumbbells','per hand',2.5,[set(17.5,8,10,2,150),set(17.5,8,10,2,150)],'Shoulder blades steady, elbows 30–60° from torso.','Two sets after substantial incline and fly work. Add a third only if performance/recovery justify it.','chest'),
    ex('lateral-cable','Cable lateral raise','single-cable','Single cable · side delts','per arm',0.5,[set(4.5,12,15,2,75),set(4.5,12,15,2,75),set(4.5,12,15,1,75)],'Raise to shoulder height without shrugging.','Three sets kept intentionally. You enjoy this exercise and it serves your side delts.','shoulders'),
    ex('v-pushdown','V-handle pushdown','v-cable','High cable · V attachment','stack total',1.25,[set(25,10,12,2,90),set(28.75,10,12,2,90),set(28.75,10,12,1,90)],'Elbows pinned to sides; control the return.','Last confirmed top: 28.74 kg × 10 @ RIR 1 on 14 Nov.','triceps'),
    ex('oh-triceps','Overhead cable triceps extension','rope-cable','High cable · rope · facing away','stack total',2,[set(16,10,12,2,90),set(16,10,12,2,90)],'Elbows steady; hands come closer behind head, separate gently on extension.','Keep long-head triceps work, avoid heavy grinders.','triceps'),
  ],bonus:[ex('ez-curl','Cable EZ-bar curl (bonus)','ez-cable','Low cable · EZ attachment','stack total',2.5,[set(40,10,12,2,90),set(40,10,12,2,90)],'Stand tall. Exhale on each curl; avoid holding breath.','Optional second weekly biceps stimulus only when recovered from pull.','biceps')]},
  pull: {label:'Pull',short:'Back / biceps / traps',duration:'65–80 min',accent:'ARMS PRIORITY',exercises:[
    ex('lat-pd','Lat pulldown','lat-new','New lat pulldown · 5 kg increments','stack total',5,[set(65,8,10,3,150),set(70,8,10,2,150),set(75,6,8,2,180)],'Pull elbows down toward ribs; avoid leaning back excessively.','75 kg top load reported 17 Nov; rep count not verified.','back'),
    ex('seated-row','Seated cable row','cable-row','Seated cable row · neutral handle','stack total',5,[set(75,8,10,2,120),set(80,8,10,2,150),set(80,8,10,2,150)],'Keep chest lifted; avoid throwing torso backward.','80 kg × 8 confirmed 17 Nov.','back'),
    ex('reverse-pec','Reverse pec deck','reverse-pec','Reverse pec deck · rear delts','stack total',5,[set(35,10,12,2,90),set(40,10,12,2,90),set(40,10,12,2,90)],'Open elbows outward under control, do not shrug.','Maintain rear-delt work from pull sessions.','shoulders'),
    ex('smith-shrug','Smith machine shrugs','smith-shrug','Smith · standard non-elastic counterbalanced variant','per side',2.5,[set(20,10,12,2,120),set(20,10,12,2,120),set(20,10,12,2,120)],'Shrug upward and slightly back, pause briefly. Do not roll shoulders.','User specifically wants direct traps. Load is provisional until confirmed on the exact machine.','traps',{provisional:true}),
    ex('incline-curl','Incline DB curl','incline-curl-bench','Adjustable bench · arms slightly behind torso','per hand',2,[set(10,10,12,2,90),set(10,10,12,2,90)],'Keep upper arms behind torso; resist swinging.','Trial introduced to compare arm positions; not yet a confirmed personal baseline.','biceps',{provisional:true}),
    ex('preacher-db','Preacher dumbbell curl','preacher-db-bench','Supported upper arm on preacher / incline bench','per hand',2,[set(8,10,12,2,90),set(8,10,12,2,90)],'Upper arm supported, lower slowly, avoid fully locking elbows.','Trial introduced; start conservative.','biceps',{provisional:true}),
    ex('hammer-db','Hammer DB curl','hammer-db','Standing · neutral grip dumbbells','per hand',2,[set(14,8,12,2,90),set(14,8,12,2,90)],'Thumbs up, elbows near ribs, no torso swing.','Forearm and brachialis priority; 14 × 12 reported previously.','biceps'),
    ex('reverse-curl','Reverse cable curl','reverse-low','Low cable · pronated EZ or straight bar','stack total',2,[set(23,12,15,2,75),set(23,12,15,2,75)],'Wrists straight, pronated grip, controlled lowering.','Forearm emphasis; 23 kg reported in earlier sessions.','forearms')
  ]},
  legs: {label:'Legs',short:'Quads / hamstrings / calves',duration:'60–70 min',accent:'STRENGTH MAINTENANCE',exercises:[
    ex('leg-press','45° leg press','sled-45','45° sled · total loaded plates','total sled',10,[set(220,8,10,3,180),set(250,5,7,2,180),set(250,5,7,2,180)],'Controlled descent; back and hips against pad. Do not lock knees hard.','250 kg × 5 completed twice on 18 Nov. Next target 6 clean reps.','quads'),
    ex('lying-curl','Lying leg curl','lying-curl','Lying hamstring curl machine · NOT seated','stack total',5,[set(46,10,12,3,90),set(53,8,12,2,90),set(53,8,12,2,90)],'Hips stay down; control lowering.','01 Nov confirmed 46×12, 53×10, 53×8. Nov 18 loads partly reported, reps not verified.','hamstrings'),
    ex('leg-extension','Seated leg extension','seated-extension','Seated quad extension · straighten knees','stack total',5,[set(45,10,12,3,90),set(50,10,12,2,90),set(50,10,12,2,90)],'Smooth knee extension; no swing or hard lockout.','Not interchangeable with lying leg curls. We track these separately.','quads',{provisional:true}),
    ex('back-extension','Back extension','roman-chair','Roman chair · plate held to chest','held plate',5,[set(15,10,12,2,90),set(15,10,12,2,90)],'Hinge at hips. Stop when spine is neutral; no hyperextension.','Supplemental lumbar/glute work. Avoid RDL given past dizziness.','back'),
    ex('calf-press','Leg press calf raise','sled-45-calf','45° sled · calf press only · total loaded plates','total sled',10,[set(150,12,15,2,75),set(150,12,15,2,75),set(150,12,15,1,75)],'Safety catch set. Balls of feet stable. Move through ankles only.','User prefers this over seated calf machine reracking.','calves',{provisional:true})
  ]},
  focus: {label:'Focus day',short:'Chest / arms / forearms',duration:'35–45 min',accent:'OPTIONAL FOURTH DAY',exercises:[
    ex('flat-db','Flat dumbbell press','db-bench-flat','Flat bench · dumbbells','per hand',2.5,[set(17.5,8,10,2,150),set(17.5,8,10,2,150)],'Control the lowering; only do if chest and shoulders recovered.','An optional second chest exposure; not automatically required.','chest'),
    ex('ez-curl','Cable EZ-bar curl','ez-cable','Low cable · EZ bar','stack total',2.5,[set(40,10,12,2,90),set(40,10,12,2,90)],'Stand tall, exhale each curl.','Keep this low volume after a previous pull day.','biceps'),
    ex('lateral-cable','Cable lateral raise','single-cable','Single cable · side delts','per arm',0.5,[set(4.5,12,15,2,75),set(4.5,12,15,2,75)],'Move through shoulders without shrugging.','Extra side delt work only when recovered.','shoulders'),
    ex('reverse-curl','Reverse cable curl','reverse-low','Low cable · pronated','stack total',2,[set(23,12,15,2,75),set(23,12,15,2,75)],'Elbows stable, slow lowering.','Forearm specialization.','forearms')
  ]}
};
export const PROFILE={heightCm:180,weightKg:93,weightAsOf:'2026-08-04',goalSessions:3,stretchSessions:4,focus:['Chest fullness','Biceps thickness','Forearms','Traps','Mid / lower back','Leaner waist'],keep:['Strong legs','Lateral raises','Smith shrugs','V-handle pushdowns','Lying leg curls'],avoid:['Romanian deadlifts after dizziness','Arbitrary exercise changes','Unsupported sets entered as completed'],weightUnits:'kg',gym:'SATS',baselineNote:'Body weight last reported 04 Aug 2026; update when measured.',sats:{annual107:107,last30:8,asOf:'2026-11-20'},photoDates:['2024-09-26','2024-12-23','2025-05-21','2025-06-20','2025-09-06','2025-12-31']};
const hs=(weight,reps,rir=null,extra={})=>({weight,reps,rir,...extra});
const he=(exerciseId,machineId,sets=[],notes='',extra={})=>({exerciseId,machineId,sets,notes,...extra});
export const HISTORY=[
 {id:'hist-20261031',date:'2026-10-31',type:'pull',source:'historical-partial',notes:'Historical user-reported subsets. Unknown sets are not inferred.',exercises:[
   he('lat-pd','lat-old',[hs(52,10),hs(59,10),hs(66,8,3)],'Old pulldown stack; not comparable to new 5 kg stack.'),
   he('seated-row','cable-row',[hs(59,10)],'First row set reported.'),
   he('ez-curl','ez-cable',[hs(41,10,2),hs(45,8,null,{dizziness:true})],'Brief dizziness after curls.')
 ]},
 {id:'hist-20261101',date:'2026-11-01',type:'legs',source:'historical-partial',notes:'Lying curl confirmed, not seated curl.',exercises:[
   he('leg-press','sled-45',[hs(240,6,1)],'Clean top set.'),
   he('lying-curl','lying-curl',[hs(46,12),hs(53,10),hs(53,8)]),
   he('leg-extension','seated-extension',[],'Reported completed, actual sets not recorded.'),
   he('back-extension','roman-chair',[],'Reported completed, actual sets not recorded.'),
   he('calf-press','seated-calf',[],'Seated calf machine used; not comparable to calf press.')
 ]},
 {id:'hist-20261111',date:'2026-11-11',type:'pull',source:'historical-partial',notes:'Several weights were prescribed but not confirmed as completed.',exercises:[he('seated-row','cable-row',[hs(75,null,2)],'Weight and effort reported; reps not supplied.'),he('reverse-pec','reverse-pec',[hs(35,12)])]},
 {id:'hist-20261114',date:'2026-11-14',type:'push',source:'historical-partial',notes:'Other prescribed sets omitted due to missing confirmation.',exercises:[
   he('cable-fly','dual-cable-unknown',[hs(18,8),hs(14,4)],'Drop set; load per side. Cable direction not recorded.'),
   he('v-pushdown','v-cable',[hs(21.25,12,3),hs(25,12,2),hs(28.74,10,1)])
 ]},
 {id:'hist-20261117',date:'2026-11-17',type:'pull',source:'historical-partial',notes:'Top lat pulldown 75 kg reported but reps unknown.',exercises:[
   he('lat-pd','lat-new',[hs(75,null)],'New pulldown machine; 5 kg increments.'),
   he('seated-row','cable-row',[hs(80,8)],'Working set reported.'),
   he('smith-shrug','smith-shrug',[],'Completed per user; actual weight/reps unknown.')
 ]},
 {id:'hist-20261118',date:'2026-11-18',type:'legs',source:'historical-partial',notes:'Important correction: LYING leg curls completed. Seated leg extensions were initially unavailable and not confirmed completed.',exercises:[
   he('leg-press','sled-45',[hs(250,5),hs(250,5)],'Two separate clean top sets.'),
   he('lying-curl','lying-curl',[hs(55,null),hs(60,null)],'Loads mentioned; exact reps and set count unclear.'),
   he('back-extension','roman-chair',[],'Reported completed, exact reps/weight not confirmed.')
 ]},
 {id:'hist-20261120',date:'2026-11-20',type:'push',source:'historical-partial',notes:'All seven movements reported completed. Missing actual reps are deliberately left blank.',exercises:[
   he('incline-db','db-bench-30',[hs(22.5,8),hs(22.5,8)],'Sets 2 and 3 confirmed at 22.5 kg each hand. Working set 1 actual unreported.'),
   he('cable-fly','dual-cable-high',[],'High-to-low; front shoulder fatigue, not established as pain.',{formIssue:true}),
   he('flat-db','db-bench-flat',[hs(17.5,null)],'17.5 kg per hand reported, actual reps unknown.'),
   he('lateral-cable','single-cable',[],'Completed; reps/weight not explicitly confirmed.'),
   he('v-pushdown','v-cable',[],'Completed, actual numbers unknown.'),
   he('oh-triceps','rope-cable',[],'Completed, actual numbers unknown.'),
   he('ez-curl','ez-cable',[],'Completed, actual numbers unknown.')
 ]}
];
export const INITIAL_MEASUREMENTS=[{id:'m-20260804',date:'2026-08-04',weight:93,waist:null,arm:null,sleep:null,energy:null,note:'Weight reported Aug 2026. Height 180 cm.'}];
