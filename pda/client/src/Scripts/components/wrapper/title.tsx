import React, { useState } from 'react';

function Title(props) {
    const { text } = props,
        [collapse, setCollapse] = useState(false);

    // #region Events
    function handleClick(event) {
        setCollapse(!collapse);
    }
    // #endregion

    return (
        <div className={'famo-title' + (collapse ? ' collapsed' : '')}>
            <span className='famo-text-13' onClick={handleClick}>{text}</span>
        </div>
    );
}

export default Title;