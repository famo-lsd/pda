"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("./constants");
;
class Log {
    static add(errorMsg, errorStack = null, httpData = null) {
        const dateTimeFormat = 'DD/MM/YYYY HH:mm:ss.SSS', logsDir = constants_1.LOG_BASE_DIR + 'app/', logFile = logsDir + moment_1.default().format('DD_MM_YYYY') + '.log', errorMessage = 'Date: ' + moment_1.default().format(dateTimeFormat) + '\n'
            + 'Message: ' + errorMsg + '\n'
            + (errorStack ? 'Stack: ' + errorStack + '\n' : '')
            + (httpData ? ('Method: ' + httpData.method + '\n'
                + 'Url: ' + httpData.url + '\n'
                + 'StatusCode: ' + httpData.statusCode + '\n\n') : '\n');
        if (!fs_1.default.existsSync(logsDir)) {
            fs_1.default.mkdirSync(logsDir);
        }
        fs_1.default.appendFile(logFile, errorMessage, (err) => {
            if (err) {
                console.log('[' + moment_1.default().format(dateTimeFormat) + '] ' + err + '\n\n');
            }
        });
    }
}
exports.default = Log;
//# sourceMappingURL=log.js.map