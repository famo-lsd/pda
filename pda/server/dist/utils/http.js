"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const variablesRepo_1 = require("../utils/variablesRepo");
function authorize(reqConfig, token) {
    if (!reqConfig.headers) {
        reqConfig.headers = {};
    }
    reqConfig.headers.Authorization = 'bearer ' + token.access_token;
    return reqConfig;
}
exports.authorize = authorize;
function refreshToken(token) {
    return axios_1.default({
        method: 'POST',
        url: variablesRepo_1.WEB_API + 'token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring_1.default.stringify({
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token
        })
    });
}
exports.refreshToken = refreshToken;
//# sourceMappingURL=http.js.map