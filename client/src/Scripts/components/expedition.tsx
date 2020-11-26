import AudioEffect from '../utils/audio';
import Http from '../utils/http';
import httpStatus from 'http-status';
import Input, { InputConfig, InputTools, InputType } from './elements/input';
import Log from '../utils/log';
import Modal from './elements/modal';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { Box, Shipment, ShipmentGate, ShipmentProduct, ShipmentProductComponent } from '../utils/interfaces';
import { ContentLoader } from './elements/loader';
import { createQueryString } from '../utils/general';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Prompt } from 'react-router'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';

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
    const { history } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        [loading, setLoading] = useState<boolean>(false),
        shipmentsHeader: Array<string> = [t('key_87'), t('key_138'), t('key_900'), t('key_896'), ''],
        [shipments, setShipments] = useState<Array<Shipment>>([]),
        [shipmentGates, setShipmentGates] = useState<Array<ShipmentGate>>([]),
        [shipmentCodeSelected, setShipmentCodeSelected] = useState<string>(null),
        [clickOnShipment, setClickOnShipment] = useState<boolean>(false),
        [shipmentGateModal, setShipmentGateModal] = useState<boolean>(false),
        [modalShipmentGateID, setModalShipmentGateID] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Select,
            label: t('key_896'),
            className: 'famo-input famo-text-10',
            name: 'gateID',
            value: ''
        }),
        shipmentGateModalForm: Array<InputConfig> = [modalShipmentGateID],
        setShipmentGateModalForm: Array<any> = [setModalShipmentGateID],
        numeral = window['numeral'],
        unitFormat = '0,0';

    function getShipments() {
        return fetch(NODE_SERVER + 'ERP/Shipments' + createQueryString({
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setShipments(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        });
    }

    function edit(shipment: Shipment) {
        if (shipment.Gate.ID === -1) {
            setClickOnShipment(true);
            setShipmentCodeSelected(shipment.Code);
            setShipmentGateModal(true);
        }
        else {
            history.push('/Expedition/Edit?shipmentCode=' + shipment.Code);
        }
    }

    function setGate(event: React.MouseEvent<HTMLButtonElement>, shipment: Shipment) {
        event.stopPropagation();

        setClickOnShipment(false);
        setShipmentCodeSelected(shipment.Code);
        setModalShipmentGateID(x => { return { ...x, value: shipment.Gate.ID }; });
        setShipmentGateModal(true);
    }

    function submitShipmentGateModal() {
        InputTools.analyze(shipmentGateModalForm, setShipmentGateModalForm);
    }

    function shipmentGateModalCallback(visibility: boolean) {
        if (!visibility) {
            InputTools.resetValues(shipmentGateModalForm, setShipmentGateModalForm);
        }
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        const getShipmentGates = fetch(NODE_SERVER + 'Shipments/Gates' + createQueryString({
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setShipmentGates(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        });

        Promise.all([getShipments(), getShipmentGates]).finally(() => {
            globalActions.setLoadPage(false);
        });

        SessionStorage.clear();
    }, []);

    useEffect(() => {
        if (InputTools.areAnalyzed(shipmentGateModalForm)) {
            if (InputTools.areValid(shipmentGateModalForm)) {
                setLoading(true);

                fetch(NODE_SERVER + 'Shipments' + createQueryString({}), Http.addAuthorizationHeader({
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: shipmentCodeSelected,
                        gateID: modalShipmentGateID.value
                    })
                })).then(async result => {
                    if (result.ok && result.status === httpStatus.OK) {
                        await getShipments();

                        // Reset.
                        setClickOnShipment(false);
                        setShipmentCodeSelected(null);
                        setLoading(false);

                        if (clickOnShipment) {
                            history.push('/Expedition/Edit?shipmentCode=' + shipmentCodeSelected);
                        }
                    }
                    else {
                        throw result;
                    }
                }).catch(error => {
                    if (error as Response) {
                        Log.httpError(error);
                        alert(t('key_302'));
                    }
                    else {
                        Log.promiseError(error);
                        alert(t('key_416'));
                    }

                    // Reset.
                    setClickOnShipment(false);
                    setShipmentCodeSelected(null);
                    setLoading(false);
                });

                setShipmentGateModal(false);
            }
            else {
                InputTools.popUpAlerts(shipmentGateModalForm, t);
            }

            InputTools.resetValidations(shipmentGateModalForm, setShipmentGateModalForm);
        }
    }, shipmentGateModalForm);

    useEffect(() => {
        if (!shipmentGateModal) {
            setModalShipmentGateID(x => { return { ...x, value: '' }; });
        }
    }, [shipmentGateModal])

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={t('key_878')} />
                <div className='famo-content'>
                    <ContentLoader hide={!loading} />
                    <div className={'famo-grid famo-content-grid shipments ' + (loading ? 'hide' : '')}>
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
                                <div key={i} className='famo-row famo-body-row' onClick={event => edit(x)}>
                                    <div className='famo-cell famo-col-1'>
                                        <span className='famo-text-10'>{x.Code}</span>
                                    </div>
                                    <div className='famo-cell famo-col-2'>
                                        <span className={'famo-text-10 ' + (!x.Description ? 'famo-color-yellow' : '')}>{!x.Description ? t('key_237') : x.Description}</span>
                                    </div>
                                    <div className='famo-cell famo-col-3'>
                                        <span className='famo-text-10'>{numeral(x.PickedBoxes).format(unitFormat) + '/' + numeral(x.TotalBoxes).format(unitFormat)}</span>
                                    </div>
                                    <div className='famo-cell famo-col-4'>
                                        <span className={'famo-text-10 ' + (x.Gate.ID === -1 ? 'famo-color-yellow' : '')}>{x.Gate.ID === -1 ? 'n/a' : x.Gate.Label}</span>
                                    </div>
                                    <div className='famo-cell famo-col-5'>
                                        <button type='button' className='famo-button famo-normal-button' onClick={event => setGate(event, x)}>
                                            <span className='fas fa-truck-loading'></span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <Modal visible={shipmentGateModal} setVisible={setShipmentGateModal} visibleCallback={shipmentGateModalCallback}>
                <section className='famo-wrapper'>
                    <div className='famo-content'>
                        <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); submitShipmentGateModal(); }}>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{modalShipmentGateID.label}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...modalShipmentGateID} set={setModalShipmentGateID}>
                                        <option key={-1} value=''></option>
                                        {shipmentGates.map((x, i) => {
                                            return <option key={i} value={x.ID}>{x.Label}</option>
                                        })}
                                    </Input>
                                </div>
                            </div>
                            <input type='submit' className='hide' value='' />
                        </form>
                        <div className='famo-grid famo-buttons'>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    <button type='button' className='famo-button famo-confirm-button' onClick={event => submitShipmentGateModal()}>
                                        <span className='famo-text-12'>{t('key_701')}</span>
                                    </button>
                                    <button type="button" className="famo-button famo-cancel-button" onClick={event => setShipmentGateModal(false)}>
                                        <span className="famo-text-12">{t('key_484')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Modal>
        </React.Fragment>
    );
}

