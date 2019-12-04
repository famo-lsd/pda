import httpStatus from 'http-status';
import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Scripts/routing';
import store from './Scripts/redux/store';
import { NODE_SERVER } from './Scripts/utils/variablesRepo';
import { setAuthUser } from './Scripts/redux/actions';

async function initApp() {
    try {
        const sessionRes = await fetch(NODE_SERVER + 'Authentication/Session/User', {
            method: 'GET',
            credentials: 'include'
        });

        if (sessionRes.ok && sessionRes.status === httpStatus.OK) {
            store.dispatch(setAuthUser(await sessionRes.json()));
        }

        ReactDOM.render(<Routing />, document.getElementById('root'));
    }
    catch (err) {
        alert('Oops!! Liga o servidor Node.js!');
    }
}

if (!(window as any).cordova) {
    initApp();
}
else {
    document.addEventListener('deviceready', initApp, false);
}