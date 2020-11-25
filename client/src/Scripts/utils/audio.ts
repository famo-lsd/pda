export default class AudioEffect {
    public static error() {
        new Audio(process.env.REACT_APP_FILE_REP + 'PDA/Sound/error.mp3').play();
    }
}