import React, { Component } from 'react';
import { StorageService } from '@app/services/storageService';
import { inject, observer } from 'mobx-react';
import { RouterMain } from './router';
import LoadingSpinner from './shared/LoadingSpinner';
import { ErrorModal } from './shared/ErrorModal';
import { NotificationStore } from '@app/stores/notificationStore';

interface InitPageProps {
    storageService?: StorageService;
    notificationStore?: NotificationStore;
}

@inject('storageService', 'notificationStore')
@observer
export class InitPage extends Component<InitPageProps> {
    async componentDidMount() {
        const { storageService } = this.props;
        storageService.setAppLoaded();
    }

    handleCloseErrorModal = () => {
        this.props.notificationStore.setMessage(null);
    }

    renderError = (): JSX.Element => {
        const { message, hasMessage } = this.props.notificationStore;
        if (hasMessage) {
            return (
                <ErrorModal
                    message={message}
                    hasMessage={hasMessage}
                    onClose={this.handleCloseErrorModal}
                />
            );
        }
    };

    render() {
        const { storageService } = this.props;
        const { appLoading, appLoaded } = storageService;

        if (appLoading || !appLoaded) {
            return <LoadingSpinner />;
        }

        return (
            <>
                <RouterMain />
                {this.renderError()}
            </>
        );
    }
}
