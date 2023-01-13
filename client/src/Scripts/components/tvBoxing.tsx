import Http from '../utils/http';
import httpStatus from 'http-status';
import Log from '../utils/log';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Message, Pagination, TVToBoxOrder } from '../utils/interfaces';
import { createQueryString } from '../utils/general';
import { CSSTransition } from 'react-transition-group';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useInterval } from '@restart/hooks';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

function TVBoxing(props: any) {
    const { location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        numeral = window['numeral'],
        query = queryString.parse(location.search),
        machineCenters = query.machineCenters,
        [toBoxOrders, setToBoxOrders] = useState<Pagination<TVToBoxOrder>>(null),
        [weekOrders, setWeekOrders] = useState<Pagination<TVToBoxOrder>>(null),
        [isWeek, setIsWeek] = useState<boolean>(true),
        [isSearching, setIsSearching] = useState<boolean>(true),
        [orderFirst, setOrderFirst] = useState<boolean>(true),
        [toBoxOrdersHeight, settoBoxOrdersHeight] = useState<number>(-1),
        toBoxOrdersHeader: Array<string> = ['', t('key_85'), t('key_179'), t('key_907'), 'EMB.(S)', 'TOTAL'],
        [time, setTime] = useState(moment()),
        vicPieConfig = {
            standalone: false,
            cornerRadius: 10,
            innerRadius: 120,
            padAngle: 3,
            padding: { top: 25, bottom: 5 }
        },
        [messages, setMessages] = useState<Array<Message>>(null),
        [messageIndex, setMessageIndex] = useState<number>(0),
        dateFormat = 'L',
        timeFormat = 'LTS',
        unitFormat = '0,0';

    function getToBoxOrders(page: number) {
        setIsSearching(true);
        return fetch(NODE_SERVER + 'TV/TVToBoxOrders' + createQueryString({
            machineCenters: machineCenters,
            page: page
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setToBoxOrders(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        }).finally(() => {
            setIsSearching(false)
            setIsWeek(false);
        });
    }

    function getWeekOrders(page: number) {
        setIsSearching(true);
        return fetch(NODE_SERVER + 'TV/TVWeekOrders' + createQueryString({
            machineCenters: machineCenters,
            page: page
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setWeekOrders(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        }).finally(() => {
            setIsSearching(false)
            setIsWeek(true);
        });
    }

    //Funcao para a cor das letras. Para ja fica comentado. Nao se ve utilidade
    function getRowColor(toBoxOrder: TVToBoxOrder): string {
        const now = moment();

        let ret = '';

        if (toBoxOrder.Order.ExpectedShipmentDate) {
            if (moment(toBoxOrder.Order.ExpectedShipmentDate).subtract({ days: 1 }).isSame(now.startOf('date'))) {
                ret = 'famo-color-yellow';
            }
            else if (moment(toBoxOrder.Order.ExpectedShipmentDate).subtract({ days: 1 }).isBefore(now.startOf('date'))) {
                ret = 'famo-color-red';
            }
        }

        return ret;
    }

    function getMessages() {
        return fetch(NODE_SERVER + 'TV/Messages' + createQueryString({
            date: moment().format('YYYY-MM-DDTHH:mm:ss'),
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setMessages(data);
                    setMessageIndex(0);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_303'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        });
    }

    useInterval(() => {
        setOrderFirst(!orderFirst);
    }, 3600000);

    useInterval(() => {
        setTime(moment());
    }, 1000);

    useInterval(() => {
        if (!isSearching) {
            if (isWeek) {
                if (weekOrders != null) {
                    if (weekOrders.CurrentPage === weekOrders.PagesNumber || weekOrders.PagesNumber === 0) {
                        getToBoxOrders(1);
                    }
                    else {
                        getWeekOrders(weekOrders.CurrentPage + 1);
                    }
                }
            }
            else {
                if (toBoxOrders != null) {
                    if (toBoxOrders.CurrentPage === toBoxOrders.PagesNumber || toBoxOrders.PagesNumber === 0) {
                        getWeekOrders(1);
                        setIsWeek(true);
                    }
                    else {
                        getToBoxOrders(toBoxOrders.CurrentPage + 1);
                    }
                }
            }
        }
    }, 8000);

    useInterval(() => {
        getMessages();
    }, 1800000);

    useInterval(() => {
        if (messages && messages.length > 0) {
            setMessageIndex(messageIndex + 1 === messages.length ? 0 : messageIndex + 1);
        }
    }, 5000);

    useEffect(() => {
        globalActions.setLoadPage(true);

        settoBoxOrdersHeight(window.innerHeight - document.querySelector('.tv-footer').clientHeight
            - 30
            - 30
            - document.querySelector('.to-box-orders .famo-header-row').clientHeight);

        setIsWeek(false);
        setIsSearching(false);

        Promise.all([getToBoxOrders(1), getMessages()]).finally(() => {
            globalActions.setLoadPage(false);
        });
    }, []);

    return (
        <React.Fragment>
            <section className='container famo-wrapper'>
                <div className='row'>
                    <div className={'col-12 col-xl-2 ' + (orderFirst ? 'order-first' : 'order-last')}>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <div className='famo-grid tv-famo-logo'>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-center'>
                                            <img src={'http://www.famo-code.com/Content/Images/logo-famo-black.png'} alt='FAMO' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='famo-wrapper tv-dark-wrapper'>
                            <div className='famo-content'>
                                <div className='famo-grid rating-panel'>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-center'>
                                            <span className='famo-text-23'> {isWeek ? 'ENCOMENDAS EM FALTA' : 'PRONTO A EMBALAR'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <div className='famo-grid rating-panel'>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-center'>
                                            <span className='famo-text-23'>{time.format(dateFormat)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <div className='famo-grid rating-panel'>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-center'>
                                            <span className='famo-text-23'>{time.format(timeFormat)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className={'col-12 col-xl-10 ' + (!orderFirst ? 'order-first' : 'order-last')}>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <div className='famo-grid famo-content-grid to-box-orders'>
                                    <div className='famo-row famo-header-row'>
                                        {toBoxOrdersHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1) + (i > 3 ? ' text-center' : '')}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className='to-box-orders to-box-orders-data' style={{ maxHeight: (toBoxOrdersHeight === -1 ? 'auto' : toBoxOrdersHeight + 'px') }}>
                                    <div className='famo-grid famo-content-grid'>
                                        <div className='famo-row famo-header-row hide'></div>
                                        {!isWeek ?
                                            toBoxOrders && toBoxOrders.Data.map((x, i) => {
                                                return (
                                                    <div key={i} className={'famo-row famo-body-row'}>
                                                        <div className='famo-cell famo-col-1 text-center'>
                                                            <p>
                                                                <img src={'https://flagcdn.com/h40/' + x.Country.Code.toLowerCase() + '.png'} height='42' alt={x.Country.Code} onError={(event) => { (event.target as any).src = NODE_SERVER + 'Images/no-flag.png' }} />
                                                            </p>
                                                            <p>
                                                                <span className='tv-text-1'>{x.Country.Label}</span>
                                                            </p>
                                                        </div>
                                                        <div className='famo-cell famo-col-2'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{x.Order.CustomerName}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-3'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{x.Order.Code}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-4'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{!x.Order.ExpectedShipmentDate ? 'n/a' : moment(x.Order.ExpectedShipmentDate).format(dateFormat)}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-5 text-center'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{numeral(x.AllBinBoxesQuantity).format(unitFormat)}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-6 text-center'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{numeral(x.BoxesQuantity).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }) :
                                            weekOrders && weekOrders.Data.map((x, i) => {
                                                return (
                                                    <div key={i} className={'famo-row famo-body-row'}>
                                                        <div className='famo-cell famo-col-1 text-center'>
                                                            <p>
                                                                <img src={'https://flagcdn.com/h40/' + x.Country.Code.toLowerCase() + '.png'} height='42' alt={x.Country.Code} onError={(event) => { (event.target as any).src = NODE_SERVER + 'Images/no-flag.png' }} />
                                                            </p>
                                                            <p>
                                                                <span className='tv-text-1'>{x.Country.Label}</span>
                                                            </p>
                                                        </div>
                                                        <div className='famo-cell famo-col-2'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{x.Order.CustomerName}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-3'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{x.Order.Code}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-4'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{!x.Order.ExpectedShipmentDate ? 'n/a' : moment(x.Order.ExpectedShipmentDate).format(dateFormat)}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-5 text-center'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{numeral(x.AllBinBoxesQuantity).format(unitFormat)}</span>
                                                        </div>
                                                        <div className='famo-cell famo-col-6 text-center'>
                                                            <span className={'famo-text-10 ' + getRowColor(x)}>{numeral(x.BoxesQuantity).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                    {!isWeek ?
                                        toBoxOrders &&
                                        <div className='famo-grid famo-pagination'>
                                            <div className='famo-cell text-center'>
                                                {[...Array(toBoxOrders.PagesNumber)].map((x, i) => {
                                                    return (
                                                        <span key={i} className={((i + 1) > toBoxOrders.CurrentPage ? 'far' : 'fas') + ' fa-circle'}></span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        : weekOrders &&
                                        <div className='famo-grid famo-pagination'>
                                            <div className='famo-cell text-center'>
                                                {[...Array(weekOrders.PagesNumber)].map((x, i) => {
                                                    return (
                                                        <span key={i} className={((i + 1) > weekOrders.CurrentPage ? 'far' : 'fas') + ' fa-circle'}></span>
                                                    );
                                                })}
                                            </div>
                                        </div>}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
            <section className='tv-footer'>
                <div className='container tv-messages'>
                    <div className='row'>
                        <div className='col-12 col-xl-2'>
                            <div className='famo-grid tv-message-type'>
                                <div className='famo-row'>
                                    <div className='famo-cell'>
                                        {messages && messages.length > 0 &&
                                            <span className='tv-text-2'>{messages[messageIndex].Type.Label}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-xl-10'>
                            <div className='famo-grid tv-message-content'>
                                <div className='famo-row'>
                                    <div className='famo-cell'>
                                        {messages && messages.map((x, i) => {
                                            return (
                                                <CSSTransition key={i} in={i === messageIndex} timeout={250} classNames="transition">
                                                    <span className={'tv-text-3 ' + (i !== messageIndex ? 'hide' : '')}>{x.Text}</span>
                                                </CSSTransition>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}

export default withRouter(TVBoxing);