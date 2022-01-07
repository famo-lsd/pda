export const LOG_APP_NAME = 'pda',
    NODE_SERVER = process.env.REACT_APP_NODE_SERVER.replace('localhost', window.location.hostname),
    NODE_TOKEN_PREFIX = 'noken',
    NODE_TOKEN_KEY = 'access_' + NODE_TOKEN_PREFIX;