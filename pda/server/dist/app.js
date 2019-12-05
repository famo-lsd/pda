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
const express_1 = __importDefault(require("express"));
const express_winston_1 = __importDefault(require("express-winston"));
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const redis_1 = __importDefault(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const v4_1 = __importDefault(require("uuid/v4"));
const winston_1 = __importDefault(require("winston"));
const variablesRepo_1 = require("./utils/variablesRepo");
const accessLogPath = path_1.default.join(variablesRepo_1.LOG_FOLDER, 'access.log'), errorLogPath = path_1.default.join(variablesRepo_1.LOG_FOLDER, 'error.log');
if (fs_1.default.existsSync(accessLogPath)) {
    fs_1.default.openSync(accessLogPath, 'w');
}
if (fs_1.default.existsSync(errorLogPath)) {
    fs_1.default.openSync(errorLogPath, 'w');
}
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
app.use(morgan_1.default('combined', { stream: fs_1.default.createWriteStream(accessLogPath, { flags: 'a' }) }));
app.use('/Authentication', authentication_1.default);
app.use(express_winston_1.default.errorLogger({
    transports: [
        new winston_1.default.transports.File({ filename: variablesRepo_1.LOG_FOLDER + 'error.log' })
    ],
    format: winston_1.default.format.combine(winston_1.default.format.json()),
    msg: '{{req.method}} | {{req.url}} | {{res.statusCode}} | {{err.message}}'
}));
app.listen(3030, () => {
    console.log('Start server...');
});
//# sourceMappingURL=app.js.map