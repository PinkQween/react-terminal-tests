import YRMP3 from './assets/play/1-13 Your Reality (Credits).mp3'
import YRFLAC from './assets/play/1-13 Your Reality (Credits).flac'
import sayoNaraMP3 from './assets/play/1-10 Sayo-nara.mp3'
import sayoNaraFLAC from './assets/play/1-10 Sayo-nara.flac'


const play = (args) => {
    const chooseSong = (song, audioElement) => {
        if (song == "yr") {
            // Check if the browser supports the FLAC format
            return audioElement.canPlayType("audio/flac") && audioElement.canPlayType("audio/flac") !== "no" ? YRFLAC : YRMP3;
        } else if (song == "sn") {
            // Check if the browser supports the FLAC format
            return audioElement.canPlayType("audio/flac") && audioElement.canPlayType("audio/flac") !== "no" ? sayoNaraFLAC : sayoNaraMP3;
        }

        return undefined;
    }

    const playAudio = () => {
        const audioElement = new Audio();

        // Default playback parameters
        let speed = 1.0; // Normal speed
        let volume = 1.0; // Full volume
        let pitch = 1.0;
        let song;

        // Parse flags and options from args
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            // Check for flags
            if (arg.startsWith('-')) {
                // Handle flags
                switch (arg) {
                    case '--speed':
                        speed = parseFloat(args[i + 1]);
                        i++; // Skip the next argument since it's the value for the flag
                        break;
                    case '-s':
                        speed = parseFloat(args[i + 1]);
                        i++; // Skip the next argument since it's the value for the flag
                        break;
                    case '--volume':
                        volume = parseFloat(args[i + 1]);
                        i++; // Skip the next argument since it's the value for the flag
                        break;
                    case '-v':
                        volume = parseFloat(args[i + 1]);
                        i++; // Skip the next argument since it's the value for the flag
                        break;
                    case '--pitch':
                        pitch = parseFloat(args[i + 1]);
                        i++; // Skip the next argument since it's the value for the flag
                        break;
                    case '-p':
                        pitch = parseFloat(args[i + 1]);
                        i++; // Skip the next argument since it's the value for the flag
                        break;
                    // Add more flags as needed
                    default:
                        console.error('Unknown flag:', arg);
                }
            } else {
                switch (arg) {
                    case './your-reality.wav':
                        song = chooseSong('yr', audioElement);
                        break
                    case 'your-reality.wav':
                        song = chooseSong('yr', audioElement);
                        break
                    case './sayo-nara.wav':
                        song = chooseSong('sn', audioElement);
                        break
                    case 'sayo-nara.wav':
                        song = chooseSong('sn', audioElement);
                        break
                    default:
                        return 'Please specify audio file'
                }
            }
        }

        if (!song) {
            return 'Please specify audio file'
        }

        audioElement.src = song;

        // Adjust playback speed
        audioElement.playbackRate = speed;

        // Adjust pitch
        const detuneValue = (pitch - 1) * 100;
        audioElement.detune = detuneValue;

        audioElement.volume = volume;

        // Start playing the audio
        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });

        return ''
    };

    return playAudio(); // Return an empty string as required
};

export default play;