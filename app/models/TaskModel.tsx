import { observable, action, computed } from 'mobx';
import { ValidationFieldModel } from './ValidationFieldModel';

export type DraggedOn = 'above' | 'below';

export interface TaskConstructor {
    title: string;
    description: string;
    id: number;
}

export class TaskModel {
    id: number;
    @observable draggedOn: DraggedOn;
    @observable dragging = false;
    @observable initialized = false;
    @observable title = new ValidationFieldModel<string>((val) => Boolean(val));
    @observable description = new ValidationFieldModel<string>((val) => Boolean(val));

    constructor(id: number, t?: TaskConstructor) {
        if (!t) {
            this.id = id;
            return;
        }

        this.id = t.id;
        this.title.value = t.title;
        this.description.value = t.description;
        this.initialized = true;
    }

    @action setInitialized = (value: boolean) => {
        this.initialized = value;
    };

    @action setDragging = (value: boolean) => {
        this.dragging = value;
    };

    @action setDraggedOn = (value: DraggedOn | null) => {
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
        };
    }
}
