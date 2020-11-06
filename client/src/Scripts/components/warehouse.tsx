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

interface Bin {
    ID: number;
    Code: string;
    Label: string;
}

interface BinBox {
    ID: number;
    Bin: Bin;
    Code: string;
    OrderCode: string;
    CustomerCode: string;
    CustomerName: string;
    Volume: number;
    PlannedShipmentDate: Date;
}

function Warehouse(props: any) {
    return (
        <Switch>
            <Route exact path='/Warehouse' render={(props) => { return <Index {...props} />; }} />
            <Route exact path='/Warehouse/Boxes/Add' render={(props) => { return <AddBox {...props} />; }} />
            <Route exact path='/Warehouse/Boxes/Transfer' render={(props) => { return <TransferBox {...props} />; }} />
            <Route exact path='/Warehouse/Boxes/Delete' render={(props) => { return <DeleteBox {...props} />; }} />
            <Route path='/Warehouse/*' render={() => { return <Redirect to='/Warehouse' />; }} />
        </Switch>
    );
}

function Index(props: any) {
    const { t } = useTranslation(),
        buttons: Array<any> = [
            { label: 'Arrumar embalagem', url: '/Warehouse/Boxes/Add' },
            { label: 'Consultar encomenda', url: '/Warehouse' },
            { label: 'Transferir embalagem', url: '/Warehouse/Boxes/Transfer' },
            { label: 'Anular embalagem', url: '/Warehouse/Boxes/Delete' }
        ];

    return (
        <div className='container'>
            <div className='row' style={{ justifyContent: "center" }}>
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
            label: 'Box',
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            isNumber: false,
            value: '',
            autoFocus: true,
            isDisabled: false
        }),
        [loadingBox, setLoadingBox] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        [bins, setBins] = useState<Array<Bin>>([]),
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
        [plannedShipmentDate, setPlannedShipmentDate] = useState<InputConfig>({
            label: t('key_670'),
            className: 'famo-input famo-text-10',
            name: 'plannedShipmentDate',
            isNumber: false,
            value: '',
            isDisabled: true
        }),
        [binID, setBinID] = useState<InputConfig>({
            ref: React.createRef(),
            label: 'Armazém',
            className: 'famo-input famo-text-10',
            name: 'binID',
            isNumber: false,
            value: '',
            isDisabled: false
        }),
        boxForm: Array<InputConfig> = [orderCode, customerName, plannedShipmentDate, binID],
        setBoxForm: Array<any> = [setOrderCode, setCustomerName, setPlannedShipmentDate, setBinID];

    function getBox() {
        if (box?.Code !== boxCode.value) {
            let reqSuccess = false;

            setLoadingBox(true);

            fetch(NODE_SERVER + 'Warehouse/Boxes' + createQueryString({ code: boxCode.value, languageCode: globalState.authUser.Language.Code }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(async wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        await wsSucc.json()
                            .then(data => {
                                reqSuccess = true;

                                setBox(data);
                                setOrderCode(x => { return { ...x, value: data.OrderCode }; });
                                setCustomerName(x => { return { ...x, value: data.CustomerName }; });
                                setPlannedShipmentDate(x => { return { ...x, value: moment(data.PlannedShipmentDate).format('L') }; });
                                setBinID(x => { return { ...x, value: data.Bin.ID.toString() }; });
                            })
                            .catch(error => {
                                promiseErrorLog(error);
                                alert(t('key_416'));
                            });
                    }
                    else {
                        httpErrorLog(wsSucc);

                        if (wsSucc.status === httpStatus.NOT_FOUND) {
                            alert('A embalagem não existe.');
                        }
                        else if (wsSucc.status === httpStatus.FORBIDDEN) {
                            alert(t('key_871'));
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
                    setLoadingBox(false);

                    if (!reqSuccess) {
                        setBox(null);
                        InputTools.resetValues(boxForm, setBoxForm);

                        cleanBoxCode();
                    }
                });
        }
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    function saveBoxFunc() {
        let reqSuccess = false;

        setLoadingBox(true);

        fetch(NODE_SERVER + 'Warehouse/Boxes', {
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
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    reqSuccess = true;

                    setBox(null);
                    InputTools.resetValues(boxForm, setBoxForm);
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
                setLoadingBox(false);

                if (reqSuccess) {
                    cleanBoxCode();
                }
            });
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({ languageCode: globalState.authUser.Language.Code }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setBins(data);
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
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getBox(); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>Box</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...boxCode} isDisabled={loadingBox} set={setBoxCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={loadingBox} onClick={event => cleanBoxCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loadingBox} onClick={event => getBox()}>
                                        <span className='famo-text-12'>{t('key_323')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loadingBox || box) &&
                <section className='famo-wrapper'>
                    <Title text='Box' />
                    <div className='famo-content'>
                        <ContentLoader hide={!loadingBox} />
                        {box &&
                            <React.Fragment>
                                <form className={'famo-grid famo-form-grid ' + (loadingBox ? 'hide' : '')} noValidate >
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
                                            <span className='famo-text-11'>{plannedShipmentDate.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...plannedShipmentDate} />
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>{binID.label}</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <Input {...binID} set={setBinID}>
                                                {bins.map((x, i) => {
                                                    return <option key={i} value={x.ID}>{x.Code}</option>
                                                })}
                                            </Input>
                                        </div>
                                    </div>
                                </form>
                                <div className={'famo-grid famo-buttons ' + (loadingBox ? 'hide' : '')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-right'>
                                            <button type='button' className='famo-button famo-confirm-button' onClick={event => saveBoxFunc()}>
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
            label: 'Box',
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            isNumber: false,
            value: '',
            autoFocus: true,
            isDisabled: false
        }),
        [loadingBox, setLoadingBox] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null);

    function getBox() {
        if (box?.Code !== boxCode.value) {
            let reqSuccess = false;

            setLoadingBox(true);

            fetch(NODE_SERVER + 'Warehouse/Boxes' + createQueryString({ code: boxCode.value, languageCode: globalState.authUser.Language.Code }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(async wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        await wsSucc.json()
                            .then(data => {
                                reqSuccess = true;

                                setBox(data);
                            })
                            .catch(error => {
                                promiseErrorLog(error);
                                alert(t('key_416'));
                            });
                    }
                    else {
                        httpErrorLog(wsSucc);

                        if (wsSucc.status === httpStatus.NOT_FOUND) {
                            alert('A embalagem não existe.');
                        }
                        else if (wsSucc.status === httpStatus.FORBIDDEN) {
                            alert(t('key_871'));
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
                    setLoadingBox(false);

                    if (!reqSuccess) {
                        setBox(null);
                        cleanBoxCode();
                    }
                });
        }
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
    }

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getBox(); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>Box</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...boxCode} isDisabled={loadingBox} set={setBoxCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={loadingBox} onClick={event => cleanBoxCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loadingBox} onClick={event => getBox()}>
                                        <span className='famo-text-12'>{t('key_323')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loadingBox || box) &&
                <section className='famo-wrapper'>
                    <Title text='Box' />
                    <div className='famo-content'>
                        <ContentLoader hide={!loadingBox} />
                        {box &&
                            <React.Fragment>
                                <form className={'famo-grid famo-form-grid ' + (loadingBox ? 'hide' : '')} noValidate >
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
                                                <span className='famo-text-10'>{moment(box.PlannedShipmentDate).format('L')}</span>
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
                                </form>
                            </React.Fragment>
                        }
                    </div>
                </section>
            }
        </React.Fragment>);
}

function DeleteBox(props: any) {
    return (
        <h1>Eliminar</h1>
    );
}

export default withRouter(Warehouse);