import httpStatus from 'http-status';
import Input, { InputConfig } from './elements/input';
import Modal, { ModalContentType } from './elements/modal';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { barcodeScan } from '../utils/barcode';
import { createQueryString } from '../utils/general';
import { ContentLoader } from './elements/loader';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { SessionStorage, SS_PALLET_KEY } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';

interface PalletBox {
    Code: string;
    OrderCode: string;
    isNew: boolean;
}

function Pallet() {
    return (
        <Switch>
            <Route exact path='/Pallet' render={(props) => { return <Index {...props} />; }} />
            <Route exact path='/Pallet/Edit' render={props => { return <Edit {...props} />; }} />
            <Route path='/Pallet/*' render={() => { return <Redirect to='/Pallet' />; }} />
        </Switch>
    );
}

function Index(props: any) {
    const { t } = useTranslation(),
        { history } = props,
        [globalState,] = useGlobal(),
        hasSessionStorageItem = window.sessionStorage.getItem(SS_PALLET_KEY),
        [cargoMapCode, setCargoMapCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: false,
            isNumber: false,
            label: 'Mapa de carga',
            name: 'cargoMapCode',
            value: hasSessionStorageItem ? JSON.parse(window.sessionStorage.getItem(SS_PALLET_KEY)).cargoMapCode : ''
        }),
        [loadCargoMap, setLoadCargoMap] = useState<boolean>(false),
        [pallets, setPallets] = useState<Array<any>>(null),
        palletsHeader: Array<string> = [t('key_279')];

    function barcodeScanner() {
        barcodeScan((result) => {
            setCargoMapCode(prevState => { return { ...prevState, value: result.text } });
            getCargoMap(result.text);
        }, t);
    }

    function getCargoMap(code: string) {
        setLoadCargoMap(true);
        setPallets(null);

        fetch(NODE_SERVER + 'ERP/Pallets' + createQueryString({
            cargoMapCode: code
        }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    wsSucc.json()
                        .then(data => {
                            setCargoMapCode(prevState => { return { ...prevState, valueSubmit: code } });
                            setPallets(data);
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    httpErrorLog(wsSucc);
                    alert('O código não corresponde a um mapa de carga.');
                }
            })
            .catch(wsErr => {
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                setLoadCargoMap(false);
            });
    }

    function editPallet(palletID?: number) {
        window.sessionStorage.setItem(SS_PALLET_KEY, JSON.stringify({ cargoMapCode: cargoMapCode.valueSubmit }));
        history.push('/Pallet/Edit?cargoMapCode=' + cargoMapCode.valueSubmit + (palletID ? '&palletID=' + palletID : ''));
    }

    useEffect(() => {
        if (hasSessionStorageItem) {
            getCargoMap(cargoMapCode.value);
        }

        SessionStorage.clear();
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid' noValidate onSubmit={event => { event.preventDefault(); getCargoMap(cargoMapCode.value); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{cargoMapCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...cargoMapCode} set={setCargoMapCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                {globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loadCargoMap} onClick={event => barcodeScanner()}>
                                        <span className='famo-text-12'>{t('key_681')}</span>
                                    </button>
                                }
                                <button type='button' className='famo-button famo-normal-button' disabled={loadCargoMap} onClick={event => getCargoMap(cargoMapCode.value)}>
                                    <span className='famo-text-12'>{t('key_323')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(pallets || loadCargoMap) &&
                <section className='famo-wrapper'>
                    <Title text='Paletes' />
                    <div className='famo-content'>
                        <ContentLoader hide={!loadCargoMap} />
                        <div className={'famo-grid famo-content-grid pallets' + (loadCargoMap ? ' hide' : '')}>
                            <div className='famo-row famo-header-row'>
                                {palletsHeader.map((x, i) => {
                                    return (
                                        <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                            <span className='famo-text-11'>{x}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {pallets && pallets.map((x, i) => {
                                return (
                                    <div key={i} className='famo-row famo-body-row' onClick={event => editPallet(x.ID)}>
                                        <div className='famo-cell famo-col-1'>
                                            <span className='famo-text-10'>{x.ID}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            }
            {pallets && <section className='famo-wrapper'>
                <div className='famo-grid'>
                    <div className='famo-row'>
                        <div className='famo-cell text-right'>
                            <button type='button' className='famo-button famo-normal-button' disabled={loadCargoMap} onClick={event => editPallet()}>
                                <span className='famo-text-12'>Criar palete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>}
        </React.Fragment >
    );
}

function Edit(props: any) {
    const { t } = useTranslation(),
        { location, history } = props,
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        editPallet = query['palletID'],
        [boxes, setBoxes] = useState<Array<PalletBox>>([]),
        [loadBox, setLoadBox] = useState<boolean>(false),
        [closePallet, setClosePallet] = useState<boolean>(false),
        [palletBoxModal, setPalletBoxModal] = useState<boolean>(false),
        boxesHeader: Array<string> = [t('key_87'), t('key_179'), ''];

    function barcodeScanner() {
        barcodeScan((result) => {
            getBox(result.text);
        }, t);
    }

    function getBox(code: string) {
        if (boxes.some(x => { return x.Code === code; })) {
            alert('A palete já tem uma embalagem com este código.');
        }
        else {
            setLoadBox(true);

            fetch(NODE_SERVER + 'ERP/Boxes' + createQueryString({
                code: code
            }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        wsSucc.json()
                            .then(data => {
                                // Add property isNew.
                                (data as PalletBox).isNew = true;
                                setBoxes([...boxes, data]);
                            })
                            .catch(error => {
                                promiseErrorLog(error);
                                alert(t('key_416'));
                            });
                    }
                    else {
                        httpErrorLog(wsSucc);
                        alert('O código não corresponde a uma embalagem.');
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

    function deleteBox(code: string) {
        setBoxes(boxes.filter(x => { return x.Code !== code; }));
    }

    function saveBoxes() {
        setClosePallet(true);

        fetch(NODE_SERVER + 'ERP/Pallets/Boxes' + createQueryString({
            cargoMapCode: query['cargoMapCode'],
            palletID: !query['palletID'] ? '' : query['palletID']
        }), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boxes.filter(x => { return x.isNew; }).map(x => { return x.Code; })),
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    history.goBack();
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
                setClosePallet(false);
            });
    }

    useEffect(() => {
        if (editPallet) {
            globalActions.setLoadPage(true);

            fetch(NODE_SERVER + 'ERP/Pallets/Boxes' + createQueryString({
                cargoMapCode: query.cargoMapCode,
                palletID: query.palletID
            }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        wsSucc.json()
                            .then(data => {
                                // Add property isNew.
                                (data as Array<PalletBox>).forEach(x => { x.isNew = false; });
                                setBoxes(data);
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
        }

        SessionStorage.clear({ pallet: true });
    }, []);

    if (!query['cargoMapCode']) {
        return <Redirect to='/Pallet' />;
    }
    else {
        return (
            <React.Fragment>
                <section className='famo-wrapper'>
                    <Title text='Embalagens' />
                    <div className='famo-content'>
                        <ContentLoader hide={!closePallet} />
                        <div className={'famo-grid famo-content-grid pallet-boxes' + (closePallet ? ' hide' : '')}>
                            <div className='famo-row famo-header-row'>
                                {boxesHeader.map((x, i) => {
                                    return (
                                        <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                            <span className='famo-text-11'>{x}</span>
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
                                            <span className='famo-text-10'>{x.OrderCode}</span>
                                        </div>
                                        <div className='famo-cell famo-col-3'>
                                            <span className='famo-text-10'>
                                                {x.isNew && <button type='button' className='famo-button famo-cancel-button button-delete-box' onClick={event => deleteBox(x.Code)}>
                                                    <span className='fas fa-trash-alt'></span>
                                                </button>}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={'famo-grid famo-buttons' + (closePallet ? ' hide' : '')}>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    <button type='button' className='famo-button famo-normal-button' disabled={loadBox} onClick={event => setPalletBoxModal(true)}>
                                        <span className='famo-text-12'>Adicionar embalagem (manual)</span>
                                    </button>
                                    {globalState.androidApp &&
                                        <button type='button' className='famo-button famo-normal-button' disabled={loadBox} onClick={event => barcodeScanner()}>
                                            <span className='famo-text-12'>Adicionar embalagem (leitor cód. barras)</span>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='famo-wrapper'>
                    <div className='famo-grid'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-confirm-button' disabled={loadBox || closePallet} onClick={event => saveBoxes()}>
                                    <span className='famo-text-12'>{t('key_220')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <Modal contentType={ModalContentType.palletBox} visible={palletBoxModal} setVisible={setPalletBoxModal} confirm={getBox} />
            </React.Fragment>
        );
    }
}

export default withRouter(Pallet);