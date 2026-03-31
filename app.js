// app.js

// ─── DOM refs ───────────────────────────────────────────────
const highEnergyBtn       = document.getElementById('highEnergyBtn');
const lowEnergyBtn        = document.getElementById('lowEnergyBtn');
const xpToast             = document.getElementById('xpToast');
const xpValueEl           = document.getElementById('xpValue');
const xpLevelEl           = document.getElementById('xpLevel');
const victoryOverlay      = document.getElementById('victoryOverlay');
const victorySub          = document.getElementById('victorySub');
const victoryStats        = document.getElementById('victoryStats');
const victoryClose        = document.getElementById('victoryClose');
const timerRingWrapper    = document.getElementById('timerRingWrapper');
const fullscreenBtn       = document.getElementById('fullscreenBtn');
const fullscreenTimer     = document.getElementById('fullscreenTimer');
const fsExitBtn           = document.getElementById('fsExitBtn');
const fsPauseBtn          = document.getElementById('fsPauseBtn');
const fsTimer             = document.getElementById('fsTimer');
const fsStatus            = document.getElementById('fsStatus');
const fsRing              = document.getElementById('fsRing');
const fsTaskMain          = document.getElementById('fsTaskMain');
const fsTaskExtra         = document.getElementById('fsTaskExtra');
const fsEnergyTag         = document.getElementById('fsEnergyTag');
const durationSelect      = document.getElementById('durationSelect');
const taskInput           = document.getElementById('taskInput');
const addTaskBtn          = document.getElementById('addTaskBtn');
const taskList            = document.getElementById('taskList');
const addedTaskList       = document.getElementById('addedTaskList');
const emptyState          = document.getElementById('emptyState');
const timer               = document.getElementById('timer');
const timerStatus         = document.getElementById('timerStatus');
const timerRing           = document.getElementById('timerRing');
const startTimerBtn       = document.getElementById('startTimerBtn');
const resetTimerBtn       = document.getElementById('resetTimerBtn');
const googleCalendarBtn   = document.getElementById('googleCalendarBtn');
const outlookCalendarBtn  = document.getElementById('outlookCalendarBtn');
const icalCalendarBtn     = document.getElementById('icalCalendarBtn');
const schedulePrompt      = document.getElementById('schedulePrompt');
const scheduleLaterBtn    = document.getElementById('scheduleLaterBtn');
const calendarSection     = document.getElementById('calendarSection');

// Step sections
const step2             = document.getElementById('step2');
const step3             = document.getElementById('step3');
const step4             = document.getElementById('step4');
const addedTasksSection = document.getElementById('addedTasksSection');

// Step dots
const dots = [
  document.getElementById('dot1'),
  document.getElementById('dot2'),
  document.getElementById('dot3'),
  document.getElementById('dot4'),
];

// ─── State ──────────────────────────────────────────────────
let energyLevel      = null;
let selectedDuration = null;
let addedTasks       = [];
let timeRemaining    = 0;
let totalTime        = 0;
let timerInterval    = null;
let running          = false;
let xp               = 0;

// Ring circumference: 2π × r = 2π × 75 ≈ 471.2
const RING_CIRCUMFERENCE = 2 * Math.PI * 75;
timerRing.style.strokeDasharray = RING_CIRCUMFERENCE;
timerRing.style.strokeDashoffset = RING_CIRCUMFERENCE;

// ─── Task data ───────────────────────────────────────────────
const lowEnergyTasks = {
  '10': [
    'Check and respond to emails',
    'Review and organise your to-do list',
    'Read a short article or news summary',
    'Watch an educational video',
    'Light stretching or breathing exercise',
  ],
  '20': [
    'Listen to a podcast episode',
    'Tidy up and organise a small area',
    'Browse and research a topic of interest',
    'Journaling or gratitude writing',
    'Short walk or gentle movement',
  ],
  '30': [
    'Sort through digital photos or files',
    'Update your calendar and schedule',
    'Plan meals or make a grocery list',
    'Practice deep breathing or relaxation',
    'Listen to calming music mindfully',
  ],
  '60': [
    'Read an inspiring book or article',
    'Light decluttering or organisation',
    'Practice gratitude or affirmations',
    'Catch up on light reading',
    'Work on a simple craft or puzzle',
  ],
};

