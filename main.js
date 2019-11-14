const { app, BrowserWindow } = require('electron');
const timer = require('./timer.js');
const Project = require('./project.js');

let win;
const projects = {};
let currentProjectId = null;

const createWindow = function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
  timer.start = Date.now();
  let defaultProject = new Project(0, 'Orga', 'RnD Emails, OpenAir, iTrac');
  projects[defaultProject.id] = defaultProject;
  currentProjectId = defaultProject.id;
  win.on('closed', () => {
    win = null;
  });
}

const setFocus = function setFocus(project) {
  // save elapsed time to current project
  // reset timer
  // set new current project
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    timer.stop = Date.now();
    projects[currentProjectId].addMilliSeconds(timer.stop - timer.start);
    console.log(`Timer ran for ${(projects[currentProjectId].elapsedTime) / 1000} seconds.`);
    if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});