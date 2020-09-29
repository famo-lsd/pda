import httpStatus from 'http-status';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { ContentLoader } from './elements/loader';
import { createQueryString } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import Input, { InputConfig } from './elements/input';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';

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

interface Box {
    Code: string;
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
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        shipmentCode = query.shipmentCode,
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true,
            isNumber: false,
            isDisabled: false
        }),
        [boxLoad, setBoxLoad] = useState<boolean>(false),
        mainHeader: Array<string> = [t('key_179'), t('key_54'), t('key_138'), t('key_820')],
        readyToLoadHeader: Array<string> = [t('key_820'), ''],
        [shipmentProducts, setShipmentProducts] = useState<Array<ShipmentProduct>>(null),
        [boxes, setBoxes] = useState<Array<Box>>(null);

    function cleanBoxCode() {
        setBoxCode(prevState => { return { ...prevState, value: '' } });
        boxCode.ref.current.focus();
    }

    function addBox() {
        if (boxCode.value.startsWith('PL')) {
            const matchPalletCode = boxCode.value.match(/(?<=PL).*(?=\/)/g);

            setBoxLoad(true);

            fetch(NODE_SERVER + 'ERP/Pallets/Boxes' + createQueryString({
                shipmentCode: query.shipmentCode,
                palletID: matchPalletCode ? parseInt(matchPalletCode[0]) : -1
            }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        wsSucc.json()
                            .then(data => {
                                (data as Array<Box>).forEach(x => {
                                    if (boxes.some(y => { return y.Code !== x.Code; })) {
                                        setBoxes([x, ...boxes]);
                                    }
                                });
                            })
                            .catch(error => {
                                promiseErrorLog(error);
                                alert(t('key_416'));
                            });
                    }
                    else {
                        httpErrorLog(wsSucc);

                        if (wsSucc.status === httpStatus.NOT_FOUND) {
                            alert('A palete não está associada ao envio.')
                        }
                        else {
                            alert(t('key_303'));
                        }
                    }
                })
                .catch(wsErr => {
                    promiseErrorLog(wsErr);
                    alert(t('key_416'));
                })
                .finally(() => {
                    cleanBoxCode();
                    setBoxLoad(false);
                });
        }
        else {
            if (boxes && boxes.some(x => { return x.Code === boxCode.value; })) {
                alert('A embalagem já está pronta a carregar.');
            }
            else {
                setBoxLoad(true);

                fetch(NODE_SERVER + 'ERP/Shipments/Boxes' + createQueryString({
                    shipmentCode: query.shipmentCode,
                    boxCode: boxCode.value
                }), {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then(wsSucc => {
                        if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                            wsSucc.json()
                                .then(data => {
                                    setBoxes([(data as Box), ...boxes]);
                                })
                                .catch(error => {
                                    promiseErrorLog(error);
                                    alert(t('key_416'));
                                });
                        }
                        else {
                            httpErrorLog(wsSucc);

                            if (wsSucc.status === httpStatus.NOT_FOUND) {
                                alert('A embalagem não está associada ao envio.');
                            }
                            else if (wsSucc.status === httpStatus.FORBIDDEN) {
                                wsSucc.json()
                                    .then(data => {
                                        console.log(data);
                                    })
                                    .catch(error => {
                                        promiseErrorLog(error);
                                        alert(t('key_416'));
                                    });

                                alert(t('key_828'));
                            }
                            else {
                                alert(t('key_303'));
                            }
                        }
                    })
                    .catch(wsErr => {
                        promiseErrorLog(wsErr);
                        alert(t('key_416'));
                    })
                    .finally(() => {
                        cleanBoxCode();
                        setBoxLoad(false);
                    });
            }
        }
    }

    function deleteBox(code: string) {
        if (window.confirm('Tem a certeza que pretende eliminar a embalagem?')) {
            setBoxes(boxes.filter(x => { return x.Code !== code; }));
        }
    }

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
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); addBox(); }}>
                        {!globalState.androidApp &&
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_822')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <div className='famo-input'>
                                        <span className='famo-text-10'>{query.shipmentCode}</span>
                                    </div>
                                </div>
                            </div>
                        }
                        {!globalState.androidApp && shipmentProducts &&
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_820')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <div className='famo-input'>
                                        <span className='famo-text-10 famo-color-green'>{shipmentProducts.reduce((total, x) => { return x.Status === 1 ? total + x.BoxesNum : total; }, 0)}</span><span className='famo-text-10'>/{shipmentProducts.reduce((total, x) => { return total + x.BoxesNum; }, 0)}</span>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{t('key_819')}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...boxCode} set={setBoxCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={boxLoad} onClick={event => cleanBoxCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={boxLoad} onClick={event => addBox()}>
                                        <span className='famo-text-12'>{t('key_815')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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
                                    {shipmentProducts && shipmentProducts.filter(x => {
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
                                <ContentLoader hide={!boxLoad} />
                                <div className={'famo-grid famo-content-grid expedition-boxes' + (boxLoad ? ' hide' : '')}>
                                    <div className='famo-row famo-header-row'>
                                        {readyToLoadHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                                    <span className='famo-text-11'>{x + (i === 0 ? (' (' + (boxes ? boxes.length : 0) + ')') : '')}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {boxes && boxes.map((x, i) => {
                                        return (
                                            <div key={i} className='famo-row famo-body-row'>
                                                <div className='famo-cell famo-col-1'>
                                                    <span className='famo-text-10'>{x.Code}</span>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <button type='button' className='famo-button famo-cancel-button button-delete-box' onClick={event => deleteBox(x.Code)}>
                                                        <span className='fas fa-trash-alt'></span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
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
                                    {shipmentProducts && shipmentProducts.filter(x => {
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