const { app, BrowserWindow } = require('electron');
const timer = require('./timer.js');
const Project = require('./project.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

let win;
const homeDir = os.homedir();
const projects = [];
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
  projects.push(defaultProject);
  currentProjectId = defaultProject.id;
  win.on('closed', () => {
    win = null;
  });
}

const saveReport = function saveReport(projects) {
  const dir = path.join(homeDir, 'ts');
  const yyyymmdd =  (new Date().toISOString().split('T'))[0];
  const fileName = 'TimeSplit_' + yyyymmdd + '.csv';
  const csvString = createCsvString(projects);
  writeFile(dir, fileName, csvString);
};

const createCsvString = function createCsvString(projects) {
  let csv = '';
  for (let i = 0; i < projects.length; i++) {
    csv += (i === 0) ? '' : '\n';
    csv += projects[i].toCsvRecord(); 
  }
  return csv;
}

const writeFile = function writeFile(directory, fileName, content) {
  // console.log('Writing file to ' + path.join(directory, fileName));
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  fs.writeFileSync(path.join(directory, fileName), JSON.stringify(content) );
}

const setFocus = function setFocus(project) {
  // save elapsed time to current project
  // reset timer
  // set new current project
}
app.on('ready', createWindow);

process.on('exit', () => {
  timer.stop = Date.now();
    projects[0].addMilliSeconds(timer.stop - timer.start);
    saveReport(projects);
    console.log(`Timer ran for ${(projects[0].elapsedTime) / 1000} seconds.`);
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