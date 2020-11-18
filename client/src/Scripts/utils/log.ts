import { LOG_APP_NAME, NODE_SERVER } from "./variablesRepo";

export function logHttpError(res: any) {
    fetch(NODE_SERVER + 'Log/Http/Errors?appName=' + LOG_APP_NAME + '&timestamp=' + new Date().getTime(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: res.status,
            statusText: res.statusText,
            url: res.url
        }),
        credentials: 'include'
    })
        .then(() => { })
        .catch(() => { });
}

export function logPromiseError(error: any) {
    fetch(NODE_SERVER + 'Log/Promise/Errors?appName=' + LOG_APP_NAME + '&timestamp=' + new Date().getTime(), {
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
        }),
        credentials: 'include'
    })
        .then(() => { })
        .catch(() => { });
}