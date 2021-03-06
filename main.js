const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const timer = require('./timer.js');
const Project = require('./project.js');
const tools = require('./tools.js');
const constants = tools.constants;
const fs = require('fs');
const path = require('path');
const os = require('os');

let win;
const homeDir = os.homedir();
let projects = null;
let currentProjectId = null;

const createWindow = function createWindow() {
    win = new BrowserWindow({
        width: 580,
        height: 255,
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
        new Project(0, 'Pause', '', ''),
        new Project(1, 'Orga', 'RnD Emails, OpenAir, iTrac', ''),
        new Project(2, 'Test', '', ''),
        new Project(3, 'Development', '', ''),
        new Project(4, 'Bugfixing', '', ''),
        new Project(5, 'Scrum', 'Daily', constants.categories.PROMOTION),
        new Project(6, 'Research', '', '')
    ]
}

const saveReport = function saveReport(projects, date) {
    const dir = path.join(homeDir, 'ts');
    const yyyymmdd = (new Date(date)).toISOString().split('T')[0];
    
    const jsonFileName = createNonExistingFileName(dir, yyyymmdd, '.json');
    const jsonString = createJsonString(projects, yyyymmdd);
    writeFile(dir, jsonFileName, jsonString);
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

const createJsonString = function createJsonString(projects, dateString) {
    const json = {date: dateString, "projects": []};
    
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].elapsedTime > 0) {
            json.projects.push(projects[i].toJson());
        }
    }
    return JSON.stringify(json, null, 2);
}

const writeFile = function writeFile(directory, fileName, content) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    fs.writeFileSync(path.join(directory, fileName), content);
}

const loadReport = function loadReport(fileName) {
    const dir =  path.join(homeDir, 'ts');
    const files = fs.readdirSync(dir);
    files.sort(function(a, b) {
        //return fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime();
        return true;
    });

    const reportFileName = (fileName === 'latest') ?
        files[files.length -1] :
        fileName;
    
    const fileContent = loadRawFileContent(dir, reportFileName);
    let report = createReport(fileContent);
    return {fileName: reportFileName, report: report, fileList: files};
};

const createReport = function createReport(fileContent) {
    const json = JSON.parse(fileContent);
    const projects = json.projects;
    let report = '';
    let worktime = 0;
    projects.forEach(project => {
        report += '\n' + tools.formatHHMM(project.elapsedTime) + ' ' + project.projectName + ' ' + project.description;
        if (project.projectName != 'Pause') {
            worktime += project.elapsedTime;
        }
    });
    report += '\n worktime ' + tools.formatHHMM(worktime);
    return report;
};

const loadRawFileContent = function loadFileContent(directory, fileName) {
    console.log('Loading report: ' + path.join(directory, fileName));
    return fs.readFileSync(path.join(directory, fileName), 'utf8');
};

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
    saveReport(projects, Date.now());
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

ipcMain.on('setCategory', function (event, projectId, category) {
    tools.getProjectFromId(projects, projectId).category = category;
    event.reply('setCategoryReply', {result: 'ok', projects: projects});
});

ipcMain.on('addTime', function (event, projectId, time) {
    tools.getProjectFromId(projects, projectId).addMilliSeconds(time);
    event.reply('addTimeReply', {result: 'ok', projects: projects, projectId: projectId});
});

ipcMain.on('removeTime', function (event, projectId, time) {
    setFocus(tools.getProjectFromId(projects, currentProjectId), timer);
    tools.getProjectFromId(projects, projectId).subtractMilliseconds(time);
    event.reply('removeTimeReply', {result: 'ok', projects: projects, projectId: projectId});
});

ipcMain.on('showLatestReport', function (event) {
    const data = loadReport('latest');
    event.reply('showReportReply', {result: 'ok', report: data.report, fileName: data.fileName, fileList: data.fileList});
});

ipcMain.on('showSpecificReport', function (event, fileName) {
    const data = loadReport(fileName);
    event.reply('showReportReply', {result: 'ok', report: data.report, fileName: data.fileName, fileList: data.fileList});
});
