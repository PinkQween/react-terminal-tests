import YRMP3 from './assets/play/1-13 Your Reality (Credits).mp3';
import YRFLAC from './assets/play/1-13 Your Reality (Credits).flac';
import SNMP3 from './assets/play/1-10 Sayo-nara.mp3';
import SNFLAC from './assets/play/1-10 Sayo-nara.flac';

const play = (args, tempGlobals) => {
    const audioFiles = {
        'yr': { mp3: YRMP3, flac: YRFLAC },
        'sn': { mp3: SNMP3, flac: SNFLAC }
    };

    const playAudio = (audioFile, speed, pitch, volume) => {
        const audioElement = new Audio();

        const song = audioElement.canPlayType("audio/flac") && audioElement.canPlayType("audio/flac") !== "no" ? audioFile.flac : audioFile.mp3;

        audioElement.src = song;
        audioElement.playbackRate = speed;
        audioElement.volume = volume;

        const detuneValue = (pitch - 1) * 100;
        audioElement.detune = detuneValue;

        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    };

    if (args.length === 0) {
        return 'Please specify a file path';
    }

    let filePath = '';
    let speed = 1.0;
    let volume = 1.0;
    let pitch = 1.0;

    // Process flags and options
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('-')) {
            // Handle flags and options
            switch (arg) {
                case '--speed':
                case '-s':
                    speed = parseFloat(args[++i]);
                    break;
                case '--volume':
                case '-v':
                    volume = parseFloat(args[++i]);
                    break;
                case '--pitch':
                case '-p':
                    pitch = parseFloat(args[++i]);
                    break;
                default:
                    console.error('Unknown flag:', arg);
            }
        } else {
            // The argument is assumed to be the file path
            filePath = args[0];
        }
    }

    if (!filePath) {
        return 'Please specify a file path';
    }

    const mapPath = (filePath) => {
        // const resolvePath = (directory, filePath) => {
        //     if (filePath.startsWith('./')) {
        //         return joinPath(directory, filePath.slice(2));
        //     } else if (filePath.startsWith('../')) {
        //         const parentDirectory = getParentDirectory(directory);
        //         return resolvePath(parentDirectory, filePath.slice(3));
        //     } else if (filePath.startsWith('/')) {
        //         return '/' + filePath.slice(1);
        //     } else {
        //         return joinPath(directory, filePath);
        //     }
        // };

        // const getParentDirectory = (directory) => {
        //     const segments = directory.split('/');
        //     segments.pop(); // Remove the last segment
        //     return segments.join('/');
        // };

        // const joinPath = (directory, filePath) => {
        //     if (directory === '/') {
        //         return `/${filePath}`;
        //     } else {
        //         return `${directory}/${filePath}`;
        //     }
        // };

        const traverse = (structure, targetFile, lastStruct) => {
            for (const items of Object.values(structure)) {
                for (const i in items) {
                    const item = (typeof i !== 'string') ? items[i] : items;
                    console.log(typeof item)
                    if (typeof item === 'string') {
                        console.log(item)
                        console.log(targetFile.split("/")[targetFile.split("/").length - 1])
                        console.log(item == '/sayo-nara.wav')
                        if (item === targetFile.split("/")[targetFile.split("/").length - 1]) {
                            console.log('yay')
                            console.log(lastStruct)
                            console.log(item)
                            const absolutePath = (lastStruct.path == "/" ? "" : lastStruct.path) + "/" + item;
                            
                            console.log(absolutePath)

                            return absolutePath;
                        }
                    } else if (typeof item === 'object') {
                        console.log(item)
                        console.log(structure)
                        const result = traverse(item, targetFile, structure);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        };

        // Find the current structure matching the current directory
        let currentStruct = null;
        const findCurrentStructure = (directory, structure) => {
            if (directory === structure.path) {
                currentStruct = structure;
                return;
            }
            for (const item of structure) {
                if (typeof item !== 'string' && item.contents) {
                    findCurrentStructure(item.path, item);
                }
            }
        };

        console.log(tempGlobals)

        findCurrentStructure(tempGlobals.currentDirectory, tempGlobals.files);

        if (!currentStruct) {
            return null; // If current directory not found, return null
        }

        // Start traversal from the current structure
        return traverse(currentStruct, filePath, currentStruct);
    };

    const absoluteFilePath = mapPath(filePath);
    console.log(absoluteFilePath)

    if (!absoluteFilePath) {
        return 'Audio file not found';
    }

    let audioFile;

    if (absoluteFilePath == "/music/your-reality.wav") {
        audioFile = audioFiles.yr; // Get the corresponding audio file from imports
    } else if (absoluteFilePath == "/sayo-nara.wav") {
        audioFile = audioFiles.sn; // Get the corresponding audio file from imports
    }

    if (!audioFile) {
        return 'Corresponding audio file not found';
    }

    // const audioFile = audioFiles["/your-reality.wav"]
    // console.log(audioFiles)

    // Play the audio file
    playAudio(audioFile, speed, pitch, volume);

    return tempGlobals;
};

export default play;
