const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const timer = require('./timer.js');
const Project = require('./project.js');
const tools = require('./tools.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

let win;
const homeDir = os.homedir();
let projects = null;
let currentProjectId = null;

const createWindow = function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 235,
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    win.loadFile('index.html');
    Menu.setApplicationMenu(null);
    
    //win.webContents.openDevTools();

    if (!currentProjectId) {
        projects = createDefaultProjects();
        timer.start = Date.now();
        timer.currentProjectId = 1;
        currentProjectId = 1;
    }

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('projects', {
            projects: projects,
            currentProjectId: currentProjectId
        });
    });

    win.on('closed', () => {
        win = null;
    });
}

const createDefaultProjects = function createDefaultProjects() {
    return [
        new Project(0, 'Pause', ''),
        new Project(1, 'Orga', 'RnD Emails, OpenAir, iTrac'),
        new Project(2, 'Test', ''),
        new Project(3, 'Development', ''),
        new Project(4, 'Bugfixing', ''),
        new Project(5, 'Scrum', 'Daily'),
        new Project(6, 'Research', '')
    ]
}

const saveReport = function saveReport(projects) {
    const dir = path.join(homeDir, 'ts');
    const yyyymmdd = (new Date().toISOString().split('T'))[0];
    const fileName = createNonExistingFileName(dir, yyyymmdd, '.csv');
    const csvString = createCsvString(projects);
    writeFile(dir, fileName, csvString);
};

const createNonExistingFileName = function findFileName(dir, yyyymmdd, extension) {
    let fileName = 'TimeSplit_' + yyyymmdd;
    if (!fs.existsSync(path.join(dir, fileName + extension))) {
        return fileName + extension;
    }

    let counter = 1;
    fileName = fileName + '_';
    while (fs.existsSync(path.join(dir, fileName + counter + extension))) {
        counter++;
    }
    return fileName + counter + extension;
}

const createCsvString = function createCsvString(projects) {
    let csv = '';
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].elapsedTime > 0) {
            csv += (csv.length === 0) ? '' : '\n';
            csv += projects[i].toCsvRecord();
        }
    }
    return csv;
}

const writeFile = function writeFile(directory, fileName, content) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    fs.writeFileSync(path.join(directory, fileName), content);
}

const setFocus = function setFocus(newProject, timer) {
    // save elapsed time to current project
    timer.stop = Date.now();
    const currentProject = tools.getProjectFromId(projects, timer.currentProjectId);
    currentProject.addMilliSeconds(timer.stop - timer.start);
    
    // reset timer
    timer.stop = 0;
    timer.start = 0;
    timer.currentProjectId = newProject.id; 
    timer.start = Date.now();
}

app.on('ready', createWindow);

process.on('exit', () => {
    timer.stop = Date.now();
    tools.getProjectFromId(projects, timer.currentProjectId).addMilliSeconds(timer.stop - timer.start);
    saveReport(projects);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }

});

ipcMain.on('switchFocus', function (event, projectId) {
    setFocus(tools.getProjectFromId(projects, projectId), timer);
    event.reply('switchFocusReply', {result: 'ok', projects: projects});
});

ipcMain.on('editDescription', function (event, projectId, description) {
    tools.getProjectFromId(projects, projectId).description = description;
    event.reply('editDescriptionReply', {result: 'ok', projects: projects});
});

ipcMain.on('addTime', function (event, projectId, time) {
    tools.getProjectFromId(projects, projectId).addMilliSeconds(time);
    event.reply('addTimeReply', {result: 'ok', projects: projects, projectId: projectId});
});

ipcMain.on('removeTime', function (event, projectId, time) {
    tools.getProjectFromId(projects, projectId).subtractMilliseconds(time);
    event.reply('removeTimeReply', {result: 'ok', projects: projects, projectId: projectId});
});