import React, { Component, RefObject } from 'react';
import { KEY_ENTER, jClass } from '@app/utils/utils';
import * as styles from '@app/styles/components/shared/input.scss';
import { observer } from 'mobx-react';

interface InputProps {
	onChange?: (value: string) => void;
	onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onFocus?: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	type?: string;
	title?: string;
	onPressEnter?: () =>  void;
	className?: string;
	style?: React.CSSProperties;
	bordered?: boolean;
	minLen?: number;
	maxLen?: number;
	textarea?: boolean;
	noNewLine?: boolean;
	hasError?: boolean;
	inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement>;
	icon?: JSX.Element;
}

@observer
export class Input extends Component<InputProps> {
	handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
	    if (this.props.onChangeEvent) {
	        this.props.onChangeEvent(e);
	        return;
	    }

	    if (!this.props.onChange) {
	        return;
	    }

	    if (this.props.noNewLine) {
	        this.props.onChange(e.target.value.replace(/(?:\r\n|\r|\n)/g, ''));
	        return;
	    }
	    this.props.onChange(e.target.value);
	};

	handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
	    if (e.charCode === KEY_ENTER && this.props.onPressEnter) {
	        this.props.onPressEnter();
	    }
	};

	handleFocus = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
	    this.props.onFocus && this.props.onFocus(e);
	};

	handleBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
	    this.props.onBlur && this.props.onBlur(e);
	};

	render() {
	    const formattedProps = {
	        minLength: this.props.minLen,
	        maxLength: this.props.maxLen,
	        title: this.props.title,
	        className: jClass(
	            styles.input,
	            this.props.icon && styles.icon,
	            this.props.textarea && styles.textarea,
	            this.props.bordered && styles.bordered,
	            this.props.disabled && styles.disabled,
	            this.props.className && this.props.className,
	            this.props.hasError && styles.error
	        ),
	        style: this.props.style,
	        placeholder: this.props.placeholder,
	        type: this.props.type,
	        disabled: this.props.disabled,
	        value: this.props.value || '',
	        onChange: this.handleChange,
	        onKeyPress: this.handleKeyPress,
	        onFocus: this.handleFocus,
	        onBlur: this.handleBlur
	    };

	    return (
	        <>
	            {this.props.textarea ? (
				    <textarea
				        {...formattedProps}
				        ref={this.props.inputRef as RefObject<HTMLTextAreaElement>}
				    />
	            ) : (
				    this.props.icon ? (
				        <div className={styles.iconContainer}>
				            <input
				                {...formattedProps}
				                ref={this.props.inputRef as RefObject<HTMLInputElement>}
				            />
				            {this.props.icon}
				        </div>
				    ) : (
				        <input
				            {...formattedProps}
				            ref={this.props.inputRef as RefObject<HTMLInputElement>}
				        />
				    )
	            )}
	        </>
	    );
	}
}
