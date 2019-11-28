import React, { Component } from 'react';
import { StorageService } from '@app/services/storageService';
import { inject, observer } from 'mobx-react';
import { RouterMain } from './router';
import LoadingSpinner from './shared/LoadingSpinner';
import { ErrorModal } from './shared/ErrorModal';
import { NotificationStore } from '@app/stores/notificationStore';

interface InitPageProps {
    tokenService?: StorageService;
    notificationStore?: NotificationStore;
}

@inject('tokenService', 'notificationStore')
@observer
export class InitPage extends Component<InitPageProps> {
    async componentDidMount() {
        const { tokenService } = this.props;
        tokenService.setAppLoaded();
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
        const { tokenService } = this.props;
        const { appLoading, appLoaded } = tokenService;

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
