import axios from 'axios';
import express from 'express';
import Log from '../utils/log';
import { authorize } from '../utils/http';
import { checkToken } from '../utils/middleware';
import { createQueryString } from '../utils/general';
import { WEB_API } from '../utils/variablesRepo';

const router = express.Router();

router.use(checkToken);

router.get('/Inventories', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Inventories'
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Inventories/Products', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Inventories/Products' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.patch('/Inventories/Products', (req: any, res: any) => {
    axios(authorize({
        method: 'PATCH',
        url: WEB_API + 'api/Navision/Inventories/Products' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

export default router;