import { observable, action } from 'mobx';
import { TaskModel } from './TaskModel';
import { ValidationFieldModel } from './ValidationFieldModel';

export class ColumnModel {
    private _currentTaskId = 0;
    id: number;
    @observable initialized = false;
    @observable name = new ValidationFieldModel<string>((val) => Boolean(val));
    @observable tasks: TaskModel[] = [];

    constructor(id: number) {
        this.id = id;
    }

    @action addTask = () => {
        this.tasks.push(new TaskModel(this._currentTaskId));
        this._currentTaskId++;
    }

    @action copyDragTask = (task: TaskModel) => {
        // We dont want to mutate the original object
        const taskCopy = Object.assign({}, task);
        taskCopy.id = this._currentTaskId;

        this.tasks.push(taskCopy);
        this._currentTaskId++;
    };

    @action removeTask = (id: number) => {
        const taskIndex = this.tasks.findIndex((t) => t.id === id);

        if (taskIndex === -1) {
            return;
        }

        this.tasks.splice(taskIndex, 1);
    }

    @action setInitialized = (value: boolean) => {
        this.initialized = value;
    }
}
