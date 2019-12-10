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
            updateElapedTime(projects, currentProjectId, Date.now() - timer.start);
        }, 60000);
    }
    
    const updateElapedTime = function updateElapedTime(projects, currentProjectId, elapsedTime) {
        const project = tools.getProjectFromId(projects, currentProjectId);
        const displayTime = tools.formatHHMM((parseInt(project.elapsedTime, 10) + parseInt(elapsedTime, 10)));
        console.log('Display: project: ' + project.elapsedTime + ', elapsedTime: ' + elapsedTime + ', displayTime: ' + displayTime);
        document.querySelector('div#project_' + currentProjectId +' span.elapsedTime').innerHTML = displayTime;
        document.querySelector('span#summaryTime').innerHTML = tools.formatHHMM(sumUpTime(projects, elapsedTime));
    }

    const sumUpTime = function sumUpTime(projects, elapsedTime) {
        let i = 0;
        let accumulatedTime = elapsedTime;
        for (i = 0; i < projects.length; i++) {
            if (projects[i].name != 'Pause') {
                accumulatedTime = accumulatedTime + projects[i].elapsedTime;
            }
        }
        return accumulatedTime;
    }

    const handleFocusSwitch = function handleFocusSwitch(projectId) {
        ipcRenderer.send('switchFocus', projectId);
        document.querySelectorAll('button.active')[0].classList.remove('active');
        document.getElementById(`project_${projectId}`).childNodes[0].classList.add('active');
        currentProjectId = projectId;
        clearInterval(timer.id);
        startTimer(projects, currentProjectId);
    };

    const sendProjectDescription = function sendProjectDescription(projectId, description) {
        ipcRenderer.send('editDescription', projectId, description);
    }

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
    }

    const renderProject = function renderProject(project, isCurrentProject) {
        return `<div class="project" id="project_${project.id}">` +
            `${renderButton(project.id, project.name, isCurrentProject)}` +
            `${renderElapsedTime(project.elapsedTime)}` +
            `${renderDescriptionInput(project.id, project.description)}` +
            `</div>`;
    }

    const renderButton = function renderButton(projectId, projectName, isCurrentProject) {
        if (isCurrentProject) {
            return `<button class="active" onclick="App.handleFocusSwitch(${projectId});">${projectName}</button>`;
        }
        return `<button onclick="App.handleFocusSwitch(${projectId});">${projectName}</button>`;
    }
    
    const renderElapsedTime = function renderElapsedTime(elapsedTime) {
        return `<span class="elapsedTime">${elapsedTime}</span>`;
    }

    const renderDescriptionInput = function renderDescriptionInput(projectId, description) {
        return `<input class="descriptionInput" type="text" onchange="App.sendProjectDescription(${projectId}, this.value);" name="Description" value="${description}">`;
    }

    return {
        handleFocusSwitch: handleFocusSwitch,
        sendProjectDescription: sendProjectDescription,
        projects: projects,
        renderProjects: renderProjects
    };
})();