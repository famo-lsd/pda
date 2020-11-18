import React, { useEffect, useState } from 'react';
import { convertNumeralToJS, setDecimalDelimiter } from '../../utils/number';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

export enum InputType {
    Text = 1,
    Number = 2,
    Checkbox = 3,
    Radio = 4,
    Select = 100
}

export interface InputConfig {
    ref?: any;
    label: string;
    type: InputType,
    className: string;
    name: string;
    value: any;
    autoFocus?: boolean;
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
        { type, className, name, value, autoFocus, isDisabled, analyze, noData, wrongFormat, invalidValue, invalidMessage, set, children } = props,
        [localState, setLocalState] = useState({ noData: false, wrongFormat: false, invalidValue: false });

    function keyDown(event) {
        if (type === InputType.Number) {
            setDecimalDelimiter(event, ref);
        }
    }

    useEffect(() => {
        if (analyze) {
            let localValue = value;

            set(x => { return { ...x, noData: false, wrongFormat: false, invalidValue: false }; });

            if (!localValue) {
                set(x => { return { ...x, noData: true, wrongFormat: false, invalidValue: false }; });
            }
            else if (type === InputType.Number && localValue) {
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
            {(type === InputType.Text || type === InputType.Number) &&
                <React.Fragment>
                    <input ref={ref} type='text' className={className + (localState.noData ? ' famo-input-error' : (localState.wrongFormat || localState.invalidValue ? ' famo-input-warning' : ''))} name={name} value={value} autoFocus={autoFocus} disabled={isDisabled} onKeyDown={keyDown} onChange={event => set(x => { return { ...x, value: ref.current.value }; })} />
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
            {type === InputType.Checkbox &&
                <label>
                    <input ref={ref} type='checkbox' className={className} name={name} checked={value} disabled={isDisabled} onChange={event => set(x => { return { ...x, value: event.target.checked }; })} />
                    <span className='famo-checkbox'></span>
                </label>
            }
            {type === InputType.Select &&
                <select ref={ref} className={className + (localState.noData ? ' famo-input-error' : '')} name={name} value={value} disabled={isDisabled} onChange={event => set(x => { return { ...x, value: ref.current.value }; })}>
                    {children}
                </select>
            }
        </React.Fragment>);
});

export class InputTools {
    public static analyze(inputs: Array<InputConfig>, setInputs: Array<any>) {
        inputs.forEach((x, i) => {
            if ((x.type === InputType.Text || x.type === InputType.Number || x.type === InputType.Select) && !x.isDisabled) {
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

    public static popUpAlerts(inputs: Array<InputConfig>, t: TFunction) {
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
                setInputs[i](x => { return { ...x, value: '', noData: false, wrongFormat: false, invalidValue: false, analyze: false, localAnalyze: false }; });
            }
        });
    }
}

export class InputAlert {
    public static invalidValue(inputs: Array<string>, t: TFunction) {
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

    public static noData(t: TFunction) {
        alert(t('key_197'));
    }

    public static wrongFormat(inputs: Array<string>, t: TFunction) {
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

export default Input;