import { StorageService } from './storageService';
import { NotificationStore } from '@app/stores/notificationStore';

interface Providers {
    tokenService: StorageService;
    notificationStore: NotificationStore;
}

const tokenService = new StorageService();
const notificationStore = new NotificationStore();

export const providers: Providers = {
    tokenService,
    notificationStore,
};
