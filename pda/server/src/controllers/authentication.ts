import axios from 'axios';
import express from 'express';
import httpStatus from 'http-status';
import Log from '../utils/log';
import querystring from 'querystring';
import { checkToken } from '../utils/middleware';
import { SESSION_NAME, WEB_API } from '../utils/variablesRepo';

const router = express.Router();

function getAuthUser(accessToken: string, username: string) {
    return axios({
        method: 'POST',
        url: WEB_API + 'api/Authorization/PDA',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + accessToken
        },
        data: {
            username: username
        }
    });
}

function signIn(req: any, res: any, username: string = null, password: string = null) {
    axios({
        method: 'POST',
        url: WEB_API + 'token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify({
            grant_type: 'password', // eslint-disable-line @typescript-eslint/camelcase
            username: !username ? req.body.username : username,
            password: !password ? req.body.password : password
        })
    }).then((tokenRes: any) => {
        getAuthUser(tokenRes.data.access_token, !username ? req.body.username : username).then((userAuthRes: any) => {
            req.session.token = tokenRes.data;
            req.session.authUser = userAuthRes.data;

            res.send(userAuthRes.data);
        }).catch((userErr: any) => {
            Log.promiseError(userErr);
            res.status(userErr.response ? userErr.response.status : httpStatus.INTERNAL_SERVER_ERROR).send();
        });
    }).catch((tokenErr: any) => {
        Log.promiseError(tokenErr);
        res.status(tokenErr.response ? tokenErr.response.status : httpStatus.INTERNAL_SERVER_ERROR).send();
    });
}

router.post('/SignIn', (req: any, res: any) => {
    signIn(req, res);
});

router.get('/AutoSignIn', (req: any, res: any) => {
    signIn(req, res, 'nodejs', 'nodejs');
});

router.get('/SignOut', (req: any, res: any) => {
    const sessionID = req.sessionID;

    req.sessionStore.destroy(sessionID, (err: any) => {
        if (err) {
            Log.error(err.message, err.stack, { method: req.method, url: req.path, statusCode: httpStatus.INTERNAL_SERVER_ERROR });
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
        }
        else {
            res.clearCookie(SESSION_NAME);
            res.send();
        }
    });
});

router.get('/Session/User', checkToken, (req: any, res: any) => {
    const authUser = req.session.authUser;

    if (authUser) {
        res.send(authUser);
    }
    else {
        res.status(httpStatus.NO_CONTENT).send();
    }
});

export default router;