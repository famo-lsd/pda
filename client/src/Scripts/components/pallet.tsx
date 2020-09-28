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

interface Box {
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
        [shipmentLoad, setShipmentLoad] = useState<boolean>(false),
        [pallets, setPallets] = useState<Array<any>>(null),
        palletsHeader: Array<string> = [t('key_279')];

    function barcodeScanner() {
        barcodeScan((result) => {
            setShipmentCode(prevState => { return { ...prevState, value: result.text } });
            getShipment(result.text);
        }, t);
    }

    function cleanShipmentCode() {
        setShipmentCode(prevState => { return { ...prevState, value: '' } });
        shipmentCode.ref.current.focus();
    }

    function getShipment(code: string) {
        setShipmentLoad(true);
        setPallets(null);

        fetch(NODE_SERVER + 'ERP/Pallets' + createQueryString({
            shipmentCode: code
        }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    wsSucc.json()
                        .then(data => {
                            setShipmentCode(prevState => { return { ...prevState, valueSubmitted: code } });
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
            });
    }

    function editPallet(palletID?: number) {
        window.sessionStorage.setItem(SS_PALLET_KEY, JSON.stringify({ shipmentCode: shipmentCode.valueSubmitted }));
        history.push('/Pallet/Edit?shipmentCode=' + shipmentCode.valueSubmitted + (palletID ? '&palletID=' + palletID : ''));
    }

    useEffect(() => {
        if (hasSessionStorageItem) {
            getShipment(shipmentCode.value);
        }

        SessionStorage.clear();
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid' noValidate onSubmit={event => { event.preventDefault(); getShipment(shipmentCode.value); }}>
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
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={shipmentLoad} onClick={event => cleanShipmentCode()}>
                                        <span className='famo-text-12'>{t('key_829')}</span>
                                    </button>
                                }
                                {globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={shipmentLoad} onClick={event => barcodeScanner()}>
                                        <span className='famo-text-12'>{t('key_681')}</span>
                                    </button>
                                }
                                <button type='button' className='famo-button famo-normal-button' disabled={shipmentLoad} onClick={event => getShipment(shipmentCode.value)}>
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
                        <div className={'famo-grid famo-content-grid pallets' + (shipmentLoad ? ' hide' : '')}>
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
                            <button type='button' className='famo-button famo-normal-button' disabled={shipmentLoad} onClick={event => editPallet()}>
                                <span className='famo-text-12'>{t('key_817')}</span>
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
        [palletID, setPalletID] = useState<any>(query.palletID),
        boxesHeader: Array<string> = [t('key_87'), t('key_179'), ''],
        [isPalletOpen, setIsPalletOpen] = useState<boolean>(true),
        [isShipped, setIsShipped] = useState<boolean>(false),
        [boxes, setBoxes] = useState<Array<Box>>([]),
        [boxLoad, setBoxLoad] = useState<boolean>(false),
        [palletSave, setPalletSave] = useState<boolean>(false),
        [palletStatusChange, setPalletStatusChange] = useState<boolean>(false),
        [palletBoxModal, setPalletBoxModal] = useState<boolean>(false);

    function barcodeScanner() {
        barcodeScan((result) => {
            addBox(result.text);
        }, t);
    }

    function addBox(code: string) {
        if (boxes.some(x => { return x.Code === code; })) {
            alert(t('key_814'));
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
                .then(wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        wsSucc.json()
                            .then(data => {
                                // Add property isNew.
                                (data as Box).isNew = true;
                                setBoxes([...boxes, data]);
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
                    setBoxLoad(false);
                });
        }
    }

    function deleteBox(code: string) {
        if (window.confirm('Tem a certeza que pretende eliminar a embalagem?')) {
            setBoxes(boxes.filter(x => { return x.Code !== code; }));
        }
    }

    function savePallet() {
        setPalletSave(true);

        fetch(NODE_SERVER + 'ERP/Pallets/Boxes' + createQueryString({
            shipmentCode: query.shipmentCode,
            palletID: !palletID ? -1 : palletID
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
                    wsSucc.json()
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
                .then(wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        wsSucc.json()
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

                        if (wsSucc.status === httpStatus.NOT_FOUND) {
                            history.replace('/Pallet');
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
                    globalActions.setLoadPage(false);
                });
        }

        SessionStorage.clear({ pallet: true });
    }, []);

    if (!query.shipmentCode) {
        return <Redirect to='/Pallet' />;
    }
    else {
        return (
            <React.Fragment>
                <section className='famo-wrapper'>
                    <Title text={t('key_820')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!palletSave} />
                        <div className={'famo-grid famo-content-grid pallet-boxes' + (palletSave ? ' hide' : '')}>
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
                            <div className={'famo-grid famo-buttons' + (palletSave ? ' hide' : '')}>
                                <div className='famo-row'>
                                    <div className='famo-cell text-right'>
                                        <button type='button' className='famo-button famo-normal-button' disabled={boxLoad || palletStatusChange} onClick={event => setPalletBoxModal(true)}>
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
                {!isShipped && boxes.length > 0 &&
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
                                                <span className={'fas fa-spinner fa-spin' + (!palletStatusChange ? ' hide' : '')}></span>
                                                <span className={'famo-text-12' + (palletStatusChange ? ' hide' : '')}>{t('key_200')}</span>
                                            </button>
                                        </React.Fragment>
                                    )
                                        : (
                                            <button type='button' className='famo-button famo-confirm-button famo-loader-button' disabled={boxLoad || palletSave || palletStatusChange} onClick={event => setPalletStatus()}>
                                                <span className={'fas fa-spinner fa-spin' + (!palletStatusChange ? ' hide' : '')}></span>
                                                <span className={'famo-text-12' + (palletStatusChange ? ' hide' : '')}>{t('key_827')}</span>
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </section>
                }
                <Modal contentType={ModalContentType.palletBox} visible={palletBoxModal} setVisible={setPalletBoxModal} confirm={addBox} />
            </React.Fragment>
        );
    }
}

export default withRouter(Pallet);