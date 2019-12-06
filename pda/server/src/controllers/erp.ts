import axios from 'axios';
import express from 'express';
import httpStatus from 'http-status';
import Log from '../utils/log';
import { addAuthorizationHeader } from '../utils/http';
import { WEB_API } from '../utils/variablesRepo';

const router = express.Router();

router.get('/Inventories', (req: any, res: any) => {
    axios(addAuthorizationHeader({
        method: 'GET',
        url: WEB_API + 'api/Navision/Inventories'
    }, req)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        Log.addPromiseError(wsErr);
    });
});

export default router;