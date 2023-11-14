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

const handleStartClicked = (trigger: any, projectName: string, taskDescription: string, category: string): void => {
  deactivateAllButtons();
  const currentTask: Task = TIMER.load();
  if (currentTask.started > 0) {
    handleStopClicked({});      
  }
  activateButton(trigger);
  const newTask = TIMER.initialize(projectName, taskDescription, category);
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

const handleInputDevelopTyped = (ev) => {
  const text = ev.target.value;
  console.log('Text changed to: ' + text);
  const task = TIMER.load();
  task.description = text;
  updateProject(task, loadProjects());
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
  if (task && task.started > 0) {
    elapsedTime += (Date.now() - task.started);
  }
  document.getElementById('accumulatedDisplay').innerText = formatMilliseconds(elapsedTime);
};

const getAllTimePeriods = (projects: Project[]): number => {
  let elapsedTime = 0;
  projects.forEach(project => {
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
  //document.getElementById('inputDevelop').addEventListener('input', handleInputDevelopTyped);
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

const generateHtmlElementsFromConfig = (): void => {
  const config = CONFIG;
  const container = document.getElementsByClassName('grid-container').item(0);
  config.projects.forEach(project => {
    const button = document.createElement('button');
    button.id = project.name;
    button.classList.add('timerStart');
    button.innerText = project.name;
    button.addEventListener('click', (ev) => {
      handleStartClicked(ev.target, project.name, project.description, project.category);
    });
    container.appendChild(button);

    const displayTime = document.createElement('span');
    displayTime.id = 'displayTime' + project.name;
    displayTime.innerText = '00:00';
    displayTime.classList.add('clock');
    container.appendChild(displayTime);

    const description = document.createElement('input');
    description.id = 'description' + project.name;
    description.value = project.description;
    container.appendChild(description);
});

};

function main(): void  {
  generateHtmlElementsFromConfig();
  registerEvents();
  startGuiUpdateTimer();
};

main();
