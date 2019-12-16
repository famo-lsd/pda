import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';

export enum ModalContentType {
    productInput = 1
}

function Modal(props) {
    const { contentType, visible, setVisible, confirm, t } = props,
        [visibility, setVisibility] = useState(visible),
        [input, setInput] = useState(''),
        setInputs: Array<any> = [setInput];

    function result() {
        switch (contentType as ModalContentType) {
            case ModalContentType.productInput:
                confirm(input);
                break;
        }

        setVisible(false);
    }

    // #region Events
    function handleSubmit(event) {
        event.preventDefault();
        result();
    }

    function handleCloseModal(event) {
        event.stopPropagation();
        setVisible(false);
    }
    // #endregion

    useEffect(() => {
        setVisibility(visible);

        if (!visible) {
            setInputs.forEach((x) => {
                x('');
            });
        }
    }, [visible]);

    return (
        <section className={'w3-modal famo-modal' + (visibility ? ' w3-show' : '')} onClick={(event) => setVisible(false)}>
            <div className='w3-modal-content famo-modal-content' onClick={(event) => event.stopPropagation()}>
                {(function () {
                    switch (contentType as ModalContentType) {
                        case ModalContentType.productInput:
                            return (
                                <section className='famo-wrapper'>
                                    <div className='famo-content'>
                                        <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={handleSubmit}>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-input-label'>
                                                    <span className='famo-text-11'>{t('key_87')}</span>
                                                </div>
                                                <div className='famo-cell'>
                                                    <input type='text' className='famo-input famo-text-10' name='productCode' value={input} onInput={(event) => setInput((event.target as HTMLInputElement).value)} />
                                                </div>
                                            </div>
                                            <input type='submit' className='hide' value='' />
                                        </form>
                                        <div className='famo-grid famo-buttons'>
                                            <div className='famo-row'>
                                                <div className='famo-cell text-right'>
                                                    <button type='button' className='famo-button famo-confirm-button' onClick={(event) => result()}>
                                                        <span className='famo-text-12'>{t('key_701')}</span>
                                                    </button>
                                                    <button type="button" className="famo-button famo-cancel-button" onClick={(event) => setVisible(false)}>
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