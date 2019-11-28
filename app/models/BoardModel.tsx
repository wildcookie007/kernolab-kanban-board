import { ColumnModel } from './ColumnModel';
import { action, observable } from 'mobx';
import { TaskModel } from './TaskModel';

export class CurrentlyDraggedModel {
    // Dragged from
    task: TaskModel;
    column: ColumnModel;

    // Dragged over
    targetTask: TaskModel;
    targetIdx: number;

    constructor(task: TaskModel, column: ColumnModel) {
        this.task = task;
        this.column = column;
    }
}

export class BoardModel {
    private _currentColumnId = 0;
    static taskId = 0;
    @observable columns: ColumnModel[] = [];
    @observable currentlyDragged: CurrentlyDraggedModel;

    @action addColumn = () => {
        this.columns.push(new ColumnModel(this._currentColumnId));
        this._currentColumnId++;
    };

    @action removeColumn = (id: number) => {
        const columnIndex = this.columns.findIndex((c) => c.id === id);

        if (columnIndex === -1) {
            return;
        }

        this.columns.splice(columnIndex, 1);
    };

    @action setCurrentlyDraggedTask = (task: TaskModel, column: ColumnModel) => {
        this.currentlyDragged = new CurrentlyDraggedModel(task, column);
    };

    @action resetCurrentDrag = () => {
        this.currentlyDragged = null;

        // Reset all task margin styling
        for (const column of this.columns) {
            for (const task of column.tasks) {
                task.setDraggedOn(null);
            }
        }
    };

    static get nextTaskId(): number {
        this.taskId++;
        return this.taskId;
    }
}
