import httpStatus from 'http-status';
import React, { useEffect, useState } from 'react';
import { useGlobal } from '../utils/globalHooks';
import { NODE_SERVER } from '../utils/variablesRepo';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

interface ItemJournal {
    Code: string;
    Name: string;
}

function Inventory(props: any) {
    const { t } = props,
        [product, setProduct] = useState(),
        [inventories, setInventories] = useState<Array<ItemJournal>>([]),
        [globalState, globalActions] = useGlobal(),
        action = 'javascript:void(0)';

    function barcodeScanner() {
        (window as any).cordova.plugins.barcodeScanner.scan(
            (result) => {
                if(!result.cancelled) {
                    fetch(NODE_SERVER + 'ERP/Products?productCode=' + result.text + '&timestamp=' + new Date().getTime(), {
                        method: 'GET',
                        credentials: 'include'
                    }).then((wsRes) => {
                        if (wsRes.ok && wsRes.status === httpStatus.OK) {
                            wsRes.json().then((data) => {
                                setProduct(data);
                            }).catch(() => {
                                alert(t('O código de barras não corresponde a um produto.'));
                            });
                        }
                        else {
                            alert(t('O código de barras não corresponde a um produto.'));
                        }
                    }).catch(() => {
                        alert(t('key_416'));
                    });
                }
            },
            (error) => {
                alert(t('key_686'));
            },
            {
                preferFrontCamera: false,
                showFlipCameraButton: false,
                showTorchButton: true,
                torchOn: false,
                saveHistory: false,
                prompt: '',
                resultDisplayDuration: 0,
                formats: 'QR_CODE,CODE_39',
                orientation: 'unset',
                disableAnimations: true,
                disableSuccessBeep: false,
                continuousMode: false
            }
        );
    }

    function handleInventoryCode(event) {
        barcodeScanner();
    }

    function handleBarcodeScannerButton(event) {
        barcodeScanner();
    }

    useEffect(() => {
        if (globalState.authUser) {
            fetch(NODE_SERVER + 'ERP/Inventories?timestamp=' + new Date().getTime(), {
                method: 'GET',
                credentials: 'include'
            }).then((wsRes) => {
                if (wsRes.ok && wsRes.status === httpStatus.OK) {
                    wsRes.json().then((data) => {
                        setInventories(data);
                        globalActions.setLoadPage(false);
                    }).catch(() => {
                        alert(t('key_303'));
                    });
                }
                else {
                    alert(t('key_303'));
                }
            }).catch(() => {
                alert(t('key_416'));
            });
        }
    }, [globalState.authUser]);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form action={action} className='famo-grid famo-form-grid' noValidate>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>Inventário</span>
                            </div>
                            <div className='famo-cell'>
                                <select className='famo-input famo-text-10' name='inventoryCode' onChange={handleInventoryCode}>
                                    <option key=''></option>
                                    {inventories.map((x) => {
                                        return <option key={x.Code}>{x.Name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            {product ? (
                <section className='famo-wrapper'>
                    <div className="famo-title">
                        <span className="famo-text-13">{t('key_339')}</span>
                    </div>
                    <div className='famo-content'>
                        <form action={action} className='famo-grid famo-form-grid' noValidate>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_87')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <input type="text" className="famo-input famo-text-10" name="code" disabled value={product.Code} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_138')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <input type="text" className="famo-input famo-text-10" name="description" disabled value={product.Description} />
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            ) : null}
            <section className="famo-wrapper">
                <div className="famo-grid">
                    <div className="famo-row">
                        <div className="famo-cell text-right">
                            <button type="button" className="famo-button famo-normal-button" onClick={handleBarcodeScannerButton}>
                                <span className="famo-text-12">{t('key_681')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(Inventory));