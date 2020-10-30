import i18n from 'i18next';
import xhrBackend from 'i18next-xhr-backend';
import { createQueryString } from './general';
import { initReactI18next } from 'react-i18next';
import { I18N_SERVER } from './variablesRepo';

i18n
    .use(xhrBackend)
    .use(initReactI18next)
    .init({
        lng: 'pt',
        fallbackLng: 'pt',
        whitelist: ['pt', 'de', 'en', 'es', 'fr'],
        debug: false,
        react: {
        },
        backend: {
            loadPath: I18N_SERVER + 'JSON/i18n/{{lng}}.json' + createQueryString({}),
            crossDomain: true
        }
    });

export default i18n;