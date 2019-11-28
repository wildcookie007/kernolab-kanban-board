import React from 'react';
import { Modal } from './Modal';

interface ErrorModalProps {
	message: string;
	hasMessage: boolean;
	onClose: () => void;
}

export const ErrorModal = React.memo((props: ErrorModalProps) => {
    const { message, hasMessage} = props;	

    return (
        <Modal
            visible={hasMessage}
            actions
            confirm
            confirmText='Close'
            onSubmitClick={props.onClose}
            onCloseClick={props.onClose}
            closeOnEsc={false}
            closeOnMaskClick={false}
        >
            <Modal.Header>An error has occured</Modal.Header>
            <Modal.Body>{message}</Modal.Body>
        </Modal>
    );
});

