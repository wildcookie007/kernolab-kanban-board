import { StorageService } from './storageService';
import { NotificationStore } from '@app/stores/notificationStore';

interface Providers {
    storageService: StorageService;
    notificationStore: NotificationStore;
}

const storageService = new StorageService();
const notificationStore = new NotificationStore();

export const providers: Providers = {
    storageService,
    notificationStore,
};
