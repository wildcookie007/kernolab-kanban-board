import React from 'react';
import * as styles from '@app/styles/components/notfound.scss';
import { Link } from 'react-router-dom';
import { mdiBug } from '@mdi/js';
import { Icon } from './shared/Icon';

export function NotFoundPage(): JSX.Element {
    return (
        <div className={styles.notFoundContainer}>
            <Icon path={mdiBug} size={12} />
            <h4>Sorry, this page is not available.</h4>
            <span>
				The page you requested could not be found, may be broken or has been removed.
                <div>
                    <Link to='/'>Go back</Link>
                </div>
            </span>
        </div>
    );
};
