import Expedition from './components/expedition';
import Home from './components/home';
import httpStatus from 'http-status';
import Inventory from './components/inventory';
import Pallet from './components/pallet';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import SignIn from './components/signIn';
import { AppLoader } from './components/elements/loader';
import { autoSignIn } from './utils/authentication';
import { HashRouter, Route, Redirect, Switch, useHistory, useLocation } from 'react-router-dom';
import { httpErrorLog, promiseErrorLog } from './utils/log';
import { isAndroidApp } from './utils/platform';
import { NODE_SERVER } from './utils/variablesRepo';
import { useGlobal } from './utils/globalHooks';
import { withTranslation } from 'react-i18next';
import '../Content/style.css';

interface AutoRouteBodyState {
    isAuthenticated: boolean;
}

function PrivateRoute({ component: Component, ...rest }) {
    const [globalState,] = useGlobal();

    return (
        <Route
            render={routeProps => {
                return globalState.authUser ? (
                    <Component {...routeProps} />
                ) : (
                        <Redirect
                            to={{
                                pathname: '/SignIn',
                                state: { from: routeProps.location }
                            }}
                        />
                    );
            }}
        />
    );
}

PrivateRoute.propTypes = {
    component: PropTypes.elementType
}

function RouteBody() {
    const [globalState,] = useGlobal();

    return (
        <Switch>
            <PrivateRoute exact path='/' component={Home} />
            <Route exact path='/SignIn' render={routeProps => {
                return globalState.authUser ? (<Redirect to={{ pathname: '/' }} />) : (<SignIn {...routeProps} />);
            }} />
        </Switch>
    );
}

function AutoRouteBody(props: any) {
    const { t } = props,
        history = useHistory(),
        location = useLocation(),
        [globalState, globalActions] = useGlobal(),
        [backButton, setBackButton] = useState<boolean>(false);

    useEffect(() => {
        fetch(NODE_SERVER + 'Authentication/Session/User', {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(data => {
                            isAndroidApp(data, globalActions, t);
                        }).catch(error => {
                            autoSignIn(globalActions, t);
                            promiseErrorLog(error);
                        });
                }
                else {
                    autoSignIn(globalActions, t);
                    httpErrorLog(wsSucc);
                }
            })
            .catch(wsErr => {
                autoSignIn(globalActions, t);
                promiseErrorLog(wsErr);
            });
    }, []);

    useEffect(() => {
        setBackButton(location.pathname === '/' ? false : true);
    }, [location.pathname]);

    return (
        <section className='famo-body'>
            <Switch>
                <Route exact path='/' render={() => { return <Home />; }} />
                <Route path='/Inventory' render={() => { return <Inventory />; }} />
                <Route path='/Pallet' render={() => { return <Pallet />; }} />
                <Route path='/Expedition' render={() => { return <Expedition />; }} />
            </Switch>
            <AppLoader hide={globalState.authUser && !globalState.loadPage} />
            {!globalState.androidApp && backButton && <button type='button' className={'famo-button famo-normal-button pda-back-button ' + (globalState.authUser && !globalState.loadPage ? '' : 'hide')} onClick={event => history.goBack()}>
                <span className='fas fa-arrow-left'></span>
            </button>}
        </section>
    );
}

function Routing(props: any) {
    // if (!(window as any).cordova) {
    //     return (
    //         <BrowserRouter basename='/'>
    //             <AutoRouteBody {...props} />
    //         </BrowserRouter>
    //     );
    // }
    // else {
    //     return (
    //         <HashRouter basename='/'>
    //             <AutoRouteBody {...props} />
    //         </HashRouter>
    //     );
    // }

    return (
        <HashRouter basename='/'>
            <AutoRouteBody {...props} />
        </HashRouter>
    );
}

export default withTranslation()(Routing);