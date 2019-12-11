import axios from 'axios';
import express from 'express';
import Log from '../utils/log';
import { authorize } from '../utils/http';
import { checkToken } from '../utils/middleware';
import { WEB_API } from '../utils/variablesRepo';

const router = express.Router();

router.use(checkToken);

router.get('/Inventories', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Inventories'
    }, req.session.token)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Products', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Products?productCode=' + req.query.productCode
    }, req.session.token)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

export default router;