const highEnergyTasks = {
  '10': [
    'Make progress on a challenging project',
    'Declutter and organise your workspace',
    'Quick exercise set or workout',
    'Tackle the hardest task on your list',
    'Learn something new — watch a tutorial',
  ],
  '20': [
    'Brainstorm and plan a future project',
    'Write a blog post or article draft',
    'Prepare a presentation or speech outline',
    'Research and plan a trip or adventure',
    'Work on a creative hobby',
  ],
  '30': [
    'Organise and file important documents',
    'Deep clean and organise a room',
    'Prep healthy meals for the week',
    'Tackle a home improvement task',
    'Work on your CV or job applications',
  ],
  '60': [
    'Volunteer or community service',
    'Organise and back up digital files',
    'Mindfulness or meditation session',
    'Plan and schedule key appointments',
    'Challenging physical activity — gym, hike',
  ],
};

// ─── Step visibility ─────────────────────────────────────────
function showStep(el) {
  el.classList.remove('hidden');
  el.classList.add('animate-in');
}

function setActiveDot(index) {
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i < index) dot.classList.add('done');
    else if (i === index) dot.classList.add('active');
  });
}

// ─── Energy selection ────────────────────────────────────────
highEnergyBtn.addEventListener('click', () => {
  energyLevel = 'high';
  highEnergyBtn.classList.add('active-high');
  highEnergyBtn.classList.remove('active-low');
  lowEnergyBtn.classList.remove('active-high', 'active-low');
  showStep(step2);
  setActiveDot(1);
  // Reset downstream
  durationSelect.value = '';
  step3.classList.add('hidden');
  step4.classList.add('hidden');
  addedTasksSection.classList.add('hidden');
});

lowEnergyBtn.addEventListener('click', () => {
  energyLevel = 'low';
  lowEnergyBtn.classList.add('active-low');
  lowEnergyBtn.classList.remove('active-high');
  highEnergyBtn.classList.remove('active-high', 'active-low');
  showStep(step2);
  setActiveDot(1);
  // Reset downstream
  durationSelect.value = '';
  step3.classList.add('hidden');
  step4.classList.add('hidden');
  addedTasksSection.classList.add('hidden');
});

// ─── Duration selection ───────────────────────────────────────
durationSelect.addEventListener('change', () => {
  selectedDuration = durationSelect.value;
  if (!selectedDuration) {
    step3.classList.add('hidden');
    step4.classList.add('hidden');
    return;
  }

  updateTaskList();
  showStep(step3);
  showStep(addedTasksSection);
  showStep(step4);
  showStep(schedulePrompt);
  fullscreenBtn.classList.add('hidden');
  calendarSection.classList.add('hidden');
  scheduleLaterBtn.classList.remove('open');
  setActiveDot(2);

  // Sync timer display
  const mins = parseInt(selectedDuration, 10);
  timeRemaining = mins * 60;
  totalTime = timeRemaining;
  clearInterval(timerInterval);
  running = false;
  startTimerBtn.textContent = '▶ Start';
  timerStatus.textContent = 'Ready';
  renderTimer();
  updateRing(1);
});

// ─── Task suggestions ─────────────────────────────────────────
function updateTaskList() {
  taskList.innerHTML = '';
  const tasks = energyLevel === 'high'
    ? highEnergyTasks[selectedDuration]
    : lowEnergyTasks[selectedDuration];

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    li.addEventListener('click', () => {
      taskInput.value = task;
      taskInput.focus();
    });
    taskList.appendChild(li);
  });
}

// ─── XP system ───────────────────────────────────────────────
const XP_LEVELS = [
  { min: 0,   label: 'Level 1 🌱' },
  { min: 30,  label: 'Level 2 🔥' },
  { min: 80,  label: 'Level 3 ⚡' },
  { min: 150, label: 'Level 4 🚀' },
  { min: 250, label: 'Level 5 🏆' },
];

function addXP(amount, originEl) {
  xp += amount;
  xpValueEl.textContent = xp;
  const level = [...XP_LEVELS].reverse().find(l => xp >= l.min);
  xpLevelEl.textContent = level.label;

  // Float toast from button
  const rect = originEl.getBoundingClientRect();
  xpToast.textContent = `+${amount} XP ⚡`;
  xpToast.style.left = `${rect.left + rect.width / 2 - 40}px`;
  xpToast.style.top  = `${rect.top - 10}px`;
  xpToast.classList.remove('hidden');
  xpToast.style.animation = 'none';
  requestAnimationFrame(() => {
    xpToast.style.animation = 'xpFloat 1.8s ease forwards';
  });
  setTimeout(() => xpToast.classList.add('hidden'), 1850);
}

