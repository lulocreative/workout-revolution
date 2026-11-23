// Exercise technique guides. Keyed by exercise id from data/seed.js.
// `video` is a search phrase: the app opens a YouTube search only when the user taps "Watch demo"
// (nothing remote is loaded otherwise). A user-saved link in state.videoLinks takes precedence.
// Breathing cues deliberately avoid long breath-holds.
export const TECHNIQUE = {
  'incline-db': {
    target: 'Upper chest, front delts, triceps',
    setup: ['Set the bench to 25–30°, not steeper, so the chest stays the main driver.', 'Sit with dumbbells on your thighs, then kick them up one at a time as you lie back.', 'Feet flat, slight arch, shoulder blades pulled back and down into the bench.'],
    steps: ['Start with dumbbells over the upper chest, wrists stacked over elbows.', 'Lower under control (about 2–3 s) until the dumbbells are level with the chest and elbows sit roughly 45–60° from the torso.', 'Press up and slightly inward, finishing over the shoulders without clanking the bells together.', 'Keep shoulder blades pinned for every rep.'],
    mistakes: ['Bench too steep: turns it into a shoulder press.', 'Elbows flared to 90°: stresses the front shoulder.', 'Bouncing out of the bottom or losing the shoulder-blade position.'],
    breathing: 'Inhale on the way down, exhale steadily as you press. Do not hold your breath through the set.',
    video: 'incline dumbbell press proper form'
  },
  'cable-fly': {
    target: 'Lower and mid chest',
    setup: ['Set both pulleys high, above shoulder height.', 'Grab a handle in each hand and take one step forward into a split stance.', 'Slight bend in the elbows, chest up, shoulders down.'],
    steps: ['From arms wide, bring the hands down and together in an arc toward the lower chest.', 'Keep the elbow angle fixed; the movement happens at the shoulder.', 'Squeeze the chest for a moment where the hands meet, around belly-button to lower-chest height.', 'Return slowly until you feel a stretch across the chest, not in the front of the shoulder.'],
    mistakes: ['Shrugging or rounding the shoulders forward at the finish.', 'Turning it into a press by bending and straightening the elbows.', 'Dragging the hands down to the thighs.', 'Going so wide on the stretch that the front shoulder takes the load.'],
    breathing: 'Exhale as the hands come together, inhale on the return.',
    caution: 'Front-shoulder fatigue was reported on this exercise on 20 Nov. Use a lighter load and stop if it turns into pain.',
    video: 'high to low cable fly form'
  },
  'flat-db': {
    target: 'Mid chest, front delts, triceps',
    setup: ['Lie on a flat bench with the dumbbells kicked up from your thighs.', 'Feet planted, shoulder blades squeezed back and down.'],
    steps: ['Start with the dumbbells over the chest, palms forward or slightly turned in.', 'Lower slowly with elbows 30–60° from the torso until the dumbbells reach chest level.', 'Press back up over the chest, keeping the wrists straight.'],
    mistakes: ['Elbows flared straight out to the sides.', 'Lifting the hips off the bench.', 'Cutting the range short as fatigue builds.'],
    breathing: 'Inhale on the way down, exhale while pressing.',
    video: 'flat dumbbell bench press proper form'
  },
  'lateral-cable': {
    target: 'Side delts',
    setup: ['Set a single pulley at its lowest point with a D-handle.', 'Stand side-on to the machine and grab the handle with the far hand, so the cable crosses in front of your body.', 'Hold the machine with the other hand and lean slightly away if you like.'],
    steps: ['With a soft bend in the elbow, raise the arm out to the side.', 'Lead with the elbow, not the hand, and stop at about shoulder height.', 'Pause briefly, then lower slowly with the cable keeping tension at the bottom.'],
    mistakes: ['Shrugging the trap up to move the weight.', 'Swinging the torso to start the rep.', 'Raising far above shoulder height.'],
    breathing: 'Exhale as the arm rises, inhale on the way down.',
    video: 'cable lateral raise proper form'
  },
  'v-pushdown': {
    target: 'Triceps',
    setup: ['Set the pulley high and attach the V-handle.', 'Stand close, soft knees, slight forward lean from the hips.', 'Pin your elbows to your sides.'],
    steps: ['Start with the forearms about parallel to the floor.', 'Push the handle down until the arms are fully straight; squeeze the triceps.', 'Let it come back up under control to forearms-parallel, keeping elbows still.'],
    mistakes: ['Elbows drifting forward and the shoulders taking over.', 'Leaning over the bar and using bodyweight.', 'Letting the stack yank the hands up past chest height.'],
    breathing: 'Exhale on the push down, inhale on the return.',
    video: 'v bar tricep pushdown proper form'
  },
  'oh-triceps': {
    target: 'Triceps (long head)',
    setup: ['Set the pulley high and attach the rope.', 'Face away from the machine, holding the rope behind your head, and step forward into a staggered stance.', 'Lean forward slightly with elbows pointing forward, beside your head.'],
    steps: ['Extend the elbows to push the rope forward and up until the arms are straight.', 'Separate the rope ends gently at the finish.', 'Return slowly, letting the hands come behind the head for a deep stretch.', 'Upper arms stay still throughout.'],
    mistakes: ['Elbows flaring wide or dropping.', 'Arching the lower back to finish reps.', 'Going too heavy and grinding: this exercise is about the stretch.'],
    breathing: 'Exhale as you extend, inhale on the return.',
    video: 'overhead cable tricep extension rope form'
  },
  'ez-curl': {
    target: 'Biceps',
    setup: ['Set the pulley at its lowest position with an EZ-bar attachment.', 'Stand tall close to the stack, holding the angled part of the bar with palms up.'],
    steps: ['Curl the bar toward the shoulders while the elbows stay by your sides.', 'Squeeze at the top without letting the elbows travel forward.', 'Lower fully under control.'],
    mistakes: ['Swinging the hips or leaning back.', 'Elbows drifting forward to make the top easier.', 'Holding your breath.'],
    breathing: 'Exhale on every curl, inhale as you lower. Never hold your breath.',
    video: 'cable ez bar curl proper form'
  },
  'lat-pd': {
    target: 'Lats, upper back, biceps',
    setup: ['Adjust the thigh pad so your legs are locked in.', 'Take a grip slightly wider than shoulders.', 'Sit tall with a small lean back (about 10–15°).'],
    steps: ['Start the rep by pulling the shoulder blades down.', 'Drive the elbows down toward your ribs, bringing the bar to the upper chest.', 'Pause briefly, then let the bar rise slowly until the arms are straight and the lats stretch.'],
    mistakes: ['Leaning far back and turning it into a row.', 'Pulling with the hands and biceps instead of the elbows.', 'Pulling the bar behind the neck.'],
    breathing: 'Exhale as you pull down, inhale as the bar rises.',
    note: 'Your gym has two pulldown machines with different stacks. Log the one you used; the app keeps them separate.',
    video: 'lat pulldown proper form'
  },
  'seated-row': {
    target: 'Mid back, lats, rear delts',
    setup: ['Sit with feet on the platform and knees slightly bent.', 'Grab the neutral handle with a tall chest and straight back.'],
    steps: ['Pull the handle toward your lower ribs, driving the elbows back past the torso.', 'Squeeze the shoulder blades together at the end.', 'Return slowly, letting the shoulder blades move forward without rounding the lower back.'],
    mistakes: ['Throwing the torso backward to move the weight.', 'Shrugging the shoulders up toward the ears.', 'Rounding the lower back on the return.'],
    breathing: 'Exhale as you pull, inhale as the handle goes forward.',
    video: 'seated cable row proper form'
  },
  'reverse-pec': {
    target: 'Rear delts, upper back',
    setup: ['Face the pad; set the handles so your arms are at shoulder height.', 'Adjust the seat so the handles line up with your shoulders.', 'Chest against the pad.'],
    steps: ['With a soft bend in the elbows, open the arms out and back in a wide arc.', 'Stop when the arms are in line with the body.', 'Return slowly without letting the stack touch down.'],
    mistakes: ['Shrugging, so the traps take over.', 'Bending the elbows more as you pull.', 'Using momentum to swing the handles.'],
    breathing: 'Exhale as the arms open, inhale on the return.',
    video: 'reverse pec deck rear delt fly proper form'
  },
  'smith-shrug': {
    target: 'Upper traps',
    setup: ['Set the Smith bar at about mid-thigh height.', 'Stand close with an overhand grip just outside the thighs.', 'Unrack and stand tall with arms straight.'],
    steps: ['Shrug the shoulders straight up toward the ears and slightly back.', 'Hold the top for about 1 second.', 'Lower slowly to a full stretch.'],
    mistakes: ['Rolling the shoulders in circles.', 'Bending the elbows to help pull.', 'Short, bouncy reps with no pause.'],
    breathing: 'Exhale as you shrug up, inhale as you lower.',
    video: 'smith machine shrug proper form'
  },
  'incline-curl': {
    target: 'Biceps (long head, stretched position)',
    setup: ['Set an adjustable bench to about 45–60°.', 'Sit back with a dumbbell in each hand and let the arms hang straight down, slightly behind the torso.'],
    steps: ['Curl the dumbbells up while the upper arms stay still and behind the body.', 'Turn the palms up fully at the top.', 'Lower slowly all the way to a full stretch.'],
    mistakes: ['Upper arms swinging forward.', 'Lifting the head and shoulders off the bench.', 'Going too heavy; it feels harder than a standing curl.'],
    breathing: 'Exhale on the curl, inhale on the way down.',
    video: 'incline dumbbell curl proper form'
  },
  'preacher-db': {
    target: 'Biceps (short head, shortened position)',
    setup: ['Set a preacher pad or incline bench so the back of your upper arm rests flat on it.', 'Armpit snug against the top of the pad.'],
    steps: ['Curl the dumbbell up while the upper arm stays on the pad.', 'Squeeze at the top without letting the elbow lift.', 'Lower slowly, stopping just short of fully locking the elbow.'],
    mistakes: ['Dropping fast into a locked elbow; this strains the joint.', 'Lifting the elbow off the pad.', 'Shrugging the shoulder forward.'],
    breathing: 'Exhale on the curl, inhale on the way down.',
    video: 'dumbbell preacher curl proper form'
  },
  'hammer-db': {
    target: 'Brachialis, forearms, biceps',
    setup: ['Stand tall with a dumbbell in each hand, palms facing each other (thumbs up).'],
    steps: ['Curl the dumbbells up, keeping thumbs up and elbows near the ribs.', 'Bring the dumbbells to shoulder height.', 'Lower slowly to full extension.'],
    mistakes: ['Swinging the torso.', 'Elbows drifting forward.', 'Turning the wrists, which turns it into a regular curl.'],
    breathing: 'Exhale on the curl, inhale on the way down.',
    video: 'hammer curl proper form'
  },
  'reverse-curl': {
    target: 'Forearm extensors, brachioradialis',
    setup: ['Set the pulley low with an EZ or straight bar.', 'Grip overhand (palms down) about shoulder width.'],
    steps: ['Curl the bar up with the wrists kept straight and in line with the forearms.', 'Elbows stay by your sides.', 'Lower slowly.'],
    mistakes: ['Wrists bending back under the load.', 'Going too heavy and swinging.', 'Gripping too wide.'],
    breathing: 'Exhale on the curl, inhale on the way down.',
    video: 'reverse grip cable curl proper form'
  },
  'leg-press': {
    target: 'Quads, glutes',
    setup: ['Sit fully back with the lower back and hips flat against the pad.', 'Feet shoulder width, mid-platform.', 'Release the safety handles only once you are in position.'],
    steps: ['Lower the sled under control until the knees reach about 90°, or as deep as you can go without the lower back lifting off the pad.', 'Push through the whole foot to press the sled back up.', 'Stop just short of locking the knees.'],
    mistakes: ['Hips rolling up off the pad at the bottom.', 'Knees caving inward.', 'Snapping the knees into a hard lockout.'],
    breathing: 'Inhale on the way down, exhale steadily as you press. Avoid a long breath-hold on heavy sets.',
    video: '45 degree leg press proper form'
  },
  'lying-curl': {
    target: 'Hamstrings',
    setup: ['Lie face down with the pad just above the heels, below the calves.', 'Knees just off the end of the bench.', 'Hold the handles.'],
    steps: ['Curl the heels toward the glutes while hips stay pressed into the bench.', 'Squeeze at the top.', 'Lower slowly to almost straight legs.'],
    mistakes: ['Hips rising off the pad.', 'Dropping the weight quickly.', 'Cutting reps short at the top.'],
    breathing: 'Exhale as you curl, inhale as you lower.',
    note: 'Lying curl, not the seated curl. The app tracks them separately.',
    video: 'lying leg curl proper form'
  },
  'leg-extension': {
    target: 'Quads',
    setup: ['Adjust the back pad so your knees line up with the machine pivot.', 'Ankle pad on the lower shin, just above the feet.', 'Hold the side handles.'],
    steps: ['Straighten the knees smoothly to raise the pad.', 'Squeeze the quads at the top for a moment without slamming into lockout.', 'Lower slowly.'],
    mistakes: ['Kicking the weight up with momentum.', 'Lifting the hips off the seat.', 'Knee not lined up with the pivot.'],
    breathing: 'Exhale as you extend, inhale as you lower.',
    video: 'leg extension machine proper form'
  },
  'back-extension': {
    target: 'Lower back, glutes, hamstrings',
    setup: ['Set the pad just below the hip bones so you can hinge freely.', 'Heels secured under the foot pads.', 'Hold a plate across your chest.'],
    steps: ['Hinge forward at the hips with a flat back.', 'Rise up by squeezing the glutes until the body forms a straight line.', 'Stop there; do not lean back past straight.'],
    mistakes: ['Hyperextending (arching back) at the top.', 'Rounding the back at the bottom.', 'Bouncing out of the bottom.'],
    breathing: 'Exhale as you rise, inhale as you lower.',
    video: 'roman chair back extension proper form'
  },
  'calf-press': {
    target: 'Calves',
    setup: ['Sit in the 45° sled and place the balls of your feet on the lower edge of the platform, heels hanging off.', 'Legs nearly straight with a soft knee.', 'Keep the safety catches set.'],
    steps: ['Push through the balls of the feet to point the toes and raise the sled.', 'Pause at the top.', 'Lower slowly into a deep stretch, heels below toes.'],
    mistakes: ['Bending the knees to help push.', 'Short, bouncy reps.', 'Feet slipping on the platform edge.'],
    breathing: 'Exhale as you press, inhale as you lower.',
    video: 'leg press calf raise proper form'
  }
};
export const youtubeSearch = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
export const isSafeVideoUrl = (u) => { try { const x = new URL(String(u)); return x.protocol === 'https:'; } catch { return false; } };
