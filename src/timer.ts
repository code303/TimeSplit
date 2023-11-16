/// <reference path="task.ts"/>

const TIMER = {
    load: (): Task => {
        const loadedTask = JSON.parse(window.localStorage?.getItem('task') ?? 'null');
        return loadedTask ? { ...loadedTask } : TIMER.initialize('misc', '');
    },

    store: (task: Task): void => {
        window.localStorage?.setItem('task', JSON.stringify({ ...task }));
    },

    remove: (): void => {
        window.localStorage?.removeItem('task');
    },

    initialize: (projectName: string, description: string): Task => ({
        started: 0,
        stopped: 0,
        projectName: projectName ?? '',
        description: description ?? '',
        category: ''
    }),

    start: (task: Task): void => {
        task.started = Date.now();
    },

    stop: (task: Task): void => {
        task.stopped = Date.now();
    },
};