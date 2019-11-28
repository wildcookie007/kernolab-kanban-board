import React, { Component } from 'react';
import { Col } from '../shared/Col';
import * as styles from '@app/styles/components/home.scss';
import { Board } from './Board';
import { inject, observer } from 'mobx-react';
import { BoardStore } from '@app/stores/boardStore';

interface HomePageProps {
    boardStore: BoardStore;
}

@inject('boardStore')
@observer
export class HomePage extends Component<HomePageProps> {
    componentDidMount() {
        this.props.boardStore.startNewBoard();
    }

    render() {
        const { boardStore: { board } } = this.props;

        return (
            <Col xxl={24} className={styles.homeContainer}>
                <div className={styles.headerContainer}>
                    Agile
                </div>
                <Board
                    board={board}
                />
            </Col>
        );
    }
}
