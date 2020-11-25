export const SS_PALLET_KEY = 'SS_PALLET';

interface SessionStorageConfig {
    pallet?: boolean;
}

export class SessionStorage {
    public static clear(config?: SessionStorageConfig) {
        if (!config) {
            window.sessionStorage.clear();
        }
        else {
            if (!config.pallet) {
                window.sessionStorage.removeItem(SS_PALLET_KEY);
            }
        }
    }
}