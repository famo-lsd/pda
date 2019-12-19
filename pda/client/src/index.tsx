import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Scripts/route';

async function initApp() {
    try {
        // const sessionRes = await fetch(NODE_SERVER + 'Authentication/Session/User', {
        //     method: 'GET',
        //     credentials: 'include'
        // });

        // if (sessionRes.ok && sessionRes.status === httpStatus.OK) {
        //     store.dispatch(setAuthUser(await sessionRes.json()));
        // }

        document.getElementById('pda-footer').innerText = new Date().getFullYear() + ' © FAMO - ' + process.env.REACT_APP_NAME;
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