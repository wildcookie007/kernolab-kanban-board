import React from 'react';
import { TaskModel } from '@app/models/TaskModel';
import { observer } from 'mobx-react';
import * as styles from '@app/styles/components/board.scss';
import { Input } from '../shared/Input';
import { jClass } from '@app/utils/utils';

interface TaskItemProps {
    task: TaskModel;
    onTaskRemove: (taskId: number) => void;
    onTaskDragStart: (task: TaskModel) => void;
}

export const TaskItem = React.memo(observer((props: TaskItemProps) => {
    const { task } = props;

    const handleSave = () => {
        task.title.setTouched();
        if (!task.title.isValid) {
            props.onTaskRemove(task.id);
            return;
        }

        task.setInitialized(true);
    };

    const onDragStart = (_e: React.DragEvent<HTMLDivElement>) => {
        if (!task.initialized) {
            return;
        }

        props.onTaskDragStart(task);
    };

    const onDragOver = (_e: React.DragEvent<HTMLDivElement>) => {
        console.log(_e.clientY, _e.pageY, _e.screenY);
    };

    return (
        <div
            className={jClass(styles.columnTask, !task.initialized && styles.uninitialized)}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            draggable
        >
            {!task.initialized ?
                <Input
                    bordered
                    placeholder='Add task name...'
                    value={task.title.value}
                    onChange={task.title.handleChange}
                    hasError={task.title.showError}
                    onBlur={handleSave}
                    onPressEnter={handleSave}
                />
                :
                <span>
                    <span>#{task.id}</span>
                    {task.title.value}
                </span>
            }
        </div>
    );
}));
