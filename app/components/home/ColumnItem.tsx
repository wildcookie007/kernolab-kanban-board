import React from 'react';
import { observer } from 'mobx-react';
import { ColumnModel } from '@app/models/ColumnModel';
import * as styles from '@app/styles/components/board.scss';
import { Input } from '../shared/Input';
import { Icon } from '../shared/Icon';
import { mdiPencil, mdiTrashCan, mdiPlusBox } from '@mdi/js';
import { Button } from '../shared/Button';
import { TaskItem } from './TaskItem';
import { DragInfoModel } from '@app/models/BoardModel';
import { TaskModel } from '@app/models/TaskModel';

interface ColumnItemProps {
    column: ColumnModel;
    dragInfo: DragInfoModel;
    onRemoveColumn: (columnId: number) => void;
    onTaskDragStart: (task: TaskModel, column: ColumnModel) => void;
    onTaskDragDrop: (column: ColumnModel) => void;
}

export const ColumnItem = React.memo(observer((props: ColumnItemProps) => {
    const { column, dragInfo } = props;

    const renderTaskList = (): JSX.Element => {
        if (!column.initialized) {
            return null;
        }

        return (
            <div className={styles.boardColumnTaskList}>
                {column.tasks.map((t, i) =>
                    <TaskItem
                        key={i}
                        task={t}
                        onTaskRemove={handleTaskRemove}
                        onTaskDragStart={onTaskDragStart}
                    />
                )}
            </div>
        );
    };

    const onTaskDragStart = (task: TaskModel) => {
        props.onTaskDragStart(task, column);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
        // Prevent bubbling if the drag makes no sense
        if (!column.initialized || !dragInfo || dragInfo.column.id === column.id) {
            return;
        }

        // const containerY = (e.target as Element).getBoundingClientRect();
        // const elementY = e.screenY;
        props.onTaskDragDrop(column);
    };

    const handleTaskRemove = (taskId: number) => {
        column.removeTask(taskId);
    };

    const handleSave = () => {
        column.name.setTouched();

        if (!column.name.isValid) {
            return;
        }

        column.setInitialized(true);

        if (column.name.isEditable) {
            column.name.setEditable();
        }
    };

    const onRemoveColumn = () => {
        props.onRemoveColumn(column.id);
    };

    return (
        <div className={styles.boardColumn} onDragOver={handleDragOver} onDrop={handleOnDrop}>
            <div className={styles.boardColumnHeader}>
                {(!column.initialized || column.name.isEditable) ?
                    <Input
                        bordered
                        placeholder='Add a name...'
                        value={column.name.value}
                        onChange={column.name.handleChange}
                        hasError={column.name.showError}
                        onBlur={handleSave}
                        onPressEnter={handleSave}
                    />
                    :
                    <span>
                        {column.name.value}
                        <Button
                            floated='right'
                            transparent
                            onClick={column.addTask}
                            icon={<Icon path={mdiPlusBox} />}
                            title='Add a task'
                        />
                        <Button
                            floated='right'
                            transparent
                            onClick={column.name.setEditable}
                            icon={<Icon path={mdiPencil} />}
                            title='Edit name'
                        />
                        <Button
                            floated='right'
                            transparent
                            onClick={onRemoveColumn}
                            icon={<Icon path={mdiTrashCan} />}
                            title='Delete column'
                        />
                    </span>
                }
            </div>
            {renderTaskList()}
        </div>
    );
}));
