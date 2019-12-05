import authentication from './controllers/authentication';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import expressWinston from 'express-winston';
import impFileStore from 'session-file-store';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import uuidv4 from 'uuid/v4';
import winston from 'winston';
import { LOG_FOLDER, MONTH_MS, SESSION_NAME } from './utils/constants';

// express
const app = express();

// session-file-store
const FileStore = impFileStore(session);

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
    store: new FileStore({
        ttl: MONTH_MS
    }),
    secret: 'famo_pda_session_sk',
    cookie: {
        maxAge: MONTH_MS,
        httpOnly: true,
        secure: false
    },
    genid: function (req) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return uuidv4();
    },
    name: SESSION_NAME,
    saveUninitialized: false,
    resave: false
}));

// morgan
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(LOG_FOLDER, 'access.log'), { flags: 'a' }) }));

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
app.listen(3001, () => {
    console.log('Iniciar o servidor...');
});