import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';

export enum ModalContentType {
    productInput = 1
}

function Modal(props) {
    const { contentType, visible, setVisible, t } = props,
        [visibility, setVisibility] = useState(visible);

    function handleCloseModal(event) {
        setVisible(false);
        setVisibility(false);
    }

    useEffect(() => {
        setVisibility(visible);
    }, [visible]);

    return (
        <section className={'w3-modal famo-modal' + (visibility ? ' w3-show' : '')}>
            <div className='w3-modal-content famo-modal-content'>
                {(function () {
                    switch (contentType as ModalContentType) {
                        case ModalContentType.productInput:
                            return (
                                <section className='famo-wrapper'>
                                    <div className='famo-content'>
                                        <form className='famo-grid famo-form-grid famo-submit-form' noValidate>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-input-label'>
                                                    <span className='famo-text-11'>{t('key_87')}</span>
                                                </div>
                                                <div className='famo-cell'>
                                                    <input type='text' className='famo-input famo-text-10' name='productCode' />
                                                </div>
                                            </div>
                                            <input type='submit' className='hide' value='' />
                                        </form>
                                        <div className='famo-grid famo-buttons'>
                                            <div className='famo-row'>
                                                <div className='famo-cell text-right'>
                                                    <button type='button' className='famo-button famo-confirm-button'>
                                                        <span className='famo-text-12'>{t('key_701')}</span>
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