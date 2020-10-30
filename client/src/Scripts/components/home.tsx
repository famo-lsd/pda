import React, { useEffect, useState } from 'react';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Redirect, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';

function Home(props: any) {
    const { t } = useTranslation(),
        [, globalActions] = useGlobal(),
        [redirect, setRedirection] = useState<any>({
            inventory: false,
            pallet: false,
            expedition: false
        }),
        buttons: Array<any> = [
            { label: t('key_877'), key: 'expedition', image: 'btn-expedicao.png' },
            { label: t('key_826'), key: 'pallet', image: 'btn-palete.png' },
            { label: t('key_806'), key: 'inventory', image: 'btn-inventario.png' }
        ];

    useEffect(() => {
        SessionStorage.clear();
    }, []);

    if (redirect.expedition) {
        return <Redirect push to='/Expedition' />;
    }
    else if (redirect.pallet) {
        return <Redirect push to='/Pallet' />;
    }
    else if (redirect.inventory) {
        return <Redirect push to='/Inventory' />;
    }
    else {
        return (
            <div className='container'>
                <div className='row' style={{ justifyContent: "center" }}>
                    {buttons.map((x, i) => {
                        return (
                            <div key={i} className='col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2'>
                                <section className='famo-wrapper' onClick={event => setRedirection(y => { return { ...y, [x.key]: true } })}>
                                    <div className='famo-content'>
                                        <div className='famo-grid famo-menu-item'>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-menu-item-label text-center'>
                                                    <span className='famo-text-19' title={x.label}>{x.label}</span>
                                                </div>
                                            </div>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-menu-item-img text-center'>
                                                    <img src={NODE_SERVER + 'Images/' + x.image} alt={x.label} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default withRouter(Home);