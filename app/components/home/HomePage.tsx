import React, { Component } from 'react';
import { Col } from '../shared/Col';
import * as styles from '@app/styles/components/home.scss';
import { Board } from './board/Board';
import { inject, observer } from 'mobx-react';
import { BoardStore } from '@app/stores/boardStore';
import { TaskModel } from '@app/models/TaskModel';
import { TaskDetailsModal } from './board/TaskDetailsModal';
import { DiscardModal } from '../shared/DiscardModal';

interface HomePageProps {
    boardStore: BoardStore;
}

@inject('boardStore')
@observer
export class HomePage extends Component<HomePageProps> {
    componentWillUnmount() {
        this.handleTaskDetailsModalClose();
    }

    handleSaveBoard = () => {
        this.props.boardStore.saveBoard();
    };

    handleColumnRemoveModal = (columnId: number) => () => {
        const { boardStore } = this.props;

        boardStore.setRemoveColumnModalDetails(columnId);
        boardStore.setDiscardModalVisible(true);
    }

    handleColumnRemoveModalConfirm = () => {
        const { boardStore } = this.props;

        boardStore.setDiscardModalVisible(false);
        boardStore.removeColumn();
        boardStore.saveBoard();
    };

    handleColumnRemoveModalClose = () => {
        this.props.boardStore.setDiscardModalVisible(false);
    }

    handleTaskDetails = (task: TaskModel) => () => {
        const { boardStore } = this.props;

        boardStore.setTaskModalDetails(task);
        boardStore.setTaskModalVisible(true);
    };

    handleTaskDetailsModalClose = () => {
        const { boardStore } = this.props;

        boardStore.setTaskModalVisible(false);
        boardStore.setTaskModalDetails(null);
    }

    handleSaveTask = () => {
        const { boardStore } = this.props;

        boardStore.saveTaskDetails();
        boardStore.setTaskModalDetails(null);
        boardStore.setTaskModalVisible(false);
        boardStore.saveBoard();
    };

    render() {
        const { boardStore: {
            board,
            isTaskModalVisible,
            taskModalDetails,
            isDiscardModalVisible: isColumnRemoveModalVisible
        } } = this.props;

        return (
            <Col xxl={24} className={styles.homeContainer}>
                <div className={styles.headerContainer}>
                    Agile
                </div>
                <Board
                    board={board}
                    onBoardUpdate={this.handleSaveBoard}
                    onTaskDetails={this.handleTaskDetails}
                    onColumnRemove={this.handleColumnRemoveModal}
                />
                <TaskDetailsModal
                    visible={isTaskModalVisible}
                    details={taskModalDetails}
                    onSave={this.handleSaveTask}
                    onClose={this.handleTaskDetailsModalClose}
                />
                <DiscardModal
                    visible={isColumnRemoveModalVisible}
                    onClose={this.handleColumnRemoveModalClose}
                    onConfirm={this.handleColumnRemoveModalConfirm}
                />
            </Col>
        );
    }
}