// ─── Add task ─────────────────────────────────────────────────
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  addedTasks.push(text);
  taskInput.value = '';
  renderAddedTasks();
  setActiveDot(3);
  addXP(10, addTaskBtn);
}

function renderAddedTasks() {
  addedTaskList.innerHTML = '';
  emptyState.style.display = addedTasks.length === 0 ? 'block' : 'none';

  addedTasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    addedTaskList.appendChild(li);
  });
}

// ─── Timer ───────────────────────────────────────────────────
const FS_RING_CIRCUMFERENCE = 2 * Math.PI * 120; // r=120 → ≈754

function renderTimer() {
  const m = Math.floor(timeRemaining / 60);
  const s = timeRemaining % 60;
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  timer.textContent = display;
  fsTimer.textContent = display;
}

function updateRing(fraction) {
  timerRing.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - fraction);
  fsRing.style.strokeDashoffset    = FS_RING_CIRCUMFERENCE * (1 - fraction);
}

startTimerBtn.addEventListener('click', () => {
  if (!selectedDuration) {
    alert('Please select a duration first.');
    return;
  }

  if (running) {
    clearInterval(timerInterval);
    running = false;
    startTimerBtn.textContent = '▶ Resume';
    fsPauseBtn.textContent = '▶ Resume';
    timerStatus.textContent = 'Paused';
    fsStatus.textContent = 'Paused';
    timerRingWrapper.classList.remove('running');
    startTimerBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  } else {
    running = true;
    startTimerBtn.textContent = '⏸ Pause';
    fsPauseBtn.textContent = '⏸ Pause';
    timerStatus.textContent = 'Focusing…';
    fsStatus.textContent = 'Focusing…';
    timerRingWrapper.classList.add('running');
    startTimerBtn.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
    fullscreenBtn.classList.remove('hidden');

    timerInterval = setInterval(() => {
      timeRemaining--;
      renderTimer();
      updateRing(timeRemaining / totalTime);

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        running = false;
        timerRingWrapper.classList.remove('running');
        timerStatus.textContent = 'Done! 🎉';
        fsStatus.textContent = 'Done! 🎉';
        startTimerBtn.textContent = '▶ Start';
        fsPauseBtn.textContent = '▶ Start';
        startTimerBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        closeFullscreen();
        fireConfetti();
        showVictory();
      }
    }, 1000);
  }
});

resetTimerBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  running = false;
  timeRemaining = totalTime || 25 * 60;
  startTimerBtn.textContent = '▶ Start';
  startTimerBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  timerStatus.textContent = 'Ready';
  timerRingWrapper.classList.remove('running');
  renderTimer();
  updateRing(1);
});

// ─── Confetti ────────────────────────────────────────────────
function fireConfetti() {
  const colors = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f953c6'];
  const end = Date.now() + 3500;

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0, y: 0.65 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1, y: 0.65 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  // Big central burst after a beat
  setTimeout(() => {
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors, scalar: 1.2 });
  }, 300);
}

// ─── Victory overlay ─────────────────────────────────────────
function showVictory() {
  const xpEarned = 50;
  addXP(xpEarned, startTimerBtn);

  victorySub.textContent = addedTasks.length > 0
    ? `You completed ${addedTasks.length} task${addedTasks.length > 1 ? 's' : ''}. Legendary! 🦁`
    : 'Incredible focus session! You crushed it.';

  victoryStats.innerHTML = `
    <div class="victory-stat"><span>${selectedDuration}m</span>focused</div>
    <div class="victory-stat"><span>${addedTasks.length}</span>task${addedTasks.length !== 1 ? 's' : ''}</div>
    <div class="victory-stat"><span>+${xpEarned}</span>XP earned</div>
  `;

  victoryOverlay.classList.remove('hidden');
}

victoryClose.addEventListener('click', () => {
  victoryOverlay.classList.add('hidden');
});

