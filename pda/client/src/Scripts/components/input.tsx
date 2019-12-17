import React from 'react';
import { setDecimalDelimiter } from '../utils/numeral';

export function InputText(props: any) {
    const { t, isNumber, className, name, value, setInput, state, message } = props,
        ref: React.RefObject<any> = React.createRef();

    // #region Events
    function handleKeyDown(event) {
        if (isNumber) {
            setDecimalDelimiter(event, ref, setInput);
        }
    }
    // #endregion

    return (
        <React.Fragment>
            <input type='text' className={className + (state.noData ? ' famo-input-error' : (state.wrongFormat || state.invalidValue ? ' famo-input-warning' : ''))} name={name} value={value} ref={ref} onKeyDown={handleKeyDown} onChange={(event) => setInput(ref.current.value)} />
            <div className={'famo-input-message' + (state.invalidValue ? '' : ' hide')}>
                <span className='famo-text-15'>{message}</span>
            </div>
        </React.Fragment>);
}

export function invalidValuesAlert(inputs: Array<string>, t: Function) {
    let message = t('key_192');

    for (let i = 0, len = inputs.length; i < len; i++) {
        message += inputs[i];

        if (i < len - 2) {
            message += ', ';
        }
        else if (i === len - 2) {
            message += ' ' + t('key_573') + ' ';
        }
    }

    alert(message);
}

export function noDataAlert(t: Function) {
    alert(t('key_197'));
}

export function wrongFormatAlert(inputs: Array<string>, t: Function) {
    let message = t('key_191');

    for (let i = 0, len = inputs.length; i < len; i++) {
        message += inputs[i];

        if (i < len - 2) {
            message += ', ';
        }
        else if (i === len - 2) {
            message += ' ' + t('key_573') + ' ';
        }
    }

    alert(message);
}