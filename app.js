// app.js
const highEnergyBtn = document.getElementById('highEnergyBtn');
const lowEnergyBtn = document.getElementById('lowEnergyBtn');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const addedTaskList = document.getElementById('addedTaskList');
const timer = document.getElementById('timer');
const startTimerBtn = document.getElementById('startTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const googleCalendarBtn = document.getElementById('googleCalendarBtn');
const outlookCalendarBtn = document.getElementById('outlookCalendarBtn');
const icalCalendarBtn = document.getElementById('icalCalendarBtn');
const durationSelect = document.getElementById('durationSelect');
const timeframeSelect = document.getElementById('timeframeSelect');
const durationSelectContainer = document.getElementById('durationSelectContainer');
const suggestedTasksContainer = document.getElementById('suggestedTasksContainer');
const addTaskContainer = document.getElementById('addTaskContainer');

let energyLevel = null;
let selectedDuration = null;
let selectedTimeframe = null;
let tasks = [];
let addedTasks = [];
let timeRemaining = 25 * 60; // 25 minutes in seconds
let timerInterval;

const lowEnergyTasks = {
  '10': [
    'Check and respond to emails',
    'Review and organize your to-do list',
    'Read a book or listen to an audiobook',
    'Watch an educational or informative video',
    'Engage in light stretching or yoga'
  ],
  '20': [
    'Listen to a podcast or audiobook',
    'Tidy up and organize a small area',
    'Browse and research topics of interest',
    'Practice a relaxing hobby like coloring or journaling',
    'Take a walk or engage in light exercise'
  ],
  '30': [
    'Organize and sort through digital photos',
    'Update your calendar and schedule',
    'Make a grocery list and plan meals',
    'Practice deep breathing or relaxation exercises',
    'Listen to calming music or nature sounds'
  ],
  '60': [
    'Read inspirational or motivational material',
    'Engage in light decluttering or organization',
    'Practice gratitude or positive affirmations',
    'Catch up on light reading or articles',
    'Engage in a simple craft project or puzzle'
  ]
};

const highEnergyTasks = {
  '10': [
    'Work on a challenging project',
    'Organize and declutter your workspace',
    'Exercise or engage in physical activity',
    'Tackle a difficult task you\'ve been avoiding',
    'Learn a new skill or take an online course'
  ],
  '20': [
    'Brainstorm and plan for a future project',
    'Write a blog post or article',
    'Prepare a presentation or speech',
    'Research and plan a trip or adventure',
    'Engage in a creative hobby like painting or writing'
  ],
  '30': [
    'Organize and file important documents',
    'Deep clean and organize a room or area',
    'Plan and prepare healthy meals for the week',
    'Tackle a home improvement project',
    'Work on your resume or job applications'
  ],
  '60': [
    'Volunteer or engage in community service',
    'Organize and back up your digital files',
    'Practice mindfulness or meditation',
    'Plan and schedule important appointments or meetings',
    'Engage in a challenging physical activity like rock climbing or hiking'
  ]
};

// Function to update the task list based on energy level and duration
function updateTaskList() {
  taskList.innerHTML = '';
  const suggestedTasks = energyLevel === 'high' ? highEnergyTasks[selectedDuration] : lowEnergyTasks[selectedDuration];

  suggestedTasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    li.classList.add('cursor-pointer', 'hover:bg-gray-200');

    li.addEventListener('click', () => {
      taskInput.value = task;
    });

    taskList.appendChild(li);
  });
}

// Function to update the added task list
function updateAddedTaskList() {
  addedTaskList.innerHTML = '';
  addedTasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    addedTaskList.appendChild(li);
  });
}

// Event listeners
highEnergyBtn.addEventListener('click', () => {
  energyLevel = 'high';
  timeframeSelectContainer.style.display = 'block';
  suggestedTasksContainer.style.display = 'none';
  addTaskContainer.style.display = 'none';
});

lowEnergyBtn.addEventListener('click', () => {
  energyLevel = 'low';
  timeframeSelectContainer.style.display = 'block';
  suggestedTasksContainer.style.display = 'none';
  addTaskContainer.style.display = 'none';
});

timeframeSelect.addEventListener('change', () => {
  selectedTimeframe = timeframeSelect.value;
  if (selectedTimeframe) {
    durationSelectContainer.style.display = 'block';
  } else {
    durationSelectContainer.style.display = 'none';
    suggestedTasksContainer.style.display = 'none';
    addTaskContainer.style.display = 'none';
  }
});

durationSelect.addEventListener('change', () => {
  selectedDuration = durationSelect.value;
  if (selectedDuration) {
    suggestedTasksContainer.style.display = 'block';
    addTaskContainer.style.display = 'block';
    updateTaskList();
  } else {
    suggestedTasksContainer.style.display = 'none';
    addTaskContainer.style.display = 'none';
  }
});

addTaskBtn.addEventListener('click', () => {
  const newTask = taskInput.value.trim();
  const duration = durationSelect.value;
  if (newTask) {
    const taskWithDuration = `${newTask} (${duration} minutes)`;
    addedTasks.push(taskWithDuration);
    taskInput.value = '';
    updateAddedTaskList();
  }
});

startTimerBtn.addEventListener('click', () => {
  const selectedTimeframe = timeframeSelect.value;
  const selectedDuration = durationSelect.value * 60;

  if (selectedTimeframe && selectedDuration) {
    clearInterval(timerInterval);
    timeRemaining = selectedDuration;
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    alert('Please select both timeframe and duration before starting the timer.');
  }
});

resetTimerBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timeRemaining = 25 * 60;
  updateTimer();
});

// Timer functions
function updateTimer() {
  timeRemaining--;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (timeRemaining === 0) {
    clearInterval(timerInterval);
    alert('Time\'s up!');
  }
}

// Calendar functions
function addToGoogleCalendar() {
  // Code to add selected tasks to Google Calendar
  console.log('Adding tasks to Google Calendar...');
}

function addToOutlookCalendar() {
  // Code to add selected tasks to Outlook Calendar
  console.log('Adding tasks to Outlook Calendar...');
}

function addToIcalCalendar() {
  // Code to add selected tasks to iCal Calendar
  console.log('Adding tasks to iCal Calendar...');
}

googleCalendarBtn.addEventListener('click', addToGoogleCalendar);
outlookCalendarBtn.addEventListener('click', addToOutlookCalendar);
icalCalendarBtn.addEventListener('click', addToIcalCalendar);
