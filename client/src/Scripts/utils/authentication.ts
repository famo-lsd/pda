import httpStatus from 'http-status';
import { createQueryString } from './general';
import { httpErrorLog, promiseErrorLog } from './log';
import { isAndroidApp } from './platform';
import { NODE_SERVER } from './variablesRepo';

export function autoSignIn(globalActions: any, t: any) {
    Authentication.autoSignIn()
        .then(async wsSucc => {
            if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                await wsSucc.json()
                    .then(data => {
                        isAndroidApp(data, globalActions, t);
                    })
                    .catch(error => {
                        promiseErrorLog(error);
                        alert(t('key_416'));
                    });
            }
            else {
                httpErrorLog(wsSucc);
                alert(t('key_306'));
            }
        })
        .catch(wsErr => {
            promiseErrorLog(wsErr);
            alert(t('key_416'));
        });
}

export default class Authentication {
    static signIn = async (username, password) => {
        return fetch(NODE_SERVER + 'Authentication/SignIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include'
        });
    }

    static autoSignIn = async () => {
        return fetch(NODE_SERVER + 'Authentication/AutoSignIn' + createQueryString({}), {
            method: 'GET',
            credentials: 'include'
        });
    }

    static signOut = async () => {
        return fetch(NODE_SERVER + 'Authentication/SignOut', {
            method: 'GET',
            credentials: 'include'
        });
    }
}