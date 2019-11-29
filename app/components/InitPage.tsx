import React, { Component } from 'react';
import { StorageService } from '@app/services/storageService';
import { inject, observer } from 'mobx-react';
import { RouterMain } from './router';
import { BoardStore } from '@app/stores/boardStore';
import LoadingSpinner from './shared/LoadingSpinner';
import { InitStore } from '@app/stores/initStore';

interface InitPageProps {
    storageService?: StorageService;
    boardStore?: BoardStore;
    initStore?: InitStore;
}

@inject('boardStore', 'initStore')
@observer
export class InitPage extends Component<InitPageProps> {
    componentDidMount() {
        const { initStore, boardStore } = this.props;
        boardStore.loadBoard();
        initStore.setAppLoaded();
    }

    render() {
        const { initStore } = this.props;
        if (!initStore.isAppLoaded || initStore.isAppLoading) {
            return <LoadingSpinner />;
        }

        return <RouterMain />;
    }
}
