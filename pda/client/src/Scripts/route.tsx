import Authentication from './utils/authentication';
import Home from './pages/home';
import Inventory from './pages/inventory';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SignIn from './pages/signIn';
import { BrowserRouter, HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useGlobal } from './utils/globalHooks';
import '../Content/style.css';

interface AutoRouteBodyState {
    isAuthenticated: boolean;
}

export default function Routing() {
    if (!(window as any).cordova) {
        return (
            <BrowserRouter>
                <AutoRouteBody />
            </BrowserRouter>
        );
    }
    else {
        return (
            <HashRouter>
                <AutoRouteBody />
            </HashRouter>
        );
    }
}

function RouteBody() {
    const [globalState, ] = useGlobal();

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
    const [globalState, ] = useGlobal();

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

function AutoRouteBody() {
    const [globalState, globalActions] = useGlobal();

    useEffect(() => {
        Authentication.autoSignIn().then((wsRes) => {
            wsRes.json().then((data) => {
                globalActions.setAuthUser(data);
            })
        }).catch(() => { });
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