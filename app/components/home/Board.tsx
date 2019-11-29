import React, { Component } from 'react';
import { BoardModel } from '@app/models/BoardModel';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Col } from '../shared/Col';
import * as styles from '@app/styles/components/board.scss';
import { ColumnItem } from './ColumnItem';
import { Button } from '../shared/Button';
import { mdiPlus } from '@mdi/js';
import { Icon } from '../shared/Icon';
import { observer } from 'mobx-react';
import { TaskModel, DraggedOn, TaskConstructor } from '@app/models/TaskModel';
import { ColumnModel } from '@app/models/ColumnModel';
import { action } from 'mobx';

interface BoardProps {
    board: BoardModel;
    onBoardUpdate: () => void;
}

@observer
export class Board extends Component<BoardProps> {
    handleRemoveColumn = (columnId: number) => () => {
        this.props.board.removeColumn(columnId);
        this.props.onBoardUpdate();
    };

    /**
     * Bubbles up from child <TaskItem /> onDragStart event
     * @param {ColumnModel} column - The original column from which the task is being dragged off.
     * @param {TaskModel} task - The task that is currently being dragged.
     */
    handleTaskDrag = (column: ColumnModel) => (task: TaskModel) => {
        this.props.board.setCurrentlyDraggedTask(task, column);
    };

    handleTaskDragEnd = () => {
        this.props.board.resetCurrentDrag();
    };

    /**
     * @param {ColumnModel} droppedOnColumn - The column on which the task was dropped.
     */
    handleTaskDrop = (droppedOnColumn: ColumnModel) => {
        const { board, onBoardUpdate } = this.props;
        const { currentlyDragged } = board;

        if (
            currentlyDragged.column === droppedOnColumn &&
            (currentlyDragged.targetIdx === -1 || currentlyDragged.targetIdx === undefined)
        ) {
            board.resetCurrentDrag();
            return;
        }

        // Copy the task
        const copyTarget: TaskConstructor = Object.assign({}, currentlyDragged.task.toConstructorRequest());
        currentlyDragged.column.removeTask(currentlyDragged.task.id);
        droppedOnColumn.copyDroppedTask(copyTarget, currentlyDragged.targetIdx);

        // Remove task from previous column and reset drag properties
        board.resetCurrentDrag();

        onBoardUpdate();
    };

    /**
     * @param {TaskModel} task - The task on which another(dragged) task is currently hovering.
     * @param {ColumnModel} column - The column to which the task, which is hovered upon, belongs to.
     * @param {DraggedOn} dragPosition - Specifies whether the task is hovering above or below
     */
    @action handleTaskDragOver = (column: ColumnModel) => (task: TaskModel, dragPosition: DraggedOn) => {
        const { board } = this.props;
        const {
            currentlyDragged: { targetTask },
            currentlyDragged,
        } = board;

        currentlyDragged.targetIdx = column.findTaskIdx(task.id);

        // Adjust indexes based on wanted position, different drop column accounted
        if (board.currentlyDragged.column === column) {
            const currentTaskIdx = column.findTaskIdx(currentlyDragged.task.id);
            currentlyDragged.targetIdx = column.getUpdatedIndexToTarget(
                dragPosition,
                currentTaskIdx,
                currentlyDragged.targetIdx,
            );

            // Check if the target position points to the same spot the currently dragged task is
            if (currentlyDragged.targetIdx === currentTaskIdx) {
                task.setDraggedOn(null);
                currentlyDragged.targetIdx = -1;
                return;
            }
        } else {
            dragPosition === 'below' && currentlyDragged.targetIdx++;
        }

        // If it's the same task - just update position
        if (targetTask === task) {
            targetTask.draggedOn = dragPosition;
            return;
        }

        // Reset previous target since we got a new over drag
        if (targetTask) {
            targetTask.setDraggedOn(null);
        }

        // Assign new target
        task.setDraggedOn(dragPosition);
        currentlyDragged.targetTask = task;
    };

    renderColumnList = () => {
        const { board } = this.props;

        return board.columns.map((c) => (
            <ColumnItem
                key={c.id}
                column={c}
                currentlyDragged={board.currentlyDragged}
                onRemoveColumn={this.handleRemoveColumn}
                onBoardUpdate={this.props.onBoardUpdate}
                onTaskDragStart={this.handleTaskDrag}
                onTaskDragDrop={this.handleTaskDrop}
                onTaskDragOver={this.handleTaskDragOver}
                onTaskDragEnd={this.handleTaskDragEnd}
            />
        ));
    };

    onAddColumn = () => {
        this.props.board.addColumn();
    };

    render() {
        const { board } = this.props;
        if (!board) {
            return <LoadingSpinner />;
        }

        return (
            <Col xxl={22} className={styles.boardContainer}>
                <Button primary onClick={this.onAddColumn} icon={<Icon path={mdiPlus} />}>
                    Add a column
                </Button>
                <div className={styles.boardColumnList}>{this.renderColumnList()}</div>
            </Col>
        );
    }
}
