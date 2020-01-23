"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("./controllers/authentication"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const erp_1 = __importDefault(require("./controllers/erp"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const log_1 = __importDefault(require("./controllers/log"));
const platform_1 = __importDefault(require("./controllers/platform"));
const redis_1 = __importDefault(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const v4_1 = __importDefault(require("uuid/v4"));
const variablesRepo_1 = require("./utils/variablesRepo");
const middleware_1 = require("./utils/middleware");
const redisStore = connect_redis_1.default(express_session_1.default), redisClient = redis_1.default.createClient(3035, "localhost");
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(compression_1.default());
app.use(helmet_1.default());
app.use(cors_1.default({
    origin: true,
    credentials: true
}));
app.use(express_session_1.default({
    store: new redisStore({
        client: redisClient,
        ttl: variablesRepo_1.MONTH_MS / 1000
    }),
    secret: 'famo_pda_session_sk',
    cookie: {
        maxAge: variablesRepo_1.MONTH_MS,
        httpOnly: true,
        secure: false
    },
    genid: (req) => {
        return v4_1.default();
    },
    name: variablesRepo_1.SESSION_NAME,
    saveUninitialized: true,
    resave: true
}));
app.use(middleware_1.trackRequest);
app.use('/Authentication', authentication_1.default);
app.use('/ERP', erp_1.default);
app.use('/Log', log_1.default);
app.use('/Platform', platform_1.default);
app.use(express_1.default.static(__dirname.replace('dist', 'public')));
app.listen(9070, () => {
    console.log('Start server...');
});
//# sourceMappingURL=app.js.map