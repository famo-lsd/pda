import { createQueryString } from "./general";
import { LOG_APP_NAME, NODE_SERVER } from "./variablesRepo";

export default class Log {
    public static httpError(error: any) {
        fetch(NODE_SERVER + 'Log/Http/Errors' + createQueryString({
            appName: LOG_APP_NAME
        }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: error.status,
                statusText: error.statusText,
                url: error.url
            })
        }).then(() => { }).catch(() => { });
    }

    public static promiseError(error: any) {
        fetch(NODE_SERVER + 'Log/Promise/Errors' + createQueryString({
            appName: LOG_APP_NAME
        }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: error.message,
                stack: error.stack,
                request: error.request ? {
                    method: error.request.method,
                    path: error.request.path
                } : null,
                response: error.response ? {
                    status: error.response.status
                } : null
            })
        }).then(() => { }).catch(() => { });
    }
}