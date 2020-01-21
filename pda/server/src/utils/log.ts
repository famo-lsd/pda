import fs from 'fs';
import moment from 'moment';
import { LOG_DATETIME_FORMAT, LOG_FOLDER } from './variablesRepo';

interface HttpLogData {
    method: string;
    url: string;
    statusCode: number;
};

export default class Log {
    public static error(errorMsg: string, errorStack: string = null, httpData: HttpLogData = null, subFolder = 'errors/server/') {
        const folder = LOG_FOLDER + subFolder,
            logFile = folder + moment().format('DD_MM_YYYY') + '.log',
            message = 'Date: ' + moment().format(LOG_DATETIME_FORMAT) + '\n'
                + 'Message: ' + errorMsg + '\n'
                + (errorStack ? 'Stack: ' + errorStack + '\n' : '')
                + (httpData ? ('Method: ' + httpData.method + '\n'
                    + 'Url: ' + httpData.url + '\n'
                    + 'StatusCode: ' + httpData.statusCode + '\n\n') : '\n');

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        fs.appendFile(logFile, message, (err: any) => {
            if (err) {
                console.log('[' + moment().format(LOG_DATETIME_FORMAT) + '] ' + err + '\n\n');
            }
        });
    }

    public static promiseError(error: any, subFolder = 'errors/server/') {
        this.error(error.message,
            error.stack,
            error.request && error.response ? { method: error.request.method, url: error.request.path, statusCode: error.response.status } : null,
            subFolder);
    }

    public static externalPromiseError(appName: string, error: any) {
        this.promiseError(error, 'errors/' + appName + '/');
    }

    public static externalHttpError(appName: string, res: any) {
        const folder = LOG_FOLDER + 'errors/' + appName + '/',
            logFile = folder + moment().format('DD_MM_YYYY') + '.log',
            message = ('Date: ' + moment().format(LOG_DATETIME_FORMAT) + '\n'
                + 'Message: ' + res.statusText + ' (' + res.status + ')' + '\n'
                + 'Url: ' + res.url + '\n\n');

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        fs.appendFile(logFile, message, (err: any) => {
            if (err) {
                console.log('[' + moment().format(LOG_DATETIME_FORMAT) + '] ' + err + '\n\n');
            }
        });
    }

    public static tracking(req: any) {
        const trackingFolder = LOG_FOLDER + 'tracking/',
            logFile = trackingFolder + moment().format('DD_MM_YYYY') + '.log',
            message = moment().format(LOG_DATETIME_FORMAT) + ' '
                + req.ip.padEnd(25) + ' '
                + req.hostname.padEnd(20) + ' '
                + req.httpVersion.padEnd(5) + ' '
                + req.method.padEnd(5) + ' '
                + (req.session.authUser ? ' ' + req.session.authUser.Username : '').padEnd(32) + ' '
                + req.url
                + '\n';

        if (!fs.existsSync(trackingFolder)) {
            fs.mkdirSync(trackingFolder, { recursive: true });
        }

        fs.appendFile(logFile, message, (err: any) => {
            if (err) {
                console.log('[' + moment().format(LOG_DATETIME_FORMAT) + '] ' + err + '\n\n');
            }
        });
    }
}