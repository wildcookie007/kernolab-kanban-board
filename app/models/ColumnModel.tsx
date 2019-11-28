import { observable, action } from 'mobx';
import { TaskModel, TaskConstructor } from './TaskModel';
import { ValidationFieldModel } from './ValidationFieldModel';
import { BoardModel } from './BoardModel';

export class ColumnModel {
    id: number;
    @observable initialized = false;
    @observable name = new ValidationFieldModel<string>((val) => Boolean(val));
    @observable tasks: TaskModel[] = [];

    constructor(id: number) {
        this.id = id;
    }

    @action addTask = () => {
        this.tasks.push(new TaskModel(BoardModel.nextTaskId));
    };

    @action copyDragTask = (task: TaskConstructor, targetIdx: number) => {
        // We dont want to mutate the original object
        const taskCopy = new TaskModel(null, task);

        if (targetIdx !== -1 && targetIdx !== this.tasks.length && targetIdx !== undefined) {
            this.tasks.splice(targetIdx, 0, taskCopy);
        } else {
            this.tasks.push(taskCopy);
        }
    };

    @action removeTask = (id: number) => {
        const taskIndex = this.tasks.findIndex((t) => t.id === id);

        if (taskIndex === -1) {
            return;
        }

        this.tasks.splice(taskIndex, 1);
    };

    findTaskIdx(taskId: number): number {
        return this.tasks.findIndex((t) => t.id === taskId);
    }

    @action setInitialized(value: boolean) {
        this.initialized = value;
    }
}
