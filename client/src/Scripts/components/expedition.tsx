import AudioEffect from '../utils/audio';
import httpStatus from 'http-status';
import Input, { InputConfig } from './elements/input';
import Modal from './elements/modal';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { ContentLoader } from './elements/loader';
import { createQueryString } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Prompt } from 'react-router'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';

interface Box {
    Code: string;
}

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
    Volume: number;
    PendingBoxes: number;
    TotalBoxes: number;
    Status: number;
}

interface ShipmentProductComponent {
    ProductCode: string;
    ProductDescription: string;
    ComponentCode: string;
    ComponentDescription: string;
    BoxCode: string;
    BoxPrinted: boolean;
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
        shipmentsHeader: Array<string> = [t('key_87'), t('key_138'), 'Box\'s'],
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
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
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
                <Title text={t('key_878')} />
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
                        {shipments.map((x, i) => {
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
        { history, location } = props,
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        shipmentCode = query.shipmentCode,
        [shipment, setShipment] = useState<Shipment>(),
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: 'Box',
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            isNumber: false,
            value: '',
            autoFocus: true,
            isDisabled: false
        }),
        [loadingBox, setLoadingBox] = useState<boolean>(false),
        [formMessage, setFormMessage] = useState<string>(''),
        productsHeader: Array<string> = [t('key_179'), t('key_54'), 'Box\'s'],
        [products, setProducts] = useState<Array<ShipmentProduct>>([]),
        boxesHeader: Array<string> = ['Box\'s', ''],
        [boxes, setBoxes] = useState<Array<Box>>([]),
        [savingBoxes, setSavingBoxes] = useState<boolean>(false),
        [componentsModal, setComponentsModal] = useState<boolean>(false),
        componentsHeader: Array<string> = [t('key_87'), t('key_138'), 'Box', ''],
        [components, setComponents] = useState<Array<Array<ShipmentProductComponent>>>([[]]),
        numeral = window['numeral'],
        unitFormat = '0,0',
        volumeFormat = '0,0.00';

    function localAlert(message: string) {
        if (globalState.androidApp) {
            alert(message);
        }
        else {
            AudioEffect.error();
            setFormMessage(message);
        }
    }

    function addBox() {
        if (boxCode.value.startsWith('PL')) {
            const matchPalletCode = boxCode.value.match(/PL.*?(\/|\-)/g);

            setLoadingBox(true);

            fetch(NODE_SERVER + 'ERP/Pallets/Boxes' + createQueryString({
                shipmentCode: query.shipmentCode,
                palletID: matchPalletCode ? parseInt(matchPalletCode[0].replace('PL', '').replace('/', '').replace('-', '')) : -1
            }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(async wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        await wsSucc.json()
                            .then(data => {
                                setFormMessage('');
                                (data as Array<Box>).forEach(x => {
                                    if (boxes.some(y => { return y.Code !== x.Code; })) {
                                        setBoxes([x, ...boxes]);
                                    }
                                });
                            })
                            .catch(error => {
                                promiseErrorLog(error);
                                localAlert(t('key_416'));
                            });
                    }
                    else {
                        httpErrorLog(wsSucc);
                        localAlert(wsSucc.status === httpStatus.NOT_FOUND ? t('key_873') : t('key_303'));
                    }
                })
                .catch(wsErr => {
                    promiseErrorLog(wsErr);
                    localAlert(t('key_416'));
                })
                .finally(() => {
                    setLoadingBox(false);
                    cleanBoxCode();
                });
        }
        else {
            if (boxes && boxes.some(x => { return x.Code === boxCode.value; })) {
                localAlert(t('key_874'));
                cleanBoxCode();
            }
            else {
                setLoadingBox(true);

                fetch(NODE_SERVER + 'ERP/Shipments/Boxes' + createQueryString({
                    shipmentCode: query.shipmentCode,
                    boxCode: boxCode.value
                }), {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then(async wsSucc => {
                        if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                            await wsSucc.json()
                                .then(data => {
                                    setFormMessage('');
                                    setBoxes([(data as Box), ...boxes]);
                                })
                                .catch(error => {
                                    promiseErrorLog(error);
                                    localAlert(t('key_416'));
                                });
                        }
                        else {
                            httpErrorLog(wsSucc);

                            if (wsSucc.status === httpStatus.NOT_FOUND) {
                                localAlert(t('key_872'));
                            }
                            else if (wsSucc.status === httpStatus.FORBIDDEN) {
                                await wsSucc.json()
                                    .then(data => {
                                        if (data.reason === 'box') {
                                            localAlert(t('key_871'));
                                        }
                                        else if (data.reason === 'pallet') {
                                            localAlert(t('key_828'));
                                        }
                                    })
                                    .catch(error => {
                                        promiseErrorLog(error);
                                        localAlert(t('key_416'));
                                    });
                            }
                            else {
                                localAlert(t('key_303'));
                            }
                        }
                    })
                    .catch(wsErr => {
                        promiseErrorLog(wsErr);
                        localAlert(t('key_416'));
                    })
                    .finally(() => {
                        setLoadingBox(false);
                        cleanBoxCode();
                    });
            }
        }
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    function fetchShipmentProducts() {
        return fetch(NODE_SERVER + 'ERP/Shipments/Products' + createQueryString({ shipmentCode: shipmentCode }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setProducts(data);
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
            });
    }

    function getProductComponents(button: HTMLElement, orderCode: string, orderLine: number = null) {
        button.querySelector('.fas').classList.remove('hide');
        button.querySelector('span[class*="famo-text-"]').classList.add('hide');

        fetch(NODE_SERVER + 'ERP/Shipments/Products/Components' + createQueryString({
            orderCode: orderCode,
            orderLine: orderLine
        }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setComponentsModal(true);
                            setComponents(data);
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
                button.querySelector('.fas').classList.add('hide');
                button.querySelector('span[class*="famo-text-"]').classList.remove('hide');
            });
    }

    function deleteBox(code: string) {
        if (window.confirm(t('key_880'))) {
            setBoxes(boxes.filter(x => { return x.Code !== code; }));
        }
    }

    function saveShipment() {
        setSavingBoxes(true);

        fetch(NODE_SERVER + 'ERP/Shipments/Boxes' + createQueryString({
            shipmentCode: query.shipmentCode
        }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boxes.map(x => { return x.Code; })),
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setFormMessage('');
                            setBoxes([]);
                            setProducts(data);
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    httpErrorLog(wsSucc);
                    alert(t('key_302'));
                }
            })
            .catch(wsErr => {
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                setSavingBoxes(false);
                cleanBoxCode();
            });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        const fetchShipment = fetch(NODE_SERVER + 'ERP/Shipments' + createQueryString({ code: shipmentCode }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setShipment(data);
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    httpErrorLog(wsSucc);

                    alert(wsSucc.status === httpStatus.NOT_FOUND ? t('key_825') : t('key_303'));
                    history.replace('/Expedition');
                }
            })
            .catch(wsErr => {
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            });

        Promise.all([fetchShipment, fetchShipmentProducts()]).finally(() => {
            globalActions.setLoadPage(false);
        });

        setInterval(() => {
            fetchShipmentProducts();
        }, 10000);

        SessionStorage.clear();
    }, []);

    return (
        <React.Fragment>
            <Prompt when={boxes.length > 0} message={t('key_881')} />
            <section className='container famo-wrapper'>
                <div className='row'>
                    <div className='col-12 col-xl-8'>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); addBox(); }}>
                                    {!globalState.androidApp &&
                                        <React.Fragment>
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
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-input-label'>
                                                    <span className='famo-text-11'>{t('key_138')}</span>
                                                </div>
                                                <div className='famo-cell'>
                                                    <div className='famo-input'>
                                                        <span className={'famo-text-10 ' + (shipment && shipment.Description ? '' : 'famo-color-yellow')}>{shipment && shipment.Description ? shipment.Description : t('key_237')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>Box</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...boxCode} isDisabled={loadingBox || savingBoxes} set={setBoxCode} />
                                        </div>
                                    </div>
                                    <input type='submit' className='hide' value='' />
                                </form>
                                <div className='famo-grid famo-buttons'>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-right'>
                                            <div className='form-message'>
                                                <span className={'famo-text-11 famo-color-red ' + (!formMessage ? 'hide' : '')}>{formMessage}</span>
                                            </div>
                                            <button type='button' className='famo-button famo-normal-button' disabled={loadingBox || savingBoxes} onClick={event => cleanBoxCode()}>
                                                <span className='famo-text-12'>{t('key_829')}</span>
                                            </button>
                                            {!globalState.androidApp &&
                                                <button type='button' className='famo-button famo-normal-button' disabled={loadingBox || savingBoxes} onClick={event => addBox()}>
                                                    <span className='famo-text-12'>{t('key_815')}</span>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {!globalState.androidApp &&
                        <div className='col-12 col-xl-4'>
                            <section className='famo-wrapper'>
                                <Title text={'Box\'s'} />
                                <div className='famo-content'>
                                    <ContentLoader hide={!savingBoxes} />
                                    <div className={'famo-grid rating-panel ' + (savingBoxes ? 'hide' : '')}>
                                        <div className='famo-row'>
                                            <div className='famo-cell text-center'>
                                                <span className='famo-text-23 famo-color-green'>{numeral(products.reduce((total, x) => { return x.Status === 1 ? total + x.TotalBoxes : total; }, 0)).format(unitFormat)}</span><span className='famo-text-23'>/{numeral(products.reduce((total, x) => { return total + x.TotalBoxes; }, 0)).format(unitFormat)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className='famo-wrapper'>
                                <div className='famo-content'>
                                    <ContentLoader hide={!savingBoxes} />
                                    <div className={'famo-grid rating-panel ' + (savingBoxes ? 'hide' : '')}>
                                        <div className='famo-row'>
                                            <div className='famo-cell text-center'>
                                                <span className='famo-text-23 famo-color-green'>{numeral(products.reduce((total, x) => { return x.Status === 1 ? total + x.Volume : total; }, 0)).format(volumeFormat)}</span><span className='famo-text-23'>/{numeral(products.reduce((total, x) => { return total + x.Volume; }, 0)).format(volumeFormat) + ' m3'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    }
                </div>
            </section>
            <section className='container famo-wrapper expedition-details'>
                <div className='row'>
                    <div className='col-12 col-xl-5'>
                        <section className='famo-wrapper'>
                            <Title text={t('key_876')} />
                            <div className='famo-content'>
                                <ContentLoader hide={!savingBoxes} />
                                <div className={'famo-grid famo-content-grid expedition-products ' + (savingBoxes ? 'hide' : '')}>
                                    <div className='famo-row famo-header-row'>
                                        {productsHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1) + ' ' + (i === productsHeader.length - 1 ? 'text-center' : '')}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {products.filter(x => {
                                        return x.Status === 0;
                                    }).map((x, i) => {
                                        return (
                                            <div key={i} className='famo-row famo-body-row'>
                                                <div className='famo-cell famo-col-1'>
                                                    <button type='button' className='famo-button famo-transparent-button famo-loader-button text-left' onClick={event => getProductComponents(event.currentTarget, x.OrderCode)}>
                                                        <span className={'fas fa-spinner fa-spin ' + (x.PendingBoxes > 0 ? 'famo-color-red' : '') + ' hide'}></span>
                                                        <span className={'famo-text-10 ' + (x.PendingBoxes > 0 ? 'famo-color-red' : '')}>{x.OrderCode}</span>
                                                    </button>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <p>
                                                        <span className={'famo-text-10 ' + (x.PendingBoxes > 0 ? 'famo-color-red' : '')}>{x.ProductCode}</span>
                                                    </p>
                                                    <p>
                                                        <span className={'famo-text-10 ' + (x.PendingBoxes > 0 ? 'famo-color-red' : '')}>{x.ProductDescription}</span>
                                                    </p>
                                                </div>
                                                <div className='famo-cell famo-col-3 text-center'>
                                                    <button type='button' className='famo-button famo-transparent-button famo-loader-button' onClick={event => getProductComponents(event.currentTarget, x.OrderCode, x.OrderLine)}>
                                                        <span className={'fas fa-spinner fa-spin ' + (x.PendingBoxes > 0 ? 'famo-color-red' : '') + ' hide'}></span>
                                                        <span className={'famo-text-10 ' + (x.PendingBoxes > 0 ? 'famo-color-red' : '')}>{numeral(x.PendingBoxes).format(unitFormat)}/{numeral(x.TotalBoxes).format(unitFormat)}</span>
                                                    </button>
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
                            <Title text={t('key_879')} />
                            <div className='famo-content'>
                                <ContentLoader hide={!loadingBox && !savingBoxes} />
                                <div className={'famo-grid ' + (!loadingBox && !savingBoxes ? '' : 'hide')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-right'>
                                            <button type='button' className='famo-button famo-normal-button famo-confirm-button button-save-boxes' disabled={loadingBox || savingBoxes || boxes.length === 0} onClick={event => saveShipment()}>
                                                <span className='famo-text-12'>{t('key_220')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className={'famo-grid famo-content-grid expedition-boxes ' + (!loadingBox && !savingBoxes ? '' : 'hide')}>
                                    <div className='famo-row famo-header-row'>
                                        {boxesHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                                    <span className='famo-text-11'>{x + (i === 0 ? (' (' + numeral(boxes.length).format(unitFormat) + ')') : '')}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {boxes.map((x, i) => {
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
                            <Title text={t('key_875')} />
                            <div className='famo-content'>
                                <ContentLoader hide={!savingBoxes} />
                                <div className={'famo-grid famo-content-grid expedition-products ' + (savingBoxes ? 'hide' : '')}>
                                    <div className='famo-row famo-header-row'>
                                        {productsHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1) + ' ' + (i === productsHeader.length - 1 ? 'text-center' : '')}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {products.filter(x => {
                                        return x.Status === 1;
                                    }).map((x, i) => {
                                        return (
                                            <div key={i} className='famo-row famo-body-row'>
                                                <div className='famo-cell famo-col-1'>
                                                    <span className='famo-text-10'>{x.OrderCode}</span>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <p>
                                                        <span className='famo-text-10'>{x.ProductCode}</span>
                                                    </p>
                                                    <p>
                                                        <span className='famo-text-10'>{x.ProductDescription}</span>
                                                    </p>
                                                </div>
                                                <div className='famo-cell famo-col-3 text-center'>
                                                    <span className='famo-text-10'>{numeral(x.TotalBoxes).format(unitFormat)}</span>
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
            <Modal visible={componentsModal} setVisible={setComponentsModal}>
                {components.filter(x => { return x.length > 0; }).map((x, i) => {
                    const productCode = x[0].ProductCode,
                        productDescription = x[0].ProductDescription;

                    return (
                        <section key={i} className='famo-wrapper'>
                            <Title text={productCode + ' - ' + productDescription} />
                            <div className='famo-content'>
                                <div className='famo-grid famo-content-grid expedition-components'>
                                    <div className='famo-row famo-header-row'>
                                        {componentsHeader.map((y, l) => {
                                            return (
                                                <div key={l} className={'famo-cell famo-col-' + (l + 1)}>
                                                    <span className='famo-text-11'>{y}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {x.map((y, l) => {
                                        return (
                                            <div key={l} className='famo-row famo-body-row'>
                                                <div className='famo-cell famo-col-1'>
                                                    <span className='famo-text-10'>{y.ComponentCode}</span>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <span className={'famo-text-10 ' + (!y.ComponentDescription ? 'famo-color-yellow' : '')}>{!y.ComponentDescription ? t('key_237') : y.ComponentDescription}</span>
                                                </div>
                                                <div className='famo-cell famo-col-3'>
                                                    <span className='famo-text-10'>{y.BoxCode}</span>
                                                </div>
                                                <div className='famo-cell famo-col-4'>
                                                    <span className={'fas ' + (y.BoxPrinted ? 'fa-check famo-color-green' : 'fa-times famo-color-red')}></span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    );
                })}
            </Modal>
        </React.Fragment>
    );
}

export default withRouter(Expedition);