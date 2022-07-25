import Http from '../utils/http';
import httpStatus from 'http-status';
import Input, { InputConfig, InputTools, InputType } from './elements/input';
import Log from '../utils/log';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import {TransferOrder} from '../utils/interfaces';
import { ContentLoader } from './elements/loader';
import { createQueryString } from '../utils/general';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';

function ReceiveOT(props: any) {
    return (<AddOT {...props} /> );
}

function AddOT(props: any) {
    const { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        [oTCode, setOTCode] = useState<InputConfig>({
            ref: React.createRef(),
            type: InputType.Text,
            label: 'Ordem Transferência',
            className: 'famo-input famo-text-10',
            name: 'oTCode',
            value: '',
            autoFocus: true
        }),
        [oT, setOT] = useState<TransferOrder>(null),
        [loading, setLoading] = useState<boolean>(false),
        [checkingOT, setCheckingOT] = useState<boolean>(false),
        saveButtonRef: React.RefObject<HTMLButtonElement> = React.createRef(),
        dateFormat = 'L';

    function getOT() {
        setLoading(true);
        console.log(oTCode);
        fetch(NODE_SERVER + 'ReceiveOT' + createQueryString({
            code: oTCode.value
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setOT(data);
                    setLoading(false);
                    cleanOTCode();
                });
            }
            else {
                throw result;
            }
        }).catch(async error => {
            if (error as Response) {
                Log.httpError(error);

                if (error.status === httpStatus.NOT_FOUND) {
                    alert('A ordem de transferência não foi encontrada');
                }
                else {
                    alert('Ocorreu um erro ao processar o pedido. Por favor, tente novamente.');
                }
            }
            else {
                Log.promiseError(error);
                alert('Ocorreu um erro ao processar o pedido. Por favor, tente novamente.');
            }
            
            setOT(null);
            setLoading(false);
            cleanOTCode();
        });
    }

    function cleanOTCode() {
        setOTCode(x => { return { ...x, value: '' }; });
        oTCode.ref.current.focus();
    }

    function SaveOT(oTCode) {
        setLoading(true);

        fetch(NODE_SERVER + 'ReceiveOT' + createQueryString({
            code: oTCode
        }), Http.addAuthorizationHeader({
            method: 'POST'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                setLoading(false);
                setOT(null);
                cleanOTCode();
            }
            else {
                throw result;
            }
        }).catch(async error => {
            if (error as Response) {
                Log.httpError(error);

                alert('Ocorreu um erro. Por favor, tente novamente.');
            }
            else {
                Log.promiseError(error);
                alert('Ocorreu um erro. Por favor, tente novamente.');
            }

            setLoading(false);
        });
    }

    useEffect(() => {
        if (!loading) {
            saveButtonRef.current?.focus();
        }
    }, [loading]);

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text='Receção OT'/>
                <div className='famo-content'>
                    <form className='famo-grid famo-form-grid famo-submit-form' noValidate onSubmit={event => { event.preventDefault(); getOT(); }}>
                        <div className='famo-row'>
                            <div className='famo-cell famo-input-label'>
                                <span className='famo-text-11'>{oTCode.label}</span>
                            </div>
                            <div className='famo-cell'>
                                <Input {...oTCode} isDisabled={loading} set={setOTCode} />
                            </div>
                        </div>
                        <input type='submit' className='hide' value='' />
                    </form>
                    <div className='famo-grid famo-buttons'>
                        <div className='famo-row'>
                            <div className='famo-cell text-right'>
                                <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => cleanOTCode()}>
                                    <span className='famo-text-12'>{t('key_829')}</span>
                                </button>
                                {!globalState.androidApp &&
                                    <button type='button' className='famo-button famo-normal-button' disabled={loading} onClick={event => getOT()}>
                                        <span className='famo-text-12'>{t('key_323')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(loading || oT) &&
                <section className='famo-wrapper'>
                    <div className='famo-content'>
                        <ContentLoader hide={!loading} />
                        {oT &&
                            <React.Fragment>
                                <form className={'famo-grid famo-form-grid ' + (loading ? 'hide' : '')} noValidate>
                                <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>Ord. Transf</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{oT.Code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>De</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{oT.From}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>Para</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{oT.To}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='famo-row'>
                                        <div className='famo-cell famo-input-label'>
                                            <span className='famo-text-11'>Transporte</span>
                                        </div>
                                        <div className='famo-cell'>
                                            <div className='famo-input'>
                                                <span className='famo-text-10'>{oT.Car}</span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className={'famo-grid famo-buttons ' + (loading ? 'hide' : '')}>
                                    <div className='famo-row'>
                                        <div className='famo-cell'>
                                            <button type='button' ref={saveButtonRef} className='famo-button famo-confirm-button' onClick={event => SaveOT(oT.Code)}>
                                                <span className='famo-text-12'>Rececionar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </section>
            }
        </React.Fragment>
    );
}

export default withRouter(ReceiveOT);