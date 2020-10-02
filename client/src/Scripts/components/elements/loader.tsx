import React from 'react';

export function AppLoader(props: any) {
    const { hide } = props;

    return (
        <div className={'pda-app-loader ' + (hide ? 'hide' : '')}>
            <div className="famo-loader"></div>
        </div>
    );
}

export function ContentLoader(props: any) {
    const { hide } = props;

    return (
        <div className={'famo-loader-wrapper ' + (hide ? 'hide' : '')}>
            <div className='famo-loader'></div>
        </div>
    );
}