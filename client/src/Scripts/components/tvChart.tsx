import Http from '../utils/http';
import httpStatus from 'http-status';
import Log from '../utils/log';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Message, WorkCenter } from '../utils/interfaces';
import { createQueryString } from '../utils/general';
import { CSSTransition } from 'react-transition-group';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useInterval } from '@restart/hooks';
import { useTranslation } from 'react-i18next';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory';
import { withRouter } from 'react-router-dom';

function TVChart(props: any) {
    const { location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        numeral = window['numeral'],
        query = queryString.parse(location.search),
        workCenterID = query.workCenterID ? query.workCenterID : 0,
        machineCenters = query.machineCenters ? query.machineCenters : null,
        [chartData, setChartData] = useState<number[]>([]),
        [chartData2, setChartData2] = useState<number[]>([]),
        [label, setLabel] = useState<string>(),
        [indicators, setIndicators] = useState<number[]>([]),
        [indicators2, setIndicators2] = useState<number[]>([]),
        [productionOrders, setProductionOrders] = useState<number[]>([]),
        //[orderFirst, setOrderFirst] = useState<boolean>(true),
        [showWeek, setShowWeek] = useState<boolean>(true),
        [time, setTime] = useState(moment()),
        vicPieConfig = {
            standalone: false,
            cornerRadius: 0,
            innerRadius: 0,
            padAngle: 0,
            padding: { top: 25, bottom: 5 }
        },
        [messages, setMessages] = useState<Array<Message>>(null),
        [messageIndex, setMessageIndex] = useState<number>(0),
        dateFormat = 'L',
        timeFormat = 'LTS',
        unitFormat = '0,0';

    function getChartData() {
        return fetch(NODE_SERVER + 'Productivity/TVChart' + createQueryString({
            machineCenters: machineCenters,
            workCenterID: workCenterID,
            weeks: 0
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setChartData(data);
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

    function getChartData2() {
        return fetch(NODE_SERVER + 'Productivity/TVChart' + createQueryString({
            machineCenters: machineCenters,
            workCenterID: workCenterID,
            weeks: 2
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setChartData2(data);
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

    function getIndicators() {
        return fetch(NODE_SERVER + 'Productivity/Indicators' + createQueryString({
            machineCenters: machineCenters,
            workCenterID: workCenterID,
            weeks: 0
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setIndicators(data);
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

    function getIndicators2() {
        return fetch(NODE_SERVER + 'Productivity/Indicators' + createQueryString({
            machineCenters: machineCenters,
            workCenterID: workCenterID,
            weeks: 2
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setIndicators2(data);
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

    function getLabel() {
        return fetch(NODE_SERVER + 'Productivity/TVLabel' + createQueryString({
            machineCenters: machineCenters,
            workCenterID: workCenterID,
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setLabel(data[0]);
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

    function getTVProductionOrders() {
        return fetch(NODE_SERVER + 'Productivity/TVProductionOrders' + createQueryString({
            machineCenters: machineCenters,
            workCenterID: workCenterID,
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setProductionOrders(data);
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

    // useInterval(() => {
    //     setOrderFirst(!orderFirst);
    // }, 3600000);

    useInterval(() => {
        setShowWeek(!showWeek);
    }, 15000);

    useInterval(() => {
        setTime(moment());
    }, 1000);

    useInterval(() => {
        Promise.all([getChartData(), getChartData2(), getIndicators(), getIndicators2(), getLabel(), getTVProductionOrders()])
    }, 30000);

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

        Promise.all([getChartData(), getChartData2(), getMessages(), getIndicators(), getIndicators2(), getLabel(), getTVProductionOrders() ]).finally(() => {
            globalActions.setLoadPage(false);
        });
    }, []);

    // useEffect(() => {
    //     globalActions.setLoadPage(true);

    //     Promise.all([getMessages(), getTVProductionOrders()]).finally(() => {
    //         globalActions.setLoadPage(false);
    //     });
    // }, []);

    return (
        <React.Fragment>
            <section className='container famo-wrapper'>
                <div className='row'>
                    <div className={'col-12 col-xl-2 '}>
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
                    <div className={'col-12 col-xl-10'}>
                        <section className='famo-wrapper tv-dark-wrapper'>
                            <div className='famo-content'>
                                {label &&
                                    <div className='famo-grid rating-panel'>
                                        <div className='famo-row'>
                                            <div className='famo-cell text-center'>
                                                <span className='famo-text-23 famo-text-60'>{label}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </section>
                        <section className='famo-wrapper'>
                            <div className='famo-content'>
                                <div className={'row indicators-row'}>
                                    {/* -------------------------------- 2week values -------------------------------------*/}
                                    <div className={'col-6 text-center ' + (showWeek ? '' : 'indicators-right')}>
                                        {chartData &&
                                            <React.Fragment>
                                                <div className='famo-grid'>
                                                    <div className='famo-cell text-center'>
                                                        <span className='famo-text-11'>Ordens produção - 2 Semanas</span>
                                                    </div>
                                                </div>
                                                <svg width={400} height={400}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: chartData2[0] }, { x: false, y: chartData2[1] }]} colorScale={['#0aae00', '#FF0000']} labels={() => null} />
                                                </svg>
                                            </React.Fragment>
                                        }
                                    </div>
                                    <div className={'col-6 ' + (showWeek ? '' : 'indicators-right')}>
                                        {indicators &&
                                            <React.Fragment>
                                                <div className='famo-grid'>
                                                    <div className='famo-cell text-center'>
                                                        <span className='famo-text-11'>Indicadores - 2 semanas</span>
                                                    </div>
                                                </div>
                                                <div className='famo-grid mt-20'>
                                                    <div className='famo-row'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>Ordens produção</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators2[0]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>Encomendas</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators2[1]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>MRPs</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators2[2]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>Peças</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators2[3]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10 famo-color-green'>No prazo</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10 famo-color-green'>{numeral(chartData2[0]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10 famo-color-red'>Atraso</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10 famo-color-red'>{numeral(chartData2[1]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>

                                    {/* -------------------------------- Total values -------------------------------------*/}
                                    <div className={'col-6 text-center ' + (showWeek ? '' : 'indicators-right')}>
                                        {chartData &&
                                            <React.Fragment>
                                                <div className='famo-grid'>
                                                    <div className='famo-cell text-center'>
                                                        <span className='famo-text-11'>Ordens produção - Total</span>
                                                    </div>
                                                </div>
                                                <svg width={400} height={400}>
                                                    <VictoryPie {...vicPieConfig} data={[{ x: true, y: chartData[0] }, { x: false, y: chartData[1] }]} colorScale={['#0aae00', '#FF0000']} labels={() => null} />
                                                </svg>
                                            </React.Fragment>
                                        }
                                    </div>
                                    <div className={'col-6 ' + (showWeek ? '' : 'indicators-right')}>
                                        {indicators &&
                                            <React.Fragment>
                                                <div className='famo-grid'>
                                                    <div className='famo-cell text-center'>
                                                        <span className='famo-text-11'>Indicadores - Total</span>
                                                    </div>
                                                </div>
                                                <div className='famo-grid mt-20'>
                                                    <div className='famo-row'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>Ordens produção</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators[0]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>Encomendas</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators[1]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>MRPs</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators[2]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10'>Peças</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10'>{numeral(indicators[3]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10 famo-color-green'>No prazo</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10 famo-color-green'>{numeral(chartData[0]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='famo-row mt-20'>
                                                        <div className='famo-cell'>
                                                            <span className='famo-text-10 famo-color-red'>Atraso</span>
                                                        </div>
                                                        <div className='famo-cell text-right'>
                                                            <span className='famo-text-10 famo-color-red'>{numeral(chartData[1]).format(unitFormat)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                    {/*-----------------------------------------------------------------------------*/}
                                </div>
                            </div>
                        </section>
                        {(productionOrders[1] > 0 || productionOrders[3] > 0) &&
                        <section className='famo-wrapper'>
                            <div className='famo-content mh-320'>
                                <div className='row'>
                                    <div className='col-6'>
                                        {productionOrders && productionOrders[4] >= 0 && productionOrders[1] > 0 &&
                                            <React.Fragment>
                                                <div className='famo-grid'>
                                                    <div className='famo-cell text-center'>
                                                        <span className='famo-text-11'>Produção diária</span>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <svg viewBox="0 0 550 550" >
                                                            {/* viewBox="0 0 550 550" */}
                                                            <VictoryPie
                                                                standalone={false}
                                                                animate={{ duration: 1000 }}
                                                                data={[{ x: 1, y: productionOrders[4] }, { x: 2, y: 100 - productionOrders[4] }]}
                                                                innerRadius={120}
                                                                cornerRadius={20}
                                                                labels={() => null}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => {
                                                                            const color = datum.y > 60 ? "green" : "red";
                                                                            return datum.x === 1 ? color : "transparent";
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <VictoryAnimation duration={1000} data={[{ x: 1, y: productionOrders[4] }, { x: 2, y: 100 - productionOrders[4] }]} >
                                                                {(newProps) => {
                                                                    return (
                                                                        <VictoryLabel
                                                                            textAnchor="middle" verticalAnchor="middle"
                                                                            x={200} y={200}
                                                                            text={numeral(productionOrders[4]).format(unitFormat) + '%'}
                                                                            style={{ fontSize: 45, fontFamily: 'Noto Sans' }}
                                                                        />
                                                                    );
                                                                }}
                                                            </VictoryAnimation>
                                                        </svg>
                                                    </div>
                                                    <div className='col-6'>
                                                        <div className='famo-grid mt-20'>
                                                            <div className='famo-row '>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10'>Total</span>
                                                                </div>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10'>{numeral(productionOrders[0] + productionOrders[1]).format(unitFormat)}</span>
                                                                </div>
                                                            </div>
                                                            <div className='famo-row mt-20'>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-green'>Terminadas</span>
                                                                </div>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-green'>{numeral(productionOrders[1]).format(unitFormat)}</span>
                                                                </div>
                                                            </div>
                                                            <div className='famo-row'>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-red'>Em falta</span>
                                                                </div>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-red'>{numeral(productionOrders[0]).format(unitFormat)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                    <div className='col-6'>
                                        {indicators && productionOrders[5] && productionOrders[3] > 0 &&
                                            <React.Fragment>
                                                <div className='famo-grid'>
                                                    <div className='famo-cell text-center'>
                                                        <span className='famo-text-11'>Produção semanal</span>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <svg viewBox="0 0 550 550" >
                                                            {/* viewBox="0 0 550 550" */}
                                                            <VictoryPie
                                                                standalone={false}
                                                                animate={{ duration: 1000 }}
                                                                data={[{ x: 1, y: productionOrders[5] }, { x: 2, y: 100 - productionOrders[5] }]}
                                                                innerRadius={120}
                                                                cornerRadius={20}
                                                                labels={() => null}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => {
                                                                            const color = datum.y > 60 ? "green" : "red";
                                                                            return datum.x === 1 ? color : "transparent";
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <VictoryAnimation duration={1000} data={[{ x: 1, y: productionOrders[5] }, { x: 2, y: 100 - productionOrders[5] }]} >
                                                                {(newProps) => {
                                                                    return (
                                                                        <VictoryLabel
                                                                            textAnchor="middle" verticalAnchor="middle"
                                                                            x={200} y={200}
                                                                            text={numeral(productionOrders[5]).format(unitFormat) + '%'}
                                                                            style={{ fontSize: 45, fontFamily: 'Noto Sans' }}
                                                                        />
                                                                    );
                                                                }}
                                                            </VictoryAnimation>
                                                        </svg>
                                                    </div>
                                                    <div className='col-6'>
                                                        <div className='famo-grid mt-20'>
                                                            <div className='famo-row'>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10'>Total</span>
                                                                </div>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10'>{numeral(productionOrders[2] + productionOrders[3]).format(unitFormat)}</span>
                                                                </div>
                                                            </div>
                                                            <div className='famo-row mt-20'>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-green'>Terminadas</span>
                                                                </div>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-green'>{numeral(productionOrders[3]).format(unitFormat)}</span>
                                                                </div>
                                                            </div>
                                                            <div className='famo-row'>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-red'>Em falta</span>
                                                                </div>
                                                                <div className='famo-cell'>
                                                                    <span className='famo-text-10 famo-color-red'>{numeral(productionOrders[2]).format(unitFormat)}</span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                        }
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

export default withRouter(TVChart);