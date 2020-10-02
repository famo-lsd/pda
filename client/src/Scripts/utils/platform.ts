import httpStatus from 'http-status';
import { createQueryString } from './general';
import { httpErrorLog, promiseErrorLog } from './log';
import { NODE_SERVER } from './variablesRepo';
import { setNumeralLocale } from './numeral';

export function isAndroidApp(authUser: any, globalActions: any, t: any) {
    fetch(NODE_SERVER + 'Platform/Android' + createQueryString({}), {
        method: 'GET',
        credentials: 'include'
    })
        .then(async wsSucc => {
            if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                await wsSucc.json()
                    .then(data => {
                        setNumeralLocale(authUser.Language.Code);
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