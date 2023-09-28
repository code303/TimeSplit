const TASK = {
    started: 0,
    stopped: 0,
    projectName: null,
    description: 'taskDesc'
};
/// <reference path="task.ts"/>
const TIMER = {
    load: function loadTimer() {
        if (window.localStorage) {
            const stored = JSON.parse(window.localStorage.getItem('task'));
            if (stored) {
                return {
                    started: stored.started,
                    stopped: stored.stopped,
                    projectName: stored.projectName,
                    description: stored.description
                };
            }
            else {
                return TIMER.initialize();
            }
        }
    },
    store: function store(task) {
        if (window.localStorage) {
            const taskToSave = {
                started: task.started,
                stopped: task.stopped,
                projectName: task.projectName,
                description: task.description
            };
            window.localStorage.setItem('task', JSON.stringify(taskToSave));
        }
    },
    remove: function remove() {
        if (window.localStorage) {
            window.localStorage.removeItem('task');
        }
    },
    initialize: function initialize() {
        return {
            started: 0,
            stopped: 0,
            projectName: '',
            description: ''
        };
    },
    start: function start(task, projectName, taskDescription) {
        task.started = Date.now();
        task.projectName = projectName;
        task.description = taskDescription;
        return task;
    },
    stop: function stop(task) {
        task.stopped = Date.now();
    }
};
/// <reference path="timer.ts"/>
const handleStartClicked = (trigger, projectName, taskDescription) => {
    deactivateAllButtons();
    trigger.classList.add('active');
    const currentTask = TIMER.load();
    if (currentTask.started > 0) {
        handleStopClicked({});
    }
    const newTask = TIMER.initialize();
    TIMER.start(newTask, projectName, taskDescription);
    TIMER.store(newTask);
};
function handleStopClicked(ev) {
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
}
;
const handleBreakClicked = (ev) => { handleStartClicked(ev.target, "Break", ""); };
const handleOrgaClicked = (ev) => { handleStartClicked(ev.target, "Orga", "Emails, iTrac"); };
const handleDevelopmentClicked = (ev) => { handleStartClicked(ev.target, "Development", "coding..."); };
const handleBugfixClicked = (ev) => { handleStartClicked(ev.target, "Bugfix", "fixing..."); };
const handleDocumentationClicked = (ev) => { handleStartClicked(ev.target, "Documentation", "doc..."); };
const handleResearchClicked = (ev) => { handleStartClicked(ev.target, "Research", "researching..."); };
const deactivateAllButtons = () => {
    const buttons = document.getElementsByClassName('timerStart');
    Array.prototype.forEach.call(buttons, function (button) { button.classList.remove('active'); });
};
const updateProject = (task, projects) => {
    const project = findProjectByName(projects, task.projectName);
    const range = { from: task.started, to: task.stopped };
    if (project.name === '') {
        console.log('Could not find project "' + task.projectName + '".');
        project.name = task.projectName;
        project.description = task.description;
        project.ranges.push(range);
        projects.push(project);
    }
    else {
        project.ranges.push(range);
    }
};
const findProjectByName = (projects, projectName) => {
    for (const p of projects) {
        if (p.name === projectName) {
            return p;
        }
    }
    ;
    return { name: '', description: '', ranges: [] };
};
const updateAccumulatedDisplay = () => {
    const task = TIMER.load();
    const projects = loadProjects();
    let elapsedTime = getAllTimePeriods(projects);
    if (task && task.started > 0) {
        elapsedTime += (Date.now() - task.started);
    }
    document.getElementById('accumulatedDisplay').innerText = formatMilliseconds(elapsedTime);
};
const getAllTimePeriods = (projects) => {
    let elapsedTime = 0;
    projects.forEach(project => {
        project.ranges.forEach((range) => {
            elapsedTime += (range.to - range.from);
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
};
const startGuiUpdateTimer = () => {
    setInterval(updateAccumulatedDisplay, 1000);
};
function registerEvents() {
    document.getElementById('stopbutton').addEventListener('click', handleStopClicked);
    document.getElementById('break').addEventListener('click', handleBreakClicked);
    document.getElementById('orga').addEventListener('click', handleOrgaClicked);
    document.getElementById('develop').addEventListener('click', handleDevelopmentClicked);
    document.getElementById('bugfix').addEventListener('click', handleBugfixClicked);
    document.getElementById('documentation').addEventListener('click', handleDocumentationClicked);
    document.getElementById('research').addEventListener('click', handleResearchClicked);
}
;
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
function main() {
    registerEvents();
    startGuiUpdateTimer();
}
;
main();
