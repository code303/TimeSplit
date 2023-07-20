(() => {

  const projects = new Map();

  const project = {
    name: '',
    description: '',
    periods: []
  };

  const timer = {
    started: 0,
    projectName: '',
    stop: () => {
      
    }
  };

  const period = {from: 0, to: 0}

  const stopTimer = (timer) => {
    const elapsed = Date.now() - timer.started;
    //timer.stopped = Date.now();
    if (projects.has(timer.projectName)) {
      projects.get(timer.projectName).periods.push(elapsed); 
    } else {
      projects.set(timer.projectName, {name: 'ttt', description:'tttdecs', periods: [elapsed]});
    }
    console.log(JSON.stringify(projects.get(timer.projectName))); 
  };

  const handleStartClicked = (ev) => {
    console.log('Start clicked');
    timer.started = Date.now();
    timer.projectName = 'Orga';
    console.log('Timer started: ' + timer.started);
  };

  const handleStopClicked = (ev) => {
    console.log('Stop clicked');
    stopTimer(timer);
    console.log('Timer stopped: ' + timer.stopped);
  };

  const updateAccumulatedDisplay = () => {
    document.getElementById('accumulatedDisplay').innerText = (timer.stopped - timer.started)/1000;
  };

  const startGuiUpdateTimer = () => {
    setInterval(updateAccumulatedDisplay, 1000);
  };

  const registerEvents = () => {
    document.getElementById('startbutton').addEventListener('click', handleStartClicked);
    document.getElementById('stopbutton').addEventListener('click', handleStopClicked);
  };

  const main = () => {
    console.log("Starting...");
    registerEvents();
    startGuiUpdateTimer();
  };
  main();
})();