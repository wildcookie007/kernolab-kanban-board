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
import { TaskModel } from '@app/models/TaskModel';
import { ColumnModel } from '@app/models/ColumnModel';

interface BoardProps {
    board: BoardModel;
}

@observer
export class Board extends Component<BoardProps> {
    handleRemoveColumn = (columnId: number) => {
        this.props.board.removeColumn(columnId);
    }

    handleTaskDrag = (task: TaskModel, column: ColumnModel) => {
        this.props.board.setDraggedTask(task, column);
    }

    handleTaskDrop = (column: ColumnModel) => {
        const { board } = this.props;

        column.copyDragTask(board.dragInfo.task);
        board.dragInfo.column.removeTask(board.dragInfo.task.id);
    }

    renderColumnList = () => {
        const { board } = this.props;

        return board.columns.map((c, idx) =>
            <ColumnItem
                key={idx}
                column={c}
                dragInfo={board.dragInfo}
                onRemoveColumn={this.handleRemoveColumn}
                onTaskDragStart={this.handleTaskDrag}
                onTaskDragDrop={this.handleTaskDrop}
            />
        );
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
                <div className={styles.boardColumnList}>
                    {this.renderColumnList()}
                </div>
            </Col>
        );
    }
}
