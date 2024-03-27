import Http from '../utils/http';
import httpStatus from 'http-status';
import Input, { InputConfig, InputTools, InputType } from './elements/input';
import Log from '../utils/log';
import Modal from './elements/modal';
import React, { Component, useEffect, useState } from 'react';
import Title from './elements/title';
import { Bin, BinBox, ShipmentProductComponent } from '../utils/interfaces';
import { ContentLoader } from './elements/loader';
import { createQueryString } from '../utils/general';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { SalesOrder } from '../utils/interfaces';
import { NODE_SERVER } from '../utils/variablesRepo';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { VictoryLabel, VictoryPie } from 'victory';
import { stringify } from 'query-string';

enum TransferType {
    Box = 1,
    Order = 2
}

function Warehouse(props: any) {
    return (
        <Switch>
            <Route exact path='/Warehouse' render={(props) => { return <Index {...props} />; }} />
            <Route exact path='/Warehouse/Boxes/Add' render={(props) => { return <AddBox {...props} />; }} />
            <Route exact path='/Warehouse/Boxes/Transfer' render={(props) => { return <TransferBox {...props} />; }} />
            <Route exact path='/Warehouse/Boxes/TransferMany' render={(props) => { return <TransferBoxes {...props} />; }} />
            <Route exact path='/Warehouse/Boxes/Delete' render={(props) => { return <DeleteBox {...props} />; }} />
            <Route exact path='/Warehouse/Orders' render={(props) => { return <Order {...props} />; }} />
            <Route path='/Warehouse/*' render={() => { return <Redirect to='/Warehouse' />; }} />
        </Switch>
    );
}

