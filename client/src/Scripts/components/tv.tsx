import Http from '../utils/http';
import httpStatus from 'http-status';
import Log from '../utils/log';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Bin, BinOrder, Message, Pagination } from '../utils/interfaces';
import { createQueryString } from '../utils/general';
import { CSSTransition } from 'react-transition-group';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useInterval } from '@restart/hooks';
import { useTranslation } from 'react-i18next';
import { VictoryPie } from 'victory';
import { withRouter } from 'react-router-dom';

function TV(props: any) {
    const { location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        numeral = window['numeral'],
        query = queryString.parse(location.search),
        binCodeQS = query.binCode,
        [lastBinCode, setLastBinCode] = useState<string>(),
        [orderFirst, setOrderFirst] = useState<boolean>(true),
        [bin, setBin] = useState<Bin>(),
        [binOrdersHeight, setBinOrdersHeight] = useState<number>(-1),
        binOrdersHeader: Array<string> = ['', t('key_85'), t('key_179'), t('key_907'), t('key_900'), t('key_896')],
        [binOrders, setBinOrders] = useState<Pagination<BinOrder>>(null),
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

    function getBin() {
        return fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({
            code: binCodeQS,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setLastBinCode(binCodeQS as string);
                    setBin(data);
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

    function getBinOrders(page: number) {
        return fetch(NODE_SERVER + 'Warehouse/Bins/Orders' + createQueryString({
            binCode: binCodeQS,
            languageCode: globalState.authUser.Language.Code,
            page: page
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBinOrders(data);
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

    function getRowColor(binOrder: BinOrder): string {
        const now = moment();

        let ret = '';

        if (binOrder.AllBinOrderBoxes === binOrder.OrderBoxes) {
            ret = 'famo-color-green';
        }
        else {
            if (binOrder.OrderExpectedShipmentDate && (moment(binOrder.OrderExpectedShipmentDate).subtract({ days: 1 }).isSame(now.startOf('date')) || moment(binOrder.OrderExpectedShipmentDate).isSame(now.startOf('date')))) {
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
        Promise.all([getBin(), getBinOrders(binOrders ? (lastBinCode === binCodeQS ? (binOrders.CurrentPage === binOrders.PagesNumber ? 1 : binOrders.CurrentPage + 1) : 1) : 1)]);
    }, 10000);

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

        setBinOrdersHeight(window.innerHeight - document.querySelector('.tv-footer').clientHeight
            - 30
            - 30
            - document.querySelector('.bin-orders .famo-header-row').clientHeight);

        Promise.all([getBin(), getBinOrders(1), getMessages()]).finally(() => {
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
                                {bin &&
                                    <div className='famo-grid rating-panel'>
                                        <div className='famo-row'>
                                            <div className='famo-cell text-center'>
                                                <span className='famo-text-23'>{bin.Code}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
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
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                {bin &&
                                    <React.Fragment>
                                        <div className='famo-grid'>
                                            <div className='famo-cell text-center'>
                                                <span className='famo-text-11'>{t('key_908')}</span>
                                            </div>
                                        </div>
                                        <div className='pda-victory-container'>
                                            <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                                <VictoryPie {...vicPieConfig} data={[{ x: true, y: bin.TotalVolume }, { x: false, y: bin.MaxVolume - bin.TotalVolume }]} colorScale={['#ff3333', '#bfbfbf']} labels={() => null} />
                                            </svg>
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </section>
                    </div>
                    <div className={'col-12 col-xl-10 ' + (!orderFirst ? 'order-first' : 'order-last')}>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <div className='famo-grid famo-content-grid bin-orders'>
                                    <div className='famo-row famo-header-row'>
                                        {binOrdersHeader.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                                    <span className='famo-text-11'>{x}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className='bin-orders bin-orders-data' style={{ maxHeight: (binOrdersHeight === -1 ? 'auto' : binOrdersHeight + 'px') }}>
                                    <div className='famo-grid famo-content-grid'>
                                        <div className='famo-row famo-header-row hide'></div>
                                        {binOrders && binOrders.Data.map((x, i) => {
                                            return (
                                                <div key={i} className={'famo-row famo-body-row ' + (x.ShipmentGate.ID !== -1 ? 'tv-blink-row' : '')}>
                                                    <div className='famo-cell famo-col-1 text-center'>
                                                        <p>
                                                            <img src={'https://flagcdn.com/h40/' + x.OrderCountry.Code.toLowerCase() + '.png'} height='42' alt={x.OrderCountry.Code} onError={(event) => { (event.target as any).src = NODE_SERVER + 'Images/no-flag.png' }} />
                                                        </p>
                                                        <p>
                                                            <span className='tv-text-1'>{x.OrderCountry.Label}</span>
                                                        </p>
                                                    </div>
                                                    <div className='famo-cell famo-col-2'>
                                                        <span className={'famo-text-10 ' + getRowColor(x)}>{x.CustomerName}</span>
                                                    </div>
                                                    <div className='famo-cell famo-col-3'>
                                                        <span className={'famo-text-10 ' + getRowColor(x)}>{x.OrderCode}</span>
                                                    </div>
                                                    <div className='famo-cell famo-col-4'>
                                                        <span className={'famo-text-10 ' + (!x.OrderExpectedShipmentDate ? 'famo-color-yellow' : getRowColor(x))}>{!x.OrderExpectedShipmentDate ? 'n/a' : (moment(x.OrderExpectedShipmentDate).isBefore(moment().startOf('date')) ? t('key_906') : moment(x.OrderExpectedShipmentDate).format(dateFormat))}</span>
                                                    </div>
                                                    <div className='famo-cell famo-col-5 text-center'>
                                                        <span className={'famo-text-10 ' + getRowColor(x)}>{numeral(x.BinOrderBoxes).format(unitFormat) + '/' + numeral(x.OrderBoxes).format(unitFormat)}</span>
                                                    </div>
                                                    <div className='famo-cell famo-col-6 text-center'>
                                                        <span className={'famo-text-10 ' + (x.ShipmentGate.ID === -1 ? 'famo-color-yellow' : getRowColor(x))}>{x.ShipmentGate.ID === -1 ? 'n/a' : x.ShipmentGate.Label}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {binOrders &&
                                        <div className='famo-grid famo-pagination'>
                                            <div className='famo-cell text-center'>
                                                {[...Array(binOrders.PagesNumber)].map((x, i) => {
                                                    return (
                                                        <span key={i} className={((i + 1) > binOrders.CurrentPage ? 'far' : 'fas') + ' fa-circle'}></span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    }
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

export default withRouter(TV);