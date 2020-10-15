import AudioEffect from '../utils/audio';
import httpStatus from 'http-status';
import Input, { InputConfig, InputTools } from './elements/input';
import Modal from './elements/modal';
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

interface Box {
    Code: string;
    OrderCode: string;
    isNew: boolean;
}

interface Pallet {
    ID: number;
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
        [shipmentCode, setShipmentCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_822'),
            className: 'famo-input famo-text-10',
            name: 'shipmentCode',
            value: hasSessionStorageItem ? JSON.parse(window.sessionStorage.getItem(SS_PALLET_KEY)).shipmentCode : '',
            autoFocus: true,
            isNumber: false,
            isDisabled: false
        }),
        [shipmentCodeSubmitted, setShipmentCodeSubmitted] = useState<string>(),
        [shipmentLoad, setShipmentLoad] = useState<boolean>(false),
        palletsHeader: Array<string> = [t('key_279')],
        [pallets, setPallets] = useState<Array<Pallet>>(null);

    function getPallets(shipmentCode: string) {
        let reqSuccess = false;

        setShipmentLoad(true);

        fetch(NODE_SERVER + 'ERP/Pallets' + createQueryString({
            shipmentCode: shipmentCode
        }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            reqSuccess = true;

                            setShipmentCodeSubmitted(shipmentCode);
                            setPallets(data);
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    httpErrorLog(wsSucc);
                    alert(wsSucc.status === httpStatus.NOT_FOUND ? t('key_825') : t('key_303'));
                }
            })
            .catch(wsErr => {
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                setShipmentLoad(false);

                if (!reqSuccess) {
                    setPallets(null);
                }
            });
    }

    function barcodeScanner() {
        barcodeScan((result) => {
            setShipmentCode(x => { return { ...x, value: result.text }; });
            getPallets(result.text);
        }, t);
    }

    function cleanShipmentCode() {
        setShipmentCode(x => { return { ...x, value: '' }; });
        shipmentCode.ref.current.focus();
    }

    function editPallet(palletID?: number) {
        window.sessionStorage.setItem(SS_PALLET_KEY, JSON.stringify({ shipmentCode: shipmentCodeSubmitted }));
        history.push('/Pallet/Edit?shipmentCode=' + shipmentCodeSubmitted + (palletID ? '&palletID=' + palletID : ''));
    }

    useEffect(() => {
        if (hasSessionStorageItem) {
            getPallets(shipmentCode.value);
        }

        SessionStorage.clear();
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid' noValidate onSubmit={event => { event.preventDefault(); getPallets(shipmentCode.value); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{shipmentCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...shipmentCode} set={setShipmentCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                {globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={shipmentLoad} onClick={event => barcodeScanner()}>
                                        <span className='famo-text-12'>{t('key_681')}</span>
                                    </button>
                                }
                                <button type='button' className='famo-button famo-normal-button' disabled={shipmentLoad} onClick={event => cleanShipmentCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                <button type='button' className='famo-button famo-normal-button' disabled={shipmentLoad} onClick={event => getPallets(shipmentCode.value)}>
                                    <span className='famo-text-12'>{t('key_323')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(pallets || shipmentLoad) &&
                <section className='famo-wrapper'>
                    <Title text={t('key_826')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!shipmentLoad} />
                        <div className={'famo-grid famo-content-grid pallets ' + (shipmentLoad ? 'hide' : '')}>
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
                        <div className={'famo-grid famo-buttons ' + (shipmentLoad ? 'hide' : '')}>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    <button type='button' className='famo-button famo-normal-button' onClick={event => editPallet()}>
                                        <span className='famo-text-12'>{t('key_817')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </React.Fragment >
    );
}

function Edit(props: any) {
    const { t } = useTranslation(),
        { location, history } = props,
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        [palletID, setPalletID] = useState<any>(query.palletID),
        [isPalletOpen, setIsPalletOpen] = useState<boolean>(true),
        [isShipped, setIsShipped] = useState<boolean>(false),
        boxesHeader: Array<string> = [t('key_87'), t('key_179'), ''],
        [boxes, setBoxes] = useState<Array<Box>>([]),
        [boxLoad, setBoxLoad] = useState<boolean>(false),
        [palletSave, setPalletSave] = useState<boolean>(false),
        [palletStatusChange, setPalletStatusChange] = useState<boolean>(false),
        [boxModal, setBoxModal] = useState<boolean>(false),
        [modalBoxCode, setModalBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: 'Box',
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true,
            isNumber: false,
            isDisabled: false,
            analyze: false,
            localAnalyze: false,
            noData: false
        }),
        [formMessage, setFormMessage] = useState<string>(''),
        boxModalForm: Array<InputConfig> = [modalBoxCode],
        setBoxModalForm: Array<any> = [setModalBoxCode];

    function localAlert(message: string) {
        if (globalState.androidApp) {
            alert(message);
        }
        else {
            AudioEffect.error();
            setFormMessage(message);
        }
    }

    function addBox(code: string) {
        if (boxes.some(x => { return x.Code === code; })) {
            localAlert(t('key_814'));
        }
        else {
            setBoxLoad(true);

            fetch(NODE_SERVER + 'ERP/Shipments/Boxes' + createQueryString({
                shipmentCode: query.shipmentCode,
                boxCode: code
            }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(async wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        await wsSucc.json()
                            .then(data => {
                                setFormMessage('');

                                // Add property isNew.
                                (data as Box).isNew = true;
                                setBoxes([...boxes, data]);
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
                    setBoxLoad(false);
                });
        }
    }

    function barcodeScanner() {
        barcodeScan((result) => {
            addBox(result.text);
        }, t);
    }

    function deleteBox(code: string) {
        if (window.confirm(t('key_880'))) {
            setBoxes(boxes.filter(x => { return x.Code !== code; }));
        }
    }

    function savePallet() {
        setPalletSave(true);

        fetch(NODE_SERVER + 'ERP/Pallets/Boxes' + createQueryString({
            shipmentCode: query.shipmentCode,
            palletID: !palletID ? null : palletID
        }), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boxes.filter(x => { return x.isNew; }).map(x => { return x.Code; })),
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setPalletID(data.palletID);
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });

                    setBoxes(boxes.map(x => { return { ...x, isNew: false }; }));
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
                setPalletSave(false);
            });
    }

    function setPalletStatus() {
        if (isPalletOpen && boxes.some(x => { return x.isNew })) {
            alert(t('key_821'));
        }
        else {
            setPalletStatusChange(true);

            fetch(NODE_SERVER + 'ERP/Pallets/' + (isPalletOpen ? 'Close' : 'Reopen') + createQueryString(isPalletOpen ? {
                shipmentCode: query.shipmentCode,
                palletID: !palletID ? -1 : palletID
            } : { palletID: !palletID ? -1 : palletID }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(boxes.map(x => { return x.Code; })),
                credentials: 'include'
            })
                .then(wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        alert(isPalletOpen ? t('key_812') : t('key_813'));
                        setIsPalletOpen(!isPalletOpen);
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
                    setPalletStatusChange(false);
                });
        }
    }

    function submitBoxModal() {
        InputTools.analyze(boxModalForm, setBoxModalForm);
    }

    function boxModalCallback(visibility: boolean) {
        if (!visibility) {
            InputTools.resetValues(boxModalForm, setBoxModalForm);
            setFormMessage('');
        }
        else {
            modalBoxCode.ref.current.focus();
        }
    }

    useEffect(() => {
        if (query.palletID) {
            globalActions.setLoadPage(true);

            fetch(NODE_SERVER + 'ERP/Pallets/Boxes' + createQueryString({
                shipmentCode: query.shipmentCode,
                palletID: query.palletID
            }), {
                method: 'GET',
                credentials: 'include'
            })
                .then(async wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        await wsSucc.json()
                            .then(data => {
                                // Check if pallet has some shipped boxes.
                                setIsShipped(data.some(x => { return x.IsShipped }));

                                // Check if pallet is open.
                                setIsPalletOpen(data.some(x => { return x.IsPalletOpen }));

                                // Add property isNew.
                                (data as Array<Box>).forEach(x => { x.isNew = false; });
                                setBoxes(data);
                            })
                            .catch(error => {
                                promiseErrorLog(error);
                                alert(t('key_416'));
                            });
                    }
                    else {
                        httpErrorLog(wsSucc);

                        alert(wsSucc.status === httpStatus.NOT_FOUND ? t('key_873') : t('key_303'));
                        history.replace('/Pallet');
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

    useEffect(() => {
        if (InputTools.areAnalyzed(boxModalForm)) {
            if (InputTools.areValid(boxModalForm)) {
                addBox(modalBoxCode.value);
                InputTools.resetValues(boxModalForm, setBoxModalForm);
                modalBoxCode.ref.current.focus();
            }

            InputTools.resetValidations(boxModalForm, setBoxModalForm);
        }
    }, boxModalForm);

    if (!query.shipmentCode) {
        return <Redirect to='/Pallet' />;
    }
    else {
        return (
            <React.Fragment>
                <section className='famo-wrapper'>
                    <Title text={'Box\'s'} />
                    <div className='famo-content'>
                        <ContentLoader hide={!palletSave} />
                        <div className={'famo-grid famo-content-grid pallet-boxes ' + (palletSave ? 'hide' : '')}>
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
                        {!isShipped && isPalletOpen &&
                            <div className={'famo-grid famo-buttons ' + (palletSave ? 'hide' : '')}>
                                <div className='famo-row'>
                                    <div className='famo-cell text-right'>
                                        <button type='button' className='famo-button famo-normal-button' disabled={boxLoad || palletStatusChange} onClick={event => setBoxModal(true)}>
                                            <span className='famo-text-12'>{t('key_815') + ' (' + t('key_807').toLowerCase() + ')'}</span>
                                        </button>
                                        {globalState.androidApp &&
                                            <button type='button' className='famo-button famo-normal-button' disabled={boxLoad || palletStatusChange} onClick={event => barcodeScanner()}>
                                                <span className='famo-text-12'>{t('key_815') + ' (' + t('key_681').toLowerCase() + ')'}</span>
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </section>
                {boxes.length > 0 && !isShipped &&
                    <section className='famo-wrapper'>
                        <div className='famo-grid'>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    {isPalletOpen ? (
                                        <React.Fragment>
                                            {boxes.some(x => { return x.isNew; }) &&
                                                <button type='button' className='famo-button famo-normal-button' disabled={boxLoad || palletSave || palletStatusChange} onClick={event => savePallet()}>
                                                    <span className='famo-text-12'>{t('key_220')}</span>
                                                </button>
                                            }
                                            <button type='button' className='famo-button famo-confirm-button famo-loader-button' disabled={boxLoad || palletSave || palletStatusChange} onClick={event => setPalletStatus()}>
                                                <span className={'fas fa-spinner fa-spin ' + (!palletStatusChange ? 'hide' : '')}></span>
                                                <span className={'famo-text-12 ' + (palletStatusChange ? 'hide' : '')}>{t('key_200')}</span>
                                            </button>
                                        </React.Fragment>
                                    )
                                        : (
                                            <button type='button' className='famo-button famo-confirm-button famo-loader-button' disabled={boxLoad || palletSave || palletStatusChange} onClick={event => setPalletStatus()}>
                                                <span className={'fas fa-spinner fa-spin ' + (!palletStatusChange ? ' hide' : '')}></span>
                                                <span className={'famo-text-12 ' + (palletStatusChange ? 'hide' : '')}>{t('key_827')}</span>
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </section>
                }
                <Modal visible={boxModal} setVisible={setBoxModal} visibleCallback={boxModalCallback}>
                    <section className='famo-wrapper'>
                        <div className='famo-content'>
                            <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); submitBoxModal(); }}>
                                <div className='famo-row'>
                                    <div className='famo-cell famo-input-label'>
                                        <span className='famo-text-11'>{modalBoxCode.label}</span>
                                    </div>
                                    <div className='famo-cell'>
                                        <Input {...modalBoxCode} set={setModalBoxCode} />
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
                                        <button type='button' className='famo-button famo-confirm-button' onClick={event => submitBoxModal()}>
                                            <span className='famo-text-12'>{t('key_701')}</span>
                                        </button>
                                        <button type="button" className="famo-button famo-cancel-button" onClick={event => setBoxModal(false)}>
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
}

export default withRouter(Pallet);