import { observable, action } from 'mobx';

export class StorageService {
    @observable appLoaded = false;
    @observable appLoading = true;

    @action setAppLoaded() {
        this.appLoaded = true;
        this.appLoading = false;
    }
}
