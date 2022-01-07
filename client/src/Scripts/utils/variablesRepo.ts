export const LOG_APP_NAME = 'pda',
    NODE_SERVER = process.env.REACT_APP_NODE_SERVER.indexOf('localhost') === -1 ? process.env.REACT_APP_NODE_SERVER.substring(0, process.env.REACT_APP_NODE_SERVER.length - 1) : process.env.REACT_APP_NODE_SERVER.replace('localhost', window.location.hostname),
    NODE_TOKEN_PREFIX = 'noken',
    NODE_TOKEN_KEY = 'access_' + NODE_TOKEN_PREFIX;