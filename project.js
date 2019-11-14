module.exports = function Project(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.elapsedTime = 0;
    this.addMilliSeconds = function addMilliSeconds(millis) {
        this.elapsedTime = this.elapsedTime + millis;
    }
};