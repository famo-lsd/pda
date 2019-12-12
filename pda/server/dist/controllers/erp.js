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
const variablesRepo_1 = require("../utils/variablesRepo");
const router = express_1.default.Router();
router.use(middleware_1.checkToken);
router.get('/Inventories', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Inventories'
    }, req.session.token)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
router.get('/Inventories/Products', (req, res) => {
    axios_1.default(http_1.authorize({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Inventories/Products?productCode=' + req.query.productCode + '&productVariantCode=' + req.query.productVariantCode + '&inventoryCode=' + req.query.inventoryCode
    }, req.session.token)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        log_1.default.promiseError(wsErr);
        res.status(wsErr.response.status).send();
    });
});
exports.default = router;
//# sourceMappingURL=erp.js.map