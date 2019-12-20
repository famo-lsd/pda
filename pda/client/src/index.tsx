import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Scripts/route';

async function initApp() {
    try {
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