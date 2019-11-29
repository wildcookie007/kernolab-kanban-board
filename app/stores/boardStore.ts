import { observable, action } from 'mobx';
import { BoardModel, BoardConstructor } from '@app/models/BoardModel';
import { StorageService } from '@app/services/storageService';

export class BoardStore {
    private readonly _localSaveKey = '_kernoboard';
    @observable board: BoardModel;

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
}
