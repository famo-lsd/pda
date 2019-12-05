import authentication from './controllers/authentication';
import bodyParser from 'body-parser';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import expressWinston from 'express-winston';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import redis from 'redis';
import session from 'express-session';
import uuidv4 from 'uuid/v4';
import winston from 'winston';
import { LOG_FOLDER, MONTH_MS, SESSION_NAME } from './utils/variablesRepo';

// create log files (if not exist)
const accessLogPath = path.join(LOG_FOLDER, 'access.log'),
    errorLogPath = path.join(LOG_FOLDER, 'error.log');

if (fs.existsSync(accessLogPath)) {
    fs.openSync(accessLogPath, 'w');
}

if (fs.existsSync(errorLogPath)) {
    fs.openSync(errorLogPath, 'w');
}

// redis - session
const redisStore = connectRedis(session),
    redisClient = redis.createClient(3035, "localhost");

// express
const app = express();

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// compression
app.use(compression());

// helmet
app.use(helmet());

// cors
app.use(cors({
    origin: true,
    credentials: true
}));

// session
app.use(session({
    store: new redisStore({
        client: redisClient,
        ttl: MONTH_MS / 1000
    }),
    secret: 'famo_pda_session_sk',
    cookie: {
        maxAge: MONTH_MS,
        httpOnly: true,
        secure: false
    },
    genid: (req) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        return uuidv4();
    },
    name: SESSION_NAME,
    saveUninitialized: true,
    resave: true
}));

// morgan
app.use(morgan('combined', { stream: fs.createWriteStream(accessLogPath, { flags: 'a' }) }));

// routes
app.use('/Authentication', authentication);

// express-winston
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({ filename: LOG_FOLDER + 'error.log' })
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    msg: '{{req.method}} | {{req.url}} | {{res.statusCode}} | {{err.message}}'
}));

// start server
app.listen(3030, () => {
    console.log('Start server...');
});