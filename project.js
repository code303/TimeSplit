module.exports = function Project(identifier, projectName, desc) {
    this.id = identifier;
    this.name = projectName;
    this.description = desc;
    this.elapsedTime = 0;

    this.addMilliSeconds = function addMilliSeconds(millis) {
        this.elapsedTime += millis;
    };

    this.toCsvRecord = function toCsvRecord() {
        return `${this.elapsedTime}; ${this.name}; ${this.description}`;
    };
};