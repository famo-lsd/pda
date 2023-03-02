import Http from '../utils/http';
import httpStatus from 'http-status';
import Log from '../utils/log';
import { CSSTransition } from 'react-transition-group';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Message, PaintingChainItems } from '../utils/interfaces';
import { createQueryString } from '../utils/general';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useInterval } from '@restart/hooks';
import { useTranslation } from 'react-i18next';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryContainer } from 'victory';
import { withRouter } from 'react-router-dom';


function TVPainting(props: any) {
    const { location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        moment = window['moment'],
        [chartData, setChartData] = useState<PaintingChainItems[]>([]),
        [maxQty, setMaxQty] = useState<number>(0),
        [pagesArr, setPagesArr] = useState<number[]>([]),
        [pages, setPages] = useState<number>(1),
        [time, setTime] = useState(moment()),
        [lastColor, setLastColor] = useState<string>(),
        [activeIndex, setActiveIndex] = useState(0), //Index da coluna do grafico
        [messages, setMessages] = useState<Array<Message>>(null),
        [messageIndex, setMessageIndex] = useState<number>(0),
        dateFormat = 'L',
        timeFormat = 'LTS',
        maxBars = 10,
        backgroundImageURL = 'Images/checkered.png';

    function getTVChainItemsQuantities() {
        return fetch(NODE_SERVER + 'Painting/TVChainItemQuantities' + createQueryString({
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(response => response.json())
            .then(data => {
                setChartData(data);
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

    function getTVPaintingColor() {
        return fetch(NODE_SERVER + 'Painting/TVPaintingColor' + createQueryString({
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(response => response.json())
            .then(data => {
                setLastColor(data);
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

    useEffect(() => {
        setMaxQty(Math.max(...chartData.map(x => x.Quantity)));
        if (chartData.length % maxBars === 0) {
            setPages(Math.floor(chartData.length / maxBars));
        }
        else {
            setPages(Math.floor(chartData.length / maxBars) + 1);
        }
    }, [chartData]);

    useEffect(() => {
        const newPagesArr = Array.from({ length: pages }, (_, index) => index + 1);
        setPagesArr(newPagesArr);
    }, [pages]);

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
        setTime(moment());
    }, 1000);

    useInterval(() => {
        Promise.all([getTVChainItemsQuantities(), getTVPaintingColor()])
    }, 15000);

    useInterval(() => {
        getMessages();
    }, 1800000);

    useInterval(() => {
        if (messages && messages.length > 0) {
            setMessageIndex(messageIndex + 1 === messages.length ? 0 : messageIndex + 1);
        }
    }, 5000);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setActiveIndex((activeIndex + 1) % pagesArr.length);
        }, 10000);

        return () => {
            clearTimeout(timerId);
        };
    }, [activeIndex, pagesArr.length]);


    useEffect(() => {
        globalActions.setLoadPage(true);

        Promise.all([getTVChainItemsQuantities(), getTVPaintingColor(), getMessages()]).finally(() => {
            globalActions.setLoadPage(false);
        });
    }, []);

    const rainbowGradient = {
        stroke: "url(#rainbow)",
      };

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
                                <div className='famo-grid rating-panel'>
                                    <div className='famo-row'>
                                        <div className='famo-cell text-center'>
                                            <span className='famo-text-23 famo-text-60'>Pintura - Peças em carga</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {
                            pagesArr.length > 0 && lastColor &&
                            <section className='famo-wrapper'>
                                <div className='famo-content'>
                                    <div className='row painting-carousel-container'>
                                        {
                                            pagesArr.map((item, index) => (
                                                <div key={item} className={`painting-carousel-item col-12 ${activeIndex === index ? 'active' : ''}`}>
                                                    <VictoryChart domainPadding={20}
                                                        horizontal
                                                        padding={{ top: 10, bottom: 50, left: 60, right: 20 }}
                                                        style={{
                                                            parent: {
                                                                width: "90%", // Set the width of the chart
                                                                height: "800px" // Set the height of the chart
                                                            }
                                                        }}>
                                                        <VictoryBar
                                                            data={chartData.sort((a, b) => b.Quantity - a.Quantity).slice((item - 1) * maxBars, item * maxBars).sort((a, b) => a.Quantity - b.Quantity)}
                                                            x={"Color.CrossReference"}
                                                            y={"Quantity"}
                                                            // labels={({ datum }) => {
                                                            //     return datum.Quantity
                                                            // }}
                                                            labelComponent={
                                                                <VictoryLabel dx={20}
                                                                    textAnchor="end"
                                                                    style={{ fontFamily: "Noto Sans", fontSize: 8, fill: "black" }}

                                                                />
                                                            }
                                                            barWidth={15}
                                                            containerComponent={<VictoryContainer />}
                                                            style={{
                                                                data: {
                                                                    fill: ({ datum }) => datum.Color.Hexadecimal != null ? datum.Color.Hexadecimal : "#FFFFFF", // use the Color.Hex property as the fill value
                                                                    width: 15, // set the width of the bars to 15
                                                                    stroke: ({ datum }) => datum.Color.CrossReference == lastColor ? "red" : "black", // set the stroske color to black
                                                                    strokeWidth: ({ datum }) => datum.Color.CrossReference == lastColor ? 1.5 : 0.2, // set the stroke width to 1
                                                                },
                                                            }}
                                                        />
                                                        <VictoryAxis
                                                            dependentAxis
                                                            label="Quantidade"
                                                            style={{
                                                                tickLabels: {
                                                                    fontSize: 10, fontFamily: "Noto Sans"
                                                                },
                                                                axisLabel: {
                                                                    fontFamily: "Noto Sans",
                                                                    fontSize: 12,

                                                                }
                                                            }}
                                                        />
                                                        <VictoryAxis
                                                            label="Cor"
                                                            axisLabelComponent={<VictoryLabel x={45} y={20} angle={0} />}
                                                            style={{
                                                                tickLabels: { fontFamily: "Noto Sans", fontSize: 10 }, axisLabel: {
                                                                    fontFamily: "Noto Sans",
                                                                    fontSize: 14,

                                                                }
                                                            }}
                                                        />
                                                    </VictoryChart>
                                                </div>
                                            ))
                                        }
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

export default withRouter(TVPainting);