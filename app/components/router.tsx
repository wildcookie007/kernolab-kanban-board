import React from 'react';
import { Route, Switch } from 'react-router';
import { NotFoundPage } from './NotFoundPage';
import { HomePage } from './home/HomePage';
import { TaskDetailsPage } from './task/TaskDetailsPage';

export function RouterMain(): JSX.Element {
    return (
        <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/task/:id' component={TaskDetailsPage} />
            <Route path='/oops' component={NotFoundPage} />
            <Route path='*' component={NotFoundPage} />
        </Switch>
    );
}
