const App = (function () {

    const { ipcRenderer } = require('electron');
    const tools = require('./tools.js');
    let projects = null;
    let currentProjectId = null;
    let timer = {start: 0, id: ''};

    ipcRenderer.on('switchFocusReply', (event, arg) => {
        projects = arg.projects;
    });

    ipcRenderer.on('editDescriptionReply', (event, arg) => {
        projects = arg.projects;
    });

    ipcRenderer.on('addTimeReply', (event, arg) => {
        projects = arg.projects;
        projectId = arg.projectId;
        updateElapedTime(currentProjectId, Date.now() - timer.start);
    });

    ipcRenderer.on('removeTimeReply', (event, arg) => {
        projects = arg.projects;
        updateElapedTime(currentProjectId, Date.now() - timer.start);
    });

    ipcRenderer.on('projects', (event, payload) => {
        console.log('Received ' + payload);
        projects = payload.projects;
        currentProjectId = payload.currentProjectId;
        renderProjects(projects, currentProjectId);
        startTimer(projects, currentProjectId);
    });

    const startTimer = function startTimer(projects, currentProjectId) {
        timer.start = Date.now();
        timer.id = setInterval(() => {
            updateElapedTime(currentProjectId, Date.now() - timer.start);
        }, 60000);
    };
    
    const updateElapedTime = function updateElapedTime(currentProjectId, elapsedTime) {
        let i = 0;
        for (i = 0; i < projects.length; i++) {
            updateElapedTimeForProject(projects[i].id, currentProjectId, elapsedTime);
        }
        document.querySelector('span#summaryTime').innerHTML = tools.formatHHMM(sumUpTime(currentProjectId, elapsedTime));
    };

    const updateElapedTimeForProject = function updateElapedTimeForProject(id, currentProjectId, elapsedTime) {
        const project = tools.getProjectFromId(projects, id);
        let  displayTime;
        if (id === currentProjectId) {
            displayTime = tools.formatHHMM(parseInt(project.elapsedTime, 10) + parseInt(elapsedTime, 10));
        } else {
            displayTime = tools.formatHHMM(parseInt(project.elapsedTime, 10));
        }
        document.querySelector('div#project_' + id +' span.elapsedTime').innerHTML = displayTime;
    }

    const sumUpTime = function sumUpTime(currentProjectId, elapsedTime) {
        let i = 0;
        const currentProject = tools.getProjectFromId(projects, currentProjectId).name;
        let accumulatedTime = (currentProject === 'Pause') ? 0 : elapsedTime;

        for (i = 0; i < projects.length; i++) {
            if (projects[i].name != 'Pause') {
                accumulatedTime = accumulatedTime + projects[i].elapsedTime;
            }
        }
        return accumulatedTime;
    };

    const handleFocusSwitch = function handleFocusSwitch(projectId) {
        ipcRenderer.send('switchFocus', projectId);
        document.querySelectorAll('button.active')[0].classList.remove('active');
        document.getElementById(`project_${projectId}`).childNodes[0].classList.add('active');
        currentProjectId = projectId;
        clearInterval(timer.id);
        startTimer(projects, currentProjectId);
    };

    const handleAdjustTime = function handleAdjustTime(projectId, milliseconds) {
        if (projectId && milliseconds && typeof(milliseconds) === 'number') {
            if (milliseconds > 0) {
                ipcRenderer.send('addTime', projectId, milliseconds);
            } else {
                ipcRenderer.send('removeTime', projectId, milliseconds);
            }
        }
    };

    const sendProjectDescription = function sendProjectDescription(projectId, description) {
        ipcRenderer.send('editDescription', projectId, description);
    };

    const renderProjects = function renderProjects(projects, currentProjectId) {
        let html = '';
        for (let i = 0; i < projects.length; i++) {
            const isCurrentProject = (currentProjectId === projects[i].id);
            html += renderProject(projects[i], isCurrentProject);
        }
        window.document.getElementById('projects').innerHTML = html;
        window.document.getElementById('projects').appendChild(createSummary(0));
    };

    const createSummary = function createSummary(time) {
        const div = window.document.createElement('div');
        div.classList.add('project');
        const span1 = document.createElement('span');
        span1.setAttribute('style', 'grid-column = "1 / span 1"');
        
        const span2 = document.createElement('span');
        span2.classList.add('elapsedTime');
        span2.innerText = tools.formatHHMM(time);
        span2.setAttribute('style', 'grid-column = "2 / span 1"');
        span2.setAttribute('id', 'summaryTime');
        
        const span3 = document.createElement('span');
        span3.setAttribute('style', 'grid-column = "3 / span 1"');
        
        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(span3);
        return div;
    };

    const renderProject = function renderProject(project, isCurrentProject) {
        return `<div class="project" id="project_${project.id}">` +
            `${renderButton(project.id, project.name, isCurrentProject)}` +
            `${renderElapsedTime(project.elapsedTime)}` +
            `${renderDescriptionInput(project.id, project.description)}` +
            `${renderTimeAdjustmentButtons(project.id)}` +
            `</div>`;
    };

    const renderButton = function renderButton(projectId, projectName, isCurrentProject) {
        if (isCurrentProject) {
            return `<button class="projectButton active" onclick="App.handleFocusSwitch(${projectId});">${projectName}</button>`;
        }
        return `<button class="projectButton" onclick="App.handleFocusSwitch(${projectId});">${projectName}</button>`;
    };
    
    const renderElapsedTime = function renderElapsedTime(elapsedTime) {
        return `<span class="elapsedTime">${elapsedTime}</span>`;
    };

    const renderDescriptionInput = function renderDescriptionInput(projectId, description) {
        return `<input class="descriptionInput" type="text" onchange="App.sendProjectDescription(${projectId}, this.value);" name="Description" value="${description}">`;
    };

    const renderTimeAdjustmentButtons = function renderTimeAdjustmentButtons(projectId) {
        let html =  '<div class="adjustmentButtons">';
        html = html + `<button onclick="App.handleAdjustTime(${projectId}, -3600000);">&lt;&lt;</button>`;
        html = html + `<button onclick="App.handleAdjustTime(${projectId}, -600000);">&lt;</button>`;
        html = html + `<button onclick="App.handleAdjustTime(${projectId}, 600000);">&gt;</button>`;
        html = html + `<button onclick="App.handleAdjustTime(${projectId}, 3600000);">&gt;&gt;</button>`;
        html = html + '</div>'
        return html;
    };

    return {
        handleFocusSwitch: handleFocusSwitch,
        handleAdjustTime: handleAdjustTime,
        sendProjectDescription: sendProjectDescription,
        projects: projects,
        renderProjects: renderProjects
    };
})();