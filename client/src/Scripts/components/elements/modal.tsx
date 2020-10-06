import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Modal = React.forwardRef((props: any) => {
    const { visible, setVisible, children } = props,
        { t } = useTranslation(),
        [visibility, setVisibility] = useState(visible);

    function close(event) {
        event.stopPropagation();
        setVisible(false);
    }

    useEffect(() => {
        setVisibility(visible);
    }, [visible]);

    return (
        <section className={'w3-modal famo-modal ' + (visibility ? 'w3-show' : '')} onClick={event => setVisible(false)}>
            <div className='w3-modal-content famo-modal-content' onClick={event => event.stopPropagation()}>
                {children}
            </div>
            <div className='famo-buttons'>
                <button type='button' className='famo-button famo-icon-button' title={t('key_200')} onClick={event => close(event)}>
                    <span className='fas fa-times'></span>
                </button>
            </div>
        </section>
    );
});

export default Modal;