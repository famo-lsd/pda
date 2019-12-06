import { RDX_AUTH_USER, RDX_LOAD_PAGE } from '../utils/variablesRepo';

const initState = {
    authUser: null,
    loadPage: false
};

export default function reducer(state = initState, action) {
    const copyState = { ...state };

    switch (action.type) {
        case RDX_AUTH_USER:
            copyState.authUser = action.data;
            break;
        case RDX_LOAD_PAGE:
            copyState.loadPage = action.data;
            break;
        default:
            break;
    }

    return copyState;
} 