"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const log_1 = __importDefault(require("../utils/log"));
const http_1 = require("../utils/http");
const variablesRepo_1 = require("../utils/variablesRepo");
const router = express_1.default.Router();
router.get('/Inventories', (req, res) => {
    axios_1.default(http_1.addAuthorizationHeader({
        method: 'GET',
        url: variablesRepo_1.WEB_API + 'api/Navision/Inventories'
    }, req)).then((wsRes) => {
        res.send(wsRes.data);
    }).catch((wsErr) => {
        log_1.default.addPromiseError(wsErr);
    });
});
exports.default = router;
//# sourceMappingURL=erp.js.map