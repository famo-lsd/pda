export const ANDROID_APP_ID = 'famo.pda',
    LOG_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS',
    LOG_FOLDER = __dirname.replace('dist\\utils', 'log\\'),
    MONTH_MS = 2592000000,
    SESSION_NAME = 'PDA_AUTH',
    WEB_API = process.env.NODE_ENV === 'production' ? 'http://dionisio.famo.pt:9060/FAMO.WebAPI/' : 'http://localhost/FAMO.WebAPI/';