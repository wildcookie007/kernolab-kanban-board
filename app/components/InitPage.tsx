import React, { Component } from 'react';
import { StorageService } from '@app/services/storageService';
import { inject, observer } from 'mobx-react';
import { RouterMain } from './router';
import { ErrorModal } from './shared/ErrorModal';
import { NotificationStore } from '@app/stores/notificationStore';

interface InitPageProps {
    storageService?: StorageService;
    notificationStore?: NotificationStore;
}

@inject('notificationStore')
@observer
export class InitPage extends Component<InitPageProps> {
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
        return (
            <>
                <RouterMain />
                {this.renderError()}
            </>
        );
    }
}
