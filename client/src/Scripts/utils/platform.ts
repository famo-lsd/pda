import httpStatus from 'http-status';
import { createQueryString } from './general';
import { logHttpError, logPromiseError } from './log';
import { NODE_SERVER } from './variablesRepo';
import { setMomentLocale } from './date';
import { setNumeralLocale } from './number';
import { TFunction } from 'i18next';

export async function isAndroidApp(authUser: any, globalActions: any, t: TFunction) {
    await fetch(NODE_SERVER + 'Platform/Android' + createQueryString({}), {
        method: 'GET',
        credentials: 'include'
    }).then(async result => {
        if (result.ok && result.status === httpStatus.OK) {
            await result.json().then(async data => {
                if (authUser) {
                    // moment
                    setMomentLocale(authUser.Language.Code);

                    // numeral
                    setNumeralLocale(authUser.Language.Code);
                }

                // application data
                globalActions.setAndroidApp(data);
                globalActions.setAuthUser(authUser);
            });
        }
        else {
            throw result;
        }
    }).catch(error => {
        if (error as Response) {
            logHttpError(error);
            alert(t('key_303'));
        }
        else {
            logPromiseError(error);
            alert(t('key_416'));
        }
    });
}