import { observable, action } from 'mobx';
import { TaskModel, TaskConstructor, DraggedOn } from './TaskModel';
import { ValidationFieldModel } from './ValidationFieldModel';
import { BoardModel } from './BoardModel';
import moment from 'moment';

export interface ColumnConstructor {
    id: number;
    name: string;
    tasks: TaskConstructor[];
}

export class ColumnModel {
    id: number;
    @observable initialized = false;
    @observable taskOnGoingCreate = false;
    @observable name = new ValidationFieldModel<string>((val) => Boolean(val));
    @observable tasks: TaskModel[] = [];

    constructor(id: number, c?: ColumnConstructor) {
        if (!c) {
            this.id = id;
            return;
        }

        this.id = c.id;
        this.name.value = c.name;
        this.initialized = true;
        c.tasks.forEach((t) => this.tasks.push(new TaskModel(null, t)));
    }

    toConstructorRequest(): ColumnConstructor {
        return {
            id: this.id,
            name: this.name.value,
            tasks: this.tasks.filter((t) => t.initialized).map((t) => t.toConstructorRequest()),
        };
    }

    @action addTask = () => {
        this.taskOnGoingCreate = true;
        this.tasks.push(new TaskModel(BoardModel.nextTaskId));
    };

    @action setTaskOnGoingCreate = () => {
        this.taskOnGoingCreate = false;
    };

    @action copyDroppedTask = (task: TaskConstructor, targetIdx: number) => {
        task.updatedAt = moment().unix();

        // We dont want to mutate the original object when copying and need all of the TaskModel properties included
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

    @action setInitialized(value: boolean) {
        this.initialized = value;
    }

    findTaskIdx(taskId: number): number {
        return this.tasks.findIndex((t) => t.id === taskId);
    }

    getUpdatedIndexToTarget = (position: DraggedOn, currentDraggedIndex: number, assignedIndex: number): number => {
        let updatedIndex = assignedIndex;

        switch (position) {
            case 'below': {
                // Make sure we dont go out of bounds
                if (assignedIndex !== this.tasks.length && assignedIndex < currentDraggedIndex) {
                    updatedIndex++;
                }
                break;
            }
            case 'above': {
                // Make sure we dont go out of bounds
                if (assignedIndex !== 0 && assignedIndex > currentDraggedIndex) {
                    updatedIndex--;
                }
                break;
            }
            default: {
                break;
            }
        }

        return updatedIndex;
    };
}
