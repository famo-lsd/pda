import { RDX_AUTH_USER, RDX_LOAD_PAGE } from '../utils/variablesRepo';

function setAuthUser(data: any) {
    return { type: RDX_AUTH_USER, data };
}

function setLoadPage(data: boolean) {
    return { type: RDX_LOAD_PAGE, data };
}

export { setAuthUser, setLoadPage };