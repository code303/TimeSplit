const { app, BrowserWindow } = require('electron');
const timer = require('./timer.js');
let win;

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
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    timer.stop = Date.now();
    console.log(`Timer ran for ${(timer.stop - timer.start) / 1000} seconds.`);
    if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});