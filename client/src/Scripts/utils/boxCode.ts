// Codes of packages (boxes) read by the PDA: the labels that the WMS picks start with "95", that prefix is not part of the code.
const BOX_CODE_PREFIX = '95';

export function removeBoxCodePrefix(code: string): string {
    if (!code || !code.startsWith(BOX_CODE_PREFIX)) {
        return code;
    }

    return code.substring(BOX_CODE_PREFIX.length);
}
