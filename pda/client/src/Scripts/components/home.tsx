import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useGlobal } from '../utils/globalHooks';
import { withTranslation } from 'react-i18next';

function Home(props: any) {
    const { t } = props,
        [redirect, setRedirection] = useState<any>({
            inventory: false,
            pallet: false
        });

    if (redirect.inventory) {
        return <Redirect push to='/Inventory' />;
    }
    else if (redirect.pallet) {
        return <Redirect push to='/Pallet' />;
    }
    else {
        return (
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <div className='famo-grid famo-content-grid'>
                        <div className='famo-row'>
                            <div className='famo-cell text-center'>
                                <button type='button' className='famo-button famo-normal-button' onClick={event => { setRedirection(prevState => { return { ...prevState, inventory: true } }) }}>
                                    <span className='famo-text-5'>{t('key_806')}</span>
                                </button>
                            </div>
                        </div>
                        <div className='famo-row'>
                            <div className='famo-cell text-center'>
                                <button type='button' className='famo-button famo-normal-button' onClick={event => { setRedirection(prevState => { return { ...prevState, pallet: true } }) }}>
                                    <span className='famo-text-5'>Paletes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(withTranslation()(Home));