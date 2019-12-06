import Authentication from './utils/authentication';
import Home from './pages/home';
import Inventory from './pages/inventory';
import React from 'react';
import PropTypes from 'prop-types';
import SignIn from './pages/signIn';
import store from './redux/store';
import { BrowserRouter, HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import { setAuthUser } from './redux/actions';
import '../Content/style.css';

interface AutoRouteBodyState {
    isAuthenticated: boolean;
}

export default class Routing extends React.Component<any, any> {
    render() {
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
}

function RouteBody() {
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

class AutoRouteBody extends React.Component<any, AutoRouteBodyState>{
    constructor(props: any) {
        super(props);

        this.state = {
            isAuthenticated: false
        };
    }

    componentDidMount() {
        Authentication.autoSignIn().then((wsRes) => {
            this.setState({ isAuthenticated: true });
            store.dispatch(setAuthUser(wsRes.json()));
        }).catch(() => { });
    }

    render() {
        const { loadPage } = store.getState(),
            body = !this.state.isAuthenticated || loadPage ?
                (<div className="pda-app-loader">
                    <div className="famo-loader"></div>
                </div>) :
                (<Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/Inventory">
                        <Inventory />
                    </Route>
                </Switch>);

        return (<section className="famo-body">
            {body}
        </section>);
    }
}