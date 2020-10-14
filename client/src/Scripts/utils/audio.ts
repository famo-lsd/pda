export default class AudioEffect {
    static error() {
        const audio: HTMLAudioElement = new Audio(process.env.REACT_APP_FILE_REP + 'PDA/Sound/error.mp3');
        audio.play();
    }
}