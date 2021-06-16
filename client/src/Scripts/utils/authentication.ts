import Http from './http';
import httpStatus from 'http-status';
import Log from './log';
import { createQueryString } from './general';
import { isAndroidApp } from './platform';
import { NODE_SERVER, NODE_TOKEN_KEY } from './variablesRepo';
import { TFunction } from 'i18next';

export default class Authentication {
    public static signIn(username: string, password: string) {
        return fetch(NODE_SERVER + 'Authentication/SignIn' + createQueryString({}), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
    }

    public static async autoSignIn(globalActions: any, t: TFunction) {
        await fetch(NODE_SERVER + 'Authentication/AutoSignIn' + createQueryString({}), {
            method: 'GET'
        }).then(async result => {
            if (result.ok && result.status === httpStatus.OK) {
                await result.json().then(async data => {
                    window.localStorage.setItem(NODE_TOKEN_KEY, data.Token);
                    await isAndroidApp(data.AuthUser, globalActions, t);
                });
            }
            else {
                throw result;
            }
        }).catch(error => {
            if (error as Response) {
                Log.httpError(error);
                alert(t('key_306'));
            }
            else {
                Log.promiseError(error);
                alert(t('key_416'));
            }
        });
    }

    public static signOut() {
        return fetch(NODE_SERVER + 'Authentication/SignOut' + createQueryString({}), Http.addAuthorizationHeader({
            method: 'GET'
        }));
    }
}