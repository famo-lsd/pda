import moment from 'moment';

// locales
import 'moment/locale/pt';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';

window['moment'] = moment;

export function setMomentLocale(code: string) {
    switch (code) {
        case 'POR':
            moment.locale('pt');
            break;
        case 'DEU':
            moment.locale('de');
            break;
        case 'ENG':
            moment.locale('en');
            break;
        case 'ESP':
            moment.locale('es');
            break;
        case 'FRA':
            moment.locale('fr');
            break;
    }
}