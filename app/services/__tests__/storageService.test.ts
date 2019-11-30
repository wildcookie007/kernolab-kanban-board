import { StorageService } from '../storageService';

describe('StorageService', () => {
    let storageService: StorageService;
    const key = 'testKey';
    const testObj = { testObj: 'ok' };
    const formattedObj = JSON.stringify(testObj);

    beforeAll(() => {
        storageService = new StorageService();
    });

    it('should save key to localStorage', () => {
        const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem'); // Abbrieviation for window.localStorage

        storageService.save(key, formattedObj);
        expect(localStorageSpy).toBeCalledWith(key, formattedObj);
    });

    it('should fetch value from key', () => {
        const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem'); // Abbrieviation for window.localStorage

        const fetchValue = storageService.fetch(key);
        expect(localStorageSpy).toBeCalledWith(key);
        expect(fetchValue).toEqual(formattedObj);
    });
});
