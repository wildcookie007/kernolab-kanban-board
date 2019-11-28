import { observable, action } from 'mobx';
import { BoardModel } from '@app/models/BoardModel';

export class BoardStore {
    @observable board: BoardModel;

    @action startNewBoard() {
        this.board = new BoardModel();
    }
}
