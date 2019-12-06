export function addAuthorizationHeader(reqConfig: any, req: any) {
    if (!reqConfig.headers) {
        reqConfig.headers = {};
    }

    reqConfig.headers.Authorization = 'bearer ' + req.session.token.access_token;
    return reqConfig;
}