export function Authorize(req: any, token: any) {
    if (!req.headers) {
        req.headers = {};
    }

    req.headers.Authorization = 'bearer ' + token.access_token;
    return req;
}