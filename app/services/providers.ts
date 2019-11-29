import { StorageService } from './storageService';
import { BoardStore } from '@app/stores/boardStore';
import { InitStore } from '@app/stores/initStore';

interface Providers {
    boardStore: BoardStore;
    initStore: InitStore;
}

const storageService = new StorageService();
const initStore = new InitStore();
const boardStore = new BoardStore(storageService);

export const providers: Providers = {
    boardStore,
    initStore
};
