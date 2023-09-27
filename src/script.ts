/// <reference path="timer.ts"/>

type TimeRange = {
  from: number,
  to: number
}

type Project = {
    name: string,
    description: string,
    ranges: TimeRange[]
  };

const handleStartClicked = (trigger: any, projectName: string, taskDescription: string): void => {
    deactivateAllButtons();
    trigger.classList.add('active');
    TIMER.load();
    if (TIMER.started > 0) {
      handleStopClicked({});      
    }
    TIMER.initialize();
    TIMER.start(projectName, taskDescription);
    TIMER.store();
  };

function handleStopClicked(ev: object): void {
  TIMER.load();
  if (TIMER.started === 0) {
    return;
  }
  const projects = loadProjects();
  TIMER.stop();
  updateProject(projects);
  storeProjects(projects);
  TIMER.remove();
  TIMER.initialize();
  deactivateAllButtons();
};
  
  const handleBreakClicked = (ev) => { handleStartClicked(ev.target, "Break", ""); }
  const handleOrgaClicked = (ev) => { handleStartClicked(ev.target, "Orga", "Emails, iTrac"); }
  const handleDevelopmentClicked = (ev) => { handleStartClicked(ev.target, "Development", "coding..."); }
  const handleBugfixClicked = (ev) => { handleStartClicked(ev.target, "Bugfix", "fixing..."); }
  const handleDocumentationClicked = (ev) => { handleStartClicked(ev.target, "Documentation", "doc..."); }
  const handleResearchClicked = (ev) => { handleStartClicked(ev.target, "Research", "researching..."); }
  const deactivateAllButtons = () => {
    const buttons = document.getElementsByClassName('timerStart');
    Array.prototype.forEach.call(buttons, function(button) {button.classList.remove('active');});
  }


  const updateProject = (projects: Project[]): void => {
    const project: Project = findProjectByName(projects, TIMER.projectName);
    const range: TimeRange = {from: TIMER.started, to: TIMER.stopped};
    if (project.name === '') {
      console.log('Could not find project "' + TIMER.projectName + '".');
      project.name = TIMER.projectName;
      project.description = TIMER.taskDescription;
      project.ranges.push(range);

      projects.push(project);
    } else {
      project.ranges.push(range);
    }
  };

  const findProjectByName = (projects: Project[], projectName: string): Project => {
    for (const p of projects) {
      if (p.name === projectName) {
        return p;
      }
    };
    return {name: '', description: '', ranges: []};
  };

  const updateAccumulatedDisplay = (): void => {
    TIMER.load();
    const projects = loadProjects();
    let elapsedTime = getAllTimePeriods(projects);
    if (TIMER && TIMER.started > 0) {
      elapsedTime += (Date.now() - TIMER.started);
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

  // Format the time as HH:MM:SS
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
  }

  const startGuiUpdateTimer = (): void => {
    setInterval(updateAccumulatedDisplay, 1000);
  };

function registerEvents(): void {
  document.getElementById('stopbutton').addEventListener('click', handleStopClicked);
  document.getElementById('break').addEventListener('click', handleBreakClicked);
  document.getElementById('orga').addEventListener('click', handleOrgaClicked);
  document.getElementById('develop').addEventListener('click', handleDevelopmentClicked);
  document.getElementById('bugfix').addEventListener('click', handleBugfixClicked);
  document.getElementById('documentation').addEventListener('click', handleDocumentationClicked);
  document.getElementById('research').addEventListener('click', handleResearchClicked);
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

function main(): void  {
  registerEvents();
  startGuiUpdateTimer();
};

main();