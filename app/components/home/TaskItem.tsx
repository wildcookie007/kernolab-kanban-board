import React from 'react';
import { TaskModel, DraggedOn } from '@app/models/TaskModel';
import { observer } from 'mobx-react';
import * as styles from '@app/styles/components/board.scss';
import { Input } from '../shared/Input';
import { jClass } from '@app/utils/utils';
import { Icon } from '../shared/Icon';
import { mdiDelete } from '@mdi/js';
import { Button } from '../shared/Button';
import { Link } from 'react-router-dom';

interface TaskItemProps {
    task: TaskModel;
    onTaskRemove: (taskId: number) => void;
    onTaskDragStart: (task: TaskModel) => void;
    onTaskDragOver: (task: TaskModel, dragPosition: DraggedOn) => void;
    onTaskDragEnd: () => void;
    onTaskInitialized: () => void;
    onTaskDetails: (task: TaskModel) => (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

export const TaskItem = React.memo(
    observer((props: TaskItemProps) => {
        const { task } = props;

        const handleSave = () => {
            task.title.setTouched();

            if (!task.title.isValid) {
                return;
            }

            task.setInitialized();
            props.onTaskInitialized();
        };

        const onTaskRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            props.onTaskRemove(task.id);
            props.onTaskInitialized();
        };

        const onDragStart = (_e: React.DragEvent<HTMLDivElement>) => {
            if (!task.initialized) {
                return;
            }

            task.setDragging(true);
            props.onTaskDragStart(task);
        };

        const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            if (task.dragging) {
                return;
            }

            // Bad idea to put height here, but per say its not gonna change since task item height is fixed.
            const taskHeight = 40;
            const currentPosition = e.clientY;
            const containerTop = e.currentTarget.getBoundingClientRect().top;

            // Subtracts current hovered Y position from the Column Container's top value
            // and compares the result to a single container task height divided by too
            // in order to determine whether the position is above or below the task
            const dragPosition = currentPosition - containerTop > taskHeight / 2 ? 'below' : 'above';
            if (!task.draggedOn || (task.draggedOn && task.draggedOn !== dragPosition)) {
                props.onTaskDragOver(task, dragPosition);
            }
        };

        return (
            <div
                style={task.dragStyle}
                className={jClass(styles.columnTask, !task.initialized && styles.uninitialized)}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={props.onTaskDragEnd}
                draggable={task.initialized}
                onClick={task.initialized && props.onTaskDetails(task) || undefined}
            >
                {!task.initialized ? (
                    <>
                        <Input
                            bordered
                            placeholder='Add task name...'
                            value={task.title.value}
                            onChange={task.title.handleChange}
                            hasError={task.title.showError}
                            onBlur={handleSave}
                            onPressEnter={handleSave}
                        />
                        <Button transparent floated='right' onClick={onTaskRemove} icon={<Icon path={mdiDelete} />} />
                    </>
                ) : (
                    <div>
                        <span>#{task.id}</span>
                        <Link to={`/task/${task.id}`}>
                            <span>{task.title.value}</span>
                        </Link>
                        <Button transparent floated='right' onClick={onTaskRemove} icon={<Icon path={mdiDelete} />} />
                    </div>
                )}
            </div>
        );
    }),
);
