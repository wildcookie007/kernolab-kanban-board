import { ColumnModel } from './ColumnModel';
import { action, observable } from 'mobx';
import { TaskModel } from './TaskModel';

export class DragInfoModel {
    task: TaskModel;
    column: ColumnModel;

    constructor(task: TaskModel, column: ColumnModel) {
        this.task = task;
        this.column = column;
    }
}

export class BoardModel {
    private _currentColumnId = 0;
    @observable columns: ColumnModel[] = [];
    @observable dragInfo: DragInfoModel;

    @action addColumn = () => {
        this.columns.push(new ColumnModel(this._currentColumnId));
        this._currentColumnId++;
    }

    @action removeColumn = (id: number) => {
        const columnIndex = this.columns.findIndex((c) => c.id === id);

        if (columnIndex === -1) {
            return;
        }

        this.columns.splice(columnIndex, 1);
    }

    @action setDraggedTask = (task: TaskModel, column: ColumnModel) => {
        this.dragInfo = new DragInfoModel(task, column);
    }

    @action resetDraggedInfo = () => {
        this.dragInfo = null;
    };
}
