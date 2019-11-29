import { StorageService } from './storageService';
import { NotificationStore } from '@app/stores/notificationStore';
import { BoardStore } from '@app/stores/boardStore';

interface Providers {
    notificationStore: NotificationStore;
    boardStore: BoardStore;
}

const storageService = new StorageService();
const boardStore = new BoardStore(storageService);
const notificationStore = new NotificationStore();

export const providers: Providers = {
    notificationStore,
    boardStore
};
