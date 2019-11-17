const { ipcRenderer } = require('electron');

ipcRenderer.on('switchFocusReply', (event, arg) => {
    console.log('Received event ' + arg);
  })

const sendMessage = function sendMessage() {
    ipcRenderer.send('switchFocus', 1);
}