function Index(props: any) {
    const { t } = useTranslation(),
        buttons: Array<any> = [
            { label: t('key_895'), url: '/Warehouse/Boxes/Add' },
            { label: t('key_897'), url: '/Warehouse/Orders' },
            { label: t('key_905'), url: '/Warehouse/Boxes/Transfer' },
            { label: 'Transferir várias embalagens', url: '/Warehouse/Boxes/TransferMany' },
            { label: t('key_891'), url: '/Warehouse/Boxes/Delete' }
        ];

    useEffect(() => {
        SessionStorage.clear();
    }, []);

    return (
        <div className='container'>
            <div className='row' style={{ justifyContent: 'center' }}>
                {buttons.map((x, i) => {
                    return (
                        <div key={i} className='col-12 col-sm-6 col-lg-3'>
                            <Link to={x.url}>
                                <section className='famo-wrapper'>
                                    <div className='famo-content'>
                                        <div className='famo-grid famo-menu-item'>
                                            <div className='famo-cell text-center'>
                                                <span className='famo-text-19' >{x.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function AddBox(props: any) {
    const { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        [bins, setBins] = useState<Array<Bin>>([]),
        [binID, setBinID] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Select,
            label: t('key_893'),
            className: 'famo-input famo-text-10',
            name: 'binID',
            value: ''
        }),
        [orderCode, setOrderCode] = useState<InputConfig>({
            type: InputType.Text,
            label: t('key_179'),
            className: 'famo-input famo-text-10',
            name: 'orderCode',
            value: '',
            isDisabled: true
        }),
        [customerName, setCustomerName] = useState<InputConfig>({
            type: InputType.Text,
            label: t('key_85'),
            className: 'famo-input famo-text-10',
            name: 'customerName',
            value: '',
            isDisabled: true
        }),
        [expectedShipmentDate, setExpectedShipmentDate] = useState<InputConfig>({
            type: InputType.Text,
            label: t('key_670'),
            className: 'famo-input famo-text-10',
            name: 'expectedShipmentDate',
            value: '',
            isDisabled: true
        }),
        [checkingOrder, setCheckingOrder] = useState<boolean>(false),
        [separatedOrder, setSeparatedOrder] = useState<boolean>(false),
        boxForm: Array<InputConfig> = [binID, orderCode, customerName, expectedShipmentDate],
        setBoxForm: Array<any> = [setBinID, setOrderCode, setCustomerName, setExpectedShipmentDate],
        saveButtonRef: React.RefObject<HTMLButtonElement> = React.createRef(),
        dateFormat = 'L';

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Boxes' + createQueryString({
            code: boxCode.value,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBox(data);
                    setOrderCode(x => { return { ...x, value: data.OrderCode }; });
                    setCustomerName(x => { return { ...x, value: data.CustomerName }; });
                    setExpectedShipmentDate(x => { return { ...x, value: moment(data.ExpectedShipmentDate).format(dateFormat) }; });
                    setBinID(x => { return { ...x, value: data.Bin.ID.toString() }; });
                    setLoading(false);

                    checkBinOrder(data.OrderCode, data.Bin.ID.toString());
                });
            }
            else {
                throw result;
            }
        }).catch(async error => {
            if (error as Response) {
                Log.httpError(error);

                if (error.status === httpStatus.NOT_FOUND) {
                    alert(t('key_883'));
                }
                else if (error.status === httpStatus.FORBIDDEN) {
                    alert(t('key_871'));
                }
                else if (error.status === httpStatus.CONFLICT) {
                    await error.json().then(data => {
                        alert(t('key_887') + ' ' + data.box);
                    }).catch(errorAux => {
                        Log.promiseError(errorAux);
                        alert(t('key_416'));
                    });
                }
                else {
                    alert(t('key_303'));
                }
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }

            setBox(null);
            setCheckingOrder(false);
            setSeparatedOrder(false);
            setLoading(false);

            InputTools.resetValues(boxForm, setBoxForm);
            cleanBoxCode();
        });
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    function checkBinOrder(code: string, binID: string) {
        setCheckingOrder(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Orders' + createQueryString({
            code: code,
            binID: binID
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setSeparatedOrder(data);
                });
            }
            else {
                throw result;
            }
        }).catch(async error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        }).finally(() => {
            setCheckingOrder(false);
        });
    }

    function addBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({}), Http.addAuthorizationHeader({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                binID: binID.value,
                code: box.Code
            })
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                setBox(null);
                setCheckingOrder(false);
                setSeparatedOrder(false);
                setLoading(false);

                InputTools.resetValues(boxForm, setBoxForm);
                cleanBoxCode();
            }
            else {
                throw result;
            }
        }).catch(async error => {
            if (error as Response) {
                Log.httpError(error);

                if (error.status === httpStatus.CONFLICT) {
                    await error.json().then(data => {
                        alert(t('key_887') + ' ' + data.box);
                    }).catch(errorAux => {
                        Log.promiseError(errorAux);
                        alert(t('key_416'));
                    });
                }
                else {
                    alert(t('key_302'));
                }
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }

            setLoading(false);
        });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBins(data);
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
            globalActions.setLoadPage(false);
        });

        SessionStorage.clear();
    }, []);

    useEffect(() => {
        if (binID.value) {
            checkBinOrder(orderCode.value, binID.value);
        }
        saveButtonRef.current?.focus();
    }, [binID.value]);

    useEffect(() => {
        if (!loading) {
            saveButtonRef.current?.focus();
        }
    }, [loading]);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={t('key_895')} />
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getBox(); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{boxCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...boxCode} isDisabled={loading} set={setBoxCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => cleanBoxCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => getBox()}>
                                        <span className='famo-text-12'>{t('key_323')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loading || box) &&
                <section className='famo-wrapper'>
                    <Title text={t('key_819')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!loading} />
                        {box &&
                            <React.Fragment>
                                <form className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')} noValidate>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <div className={'famo-input-loader ' + (checkingOrder ? '' : 'hide')}>
                                                <div className='famo-loader'></div>
                                            </div>
                                            <span className='famo-text-11'>{binID.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...binID} set={setBinID}>
                                                {bins.map((x, i) => {
                                                    return <option key={i} value={x.ID}>{x.Code}</option>
                                                })}
                                            </Input>
                                            <div className={'famo-input-message ' + (separatedOrder ? '' : 'hide')}>
                                                <span className='famo-text-15'>{t('key_902')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{orderCode.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...orderCode} />
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{customerName.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...customerName} />
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{expectedShipmentDate.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...expectedShipmentDate} />
                                        </div>
                                    </div>
                                </form>
                                <div className={'famo-grid famo-buttons ' + (loading ? 'hide' : '')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-right'>
                                            <button type='button' ref={saveButtonRef} className='famo-button famo-confirm-button' onClick={event => addBox()}>
                                                <span className='famo-text-12'>{t('key_220')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </section>
            }
        </React.Fragment>
    );
}

function TransferBox(props: any) {
    const { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        [bins, setBins] = useState<Array<Bin>>([]),
        [binID, setBinID] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Select,
            label: t('key_893'),
            className: 'famo-input famo-text-10',
            name: 'binID',
            value: ''
        }),
        binForm: Array<InputConfig> = [binID],
        setBinForm: Array<any> = [setBinID],
        [transferType, setTransferType] = useState<TransferType>(null),
        dateFormat = 'L';

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({
            code: boxCode.value,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBox(data);
                    setLoading(false);

                    InputTools.resetValues(binForm, setBinForm);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(error.status === httpStatus.NOT_FOUND ? t('key_883') : t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }

            setBox(null);
            setLoading(false);

            InputTools.resetValues(binForm, setBinForm);
            cleanBoxCode();
        });
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    function transferOrder() {
        setTransferType(TransferType.Order);
        InputTools.analyze(binForm, setBinForm);
    }

    function transferBox() {
        setTransferType(TransferType.Box);
        InputTools.analyze(binForm, setBinForm);
    }

    function transfer() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString(transferType === TransferType.Box ? {
            ID: box.ID
        } : {}), Http.addAuthorizationHeader({
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                binID: binID.value,
                orderCode: box.OrderCode
            })
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                setBox(null);
                setLoading(false);

                InputTools.resetValues(binForm, setBinForm);
                cleanBoxCode();
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

            setLoading(false);
        });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBins(data);
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
            globalActions.setLoadPage(false);
        });

        SessionStorage.clear();
    }, []);

    useEffect(() => {
        if (InputTools.areAnalyzed(binForm)) {
            if (InputTools.areValid(binForm)) {
                transfer();
            }
            else {
                InputTools.popUpAlerts(binForm, t);
            }

            InputTools.resetValidations(binForm, setBinForm);
        }
    }, binForm);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={t('key_905')} />
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getBox(); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{boxCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...boxCode} isDisabled={loading} set={setBoxCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => cleanBoxCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => getBox()}>
                                        <span className='famo-text-12'>{t('key_323')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loading || box) &&
                <React.Fragment>
                    <section className='famo-wrapper'>
                        <Title text={t('key_312')} />
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            {box &&
                                <div className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_87')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.Code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_179')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.OrderCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_85')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.CustomerName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_670')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{moment(box.ExpectedShipmentDate).format(dateFormat)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_893')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.Bin.Code}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
                    <section className='famo-wrapper'>
                        <Title text={t('key_898')} />
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            {box &&
                                <form className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')} noValidate>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{binID.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...binID} set={setBinID}>
                                                <option key={-1} value=''></option>
                                                {bins.filter(x => {
                                                    return x.ID !== box.Bin.ID;
                                                }).map((x, i) => {
                                                    return <option key={i} value={x.ID}>{x.Code}</option>
                                                })}
                                            </Input>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                    </section>
                    {box &&
                        <section className='famo-wrapper'>
                            <div className='famo-grid'>
                                <div className='famo-row'>
                                    <div className='famo-cell text-right'>
                                        <button type='button' className='famo-button famo-confirm-button' disabled={loading} onClick={event => transferOrder()}>
                                            <span className='famo-text-12'>{t('key_903')}</span>
                                        </button>
                                        <button type='button' className='famo-button famo-confirm-button' disabled={loading} onClick={event => transferBox()}>
                                            <span className='famo-text-12'>{t('key_904')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    }
                </React.Fragment>
            }
        </React.Fragment>);
}


