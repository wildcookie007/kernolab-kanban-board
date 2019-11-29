import React, { Component } from 'react';
import { BoardStore } from '@app/stores/boardStore';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { TaskModel } from '@app/models/TaskModel';
import history from '@app/history';
import { observable } from 'mobx';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Col } from '../shared/Col';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import { mdiArrowLeft, mdiTrashCan } from '@mdi/js';
import { Link } from 'react-router-dom';
import * as styles from '@app/styles/components/taskDetails.scss';
import { DiscardModal } from '../shared/DiscardModal';
import { ColumnModel } from '@app/models/ColumnModel';

interface Params {
    id: string;
}

interface TaskDetailsPageProps extends RouteComponentProps<Params> {
    boardStore: BoardStore;
}

@inject('boardStore')
@observer
export class TaskDetailsPage extends Component<TaskDetailsPageProps> {
    @observable task: TaskModel;
    @observable column: ColumnModel;

    componentDidMount() {
        const { match, boardStore } = this.props;
        const taskId = Number(match.params.id);

        // Find task in the board and assign it
        for (const col of boardStore.board.columns) {
            const currentTaskIdx = col.findTaskIdx(taskId);
            if (currentTaskIdx !== -1) {
                this.task = col.tasks[currentTaskIdx];
                this.column = col;
                break;
            }
        }

        if (!this.task) {
            return history.push('/oops');
        }
    }

    componentWillUnmount() {
        this.props.boardStore.setDiscardModalVisible(false);
    }

    handleDiscardModalOpen = () => {
        this.props.boardStore.setDiscardModalVisible(true);
    }

    handleDiscardModalClose = () => {
        this.props.boardStore.setDiscardModalVisible(false);
    };


    handleTaskDiscard = () => {
        const { boardStore } = this.props;

        this.column.removeTask(this.task.id);
        boardStore.setDiscardModalVisible(false);

        return history.push('/');
    };

    render() {
        const { boardStore } = this.props;
        const { isDiscardModalVisible } = boardStore;
        if (!this.task || !this.column) {
            return <LoadingSpinner />;
        }

        return (
            <Col xs={20} sm={16} md={14} lg={10} xxl={8} className={styles.taskDetailsContainer}>
                <div className={styles.headerContainer}>
                    <Link to='/'>
                        <Button primary icon={<Icon path={mdiArrowLeft} />}>
                            Back to board
                        </Button>
                    </Link>
                    <Button floated='right' icon={<Icon path={mdiTrashCan} />} onClick={this.handleDiscardModalOpen}>
                        Discard
                    </Button>
                </div>

                <div className={styles.details}>
                    <div>{this.task.title.value}</div>
                    <span>
                        {this.task.description.value || <i>No description available.</i>}
                    </span>
                    <div className={styles.datesContainer}>
                        <span>Created on: {this.task.createdDate}</span>
                        <span>Updated on: {this.task.updatedDate}</span>
                    </div>
                </div>

                <DiscardModal
                    visible={isDiscardModalVisible}
                    onClose={this.handleDiscardModalClose}
                    onConfirm={this.handleTaskDiscard}
                />
            </Col>
        );
    }
}
