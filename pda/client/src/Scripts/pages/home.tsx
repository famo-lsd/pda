import Authentication from '../utils/authentication';
import React from 'react';
import PropTypes from 'prop-types';
import store from '../redux/store';
import { setAuthUser } from '../redux/actions';
import { withRouter } from 'react-router-dom';

// #region interface
interface HomeProps {
    history: any;
}
// #endregion

// #region class
class Home extends React.Component<HomeProps, any> {
    handleSignOut = async () => {
        const signOutRes = await Authentication.signOut(),
            { history } = this.props;

        if (signOutRes.ok) {
            store.dispatch(setAuthUser(null));
            history.push('/SignIn');
        }
    }

    render() {
        console.log(this.props);

        return (
            <React.Fragment>
                <h1>Página inicial</h1>
                <button onClick={this.handleSignOut} style={{ marginTop: '50px' }}>Click</button>
            </React.Fragment>
        );
    }
}
// #endregion

export default withRouter(Home);