import React, { useEffect, useState } from 'react';
import { convertNumeralToJS, setDecimalDelimiter } from '../../utils/numeral';
import { useTranslation } from 'react-i18next';

export interface InputConfig {
    ref?: any;
    label: string;
    className: string;
    name: string;
    value: string;
    valueSubmitted?: string;
    autoFocus?: boolean;
    isNumber: boolean;
    isDisabled: boolean;
    analyze?: boolean;
    localAnalyze?: boolean;
    noData?: boolean;
    wrongFormat?: boolean;
    invalidValue?: boolean;
    invalidMessage?: string;
}

const Input = React.forwardRef((props: any, ref: any) => {
    const { t } = useTranslation(),
        { className, isDisabled, isNumber, name, value, autoFocus, noData, wrongFormat, invalidValue, invalidMessage, analyze, set, children } = props,
        [localState, setLocalState] = useState({ noData: false, wrongFormat: false, invalidValue: false }),
        hasChildren = React.Children.count(children) > 0;

    // #region Events
    function handleKeyDown(event) {
        if (isNumber) {
            setDecimalDelimiter(event, ref);
        }
    }
    // #endregion

    useEffect(() => {
        if (!isDisabled && analyze) {
            let localValue = value;

            set(x => { return { ...x, noData: false, wrongFormat: false, invalidValue: false }; });

            if (!localValue) {
                set(x => { return { ...x, noData: true, wrongFormat: false, invalidValue: false }; });
            }
            else if (isNumber && localValue) {
                localValue = convertNumeralToJS(localValue);

                if (isNaN(localValue)) {
                    set(x => { return { ...x, noData: false, wrongFormat: true, invalidValue: false }; });
                }
                else if (parseFloat(localValue) <= 0) {
                    set(x => { return { ...x, noData: false, wrongFormat: false, invalidValue: true }; });
                }
            }

            set(x => { return { ...x, localAnalyze: true }; });
        }
    }, [analyze]);

    useEffect(() => {
        setLocalState({ noData: noData, wrongFormat: wrongFormat, invalidValue: invalidValue });
    }, [noData, wrongFormat, invalidValue]);


    return (
        <React.Fragment>
            {!hasChildren ? <input type='text' className={className + (localState.noData ? ' famo-input-error' : (localState.wrongFormat || localState.invalidValue ? ' famo-input-warning' : ''))} name={name} value={value} ref={ref} autoFocus={autoFocus} disabled={isDisabled} onKeyDown={handleKeyDown} onChange={event => set(x => { return { ...x, value: ref.current.value }; })} /> : (
                <select className={className + (localState.noData ? ' famo-input-error' : '')} name={name} ref={ref} disabled={isDisabled} onChange={event => set(x => { return { ...x, value: ref.current.value }; })}>
                    {children}
                </select>
            )}
            {!hasChildren &&
                <React.Fragment>
                    {!isDisabled &&
                        <div className={'famo-input-message ' + (localState.wrongFormat ? '' : 'hide')}>
                            <span className='famo-text-15'>{t('key_808')}</span>
                        </div>
                    }
                    {(invalidMessage && !isDisabled) &&
                        <div className={'famo-input-message ' + (localState.invalidValue ? '' : 'hide')}>
                            <span className='famo-text-15'>{invalidMessage}</span>
                        </div>
                    }
                </React.Fragment>
            }
        </React.Fragment>);
});

// #region Tools
export class InputTools {
    public static analyze(inputs: Array<InputConfig>, setInputs: Array<any>) {
        inputs.forEach((x, i) => {
            if (!x.isDisabled) {
                setInputs[i](x => { return { ...x, analyze: true } });
            }
        });
    }

    public static areAnalyzed(inputs: Array<InputConfig>): boolean {
        return !inputs.filter(x => { return !x.isDisabled; }).some(x => { return !x.localAnalyze; });
    }

    public static areValid(inputs: Array<InputConfig>): boolean {
        return !inputs.filter(x => { return !x.isDisabled; }).some(x => { return x.noData || x.wrongFormat || x.invalidValue });
    }

    public static getValue(input: InputConfig) {
        return !input.isNumber ? input.value : parseFloat(convertNumeralToJS(input.value));
    }

    public static popUpAlerts(inputs: Array<InputConfig>, t: Function) {
        if (inputs.some(x => { return x.noData; })) {
            InputAlert.noData(t);
        }

        if (inputs.some(x => { return x.wrongFormat; })) {
            InputAlert.wrongFormat(inputs.filter(x => { return x.wrongFormat; }).map(x => { return x.label; }), t);
        }

        if (inputs.some(x => { return x.invalidValue; })) {
            InputAlert.invalidValue(inputs.filter(x => { return x.invalidValue; }).map(x => { return x.label; }), t);
        }
    }

    public static resetValidations(inputs: Array<InputConfig>, setInputs: Array<any>) {
        inputs.forEach((x, i) => {
            if (!x.isDisabled) {
                setInputs[i](x => { return { ...x, analyze: false, localAnalyze: false }; });
            }
        });
    }

    public static resetValues(inputs: Array<InputConfig>, setInputs: Array<any>) {
        inputs.forEach((x, i) => {
            if (!x.isDisabled) {
                setInputs[i](x => { return { ...x, value: '', noData: false, wrongFormat: false, invalidValue: false, analyze: false, selfAnalyze: false }; });
            }
        });
    }
}
// #endregion

// #region Alert
export class InputAlert {
    public static invalidValue(inputs: Array<string>, t: Function) {
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

    public static noData(t: Function) {
        alert(t('key_197'));
    }

    public static wrongFormat(inputs: Array<string>, t: Function) {
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