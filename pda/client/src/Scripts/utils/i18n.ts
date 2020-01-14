import i18n from 'i18next';
import xhrBackend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { NODE_SERVER } from './variablesRepo';

i18n
    .use(xhrBackend)
    .use(initReactI18next)
    .init({
        lng: 'pt',
        fallbackLng: 'pt',
        whitelist: ['pt', 'en', 'es', 'fr'],
        debug: false,
        react: {
        },
        backend: {
            loadPath: NODE_SERVER + '/JSON/i18n/{{lng}}.json?timestamp=' + new Date().getTime(),
            crossDomain: true
        }
    });