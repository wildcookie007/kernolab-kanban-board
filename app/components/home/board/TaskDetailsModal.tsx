import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from '../../shared/Modal';
import { TaskModel } from '@app/models/TaskModel';
import { Input } from '../../shared/Input';

interface TaskDetailsModalProps {
    visible: boolean;
    details: TaskModel;
    onSave: () => void;
    onClose: () => void;
}

export const TaskDetailsModal = React.memo(observer((props: TaskDetailsModalProps) => {
    const { visible, details } = props;

    return (
        <Modal
            actions
            submitText='Save'
            cancelText='Cancel'
            onSubmitClick={props.onSave}
            onCancelClick={props.onClose}
            onCloseClick={props.onClose}
            visible={visible}
        >
            <Modal.Header>
                {details &&
                    <>
                        <span>Title</span>
                        <Input
                            bordered
                            onFocus={details.title.setTouched}
                            hasError={details.title.showError}
                            onChange={details.title.handleChange}
                            value={details.title.value}
                        />
                    </>
                }
            </Modal.Header>
            <Modal.Body>
                {details &&
                    <>
                        <span>Description</span>
                        <Input
                            bordered
                            textarea
                            noNewLine
                            onChange={details.description.handleChange}
                            value={details.description.value}
                        />
                    </>
                }
            </Modal.Body>
        </Modal>
    );
}));
