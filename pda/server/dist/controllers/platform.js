"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const variablesRepo_1 = require("../utils/variablesRepo");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
router.use(middleware_1.checkToken);
router.get('/Android', (req, res) => {
    const prop = 'x-requested-with';
    if (req.headers[prop] && req.headers[prop] === variablesRepo_1.ANDROID_APP_ID) {
        res.send(true);
    }
    else {
        res.send(false);
    }
});
exports.default = router;
//# sourceMappingURL=platform.js.map