import 'react-app-polyfill/ie11';
import "react-app-polyfill/stable";
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Routing from './Scripts/route';
import { AppLoader } from './Scripts/components/elements/loader';

async function initApp() {
    try {
        document.getElementById('pda-footer').innerText = new Date().getFullYear() + ' © FAMO - ' + process.env.REACT_APP_NAME;
        ReactDOM.render(<Suspense fallback={<AppLoader hide={true} />}><Routing /></Suspense>, document.getElementById('root'));
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