import React from 'react';
import * as styles from '@app/styles/components/shared/icon.scss';
import { jClass } from '@app/utils/utils';

interface HTMLProps {
	className?: string;
	svgClassName?: string;
}

interface IconProps extends HTMLProps {
	path?: string;
	title?: string;
	description?: string;
	size?: 'small' | 'medium' | 'large' | number;
	floated?: 'left' | 'right';
	color?: string;
	horizontal?: boolean;
	vertical?: boolean;
	rotate?: number;
	spin?: boolean | number;
	style?: React.CSSProperties;
	svgStyle?: React.CSSProperties;
	svgChildren?: JSX.Element;
	viewBox?: string;
	onClick?: () => void;
}

let id = 0;

export const Icon = React.memo((props: IconProps) => {
    if (!props.svgChildren && !props.path) {
        return null;
    }

    id++;

    const style: React.CSSProperties = {};
    const extractWidthSize = () => {
        if (props.svgStyle && props.svgStyle.width) {
            return props.svgStyle.width;
        }

        if (props.size) {
            return (typeof props.size === 'string' ? props.size : `${props.size}rem`);
        }
    };
    style.width = extractWidthSize();
    style.height = (props.svgStyle && props.svgStyle.height) || style.width;

    const pathStyle: React.CSSProperties = {};
    const transform = [];

    if (props.horizontal) {
        transform.push('scaleX(-1)');
    }

    if (props.vertical) {
        transform.push('scaleY(-1)');
    }

    if (props.rotate !== 0) {
        transform.push(`rotate(${props.rotate}deg)`);
    }

    pathStyle.fill = props.color || '';

    const pathElement = <path d={props.path} style={pathStyle} />;

    const transformElement = pathElement;

    if (transform.length) {
        style.transform = transform.join(' ');
        style.transformOrigin = 'center';
    }

    let spinElement = transformElement;
    const spinSec = props.spin === true || typeof props.spin !== 'number' ? 2 : props.spin;
    let inverse = props.horizontal || props.vertical;
    if (spinSec < 0) {
        inverse = !inverse;
    }

    if (props.spin) {
        spinElement = (
            <g
                style={{
                    animation: `spin${inverse ? '-inverse' : ''} linear ${Math.abs(spinSec)}s infinite`,
                    transformOrigin: 'center'
                }}
            >
                {transformElement}
                {!(props.horizontal || props.vertical || props.rotate !== 0) && (
                    <rect width='24' height='24' fill='transparent' />
                )}
            </g>
        );
    }

    let ariaLabelledby;
    const labelledById = `icon_labelledby_${id}`;
    const describedById = `icon_describedby_${id}`;

    let role: string;
    if (props.title) {
        ariaLabelledby = props.description ? `${labelledById} ${describedById}` : labelledById;
    } else {
        role = 'presentation';
        if (props.description) {
            throw new Error('title attribute required when description is set');
        }
    }

    const handleOnClick = () => {
        props.onClick();
    };

    const renderSvgChildren = (): JSX.Element => {
        return (
            <>
                {props.title && <title id={labelledById}>{props.title}</title>}
                {props.description && <desc id={labelledById}>{props.description}</desc>}
                {props.spin &&
					(inverse ? (
					    <style>{'@keyframes spin-inverse { to { transform: rotate(-360deg) } }'}</style>
					) : (
					    <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
					))}
                {props.svgChildren ? props.svgChildren : spinElement}
            </>
        );
    };

    const svgProps = {
        className: props.svgClassName,
        viewBox: props.viewBox || '0 0 24 24',
        style: { ...props.style, ...props.svgStyle, ...style },
        role,
        'aria-labelledby': ariaLabelledby
    };

    return (
        <i
            onClick={props.onClick ? handleOnClick : null}
            style={props.style}
            title={props.title}
            className={jClass(
                props.className,
                styles.icon,
                typeof props.size === 'string' && styles[props.size],
                props.floated ? (props.floated === 'left' ? styles.floatedLeft : styles.floatedRight) : undefined
            )}>
            <svg {...svgProps}>
                {renderSvgChildren()}
            </svg>
        </i>
    );
});

Icon.displayName = 'Icon';
