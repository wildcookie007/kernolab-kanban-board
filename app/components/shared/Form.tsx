import React, { Component } from 'react';
import * as styles from '@app/styles/components/shared/form.scss';
import { jClass } from '@app/utils/utils';
import { observer } from 'mobx-react';

type FormLayout =
	| 'inline'
	| 'vertical'

interface FormProps {
	children: React.ReactNode;
	layout?: FormLayout;
	className?: string;
}

interface FormItemProps {
	children: JSX.Element;
}

@observer
export class Form extends Component<FormProps> {
	static defaultProps = {
	    layout: 'inline'
	};

	static Item = (props: FormItemProps) => {
	    return (
	        <div className={styles.formItem}>
	            {props.children}
	        </div>
	    );
	};

	render() {
	    const { layout, className, children } = this.props;

	    return (
	        <div className={jClass(styles.form, className, styles[layout])}>
	            {children}
	        </div>
	    );
	}
};
