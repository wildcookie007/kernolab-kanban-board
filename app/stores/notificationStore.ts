import { observable, action, computed } from 'mobx';

export class NotificationStore {
	@observable message = '';

	@computed get hasMessage(): boolean {
	    return this.message && this.message.length && this.message !== '';
	}

	@action setMessage(value: string) {
	    this.message = value;
	}
}
