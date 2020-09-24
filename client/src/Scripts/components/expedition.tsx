import httpStatus from 'http-status';
import React, { useEffect, useState } from 'react';
import Title from './elements/title';
import { createQueryString } from '../utils/general';
import { httpErrorLog, promiseErrorLog } from '../utils/log';
import { NODE_SERVER } from '../utils/variablesRepo';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { SessionStorage } from '../utils/sessionStorage';
import { useGlobal } from '../utils/globalHooks';
import { withTranslation } from 'react-i18next';

interface Shipment {
    Code: string;
    Description: string;
    PickedBoxes: number;
    TotalBoxes: number;
}


function Expedition() {
    return (
        <Switch>
            <Route exact path='/Expedition' render={(props) => { return <Index {...props} />; }} />
            <Route exact path='/Expedition/Edit' render={props => { return <Edit {...props} />; }} />
            <Route path='/Expedition/*' render={() => { return <Redirect to='/Expedition' />; }} />
        </Switch>
    );
}

function Index(props: any) {
    const { t } = props,
        [globalState, globalActions] = useGlobal(),
        [shipments, setShipments] = useState<Array<Shipment>>([]),
        shipmentsHeader: Array<string> = [t('key_87'), t('key_138'), t('key_820')];

    useEffect(() => {
        globalActions.setLoadPage(true);

        fetch(NODE_SERVER + 'ERP/Shipments' + createQueryString({}), {
            method: 'GET',
            credentials: 'include'
        })
            .then(wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    wsSucc.json()
                        .then(data => {
                            setShipments(data);
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

    return (
        <React.Fragment>
            <section className='famo-wrapper'>
                <Title text='Mapas de carga' />
                <div className='famo-content'>
                    <div className='famo-grid famo-content-grid pallets'>
                        <div className='famo-row famo-header-row'>
                            {shipmentsHeader.map((x, i) => {
                                return (
                                    <div key={i} className={'famo-cell famo-col-' + (i + 1)}>
                                        <span className='famo-text-11'>{x}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {shipments && shipments.map((x, i) => {
                            return (
                                <div key={i} className='famo-row famo-body-row'>
                                    <div className='famo-cell famo-col-1'>
                                        <span className='famo-text-10'>{x.Code}</span>
                                    </div>
                                    <div className='famo-cell famo-col-2'>
                                        <span className='famo-text-10'>{x.Description}</span>
                                    </div>
                                    <div className='famo-cell famo-col-3'>
                                        <span className='famo-text-10'>{(!x.PickedBoxes ? 0 : x.PickedBoxes) + '/' + (!x.TotalBoxes ? 0 : x.TotalBoxes)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}

function Edit(props: any) {
    return (
        <React.Fragment>

        </React.Fragment>
    );
}

export default withRouter(withTranslation()(Expedition));