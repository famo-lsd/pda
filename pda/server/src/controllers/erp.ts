import axios from 'axios';
import express from 'express';
import Log from '../utils/log';
import { Authorize } from '../utils/http';
import { WEB_API } from '../utils/variablesRepo';

const router = express.Router();

router.get('/Inventories', (req: any, res: any) => {
    axios(Authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Inventories'
    }, req.session.token)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        Log.addPromiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Products', (req: any, res: any) => {
    axios(Authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Products?productCode=' + req.query.productCode
    }, req.session.token)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        Log.addPromiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

export default router;