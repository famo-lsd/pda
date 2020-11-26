import '../../Content/tv.css';
import Http from '../utils/http';
import httpStatus from 'http-status';
import Log from '../utils/log';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Bin, BinOrder } from '../utils/interfaces';
import { createQueryString } from '../utils/general';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { VictoryLabel, VictoryPie } from 'victory';
import { withRouter } from 'react-router-dom';
import Title from './elements/title';

function TV(props: any) {
    const { location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        binCodeQS = query.binCode,
        [bin, setBin] = useState<Bin>(),
        binOrdersHeader: Array<string> = ['País', t('key_85'), t('key_179'), t('key_670'), t('key_900'), t('key_896')],
        [binOrders, setBinOrders] = useState<Array<BinOrder>>([]),
        [time, setTime] = useState<Date>(new Date()),
        vicPieConfig = {
            standalone: false,
            cornerRadius: 10,
            innerRadius: 120,
            padAngle: 3,
            padding: { top: 25, bottom: 5 }
        },
        vicLabelConfig = {
            lineHeight: 3.5,
            x: 400 * 0.5,
            y: 400 * 0.525
        },
        moment = window['moment'],
        numeral = window['numeral'],
        dateFormat = 'L',
        timeFormat = 'LTS',
        percentageFormat = '0.00%',
        unitFormat = '0,0',
        decimalFormat = '0,0.00';

    useEffect(() => {
        globalActions.setLoadPage(true);

        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        const getBin = fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({
            code: binCodeQS,
            languageCode: globalState.authUser.Language.Code
        }), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
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
        }),
            getBinOrders = fetch(NODE_SERVER + 'Warehouse/Bins/Orders' + createQueryString({
                binCode: binCodeQS,
                languageCode: globalState.authUser.Language.Code
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

        Promise.all([getBin, getBinOrders]).finally(() => {
            globalActions.setLoadPage(false);
        });

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <section className='container famo-wrapper'>
            <div className='row'>
                <div className='col-12 col-xl-9'>
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
                                {binOrders.map((x, i) => {
                                    return (
                                        <div key={i} className='famo-row famo-body-row'>
                                            <div className='famo-cell famo-col-1'>
                                                <p>
                                                    <img src={'https://www.countryflags.io/' + x.OrderCountry.Code.toLowerCase() + '/flat/48.png'} alt={x.OrderCountry.Code} />
                                                </p>
                                                <p>
                                                    <span className='famo-text-10'>{x.OrderCountry.Label}</span>
                                                </p>
                                            </div>
                                            <div className='famo-cell famo-col-2'>
                                                <span className='famo-text-10'>{x.CustomerName}</span>
                                            </div>
                                            <div className='famo-cell famo-col-3'>
                                                <span className='famo-text-10'>{x.OrderCode}</span>
                                            </div>
                                            <div className='famo-cell famo-col-4'>
                                                <span className='famo-text-10'>{moment(x.OrderExpectedShipmentDate).format(dateFormat)}</span>
                                            </div>
                                            <div className='famo-cell famo-col-5'>
                                                <span className='famo-text-10'>{numeral(x.BinOrderBoxes).format(unitFormat) + '/' + numeral(x.OrderBoxes).format(unitFormat)}</span>
                                            </div>
                                            <div className='famo-cell famo-col-6'>
                                                <span className={'famo-text-10 ' + (x.ShipmentGate.ID === -1 ? 'famo-color-yellow' : '')}>{x.ShipmentGate.ID === -1 ? 'n/a' : x.ShipmentGate.Label}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>
                <div className='col-12 col-xl-3'>
                    <section className='famo-wrapper'>
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
                                        <span className='famo-text-23'>{moment(time).format(timeFormat)}</span>
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
                                            <span className='famo-text-11'>{t('key_711')}</span>
                                        </div>
                                    </div>
                                    <div className='pda-victory-container'>
                                        <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                            <VictoryPie {...vicPieConfig} data={[{ x: true, y: bin.TotalVolume }, { x: false, y: bin.MaxVolume - bin.TotalVolume }]} colorScale={['#ff3333', '#33ff33']} labels={() => null} />
                                            <VictoryLabel {...vicLabelConfig} textAnchor='middle' verticalAnchor='middle' text={[numeral(bin.TotalVolume / bin.MaxVolume).format(percentageFormat), numeral(bin.TotalVolume).format(unitFormat) + '/' + numeral(bin.MaxVolume).format(unitFormat) + ' m³']} style={[{ fill: '#ff3333' }]} />
                                        </svg>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}

export default withRouter(TV);