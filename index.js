(() => {

  const project = {
    name: '',
    description: '',
    periods: []
  };

  const period = {from: 0, to: 0}

  const stop = (timer) => {
    timer.elapsed = Date.now() - timer.started;
  };
  
  const handleStartClicked = (ev) => {
    const oldTimer = loadTimer();
    if (oldTimer) {
      handleStopClicked();      
    }
    const newTimer = initializeTimer();
    start(newTimer, 'Orga');
    storeTimer(newTimer);
  };

  const initializeTimer = () => {
    return {
      started: 0,
      elapsed: 0,
      projectName: ''
    }
  };

  const start = (timer, projectName) => {
    timer.started = Date.now();
    timer.projectName = projectName;
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
  
  const updateProject = (timer, projects) => {
    const project = findProjectByName(projects, timer.projectName);
    if (project === undefined) {
      console.log('Could not find project "' + timer.projectName + '".');
      projects.push({
        name: timer.projectName,
        description:'tttdescription',
        periods: [timer.elapsed]});
    } else {
      project.periods.push(timer.elapsed);
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
      project.periods.forEach(period => {
        elapsedTime += period;
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
    document.getElementById('startbutton').addEventListener('click', handleStartClicked);
    document.getElementById('stopbutton').addEventListener('click', handleStopClicked);
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
          projectName: stored.projectName
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