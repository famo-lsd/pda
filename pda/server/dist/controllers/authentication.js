"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const log_1 = __importDefault(require("../utils/log"));
const querystring_1 = __importDefault(require("querystring"));
const middleware_1 = require("../utils/middleware");
const variablesRepo_1 = require("../utils/variablesRepo");
const router = express_1.default.Router();
function getAuthUser(accessToken, username) {
    return axios_1.default({
        method: 'POST',
        url: variablesRepo_1.WEB_API + 'api/Authorization/PDA',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + accessToken
        },
        data: {
            username: username
        }
    });
}
function signIn(req, res, username = null, password = null) {
    axios_1.default({
        method: 'POST',
        url: variablesRepo_1.WEB_API + 'token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring_1.default.stringify({
            grant_type: 'password',
            username: !username ? req.body.username : username,
            password: !password ? req.body.password : password
        })
    }).then((tokenRes) => {
        getAuthUser(tokenRes.data.access_token, !username ? req.body.username : username).then((userAuthRes) => {
            req.session.token = tokenRes.data;
            req.session.authUser = userAuthRes.data;
            res.send(userAuthRes.data);
        }).catch((userErr) => {
            log_1.default.promiseError(userErr);
            res.status(userErr.response ? userErr.response.status : http_status_1.default.INTERNAL_SERVER_ERROR).send();
        });
    }).catch((tokenErr) => {
        log_1.default.promiseError(tokenErr);
        res.status(tokenErr.response ? tokenErr.response.status : http_status_1.default.INTERNAL_SERVER_ERROR).send();
    });
}
router.post('/SignIn', (req, res) => {
    signIn(req, res);
});
router.get('/AutoSignIn', (req, res) => {
    signIn(req, res, 'nodejs', 'nodejs');
});
router.get('/SignOut', (req, res) => {
    const sessionID = req.sessionID;
    req.sessionStore.destroy(sessionID, (err) => {
        if (err) {
            log_1.default.error(err.message, err.stack, { method: req.method, url: req.path, statusCode: http_status_1.default.INTERNAL_SERVER_ERROR });
            res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send();
        }
        else {
            res.clearCookie(variablesRepo_1.SESSION_NAME);
            res.send();
        }
    });
});
router.get('/Session/User', middleware_1.checkToken, (req, res) => {
    const authUser = req.session.authUser;
    if (authUser) {
        res.send(authUser);
    }
    else {
        res.status(http_status_1.default.NO_CONTENT).send();
    }
});
exports.default = router;
//# sourceMappingURL=authentication.js.map