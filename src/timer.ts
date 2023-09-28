/// <reference path="task.ts"/>
const TIMER = {
    load: function loadTimer() :Task {
        if (window.localStorage) {
            const stored = JSON.parse(window.localStorage.getItem('task'));
            if (stored) {
                return {
                    started: stored.started,
                    stopped: stored.stopped,
                    projectName: stored.projectName,
                    description: stored.description
                }
            } else {
                return TIMER.initialize();
            }
        }
    },

    store: function store(task: Task) :void {
        if (window.localStorage) {
            const taskToSave = {
                started: task.started,
                stopped: task.stopped,
                projectName: task.projectName,
                description: task.description
            };
            window.localStorage.setItem('task', JSON.stringify(taskToSave));
          }
    },

    remove: function remove() :void {
        if (window.localStorage) {
            window.localStorage.removeItem('task');
        }
    },

    initialize: function initialize(): Task {
        return {
            started: 0,
            stopped: 0,
            projectName: '',
            description: ''
        };
    },

    start: function start(task: Task, projectName: string, taskDescription: string): Task {
        task.started = Date.now();
        task.projectName = projectName;
        task.description = taskDescription;
        return task;
    },

    stop: function stop(task: Task) :void {
        task.stopped = Date.now();
    }
};