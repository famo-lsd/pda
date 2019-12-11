import express from 'express';
import Log from '../utils/log';
import { checkToken } from '../utils/middleware';

const router = express.Router();

router.use(checkToken);

router.post('/Promise/Errors', (req: any, res: any) => {
    Log.externalPromiseError(req.query.appName, req.body);
    res.send();
});

router.post('/Http/Errors', (req: any, res: any) => {
    Log.externalHttpError(req.query.appName, req.body);
    res.send();
});

export default router;