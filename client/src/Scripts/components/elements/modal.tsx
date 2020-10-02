import Input, { InputConfig, InputTools } from './input';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';

export enum ModalContentType {
    inventoryProduct = 1,
    palletBox = 2
}

function Modal(props: any) {
    const { contentType, visible, setVisible, confirm, t } = props,
        [visibility, setVisibility] = useState(visible),
        [productCode, setProductCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_87'),
            className: 'famo-input famo-text-10',
            name: 'productCode',
            value: '',
            isNumber: false,
            isDisabled: false,
            analyze: false,
            localAnalyze: false,
            noData: false
        }),
        [palletBoxCode, setPalletBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true,
            isNumber: false,
            isDisabled: false,
            analyze: false,
            localAnalyze: false,
            noData: false
        }),
        contentForm: Array<InputConfig> = (() => {
            switch (contentType as ModalContentType) {
                case ModalContentType.inventoryProduct:
                    return [productCode];
                case ModalContentType.palletBox:
                    return [palletBoxCode];
            }
        })(),
        setContentForm: Array<any> = (() => {
            switch (contentType as ModalContentType) {
                case ModalContentType.inventoryProduct:
                    return [setProductCode];
                case ModalContentType.palletBox:
                    return [setPalletBoxCode];
            }
        })();

    function submitForm() {
        switch (contentType as ModalContentType) {
            case ModalContentType.inventoryProduct:
            case ModalContentType.palletBox:
                InputTools.analyze(contentForm, setContentForm);
                break;
        }
    }

    // #region Events
    function handleSubmit(event) {
        event.preventDefault();
        submitForm();
    }

    function handleCloseModal(event) {
        event.stopPropagation();
        setVisible(false);
    }
    // #endregion

    useEffect(() => {
        if (visibility) {
            switch (contentType as ModalContentType) {
                case ModalContentType.palletBox:
                    const input = contentForm[0];

                    if (input.autoFocus) {
                        input.ref.current.focus();
                    }
                    break;
            }
        }
    }, [visibility]);

    useEffect(() => {
        setVisibility(visible);

        if (!visible) {
            InputTools.resetValues(contentForm, setContentForm);
        }
    }, [visible]);

    useEffect(() => {
        if (InputTools.areAnalyzed(contentForm)) {
            if (InputTools.areValid(contentForm)) {
                switch (contentType as ModalContentType) {
                    case ModalContentType.inventoryProduct:
                    case ModalContentType.palletBox:
                        confirm(contentForm[0].value);
                        break;
                }

                switch (contentType as ModalContentType) {
                    case ModalContentType.inventoryProduct:
                        setVisible(false);
                        break;
                    case ModalContentType.palletBox:
                        const input = contentForm[0];

                        InputTools.resetValues(contentForm, setContentForm);
                        if (input.autoFocus) {
                            input.ref.current.focus();
                        }

                        break;
                }
            }

            InputTools.resetValidations(contentForm, setContentForm);
        }
    }, contentForm);

    return (
        <section className={'w3-modal famo-modal ' + (visibility ? 'w3-show' : '')} onClick={event => setVisible(false)}>
            <div className='w3-modal-content famo-modal-content' onClick={event => event.stopPropagation()}>
                {(() => {
                    switch (contentType as ModalContentType) {
                        case ModalContentType.inventoryProduct:
                        case ModalContentType.palletBox:
                            return (
                                <section className='famo-wrapper'>
                                    <div className='famo-content'>
                                        <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={handleSubmit}>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-input-label'>
                                                    <span className='famo-text-11'>{contentForm[0].label}</span>
                                                </div>
                                                <div className='famo-cell'>
                                                    <Input {...contentForm[0]} set={setContentForm[0]} />
                                                </div>
                                            </div>
                                            <input type='submit' className='hide' value='' />
                                        </form>
                                        <div className='famo-grid famo-buttons'>
                                            <div className='famo-row'>
                                                <div className='famo-cell text-right'>
                                                    <button type='button' className='famo-button famo-confirm-button' onClick={event => submitForm()}>
                                                        <span className='famo-text-12'>{t('key_701')}</span>
                                                    </button>
                                                    <button type="button" className="famo-button famo-cancel-button" onClick={event => setVisible(false)}>
                                                        <span className="famo-text-12">{t('key_484')}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                    }
                })()}
            </div>
            <div className='famo-buttons'>
                <button type='button' className='famo-button famo-icon-button' title={t('key_200')} onClick={handleCloseModal}>
                    <span className='fas fa-times'></span>
                </button>
            </div>
        </section>
    );
}

export default withTranslation()(Modal);