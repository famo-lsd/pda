import React, { useEffect, useState } from 'react';
import Input, { InputConfig, InputTools } from './input';
import { withTranslation } from 'react-i18next';

export enum ModalContentType {
    inventoryProduct = 1,
    cargoMap = 2
}

function Modal(props: any) {
    const { contentType, visible, setVisible, confirm, t } = props,
        [visibility, setVisibility] = useState(visible),
        [productCode, setProductCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: false,
            isNumber: false,
            label: t('key_87'),
            name: 'productCode',
            value: '',
            noData: false,
            analyze: false,
            analyzeForm: false
        }),
        [cargoMapCode, setCargoMapCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: false,
            isNumber: false,
            label: 'Mapa de carga',
            name: 'cargoMapCode',
            value: '',
            noData: false,
            analyze: false,
            analyzeForm: false
        }),
        contentForm: Array<InputConfig> = (() => {
            switch (contentType as ModalContentType) {
                case ModalContentType.inventoryProduct:
                    return [productCode];
                case ModalContentType.cargoMap:
                    return [cargoMapCode];
            }
        })(),
        setContentForm: Array<any> = (() => {
            switch (contentType as ModalContentType) {
                case ModalContentType.inventoryProduct:
                    return [setProductCode];
                case ModalContentType.cargoMap:
                    return [setCargoMapCode];
            }
        })();

    function submitForm() {
        switch (contentType as ModalContentType) {
            case ModalContentType.inventoryProduct:
            case ModalContentType.cargoMap:
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
        setVisibility(visible);

        if (!visible) {
            InputTools.resetValues(contentForm, setContentForm);
        }
    }, [visible]);

    useEffect(() => {
        if (InputTools.areAllAnalyzed(contentForm)) {
            if (InputTools.areAllValid(contentForm)) {
                switch (contentType as ModalContentType) {
                    case ModalContentType.inventoryProduct:
                    case ModalContentType.cargoMap:
                        confirm(contentForm[0].value);
                        setVisible(false);
                        break;
                }
            }

            InputTools.resetValidations(contentForm, setContentForm);
        }
    }, contentForm)

    return (
        <section className={'w3-modal famo-modal' + (visibility ? ' w3-show' : '')} onClick={event => setVisible(false)}>
            <div className='w3-modal-content famo-modal-content' onClick={event => event.stopPropagation()}>
                {(() => {
                    switch (contentType as ModalContentType) {
                        case ModalContentType.inventoryProduct:
                        case ModalContentType.cargoMap:
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