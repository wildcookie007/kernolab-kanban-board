import { observable, action } from 'mobx';
import { BoardModel, BoardConstructor } from '@app/models/BoardModel';
import { StorageService } from '@app/services/storageService';
import { TaskModel } from '@app/models/TaskModel';

export class BoardStore {
    private readonly _localSaveKey = '_kernoboard';
    @observable board: BoardModel;
    @observable isTaskModalVisible = false;
    @observable isColumnRemoveModalVisible = false;

    @observable columnModalDetails: number;

    @observable taskModalDetailsReference: TaskModel;
    @observable taskModalDetails: TaskModel;

    constructor(private readonly _storageService: StorageService) { }

    @action loadBoard() {
        const persistedBoard = this._storageService.fetch(this._localSaveKey);
        if (!persistedBoard || !persistedBoard.length) {
            this.board = new BoardModel();
            return;
        }

        const parsedBoard: BoardConstructor = JSON.parse(persistedBoard);
        this.board = new BoardModel(parsedBoard);
    }

    saveBoard() {
        this._storageService.save(this._localSaveKey, JSON.stringify(this.board.toSaveRequest()));
    }

    saveTaskDetails() {
        const oldTitle = this.taskModalDetailsReference.title.value;

        const newTitle = this.taskModalDetails.title.value;
        const newDescription = this.taskModalDetails.description.value;

        this.taskModalDetailsReference.title.value = newTitle ? newTitle : oldTitle;
        this.taskModalDetailsReference.description.value = newDescription;
    }

    @action setRemoveColumnModalDetails(columnId: number) {
        this.columnModalDetails = columnId;
    }

    @action setRemoveColumnModalVisible(value: boolean) {
        this.isColumnRemoveModalVisible = value;
    }

    @action removeColumn() {
        this.board.removeColumn(this.columnModalDetails);
    }

    @action setTaskModalVisible(value: boolean) {
        this.isTaskModalVisible = value;
    }

    // Clone class
    @action setTaskModalDetails(value: TaskModel) {
        this.taskModalDetailsReference = value;
        this.taskModalDetails = value ? Object.assign({}, new TaskModel(null, value.toConstructorRequest())) : null;
    }
}
