export const SS_PALLET_KEY = 'SS_PALLET';

interface SessionStoConfig {
    pallet?: boolean;
}

export class SessionStorage {
    public static clear(config?: SessionStoConfig) {
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

