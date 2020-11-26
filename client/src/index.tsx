import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './Scripts/utils/i18n';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Routing from './Scripts/route';
import { AppLoader } from './Scripts/components/elements/loader';

async function initApp() {
    try {
        document.getElementById('pda-footer').innerText = new Date().getFullYear() + ' © FAMO - ' + process.env.REACT_APP_NAME;
        ReactDOM.render(<Suspense fallback={<AppLoader hide={false} />}><Routing /></Suspense>, document.getElementById('root'));
    }
    catch (err) {
        alert('Ouch!! Restart app!');
    }
}

if (!(window as any).cordova) {
    initApp();
}
else {
    document.addEventListener('deviceready', initApp, false);
}