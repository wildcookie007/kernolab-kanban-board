import { observable, action } from 'mobx';
import { ValidationFieldModel } from './ValidationFieldModel';

export class TaskModel {
    id: number;
    @observable initialized = false;
    @observable title = new ValidationFieldModel<string>((val) => Boolean(val));
    @observable description = new ValidationFieldModel<string>((val) => Boolean(val));

    constructor(id: number) {
        this.id = id;
    }

    @action setInitialized = (value: boolean) => {
        this.initialized = value;
    }
}
