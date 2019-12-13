import httpStatus from 'http-status';
import { httpErrorLog, promiseErrorLog } from './log';
import { NODE_SERVER } from './variablesRepo';

export function isAndroidApp(authUser: any, globalActions: any, t: any) {
    fetch(NODE_SERVER + 'Platform/Android?timestamp=' + new Date().getTime(), {
        method: 'GET',
        credentials: 'include'
    })
        .then((wsSucc) => {
            if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                wsSucc.json()
                    .then((data) => {
                        globalActions.setAndroidApp(data);
                        globalActions.setAuthUser(authUser);
                    })
                    .catch((error) => {
                        promiseErrorLog(error);
                        alert(t('key_416'));
                    });
            }
            else {
                httpErrorLog(wsSucc);
                alert(t('key_303'));
            }
        })
        .catch((wsErr) => {
            promiseErrorLog(wsErr);
            alert(t('key_416'));
        });
}