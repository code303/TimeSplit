const App = (function () {

    const { ipcRenderer } = require('electron');
    let projects = null;
    let currentProjectId = null;

    ipcRenderer.on('switchFocusReply', (event, arg) => {
        console.log('Received event ' + JSON.stringify(arg));
        // update the project times from payload args.projects
    });

    ipcRenderer.on('editDescriptionReply', (event, arg) => {
        console.log('Received event reply from editDescription' + JSON.stringify(arg));
        // update the project times from payload args.projects
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
        document.querySelectorAll('button.active')[0].classList.remove('active');
        document.getElementById(`project_${projectId}`).childNodes[0].classList.add('active');
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
    };

    const renderProject = function renderProject(project, isCurrentProject) {
        return `<div id="project_${project.id}">` +
            `${renderButton(project.id, project.name, isCurrentProject)}` +
            `${renderDescriptionInput(project.id, project.description)}` +
            `${renderElapsedTime(project.elapsedTime)}` +
            `</div>`;
    }

    const renderButton = function renderButton(projectId, projectName, isCurrentProject) {
        if (isCurrentProject) {
            return `<button class="active" onclick="App.sendMessage(${projectId});">${projectName}</button>`;
        }
        return `<button onclick="App.sendMessage(${projectId});">${projectName}</button>`;
    }

    const renderDescriptionInput = function renderDescriptionInput(projectId, description) {
        return `<input type="text" onchange="App.sendProjectDescription(${projectId}, this.value);" name="Description" value="${description}">`;
    }

    const renderElapsedTime = function renderElapsedTime(elapsedTime) {
        return `<span class="elapsedTime">${elapsedTime}</span>`;
    }

    return {
        sendMessage: sendMessage,
        sendProjectDescription: sendProjectDescription,
        projects: projects,
        renderProjects: renderProjects
    };
})();