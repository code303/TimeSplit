const App = (function () {

    const { ipcRenderer } = require('electron');
    let projects = null;

    ipcRenderer.on('switchFocusReply', (event, arg) => {
        console.log('Received event ' + arg);
    });

    ipcRenderer.on('projects', (event, payload) => {
        console.log('Received ' + payload);
        projects = payload;
        renderProjects(projects);
    });

    const sendMessage = function sendMessage(projectId) {
        ipcRenderer.send('switchFocus', projectId);
    };

    const renderProjects = function renderProjects(projects) {
        let html = '';
        for (let i = 0; i < projects.length; i++) {
            html += renderProject(projects[i]);
        }
        window.document.getElementById('projects').innerHTML = html;
    };

    const renderProject = function renderProject(project) {
        return `<div>` +
            `${renderButton(project.id)}` +
            `<span>${project.name}</span>` +
            `${renderDescriptionInput(project.description)}` +
            `${renderElapsedTime(project.elapsedTime)}` +
            `</div>`;
    }

    const renderButton = function renderButton(projectId) {
        return `<button onclick="App.sendMessage(${projectId});">${projectId}</button>`;
    }

    const renderDescriptionInput = function renderDescriptionInput(description) {
        return `<input type="text" name="Description" value="${description}">`;
    }

    const renderElapsedTime = function renderElapsedTime(elapsedTime) {
        return `<span>${elapsedTime}</span>`;
    }

    return {
        sendMessage: sendMessage,
        projects: projects,
        renderProjects: renderProjects
    };
})();