import React from 'react';
import { Route, Switch } from 'react-router';
import { NotFoundPage } from './NotFoundPage';
import { HomePage } from './home/HomePage';

export function RouterMain(): JSX.Element {
    return (
        <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='*' component={NotFoundPage} />
        </Switch>
    );
}
