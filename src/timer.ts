/// <reference path="task.ts"/>

const TIMER = {
    load: (): Task => {
        const loadedTask = JSON.parse(window.localStorage?.getItem('task') ?? 'null');
        return loadedTask ? { ...loadedTask } : TIMER.initialize();
    },

    store: (task: Task): void => {
        window.localStorage?.setItem('task', JSON.stringify({ ...task }));
    },

    remove: (): void => {
        window.localStorage?.removeItem('task');
    },

    initialize: (): Task => ({
        started: 0,
        stopped: 0,
        projectName: '',
        description: '',
    }),

    start: (task: Task, projectName: string, taskDescription: string): Task => ({
        ...task,
        started: Date.now(),
        projectName,
        description: taskDescription,
    }),

    stop: (task: Task): void => {
        task.stopped = Date.now();
    },
};