/// <reference path="timer.ts"/>
/// <reference path="config.ts"/>

type TimeRange = {
  from: number;
  to: number;
}

type Project = {
  name: string;
  description: string;
  category: string;
  ranges: TimeRange[];
};

const handleStartClicked = (trigger: any, projectName: string): void => {
  deactivateAllButtons();
  const currentTask: Task = TIMER.load();
  if (currentTask && currentTask.started > 0) {
    handleStopClicked({});      
  }
  activateButton(trigger);
  const input = document.getElementById('description' + projectName) as HTMLInputElement;
  const newTask = TIMER.initialize(projectName, input.value);
  const projects = loadProjects();
  updateProject(newTask, projects);
  storeProjects(projects);
  TIMER.start(newTask);
  TIMER.store(newTask);
};

const activateButton = (button: any): void => {
  button.classList.add('active');
};

const handleStopClicked = function handleStopClicked(ev: object): void {
  const task = TIMER.load();
  if (task.started === 0) {
    return;
  }
  const projects = loadProjects();
  TIMER.stop(task);
  updateProject(task, projects);
  storeProjects(projects);
  TIMER.remove();
  deactivateAllButtons();
};
  
const deactivateAllButtons = () => {
  const buttons = document.getElementsByClassName('timerStart');
  Array.prototype.forEach.call(buttons, function(button) {button.classList.remove('active');});
};

const updateProject = (task: Task, projects: Project[]): void => {
  const project: Project = findProjectByName(projects, task.projectName);
  const range: TimeRange = {from: task.started, to: task.stopped};
  if (project.name === '') {
    console.log('Could not find project "' + task.projectName + '".');
    project.name = task.projectName;
    project.description = task.description;
    project.ranges.push(range);

    projects.push(project);
  } else {
    project.ranges.push(range);
  }
};

const handleDetailsChanged = (eventTarget: EventTarget, projectName: string) => {
  const text = (eventTarget as HTMLInputElement).value;
  console.log('Text changed to: ' + text);
  const projects = loadProjects();
  projects.filter(project => project.name === projectName).forEach(project => project.description = text);
  storeProjects(projects);
  const task = TIMER.load();
  task.description = text;
  TIMER.store(task);
};

const findProjectByName = (projects: Project[], projectName: string): Project => {
  for (const p of projects) {
    if (p.name === projectName) {
      return p;
    }
  };
  return {name: '', description: '', category: '', ranges: []};
};

const updateAccumulatedDisplay = (): void => {
  const task = TIMER.load();
  const projects = loadProjects();
  let elapsedTime = getAllTimePeriods(projects);
  if (task && (task.projectName !== 'break') && task.started > 0) {
    elapsedTime += (Date.now() - task.started);
  }
  document.getElementById('accumulatedDisplay').innerText = formatMilliseconds(elapsedTime);
};

const getAllTimePeriods = (projects: Project[]): number => {
  let elapsedTime = 0;
  projects.filter(p => p.name !== 'break').forEach(project => {
    project.ranges.forEach((range: TimeRange) => {
      elapsedTime += (range.to - range.from);
    });
  });
  return elapsedTime;
};

// Convert the given timestamp in millis since 1970 into time string as HH:MM:SS
const formatMilliseconds = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');

  return formattedTime;
};

const getHoursAndMinutesFromMilliseconds = (milliseconds: number): string => {
  const formattedSeconds: string = formatMilliseconds(milliseconds);
  return formattedSeconds.substring(0,5);
};

const startGuiUpdateTimer = (): void => {
  setInterval(updateAccumulatedDisplay, 1000);
  setInterval(updateAllProjectTimerDisplays, 1000);
};

function registerEvents(): void {
  document.getElementById('stopbutton').addEventListener('click', handleStopClicked);
};

const updateAllProjectTimerDisplays = (): void => {
  const projects: Project[] = loadProjects();
  projects.forEach(project => {
    let sum = 0;
    project.ranges.forEach(range => {sum += (range.to - range.from)});
    if (project.name === TIMER.load().projectName) {
      sum += (Date.now() - TIMER.load().started);
    }
    updateProjectTimerDisplay(project, sum);
  });
};

const updateProjectTimerDisplay = (project: Project, elapsedMilliseconds: number) => {
  const timerDisplay = document.getElementById('displayTime'+project.name);
  if (timerDisplay) {
    timerDisplay.innerText = getHoursAndMinutesFromMilliseconds(elapsedMilliseconds);
  }

};

const loadProjects = (): Project[] => {
  if (window.localStorage) {
    const stored = JSON.parse(window.localStorage.getItem('projects'));
    if (stored) {
      return stored;
    }
  }
  return [];
};

const storeProjects = (projects): void => {
  if (window.localStorage) {
    window.localStorage.setItem('projects', JSON.stringify(projects)); 
  }
};

const deleteProjects = (): void => {
  if (window.localStorage) {
    window.localStorage.removeItem('projects');
  }
};

const initializeHtmlElements = (): void => {
  const config = CONFIG;
  const task = TIMER.load();
  const projects = loadProjects();
  const container = document.getElementsByClassName('grid-container').item(0);
  
  config.projects.forEach(configProject => {
    const button = generateButton(configProject.name, task);
    const project = findProjectByName(projects, configProject.name);
    container.appendChild(button);

    const displayTime = generateClockDisplay(configProject.name, task);
    container.appendChild(displayTime);

    const description = generateTaskInput(task, configProject.name, project.description, configProject.description);
    container.appendChild(description);
  });
};

const generateButton = (projectName: string, task: Task): HTMLButtonElement => {
  const button = document.createElement('button');
  button.id = projectName;
  button.classList.add('timerStart');
  if (task && task.projectName === projectName) {
    button.classList.add('active');
  }
  button.innerText = projectName;
  button.addEventListener('click', (ev) => {
    handleStartClicked(ev.target, projectName);
  });
  return button;
};

const generateClockDisplay = (projectName: string, task: Task): HTMLSpanElement => {
  const displayTime = document.createElement('span');
  displayTime.id = 'displayTime' + projectName;
  if (task && task.projectName === projectName) {
    displayTime.innerText = formatMilliseconds(Date.now() - task.started);
  } else {
    displayTime.innerText = '00:00';
  }
  displayTime.classList.add('clock');
  return displayTime;
}

const generateTaskInput = (task: Task, projectName: string, projectDescription: string, defaultDescription: string): HTMLInputElement => {
  const input = document.createElement('input');
  input.id = 'description' + projectName;
  if (task && task.projectName === projectName) {
    input.value = task.description;
  } else if (projectDescription) {
    input.value = projectDescription;
  } else {
    input.value = defaultDescription;
  }
  input.addEventListener('input', (ev) => {
    handleDetailsChanged(ev.target, projectName);});
  return input;
}

const setVersionInfo = (version: string): void => {
  document.getElementById('versionLabel').innerText = version;
};

function main(): void  {
  setVersionInfo(CONFIG.version);
  initializeHtmlElements();
  registerEvents();
  startGuiUpdateTimer();
};

main();
