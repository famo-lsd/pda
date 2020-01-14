"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const log_1 = __importDefault(require("../utils/log"));
const http_1 = require("../utils/http");
const middleware_1 = require("../utils/middleware");
const general_1 = require("../utils/general");
const variablesRepo_1 = require("../utils/variablesRepo");
const router = express_1.default.Router();
router.use(middleware_1.checkToken);
router.get('/Boxes', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Boxes' + general_1.createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.get('/Inventories', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Inventories'
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.get('/Inventories/Products', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Inventories/Products' + general_1.createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.patch('/Inventories/Products', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'PATCH',
        url: variablesRepo_1.WEB_API + 'api/Navision/Inventories/Products' + general_1.createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.get('/Pallets', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Pallets' + general_1.createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.get('/Pallets/Boxes', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Pallets/Boxes' + general_1.createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.put('/Pallets/Boxes', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'PUT',
        url: variablesRepo_1.WEB_API + 'api/Navision/Pallets/Boxes' + general_1.createQueryString(req.query),
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(req.body)
    }, req.session.token)).then((wsSucc) => {
        res.send({ palletID: wsSucc.data });
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.post('/Pallets/Close', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'POST',
        url: variablesRepo_1.WEB_API + 'api/Navision/Pallets/Close' + general_1.createQueryString(req.query),
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(req.body)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.post('/Pallets/Reopen', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'POST',
        url: variablesRepo_1.WEB_API + 'api/Navision/Pallets/Reopen' + general_1.createQueryString(req.query),
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(req.body)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.get('/Shipments/Boxes', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Shipments/Boxes' + general_1.createQueryString(req.query)
    }, req.session.token)).then((wsSucc) => {
        res.send(wsSucc.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
exports.default = router;
//# sourceMappingURL=erp.js.map