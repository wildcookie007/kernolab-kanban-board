import React, { Component } from 'react';
import { Col } from '../shared/Col';
import * as styles from '@app/styles/components/home.scss';

export class HomePage extends Component {
    render() {
        return (
            <Col xxl={24} className={styles.homeContainer}>
                <div className={styles.headerContainer}>
                    Kanban Board
                </div>
            </Col>
        );
    }
}
