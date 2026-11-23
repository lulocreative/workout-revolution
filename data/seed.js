// Public build: no personal data. Restore your JSON backup in Settings.
export const PROGRAM = {
 "push": {
  "label": "Push",
  "short": "Chest / delts / triceps",
  "duration": "60–75 min",
  "accent": "CHEST PRIORITY",
  "exercises": [
   {
    "id": "incline-db",
    "name": "Incline dumbbell press",
    "machineId": "db-bench-30",
    "machine": "Adjustable bench · 25–30°",
    "unit": "per hand",
    "increment": 2.5,
    "sets": [
     {
      "weight": 20,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     },
     {
      "weight": 22.5,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     },
     {
      "weight": 22.5,
      "repMin": 8,
      "repMax": 10,
      "rir": 1,
      "rest": 180
     }
    ],
    "cue": "Brace shoulders, wrists stacked; controlled lowering. Exhale on press.",
    "why": "22.5 kg × 8 confirmed twice on 20 Nov. Target 9 reps before adding load.",
    "groups": "chest"
   },
   {
    "id": "cable-fly",
    "name": "High-to-low cable fly",
    "machineId": "dual-cable-high",
    "machine": "Dual adjustable cables · high-to-low",
    "unit": "per side",
    "increment": 2,
    "sets": [
     {
      "weight": 10,
      "repMin": 12,
      "repMax": 15,
      "rir": 3,
      "rest": 90
     },
     {
      "weight": 10,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 10,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Hands meet near lower chest. Avoid shrugging or dragging to thighs.",
    "why": "Front-shoulder fatigue reported 20 Nov; use lighter load and stop for pain.",
    "groups": "chest",
    "caution": "Front shoulder fatigue reported during this exercise."
   },
   {
    "id": "flat-db",
    "name": "Flat dumbbell press",
    "machineId": "db-bench-flat",
    "machine": "Flat bench · dumbbells",
    "unit": "per hand",
    "increment": 2.5,
    "sets": [
     {
      "weight": 17.5,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     },
     {
      "weight": 17.5,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     }
    ],
    "cue": "Shoulder blades steady, elbows 30–60° from torso.",
    "why": "Two sets after substantial incline and fly work. Add a third only if performance/recovery justify it.",
    "groups": "chest"
   },
   {
    "id": "lateral-cable",
    "name": "Cable lateral raise",
    "machineId": "single-cable",
    "machine": "Single cable · side delts",
    "unit": "per arm",
    "increment": 0.5,
    "sets": [
     {
      "weight": 4.5,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     },
     {
      "weight": 4.5,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     },
     {
      "weight": 4.5,
      "repMin": 12,
      "repMax": 15,
      "rir": 1,
      "rest": 75
     }
    ],
    "cue": "Raise to shoulder height without shrugging.",
    "why": "Three sets kept intentionally. You enjoy this exercise and it serves your side delts.",
    "groups": "shoulders"
   },
   {
    "id": "v-pushdown",
    "name": "V-handle pushdown",
    "machineId": "v-cable",
    "machine": "High cable · V attachment",
    "unit": "stack total",
    "increment": 1.25,
    "sets": [
     {
      "weight": 25,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 28.75,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 28.75,
      "repMin": 10,
      "repMax": 12,
      "rir": 1,
      "rest": 90
     }
    ],
    "cue": "Elbows pinned to sides; control the return.",
    "why": "Last confirmed top: 28.74 kg × 10 @ RIR 1 on 14 Nov.",
    "groups": "triceps"
   },
   {
    "id": "oh-triceps",
    "name": "Overhead cable triceps extension",
    "machineId": "rope-cable",
    "machine": "High cable · rope · facing away",
    "unit": "stack total",
    "increment": 2,
    "sets": [
     {
      "weight": 16,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 16,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Elbows steady; hands come closer behind head, separate gently on extension.",
    "why": "Keep long-head triceps work, avoid heavy grinders.",
    "groups": "triceps"
   }
  ],
  "bonus": [
   {
    "id": "ez-curl",
    "name": "Cable EZ-bar curl (bonus)",
    "machineId": "ez-cable",
    "machine": "Low cable · EZ attachment",
    "unit": "stack total",
    "increment": 2.5,
    "sets": [
     {
      "weight": 40,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 40,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Stand tall. Exhale on each curl; avoid holding breath.",
    "why": "Optional second weekly biceps stimulus only when recovered from pull.",
    "groups": "biceps"
   }
  ]
 },
 "pull": {
  "label": "Pull",
  "short": "Back / biceps / traps",
  "duration": "65–80 min",
  "accent": "ARMS PRIORITY",
  "exercises": [
   {
    "id": "lat-pd",
    "name": "Lat pulldown",
    "machineId": "lat-new",
    "machine": "New lat pulldown · 5 kg increments",
    "unit": "stack total",
    "increment": 5,
    "sets": [
     {
      "weight": 65,
      "repMin": 8,
      "repMax": 10,
      "rir": 3,
      "rest": 150
     },
     {
      "weight": 70,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     },
     {
      "weight": 75,
      "repMin": 6,
      "repMax": 8,
      "rir": 2,
      "rest": 180
     }
    ],
    "cue": "Pull elbows down toward ribs; avoid leaning back excessively.",
    "why": "75 kg top load reported 17 Nov; rep count not verified.",
    "groups": "back"
   },
   {
    "id": "seated-row",
    "name": "Seated cable row",
    "machineId": "cable-row",
    "machine": "Seated cable row · neutral handle",
    "unit": "stack total",
    "increment": 5,
    "sets": [
     {
      "weight": 75,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 120
     },
     {
      "weight": 80,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     },
     {
      "weight": 80,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     }
    ],
    "cue": "Keep chest lifted; avoid throwing torso backward.",
    "why": "80 kg × 8 confirmed 17 Nov.",
    "groups": "back"
   },
   {
    "id": "reverse-pec",
    "name": "Reverse pec deck",
    "machineId": "reverse-pec",
    "machine": "Reverse pec deck · rear delts",
    "unit": "stack total",
    "increment": 5,
    "sets": [
     {
      "weight": 35,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 40,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 40,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Open elbows outward under control, do not shrug.",
    "why": "Maintain rear-delt work from pull sessions.",
    "groups": "shoulders"
   },
   {
    "id": "smith-shrug",
    "name": "Smith machine shrugs",
    "machineId": "smith-shrug",
    "machine": "Smith · standard non-elastic counterbalanced variant",
    "unit": "per side",
    "increment": 2.5,
    "sets": [
     {
      "weight": 20,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 120
     },
     {
      "weight": 20,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 120
     },
     {
      "weight": 20,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 120
     }
    ],
    "cue": "Shrug upward and slightly back, pause briefly. Do not roll shoulders.",
    "why": "User specifically wants direct traps. Load is provisional until confirmed on the exact machine.",
    "groups": "traps",
    "provisional": true
   },
   {
    "id": "incline-curl",
    "name": "Incline DB curl",
    "machineId": "incline-curl-bench",
    "machine": "Adjustable bench · arms slightly behind torso",
    "unit": "per hand",
    "increment": 2,
    "sets": [
     {
      "weight": 10,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 10,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Keep upper arms behind torso; resist swinging.",
    "why": "Trial introduced to compare arm positions; not yet a confirmed personal baseline.",
    "groups": "biceps",
    "provisional": true
   },
   {
    "id": "preacher-db",
    "name": "Preacher dumbbell curl",
    "machineId": "preacher-db-bench",
    "machine": "Supported upper arm on preacher / incline bench",
    "unit": "per hand",
    "increment": 2,
    "sets": [
     {
      "weight": 8,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 8,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Upper arm supported, lower slowly, avoid fully locking elbows.",
    "why": "Trial introduced; start conservative.",
    "groups": "biceps",
    "provisional": true
   },
   {
    "id": "hammer-db",
    "name": "Hammer DB curl",
    "machineId": "hammer-db",
    "machine": "Standing · neutral grip dumbbells",
    "unit": "per hand",
    "increment": 2,
    "sets": [
     {
      "weight": 14,
      "repMin": 8,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 14,
      "repMin": 8,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Thumbs up, elbows near ribs, no torso swing.",
    "why": "Forearm and brachialis priority; 14 × 12 reported previously.",
    "groups": "biceps"
   },
   {
    "id": "reverse-curl",
    "name": "Reverse cable curl",
    "machineId": "reverse-low",
    "machine": "Low cable · pronated EZ or straight bar",
    "unit": "stack total",
    "increment": 2,
    "sets": [
     {
      "weight": 23,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     },
     {
      "weight": 23,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     }
    ],
    "cue": "Wrists straight, pronated grip, controlled lowering.",
    "why": "Forearm emphasis; 23 kg reported in earlier sessions.",
    "groups": "forearms"
   }
  ]
 },
 "legs": {
  "label": "Legs",
  "short": "Quads / hamstrings / calves",
  "duration": "60–70 min",
  "accent": "STRENGTH MAINTENANCE",
  "exercises": [
   {
    "id": "leg-press",
    "name": "45° leg press",
    "machineId": "sled-45",
    "machine": "45° sled · total loaded plates",
    "unit": "total sled",
    "increment": 10,
    "sets": [
     {
      "weight": 220,
      "repMin": 8,
      "repMax": 10,
      "rir": 3,
      "rest": 180
     },
     {
      "weight": 250,
      "repMin": 5,
      "repMax": 7,
      "rir": 2,
      "rest": 180
     },
     {
      "weight": 250,
      "repMin": 5,
      "repMax": 7,
      "rir": 2,
      "rest": 180
     }
    ],
    "cue": "Controlled descent; back and hips against pad. Do not lock knees hard.",
    "why": "250 kg × 5 completed twice on 18 Nov. Next target 6 clean reps.",
    "groups": "quads"
   },
   {
    "id": "lying-curl",
    "name": "Lying leg curl",
    "machineId": "lying-curl",
    "machine": "Lying hamstring curl machine · NOT seated",
    "unit": "stack total",
    "increment": 5,
    "sets": [
     {
      "weight": 46,
      "repMin": 10,
      "repMax": 12,
      "rir": 3,
      "rest": 90
     },
     {
      "weight": 53,
      "repMin": 8,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 53,
      "repMin": 8,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Hips stay down; control lowering.",
    "why": "01 Nov confirmed 46×12, 53×10, 53×8. Nov 18 loads partly reported, reps not verified.",
    "groups": "hamstrings"
   },
   {
    "id": "leg-extension",
    "name": "Seated leg extension",
    "machineId": "seated-extension",
    "machine": "Seated quad extension · straighten knees",
    "unit": "stack total",
    "increment": 5,
    "sets": [
     {
      "weight": 45,
      "repMin": 10,
      "repMax": 12,
      "rir": 3,
      "rest": 90
     },
     {
      "weight": 50,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 50,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Smooth knee extension; no swing or hard lockout.",
    "why": "Not interchangeable with lying leg curls. We track these separately.",
    "groups": "quads",
    "provisional": true
   },
   {
    "id": "back-extension",
    "name": "Back extension",
    "machineId": "roman-chair",
    "machine": "Roman chair · plate held to chest",
    "unit": "held plate",
    "increment": 5,
    "sets": [
     {
      "weight": 15,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 15,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Hinge at hips. Stop when spine is neutral; no hyperextension.",
    "why": "Supplemental lumbar/glute work. RDLs are deliberately not programmed.",
    "groups": "back"
   },
   {
    "id": "calf-press",
    "name": "Leg press calf raise",
    "machineId": "sled-45-calf",
    "machine": "45° sled · calf press only · total loaded plates",
    "unit": "total sled",
    "increment": 10,
    "sets": [
     {
      "weight": 150,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     },
     {
      "weight": 150,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     },
     {
      "weight": 150,
      "repMin": 12,
      "repMax": 15,
      "rir": 1,
      "rest": 75
     }
    ],
    "cue": "Safety catch set. Balls of feet stable. Move through ankles only.",
    "why": "User prefers this over seated calf machine reracking.",
    "groups": "calves",
    "provisional": true
   }
  ]
 },
 "focus": {
  "label": "Focus day",
  "short": "Chest / arms / forearms",
  "duration": "35–45 min",
  "accent": "OPTIONAL FOURTH DAY",
  "exercises": [
   {
    "id": "flat-db",
    "name": "Flat dumbbell press",
    "machineId": "db-bench-flat",
    "machine": "Flat bench · dumbbells",
    "unit": "per hand",
    "increment": 2.5,
    "sets": [
     {
      "weight": 17.5,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     },
     {
      "weight": 17.5,
      "repMin": 8,
      "repMax": 10,
      "rir": 2,
      "rest": 150
     }
    ],
    "cue": "Control the lowering; only do if chest and shoulders recovered.",
    "why": "An optional second chest exposure; not automatically required.",
    "groups": "chest"
   },
   {
    "id": "ez-curl",
    "name": "Cable EZ-bar curl",
    "machineId": "ez-cable",
    "machine": "Low cable · EZ bar",
    "unit": "stack total",
    "increment": 2.5,
    "sets": [
     {
      "weight": 40,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     },
     {
      "weight": 40,
      "repMin": 10,
      "repMax": 12,
      "rir": 2,
      "rest": 90
     }
    ],
    "cue": "Stand tall, exhale each curl.",
    "why": "Keep this low volume after a previous pull day.",
    "groups": "biceps"
   },
   {
    "id": "lateral-cable",
    "name": "Cable lateral raise",
    "machineId": "single-cable",
    "machine": "Single cable · side delts",
    "unit": "per arm",
    "increment": 0.5,
    "sets": [
     {
      "weight": 4.5,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     },
     {
      "weight": 4.5,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     }
    ],
    "cue": "Move through shoulders without shrugging.",
    "why": "Extra side delt work only when recovered.",
    "groups": "shoulders"
   },
   {
    "id": "reverse-curl",
    "name": "Reverse cable curl",
    "machineId": "reverse-low",
    "machine": "Low cable · pronated",
    "unit": "stack total",
    "increment": 2,
    "sets": [
     {
      "weight": 23,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     },
     {
      "weight": 23,
      "repMin": 12,
      "repMax": 15,
      "rir": 2,
      "rest": 75
     }
    ],
    "cue": "Elbows stable, slow lowering.",
    "why": "Forearm specialization.",
    "groups": "forearms"
   }
  ]
 }
};
export const PROFILE = {
 "heightCm": null,
 "weightKg": null,
 "weightAsOf": null,
 "goalSessions": 3,
 "stretchSessions": 4,
 "focus": [
  "Chest fullness",
  "Biceps thickness",
  "Forearms",
  "Traps",
  "Mid / lower back",
  "Leaner waist"
 ],
 "keep": [
  "Strong legs",
  "Lateral raises",
  "Smith shrugs",
  "V-handle pushdowns",
  "Lying leg curls"
 ],
 "avoid": [
  "Romanian deadlifts",
  "Arbitrary exercise changes",
  "Unsupported sets entered as completed"
 ],
 "weightUnits": "kg",
 "gym": "SATS",
 "baselineNote": "Restore your backup in Settings to load your data.",
 "sats": {
  "annual107": 0,
  "last30": 0,
  "asOf": null
 },
 "photoDates": []
};
export const HISTORY = [];
export const INITIAL_MEASUREMENTS = [];
