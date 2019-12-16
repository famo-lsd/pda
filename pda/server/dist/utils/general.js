"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createQueryString(json) {
    let qs = '';
    for (const key in json) {
        const prop = json[key];
        if (prop !== 'timestamp') {
            if (Array.isArray(prop)) {
                for (let j = 0, len = prop.length; j < len; j++) {
                    qs += (qs ? '&' : '?') + key + '=' + (prop[j] === null ? '' : encodeURIComponent(prop[j]));
                }
            }
            else {
                qs += (qs ? '&' : '?') + key + '=' + (prop === null ? '' : encodeURIComponent(prop));
            }
        }
    }
    return qs;
}
exports.createQueryString = createQueryString;
;
//# sourceMappingURL=general.js.map