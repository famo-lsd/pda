"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const log_1 = __importDefault(require("../utils/log"));
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
router.use(middleware_1.checkToken);
router.post('/Promise/Errors', (req, res) => {
    log_1.default.externalPromiseError(req.query.appName, req.body);
    res.send();
});
router.post('/Http/Errors', (req, res) => {
    log_1.default.externalHttpError(req.query.appName, req.body);
    res.send();
});
exports.default = router;
//# sourceMappingURL=log.js.map