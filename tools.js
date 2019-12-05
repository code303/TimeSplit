module.exports = {
    formatHHMM: function formatHHMM(millis) {
        const mins = Math.floor(millis / 60000);
        const hours = Math.floor( mins / 60);
        const mm = (mins < 10) ? '0' + mins : mins;
        const hh = (hours < 10) ? '0' + hours : hours;
        return `${hh}:${mm}`;
    },

    getProjectFromId: function getProjectFromId(projects, id) {
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === id) {
                return projects[i];
            }
        }
        throw {error: 'Could not find project for id ' + id};
    }

};