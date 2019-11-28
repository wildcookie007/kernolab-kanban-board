import { NotificationStore } from '../notificationStore';

describe('NotificationStore', () => {
    let notificationStore: NotificationStore;

    beforeEach(() => {
        notificationStore = new NotificationStore();
    });

    it('should set message and have message', () => {
        const messageToSet = '123 message';
        notificationStore.setMessage(messageToSet);

        expect(notificationStore.message).toEqual(messageToSet);
        expect(notificationStore.hasMessage).toBeTruthy();
    });

    it('should reset message', () => {
        notificationStore.setMessage(null);

        expect(notificationStore.message).toBeFalsy();
        expect(notificationStore.hasMessage).toBeFalsy();
    });
});
