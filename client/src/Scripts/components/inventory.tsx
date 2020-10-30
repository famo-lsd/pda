import httpStatus from 'http-status';
import Input, { InputConfig, InputTools } from './elements/input';
import Modal from './elements/modal';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { barcodeScan } from '../utils/barcode';
import { ContentLoader } from './elements/loader';
import { createQueryString } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface ItemJournal {
    Code: string;
    Name: string;
}

interface ItemJournalLine {
    Code: string;
    ProductCode: string;
    ProductVariantCode: string;
    ProductDescription: string;
    LocationCode: string;
}

function Inventory(props: any) {
    const { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        [inventoryCode, setInventoryCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_806'),
            className: 'famo-input famo-text-10',
            name: 'inventoryCode',
            value: '',
            isNumber: false,
            isDisabled: false
        }),
        [inventories, setInventories] = useState<Array<ItemJournal>>([]),
        [productLoad, setProductLoad] = useState<boolean>(false),
        [product, setProduct] = useState<ItemJournalLine>(),
        [productCode, setProductCode] = useState<InputConfig>({
            label: t('key_87'),
            className: 'famo-input famo-text-10',
            name: 'productCode',
            value: '',
            isNumber: false,
            isDisabled: true
        }),
        [productVariantCode, setProductVariantCode] = useState<InputConfig>({
            label: t('key_464'),
            className: 'famo-input famo-text-10',
            name: 'productVariantCode',
            value: '',
            isNumber: false,
            isDisabled: true
        }),
        [productDescription, setProductDescription] = useState<InputConfig>({
            label: t('key_138'),
            className: 'famo-input famo-text-10',
            name: 'productDescription',
            value: '',
            isNumber: false,
            isDisabled: true
        }),
        [locationCode, setLocationCode] = useState<InputConfig>({
            label: t('key_751'),
            className: 'famo-input famo-text-10',
            name: 'locationCode',
            value: '',
            isNumber: false,
            isDisabled: true
        }),
        [quantity, setQuantity] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_347'),
            className: 'famo-input famo-text-10',
            name: 'quantity',
            value: '',
            isNumber: true,
            isDisabled: false,
            analyze: false,
            localAnalyze: false,
            noData: false,
            wrongFormat: false,
            invalidValue: false,
            invalidMessage: t('key_13')
        }),
        productForm: Array<InputConfig> = [productCode, productVariantCode, productDescription, locationCode, quantity],
        setProductForm: Array<any> = [setProductCode, setProductVariantCode, setProductDescription, setLocationCode, setQuantity],
        sectionRef: React.RefObject<any> = React.createRef(),
        [productModal, setProductModal] = useState<boolean>(false),
        [modalProductCode, setModalProductCode] = useState<InputConfig>({
            ref: React.createRef(),
            label: t('key_87'),
            className: 'famo-input famo-text-10',
            name: 'productCode',
            value: '',
            isNumber: false,
            isDisabled: false,
            analyze: false,
            localAnalyze: false,
            noData: false
        }),
        productModalForm: Array<InputConfig> = [modalProductCode],
        setProductModalForm: Array<any> = [setModalProductCode];

    function resetProductForm() {
        InputTools.resetValues(productForm, setProductForm);
        setProduct(null);
    }

    function getProduct(code: string) {
        const split: Array<string> = code.split('/'),
            productCode = split[0];
        let productVariantCode = '';

        if (split.length > 1) {
            productVariantCode = split[1];
        }

        resetProductForm();
        setProductLoad(true);

        fetch(NODE_SERVER + 'ERP/Inventories/Products' + createQueryString({
            inventoryCode: inventoryCode.value,
            productCode: productCode,
            productVariantCode: productVariantCode
        }), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setProduct(data);
                            setProductCode(x => { return { ...x, value: data.ProductCode }; });
                            setProductVariantCode(x => { return { ...x, value: data.ProductVariantCode }; });
                            setProductDescription(x => { return { ...x, value: data.ProductDescription }; });
                            setLocationCode(x => { return { ...x, value: data.LocationCode }; });
                        })
                        .catch(error => {
                            promiseErrorLog(error);
                            alert(t('key_416'));
                        });
                }
                else {
                    httpErrorLog(wsSucc);
                    alert(wsSucc.status === httpStatus.NOT_FOUND ? t('key_809') : t('key_303'));
                }
            })
            .catch(wsErr => {
                promiseErrorLog(wsErr);
                alert(t('key_416'));
            })
            .finally(() => {
                setProductLoad(false);
            });
    }

    function barcodeScanner() {
        barcodeScan((result) => {
            getProduct(result.text);
        }, t);
    }

    function changeQuantity() {
        InputTools.analyze(productForm, setProductForm);
    }

    function submitProductModal() {
        InputTools.analyze(productModalForm, setProductModalForm);
    }

    function productModalCallback(visibility: boolean) {
        if (!visibility) {
            InputTools.resetValues(productModalForm, setProductModalForm);
        }
        else {
            modalProductCode.ref.current.focus();
        }
    }

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'ERP/Inventories' + createQueryString({}), {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            setInventories(data);
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

        SessionStorage.clear();
    }, []);

    useEffect(() => {
        resetProductForm();
    }, [inventoryCode]);

    useEffect(() => {
        if (InputTools.areAnalyzed(productForm)) {
            if (InputTools.areValid(productForm)) {
                setProductLoad(true);

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
                            resetProductForm();
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
                        setProductLoad(false);
                    });
            }
            else {
                InputTools.popUpAlerts(productForm, t);
            }

            InputTools.resetValidations(productForm, setProductForm);
        }
    }, productForm);

    useEffect(() => {
        if (InputTools.areAnalyzed(productModalForm)) {
            if (InputTools.areValid(productModalForm)) {
                getProduct(modalProductCode.value);
                setProductModal(false);
            }

            InputTools.resetValidations(productModalForm, setProductModalForm);
        }
    }, productModalForm);

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
                                <Input {...inventoryCode} isDisabled={productLoad} set={setInventoryCode}>
                                    <option key=''></option>
                                    {inventories.map((x, i) => {
                                        return <option key={i} value={x.Code}>{x.Name}</option>
                                    })}
                                </Input>
                            </div>
                        </div>
                    </form>
                    {inventoryCode.value &&
                        <div className='famo-grid famo-buttons'>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    <button type='button' className='famo-button famo-normal-button' disabled={productLoad} onClick={event => setProductModal(true)}>
                                        <span className='famo-text-12'>{t('key_807')}</span>
                                    </button>
                                    {globalState.androidApp &&
                                        <button type='button' className='famo-button famo-normal-button' disabled={productLoad} onClick={event => barcodeScanner()}>
                                            <span className='famo-text-12'>{t('key_681')}</span>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </section>
            {(product || productLoad) &&
                <section className='famo-wrapper'>
                    <Title text={t('key_339')} />
                    <div className='famo-content'>
                        <ContentLoader hide={!productLoad} />
                        <form className={'famo-grid famo-form-grid ' + (productLoad ? 'hide' : '')} noValidate onSubmit={event => event.preventDefault()}>
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
                        <div className={'famo-grid famo-buttons ' + (productLoad ? 'hide' : '')}>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    <button type='button' className='famo-button famo-confirm-button' onClick={event => changeQuantity()}>
                                        <span className='famo-text-12'>{t('key_810')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
            <Modal visible={productModal} setVisible={setProductModal} visibleCallback={productModalCallback}>
                <section className='famo-wrapper'>
                    <div className='famo-content'>
                        <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); submitProductModal(); }}>
                            <div className='famo-row'>
                                <div className='famo-cell famo-input-label'>
                                    <span className='famo-text-11'>{modalProductCode.label}</span>
                                </div>
                                <div className='famo-cell'>
                                    <Input {...modalProductCode} set={setModalProductCode} />
                                </div>
                            </div>
                            <input type='submit' className='hide' value='' />
                        </form>
                        <div className='famo-grid famo-buttons'>
                            <div className='famo-row'>
                                <div className='famo-cell text-right'>
                                    <button type='button' className='famo-button famo-confirm-button' onClick={event => submitProductModal()}>
                                        <span className='famo-text-12'>{t('key_701')}</span>
                                    </button>
                                    <button type="button" className="famo-button famo-cancel-button" onClick={event => setProductModal(false)}>
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

export default withRouter(Inventory);