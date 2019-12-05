const tools = require('./tools.js');
module.exports = function Project(identifier, projectName, desc) {
    this.id = identifier;
    this.name = projectName;
    this.description = desc;
    this.elapsedTime = 0;

    this.addMilliSeconds = function addMilliSeconds(millis) {
        this.elapsedTime += millis;
    };

    this.toCsvRecord = function toCsvRecord() {
        const formattedTime = tools.formatHHMM(this.elapsedTime);
        return `${formattedTime}; ${this.name}; ${this.description}`;
    };
};