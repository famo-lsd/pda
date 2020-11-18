import httpStatus from 'http-status';
import { createQueryString } from './general';
import { logHttpError, logPromiseError } from './log';
import { isAndroidApp } from './platform';
import { NODE_SERVER } from './variablesRepo';
import { TFunction } from 'i18next';

export async function autoSignIn(globalActions: any, t: TFunction) {
    await Authentication.autoSignIn()
        .then(async wsSucc => {
            if (wsSucc.ok && wsSucc.status === httpStatus.OK) {
                await wsSucc.json()
                    .then(async data => {
                        await isAndroidApp(data, globalActions, t);
                    })
                    .catch(error => {
                        logPromiseError(error);
                        alert(t('key_416'));
                    });
            }
            else {
                logHttpError(wsSucc);
                alert(t('key_306'));
            }
        })
        .catch(wsErr => {
            logPromiseError(wsErr);
            alert(t('key_416'));
        });
}

export default class Authentication {
    static signIn = async (username, password) => {
        return fetch(NODE_SERVER + 'Authentication/SignIn' + createQueryString({}), {
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
        return fetch(NODE_SERVER + 'Authentication/SignOut' + createQueryString({}), {
            method: 'GET',
            credentials: 'include'
        });
    }
}