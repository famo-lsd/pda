import httpStatus from 'http-status';
import { NODE_SERVER } from './variablesRepo';

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

    static autoSignIn = (globalActions: any, t: any) => {
        fetch(NODE_SERVER + 'Authentication/AutoSignIn?timestamp=' + new Date().getTime(), {
            method: 'GET',
            credentials: 'include'
        }).then((wsRes) => {
            if (wsRes.ok && wsRes.status === httpStatus.OK) {
                wsRes.json().then((data) => {
                    globalActions.setAuthUser(data);
                }).catch(() => {
                    alert(t('key_306'));
                });
            }
            else {
                alert(t('key_306'));
            }
        }).catch(() => {
            alert(t('key_416'));
        });
    }

    static signOut = async () => {
        return fetch(NODE_SERVER + 'Authentication/SignOut', {
            method: 'GET',
            credentials: 'include'
        });
    }
}