import httpStatus from 'http-status';
import Input, { InputConfig } from './elements/input';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
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
        [globalState, globalActions] = useGlobal(),
        [boxCode, setBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: 'Box',
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true,
            isNumber: false,
            isDisabled: false
        }),
        [loadBox, setLoadBox] = useState<boolean>(false),
        [box, setBox] = useState<BinBox>(null),
        [formMessage, setFormMessage] = useState<string>(''),
        [bins, setBins] = useState<Array<Bin>>([]);

    function getBox() {
        if(box?.Code !== boxCode.value)
        {
setLoadBox(true);

fetch(NODE_SERVER + 'Warehouse/Boxes' + createQueryString({ code: boxCode.value, languageCode: globalState.authUser.Language.Code }), {
    method: 'GET',
    credentials: 'include'
})
    .then(async wsSucc => {
        if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
            await wsSucc.json()
                .then(data => {
                    setBox(data);
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
        setLoadBox(false);
    });
        }
    }

    function cleanBoxCode() {
        setBoxCode(x => { return { ...x, value: '' }; });
        boxCode.ref.current.focus();
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
                <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getBox() }}>
                    <div className='famo-row'>
                        <div className='famo-cell famo-input-label'>
                            <span className='famo-text-11'>Box</span>
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
                            <button type='button' className='famo-button famo-normal-button' disabled={loadBox} onClick={event => cleanBoxCode()}>
                                <span className='famo-text-12'>{t('key_829')}</span>
                            </button>
                            {!globalState.androidApp &&
                                <button type='button' className='famo-button famo-normal-button' disabled={loadBox} onClick={event => getBox()}>
                                    <span className='famo-text-12'>{t('key_815')}</span>
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {box &&
        <section className='famo-wrapper'>
        <div className='famo-content'>
            </div>
            <form className='famo-grid famo-form-grid' noValidate>
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
                                                        <span className='famo-text-10'>{box.CustomerName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            </form>
            </section>
}
            </React.Fragment>
    );
}

function TransferBox(props: any) {
    return (
        <h1>Transferir</h1>
    );
}

function DeleteBox(props: any) {
    return (
        <h1>Eliminar</h1>
    );
}

export default withRouter(Warehouse);