const App = (function () {

    const { ipcRenderer } = require('electron');
    let projects = null;
    let currentProjectId = null;

    ipcRenderer.on('switchFocusReply', (event, arg) => {
        console.log('Received event ' + arg);
    });

    ipcRenderer.on('projects', (event, payload) => {
        console.log('Received ' + payload);
        projects = payload.projects;
        currentProjectId = payload.currentProjectId;
        renderProjects(projects, currentProjectId);
        startTimer(projects, currentProjectId);
    });

    const startTimer = function startTimer(projects, currentProjectId) {
        setInterval(() => {document.querySelector('div#project_' + currentProjectId +' span.elapsedTime').innerHTML = 'fooo'}, 1000);
    }

    const sendMessage = function sendMessage(projectId) {
        ipcRenderer.send('switchFocus', projectId);
    };

    const renderProjects = function renderProjects(projects, currentProjectId) {
        let html = '';
        for (let i = 0; i < projects.length; i++) {
            const isCurrentProject = (currentProjectId === projects[i].id);
            html += renderProject(projects[i], isCurrentProject);
        }
        window.document.getElementById('projects').innerHTML = html;
    };

    const renderProject = function renderProject(project, isCurrentProject) {
        return `<div id="project_${project.id}">` +
            `${renderButton(project.id, isCurrentProject)}` +
            `<span>${project.name}</span>` +
            `${renderDescriptionInput(project.description)}` +
            `${renderElapsedTime(project.elapsedTime)}` +
            `</div>`;
    }

    const renderButton = function renderButton(projectId, isCurrentProject) {
        if (isCurrentProject) {
            return `<button class="active" onclick="App.sendMessage(${projectId});">${projectId}</button>`;
        }
        return `<button onclick="App.sendMessage(${projectId});">${projectId}</button>`;
    }

    const renderDescriptionInput = function renderDescriptionInput(description) {
        return `<input type="text" name="Description" value="${description}">`;
    }

    const renderElapsedTime = function renderElapsedTime(elapsedTime) {
        return `<span class="elapsedTime">${elapsedTime}</span>`;
    }

    return {
        sendMessage: sendMessage,
        projects: projects,
        renderProjects: renderProjects
    };
})();