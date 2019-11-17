const { ipcRenderer } = require('electron');

ipcRenderer.on('switchFocusReply', (event, arg) => {
    console.log('Received event ' + arg);
});

ipcRenderer.on('projects', (event, message) => {
    console.log('Received ' + message);
});
const sendMessage = function sendMessage() {
    ipcRenderer.send('switchFocus', 1);
};