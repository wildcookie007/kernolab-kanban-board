import { BoardStore } from '../boardStore';
import { StorageService } from '@app/services/storageService';
import { BoardModel, BoardConstructor } from '@app/models/BoardModel';
import { TaskModel, TaskConstructor } from '@app/models/TaskModel';

describe('BoardStore', () => {
    let boardStore: BoardStore;
    let storageService: PartialMock<StorageService>;

    beforeEach(() => {
        storageService = {
            fetch: jest.fn(),
            save: jest.fn(),
        };

        boardStore = new BoardStore(storageService as any);
    });

    describe('should load board', () => {
        it('new board', () => {
            storageService.fetch = jest.fn().mockReturnValue(null);

            boardStore.loadBoard();

            expect(boardStore.board).toBeInstanceOf(BoardModel);
            expect(BoardModel.taskId).toBe(0);
        });

        it('persisted board', () => {
            const persistedBoard: BoardConstructor = {
                currentColumnId: 2,
                taskId: 5,
                columns: [{ id: 1, name: 'Col1', tasks: [] }],
            };
            storageService.fetch = jest.fn().mockReturnValue(JSON.stringify(persistedBoard));

            boardStore.loadBoard();

            expect(boardStore.board).toBeInstanceOf(BoardModel);
            expect(BoardModel.taskId).toBe(persistedBoard.taskId);
        });
    });

    it('should save board', () => {
        boardStore.loadBoard();
        boardStore.saveBoard();
        expect(storageService.save).toBeCalledTimes(1);
    });

    it('should set and update task details', () => {
        const referenceModel: TaskConstructor = {
            createdAt: 1,
            updatedAt: 2,
            id: 1,
            title: 'TestTask1_Title',
            description: 'TestTask1_Description',
        };

        boardStore.setTaskModalDetails(new TaskModel(null, referenceModel));

        expect(boardStore.taskModalDetails).toBeTruthy();
        expect(boardStore.taskModalDetailsReference).toBeTruthy();

        boardStore.taskModalDetails.title.value = 'NewTitle';
        boardStore.taskModalDetails.description.value = 'NewDescription';

        boardStore.saveTaskDetails();

        expect(boardStore.taskModalDetailsReference.title.value).toEqual('NewTitle');
        expect(boardStore.taskModalDetailsReference.description.value).toEqual('NewDescription');
    });
});
