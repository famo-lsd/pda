import moment from 'moment';

//tests
import 'moment/locale/pt';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';

window['moment'] = moment;

// export function setMomentLocale(code: string)
// {
//     switch (code) {
//         case 'POR':
//             moment.locale('pt-pt');
//             break;
//         case 'DEU':
//             numeral.locale('de');
//             break;
//         case 'ENG':
//             numeral.locale('en');
//             break;
//         case 'ESP':
//             numeral.locale('es-es');
//             break;
//         case 'FRA':
//             numeral.locale('fr');
//             break;
//     }
// }