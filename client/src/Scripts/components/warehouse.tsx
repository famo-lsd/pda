import httpStatus from 'http-status';
import Input, { InputConfig, InputTools } from './elements/input';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { ContentLoader } from './elements/loader';
import { createQueryString } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { VictoryLabel, VictoryPie } from 'victory';

interface Box {
    Code: string;
    ProductCode: string;
    OrderCode: string;
    CustomerCode: string;
    CustomerName: string;
    ExpectedShipmentDate: Date;
}

interface Bin {
    ID: number;
    Code: string;
    Label: string;
}

interface BinBox extends Box {
    ID: number;
    Bin: Bin;
    Volume: number;
    IsPrinted: boolean;
}

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
            <Route exact path='/Warehouse/Boxes/Delete' render={(props) => { return <DeleteBox {...props} />; }} />
            <Route exact path='/Warehouse/Orders' render={(props) => { return <Order {...props} />; }} />
            <Route path='/Warehouse/*' render={() => { return <Redirect to='/Warehouse' />; }} />
        </Switch>
    );
}

function Index(props: any) {
    const { t } = useTranslation(),
        buttons: Array<any> = [
            { label: 'Arrumar embalagem', url: '/Warehouse/Boxes/Add' },
            { label: 'Consultar encomenda', url: '/Warehouse/Orders' },
            { label: 'Transferir embalagem', url: '/Warehouse/Boxes/Transfer' },
            { label: 'Anular embalagem', url: '/Warehouse/Boxes/Delete' }
        ];

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
        moment = window['moment'],
        [globalState, globalActions] = useGlobal(),
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            isNumber: false,
            value: '',
            autoFocus: true,
            isDisabled: false
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        [bins, setBins] = useState<Array<Bin>>([]),
        [binID, setBinID] = useState<InputConfig>({
            ref: React.createRef(),
            label: 'Armazém',
            className: 'famo-input famo-text-10',
            name: 'binID',
            isNumber: false,
            value: '',
            isDisabled: false
        }),
        [orderCode, setOrderCode] = useState<InputConfig>({
            label: t('key_179'),
            className: 'famo-input famo-text-10',
            name: 'orderCode',
            isNumber: false,
            value: '',
            isDisabled: true
        }),
        [customerName, setCustomerName] = useState<InputConfig>({
            label: t('key_85'),
            className: 'famo-input famo-text-10',
            name: 'customerName',
            isNumber: false,
            value: '',
            isDisabled: true
        }),
        [expectedShipmentDate, setExpectedShipmentDate] = useState<InputConfig>({
            label: t('key_670'),
            className: 'famo-input famo-text-10',
            name: 'expectedShipmentDate',
            isNumber: false,
            value: '',
            isDisabled: true
        }),
        [checkingOrder, setCheckingOrder] = useState<boolean>(false),
        [separatedOrder, setSeparatedOrder] = useState<boolean>(false),
        boxForm: Array<InputConfig> = [binID, orderCode, customerName, expectedShipmentDate],
        setBoxForm: Array<any> = [setBinID, setOrderCode, setCustomerName, setExpectedShipmentDate],
        saveButtonRef: React.RefObject<HTMLButtonElement> = React.createRef();

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Boxes' + createQueryString({ code: boxCode.value, languageCode: globalState.authUser.Language.Code }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json()
                        .then(data => {
                            setBox(data);
                            setOrderCode(x => { return { ...x, value: data.OrderCode }; });
                            setCustomerName(x => { return { ...x, value: data.CustomerName }; });
                            setExpectedShipmentDate(x => { return { ...x, value: moment(data.ExpectedShipmentDate).format('L') }; });
                            setBinID(x => { return { ...x, value: data.Bin.ID.toString() }; });

                            setLoading(false);
                            checkOrderInBins(data.OrderCode, data.Bin.ID.toString());
                        });
                }
                else {
                    throw result;
                }
            })
            .catch(async error => {
                if (error as Response) {
                    httpErrorLog(error);

                    if (error.status === httpStatus.NOT_FOUND) {
                        alert('A embalagem não existe.');
                    }
                    else if (error.status === httpStatus.FORBIDDEN) {
                        alert(t('key_871'));
                    }
                    else if (error.status === httpStatus.CONFLICT) {
                        await error.json()
                            .then(data => {
                                alert('A embalagem já foi selecionada e encontra-se no armazém:' + ' ' + data.box);
                            })
                            .catch(errorAux => {
                                promiseErrorLog(errorAux);
                                alert(t('key_416'));
                            });
                    }
                    else {
                        alert(t('key_303'));
                    }
                }
                else {
                    promiseErrorLog(error);
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

    function checkOrderInBins(code: string, binID: string) {
        setCheckingOrder(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Orders' + createQueryString({ code: code, binID: binID }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json()
                        .then(data => {
                            setSeparatedOrder(data);
                        });
                }
                else {
                    throw result;
                }
            })
            .catch(async error => {
                if (error as Response) {
                    httpErrorLog(error);
                    alert(t('key_303'));
                }
                else {
                    promiseErrorLog(error);
                    alert(t('key_416'));
                }
            }).finally(() => {
                setCheckingOrder(false);
            });
    }

    function addBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({}), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                binID: binID.value,
                code: box.Code
            }),
            credentials: 'include'
        })
            .then(async result => {
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
            })
            .catch(error => {
                if (error as Response) {
                    httpErrorLog(error);
                    alert(t('key_302'));
                }
                else {
                    promiseErrorLog(error);
                    alert(t('key_416'));
                }

                setLoading(false);
            });
    }

    useEffect(() => {
        if (binID.value) {
            checkOrderInBins(orderCode.value, binID.value);
        }
        saveButtonRef.current?.focus();
    }, [binID.value]);

    useEffect(() => {
        if (!loading) {
            saveButtonRef.current?.focus();
        }
    }, [loading]);

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({ languageCode: globalState.authUser.Language.Code }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json()
                        .then(data => {
                            setBins(data);
                        });
                }
                else {
                    throw result;
                }
            })
            .catch(error => {
                if (error as Response) {
                    httpErrorLog(error);
                    alert(t('key_303'));
                }
                else {
                    promiseErrorLog(error);
                    alert(t('key_416'));
                }
            })
            .finally(() => {
                globalActions.setLoadPage(false);
            });
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={'Arrumar embalagem'} />
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
                                                <span className='famo-text-15'>Se colocar a embalagem neste armazém, a encomenda vai estar em vários armazéns.</span>
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
        moment = window['moment'],
        [globalState, globalActions] = useGlobal(),
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            isNumber: false,
            value: '',
            autoFocus: true,
            isDisabled: false
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        [bins, setBins] = useState<Array<Bin>>([]),
        [binID, setBinID] = useState<InputConfig>({
            ref: React.createRef(),
            label: 'Armazém',
            className: 'famo-input famo-text-10',
            name: 'binID',
            isNumber: false,
            value: '',
            isDisabled: false,
            analyze: false,
            localAnalyze: false,
            noData: false
        }),
        binForm: Array<InputConfig> = [binID],
        setBinForm: Array<any> = [setBinID],
        [transferType, setTransferType] = useState<TransferType>(null);

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({ code: boxCode.value, languageCode: globalState.authUser.Language.Code }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json()
                        .then(data => {
                            setBox(data);
                            setLoading(false);

                            InputTools.resetValues(binForm, setBinForm);
                        });
                }
                else {
                    throw result;
                }
            })
            .catch(error => {
                if (error as Response) {
                    httpErrorLog(error);
                    alert(error.status === httpStatus.NOT_FOUND ? 'A embalagem não existe.' : t('key_303'));
                }
                else {
                    promiseErrorLog(error);
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

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString(transferType === TransferType.Box ? { ID: box.ID } : {}), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                binID: binID.value,
                orderCode: box.OrderCode
            }),
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    setBox(null);
                    setLoading(false);

                    InputTools.resetValues(binForm, setBinForm);
                    cleanBoxCode();
                }
                else {
                    throw result;
                }
            })
            .catch(error => {
                if (error as Response) {
                    httpErrorLog(error);
                    alert(error.status === httpStatus.CONFLICT ? 'A encomenda tem embalagens em mais do que um armazém.' : t('key_302'));
                }
                else {
                    promiseErrorLog(error);
                    alert(t('key_416'));
                }

                setLoading(false);
            });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({ languageCode: globalState.authUser.Language.Code }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json()
                        .then(data => {
                            setBins(data);
                        });
                }
                else {
                    throw result;
                }
            })
            .catch(error => {
                if (error as Response) {
                    httpErrorLog(error);
                    alert(t('key_303'));
                }
                else {
                    promiseErrorLog(error);
                    alert(t('key_416'));
                }
            })
            .finally(() => {
                globalActions.setLoadPage(false);
            });
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
                <Title text={'Transferir embalagem'} />
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
                                                <span className='famo-text-10'>{moment(box.ExpectedShipmentDate).format('L')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{'Armazém'}</span>
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
                        <Title text={'Destino'} />
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
                                            <span className='famo-text-12'>Transf. encomenda</span>
                                        </button>
                                        <button type='button' className='famo-button famo-confirm-button' disabled={loading} onClick={event => transferBox()}>
                                            <span className='famo-text-12'>Transf. embalagem</span>
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
        moment = window['moment'],
        [globalState,] = useGlobal(),
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            isNumber: false,
            value: '',
            autoFocus: true,
            isDisabled: false
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null);

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({ code: boxCode.value, languageCode: globalState.authUser.Language.Code }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json()
                        .then(data => {
                            setBox(data);
                            setLoading(false);
                        });
                }
                else {
                    throw result;
                }
            })
            .catch(error => {
                if (error as Response) {
                    httpErrorLog(error);
                    alert(error.status === httpStatus.NOT_FOUND ? 'A embalagem não existe.' : t('key_303'));
                }
                else {
                    promiseErrorLog(error);
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

            fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({ ID: box.ID }), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(async result => {
                    if (result.ok && result.status === httpStatus.OK) {
                        setBox(null);
                        setLoading(false);

                        cleanBoxCode();
                    }
                    else {
                        throw result;
                    }
                })
                .catch(error => {
                    if (error as Response) {
                        httpErrorLog(error);
                        alert(t('key_302'));
                    }
                    else {
                        promiseErrorLog(error);
                        alert(t('key_416'));
                    }

                    setLoading(false);
                });
        }
    }

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={'Anular embalagem'} />
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
                                                <span className='famo-text-10'>{moment(box.ExpectedShipmentDate).format('L')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{'Armazém'}</span>
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
        moment = window['moment'],
        numeral = window['numeral'],
        [globalState,] = useGlobal(),
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            isNumber: false,
            value: '',
            autoFocus: true,
            isDisabled: false
        }),
        [loading, setLoading] = useState<boolean>(false),
        [box, setBox] = useState<Box>(null),
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
        boxesHeader: Array<string> = [t('key_339'), 'Emb. (s)', ''],
        [boxes, setBoxes] = useState<Array<BinBox>>([]);

    function getBox() {
        setLoading(true);

        fetch(NODE_SERVER + 'ERP/Boxes' + createQueryString({ code: boxCode.value }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json()
                        .then(data => {
                            setBox(data);
                        });
                }
                else {
                    throw result;
                }
            })
            .catch(error => {
                if (error as Response) {
                    httpErrorLog(error);

                    if (error.status === httpStatus.NOT_FOUND) {
                        alert('A embalagem não existe.');
                    }
                    else if (error.status === httpStatus.FORBIDDEN) {
                        alert(t('key_871'));
                    }
                    else {
                        alert(t('key_303'));
                    }
                }
                else {
                    promiseErrorLog(error);
                    alert(t('key_416'));
                }

                setBox(null);
                setBoxes([]);
                setLoading(false);

                cleanBoxCode();
            });
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    useEffect(() => {
        if (box) {
            fetch(NODE_SERVER + 'Warehouse/Bins/Boxes' + createQueryString({ orderCode: box.OrderCode, languageCode: globalState.authUser.Language.Code }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(async result => {
                    if (result.ok && result.status === httpStatus.OK) {
                        await result.json()
                            .then(data => {
                                setBoxes(data);
                            });
                    }
                    else {
                        throw result;
                    }
                })
                .catch(error => {
                    if (error as Response) {
                        httpErrorLog(error);
                        alert(error.status === httpStatus.NOT_FOUND ? 'A encomenda não existe.' : t('key_303'));
                    }
                    else {
                        promiseErrorLog(error);
                        alert(t('key_416'));
                    }
                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [box]);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text={'Consultar encomenda'} />
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
                        <Title text={t('key_179')} />
                        <div className='famo-content'>
                            <ContentLoader hide={!loading} />
                            {box &&
                                <div className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')}>
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
                                                <span className='famo-text-10'>{moment(box.ExpectedShipmentDate).format('L')}</span>
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
                            {box &&
                                <div className={'container warehouse-charts ' + (loading ? 'hide' : '')}>
                                    <div className='row'>
                                        <div className='col-12 col-lg-4'>
                                            <div className='famo-grid'>
                                                <div className='famo-cell text-center'>
                                                    <span className='famo-text-11'>A produzir</span>
                                                </div>
                                            </div>
                                            <div className='victory-container'>
                                                <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: boxes.filter(x => { return !x.IsPrinted; }).length }, { x: false, y: boxes.filter(x => { return x.IsPrinted; }).length }]} colorScale={['#ff3333', '#bfbfbf']} labels={() => null} />
                                                    <VictoryLabel {...vicLabelConfig} textAnchor='middle' verticalAnchor='middle' text={[numeral(boxes.filter(x => { return !x.IsPrinted; }).length / boxes.length).format('0.00%'), numeral(boxes.filter(x => { return !x.IsPrinted; }).length).format('0,0') + '/' + numeral(boxes.length).format('0,0')]} style={[{ fill: '#ff3333' }]} />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='col-12 col-lg-4'>
                                            <div className='famo-grid'>
                                                <div className='famo-cell text-center'>
                                                    <span className='famo-text-11'>A arrumar</span>
                                                </div>
                                            </div>
                                            <div className='victory-container'>
                                                <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: boxes.filter(x => { return x.IsPrinted && x.Bin.ID === -1; }).length }, { x: false, y: boxes.filter(x => { return !(x.IsPrinted && x.Bin.ID === -1); }).length }]} colorScale={['#3333ff', '#bfbfbf']} labels={() => null} />
                                                    <VictoryLabel {...vicLabelConfig} textAnchor='middle' verticalAnchor='middle' text={[numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID === -1; }).length / boxes.length).format('0.00%'), numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID === -1; }).length).format('0,0') + '/' + numeral(boxes.length).format('0,0')]} style={[{ fill: '#3333ff' }]} />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='col-12 col-lg-4'>
                                            <div className='famo-grid'>
                                                <div className='famo-cell text-center'>
                                                    <span className='famo-text-11'>A expedir</span>
                                                </div>
                                            </div>
                                            <div className='victory-container'>
                                                <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: boxes.filter(x => { return x.IsPrinted && x.Bin.ID !== -1; }).length }, { x: false, y: boxes.filter(x => { return !(x.IsPrinted && x.Bin.ID !== -1); }).length }]} colorScale={['#33ff33', '#bfbfbf']} labels={() => null} />
                                                    <VictoryLabel {...vicLabelConfig} textAnchor='middle' verticalAnchor='middle' text={[numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID !== -1; }).length / boxes.length).format('0.00%'), numeral(boxes.filter(x => { return x.IsPrinted && x.Bin.ID !== -1; }).length).format('0,0') + '/' + numeral(boxes.length).format('0,0')]} style={[{ fill: '#33ff33' }]} />
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
                            {box &&
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
                                                <div key={i} className='famo-row famo-body-row'>
                                                    <div className='famo-cell famo-col-1'>
                                                        <span className='famo-text-10'>{kProd}</span>
                                                    </div>
                                                    <div className='famo-cell famo-col-2'>
                                                        <span className='famo-text-10'>{numeral(binProductBoxes.length).format('0,0')}/{numeral(productBoxes.length).format('0,0')}</span>
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
        </React.Fragment>
    );
}

export default withRouter(Warehouse);