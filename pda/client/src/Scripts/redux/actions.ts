import { SET_AUTH_USER } from '../utils/variablesRepo';

function setAuthUser(data) {
    return { type: SET_AUTH_USER, data };
}

export { setAuthUser };