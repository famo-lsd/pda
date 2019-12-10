"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Authorize(req, token) {
    if (!req.headers) {
        req.headers = {};
    }
    req.headers.Authorization = 'bearer ' + token.access_token;
    return req;
}
exports.Authorize = Authorize;
//# sourceMappingURL=http.js.map