function TransferBoxes(props: any) {
    const { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        numeral = window['numeral'],
        moment = window['moment'],
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        [orderCode, setOrderCode] = useState<string>(null),
        [boxes, setBoxes] = useState<Array<BinBox>>([]),
        [bins, setBins] = useState<Array<Bin>>([]),
        [binID, setBinID] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Select,
            label: t('key_893'),
            className: 'famo-input famo-text-10',
            name: 'binID',
            value: ''
        }),
        binForm: Array<InputConfig> = [binID],
        setBinForm: Array<any> = [setBinID],
        [transferType, setTransferType] = useState<TransferType>(null),
        dateFormat = 'L';

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({
            code: boxCode.value,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBox(data);
                    setLoading(false);

                    InputTools.resetValues(binForm, setBinForm);
                });

                cleanBoxCode();
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(error.status === httpStatus.NOT_FOUND ? t('key_883') : t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }

            setBox(null);
            setLoading(false);

            InputTools.resetValues(binForm, setBinForm);
            cleanBoxCode();
        });
    }

    function UpdateValues() {
        if (box != null) {
            if (boxes.length < 1) {
                setOrderCode(box.OrderCode);
                updateBoxes();
            }
            else if (box.OrderCode === orderCode) {
                updateBoxes();
            }
            else {
                alert('A embalagem ' + box.Code + ' não pertence à encomenda ' + orderCode + '!');
            }
        }
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    function updateBoxes() {
        if (box && !boxes.some(x => { return x.Code === box.Code; })) {
            boxes.push(box);
            setBox(null);
        }
        else if (box) {
            alert('A embalagem ' + box.Code + ' já foi introduzida!');
        }
    }

    function transferOrder() {
        setTransferType(TransferType.Order);
        InputTools.analyze(binForm, setBinForm);
    }

    function transferBox() {
        setTransferType(TransferType.Box);
        InputTools.analyze(binForm, setBinForm);
    }

    function transfer(boxToTransfer) {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({
            ID: boxToTransfer.ID
        }), Http.addAuthorizationHeader({
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                binID: binID.value,
                orderCode: boxToTransfer.OrderCode
            })
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                setBox(null);
                setLoading(false);

                InputTools.resetValues(binForm, setBinForm);
                cleanBoxCode();
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

            setLoading(false);
        });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBins(data);
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
            globalActions.setLoadPage(false);
        });

        SessionStorage.clear();
    }, []);

    useEffect(() => {
        if (InputTools.areAnalyzed(binForm)) {
            if (InputTools.areValid(binForm)) {
                boxes.forEach(x => transfer(x));
                setBoxes([]);
                setBox(null);
                alert('As embalagens foram transferidas com sucesso!');
                cleanBoxCode();
            }
            else {
                InputTools.popUpAlerts(binForm, t);
            }

            InputTools.resetValidations(binForm, setBinForm);
        }
    }, binForm);

    useEffect(() => {
        UpdateValues();
    }, [box])

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={'Transferir várias embalagens'} />
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getBox(); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{boxCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...boxCode} isDisabled={loading} set={setBoxCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => cleanBoxCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => getBox()}>
                                        <span className='famo-text-12'>{t('key_323')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {!loading && boxes.length > 0 &&
                <React.Fragment>
                    <section className='famo-wrapper'>
                        <Title text={'Detalhe da encomenda'} />
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            <div className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')}>
                                <div className='famo-row'>
                                    <div className='famo-cell famo-input-label'>
                                        <span className='famo-text-11'>{t('key_179')}</span>
                                    </div>
                                    <div className='famo-cell'>
                                        <div className='famo-input'>
                                            <span className='famo-text-10'>{boxes[0].OrderCode}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='famo-row'>
                                    <div className='famo-cell famo-input-label'>
                                        <span className='famo-text-11'>{t('key_85')}</span>
                                    </div>
                                    <div className='famo-cell'>
                                        <div className='famo-input'>
                                            <span className='famo-text-10'>{boxes[0].CustomerName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='famo-row'>
                                    <div className='famo-cell famo-input-label'>
                                        <span className='famo-text-11'>{t('key_670')}</span>
                                    </div>
                                    <div className='famo-cell'>
                                        <div className='famo-input'>
                                            <span className='famo-text-10'>{moment(boxes[0].ExpectedShipmentDate).format(dateFormat)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <React.Fragment>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <ContentLoader hide={!loading} />
                                <div className={'famo-grid famo-content-grid ' + (!loading ? '' : 'hide')}>
                                    <div className='famo-row famo-header-row'>
                                        <div className='famo-cell famo-col-1'>
                                            <span className='famo-text-11'>{'Embalagens (' + boxes.length + ')'}</span>
                                        </div>
                                        <div className='famo-cell famo-col-2'>
                                            <span className='famo-text-11'>Bin</span>
                                        </div>
                                    </div>
                                    {boxes.map((x, i) => {
                                        return (
                                            <div key={i} className='famo-row famo-body-row'>
                                                <div className='famo-cell famo-col-1'>
                                                    <span className={'famo-text-10 '}>{x.Code}</span>
                                                </div>
                                                <div className='famo-cell famo-col-2'>
                                                    <span className={'famo-text-10 '}>{x.Bin.Code}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </React.Fragment>
                    <section className='famo-wrapper'>
                        <Title text={t('key_898')} />
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            {boxes.length > 0 && bins.length > 0 &&
                                <form className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')} noValidate>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{binID.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...binID} set={setBinID}>
                                                <option key={-1} value=''></option>
                                                {bins.map((x, i) => {
                                                    return <option key={i} value={x.ID}>{x.Code}</option>
                                                })}
                                            </Input>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                    </section>
                    {boxes.length > 0 && bins.length > 0 &&
                        <section className='famo-wrapper'>
                            <div className='famo-grid'>
                                <div className='famo-row'>
                                    <div className='famo-cell text-right'>
                                        <button type='button' className='famo-button famo-confirm-button' disabled={loading} onClick={event => transferBox()}>
                                            <span className='famo-text-12'>{t('key_904')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    }
                </React.Fragment>
            }

        </React.Fragment>);
}

function DeleteBox(props: any) {
    const { t } = useTranslation(),
        [globalState,] = useGlobal(),
        moment = window['moment'],
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        dateFormat = 'L';

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({
            code: boxCode.value,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBox(data);
                    setLoading(false);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(error.status === httpStatus.NOT_FOUND ? t('key_883') : t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }

            setBox(null);
            setLoading(false);

            cleanBoxCode();
        });
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    function deleteBox() {
        if (window.confirm(t('key_880'))) {
            setLoading(true);

            fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({
                ID: box.ID
            }), Http.addAuthorizationHeader({
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })).then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    setBox(null);
                    setLoading(false);

                    cleanBoxCode();
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

                setLoading(false);
            });
        }
    }

    useEffect(() => {
        SessionStorage.clear();
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={t('key_891')} />
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getBox(); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{boxCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...boxCode} isDisabled={loading} set={setBoxCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => cleanBoxCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => getBox()}>
                                        <span className='famo-text-12'>{t('key_323')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loading || box) &&
                <section className='famo-wrapper'>
                    <Title text={t('key_819')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!loading} />
                        {box &&
                            <React.Fragment>
                                <div className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_87')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.Code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_179')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.OrderCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_85')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.CustomerName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_670')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{moment(box.ExpectedShipmentDate).format(dateFormat)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_893')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{box.Bin.Code}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={'famo-grid famo-buttons ' + (loading ? 'hide' : '')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-right'>
                                            <button type='button' className='famo-button famo-cancel-button' onClick={event => deleteBox()}>
                                                <span className='famo-text-12'>{t('key_489')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </section>
            }
        </React.Fragment>
    );
}

function Order(props: any) {
    const { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        numeral = window['numeral'],
        [orders, setOrders] = useState<Array<SalesOrder>>([]),
        [orderCode, setOrderCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Select,
            label: t('key_179'),
            className: 'famo-input famo-text-10',
            name: 'orderCode',
            value: ''
        }),
        orderForm: Array<InputConfig> = [orderCode],
        setOrderForm: Array<any> = [setOrderCode],
        [loading, setLoading] = useState<boolean>(false),
        [orderCodeSearch, setOrderCodeSearch] = useState<boolean>(true),
        [order, setOrder] = useState<SalesOrder>(null),
        [searchBox, setSearchBox] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'searchBox',
            value: '',
            autoFocus: true
        }),
        [box, setBox] = useState<BinBox>(null),
        vicPieConfig = {
            standalone: false,
            cornerRadius: 10,
            innerRadius: 120,
            padAngle: 3,
            padding: { top: 25, bottom: 5 }
        },
        vicLabelConfig = {
            lineHeight: 3.5,
            x: 400 * 0.5,
            y: 400 * 0.525
        },
        boxesHeader: Array<string> = [t('key_339'), t('key_900'), t('key_892')],
        [boxes, setBoxes] = useState<Array<BinBox>>([]),
        dateFormat = 'L',
        percentageFormat = '0.00%',
        [componentsModal, setComponentsModal] = useState<boolean>(false),
        componentsHeader: Array<string> = [t('key_87'), t('key_138'), t('key_899'), t('key_892'), ''],
        [components, setComponents] = useState<Array<Array<ShipmentProductComponent>>>([[]]),
        unitFormat = '0,0';

    function getOrder() {
        setLoading(true);

        fetch(NODE_SERVER + 'ERP/Orders' + createQueryString({
            code: orderCode.value
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json()
                    .then(data => {
                        setOrder(data);
                    }).catch(error => {
                        console.log(error);
                    });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                if (error.status === httpStatus.NOT_FOUND) {
                    alert(t('key_884'));
                }
                else {
                    alert(t('key_303'));
                }
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }

            setOrder(null);
            setBoxes([]);
            setLoading(false);

            cleanOrderForm();
        });
    }

    function cleanOrderForm() {
        InputTools.resetValues(orderForm, setOrderForm);
    }

    function GetSearchBox() {
        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({
            code: searchBox.value,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setOrderCode(x => { return { ...x, value: data.OrderCode }; });
                    setSearchBox(prevSearchBox => ({
                        ...prevSearchBox,
                        value: ''
                      }));
                    setLoading(false);
                });
            }
            else {
                throw result;
            }
        }).catch(async error => {
            if (error as Response) {
                Log.httpError(error);

                if (error.status === httpStatus.NOT_FOUND) {
                    alert(t('key_883'));
                }
                else if (error.status === httpStatus.FORBIDDEN) {
                    alert(t('key_871'));
                }
                else if (error.status === httpStatus.CONFLICT) {
                    await error.json().then(data => {
                        alert(t('key_887') + ' ' + data.box);
                    }).catch(errorAux => {
                        Log.promiseError(errorAux);
                        alert(t('key_416'));
                    });
                }
                else {
                    alert(t('key_303'));
                }
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }

            setSearchBox(prevSearchBox => ({
                ...prevSearchBox,
                value: ''
              }));
            setBox(null);
            setLoading(false);
        });
    }

    function getProductComponents(button: HTMLElement, productCode: string, orderCode: string) {
        // button.querySelector('.fas').classList.remove('hide');
        // button.querySelector('span[class*="famo-text-"]').classList.add('hide');

        fetch(NODE_SERVER + 'ERP/Shipments/Products/Components' + createQueryString({
            orderCode: orderCode,
            orderLine: 0,
            productCode: productCode,
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
            // button.querySelector('.fas').classList.add('hide');
            // button.querySelector('span[class*="famo-text-"]').classList.remove('hide');
        });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'ERP/Warehouse/Pending/Orders' + createQueryString({}), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setOrders(data);
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
            globalActions.setLoadPage(false);
        });

        SessionStorage.clear();
    }, []);

    useEffect(() => {
        if (orderCode.value !== '') {
            getOrder();
        }
        else {
            setOrder(null);
            setBoxes([]);
        }
    }, orderForm);

    useEffect(() => {
        if (order) {
            fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({
                orderCode: orderCode.value,
                languageCode: globalState.authUser.Language.Code
            }), Http.addAuthorizationHeader({
                method: 'GET'
            })).then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json().then(data => {
                        setBoxes(data);
                    });
                }
                else {
                    throw result;
                }
            }).catch(error => {
                if (error as Response) {
                    Log.httpError(error);
                    alert(error.status === httpStatus.NOT_FOUND ? t('key_884') : t('key_303'));
                }
                else {
                    Log.promiseError(error);
                    alert(t('key_416'));
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [order]);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={t('key_897')} />
                <div className='famo-content'>
                    {orderCodeSearch &&
                        <form className='famo-grid famo-form-grid famo-submit-form' hidden={!orderCodeSearch} noValidate>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{orderCode.label}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...orderCode} isDisabled={(loading || !orderCodeSearch)} set={setOrderCode} >
                                        <option key=''></option>
                                        {orders.map((x, i) => {
                                            return <option key={i} value={x.Code}>{x.Code}</option>
                                        })}
                                    </Input>
                                </div>
                            </div>
                            <input type='submit' className='hide' value='' />
                        </form>
                    }
                    {!orderCodeSearch &&
                        <form className='famo-grid famo-form-grid famo-submit-form' hidden={orderCodeSearch} noValidate onSubmit={(e) => { e.preventDefault(); GetSearchBox(); }}>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>Embalagem</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...searchBox} isDisabled={(loading || orderCodeSearch)} set={setSearchBox} />
                                </div>
                            </div>
                            {/* <input type='submit' className='hide' value='' /> */}
                        </form>
                    }
                    <div className={'famo-grid famo-buttons ' + (loading ? 'hide' : '')}>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' onClick={() => { setOrderCodeSearch(!orderCodeSearch); }}>
                                    <span className='famo-text-12'>{orderCodeSearch ? 'Embalagem' : 'Encomenda'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loading || order) &&
                <React.Fragment>
                    <section className='famo-wrapper'>
                        <Title text={t('key_179')} />
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            {order &&
                                <div className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_179')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{order.Code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_85')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{order.CustomerName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{t('key_670')}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{moment(order.ExpectedShipmentDate).format(dateFormat)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
                    <section className='famo-wrapper'>
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            {order &&
                                <div className={'container ' + (loading ? 'hide' : '')}>
                                    <div className='row'>
                                        <div className='col-12 col-lg-4'>
                                            <div className='famo-grid'>
                                                <div className='famo-cell text-center'>
                                                    <span className='famo-text-11'>{t('key_889')}</span>
                                                </div>
                                            </div>
                                            <div className='pda-victory-container'>
                                                <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: boxes.filter(x => { return !x.IsPrinted; }).length }, { x: false, y: boxes.filter(x => { return x.IsPrinted; }).length }]} colorScale={['#ff3333', '#bfbfbf']} labels={() => null} />
                                                    <VictoryLabel {...vicLabelConfig} textAnchor='middle' verticalAnchor='middle' text={[numeral(boxes.filter(x => { return !x.IsPrinted; }).length / boxes.length).format(percentageFormat), numeral(boxes.filter(x => { return !x.IsPrinted; }).length).format(unitFormat) + '/' + numeral(boxes.length).format(unitFormat)]} style={[{ fill: '#ff3333' }]} />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='col-12 col-lg-4'>
                                            <div className='famo-grid'>
                                                <div className='famo-cell text-center'>
                                                    <span className='famo-text-11'>{t('key_886')}</span>
                                                </div>
                                            </div>
                                            <div className='pda-victory-container'>
                                                <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: boxes.filter(x => { return x.IsPrinted && x.Bin.ID === -1; }).length }, { x: false, y: boxes.filter(x => { return !(x.IsPrinted && x.Bin.ID === -1); }).length }]} colorScale={['#3333ff', '#bfbfbf']} labels={() => null} />
                                                    <VictoryLabel {...vicLabelConfig} textAnchor='middle' verticalAnchor='middle' text={[numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID === -1; }).length / boxes.length).format(percentageFormat), numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID === -1; }).length).format(unitFormat) + '/' + numeral(boxes.length).format(unitFormat)]} style={[{ fill: '#3333ff' }]} />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='col-12 col-lg-4'>
                                            <div className='famo-grid'>
                                                <div className='famo-cell text-center'>
                                                    <span className='famo-text-11'>{t('key_888')}</span>
                                                </div>
                                            </div>
                                            <div className='pda-victory-container'>
                                                <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: boxes.filter(x => { return x.IsPrinted && x.Bin.ID !== -1; }).length }, { x: false, y: boxes.filter(x => { return !(x.IsPrinted && x.Bin.ID !== -1); }).length }]} colorScale={['#33ff33', '#bfbfbf']} labels={() => null} />
                                                    <VictoryLabel {...vicLabelConfig} textAnchor='middle' verticalAnchor='middle' text={[numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID !== -1; }).length / boxes.length).format(percentageFormat), numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID !== -1; }).length).format(unitFormat) + '/' + numeral(boxes.length).format(unitFormat)]} style={[{ fill: '#33ff33' }]} />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
                    <section className='famo-wrapper'>
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            {order &&
                                <div className={'famo-grid famo-content-grid warehouse-boxes ' + (loading ? 'hide' : '')}>
                                    <div className='famo-row famo-header-row'>
                                        {boxesHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {Object.entries(boxes.sort((a, b) => {
                                        return a.ProductCode > b.ProductCode ? 1 : -1;
                                    }).reduce((r, x) => {
                                        r[x.ProductCode] = r[x.ProductCode] || [];
                                        r[x.ProductCode].push(x);

                                        return r;
                                    }, {})).map(([kProd, vProd]) => {
                                        const productBoxes = vProd as Array<BinBox>;

                                        return Object.entries(productBoxes.sort((a, b) => {
                                            return a.Bin.Code > b.Bin.Code ? -1 : 1;
                                        }).reduce((r, x) => {
                                            r[x.Bin.Code] = r[x.Bin.Code] || [];
                                            r[x.Bin.Code].push(x);

                                            return r;
                                        }, {})).map(([kBox, vBox], i) => {
                                            const binProductBoxes = vBox as Array<BinBox>;

                                            return (
                                                <div key={i} className='famo-row famo-body-row' style={{ cursor: 'pointer' }} onClick={event => getProductComponents(event.currentTarget, kProd, order.Code)}>
                                                    <div className='famo-cell famo-col-1'>
                                                        <span className='famo-text-10'>{kProd}</span>
                                                    </div>
                                                    <div className='famo-cell famo-col-2'>
                                                        <span className='famo-text-10'>{numeral(binProductBoxes.length).format(unitFormat)}/{numeral(productBoxes.length).format(unitFormat)}</span>
                                                    </div>
                                                    <div className='famo-cell famo-col-3'>
                                                        <span className={'famo-text-10 ' + (kBox === 'null' ? 'famo-color-yellow' : '')}>{kBox === 'null' ? 'n/a' : kBox}</span>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })}
                                </div>
                            }
                        </div>
                    </section>
                </React.Fragment>
            }
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

export default withRouter(Warehouse);