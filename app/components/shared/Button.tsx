import React, { ReactNode, Component } from 'react';
import { debounce } from 'lodash';
import * as styles from '@app/styles/components/shared/button.scss';
import * as iconStyles from '@app/styles/components/shared/icon.scss';
import * as loadStyles from '@app/styles/components/shared/loading.scss';
import { jClass } from '@app/utils/utils';
import { observer } from 'mobx-react';

interface ButtonProps /* extends React.HTMLProps<HTMLButtonElement> */ {
	primary?: boolean;
	rounded?: boolean;
	color?: string;
	floated?: 'left' | 'right';
	loading?: boolean;
	fluid?: boolean;
	type?: 'submit' | 'reset' | 'button';
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	size?: 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'massive';
	children?: ReactNode;
	title?: string;
	className?: string;
	debounceTime?: number;
	transparent?: boolean;
	label?: boolean;
	style?: React.CSSProperties;
	icon?: JSX.Element;
	selectable?: boolean;
}

@observer
export class Button extends Component<ButtonProps> {
	handleOnClick = 
		debounce(
		    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		        if (!this.props.onClick) {
		            return;
		        }

		        if (this.props.disabled || this.props.loading) {
		            e.preventDefault();
		            return;
		        }

		        this.props.onClick(e);
		    },
		    this.props.debounceTime || 300,
		    { leading: true, trailing: false }
		);


	static defaultProps: ButtonProps = {
	    selectable: true
	}

	render() {
	    return (
	        <button
	            title={this.props.title}
	            onClick={this.handleOnClick}
	            type={this.props.type}
	            style={{ ...this.props.style, color: this.props.color }}
	            disabled={this.props.disabled || this.props.loading}
	            className={jClass(
	                iconStyles.resizing,
	                this.props.className,
	                styles.button,
	                this.props.selectable && styles.selectable,
	                this.props.primary && styles.primary,
	                this.props.floated
	                    ? (this.props.floated === 'left'
	                        ? styles.floatedLeft
	                        : styles.floatedRight)
	                    : undefined,
	                this.props.fluid && styles.fluid,
	                this.props.rounded && styles.rounded,
	                this.props.label && styles.label,
	                this.props.transparent && styles.transparent,
	                this.props.size && styles[this.props.size],
	                this.props.disabled && styles.disabled)
	            }>
	            {(this.props.icon && !this.props.loading) ? this.props.icon : null}
	            <span className={this.props.loading ? loadStyles.isLoading : undefined}>{this.props.children}</span>
	        </button>
	    );
	}
}
