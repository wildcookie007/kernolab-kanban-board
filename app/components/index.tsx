import React, { Component } from 'react';
import { Router as AppRouter } from 'react-router-dom';
import history from '@app/history';
import { InitPage } from './InitPage';

export class Index extends Component {
    render() {
        return (
            <AppRouter history={history}>
                <InitPage />
            </AppRouter>
        );
    }
}
