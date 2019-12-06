import fs from 'fs';
import moment from 'moment';
import { LOG_FOLDER } from './variablesRepo';

interface HttpLogData {
    method: string;
    url: string;
    statusCode: number;
};

class Log {
    public static addError(errorMsg: string, errorStack: string = null, httpData: HttpLogData = null) {
        const dateTimeFormat = 'DD/MM/YYYY HH:mm:ss.SSS',
            appLogFolder = LOG_FOLDER + 'app/',
            logFile = appLogFolder + moment().format('DD_MM_YYYY') + '.log',
            errorMessage = 'Date: ' + moment().format(dateTimeFormat) + '\n'
                + 'Message: ' + errorMsg + '\n'
                + (errorStack ? 'Stack: ' + errorStack + '\n' : '')
                + (httpData ? ('Method: ' + httpData.method + '\n'
                    + 'Url: ' + httpData.url + '\n'
                    + 'StatusCode: ' + httpData.statusCode + '\n\n') : '\n');

        if (!fs.existsSync(appLogFolder)) {
            fs.mkdirSync(appLogFolder);
        }

        fs.appendFile(logFile, errorMessage, (err) => {
            if (err) {
                console.log('[' + moment().format(dateTimeFormat) + '] ' + err + '\n\n');
            }
        });
    }

    public static addPromiseError(error: any) {
        Log.addError(error.message,
            error.stack,
            error.request && error.response ? { method: error.request.method, url: error.request.path, statusCode: error.response.status } : null);
    }
}

export default Log;