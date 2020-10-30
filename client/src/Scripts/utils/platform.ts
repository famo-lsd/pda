import httpStatus from 'http-status';
import { createQueryString, loadScript } from './general';
import { httpErrorLog, promiseErrorLog } from './log';
import { NODE_SERVER } from './variablesRepo';
import { setNumeralLocale } from './numeral';
import { TFunction } from 'i18next';

export function isAndroidApp(authUser: any, globalActions: any, t: TFunction) {
    fetch(NODE_SERVER + 'Platform/Android' + createQueryString({}), {
        method: 'GET',
        credentials: 'include'
    })
        .then(async wsSucc => {
            if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                await wsSucc.json()
                    .then(async data => {
                        if (authUser) {
                            // numeral
                            setNumeralLocale(authUser.Language.Code);
                            await Promise.all([loadScript(process.env.REACT_APP_CODE_URL + 'Scripts/numeral/locales/pt-pt.js?version=2'), loadScript(process.env.REACT_APP_CODE_URL + 'Scripts/numeral/locales/es-es.js?version=2'), loadScript(process.env.REACT_APP_CODE_URL + 'Scripts/numeral/locales/fr.js?version=2')]);
                        }

                        // application data
                        globalActions.setAndroidApp(data);
                        globalActions.setAuthUser(authUser);
                    })
                    .catch(error => {
                        promiseErrorLog(error);
                        alert(t('key_416'));
                    });
            }
            else {
                httpErrorLog(wsSucc);
                alert(t('key_303'));
            }
        })
        .catch(wsErr => {
            promiseErrorLog(wsErr);
            alert(t('key_416'));
        });
}