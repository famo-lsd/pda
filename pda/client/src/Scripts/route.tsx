import Authentication from './utils/authentication';
import Home from './pages/home';
import httpStatus from 'http-status';
import Inventory from './pages/inventory';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SignIn from './pages/signIn';
import { BrowserRouter, HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import { NODE_SERVER } from './utils/variablesRepo';
import { useGlobal } from './utils/globalHooks';
import { withTranslation } from 'react-i18next';
import '../Content/style.css';

interface AutoRouteBodyState {
    isAuthenticated: boolean;
}

function Routing(props: any) {
    if (!(window as any).cordova) {
        return (
            <BrowserRouter>
                <AutoRouteBody {...props} />
            </BrowserRouter>
        );
    }
    else {
        return (
            <HashRouter>
                <AutoRouteBody {...props} />
            </HashRouter>
        );
    }
}

function RouteBody() {
    const [globalState,] = useGlobal();

    return (
        <Switch>
            <PrivateRoute exact path='/' component={Home} />
            <Route exact path='/SignIn' render={(routeProps) => {
                return globalState.authUser ? (<Redirect to={{ pathname: '/' }} />) : (<SignIn {...routeProps} />);
            }} />
        </Switch>
    );
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
};

function AutoRouteBody(props: any) {
    const { t } = props,
        [globalState, globalActions] = useGlobal();

    useEffect(() => {
        fetch(NODE_SERVER + 'Authentication/Session/User', {
            method: 'GET',
            credentials: 'include'
        }).then((wsRes) => {
            if (wsRes.ok && wsRes.status === httpStatus.OK) {
                wsRes.json().then((data) => {
                    globalActions.setAuthUser(data);
                }).catch(() => {
                    Authentication.autoSignIn(globalActions, t);
                });
            }
            else {
                Authentication.autoSignIn(globalActions, t);
            }
        }).catch(() => {
            Authentication.autoSignIn(globalActions, t);
        });
    }, []);

    return (
        <section className='famo-body'>
            <div className={'pda-app-loader' + (globalState.authUser && !globalState.loadPage ? ' hide' : '')}>
                <div className="famo-loader"></div>
            </div>
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route path='/Inventory'>
                    <Inventory />
                </Route>
            </Switch>
        </section>
    );
}

export default (withTranslation()(Routing));