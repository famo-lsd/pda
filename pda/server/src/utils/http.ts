import axios from 'axios';
import querystring from 'querystring';
import { WEB_API } from '../utils/variablesRepo';

export function authorize(reqConfig: any, token: any) {
    if (!reqConfig.headers) {
        reqConfig.headers = {};
    }

    reqConfig.headers.Authorization = 'bearer ' + token.access_token;
    return reqConfig;
}

export function refreshToken(token: any) {
    return axios({
        method: 'POST',
        url: WEB_API + 'token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify({
            grant_type: 'refresh_token', // eslint-disable-line @typescript-eslint/camelcase
            refresh_token: token.refresh_token // eslint-disable-line @typescript-eslint/camelcase
        })
    });
}