// ─── Fullscreen Timer ────────────────────────────────────────
function openFullscreen() {
  // Populate task display
  const energy = energyLevel === 'high' ? '⚡ High Energy' : '🌙 Low Energy';
  fsEnergyTag.textContent = `${energy} · ${selectedDuration} min`;

  if (addedTasks.length === 0) {
    fsTaskMain.textContent = 'Focus Session';
    fsTaskExtra.innerHTML = '';
  } else if (addedTasks.length === 1) {
    fsTaskMain.textContent = addedTasks[0];
    fsTaskExtra.innerHTML = '';
  } else {
    fsTaskMain.textContent = addedTasks[0];
    fsTaskExtra.innerHTML = addedTasks.slice(1).map(t => `<li>${t}</li>`).join('');
  }

  // Sync ring state
  fsRing.style.strokeDasharray = FS_RING_CIRCUMFERENCE;
  updateRing(timeRemaining / totalTime);

  fullscreenTimer.classList.remove('hidden');
  document.documentElement.requestFullscreen?.().catch(() => {});
}

function closeFullscreen() {
  fullscreenTimer.classList.add('hidden');
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
}

fullscreenBtn.addEventListener('click', openFullscreen);
fsExitBtn.addEventListener('click', closeFullscreen);

// Fullscreen pause mirrors main start button
fsPauseBtn.addEventListener('click', () => startTimerBtn.click());

// Sync if browser exits fullscreen via Escape key
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) fullscreenTimer.classList.add('hidden');
});

// ─── Schedule later toggle ───────────────────────────────────
scheduleLaterBtn.addEventListener('click', () => {
  const isOpen = !calendarSection.classList.contains('hidden');
  if (isOpen) {
    calendarSection.classList.add('hidden');
    scheduleLaterBtn.classList.remove('open');
  } else {
    showStep(calendarSection);
    scheduleLaterBtn.classList.add('open');
  }
});

// ─── Calendar helpers ────────────────────────────────────────

// Pre-fill date/time inputs to "today at next round hour"
(function seedDatetime() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('calDate').value =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  document.getElementById('calTime').value =
    `${pad(now.getHours())}:00`;
})();

function getCalendarParams() {
  const dateVal = document.getElementById('calDate').value;
  const timeVal = document.getElementById('calTime').value;

  if (!dateVal || !timeVal) {
    alert('Please pick a date and start time first.');
    return null;
  }
  if (!selectedDuration) {
    alert('Please select a session duration first.');
    return null;
  }

  const title = addedTasks.length > 0
    ? `TimeBox: ${addedTasks.join(', ')}`
    : 'TimeBox Focus Session';

  const description = addedTasks.length > 0
    ? `Focus tasks:\n• ${addedTasks.join('\n• ')}\n\nDuration: ${selectedDuration} minutes`
    : `TimeBox focus session — ${selectedDuration} minutes`;

  const start = new Date(`${dateVal}T${timeVal}:00`);
  const end   = new Date(start.getTime() + parseInt(selectedDuration, 10) * 60 * 1000);

  return { title, description, start, end };
}

// Format: YYYYMMDDTHHmmSS (local, no Z — Google interprets as local)
function toGCalDate(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}` +
         `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// Format: YYYY-MM-DDTHH:mm:ss
function toOutlookDate(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}` +
         `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Format: YYYYMMDDTHHmmSSZ (UTC)
function toICSDate(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}` +
         `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

googleCalendarBtn.addEventListener('click', () => {
  const p = getCalendarParams();
  if (!p) return;
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', p.title);
  url.searchParams.set('dates', `${toGCalDate(p.start)}/${toGCalDate(p.end)}`);
  url.searchParams.set('details', p.description);
  window.open(url.toString(), '_blank');
});

outlookCalendarBtn.addEventListener('click', () => {
  const p = getCalendarParams();
  if (!p) return;
  const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  url.searchParams.set('rru', 'addevent');
  url.searchParams.set('subject', p.title);
  url.searchParams.set('startdt', toOutlookDate(p.start));
  url.searchParams.set('enddt', toOutlookDate(p.end));
  url.searchParams.set('body', p.description);
  window.open(url.toString(), '_blank');
});

icalCalendarBtn.addEventListener('click', () => {
  const p = getCalendarParams();
  if (!p) return;

  const uid = `timebox-${Date.now()}@timebox.app`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TimeBox//ADHD Focus Tool//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(p.start)}`,
    `DTEND:${toICSDate(p.end)}`,
    `SUMMARY:${p.title}`,
    `DESCRIPTION:${p.description.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'timebox-session.ics';
  link.click();
  URL.revokeObjectURL(link.href);
});

// ─── Init ────────────────────────────────────────────────────
fsRing.style.strokeDasharray  = FS_RING_CIRCUMFERENCE;
fsRing.style.strokeDashoffset = FS_RING_CIRCUMFERENCE;
renderTimer();
renderAddedTasks();
