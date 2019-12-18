import httpStatus from 'http-status';
import Modal, { ModalContentType } from './modal';
import React, { useEffect, useState } from 'react';
import { ContentLoader } from './loader';
import { createQueryString, loadScript } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { Input, getValue } from './input';
import { NODE_SERVER } from '../utils/variablesRepo';
import { setDecimalDelimiter, convertNumeralToJS } from '../utils/numeral';
import { useGlobal } from '../utils/globalHooks';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

interface ItemJournal {
    Code: string;
    Name: string;
}

function Inventory(props: any) {
    const { t } = props,
        [globalState, globalActions] = useGlobal(),
        [inventoryCode, setInventoryCode] = useState<string>(''),
        [inventories, setInventories] = useState<Array<ItemJournal>>([]),
        [productInputVisible, setProductInputVisible] = useState(false),
        [loadProduct, setLoadProduct] = useState<boolean>(false),
        [product, setProduct] = useState(null),
        [quantity, setQuantity] = useState({
            isNumber: true,
            className: 'famo-input famo-text-10',
            name: 'quantity',
            label: t('key_347'),
            value: '',
            invalidMessage: t('key_13'),
            noData: false,
            wrongFormat: false,
            invalidValue: false,
            validate: false,
            validateForm: false
        }),
        inputs: Array<any> = [quantity],
        setInputs: Array<any> = [setQuantity],
        sectionRef: React.RefObject<any> = React.createRef();

    function barcodeScanner() {
        (window as any).cordova.plugins.barcodeScanner.scan(
            result => {
                if (!result.cancelled) {
                    getProduct(result.text);
                }
            },
            error => {
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
                formats: 'CODE_39',
                orientation: 'unset',
                disableAnimations: true,
                disableSuccessBeep: false,
                continuousMode: false
            }
        );
    }

    function getProduct(code: string) {
        const split: Array<string> = code.split('/'),
            productCode = split[0];
        let productVariantCode = '';

        if (split.length > 1) {
            productVariantCode = split[1];
        }

        setLoadProduct(true);

        fetch(NODE_SERVER + 'ERP/Inventories/Products?inventoryCode=' + inventoryCode + '&productCode=' + productCode + '&productVariantCode=' + productVariantCode + '&timestamp=' + new Date().getTime(), {
            method: 'GET',
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    wsSucc.json()
                        .then(data => {
                            setProduct(data);
                            setInputs.forEach(x => {
                                x(prevState => { return { ...prevState, value: '' } });
                            });
                        })
                        .catch(error => {
                            setProduct(null);
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    setProduct(null);
                    httpErrorLog(wsSucc);
                    alert('O código não corresponde a um produto do inventário.');
                }
            })
            .catch(wsErr => {
                setProduct(null);
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                setLoadProduct(false);
            });
    }

    // #region Events
    function handleRegister(event) {
        setInputs.forEach(x => {
            x(prevState => { return { ...prevState, validate: true } });
        });
    }
    // #endregion

    useEffect(() => {
        globalActions.setLoadPage(true);

        // load scripts
        loadScript(process.env.REACT_APP_CODE_URL + '/Scripts/numeral/locales/pt-pt.js?version=26', sectionRef);
        loadScript(process.env.REACT_APP_CODE_URL + '/Scripts/numeral/locales/es-es.js?version=26', sectionRef);
        loadScript(process.env.REACT_APP_CODE_URL + '/Scripts/numeral/locales/fr.js?version=26', sectionRef);
    }, []);

    useEffect(() => {
        if (globalState.authUser) {
            fetch(NODE_SERVER + 'ERP/Inventories?timestamp=' + new Date().getTime(), {
                method: 'GET',
                credentials: 'include'
            })
                .then(wsSucc => {
                    if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                        wsSucc.json()
                            .then(data => {
                                setInventories(data);
                                globalActions.setLoadPage(false);
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
                });
        }
    }, [globalState.authUser]);

    useEffect(() => {
        if (inventoryCode === '') {
            setProduct(null);
        }
    }, [inventoryCode]);

    useEffect(() => {
        if (!inputs.some(x => { return !x.validateForm; })) {
            if (!inputs.some(x => { return x.noData || x.wrongFormat || x.invalidValue })) {
                setLoadProduct(true);

                fetch(NODE_SERVER + 'ERP/Inventories/Products' + createQueryString({
                    documentCode: product.Code,
                    productCode: product.ProductCode,
                    productVariantCode: product.ProductVariantCode,
                    locationCode: product.LocationCode,
                    quantity: getValue(quantity.value, true)
                }), {
                    method: 'PATCH',
                    credentials: 'include'
                })
                    .then(wsSucc => {
                        if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                            setProduct(null);
                            alert('A quantidade foi alterada com sucesso.');
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
                        setLoadProduct(false);
                    });
            }
            else {
                // alerts everywhere
            }

            setInputs.forEach(x => {
                x(prevState => { return { ...prevState, validate: false, validateForm: false } });
            });
        }

    }, inputs);

    return (
        <React.Fragment>
            <section className='famo-wrapper' ref={sectionRef}>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid' noValidate onSubmit={event => event.preventDefault()}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>Inventário</span>
                            </div>
                            <div className='famo-cell'>
                                <select className='famo-input famo-text-10' name='inventoryCode' disabled={loadProduct} onChange={event => setInventoryCode((event.target as HTMLSelectElement).value)}>
                                    <option key=''></option>
                                    {inventories.map((x, i) => {
                                        return <option key={i} value={x.Code}>{x.Name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            {!product && !loadProduct ? null : (
                <section className='famo-wrapper'>
                    <div className='famo-title'>
                        <span className='famo-text-13'>{t('key_339')}</span>
                    </div>
                    <div className='famo-content'>
                        <ContentLoader hide={!loadProduct} />
                        <form className={'famo-grid famo-form-grid' + (loadProduct ? ' hide' : '')} noValidate onSubmit={event => event.preventDefault()}>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_87')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <input type='text' className='famo-input famo-text-10' name='productCode' disabled value={product ? product.ProductCode : ''} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_464')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <input type='text' className='famo-input famo-text-10' name='productVariantCode' disabled value={product ? product.ProductVariantCode : ''} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_138')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <input type='text' className='famo-input famo-text-10' name='productDescription' disabled value={product ? product.ProductDescription : ''} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_751')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <input type='text' className='famo-input famo-text-10' name='locationCode' disabled value={product ? product.LocationCode : ''} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{t('key_347')}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...quantity} set={setQuantity} />
                                </div>
                            </div>
                        </form>
                        <div className={'famo-grid famo-buttons' + (loadProduct ? ' hide' : '')}>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    <button type='button' className='famo-button famo-confirm-button' onClick={handleRegister}>
                                        <span className='famo-text-12'>Registar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {inventoryCode ? (<section className='famo-wrapper'>
                <div className='famo-grid'>
                    <div className='famo-row'>
                        <div className='famo-cell text-right'>
                            <button type='button' className='famo-button famo-normal-button' disabled={loadProduct} onClick={event => setProductInputVisible(true)}>
                                <span className='famo-text-12'>Manual</span>
                            </button>
                            {!globalState.androidApp ? null : (
                                <button type='button' className='famo-button famo-normal-button' disabled={loadProduct} onClick={event => barcodeScanner()}>
                                    <span className='famo-text-12'>{t('key_681')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>) : null}
            <Modal contentType={ModalContentType.productInput} visible={productInputVisible} setVisible={setProductInputVisible} confirm={getProduct} />
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(Inventory));