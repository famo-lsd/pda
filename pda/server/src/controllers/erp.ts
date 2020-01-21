import axios from 'axios';
import express from 'express';
import Log from '../utils/log';
import { authorize } from '../utils/http';
import { checkToken } from '../utils/middleware';
import { createQueryString } from '../utils/general';
import { WEB_API } from '../utils/variablesRepo';

const router = express.Router();

router.use(checkToken);

router.get('/Boxes', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Boxes' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Inventories', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Inventories'
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Inventories/Products', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Inventories/Products' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.patch('/Inventories/Products', (req: any, res: any) => {
    axios(authorize({
        method: 'PATCH',
        url: WEB_API + 'api/Navision/Inventories/Products' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Pallets', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Pallets' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Pallets/Boxes', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Pallets/Boxes' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.put('/Pallets/Boxes', (req: any, res: any) => {
    axios(authorize({
        method: 'PUT',
        url: WEB_API + 'api/Navision/Pallets/Boxes' + createQueryString(req.query),
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(req.body)
    }, req.session.token)).then((wsSucc: any) => {
        res.send({ palletID: wsSucc.data });
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.post('/Pallets/Close', (req: any, res: any) => {
    axios(authorize({
        method: 'POST',
        url: WEB_API + 'api/Navision/Pallets/Close' + createQueryString(req.query),
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(req.body)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.post('/Pallets/Reopen', (req: any, res: any) => {
    axios(authorize({
        method: 'POST',
        url: WEB_API + 'api/Navision/Pallets/Reopen' + createQueryString(req.query),
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(req.body)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

router.get('/Shipments/Boxes', (req: any, res: any) => {
    axios(authorize({
        method: 'GET',
        url: WEB_API + 'api/Navision/Shipments/Boxes' + createQueryString(req.query)
    }, req.session.token)).then((wsSucc: any) => {
        res.send(wsSucc.data);
    }).catch((wsErr: any) => {
        Log.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});

export default router;