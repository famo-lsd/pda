import Home from './pages/home';
import React from 'react';
import PropTypes from 'prop-types';
import SignIn from './pages/signIn';
import store from './redux/store';
import { BrowserRouter, HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import Authentication from './utils/authentication';
import { setAuthUser } from './redux/actions';

export default class Routing extends React.Component<any, any> {
    render() {
        if (!(window as any).cordova) {
            return (
                <BrowserRouter>
                    <AutoRoutingBody />
                </BrowserRouter>
            );
        }
        else {
            return (
                <HashRouter>
                    <AutoRoutingBody />
                </HashRouter>
            );
        }
    }
}

function RoutingBody() {
    const { authUser } = store.getState();

    return (
        <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/SignIn" render={(routeProps) => {
                return authUser ? (<Redirect to={{ pathname: "/" }} />) : (<SignIn {...routeProps} />);
            }} />
        </Switch>
    );
}

async function AutoRoutingBody() {
   const userAuthRes = Authentication.autoSignIn();
   
   .then((userAuthRes) => {
        store.dispatch(setAuthUser(userAuthRes.json()));

        return (<Route exact path="/">
            <Home />
        </Route>);
    }).catch(() => { });
}


function PrivateRoute({ component: Component, ...rest }) {
    const { authUser } = store.getState();

    return (
        <Route
            render={routeProps => {
                return authUser ? (
                    <Component {...routeProps} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/SignIn",
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