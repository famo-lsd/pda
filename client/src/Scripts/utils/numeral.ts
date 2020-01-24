import numeral from 'numeral';

window['numeral'] = numeral;

export function convertNumeralToJS(number: any) {
    return !number ? number : number.toString().replace(new RegExp('\\' + numeral.localeData().delimiters.thousands, 'g'), '').replace(new RegExp('\\' + numeral.localeData().delimiters.decimal, 'g'), '.');
}

export function isInteger(number: any) {
    return Number.isInteger(parseFloat(number));
}

export async function setDecimalDelimiter(event: any, input: React.RefObject<any>) {
    const cursorPos = input.current.selectionStart,
        inputVal = input.current.value;

    if (event.keyCode === 110) {
        event.preventDefault();

        input.current.value = inputVal.substr(0, cursorPos) + numeral.localeData().delimiters.decimal + inputVal.substr(cursorPos, inputVal.length - 1);
    }
}

export function setNumeralLocale(code: string) {
    switch (code) {
        case 'POR':
            numeral.locale('pt-pt');
            break;
        case 'ENG':
            numeral.locale('en');
            break;
        case 'ESP':
            numeral.locale('es-es');
            break;
        case 'FRA':
            numeral.locale('fr');
            break;
    }
}