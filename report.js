const renderReport = function renderReport(fileName, report) {
    let pre = document.createElement('pre');
    pre.innerText = fileName + '\n\n' + report;
    const reportsDiv = document.getElementById('reports');
    reportsDiv.appendChild(pre);
    reportsDiv.style.display = 'block';
    reportsDiv.addEventListener('click', () => {showProjectsHideReport();});
};

const showProjectsHideReport = function showProjectsHideReport() {
    document.getElementById('projects').style.display = 'block';
    document.getElementById('reports').style.display = 'none';
    document.getElementById('reports').innerHTML = '';
};

module.exports = {renderReport: renderReport};