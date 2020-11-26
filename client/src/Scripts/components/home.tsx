import React, { useEffect } from 'react';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Link, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { useTranslation } from 'react-i18next';

function Home(props: any) {
    const { t } = useTranslation(),
        buttons: Array<any> = [
            { label: t('key_894'), image: 'btn-armazem.png', url: '/Warehouse' },
            { label: t('key_877'), image: 'btn-expedicao.png', url: '/Expedition' },
            { label: t('key_826'), image: 'btn-palete.png', url: '/Pallets' },
            { label: t('key_806'), image: 'btn-inventario.png', url: '/Inventory' }
        ];

    useEffect(() => {
        SessionStorage.clear();
    }, []);

    return (
        <div className='container'>
            <div className='row' style={{ justifyContent: "center" }}>
                {buttons.map((x, i) => {
                    return (
                        <div key={i} className='col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2'>
                            <Link to={x.url}>
                                <section className='famo-wrapper'>
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
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default withRouter(Home);