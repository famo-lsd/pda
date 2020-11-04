import httpStatus from 'http-status';
import { createQueryString } from './general';
import { httpErrorLog, promiseErrorLog } from './log';
import { NODE_SERVER } from './variablesRepo';
import { setMomentLocale } from './date';
import { setNumeralLocale } from './number';
import { TFunction } from 'i18next';

export async function isAndroidApp(authUser: any, globalActions: any, t: TFunction) {
    await fetch(NODE_SERVER + 'Platform/Android' + createQueryString({}), {
        method: 'GET',
        credentials: 'include'
    })
        .then(async wsSucc => {
            if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                await wsSucc.json()
                    .then(async data => {
                        if (authUser) {
                            // moment
                            setMomentLocale(authUser.Language.Code);

                            // numeral
                            setNumeralLocale(authUser.Language.Code);
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