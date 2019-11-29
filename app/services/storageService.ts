export class StorageService {
    save(storageKey: string, value: string) {
        window.localStorage.setItem(storageKey, value);
    }

    fetch(storageKey: string): string {
        return window.localStorage.getItem(storageKey);
    }
}
