import React, { useEffect, useState } from 'react';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Redirect, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { withTranslation } from 'react-i18next';

function Home(props: any) {
    const { t } = props,
        [redirect, setRedirection] = useState<any>({
            inventory: false,
            pallet: false
        }),
        buttons: Array<any> = [{ label: t('key_806'), key: 'inventory', image: 'btn-inventario.png' }, { label: t('key_826'), key: 'pallet', image: 'btn-palete.png' }];

    useEffect(() => {
        SessionStorage.clear();
    }, []);

    if (redirect.inventory) {
        return <Redirect push to='/Inventory' />;
    }
    else if (redirect.pallet) {
        return <Redirect push to='/Pallet' />;
    }
    else {
        return (
            <div className='container'>
                <div className='row' style={{ justifyContent: "center" }}>
                    {buttons.map((x, i) => {
                        return (
                            <div key={i} className='col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2'>
                                <section className='famo-wrapper' onClick={event => setRedirection(prevState => { return { ...prevState, [x.key]: true }; })}>
                                    <div className='famo-content'>
                                        <div className='famo-grid famo-sidebar-main-item'>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-sidebar-item-label text-center'>
                                                    <span className='famo-text-19' title={x.label}>{x.label}</span>
                                                </div>
                                            </div>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-sidebar-item-img text-center'>
                                                    <img src={NODE_SERVER + '/Images/' + x.image} alt={x.label} />
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

export default withRouter(withTranslation()(Home));