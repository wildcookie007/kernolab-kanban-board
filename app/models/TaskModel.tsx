import { observable, action, computed } from 'mobx';
import { ValidationFieldModel } from './ValidationFieldModel';
import moment from 'moment';
import { TIME_UNIX_MATCH, FORMAT_DATETIME } from '@app/utils/utils';

export type DraggedOn = 'above' | 'below';

export interface TaskConstructor {
    title: string;
    description: string;
    id: number;
    createdAt: number;
    updatedAt: number;
}

export class TaskModel {
    id: number;
    @observable draggedOn: DraggedOn;
    @observable dragging = false;
    @observable initialized = false;
    @observable title = new ValidationFieldModel<string>((val) => Boolean(val));
    @observable description = new ValidationFieldModel<string>((val) => Boolean(val));
    @observable createdAt: number;
    @observable updatedAt: number;

    constructor(id: number, t?: TaskConstructor) {
        if (!t) {
            this.id = id;
            return;
        }

        this.createdAt = t.createdAt;
        this.updatedAt = t.updatedAt;
        this.id = t.id;
        this.title.value = t.title;
        this.description.value = t.description;
        this.initialized = true;
    }

    @computed get updatedDate(): string {
        return moment(this.updatedAt * TIME_UNIX_MATCH).format(FORMAT_DATETIME);
    }

    @computed get createdDate(): string {
        return moment(this.createdAt * TIME_UNIX_MATCH).format(FORMAT_DATETIME);
    }

    @action setInitialized = () => {
        this.initialized = true;
        this.createdAt = moment().unix();
        this.updatedAt = moment().unix();
    };

    @action setDragging = (value: boolean) => {
        this.dragging = value;
    };

    @action setDraggedOnPosition = (value: DraggedOn | null) => {
        this.draggedOn = value;
    };

    /**
     * Used for getting margin styles when the item is dragged over
     */
    @computed get dragStyle(): React.CSSProperties {
        if (!this.draggedOn) {
            return { marginTop: '', marginBottom: '' }; // Used to reset previous values
        }

        switch (this.draggedOn) {
            case 'above': {
                return { marginTop: '34px' };
            }
            case 'below': {
                return { marginBottom: '34px' };
            }
        }
    }

    /**
     * Used for copying to retain the class model properties and functions
     */
    toConstructorRequest(): TaskConstructor {
        return {
            id: this.id,
            title: this.title.value,
            description: this.description.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
