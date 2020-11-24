import AudioEffect from '../utils/audio';
import httpStatus from 'http-status';
import Input, { InputConfig, InputTools, InputType } from './elements/input';
import Modal from './elements/modal';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { barcodeScan } from '../utils/barcode';
import { createQueryString } from '../utils/general';
import { ContentLoader } from './elements/loader';
import { logHttpError, logPromiseError } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { SessionStorage, SS_PALLET_KEY } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';

interface Box {
    Code: string;
    OrderCode: string;
    IsNew: boolean;
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
    const { history } = props,
        { t } = useTranslation(),
        [globalState,] = useGlobal(),
        sessionStorageItem = window.sessionStorage.getItem(SS_PALLET_KEY),
        [shipmentCode, setShipmentCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_822'),
            className: 'famo-input famo-text-10',
            name: 'shipmentCode',
            value: sessionStorageItem ? JSON.parse(window.sessionStorage.getItem(SS_PALLET_KEY)).shipmentCode : '',
            autoFocus: true
        }),
        [shipmentCodeSubmit, setShipmentCodeSubmit] = useState<string>(null),
        [loading, setLoading] = useState<boolean>(false),
        palletsHeader: Array<string> = [t('key_279')],
        [pallets, setPallets] = useState<Array<Pallet>>(null);

    function getPallets(shipmentCode: string) {
        setLoading(true);

        fetch(NODE_SERVER + 'ERP/Pallets' + createQueryString({
            shipmentCode: shipmentCode
        }), {
            method: 'GET',
            credentials: 'include'
        }).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setShipmentCodeSubmit(shipmentCode);
                    setPallets(data);
                    setLoading(false);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                logHttpError(error);
                alert(error.status === httpStatus.NOT_FOUND ? t('key_825') : t('key_303'));
            }
            else {
                logPromiseError(error);
                alert(t('key_416'));
            }

            setShipmentCodeSubmit(null);
            setPallets(null);
            setLoading(false);

            cleanShipmentCode();
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
        window.sessionStorage.setItem(SS_PALLET_KEY, JSON.stringify({ shipmentCode: shipmentCodeSubmit }));
        history.push('/Pallet/Edit?shipmentCode=' + shipmentCodeSubmit + (palletID ? '&palletID=' + palletID : ''));
    }

    useEffect(() => {
        if (sessionStorageItem) {
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
                                    <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => barcodeScanner()}>
                                        <span className='famo-text-12'>{t('key_681')}</span>
                                    </button>
                                }
                                <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => cleanShipmentCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => getPallets(shipmentCode.value)}>
                                    <span className='famo-text-12'>{t('key_323')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loading || pallets) &&
                <section className='famo-wrapper'>
                    <Title text={t('key_826')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!loading} />
                        <div className={'famo-grid famo-content-grid pallets ' + (loading ? 'hide' : '')}>
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
                        <div className={'famo-grid famo-buttons ' + (loading ? 'hide' : '')}>
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
    const { location, history } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        [palletID, setPalletID] = useState<any>(query.palletID),
        [isPalletOpen, setIsPalletOpen] = useState<boolean>(true),
        [isShipped, setIsShipped] = useState<boolean>(false),
        boxesHeader: Array<string> = [t('key_87'), t('key_179'), ''],
        [boxes, setBoxes] = useState<Array<Box>>([]),
        [loadingBox, setLoadingBox] = useState<boolean>(false),
        [savingPallet, setSavingPallet] = useState<boolean>(false),
        [palletStatusChange, setPalletStatusChange] = useState<boolean>(false),
        [boxModal, setBoxModal] = useState<boolean>(false),
        [modalBoxCode, setModalBoxCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: t('key_819'),
            className: 'famo-input famo-text-10',
            name: 'boxCode',
            value: '',
            autoFocus: true
        }),
        boxModalForm: Array<InputConfig> = [modalBoxCode],
        setBoxModalForm: Array<any> = [setModalBoxCode],
        [formMessage, setFormMessage] = useState<string>('');

    function formAlert(message: string) {
        if (globalState.androidApp) {
            alert(message);
        }
        else {
            setFormMessage(message);
            AudioEffect.error();
        }
    }

    function addBox(code: string) {
        if (boxes.some(x => { return x.Code === code; })) {
            InputTools.resetValues(boxModalForm, setBoxModalForm);
            modalBoxCode.ref.current.focus();

            formAlert(t('key_814'));
        }
        else {
            setLoadingBox(true);

            fetch(NODE_SERVER + 'ERP/Shipments/Boxes' + createQueryString({
                shipmentCode: query.shipmentCode,
                boxCode: code
            }), {
                method: 'GET',
                credentials: 'include'
            }).then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json().then(data => {
                        setFormMessage('');

                        // Add property IsNew.
                        (data as Box).IsNew = true;
                        setBoxes([...boxes, data]);
                    });
                }
                else {
                    throw result;
                }
            }).catch(async error => {
                if (error as Response) {
                    logHttpError(error);

                    if (error.status === httpStatus.NOT_FOUND) {
                        formAlert(t('key_872'));
                    }
                    else if (error.status === httpStatus.FORBIDDEN) {
                        await error.json().then(data => {
                            if (data.reason === 'box') {
                                formAlert(t('key_871'));
                            }
                            else if (data.reason === 'pallet') {
                                formAlert(t('key_828'));
                            }
                        }).catch(errorAux => {
                            logPromiseError(errorAux);
                            formAlert(t('key_416'));
                        });
                    }
                    else {
                        formAlert(t('key_303'));
                    }
                }
                else {
                    logPromiseError(error);
                    formAlert(t('key_416'));
                }
            }).finally(() => {
                setLoadingBox(false);

                InputTools.resetValues(boxModalForm, setBoxModalForm);
                modalBoxCode.ref.current.focus();
            });
        }
    }

    function barcodeScanner() {
        barcodeScan((result) => {
            setModalBoxCode(x => { return { ...x, value: result.text }; });
            addBox(result.text);
        }, t);
    }

    function deleteBox(code: string) {
        if (window.confirm(t('key_880'))) {
            setBoxes(boxes.filter(x => { return x.Code !== code; }));
        }
    }

    function savePalletFunc() {
        setSavingPallet(true);

        fetch(NODE_SERVER + 'ERP/Pallets' + createQueryString({
            shipmentCode: query.shipmentCode,
            palletID: !palletID ? null : palletID
        }), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boxes.filter(x => { return x.IsNew; }).map(x => { return x.Code; })),
            credentials: 'include'
        }).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setPalletID(data.palletID);
                });

                setBoxes(boxes.map(x => { return { ...x, IsNew: false }; }));
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                logHttpError(error);
                alert(t('key_302'));
            }
            else {
                logPromiseError(error);
                alert(t('key_416'));
            }
        }).finally(() => {
            setSavingPallet(false);
        });
    }

    function setPalletStatus() {
        if (isPalletOpen && boxes.some(x => { return x.IsNew })) {
            alert(t('key_821'));
        }
        else {
            setPalletStatusChange(true);

            fetch(NODE_SERVER + 'ERP/Pallets/' + (isPalletOpen ? 'Close' : 'Reopen') + createQueryString(isPalletOpen ? {
                shipmentCode: query.shipmentCode,
                palletID: palletID
            } : { palletID: palletID }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(boxes.map(x => { return x.Code; })),
                credentials: 'include'
            }).then(result => {
                if (result.ok && result.status === httpStatus.OK) {
                    setIsPalletOpen(!isPalletOpen);
                    alert(isPalletOpen ? t('key_812') : t('key_813'));
                }
                else {
                    throw result;
                }
            }).catch(error => {
                if (error as Response) {
                    logHttpError(error);
                    alert(t('key_302'));
                }
                else {
                    logPromiseError(error);
                    alert(t('key_416'));
                }
            }).finally(() => {
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
            }).then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json().then(data => {
                        // Check if pallet has some shipped boxes.
                        setIsShipped(data.some(x => { return x.IsShipped }));

                        // Check if pallet is open.
                        setIsPalletOpen(data.some(x => { return x.IsPalletOpen }));

                        // Add property IsNew.
                        (data as Array<Box>).forEach(x => { x.IsNew = false; });
                        setBoxes(data);
                    });
                }
                else {
                    throw result;
                }
            }).catch(error => {
                if (error as Response) {
                    logHttpError(error);

                    alert(error.status === httpStatus.NOT_FOUND ? t('key_873') : t('key_303'));
                    history.replace('/Pallet');
                }
                else {
                    logPromiseError(error);
                    alert(t('key_416'));
                }
            }).finally(() => {
                globalActions.setLoadPage(false);
            });
        }

        SessionStorage.clear({ pallet: true });
    }, []);

    useEffect(() => {
        if (InputTools.areAnalyzed(boxModalForm)) {
            if (InputTools.areValid(boxModalForm)) {
                addBox(modalBoxCode.value);
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
                    <Title text={t('key_820')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!savingPallet} />
                        <div className={'famo-grid famo-content-grid pallet-boxes ' + (savingPallet ? 'hide' : '')}>
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
                                                {x.IsNew && <button type='button' className='famo-button famo-cancel-button' onClick={event => deleteBox(x.Code)}>
                                                    <span className='fas fa-trash-alt'></span>
                                                </button>}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {!isShipped && isPalletOpen &&
                            <div className={'famo-grid famo-buttons ' + (savingPallet ? 'hide' : '')}>
                                <div className='famo-row'>
                                    <div className='famo-cell text-right'>
                                        <button type='button' className='famo-button famo-normal-button' disabled={loadingBox || palletStatusChange} onClick={event => setBoxModal(true)}>
                                            <span className='famo-text-12'>{t('key_815') + ' (' + t('key_807').toLowerCase() + ')'}</span>
                                        </button>
                                        {globalState.androidApp &&
                                            <button type='button' className='famo-button famo-normal-button' disabled={loadingBox || palletStatusChange} onClick={event => barcodeScanner()}>
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
                                    {isPalletOpen &&
                                        <React.Fragment>
                                            {boxes.some(x => { return x.IsNew; }) &&
                                                <button type='button' className='famo-button famo-normal-button' disabled={loadingBox || savingPallet || palletStatusChange} onClick={event => savePalletFunc()}>
                                                    <span className='famo-text-12'>{t('key_220')}</span>
                                                </button>
                                            }
                                        </React.Fragment>
                                    }
                                    {palletID &&
                                        <button type='button' className='famo-button famo-confirm-button famo-loader-button' disabled={loadingBox || savingPallet || palletStatusChange} onClick={event => setPalletStatus()}>
                                            <span className={'fas fa-spinner fa-spin ' + (!palletStatusChange ? ' hide' : '')}></span>
                                            <span className={'famo-text-12 ' + (palletStatusChange ? 'hide' : '')}>{isPalletOpen ? t('key_200') : t('key_827')}</span>
                                        </button>
                                    }
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