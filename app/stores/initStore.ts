import { observable, action } from 'mobx';

export class InitStore {
    @observable isAppLoaded = false;
    @observable isAppLoading = true;

    @action setAppLoaded() {
        this.isAppLoaded = true;
        this.isAppLoading = false;
    }
}
