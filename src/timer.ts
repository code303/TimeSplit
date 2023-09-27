const TIMER = {
    started: 0,
    stopped: 0,
    projectName: null,
    taskDescription: 'taskDesc',
 
    load: function loadTimer() :void {
        if (window.localStorage) {
            const stored = JSON.parse(window.localStorage.getItem('timer'));
            if (stored) {
                TIMER.started = stored.started;
                TIMER.stopped = stored.stopped;
                TIMER.projectName = stored.projectName;
                TIMER.taskDescription = stored.taskDescription;
            }
        }
    },

    store: function store() :void {
        if (window.localStorage) {
            const timer = {
                started: TIMER.started,
                stopped: TIMER.stopped,
                projectName: TIMER.projectName,
                taskDescription: TIMER.taskDescription
            };
            window.localStorage.setItem('timer', JSON.stringify(timer));
          }
    },

    remove: function remove() :void {
        if (window.localStorage) {
            window.localStorage.removeItem('timer');
        }
    },

    initialize: function initialize() :void {
        TIMER.started = 0;
        TIMER.stopped = 0;
        TIMER.projectName = '';
        TIMER.taskDescription = '';
    },

    start: function start(projectName: string, taskDescription: string) :void {
        TIMER.started = Date.now();
        TIMER.projectName = projectName;
        TIMER.taskDescription = taskDescription;
    },

    stop: function stop() :void {
        TIMER.stopped = Date.now();
    }
};