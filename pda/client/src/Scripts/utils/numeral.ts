import numeral from 'numeral';

window['numeral'] = numeral;

export function convertNumeralToJS(number: any) {
    return !number ? number : number.toString().replace(new RegExp('\\' + numeral.localeData().delimiters.thousands, 'g'), '').replace(new RegExp('\\' + numeral.localeData().delimiters.decimal, 'g'), '.');
}

export function isInteger(number: any) {
    return Number.isInteger(parseFloat(number));
}

export function setDecimalChar(event: any, setInput: Function) {
    if (event.keyCode === 110) {
        event.preventDefault();

        setInput(event.target.value + numeral.localeData().delimiters.decimal);
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