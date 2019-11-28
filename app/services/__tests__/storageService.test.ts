import { StorageService } from '../storageService';

describe('TokenService', () => {
    let tokenService: StorageService;

    beforeEach(() => {
        tokenService = new StorageService();
    });

    it('should set token to variable and localStorage', () => {
        const token = 'token_test';
        const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem'); // Abbrieviation for window.localStorage

        tokenService.setToken(token);
        expect(localStorageSpy).toBeCalledWith('token', token);
    });

    it('should remove token variable and from localStorage', () => {
        const localStorageSpy = jest.spyOn(Storage.prototype, 'removeItem'); // Abbrieviation for window.localStorage

        tokenService.setToken('');
        expect(localStorageSpy).toBeCalledWith('token');
    });
});
