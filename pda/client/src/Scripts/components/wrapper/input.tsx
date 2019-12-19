import React, { useEffect, useState } from 'react';
import { convertNumeralToJS, setDecimalDelimiter } from '../../utils/numeral';
import { useTranslation } from 'react-i18next';

export interface InputConfig {
    isNumber: boolean;
    className: string;
    name: string;
    label: string;
    value: string;
    invalidMessage: string;
    noData: boolean;
    wrongFormat: boolean;
    invalidValue: boolean;
    validate: boolean;
    validateForm: boolean;
}

function Input(props: any) {
    const { t } = useTranslation(),
        { isNumber, className, name, value, invalidMessage, noData, wrongFormat, invalidValue, validate, set } = props,
        [localState, setLocalState] = useState({ noData: false, wrongFormat: false, invalidValue: false }),
        ref: React.RefObject<any> = React.createRef();

    // #region Events
    function handleKeyDown(event) {
        if (isNumber) {
            setDecimalDelimiter(event, ref);
        }
    }
    // #endregion

    useEffect(() => {
        if (validate) {
            let valueLt = value;

            set(prevState => { return { ...prevState, noData: false, wrongFormat: false, invalidValue: false } });

            if (!valueLt) {
                set(prevState => { return { ...prevState, noData: true, wrongFormat: false, invalidValue: false } });
            }
            else if (valueLt && isNumber) {
                valueLt = convertNumeralToJS(valueLt);

                if (isNaN(valueLt)) {
                    set(prevState => { return { ...prevState, noData: false, wrongFormat: true, invalidValue: false } });
                }
                else if (parseFloat(valueLt) <= 0) {
                    set(prevState => { return { ...prevState, noData: false, wrongFormat: false, invalidValue: true } });
                }
            }

            set(prevState => { return { ...prevState, validateForm: true } });
        }
    }, [validate]);

    useEffect(() => {
        setLocalState({ noData: noData, wrongFormat: wrongFormat, invalidValue: invalidValue });
    }, [noData, wrongFormat, invalidValue])

    return (
        <React.Fragment>
            <input type='text' className={className + (localState.noData ? ' famo-input-error' : (localState.wrongFormat || localState.invalidValue ? ' famo-input-warning' : ''))} name={name} value={value} ref={ref} onKeyDown={handleKeyDown} onChange={event => set(prevState => { return { ...prevState, value: ref.current.value } })} />
            <div className={'famo-input-message' + (localState.wrongFormat ? '' : ' hide')}>
                <span className='famo-text-15'>O campo tem um formato inválido.</span>
            </div>
            <div className={'famo-input-message' + (localState.invalidValue ? '' : ' hide')}>
                <span className='famo-text-15'>{invalidMessage}</span>
            </div>
        </React.Fragment>);
}

export function getValue(value: string, isNumber: boolean) {
    return !isNumber ? value : parseFloat(convertNumeralToJS(value));
}

// #region Alert
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
// #endregion Alert

export default Input;