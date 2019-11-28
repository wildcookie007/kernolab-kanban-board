import { observable, action, computed } from 'mobx';

export class ValidationFieldModel<T> {
    @observable value: T;
    @observable isTouched: boolean;
    @observable isEditable: boolean;
    isValidationEnabled = true;

    constructor(private readonly _validator: (value: T) => boolean) { }

    @action handleChange = (value: T) => {
        this.value = value;
    };

    @action setTouched = () => {
        this.isTouched = true;
    }

    @action setEditable = () => {
        this.isEditable = !this.isEditable;
    }

    @computed get isValid(): boolean {
        return this.isValidationEnabled ? this._validator(this.value) : true;
    }

    @computed get showError(): boolean {
        return Boolean(this.isTouched && !this.isValid);
    }
}
