import React from 'react';
import { observer } from 'mobx-react';
import { ColumnModel } from '@app/models/ColumnModel';
import * as styles from '@app/styles/components/board.scss';
import { Input } from '../shared/Input';
import { Icon } from '../shared/Icon';
import { mdiPencil, mdiTrashCan, mdiPlusBox } from '@mdi/js';
import { Button } from '../shared/Button';
import { TaskItem } from './TaskItem';
import { CurrentlyDraggedModel } from '@app/models/BoardModel';
import { TaskModel, DraggedOn } from '@app/models/TaskModel';

interface ColumnItemProps {
    column: ColumnModel;
    currentlyDragged: CurrentlyDraggedModel;
    onRemoveColumn: (columnId: number) => () => void;
    onTaskDragStart: (column: ColumnModel) => (task: TaskModel) => void;
    onTaskDragDrop: (column: ColumnModel) => void;
    onTaskDragOver: (column: ColumnModel) => (task: TaskModel, position: DraggedOn) => void;
    onColumnDragOver: (column: ColumnModel) => void;
    onTaskDetails: (task: TaskModel) => (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    onTaskDragEnd: () => void;
    onBoardUpdate: () => void;
}

export const ColumnItem = React.memo(
    observer((props: ColumnItemProps) => {
        const { column, currentlyDragged } = props;

        const renderTaskList = (): JSX.Element => {
            if (!column.initialized) {
                return null;
            }

            return (
                <div className={styles.boardColumnTaskList}>
                    {column.tasks.map((t) => (
                        <TaskItem
                            key={t.id}
                            task={t}
                            onTaskRemove={column.removeTask}
                            onTaskDragStart={props.onTaskDragStart(column)}
                            onTaskDragOver={props.onTaskDragOver(column)}
                            onTaskDragEnd={props.onTaskDragEnd}
                            onTaskInitialized={onTaskInitialized}
                            onTaskDetails={props.onTaskDetails}
                        />
                    ))}
                </div>
            );
        };

        const onTaskInitialized = () => {
            column.setTaskOnGoingCreate();
            props.onBoardUpdate();
        };

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            props.onColumnDragOver(column);
        };

        const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
            // Prevent bubbling if the drag makes no sense
            if (!column.initialized || !currentlyDragged) {
                return;
            }

            props.onTaskDragDrop(column);
        };

        const handleSave = () => {
            column.name.setTouched();

            if (!column.name.isValid) {
                return;
            }

            column.setInitialized(true);
            props.onBoardUpdate();

            if (column.name.isEditable) {
                column.name.setEditable();
            }
        };

        return (
            <div className={styles.boardColumn} onDragOver={handleDragOver} onDrop={handleOnDrop}>
                <div className={styles.boardColumnHeader}>
                    {!column.initialized || column.name.isEditable ? (
                        <Input
                            bordered
                            placeholder='Add a name...'
                            value={column.name.value}
                            onChange={column.name.handleChange}
                            hasError={column.name.showError}
                            onBlur={handleSave}
                            onPressEnter={handleSave}
                        />
                    ) : (
                        <span>
                            {column.name.value}
                            <div className={styles.columnActions}>
                                <Button
                                    floated='right'
                                    transparent
                                    disabled={column.taskOnGoingCreate}
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
                                    onClick={props.onRemoveColumn(column.id)}
                                    icon={<Icon path={mdiTrashCan} />}
                                    title='Delete column'
                                />
                            </div>
                        </span>
                    )}
                </div>
                {renderTaskList()}
            </div>
        );
    }),
);
