import React, { useEffect, useState } from 'react';
import { convertNumeralToJS, setDecimalDelimiter } from '../../utils/numeral';
import { useTranslation } from 'react-i18next';

export interface InputConfig {
    className: string;
    isDisabled: boolean;
    isNumber: boolean;
    label: string;
    name: string;
    value: string;
    noData?: boolean;
    wrongFormat?: boolean;
    invalidValue?: boolean;
    invalidMessage?: string;
    analyze?: boolean;
    analyzeForm?: boolean;
}

function Input(props: any) {
    const { t } = useTranslation(),
        { className, isDisabled, isNumber, name, value, noData, wrongFormat, invalidValue, invalidMessage, analyze, set, children } = props,
        [localState, setLocalState] = useState({ noData: false, wrongFormat: false, invalidValue: false }),
        hasChildren = React.Children.count(children) > 0,
        ref: React.RefObject<any> = React.createRef();

    // #region Events
    function handleKeyDown(event) {
        if (isNumber) {
            setDecimalDelimiter(event, ref);
        }
    }
    // #endregion

    useEffect(() => {
        if (!isDisabled && analyze) {
            let valueLt = value;

            set(prevState => { return { ...prevState, noData: false, wrongFormat: false, invalidValue: false } });

            if (!valueLt) {
                set(prevState => { return { ...prevState, noData: true, wrongFormat: false, invalidValue: false } });
            }
            else if (isNumber && valueLt) {
                valueLt = convertNumeralToJS(valueLt);

                if (isNaN(valueLt)) {
                    set(prevState => { return { ...prevState, noData: false, wrongFormat: true, invalidValue: false } });
                }
                else if (parseFloat(valueLt) <= 0) {
                    set(prevState => { return { ...prevState, noData: false, wrongFormat: false, invalidValue: true } });
                }
            }

            set(prevState => { return { ...prevState, analyzeForm: true } });
        }
    }, [analyze]);

    useEffect(() => {
        setLocalState({ noData: noData, wrongFormat: wrongFormat, invalidValue: invalidValue });
    }, [noData, wrongFormat, invalidValue])

    return (
        <React.Fragment>
            {!hasChildren ? <input type='text' className={className + (localState.noData ? ' famo-input-error' : (localState.wrongFormat || localState.invalidValue ? ' famo-input-warning' : ''))} name={name} value={value} ref={ref} disabled={isDisabled} onKeyDown={handleKeyDown} onChange={event => set(prevState => { return { ...prevState, value: ref.current.value } })} /> : (
                <select className={className + (localState.noData ? ' famo-input-error' : '')} name={name} ref={ref} disabled={isDisabled} onChange={event => set(prevState => { return { ...prevState, value: ref.current.value } })}>
                    {children}
                </select>
            )}
            {!hasChildren &&
                <React.Fragment>
                    {!isDisabled &&
                        <div className={'famo-input-message' + (localState.wrongFormat ? '' : ' hide')}>
                            <span className='famo-text-15'>{t('key_808')}</span>
                        </div>
                    }
                    {(invalidMessage && !isDisabled) &&
                        <div className={'famo-input-message' + (localState.invalidValue ? '' : ' hide')}>
                            <span className='famo-text-15'>{invalidMessage}</span>
                        </div>
                    }
                </React.Fragment>
            }
        </React.Fragment>);
}

// #region Tools
export class InputTools {
    public static analyze(inputs: Array<InputConfig>, setInputs: Array<any>) {
        inputs.forEach((x, i) => {
            if (!x.isDisabled) {
                setInputs[i](prevState => { return { ...prevState, analyze: true } });
            }
        });
    }

    public static areAllAnalyzed(inputs: Array<InputConfig>): boolean {
        return !inputs.filter(x => { return !x.isDisabled; }).some(x => { return !x.analyzeForm; });
    }

    public static areAllValid(inputs: Array<InputConfig>): boolean {
        return !inputs.filter(x => { return !x.isDisabled; }).some(x => { return x.noData || x.wrongFormat || x.invalidValue });
    }

    public static getValue(input: InputConfig) {
        return !input.isNumber ? input.value : parseFloat(convertNumeralToJS(input.value));
    }

    public static popUpAlerts(inputs: Array<InputConfig>, t: Function) {
        if (inputs.some(x => { return x.noData; })) {
            InputAlert.noDataAlert(t);
        }

        if (inputs.some(x => { return x.wrongFormat; })) {
            InputAlert.wrongFormatAlert(inputs.filter(x => { return x.wrongFormat; }).map(x => { return x.label; }), t);
        }

        if (inputs.some(x => { return x.invalidValue; })) {
            InputAlert.invalidValuesAlert(inputs.filter(x => { return x.invalidValue; }).map(x => { return x.label; }), t);
        }
    }

    public static resetValues(inputs: Array<InputConfig>, setInputs: Array<any>) {
        inputs.forEach((x, i) => {
            if (!x.isDisabled) {
                setInputs[i](prevState => { return { ...prevState, value: '', noData: false, wrongFormat: false, invalidValue: false, analyze: false, analyzeForm: false } });
            }
        });
    }

    public static resetValidations(inputs: Array<InputConfig>, setInputs: Array<any>) {
        inputs.forEach((x, i) => {
            if (!x.isDisabled) {
                setInputs[i](prevState => { return { ...prevState, analyze: false, analyzeForm: false } });
            }
        });
    }
}
// #endregion

// #region Alert
export class InputAlert {
    public static invalidValuesAlert(inputs: Array<string>, t: Function) {
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

    public static noDataAlert(t: Function) {
        alert(t('key_197'));
    }

    public static wrongFormatAlert(inputs: Array<string>, t: Function) {
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
}
// #endregion Alert

export default Input;