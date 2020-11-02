import '../Content/style.css';
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
import { isMobileBrowser } from './utils/general';
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
        [globalState, globalActions] = useGlobal();

    useEffect(() => {
        globalActions.setLoadSession(true);

        fetch(NODE_SERVER + 'Authentication/Session/User', {
            method: 'GET',
            credentials: 'include'
        })
            .then(async wsSucc => {
                if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                    await wsSucc.json()
                        .then(async data => {
                            await isAndroidApp(data, globalActions, t);
                            // setSessionUser(true);
                        }).catch(async error => {
                            await isAndroidApp(null, globalActions, t);
                            promiseErrorLog(error);
                        });
                }
                else {
                    await isAndroidApp(null, globalActions, t);
                    httpErrorLog(wsSucc);
                }
            })
            .catch(async wsErr => {
                await isAndroidApp(null, globalActions, t);
                promiseErrorLog(wsErr);
            })
            .finally(() => {
                globalActions.setLoadSession(false);
            });
    }, []);

    return (
        <React.Fragment>
            {!globalState.loadSession &&
                <Switch>
                    <PrivateRoute exact path='/' component={Home} />
                    <PrivateRoute path='/Expedition' component={Expedition} />
                    <PrivateRoute path='/Pallet' component={Pallet} />
                    <PrivateRoute path='/Inventory' component={Inventory} />
                    <Route exact path='/SignIn' render={routeProps => { return <SignIn {...routeProps} />; }} />
                </Switch>
            }
            <AppLoader hide={!globalState.loadPage && !globalState.loadSession} />
        </React.Fragment>
    );
}

function AutoRouteBody(props: any) {
    const history = useHistory(),
        location = useLocation(),
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
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

    return (
        <Swipeable trackMouse={true} trackTouch={false} onSwiping={event => swipingPage(event)} onSwiped={event => swipedPage(event)} >
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
        </Swipeable>
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
            <RouteBody {...props} />
        </HashRouter>
    );
}

export default Routing;