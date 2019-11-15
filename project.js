module.exports = function Project(identifier, projectName, desc) {
    const id = identifier;
    let name = projectName;
    let description = desc;
    let elapsedTime = 0;
    
    this.addMilliSeconds = function addMilliSeconds(millis) {
        elapsedTime += millis;
    };
    
    this.toCsvRecord = function toCsvRecord() {
        return `${elapsedTime}; ${name}; ${description}`;
    };
};