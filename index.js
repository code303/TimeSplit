(() => {

  const project = {
    name: '',
    description: '',
    ranges: []
  };

  const range = {from: 0, to: 0}

  const stop = (timer) => {
    timer.stopped = Date.now();
  };
  
  const handleStartClicked = (trigger, project, taskDescription) => {
    deactivateAllButtons();
    trigger.classList.add('active');
    const currentTimer = loadTimer();
    if (currentTimer) {
      handleStopClicked();      
    }
    const newTimer = initializeTimer();
    start(newTimer, project, taskDescription);
    storeTimer(newTimer);
  };

  const initializeTimer = () => {
    return {
      started: 0,
      stopped: 0,
      elapsed: 0,
      projectName: '',
      taskDescription: ''
    }
  };

  const start = (timer, projectName, taskDescription) => {
    timer.started = Date.now();
    timer.projectName = projectName;
    timer.taskDescription = taskDescription;
    return timer;
  };
  
  const handleStopClicked = (ev) => {
    const timer = loadTimer();
    if (timer === null) {
      return;
    }
    const projects = loadProjects();
    stop(timer);
    updateProject(timer, projects);
    storeProjects(projects);
    deleteTimer();
  };
  
  const handleBreakClicked = (ev) => { handleStartClicked(ev.target, "Break", ""); }
  const handleOrgaClicked = (ev) => { handleStartClicked(ev.target, "Orga", "Emails, iTrac"); }
  const handleDevelopmentClicked = (ev) => { handleStartClicked(ev.target, "Development", "coding..."); }
  const handleBugfixClicked = (ev) => { handleStartClicked(ev.target, "Bugfix", "fixing..."); }
  const handleDocumentationClicked = (ev) => { handleStartClicked(ev.target, "Documentation", "doc..."); }
  const handleResearchClicked = (ev) => { handleStartClicked(ev.target, "Research", "researching..."); }
1
  const deactivateAllButtons = () => {
    const buttons = document.getElementsByClassName('timerStart');
    Array.prototype.forEach.call(buttons, function(button) {button.classList.remove('active');});
  }

  const updateProject = (timer, projects) => {
    const project = findProjectByName(projects, timer.projectName);
    const range = {from: timer.started, to: timer.stopped};
    if (project === undefined) {
      console.log('Could not find project "' + timer.projectName + '".');
      projects.push({
        name: timer.projectName,
        description:'tttdescription',
        ranges: range});
    } else {
      project.ranges.push(range);
    }
  };

  const findProjectByName = (projects, projectName) => {
    for (p of projects) {
      if (p.name === projectName) {
        return p;
      }
    };
    return undefined;
  };

  const updateAccumulatedDisplay = () => {
    const timer = loadTimer();
    const projects = loadProjects();
    let elapsedTime = getAllTimePeriods(projects);
    if (timer && timer.started > 0) {
      elapsedTime += (Date.now() - timer.started);
    }
    document.getElementById('accumulatedDisplay').innerText = formatMilliseconds(elapsedTime);
  };

  const getAllTimePeriods = (projects) => {
    let elapsedTime = 0;
    projects.forEach(project => {
      project.ranges.forEach((range) => {
        elapsedTime += (range.stopped - range.started);
      });
    });
    return elapsedTime;
  };

  // Format the time as HH:MM:SS
  const formatMilliseconds = (milliseconds) => {
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

  const startGuiUpdateTimer = () => {
    setInterval(updateAccumulatedDisplay, 1000);
  };

  const registerEvents = () => {
    document.getElementById('stopbutton').addEventListener('click', handleStopClicked);
    document.getElementById('break').addEventListener('click', handleBreakClicked);
    document.getElementById('orga').addEventListener('click', handleOrgaClicked);
    document.getElementById('develop').addEventListener('click', handleDevelopmentClicked);
    document.getElementById('bugfix').addEventListener('click', handleBugfixClicked);
    document.getElementById('documentation').addEventListener('click', handleDocumentationClicked);
    document.getElementById('research').addEventListener('click', handleResearchClicked);
  };

  const storeTimer = (timer) => {
    if (window.localStorage) {
      window.localStorage.setItem('timer', JSON.stringify(timer));
    }
  };

  const loadTimer = () => {
    if (window.localStorage) {
      const stored = JSON.parse(window.localStorage.getItem('timer'));
      if (stored) {
        return {
          started: stored.started,
          elapsed: stored.elapsed,
          projectName: stored.projectName,
          taskDescription: stored.taskDescription
        };
      }
    }

    return null;
  };


  const deleteTimer = () => {
    if (window.localStorage) {
      window.localStorage.removeItem('timer');
    }
  };

  const loadProjects = () => {
    if (window.localStorage) {
      const stored = JSON.parse(window.localStorage.getItem('projects'));
      if (stored) {
        return stored;
      }
    }

    return [];
  };

  const storeProjects = (projects) => {
    if (window.localStorage) {
      window.localStorage.setItem('projects', JSON.stringify(projects)); 
    }
  };

  const deleteProjects = () => {
    if (window.localStorage) {
      window.localStorage.removeItem('projects');
    }
  };

  const main = () => {
    registerEvents();
    startGuiUpdateTimer();
  };

  main();

})();