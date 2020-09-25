import httpStatus from 'http-status';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { createQueryString } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation, withTranslation } from 'react-i18next';

interface Shipment {
    Code: string;
    Description: string;
    PickedBoxes: number;
    TotalBoxes: number;
}

interface ShipmentProduct {
    OrderCode: string;
    OrderLine: number;
    ProductCode: string;
    ProductDescription: string;
    BoxesNum: number;
    Status: number;
}

function Expedition() {
    return (
        <Switch>
            <Route exact path='/Expedition' render={(props) => { return <Index {...props} />; }} />
            <Route exact path='/Expedition/Edit' render={props => { return <Edit {...props} />; }} />
            <Route path='/Expedition/*' render={() => { return <Redirect to='/Expedition' />; }} />
        </Switch>
    );
}

function Index(props: any) {
    const { t } = useTranslation(),
        { history } = props,
        [, globalActions] = useGlobal(),
        shipmentsHeader: Array<string> = [t('key_87'), t('key_138'), t('key_820')],
        [shipments, setShipments] = useState<Array<Shipment>>([]);

    function editExpedition(shipmentCode: string) {
        history.push('/Expedition/Edit?shipmentCode=' + shipmentCode);
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'ERP/Shipments' + createQueryString({}), {
            method: 'GET',
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    wsSucc.json()
                        .then(data => {
                            setShipments(data);
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    httpErrorLog(wsSucc);
                    alert(t('key_303'));
                }
            })
            .catch(wsErr => {
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                globalActions.setLoadPage(false);
            });

        SessionStorage.clear();
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text='Mapas de carga' />
                <div className='famo-content'>
                    <div className='famo-grid famo-content-grid shipments'>
                        <div className='famo-row famo-header-row'>
                            {shipmentsHeader.map((x, i) => {
                                return (
                                    <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                        <span className='famo-text-11'>{x}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {shipments && shipments.map((x, i) => {
                            return (
                                <div key={i} className='famo-row famo-body-row' onClick={event => editExpedition(x.Code)}>
                                    <div className='famo-cell famo-col-1'>
                                        <span className='famo-text-10'>{x.Code}</span>
                                    </div>
                                    <div className='famo-cell famo-col-2'>
                                        <span className={'famo-text-10 ' + (!x.Description ? 'famo-color-yellow' : '')}>{!x.Description ? t('key_237') : x.Description}</span>
                                    </div>
                                    <div className='famo-cell famo-col-3'>
                                        <span className='famo-text-10'>{x.PickedBoxes + '/' + x.TotalBoxes}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}

function Edit(props: any) {
    const { t } = useTranslation(),
        { location } = props,
        [, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        shipmentCode = query.shipmentCode,
        [totalBoxes, setTotalBoxes] = useState<number>(0),
        mainHeader: Array<string> = [t('key_179'), t('key_54'), t('key_138'), 'Box\'s'],
        readyToLoadHeader: Array<string> = [t('key_819')],
        [shipmentProducts, setShipmentProducts] = useState<Array<ShipmentProduct>>([]);

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'ERP/Shipments/Products' + createQueryString({ shipmentCode: shipmentCode }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    wsSucc.json()
                        .then(data => {
                            setShipmentProducts(data);
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    httpErrorLog(wsSucc);
                    alert(t('key_303'));
                }
            })
            .catch(wsErr => {
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                globalActions.setLoadPage(false);
            });

        SessionStorage.clear();
    }, []);

    return (
        <React.Fragment>
            <section className='container famo-wrapper expedition-details'>
                <div className='row'>
                    <div className='col-12 col-xl-5'>
                        <section className='famo-wrapper'>
                            <div className='famo-title'>
                                <span className='famo-text-13'>Em falta</span>
                            </div>
                            <div className='famo-content'>
                                <div className='famo-grid famo-content-grid expedition-products'>
                                    <div className='famo-row famo-header-row'>
                                        {mainHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {shipmentProducts.filter(x => {
                                        return x.Status === 0;
                                    }).map((x, i) => {
                                        return (
                                            <div key={i} className='famo-row famo-body-row'>
                                                <div className='famo-cell famo-col-1'>
                                                    <span className='famo-text-10'>{x.OrderCode}</span>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <span className='famo-text-10'>{x.ProductCode}</span>
                                                </div>
                                                <div className='famo-cell famo-col-3'>
                                                    <span className='famo-text-10'>{x.ProductDescription}</span>
                                                </div>
                                                <div className='famo-cell famo-col-4'>
                                                    <span className='famo-text-10'>{x.BoxesNum}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className='col-12 col-xl-2'>
                        <section className='famo-wrapper'>
                            <div className='famo-title'>
                                <span className='famo-text-13'>Pronto p/carregar</span>
                            </div>
                            <div className='famo-content'>
                                <div className='famo-grid famo-content-grid expedition-packages'>
                                    <div className='famo-row famo-header-row'>
                                        {readyToLoadHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className='col-12 col-xl-5'>
                        <section className='famo-wrapper'>
                            <div className='famo-title'>
                                <span className='famo-text-13'>Carregado</span>
                            </div>
                            <div className='famo-content'>
                                <div className='famo-grid famo-content-grid expedition-products'>
                                    <div className='famo-row famo-header-row'>
                                        {mainHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {shipmentProducts.filter(x => {
                                        return x.Status === 1;
                                    }).map((x, i) => {
                                        return (
                                            <div key={i} className='famo-row famo-body-row'>
                                                <div className='famo-cell famo-col-1'>
                                                    <span className='famo-text-10'>{x.OrderCode}</span>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <span className='famo-text-10'>{x.ProductCode}</span>
                                                </div>
                                                <div className='famo-cell famo-col-3'>
                                                    <span className='famo-text-10'>{x.ProductDescription}</span>
                                                </div>
                                                <div className='famo-cell famo-col-4'>
                                                    <span className='famo-text-10'>{x.BoxesNum}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}

export default withRouter(Expedition);