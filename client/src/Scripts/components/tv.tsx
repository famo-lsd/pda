import httpStatus from 'http-status';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { createQueryString } from '../utils/general';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { logHttpError, logPromiseError } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { VictoryLabel, VictoryPie } from 'victory';

interface ShipmentGate {
    ID: number;
    Label: string;
}

interface Bin {
    ID: number;
    Code: string;
    Label: string;
    MaxVolume: number;
    TotalBoxes: number;
    TotalVolume: number;
}

interface BinOrder {
    CustomerName: string;
    OrderCode: string;
    OrderCountryCode: string;
    OrderExpectedShipmentDate: Date;
    OrderBoxes: number;
    Bin: Bin;
    BinOrderBoxes: number;
    ShipmentGate: ShipmentGate;
}

function TV(props: any) {
    const { location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        query = queryString.parse(location.search),
        binCodeQS = query.binCode,
        [bin, setBin] = useState<Bin>(),
        binOrdersHeader: Array<string> = ['País', t('key_85'), t('key_179'), t('key_670'), t('key_900'), t('key_896')],
        [binOrders, setBinOrders] = useState<Array<BinOrder>>([]),
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
        percentageFormat = '0.00%',
        unitFormat = '0,0';

    useEffect(() => {
        globalActions.setLoadPage(true);

        const getBin = fetch(NODE_SERVER + 'Warehouse/Bins' + createQueryString({ code: binCodeQS, languageCode: globalState.authUser.Language.Code }), {
            method: 'GET',
            credentials: 'include'
        }).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(data => {
                    setBin(data);
                    console.log(data);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                logHttpError(error);
                alert(t('key_303'));
            }
            else {
                logPromiseError(error);
                alert(t('key_416'));
            }
        }),
            getBinOrders = fetch(NODE_SERVER + 'Warehouse/Bins/Orders' + createQueryString({ binCode: binCodeQS, languageCode: globalState.authUser.Language.Code }), {
                method: 'GET',
                credentials: 'include'
            }).then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json().then(data => {
                        setBinOrders(data);
                        console.log(data);
                    });
                }
                else {
                    throw result;
                }
            }).catch(error => {
                if (error as Response) {
                    logHttpError(error);
                    alert(t('key_303'));
                }
                else {
                    logPromiseError(error);
                    alert(t('key_416'));
                }
            });

        Promise.all([getBin, getBinOrders]).finally(() => {
            globalActions.setLoadPage(false);
        });
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
                                                <img src={'https://www.countryflags.io/' + x.OrderCountryCode.toLowerCase() + '/flat/48.png'} alt={x.OrderCountryCode} />
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
                                <React.Fragment>
                                    <div className='famo-grid'>
                                        <div className='famo-cell text-center'>
                                            <span className='famo-text-11'>{t('key_711')}</span>
                                        </div>
                                    </div>
                                    <div className='pda-victory-container'>
                                        <svg width={400} height={400} viewBox={'0, 0, 400, 400'}>
                                            <VictoryPie {...vicPieConfig} data={[{ x: true, y: bin.TotalVolume }, { x: false, y: bin.MaxVolume - bin.TotalVolume }]} colorScale={['#ff3333', '#bfbfbf']} labels={() => null} />
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