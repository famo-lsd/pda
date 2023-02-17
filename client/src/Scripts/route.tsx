import '../Content/style.css';
import Authentication from './utils/authentication';
import Expedition from './components/expedition';
import Home from './components/home';
import Http from './utils/http';
import httpStatus from 'http-status';
import Inventory from './components/inventory';
import ReceiveOT from './components/receiveOT';
import Log from './utils/log';
import Pallets from './components/pallets';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import SignIn from './components/signIn';
import TV from './components/tv';
import TVReception from './components/tvReception';
import TVBoxing from './components/tvBoxing';
import Warehouse from './components/warehouse';
import TVChart from './components/tvChart';
import { AppLoader } from './components/elements/loader';
import { createQueryString, isMobileBrowser } from './utils/general';
import { HashRouter, Route, Redirect, Switch, useHistory, useLocation } from 'react-router-dom';
import { isAndroidApp } from './utils/platform';
import { NODE_SERVER } from './utils/variablesRepo';
import { Swipeable } from 'react-swipeable';
import { useGlobal } from './utils/globalHooks';
import { useTranslation } from 'react-i18next';

export function PrivateRoute({ component: Component, ...rest }) {
    const history = useHistory(),
        location = useLocation(),
        [globalState,] = useGlobal(),
        [backButton, setBackButton] = useState<boolean>(false);

    let scrollTop = -1,
        elemToScroll: HTMLElement = null;

    function swipingPage(event) {
        if (!isMobileBrowser() && (event.dir === 'Up' || event.dir === 'Down')) {
            if (scrollTop === -1) {
                elemToScroll = (event.event.path as Array<any>).some(x => {
                    const className = (x as HTMLElement).className;

                    return !className ? false : className.indexOf('famo-modal') !== -1;
                }) ? document.querySelector('.famo-modal') : document.querySelector('body');
                scrollTop = elemToScroll.scrollTop;
            }

            elemToScroll.scrollTop = scrollTop + event.deltaY;
        }
    }

    function swipedPage(event) {
        elemToScroll = null;
        scrollTop = -1;
    }

    useEffect(() => {
        setBackButton(location.pathname === '/' ? false : true);
    }, [location.pathname]);

    return (
        <Route {...rest}
            render={routeProps => {
                return globalState.authUser ? (
                    <Swipeable trackMouse={true} trackTouch={false} onSwiping={event => swipingPage(event)} onSwiped={event => swipedPage(event)} >
                        <section className='famo-body'>
                            <Component {...routeProps} />
                            {!globalState.androidApp && backButton &&
                                <button type='button' className={'famo-button famo-normal-button pda-back-button ' + (globalState.authUser && !globalState.loadPage ? '' : 'hide')} onClick={event => history.goBack()}>
                                    <span className='fas fa-arrow-left'></span>
                                </button>
                            }
                        </section>
                    </Swipeable>
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

function RouteBody(props: any) {
    const { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        [loadSession, setLoadSession] = useState<boolean>(false);

    useEffect(() => {
        setLoadSession(true);

        fetch(NODE_SERVER + 'Authentication/Session/User' + createQueryString({}), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(async data => {
                    await isAndroidApp(data, globalActions, t);
                });
            }
            else {
                throw result;
            }
        }).catch(async error => {
            await isAndroidApp(null, globalActions, t);

            if (error as Response) {
                Log.httpError(error);
            }
            else {
                Log.promiseError(error);
            }
        }).finally(() => {
            setLoadSession(false);
        });
    }, []);

    return (
        <React.Fragment>
            {!loadSession &&
                <Switch>
                    <PrivateRoute exact path='/' component={Home} />
                    <PrivateRoute path='/TV' component={TV} />
                    <PrivateRoute path='/TVReception' component={TVReception} />
                    <PrivateRoute path='/TVBoxing' component={TVBoxing} />
                    <PrivateRoute path='/Warehouse' component={Warehouse} />
                    <PrivateRoute path='/Expedition' component={Expedition} />
                    <PrivateRoute path='/Pallets' component={Pallets} />
                    <PrivateRoute path='/Inventory' component={Inventory} />
                    <PrivateRoute path='/ReceiveOT' component={ReceiveOT} />
                    <PrivateRoute path='/TVChart' component={TVChart} />
                    <Route exact path='/SignIn' render={routeProps => { return <SignIn {...routeProps} />; }} />
                </Switch>
            }
            <AppLoader hide={!loadSession && !globalState.loadPage} />
        </React.Fragment>
    );
}

function AutoRouteBody(props: any) {
    const history = useHistory(),
        location = useLocation(),
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        [loadSession, setLoadSession] = useState<boolean>(true),
        [backButton, setBackButton] = useState<boolean>(false);

    let scrollTop = -1,
        elemToScroll: HTMLElement = null;

    function swipingPage(event) {
        if (!isMobileBrowser() && (event.dir === 'Up' || event.dir === 'Down')) {
            if (scrollTop === -1) {
                elemToScroll = (event.event.composedPath() as Array<any>).some(x => {
                    const className = (x as HTMLElement).className;

                    return !className ? false : className.indexOf('famo-modal') !== -1;
                }) ? document.querySelector('.famo-modal') : document.querySelector('body');
                scrollTop = elemToScroll.scrollTop;
            }

            elemToScroll.scrollTop = scrollTop + event.deltaY;
        }
    }

    function swipedPage(event) {
        elemToScroll = null;
        scrollTop = -1;
    }

    useEffect(() => {
        setLoadSession(true);

        fetch(NODE_SERVER + 'Authentication/Session/User' + createQueryString({}), Http.addAuthorizationHeader({
            method: 'GET'
        })).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(async data => {
                    await isAndroidApp(data, globalActions, t);
                });
            }
            else {
                throw result;
            }
        }).catch(async error => {
            await Authentication.autoSignIn(globalActions, t);

            if (error as Response) {
                Log.httpError(error);
            }
            else {
                Log.promiseError(error);
            }
        }).finally(() => {
            setLoadSession(false);
        });
    }, []);

    useEffect(() => {
        setBackButton(location.pathname === '/' || location.pathname === '/TV' || location.pathname === '/TVChart' || location.pathname === '/TVReception' || location.pathname === '/TVBoxing' ? false : true);
    }, [location.pathname]);

    return (
        <React.Fragment>
            {!loadSession &&
                <Swipeable trackMouse={true} trackTouch={false} onSwiping={event => swipingPage(event)} onSwiped={event => swipedPage(event)} >
                    <section className={'famo-body ' + (location.pathname === '/TV' || location.pathname === '/TVReception' || location.pathname === '/TVBoxing' || location.pathname === '/TVChart' ? 'tv-body' : '')}>
                        <Switch>
                            <Route exact path='/' render={() => { return <Home />; }} />
                            <Route path='/TV' render={() => { return <TV />; }} />
                            <Route path='/TVReception' render={() => { return <TVReception />; }} />
                            <Route path='/TVBoxing' render={() => { return <TVBoxing />; }} />
                            <Route path='/Warehouse' render={() => { return <Warehouse />; }} />
                            <Route path='/Expedition' render={() => { return <Expedition />; }} />
                            <Route path='/Pallets' render={() => { return <Pallets />; }} />
                            <Route path='/Inventory' render={() => { return <Inventory />; }} />
                            <Route path='/ReceiveOT' render={() => { return <ReceiveOT />; }} />
                            <Route path='/TVChart' render={() => { return <TVChart />; }} />
                        </Switch>
                        {!globalState.androidApp && backButton &&
                            <button type='button' className={'famo-button famo-normal-button pda-back-button ' + (!globalState.loadPage ? '' : 'hide')} onClick={event => history.goBack()}>
                                <span className='fas fa-arrow-left'></span>
                            </button>
                        }
                    </section>
                </Swipeable>
            }
            <AppLoader hide={!loadSession && !globalState.loadPage} />
        </React.Fragment>
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

export default Routing;