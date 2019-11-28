import React, { Component, ReactNode, RefObject } from 'react';
import { Button } from './Button';
import * as styles from '@app/styles/components/shared/modal.scss';
import * as animStyles from '@app/styles/components/shared/animation.scss';
import { Icon } from './Icon';
import { mdiClose } from '@mdi/js';
import { observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import { KEY_ESCAPE, jClass } from '@app/utils/utils';
import { AnimationType } from './Animation';
import { createPortal } from 'react-dom';

interface ModalProps {
	className?: string;
	style?: React.CSSProperties;
	visible: boolean;
	showMask?: boolean;
	closeOnMaskClick?: boolean;
	onSubmitClick?: () => void;
	onCancelClick?: () => void;
	onCloseClick?: () => void;
	onAnimationEnd?: () => void;
	actions?: boolean;
	confirm?: boolean;
	confirmText?: string;
	cancelText?: string;
	submitText?: string;
	animation?: AnimationType;
	duration?: number;
	closeOnEsc?: boolean;
	maskStyle?: React.CSSProperties;
}

interface HeaderProps {
	children: ReactNode;
}

interface BodyProps {
	children: ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

@observer
export class Modal extends Component<ModalProps> {
	containerNode: RefObject<HTMLDivElement> = React.createRef();
	@observable private _isMounted = false;
	@observable private _animationType = 'Leave';
	@observable private _inAnimation = false;
	@observable private _isNested = false;
	private readonly _rootNode = document.getElementById('root');

	static defaultProps: ModalProps = {
	    visible: false,
	    submitText: 'Submit',
	    cancelText: 'Cancel',
	    animation: AnimationType.ZOOM,
	    duration: 300,
	    closeOnMaskClick: true,
	    showMask: true,
	    className: undefined
	};

	private _addBodyStyles = () => {
	    if (this._rootNode.offsetTop) {
	        runInAction(() => (this._isNested = true));
	        return;
	    }
	    this._rootNode.style.top = `-${document.documentElement.scrollTop}px`;
	    setTimeout(() => this._rootNode.classList.add(styles.bodyModal), 0);
	}

	private _removeBodyStyles = () => {
	    if (this._isNested) {
	        return;
	    }

	    const offset = this._rootNode.offsetTop;
	    this._rootNode.style.top = ``;
	    this._rootNode.classList.remove(styles.bodyModal);

	    if (offset) {
	        document.documentElement.scrollTo({ top: (offset * -1) });
	    }
	}

	onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
	    const { closeOnEsc = true } = this.props;
	    if (closeOnEsc && e.keyCode === KEY_ESCAPE) {
	        this.props.onCloseClick();
	    }
	};

	componentDidMount() {
	    if (this.props.visible) {
	        this._setMounted(true);
	        this._setAnimationType('Enter');
	        this._addBodyStyles();
	    }
	}

	componentWillUnmount() {
	    this._removeBodyStyles();
	}

	@action private _setMounted = (value: boolean) => {
	    this._isMounted = value;
	};

	@action private _setAnimationType = (value: string) => {
	    this._animationType = value;
	};

	@action private _setInAnimation = (value: boolean) => {
	    this._inAnimation = value;
	};

	componentDidUpdate(prevProps: ModalProps) {
	    if (this.props.visible && !prevProps.visible) {
	        this._addBodyStyles();
	        this._setMounted(true);
	        this._setAnimationType('Enter');
	        this._setInAnimation(true);
	    } else if (!this.props.visible && prevProps.visible) {
	        this._setAnimationType('Leave');
	        this._setInAnimation(true);
	        this._removeBodyStyles();
	    }
	}

	static Header = (headerProps: HeaderProps) => {
	    return <div className={styles.header}>{headerProps.children}</div>;
	};

	static Body = (bodyProps: BodyProps) => {
	    return (
	        <div
	            style={bodyProps.style}
	            className={[
	                styles.body,
	                bodyProps.className || undefined
	            ].join(' ')}
	        >
	            {bodyProps.children}
	        </div>
	    );
	};

	handleSubmitClick = () => {
	    this.props.onSubmitClick && this.props.onSubmitClick();
	    this._removeBodyStyles();
	};

	handleDeclineClick = () => {
	    this.props.onCancelClick && this.props.onCancelClick();
	    this._removeBodyStyles();
	};

	handleCloseClick = () => {
	    this._removeBodyStyles();
	    this.props.onCloseClick && this.props.onCloseClick();
	};

	animationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
	    const { closeOnEsc = true } = this.props;
	    if (this._animationType === 'Leave') {
	        this._setMounted(false);
	        this._setInAnimation(false);
	    } else if (closeOnEsc) {
	        this.containerNode.current.focus();
	    }

	    if (e.target === this.containerNode.current) {
	        const { onAnimationEnd } = this.props;
	        onAnimationEnd && onAnimationEnd();
	    }
	};

	renderCloseButton = (): JSX.Element => {
	    return (
	        <Button className={styles.close} onClick={this.handleCloseClick}>
	            <Icon path={mdiClose} />
	        </Button>
	    );
	};

	renderActions = () => {
	    const { submitText, cancelText } = this.props;

	    return (
	        <div className={styles.footer}>
	            {!this.props.confirm && (
	                <>
	                    <Button primary className={styles.submit} onClick={this.handleSubmitClick}>
						    {submitText}
	                    </Button>
	                    <Button className={styles.cancel} onClick={this.handleDeclineClick}>
						    {cancelText}
	                    </Button>
	                </>
	            )}
	            {this.props.confirm && (
	                <Button primary onClick={this.handleSubmitClick}>
	                    {this.props.confirmText}
	                </Button>
	            )}
	        </div>
	    );
	};

	renderModalContent = (): JSX.Element => {
	    const { animation, duration, className } = this.props;
	    return (
	        <div
	            style={{
	                animationDuration: duration + 'ms',
	                WebkitAnimationDuration: duration + 'ms',
	            }}
	            className={[
	                className || undefined,
	                styles.content,
	                animStyles[`${animation}${this._animationType}`],
	            ].join(' ')}
	        >
	            {this.renderCloseButton()}
	            {this.props.children}
	            {this.props.actions && this.renderActions()}
	        </div>
	    );
	};

	renderMask = (): JSX.Element => {
	    const { showMask, maskStyle, duration, closeOnMaskClick } = this.props;

	    const style = {
	        ...maskStyle,
	        animationDuration: duration + 'ms',
	        WebkitAnimationDuration: duration + 'ms'
	    };

	    const onClick = closeOnMaskClick ? this.handleCloseClick : null;
	    if (showMask) {
	        return (
	            <div
	                className={[
	                    styles.mask,
	                    animStyles[`fade${this._animationType}`]
	                ].join(' ')}
	                style={style}
	                onClick={onClick}
	            />
	        );
	    }

	    return null;
	};

	render() {
	    const { duration } = this.props;

	    const style = {
	        display: this._isMounted ? '' : 'none',
	        animationDuration: duration + 'ms',
	        WebkitAnimationDuration: duration + 'ms',
	        ...this.props.style,
	    };

	    const r = () => {
	        if (this.props.visible || this._inAnimation) {
	            return (
	                <div
	                    ref={this.containerNode}
	                    tabIndex={-1}
	                    onAnimationEnd={this.animationEnd}
	                    onKeyUp={this.onKeyUp}
	                    style={style}
	                    className={jClass(
	                        styles.modal,
	                        animStyles[`fade${this._animationType}`]
	                    )}
	                >
	                    {this.renderMask()}
	                    <div style={{ position: 'relative', top: '20%' }}>{this.renderModalContent()}</div>
	                </div>
	            );
	        }
	        return null;
	    };

	    return createPortal(
	        r(),
	        document.body,
	    );
	}
}
