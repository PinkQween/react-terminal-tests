import YRMP3 from './assets/play/1-13 Your Reality (Credits).mp3';
import YRFLAC from './assets/play/1-13 Your Reality (Credits).flac';
import SNMP3 from './assets/play/1-10 Sayo-nara.mp3';
import SNFLAC from './assets/play/1-10 Sayo-nara.flac';

const play = (args, tempGlobals) => {
    tempGlobals.exitCode = 1;
    
    console.log("args");
    console.log(args);
    
    const currentDir = tempGlobals.currentDirectory;
    const targetDir = args[0].split(',')[0];
    
    if (!targetDir) {
        tempGlobals.output = "No audo file specified"
        
        return tempGlobals
    }
    
    console.log([currentDir, targetDir]);

    const absoluteFilePath = resolvePath(currentDir, expandTilde(targetDir), tempGlobals.files);

    console.log(absoluteFilePath)
    
    if (!absoluteFilePath) {
        tempGlobals.output = "File not found";
        tempGlobals.currentDirectory = currentDir;
        return tempGlobals;
    }

    const audioFiles = {
        'your-reality': { mp3: YRMP3, flac: YRFLAC },
        'sayo-nara': { mp3: SNMP3, flac: SNFLAC }
    };

    const playAudio = (audioFile, speed, pitch, volume) => {
        const audioElement = new Audio();

        const song = audioElement.canPlayType("audio/flac") && audioElement.canPlayType("audio/flac") !== "no" ? audioFile.flac : audioFile.mp3;

        audioElement.src = song;
        audioElement.playbackRate = speed;
        audioElement.volume = volume;

        // detune is not a property of Audio, need Web Audio API for detune
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioElement);
        const gainNode = audioContext.createGain();
        const biquadFilter = audioContext.createBiquadFilter();

        biquadFilter.type = "allpass";
        biquadFilter.detune.value = (pitch - 1) * 100;

        source.connect(biquadFilter);
        biquadFilter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    };

    if (args.length === 0) {
        tempGlobals.output = "Please specify audio file";
        return tempGlobals;
    }

    let speed = 1.0;
    let volume = 1.0;
    let pitch = 1.0;
    
    const actuatArgs = args[0].split(',')

    // Process flags and options
    for (let i = 0; i < actuatArgs.length; i++) {
        const arg = actuatArgs[i];
        if (arg.startsWith('-')) {
            switch (arg) {
                case '--speed':
                case '-s':
                    speed = parseFloat(actuatArgs[++i]);
                    break;
                case '--volume':
                case '-v':
                    volume = parseFloat(actuatArgs[++i]);
                    break;
                case '--pitch':
                case '-p':
                    pitch = parseFloat(actuatArgs[++i]);
                    break;
                default:
                    console.error('Unknown flag:', arg);
            }
        }
    }

    let audioFile;

    if (absoluteFilePath == '/music/your-reality.wav') {
        audioFile = audioFiles['your-reality'];
    } else if (absoluteFilePath == '/sayo-nara.wav') {
        audioFile = audioFiles['sayo-nara'];
    }

    if (!audioFile) {
        tempGlobals.output = 'Corresponding audio file not found';
        return tempGlobals;
    }

    console.log(speed);
    
    playAudio(audioFile, speed, pitch, volume);

    tempGlobals.exitCode = 0;
    tempGlobals.currentDirectory = currentDir;

    return tempGlobals;
};

export default play;

const resolvePath = (currentDir, path, root) => {
    const parts = path.split('/');
    const currentParts = currentDir.split('/').filter(Boolean);

    for (const part of parts) {
        if (part === '..') {
            if (currentParts.length > 0) {
                currentParts.pop();
            }
        } else if (part !== '.' && part !== '') {
            currentParts.push(part);
        }
    }

    const constResolvedPath = '/' + currentParts.join('/');
    console.log(constResolvedPath);
    
    return constResolvedPath;
    
    return findCurrentStructure(constResolvedPath, root);
};

const findCurrentStructure = (directory, structure) => {
    const parts = directory.split('/').filter(Boolean);
    let currentStructure = structure;

    for (const part of parts) {
        if (!currentStructure || !currentStructure.contents) return null;

        const foundItem = currentStructure.contents.find(item => item.name === part);
        if (!foundItem || typeof foundItem !== 'object') return null;

        currentStructure = foundItem;
    }

    return currentStructure;
};

const expandTilde = (path) => {
    return path.replace(/^~($|\/)/, '/');
};

const directoryExists = (path, root) => {
    const checkIfSegmentExists = (struct, directory) => {
        for (const item of struct.contents) {
            if (typeof item !== "string" && item.name === directory) {
                return true;
            }
        }
        return false;
    };

    let currentDir = root;
    const parts = path.split("/").filter(part => part !== '');

    for (const part of parts) {
        if (!checkIfSegmentExists(currentDir, part)) {
            return false;
        }
        const nextDir = currentDir.contents.find(item => typeof item !== "string" && item.name === part);
        currentDir = nextDir;
    }

    return true;
};
