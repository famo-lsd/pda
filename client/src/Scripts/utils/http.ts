import { NODE_TOKEN_KEY, NODE_TOKEN_PREFIX } from "./variablesRepo";

export default class Http {
    public static addAuthorizationHeader(config: any): any {
        const noken = window.localStorage.getItem(NODE_TOKEN_KEY);

        if (noken) {
            if (!config.headers) {
                config.headers = {};
            }

            config.headers.Authorization = NODE_TOKEN_PREFIX + ' ' + noken;
        }

        return config;
    }
}