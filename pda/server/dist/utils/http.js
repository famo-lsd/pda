"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addAuthorizationHeader(reqConfig, req) {
    if (!reqConfig.headers) {
        reqConfig.headers = {};
    }
    reqConfig.headers.Authorization = 'bearer ' + req.session.token.access_token;
    return reqConfig;
}
exports.addAuthorizationHeader = addAuthorizationHeader;
//# sourceMappingURL=http.js.map