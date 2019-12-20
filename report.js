const { ipcRenderer } = require('electron');

const renderReport = function renderReport(container, fileName, report, fileList) {
    let pre = document.createElement('pre');
    pre.innerText = fileName + '\n\n' + report;
    container.appendChild(pre);
    container.style.display = 'block';
    container.addEventListener('click', () => {showProjectsHideReport();});
    let ul = createFileList(fileList);
    container.appendChild(ul);
};

const createFileList = function createFileList(files) {
    const ul = document.createElement('ul');
    let i = 0;
    for (i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        const fileName = files[i];
        li.innerText = fileName;
        li.addEventListener('click', () => {ipcRenderer.send('showSpecificReport', fileName);});
        ul.appendChild(li);
    }
    return ul;
}

const showProjectsHideReport = function showProjectsHideReport() {
    document.getElementById('projects').style.display = 'block';
    document.getElementById('reports').style.display = 'none';
    document.getElementById('reports').innerHTML = '';
};

module.exports = {renderReport: renderReport};