function Edit(props: any) {
    const { history, location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        shipmentCodeQS = query.shipmentCode,
        [shipmentCode, setShipmentCode] = useState<InputConfig>({
            type: InputType.Text,
            label: t('key_822'),
            className: 'famo-input famo-text-10',
            name: 'shipmentCode',
            value: shipmentCodeQS.toString(),
            isDisabled: true
        }),
        [description, setDescription] = useState<InputConfig>({
            type: InputType.Text,
            label: t('key_138'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            isDisabled: true
        }),
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true
        }),
        [unload, setUnload] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Checkbox,
            label: t('key_901'),
            className: 'famo-input',
            name: 'unload',
            value: false
        }),
        [loadingBox, setLoadingBox] = useState<boolean>(false),
        [formMessage, setFormMessage] = useState<string>(''),
        productsHeader: Array<string> = [t('key_179'), t('key_54'), t('key_900')],
        [products, setProducts] = useState<Array<ShipmentProduct>>([]),
        boxesHeader: Array<string> = [t('key_820'), ''],
        [boxes, setBoxes] = useState<Array<Box>>([]),
        [savingBoxes, setSavingBoxes] = useState<boolean>(false),
        [componentsModal, setComponentsModal] = useState<boolean>(false),
        componentsHeader: Array<string> = [t('key_87'), t('key_138'), t('key_899'), t('key_892'), ''],
        [components, setComponents] = useState<Array<Array<ShipmentProductComponent>>>([[]]),
        numeral = window['numeral'],
        unitFormat = '0,0',
        decimalFormat = '0,0.00';

    function formAlert(message: string) {
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
                shipmentCode: shipmentCodeQS,
                palletID: matchPalletCode ? parseInt(matchPalletCode[0].replace('PL', '').replace('/', '').replace('-', '')) : -1,
            }), Http.addAuthorizationHeader({
                method: 'GET'
            })).then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json().then(data => {
                        setFormMessage('');
                        setBoxes([...(data as Array<Box>).filter(x => { return !boxes.some(y => { return y.Code === x.Code; }); }), ...boxes]);
                    });
                }
                else {
                    throw result;
                }
            }).catch(error => {
                if (error as Response) {
                    Log.httpError(error);
                    formAlert(error.status === httpStatus.NOT_FOUND ? t('key_873') : t('key_303'));
                }
                else {
                    Log.promiseError(error);
                    formAlert(t('key_416'));
                }
            }).finally(() => {
                setLoadingBox(false);
                cleanBoxCode();
            });
        }
        else {
            if (boxes && boxes.some(x => { return x.Code === boxCode.value; })) {
                cleanBoxCode();
                formAlert(t('key_874'));
            }
            else {
                setLoadingBox(true);

                fetch(NODE_SERVER + 'ERP/Shipments/Boxes' + createQueryString({
                    shipmentCode: shipmentCodeQS,
                    boxCode: boxCode.value,
                    unload: unload.value
                }), Http.addAuthorizationHeader({
                    method: 'GET'
                })).then(async result => {
                    if (result.ok && result.status === httpStatus.OK) {
                        await result.json().then(data => {
                            setFormMessage('');
                            setBoxes([(data as Box), ...boxes]);
                        });
                    }
                    else {
                        throw result;
                    }
                }).catch(async error => {
                    if (error as Response) {
                        Log.httpError(error);

                        if (error.status === httpStatus.NOT_FOUND) {
                            formAlert(t('key_872'));
                        }
                        else if (error.status === httpStatus.FORBIDDEN) {
                            await error.json().then(data => {
                                if (data.reason === 'box') {
                                    formAlert(!unload.value ? t('key_871') : t('key_882'));
                                }
                                else if (data.reason === 'pallet') {
                                    formAlert(t('key_828'));
                                }
                            }).catch(errorAux => {
                                Log.promiseError(errorAux);
                                formAlert(t('key_416'));
                            });
                        }
                        else {
                            formAlert(t('key_303'));
                        }
                    }
                    else {
                        Log.promiseError(error);
                        formAlert(t('key_416'));
                    }
                }).finally(() => {
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

    function getShipmentProducts() {
        return fetch(NODE_SERVER + 'ERP/Shipments/Products' + createQueryString({
            shipmentCode: shipmentCodeQS
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setProducts(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        });
    }

    function getProductComponents(button: HTMLElement, orderCode: string, orderLine: number = null) {
        button.querySelector('.fas').classList.remove('hide');
        button.querySelector('span[class*="famo-text-"]').classList.add('hide');

        fetch(NODE_SERVER + 'ERP/Shipments/Products/Components' + createQueryString({
            orderCode: orderCode,
            orderLine: orderLine,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setComponentsModal(true);
                    setComponents(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        }).finally(() => {
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
            shipmentCode: shipmentCodeQS,
            unload: unload.value
        }), Http.addAuthorizationHeader({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boxes.map(x => { return x.Code; }))
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setFormMessage('');
                    setBoxes([]);
                    setProducts(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_302'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        }).finally(() => {
            setSavingBoxes(false);
            cleanBoxCode();
        });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        const getShipment = fetch(NODE_SERVER + 'ERP/Shipments' + createQueryString({
            code: shipmentCodeQS
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setDescription(x => { return { ...x, value: data.Description }; });
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);

                alert(error.status === httpStatus.NOT_FOUND ? t('key_825') : t('key_303'));
                history.replace('/Expedition');
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        });

        Promise.all([getShipment, getShipmentProducts()]).finally(() => {
            globalActions.setLoadPage(false);
        });

        setInterval(() => {
            getShipmentProducts();
        }, 10000);

        SessionStorage.clear();
    }, []);

    useEffect(() => {
        setBoxes([]);
    }, [unload]);

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
                                                    <span className='famo-text-11'>{shipmentCode.label}</span>
                                                </div>
                                                <div className='famo-cell'>
                                                    <Input {...shipmentCode} set={setShipmentCode} />
                                                </div>
                                            </div>
                                            <div className='famo-row'>
                                                <div className='famo-cell famo-input-label'>
                                                    <span className='famo-text-11'>{description.label}</span>
                                                </div>
                                                <div className='famo-cell'>
                                                    <Input {...description} set={setDescription} />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{boxCode.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...boxCode} isDisabled={loadingBox || savingBoxes} set={setBoxCode} />
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{unload.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...unload} isDisabled={loadingBox || savingBoxes} set={setUnload} />
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
                                <Title text={t('key_820')} />
                                <div className='famo-content'>
                                    <ContentLoader hide={!savingBoxes} />
                                    <div className={'famo-grid rating-panel ' + (savingBoxes ? 'hide' : '')}>
                                        <div className='famo-row'>
                                            <div className='famo-cell text-center'>
                                                <span className='famo-text-23 famo-color-green'>{numeral(products.reduce((total, x) => { return x.ShipmentStatus === 1 ? total + x.TotalBoxes : total; }, 0)).format(unitFormat)}</span><span className='famo-text-23'>{'/' + numeral(products.reduce((total, x) => { return total + x.TotalBoxes; }, 0)).format(unitFormat)}</span>
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
                                                <span className='famo-text-23 famo-color-green'>{numeral(products.reduce((total, x) => { return x.ShipmentStatus === 1 ? total + x.ProductVolume : total; }, 0)).format(decimalFormat)}</span><span className='famo-text-23'>{'/' + numeral(products.reduce((total, x) => { return total + x.ProductVolume; }, 0)).format(decimalFormat) + ' m³'}</span>
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
                                        return x.ShipmentStatus === 0;
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
                                                    <span className={'famo-text-10 ' + (unload.value ? 'famo-color-red' : '')}>{x.Code}</span>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <button type='button' className='famo-button famo-cancel-button' onClick={event => deleteBox(x.Code)}>
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
                                        return x.ShipmentStatus === 1;
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
                                                    <span className={'famo-text-10 ' + (y.Bin.ID === -1 ? 'famo-color-yellow' : '')}>{y.Bin.ID === -1 ? 'n/a' : y.Bin.Code}</span>
                                                </div>
                                                <div className='famo-cell famo-col-5'>
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