import React, { Component, ReactNode, RefObject } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import * as styles from '@app/styles/components/shared/animation.scss';

export enum AnimationType {
	ZOOM = 'zoom',
	FADE = 'fade',
	SLIDE_DOWN = 'slideDown',
	SLIDE_LEFT = 'slideLeft',
	SLIDE_RIGHT = 'slideRight',
	SLIDE_UP = 'slideUp',
	FLIP = 'flip',
	ROTATE = 'rotate',
	DOOR = 'door'
}

interface AnimationProps {
	visible: boolean;
	name?: AnimationType;
	className?: string;
	onAnimationEnd?: (type?: string) => void;
	duration?: number;
	startAnimation?: AnimationType;
	endAnimation?: AnimationType;
	children?: ReactNode;
}

@observer
export class Animation extends Component<AnimationProps> {
	containerNode: RefObject<HTMLDivElement> = React.createRef();

	@observable private _isMounted = false;
	@observable private _animationType = 'Leave';

	componentDidMount() {
	    if (this.props.visible) {
	        this._setMounted(true);
	        this._setAnimationType('Enter');
	    }
	}

	@action private _setMounted = (value: boolean) => {
	    this._isMounted = value;
	};

	@action private _setAnimationType = (value: string) => {
	    this._animationType = value;
	};

	componentDidUpdate(prevProps: AnimationProps) {
	    if (this.props.visible && !prevProps.visible) {
	        this._setMounted(true);
	        this._setAnimationType('Enter');
	    } else if (!this.props.visible && prevProps.visible) {
	        this._setAnimationType('Leave');
	    }
	}

	animationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
	    if (this._animationType === 'Leave') {
	        this._setMounted(false);
	    }

	    if (e.target === this.containerNode.current) {
	        const { onAnimationEnd } = this.props;
	        if (onAnimationEnd) {
	            onAnimationEnd(this._animationType);
	        }
	    }
	};

	render() {
	    const { name = AnimationType.ZOOM, duration = 300} = this.props;
	    const style = {
	        display: this._isMounted ? '' : 'none',
	        animationDuration: duration + 'ms',
	        WebkitAnimationDuration: duration + 'ms'
	    };

	    const animationName = () => {
	        if (this._animationType === 'Leave') {
	            return this.props.endAnimation || name;
	        }
	        return this.props.startAnimation || name;
	    };

	    const r = () => {
	        if (this._isMounted) {
	            return (
	                <div
	                    ref={this.containerNode}
	                    tabIndex={-1}
	                    onAnimationEnd={this.animationEnd}
	                    style={style}
	                    className={[
	                        styles[`${animationName()}${this._animationType}`],
	                        this.props.className || undefined
	                    ].join(' ')}
	                >
	                    {this.props.children}
	                </div>
	            );
	        }
	        return null;
	    };
	    return r();
	}
}
