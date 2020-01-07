import httpStatus from 'http-status';
import Input, { InputConfig, InputTools } from './wrapper/input';
import Modal, { ModalContentType } from './modal';
import React, { useEffect, useState } from 'react';
import Title from './wrapper/title';
import { ContentLoader } from './loader';
import { createQueryString, loadScript } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

interface ItemJournal {
    Code: string;
    Name: string;
}

function Inventory({ t }) {
    const [globalState, globalActions] = useGlobal(),
        [inventoryCode, setInventoryCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: false,
            isNumber: false,
            label: t('key_806'),
            name: 'inventoryCode',
            value: ''
        }),
        [inventories, setInventories] = useState<Array<ItemJournal>>([]),
        [productInputVisible, setProductInputVisible] = useState(false),
        [loadProduct, setLoadProduct] = useState<boolean>(false),
        [product, setProduct] = useState(null),
        [productCode, setProductCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: true,
            isNumber: false,
            label: t('key_87'),
            name: 'productCode',
            value: ''
        }),
        [productVariantCode, setProductVariantCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: true,
            isNumber: false,
            label: t('key_464'),
            name: 'productVariantCode',
            value: ''
        }),
        [productDescription, setProductDescription] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: true,
            isNumber: false,
            label: t('key_138'),
            name: 'productDescription',
            value: ''
        }),
        [locationCode, setLocationCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: true,
            isNumber: false,
            label: t('key_751'),
            name: 'locationCode',
            value: ''
        }),
        [quantity, setQuantity] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: false,
            isNumber: true,
            label: t('key_347'),
            name: 'quantity',
            value: '',
            noData: false,
            wrongFormat: false,
            invalidValue: false,
            invalidMessage: t('key_13'),
            analyze: false,
            analyzeForm: false
        }),
        productForm: Array<InputConfig> = [productCode, productVariantCode, productDescription, locationCode, quantity],
        setProductForm: Array<any> = [setProductCode, setProductVariantCode, setProductDescription, setLocationCode, setQuantity],
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

        fetch(NODE_SERVER + 'ERP/Inventories/Products?inventoryCode=' + inventoryCode.value + '&productCode=' + productCode + '&productVariantCode=' + productVariantCode + '&timestamp=' + new Date().getTime(), {
            method: 'GET',
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    wsSucc.json()
                        .then(data => {
                            setProduct(data);
                            setProductCode(prevState => { return { ...prevState, value: data.ProductCode } });
                            setProductVariantCode(prevState => { return { ...prevState, value: data.ProductVariantCode } });
                            setProductDescription(prevState => { return { ...prevState, value: data.ProductDescription } });
                            setLocationCode(prevState => { return { ...prevState, value: data.LocationCode } });
                            setQuantity(prevState => { return { ...prevState, value: '' } });
                        })
                        .catch(error => {
                            resetInputs();
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    resetInputs();
                    httpErrorLog(wsSucc);
                    alert(t('key_809'));
                }
            })
            .catch(wsErr => {
                resetInputs();
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                setLoadProduct(false);
            });
    }

    function resetInputs() {
        setProduct(null);
        InputTools.resetValues(productForm, setProductForm);
    }

    // #region Events
    function handleRegister(event) {
        InputTools.analyze(productForm, setProductForm);
    }
    // #endregion

    useEffect(() => {
        globalActions.setLoadPage(true);

        // load scripts
        loadScript(process.env.REACT_APP_CODE_URL + 'Scripts/numeral/locales/pt-pt.js?version=27', sectionRef);
        loadScript(process.env.REACT_APP_CODE_URL + 'Scripts/numeral/locales/es-es.js?version=27', sectionRef);
        loadScript(process.env.REACT_APP_CODE_URL + 'Scripts/numeral/locales/fr.js?version=27', sectionRef);
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
        resetInputs();
    }, [inventoryCode]);

    useEffect(() => {
        if (InputTools.areAllAnalyzed(productForm)) {
            if (InputTools.areAllValid(productForm)) {
                setLoadProduct(true);

                fetch(NODE_SERVER + 'ERP/Inventories/Products' + createQueryString({
                    documentCode: product.Code,
                    productCode: product.ProductCode,
                    productVariantCode: product.ProductVariantCode,
                    locationCode: product.LocationCode,
                    quantity: InputTools.getValue(quantity)
                }), {
                    method: 'PATCH',
                    credentials: 'include'
                })
                    .then(wsSucc => {
                        if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                            resetInputs();
                            alert(t('key_805'));
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
                InputTools.popUpAlerts(productForm, t);
            }

            InputTools.resetValidations(productForm, setProductForm);
        }

    }, productForm);

    return (
        <React.Fragment>
            <section className='famo-wrapper' ref={sectionRef}>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid' noValidate onSubmit={event => event.preventDefault()}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{inventoryCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...inventoryCode} isDisabled={loadProduct} set={setInventoryCode}>
                                    <option key=''></option>
                                    {inventories.map((x, i) => {
                                        return <option key={i} value={x.Code}>{x.Name}</option>
                                    })}
                                </Input>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            {(product || loadProduct) &&
                <section className='famo-wrapper'>
                    <Title text={t('key_339')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!loadProduct} />
                        <form className={'famo-grid famo-form-grid' + (loadProduct ? ' hide' : '')} noValidate onSubmit={event => event.preventDefault()}>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{productCode.label}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...productCode} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{productVariantCode.label}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...productVariantCode} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{productDescription.label}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...productDescription} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{locationCode.label}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...locationCode} />
                                </div>
                            </div>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{quantity.label}</span>
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
                                        <span className='famo-text-12'>{t('key_810')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
            {inventoryCode && <section className='famo-wrapper'>
                <div className='famo-grid'>
                    <div className='famo-row'>
                        <div className='famo-cell text-right'>
                            <button type='button' className='famo-button famo-normal-button' disabled={loadProduct} onClick={event => setProductInputVisible(true)}>
                                <span className='famo-text-12'>{t('key_807')}</span>
                            </button>
                            {!globalState.androidApp ? null : (
                                <button type='button' className='famo-button famo-normal-button' disabled={loadProduct} onClick={event => barcodeScanner()}>
                                    <span className='famo-text-12'>{t('key_681')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>}
            <Modal contentType={ModalContentType.productInput} visible={productInputVisible} setVisible={setProductInputVisible} confirm={getProduct} />
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(Inventory));