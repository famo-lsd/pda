import React, { useState } from 'react';

function Title(props) {
    const { text } = props,
        [collapse, setCollapse] = useState(false);

    function collapseContent(event) {
        setCollapse(!collapse);
    }

    return (
        <div className={'famo-title ' + (collapse ? 'collapsed' : '')}>
            <span className='famo-text-13' onClick={collapseContent}>{text}</span>
        </div>
    );
}

export default Title;