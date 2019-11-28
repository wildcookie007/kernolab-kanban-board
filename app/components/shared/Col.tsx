import React from 'react';
import * as styles from '@app/styles/components/shared/col.scss';
import { omit } from 'lodash';
import { jClass } from '@app/utils/utils';

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
	xxs?: number;
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
	xxl?: number;
}

export const Col = React.memo((props: ColProps): JSX.Element => {
    const xl = props.xl || props.xxl;
    const lg = props.lg || xl;
    const md = props.md || lg;
    const sm = props.sm || md;
    const xs = props.xs || sm;
    const xxs = props.xxs || xs;

    const formattedProps = omit(props, ['xxs, xs, sm, md, lg, xl, xxl']);

    return (
        <div
            {...formattedProps}
            className={jClass(
                styles.col,
                xxs && styles[`colXxs${xxs}`],
                xs && styles[`colXs${xs}`],
                sm && styles[`colSm${sm}`],
                md && styles[`colMd${md}`],
                lg && styles[`colLg${lg}`],
                xl && styles[`colXl${xl}`],
                props.xxl && styles[`colXxl${props.xxl}`],
                props.className
            )}
        />
    );
});
