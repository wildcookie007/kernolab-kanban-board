import React, { Component } from 'react';
import { Col } from '../shared/Col';
import * as styles from '@app/styles/components/home.scss';
import { Board } from './Board';
import { inject, observer } from 'mobx-react';
import { BoardStore } from '@app/stores/boardStore';
import { TaskModel } from '@app/models/TaskModel';
import { TaskDetailsModal } from './TaskDetailsModal';

interface HomePageProps {
    boardStore: BoardStore;
}

@inject('boardStore')
@observer
export class HomePage extends Component<HomePageProps> {
    componentDidMount() {
        this.props.boardStore.loadBoard();
    }

    componentWillUnmount() {
        this.handleTaskDetailsModalClose();
    }

    handleSaveBoard = () => {
        this.props.boardStore.saveBoard();
    };

    handleTaskDetails = (task: TaskModel) => () => {
        this.props.boardStore.setTaskModalDetails(task);
        this.props.boardStore.setTaskModalVisible(true);
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
        const { boardStore: { board, isTaskModalVisible, taskModalDetails } } = this.props;

        return (
            <Col xxl={24} className={styles.homeContainer}>
                <div className={styles.headerContainer}>
                    Agile
                </div>
                <Board
                    board={board}
                    onBoardUpdate={this.handleSaveBoard}
                    onTaskDetails={this.handleTaskDetails}
                />
                <TaskDetailsModal
                    visible={isTaskModalVisible}
                    details={taskModalDetails}
                    onSave={this.handleSaveTask}
                    onClose={this.handleTaskDetailsModalClose}
                />
            </Col>
        );
    }
}
