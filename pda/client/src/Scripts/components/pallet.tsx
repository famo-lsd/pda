import httpStatus from 'http-status';
import Input, { InputConfig } from './elements/input';
import Modal, { ModalContentType } from './elements/modal';
import React, { useEffect, useState } from 'react';
import { createQueryString } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

function Pallet(props: any) {
    const { t } = props,
        [globalState, globalActions] = useGlobal(),
        [cargoMapCode, setCargoMapCode] = useState<InputConfig>({
            className: 'famo-input famo-text-10',
            isDisabled: true,
            isNumber: false,
            label: 'Mapa de carga',
            name: 'cargoMapCode',
            value: ''
        }),
        [cargoMapModal, setCargoMapModal] = useState<boolean>(false),
        [loadCargoMap, setLoadCargoMap] = useState<boolean>(false);

    function barcodeScanner() {
        (window as any).cordova.plugins.barcodeScanner.scan(
            result => {
                if (!result.cancelled) {
                    getCargoMap(result.text);
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

    function getCargoMap(code: string) {
        setCargoMapCode(prevState => { return { ...prevState, value: code } });

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
                            alert('Sucesso!');
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
                // TO DO
            });
    }

    useEffect(() => {
        globalActions.setLoadPage(false);
    }, []);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid' noValidate onSubmit={event => event.preventDefault()}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{cargoMapCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...cargoMapCode} />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section className='famo-wrapper'>
                <div className='famo-grid'>
                    <div className='famo-row'>
                        <div className='famo-cell text-right'>
                            <button type='button' className='famo-button famo-normal-button' disabled={loadCargoMap} onClick={event => setCargoMapModal(true)}>
                                <span className='famo-text-12'>{t('key_807')}</span>
                            </button>
                            {!globalState.androidApp ? null : (
                                <button type='button' className='famo-button famo-normal-button' disabled={loadCargoMap} onClick={event => barcodeScanner()}>
                                    <span className='famo-text-12'>{t('key_681')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Modal contentType={ModalContentType.cargoMap} visible={cargoMapModal} setVisible={setCargoMapModal} confirm={getCargoMap} />
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(Pallet));