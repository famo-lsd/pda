"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const variablesRepo_1 = require("./variablesRepo");
;
class Log {
    static error(errorMsg, errorStack = null, httpData = null, subFolder = 'errors/server/') {
        const folder = variablesRepo_1.LOG_FOLDER + subFolder, logFile = folder + moment_1.default().format('DD_MM_YYYY') + '.log', message = 'Date: ' + moment_1.default().format(variablesRepo_1.LOG_DATETIME_FORMAT) + '\n'
            + 'Message: ' + errorMsg + '\n'
            + (errorStack ? 'Stack: ' + errorStack + '\n' : '')
            + (httpData ? ('Method: ' + httpData.method + '\n'
                + 'Url: ' + httpData.url + '\n'
                + 'StatusCode: ' + httpData.statusCode + '\n\n') : '\n');
        if (!fs_1.default.existsSync(folder)) {
            fs_1.default.mkdirSync(folder, { recursive: true });
        }
        fs_1.default.appendFile(logFile, message, (err) => {
            if (err) {
                console.log('[' + moment_1.default().format(variablesRepo_1.LOG_DATETIME_FORMAT) + '] ' + err + '\n\n');
            }
        });
    }
    static promiseError(error, subFolder = 'errors/server/') {
        this.error(error.message, error.stack, error.request && error.response ? { method: error.request.method, url: error.request.path, statusCode: error.response.status } : null, subFolder);
    }
    static externalPromiseError(appName, error) {
        this.promiseError(error, 'errors/' + appName + '/');
    }
    static externalHttpError(appName, res) {
        const folder = variablesRepo_1.LOG_FOLDER + 'errors/' + appName + '/', logFile = folder + moment_1.default().format('DD_MM_YYYY') + '.log', message = ('Date: ' + moment_1.default().format(variablesRepo_1.LOG_DATETIME_FORMAT) + '\n'
            + 'Message: ' + res.statusText + ' (' + res.status + ')' + '\n'
            + 'Url: ' + res.url + '\n\n');
        if (!fs_1.default.existsSync(folder)) {
            fs_1.default.mkdirSync(folder, { recursive: true });
        }
        fs_1.default.appendFile(logFile, message, (err) => {
            if (err) {
                console.log('[' + moment_1.default().format(variablesRepo_1.LOG_DATETIME_FORMAT) + '] ' + err + '\n\n');
            }
        });
    }
    static tracking(req) {
        const trackingFolder = variablesRepo_1.LOG_FOLDER + 'tracking/', logFile = trackingFolder + moment_1.default().format('DD_MM_YYYY') + '.log', message = moment_1.default().format(variablesRepo_1.LOG_DATETIME_FORMAT) + ' '
            + req.ip.padEnd(25) + ' '
            + req.hostname.padEnd(20) + ' '
            + req.httpVersion.padEnd(5) + ' '
            + req.method.padEnd(5) + ' '
            + (req.session.authUser ? ' ' + req.session.authUser.Username : '').padEnd(32) + ' '
            + req.url
            + '\n';
        if (!fs_1.default.existsSync(trackingFolder)) {
            fs_1.default.mkdirSync(trackingFolder, { recursive: true });
        }
        fs_1.default.appendFile(logFile, message, (err) => {
            if (err) {
                console.log('[' + moment_1.default().format(variablesRepo_1.LOG_DATETIME_FORMAT) + '] ' + err + '\n\n');
            }
        });
    }
}
exports.default = Log;
//# sourceMappingURL=log.js.map