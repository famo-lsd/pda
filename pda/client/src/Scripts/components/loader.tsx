import React from 'react';

export function ContentLoader(props) {
    const { hide } = props;

    return (
        <div className={'famo-loader-wrapper' + (hide ? ' hide' : '')}>
            <div className='famo-loader'></div>
        </div>
    );
}