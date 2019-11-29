import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from '../shared/Modal';

interface ColumnRemoveModalProps {
    visible: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export const ColumnRemoveModal = React.memo(observer((props: ColumnRemoveModalProps) => {
    const { visible } = props;

    return (
        <Modal
            actions
            submitText='Discard'
            cancelText='Cancel'
            onSubmitClick={props.onConfirm}
            onCancelClick={props.onClose}
            onCloseClick={props.onClose}
            visible={visible}
        >
            <Modal.Header>
                Are you sure?
            </Modal.Header>
            <Modal.Body>
                You are about to discard this column.
            </Modal.Body>
        </Modal>
    );
}));
